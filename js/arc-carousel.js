/**
 * ArcCarousel - 左侧垂直 3D 大弧度纯标签轮播组件
 * 
 * 优化重点：
 * 1. 强化左侧圆弧凸出弧度 (显著增大凸出曲率 convexX，强化视觉冲击力)
 * 2. 极简纯标签：仅保留标号、高光条与大标题，去除多余说明文本
 * 3. 点击标签直接单次过渡至目标图文，跳过中间所有过渡项触发
 * 4. 连续平滑无缝环形取模映射 (Seamless Modulo Loop)
 */
class ArcCarousel {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - 挂载标签的容器
   * @param {Array} options.items - 数据源列表
   * @param {Function} options.onSelectChange - 选中项变更回调 (newIndex, direction)
   */
  constructor(options) {
    this.container = options.container;
    this.items = options.items || [];
    this.onSelectChange = options.onSelectChange || (() => {});

    this.itemCount = this.items.length;
    this.currentPos = 0.0;
    this.targetPos = 0.0;
    this.currentIndex = 0;
    this.isAnimating = false;
    this.isTargetJumping = false; // 是否处于直接点击跳跃中（防止中间卡片被连带触发）
    this.labelElements = [];

    // 手势与拖拽状态
    this.isPointerDown = false;
    this.isDragging = false;
    this.startY = 0;
    this.lastY = 0;
    this.dragDistance = 0;
    this.velocity = 0;
    this.lastMoveTime = 0;

    // 滚轮防抖累加与时间锁
    this.wheelAccumulator = 0;
    this.wheelTimeout = null;
    this.lastWheelTime = 0;
    this.dragStartPos = 0;

    // 几何与曲率参数配置 (调整凸出幅度，精准适配左侧框选区域)
    this.config = {
      angleStepDeg: 20,        // 标签间角距
      radiusY: 420,            // 垂直半长轴分布跨度 (px)
      convexX: 75,             // 正中央向右凸出的弧度深度 (px，精准适配左侧框选区域)
      radiusZ: 280,            // Z轴纵深推进 (px)
      tiltXFactor: 0.95,       // 上下标签沿 X 轴俯仰角系数
      tiltZFactor: 1.4,        // 沿弧线切线的微倾角
      baseScale: 1.0,          // 正中标签缩放基准
      scaleDecay: 0.12,        // 沿弧线缩放衰减
      minScale: 0.55,          // 最小缩放比
      maxVisibleOffset: 3.8,   // 最大可见偏移范围
      lerpFactor: 0.082        // 物理阻尼缓动速率（沉稳优雅的高级阻尼手感）
    };

    this.init();
  }

  init() {
    this.createLabels();
    this.bindEvents();
    this.updateResponsiveMetrics();
    this.render();
  }

