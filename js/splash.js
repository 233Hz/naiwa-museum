/**
 * 奶蛙博物馆 - Splash 启幕与底部中心向上扩散视窗引擎
 * 
 * 核心逻辑：
 * 1. 博物馆标题“奶蛙博物馆”字形逐字跳跃/依次浮现入场动画
 * 2. 鼠标滚轮驱动展开进度
 * 3. 画面扩散中心点锁定于【屏幕底部中心 (X: 50%, Y: 100%)】
 *    从底部中心向四周及上方同步扩散放大，直至铺满整个视口
 * 4. 矩形内部实时展示目标画廊页面真实内容，扩散过程平滑连贯无跳变
 * 5. 扩散未完成前画廊内部完全静止不响应滚动 (isSplashActive 状态锁)
 * 6. 右上角提供退出按钮，点击后反转动画缩回底部中心退出至开屏首页
 */

(function () {
  let isSplashActive = true;
  window.isSplashActive = true; // 全局锁：通知 ArcCarousel 冻结内部滚动

  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let isTicking = false;

  const splashScreen = document.getElementById('splash-screen');
  const splashTitle = document.getElementById('splash-title');
  const splashSubtitle = document.getElementById('splash-subtitle');
  const splashBadge = document.querySelector('.splash-art-badge') || document.querySelector('.classical-crest') || document.querySelector('.splash-museum-badge');
  const splashHint = document.getElementById('splash-hint');
  const galleryPortal = document.getElementById('main-gallery-portal');
  const portalFrame = document.getElementById('portal-frame');
  const exitBtn = document.getElementById('btn-exit-splash');

  if (!splashScreen || !galleryPortal) return;

  // 初始锁定画廊指针交互
  galleryPortal.classList.add('is-locked');

  /**
   * 1. 标题入场动画编排：
   * 黑曜石高定暗境——典雅大气的逐字微移与金属微光呼吸渐入
   */
  function initTitleEntrance() {
    if (!splashTitle) return;
    const text = splashTitle.textContent.trim();
    const chars = text.split('');

    const html = chars.map((char, i) => {
      const delay = (0.25 + i * 0.14).toFixed(2);
      return `<span class="char-editorial-fade" style="--char-delay: ${delay}s;">${char}</span>`;
    }).join('');

    splashTitle.innerHTML = `<span class="title-editorial-group">${html}</span>`;
  }

  /**
   * 2. 更新矩形从【屏幕底部中心】向四周及上方扩散/收缩进度
   */
  function updatePortal(progress) {
    const P = Math.max(0, Math.min(1, progress));

    // 几何公式：中心点位于底部中心 (X: 50%, Y: 100%)
    // P=0 时：顶部缩进 100%，左右各缩进 50%，底部缩进 0% -> 尺寸为 0 汇聚于底部中心
    // P=1 时：顶部缩进 0%，左右各缩进 0%，底部缩进 0% -> 完整覆盖整个视口
    const insetTop = (1 - P) * 100;
    const insetX = (1 - P) * 50;
    const insetBottom = 0;
    const radiusTop = (1 - P) * 20;

    // 实时裁剪目标画廊矩形视窗
    galleryPortal.style.clipPath = `inset(${insetTop.toFixed(3)}% ${insetX.toFixed(3)}% ${insetBottom.toFixed(3)}% ${insetX.toFixed(3)}% round ${radiusTop.toFixed(1)}px ${radiusTop.toFixed(1)}px 0 0)`;

    // 同步古典金发光外框 (从底部向上升起扩展)
    if (portalFrame) {
      if (P > 0.005 && P < 0.995) {
        portalFrame.style.opacity = '1';
        portalFrame.style.top = `${insetTop.toFixed(3)}%`;
        portalFrame.style.bottom = '0%';
        portalFrame.style.left = `${insetX.toFixed(3)}%`;
        portalFrame.style.right = `${insetX.toFixed(3)}%`;
        portalFrame.style.borderRadius = `${radiusTop.toFixed(1)}px ${radiusTop.toFixed(1)}px 0 0`;
      } else {
        portalFrame.style.opacity = '0';
      }
    }

    // 开屏文字淡出与淡入
    if (splashTitle) {
      const textOpacity = Math.max(0, 1 - P * 2.2);
      const textTranslateY = -P * 40;
      const textScale = 1 + P * 0.08;
      splashTitle.style.opacity = textOpacity.toFixed(3);
      splashTitle.style.transform = `translateY(${textTranslateY.toFixed(1)}px) scale(${textScale.toFixed(3)})`;
    }

    if (splashBadge) {
      splashBadge.style.opacity = Math.max(0, 1 - P * 2.6).toFixed(3);
    }

    if (splashSubtitle) {
      splashSubtitle.style.opacity = Math.max(0, 1 - P * 2.8).toFixed(3);
    }

    if (splashHint) {
      splashHint.style.opacity = Math.max(0, 1 - P * 3.5).toFixed(3);
    }
  }

  /**
   * 3. 物理缓动插值循环
   */
  function tick() {
    const diff = targetProgress - currentProgress;

    if (Math.abs(diff) > 0.0004) {
      currentProgress += diff * 0.14;
      updatePortal(currentProgress);
      requestAnimationFrame(tick);
    } else {
      currentProgress = targetProgress;
      updatePortal(currentProgress);
      isTicking = false;

      // 展开完成 (进入画廊)
      if (currentProgress >= 0.995 && targetProgress >= 0.995) {
        finishSplash();
      }
      // 收缩完成 (退回开屏)
      else if (currentProgress <= 0.005 && targetProgress <= 0.005) {
        finishExit();
      }
    }
  }

  function requestTick() {
    if (!isTicking) {
      isTicking = true;
      requestAnimationFrame(tick);
    }
  }

  /**
   * 4. 彻底完成开屏揭示，激活画廊内部交互
   */
  function finishSplash() {
    isSplashActive = false;
    window.isSplashActive = false; // 解除全局锁：画廊滚轮正式生效

    currentProgress = 1.0;
    targetProgress = 1.0;

    galleryPortal.style.clipPath = 'none';
    galleryPortal.classList.remove('is-locked');
    splashScreen.style.display = 'none';
    if (portalFrame) portalFrame.style.display = 'none';

    window.removeEventListener('wheel', handleWheel, { passive: false });
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
  }

  /**
   * 5. 彻底完成反转退出，停在开屏首页
   */
  function finishExit() {
    currentProgress = 0.0;
    targetProgress = 0.0;
    updatePortal(0.0);
  }

  /**
   * 6. 反向退出至开屏首页 (触发从四周缩回底部的收缩动画)
   */
  function closePortal() {
    if (typeof window.closeMobileMenu === 'function') {
      window.closeMobileMenu();
    }

    isSplashActive = true;
    window.isSplashActive = true; // 重新上锁：冻结画廊滚轮

    galleryPortal.classList.add('is-locked');
    splashScreen.style.display = 'flex';
    if (portalFrame) {
      portalFrame.style.display = 'block';
      portalFrame.style.opacity = '1';
    }

    targetProgress = 0.0;

    // 重新绑定滚轮与触摸监听
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    requestTick();
  }

  /**
   * 7. 滚轮事件监听 (向下滚动推动矩形扩散)
   */
  function handleWheel(e) {
    if (!isSplashActive) return;

    e.preventDefault();
    const delta = e.deltaY;

    if (delta > 0) {
      targetProgress = Math.min(1.0, targetProgress + delta * 0.0018);
      requestTick();
    } else if (delta < 0 && targetProgress < 1.0) {
      targetProgress = Math.max(0.0, targetProgress + delta * 0.0018);
      requestTick();
    }
  }

  // 8. 移动端触摸支持
  let touchStartY = 0;
  function handleTouchStart(e) {
    if (!isSplashActive) return;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!isSplashActive) return;
    const currentY = e.touches[0].clientY;
    const deltaY = touchStartY - currentY;

    if (deltaY > 0) {
      e.preventDefault();
      targetProgress = Math.min(1.0, targetProgress + deltaY * 0.0035);
      touchStartY = currentY;
      requestTick();
    }
  }

  // 9. 点击开屏提示一键展开
  if (splashHint) {
    splashHint.addEventListener('click', () => {
      if (!isSplashActive) return;
      targetProgress = 1.0;
      requestTick();
    });
  }

  // 10. 点击右上角退出按钮反向退出至开屏首页
  if (exitBtn) {
    exitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closePortal();
    });
  }

  // 初始化执行
  initTitleEntrance();
  updatePortal(0.0);

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });

  // 对外暴露关闭接口
  window.closePortal = closePortal;
})();
