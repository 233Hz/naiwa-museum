/**
 * 奶蛙博物馆 - Splash 启幕与视差滚动揭示引擎
 * 
 * 核心逻辑：
 * 1. 博物馆标题“奶蛙博物馆”字形逐字跳跃/依次浮现入场动画
 * 2. 鼠标滚轮 / 触摸驱动滚动进度
 * 3. 开屏作为前景层整体向上滚出，露出底层真实画廊（视差滚动揭示）
 * 4. 开屏内部多层（氛围光 / 胶片颗粒 / 极细框 / 文字内容）以不同速度位移，
 *    形成纵深差速的视差效果
 * 5. 揭示未完成前画廊内部完全静止不响应滚动 (isSplashActive 状态锁)
 * 6. 右上角提供退出按钮，点击后反转视差滚动退回开屏首页
 */

(function () {
  let isSplashActive = true;
  window.isSplashActive = true; // 全局锁：通知 ArcCarousel 冻结内部滚动

  let targetProgress = 0.0;
  let currentProgress = 0.0;
  let isTicking = false;

  const splashScreen = document.getElementById('splash-screen');
  const splashTitle = document.getElementById('splash-title');
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
   * 2. 视差滚动揭示：首屏保持静止，预览页（画廊）从视口下方整体上滑覆盖首屏
   */
  function updatePortal(progress) {
    const P = Math.max(0, Math.min(1, progress));

    // 开屏完全静止，不做任何位移；仅由预览页上滑覆盖
    // 预览页从下方 (translateY 100%) 平滑上滑至铺满 (translateY 0%)，形成从下向上的揭示
    galleryPortal.style.transform = `translateY(${((1 - P) * 100).toFixed(2)}%)`;
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

    galleryPortal.classList.remove('is-locked');
    galleryPortal.style.transform = 'translateY(0)';
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