  /**
   * 响应式视口自适应
   */
  updateResponsiveMetrics() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    if (height < 700 || width < 768) {
      this.config.radiusY = Math.min(320, height * 0.38);
      this.config.convexX = 55;
      this.config.radiusZ = 190;
      this.config.angleStepDeg = 21;
      this.config.scaleDecay = 0.13;
    } else {
      this.config.radiusY = Math.min(460, height * 0.44);
      this.config.convexX = 75;
      this.config.radiusZ = 280;
      this.config.angleStepDeg = 20;
      this.config.scaleDecay = 0.12;
    }
  }

  /**
   * 生成极简高端的纯标签 DOM 节点 (去除了副标题说明)
   */
  createLabels() {
    this.container.innerHTML = '';
    this.labelElements = [];

    this.items.forEach((item, index) => {
      const label = document.createElement('div');
      label.className = 'arc-label-item';
      label.dataset.index = index;

      const formattedIndex = String(item.id || (index + 1)).padStart(2, '0');

      // 高端艺术画廊纯标签结构：微光细条、极细序列号与典雅标题
      label.innerHTML = `
        <div class="label-indicator-line" style="--accent: ${item.accentColor};"></div>
        <span class="label-index">${formattedIndex}</span>
        <span class="label-title">${item.title}</span>
      `;

      // 点击标签直接跳至目标项
      label.addEventListener('click', () => {
        if (window.isSplashActive) return;
        if (Math.abs(this.dragDistance) > 6) return;
        this.goToIndex(index);
      });

      this.container.appendChild(label);
      this.labelElements.push(label);
    });
  }

  /**
   * 无缝无限循环取模距离
   */
  getWrappedOffset(itemIndex, scrollPos) {
    const N = this.itemCount;
    const normalizedPos = ((scrollPos % N) + N) % N;
    let diff = itemIndex - normalizedPos;
    if (diff > N / 2) diff -= N;
    if (diff < -N / 2) diff += N;
    return diff;
  }

  /**
   * 核心 3D 空间圆弧计算与渲染
   */
  render() {
    const { angleStepDeg, radiusY, convexX, radiusZ, tiltXFactor, tiltZFactor, baseScale, scaleDecay, minScale, maxVisibleOffset } = this.config;
    const radFactor = Math.PI / 180;

    this.items.forEach((item, i) => {
      const label = this.labelElements[i];
      const offset = this.getWrappedOffset(i, this.currentPos);
      const absOffset = Math.abs(offset);

      // 超出可见范围隐藏
      if (absOffset > maxVisibleOffset) {
        label.style.opacity = '0';
        label.style.pointerEvents = 'none';
        label.style.transform = 'translate3d(0, 0, -400px) scale(0.3)';
        label.classList.remove('is-active');
        return;
      }

      // 1. 标准圆弧几何坐标：正中央 offset=0 时向右凸起 (x = convexX 达到最大)，两端 offset 增大时 cos 减小向左回收
      const angleRad = offset * angleStepDeg * radFactor;
      // 垂直主轴分布
      const y = Math.sin(angleRad) * radiusY;
      // 水平大凸弧：正中最大向右凸出，上下两端向左侧屏幕边缘收拢
      const x = Math.cos(angleRad) * convexX;

      // 2. 纯平面显示 (Planar Display)：彻底移除 3D 旋转 (rotateX=0, rotateY=0, rotateZ=0)，所有文字保持绝对水平平直，绝无任何俯仰斜角
      // 3. 动态缩放与透明度
      const scale = Math.max(minScale, baseScale - absOffset * scaleDecay);
      const opacity = Math.max(0, 1 - Math.pow(absOffset / maxVisibleOffset, 1.5));

      // 4. 层级
      const zIndex = Math.round(1000 - absOffset * 100);

      // 5. 应用纯平面平移与平滑缩放
      label.style.transform = `translate3d(${x.toFixed(2)}px, calc(-50% + ${y.toFixed(2)}px), 0px) scale(${scale.toFixed(4)})`;
      label.style.opacity = opacity.toFixed(3);
      label.style.zIndex = zIndex;
      label.style.pointerEvents = absOffset < 3.2 ? 'auto' : 'none';

      // 6. 激活状态高亮
      if (absOffset < 0.48) {
        label.classList.add('is-active');
      } else {
        label.classList.remove('is-active');
      }
    });

    // 只有在非直接跳跃模式下才触发常规滚动索引检查
    this.checkCurrentIndex();
  }

  /**
   * 检查并分发选中项变更（滚轮或拖拽滑动时）
   */
  checkCurrentIndex() {
    if (this.isTargetJumping) return;

    const normalizedTarget = Math.round(this.currentPos);
    const N = this.itemCount;
    const newIndex = ((normalizedTarget % N) + N) % N;

    if (newIndex !== this.currentIndex) {
      const prevIndex = this.currentIndex;
      let direction = this.getWrappedOffset(newIndex, prevIndex);
      direction = direction >= 0 ? 1 : -1;

      this.currentIndex = newIndex;
      this.onSelectChange(newIndex, direction);
    }
  }

  /**
   * 启动物理缓动循环
   * @param {Function} [onEnd] 动画结束回调
   */
  startAnimation(onEnd) {
    if (onEnd) {
      this.animationEndCallback = onEnd;
    }

    if (this.isAnimating) return;
    this.isAnimating = true;

    const animate = () => {
      const diff = this.targetPos - this.currentPos;
      
      if (Math.abs(diff) > 0.0008) {
        this.currentPos += diff * this.config.lerpFactor;
        this.render();
        requestAnimationFrame(animate);
      } else {
        this.currentPos = this.targetPos;
        this.render();
        this.isAnimating = false;

        if (this.animationEndCallback) {
          const cb = this.animationEndCallback;
          this.animationEndCallback = null;
          cb();
        }
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * 点击标签直接切换至目标项
   * 特别优化：单次直接触发目标项画廊切换，禁止中间各项被轮流切一遍！
   */
  goToIndex(targetIndex) {
    if (targetIndex === this.currentIndex) return;

    const currentRounded = Math.round(this.targetPos);
    const N = this.itemCount;
    const currentWrapped = ((currentRounded % N) + N) % N;
    
    // 计算最短环形步进
    let step = targetIndex - currentWrapped;
    if (step > N / 2) step -= N;
    if (step < -N / 2) step += N;

    this.targetPos = currentRounded + step;

    // 关键优化：设定标志位并立即触发一次目标项切换
    const direction = step >= 0 ? 1 : -1;
    this.currentIndex = targetIndex;
    this.isTargetJumping = true;
    this.onSelectChange(targetIndex, direction);

    this.startAnimation(() => {
      this.isTargetJumping = false;
    });
  }

  next() {
    this.targetPos = Math.round(this.targetPos) + 1;
    this.startAnimation();
  }

  prev() {
    this.targetPos = Math.round(this.targetPos) - 1;
    this.startAnimation();
  }

  /**
   * 绑定所有交互事件
   */
  bindEvents() {
    // 1. 垂直滚轮（增加物理阻尼冷却，每次只能切换一个标签）
    const handleWheel = (e) => {
      // 开屏扩散动画未结束之前，内部区域完全不响应滚动
      if (window.isSplashActive) return;
      // 网格总览打开时冻结画廊滚动
      if (window.isGridActive) return;

      e.preventDefault();

      const now = performance.now();
      // 滚轮阻尼冷却锁定 280ms，杜绝滚轮快速连续切换多个
      if (now - this.lastWheelTime < 280) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      this.wheelAccumulator += delta;

      const threshold = 45;
      if (Math.abs(this.wheelAccumulator) >= threshold) {
        const step = Math.sign(this.wheelAccumulator);
        // 严格单步递增/递减 1
        this.targetPos = Math.round(this.targetPos) + step;
        this.wheelAccumulator = 0;
        this.lastWheelTime = now;
        this.startAnimation();
      }

      clearTimeout(this.wheelTimeout);
      this.wheelTimeout = setTimeout(() => {
        this.wheelAccumulator = 0;
      }, 150);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // 2. 垂直手势拖拽（增加物理阻尼手感，严格限制每次只能滑动一个）
    const onPointerDown = (e) => {
      if (window.isSplashActive) return;

      this.isPointerDown = true;
      this.isDragging = false;
      this.startY = e.clientY;
      this.lastY = e.clientY;
      this.dragDistance = 0;
      this.velocity = 0;
      this.lastMoveTime = performance.now();
      // 锁定起始拖拽基准点（整项）
      this.dragStartPos = Math.round(this.targetPos);
    };

    const onPointerMove = (e) => {
      if (window.isSplashActive) return;
      if (!this.isPointerDown) return;

      const currentY = e.clientY;
      const deltaY = currentY - this.lastY;
      this.dragDistance = currentY - this.startY;

      if (!this.isDragging && Math.abs(this.dragDistance) > 5) {
        this.isDragging = true;
        this.container.classList.add('is-dragging');
        try {
          const dragTarget = this.container.parentElement || this.container;
          dragTarget.setPointerCapture(e.pointerId);
        } catch (err) {}
      }

      if (!this.isDragging) return;

      const now = performance.now();
      const dt = Math.max(1, now - this.lastMoveTime);
      this.velocity = deltaY / dt;
      this.lastY = currentY;
      this.lastMoveTime = now;

      // 物理阻尼与单步拉扯阻尼计算 (Damped Single Step Resistance)
      const dampingSensitivity = 0.0022;
      let offset = -this.dragDistance * dampingSensitivity;

      // 强阻尼约束：拖动距离超过 1 个单位后施加 80% 橡皮筋强阻尼衰减，阻止越过临近项
      const maxRange = 1.0;
      if (offset > maxRange) {
        offset = maxRange + (offset - maxRange) * 0.2;
      } else if (offset < -maxRange) {
        offset = -maxRange + (offset + maxRange) * 0.2;
      }

      this.targetPos = this.dragStartPos + offset;
      this.currentPos = this.targetPos;
      this.render();
    };

    const onPointerUp = (e) => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;

      if (this.isDragging) {
        this.isDragging = false;
        this.container.classList.remove('is-dragging');

        try {
          const dragTarget = this.container.parentElement || this.container;
          dragTarget.releasePointerCapture(e.pointerId);
        } catch (err) {}

        // 核心约束：每次只能滑动一个 (Strict Single Step Clamped to [-1, 0, 1])
        let step = 0;
        const dragThreshold = 35; // 35px 拖动位移阈值
        const flickThreshold = 0.28; // 快速轻甩速度阈值

        if (this.dragDistance < -dragThreshold || this.velocity < -flickThreshold) {
          // 手指上滑 -> 切换到下一项 (+1)
          step = 1;
        } else if (this.dragDistance > dragThreshold || this.velocity > flickThreshold) {
          // 手指向下滑 -> 切换到上一项 (-1)
          step = -1;
        } else {
          // 未达到触发阈值 -> 原位阻尼回弹吸附 (0)
          step = 0;
        }

        // 目标位置严格基于拖拽起点增减最多 1 个单位，绝不多跳
        this.targetPos = this.dragStartPos + step;
        this.startAnimation();
      }
    };

    const dragTarget = this.container.parentElement || this.container;
    dragTarget.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // 3. 键盘上下方向键
    window.addEventListener('keydown', (e) => {
      if (window.isSplashActive) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      }
    });

    // 4. 视口尺寸适配
    window.addEventListener('resize', () => {
      this.updateResponsiveMetrics();
      this.render();
    });
  }
}

if (typeof window !== 'undefined') {
  window.ArcCarousel = ArcCarousel;
}
