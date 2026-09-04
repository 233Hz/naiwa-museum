/**
 * 主应用控制器 - 纯粹全屏沉浸画廊与左侧圆弧纯标签联动
 * 专注全屏画布的双缓冲视差流转与图片静默预加载
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM 节点引用
  const canvasContainer = document.getElementById('fullscreen-canvas');
  const arcTrack = document.getElementById('arc-track');

  let carousel = null;
  let activeCanvasLayer = null;

  // 预加载所有网络高清图片，保证轮播切换时瞬时呈现
  GALLERY_ITEMS.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });

  /**
   * 创建黑曜石高定暗境画布层 (Obsidian Canvas Layer)
   * 包含当前名画高度模糊填充背景与中心原作悬浮装裱，以及弱网/慢网艺术加载动效
   */
  function createCanvasLayer(item) {
    const layer = document.createElement('div');
    layer.className = 'canvas-layer';

    const bgUrl = item.image ? item.image : '';

    layer.innerHTML = `
      <div class="canvas-blur-backdrop" style="background-image: url('${bgUrl}');"></div>
      <div class="canvas-ambient"></div>
      <div class="canvas-artwork-wrapper">
        <div class="canvas-artwork-frame">
          <div class="canvas-loader" aria-live="polite">
            <div class="loader-shimmer"></div>
            <div class="loader-content">
              <div class="haute-spinner" aria-hidden="true">
                <span class="spinner-ring ring-outer"></span>
                <span class="spinner-ring ring-inner"></span>
                <span class="spinner-core"></span>
              </div>
              <div class="loader-text">
                <span class="loader-badge">MUSEUM ARCHIVE</span>
                <span class="loader-title">典藏名作载入中</span>
                <span class="loader-sub">HIGH-RESOLUTION ARTWORK</span>
              </div>
            </div>
            <div class="loader-error">
              <div class="error-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div class="error-title">网络信号不佳 · 典藏未能加载</div>
              <div class="error-sub">当前网络环境较弱，请轻触下方重新载入</div>
              <button class="loader-retry-btn" type="button">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                重新尝试载入
              </button>
            </div>
          </div>
          <img class="canvas-artwork-img" src="${bgUrl}" alt="${item.title}">
        </div>
      </div>
      <div class="canvas-vignette"></div>
      <div class="canvas-grain"></div>
    `;

    const img = layer.querySelector('.canvas-artwork-img');
    const loader = layer.querySelector('.canvas-loader');
    const backdrop = layer.querySelector('.canvas-blur-backdrop');
    const retryBtn = layer.querySelector('.loader-retry-btn');

    function onImageLoaded() {
      if (loader) loader.classList.add('is-hidden');
      if (img) img.classList.add('is-loaded');
      if (backdrop) backdrop.classList.add('is-loaded');
    }

    function onImageError() {
      if (loader) {
        loader.classList.remove('is-hidden');
        loader.classList.add('is-error');
      }
      if (img) img.classList.remove('is-loaded');
    }

    if (img) {
      if (img.complete && img.naturalWidth !== 0) {
        onImageLoaded();
      } else {
        img.addEventListener('load', onImageLoaded);
        img.addEventListener('error', onImageError);
      }
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (loader) loader.classList.remove('is-error');
        if (img) {
          const originalSrc = item.image;
          img.src = '';
          setTimeout(() => {
            img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + '_t=' + Date.now();
          }, 80);
        }
      });
    }

    return layer;
  }

  // 维护正在执行退出过渡的图层集合
  const exitingLayers = new Set();

  /**
   * 安全并彻底从 DOM 清理指定的图层
   * @param {HTMLElement} layer
   */
  function removeCanvasLayer(layer) {
    if (!layer) return;
    exitingLayers.delete(layer);
    if (layer._cleanupTimer) {
      clearTimeout(layer._cleanupTimer);
      layer._cleanupTimer = null;
    }
    if (layer._onTransitionEnd) {
      layer.removeEventListener('transitionend', layer._onTransitionEnd);
      layer._onTransitionEnd = null;
    }
    if (layer.parentNode === canvasContainer) {
      canvasContainer.removeChild(layer);
    }
  }

  /**
   * 清理除当前 activeCanvasLayer 之外的所有历史图层（用于处理快速连续切换时的堆叠残留）
   */
  function pruneStaleLayers() {
    exitingLayers.forEach(layer => {
      removeCanvasLayer(layer);
    });
    Array.from(canvasContainer.children).forEach(child => {
      if (child !== activeCanvasLayer && !exitingLayers.has(child)) {
        removeCanvasLayer(child);
      }
    });
  }

  /**
   * 全屏沉浸纵向视差推入流转切换
   * @param {number} newIndex - 新项索引
   * @param {number} direction - 移动方向 (+1 向下切换，-1 向上切换)
   */
  function updateGallery(newIndex, direction = 1) {
    const item = GALLERY_ITEMS[newIndex];
    if (!item) return;

    // 1. 如果此前有快速切换积压的旧退出层，立即清理，杜绝多层重叠与残影
    pruneStaleLayers();

    // 2. 创建新画布图层
    const newLayer = createCanvasLayer(item);
    // direction > 0: 向下切换，新层从下方(100%)向上推入
    // direction < 0: 向上切换，新层从上方(-100%)向下推入
    const enterClass = direction > 0 ? 'layer-enter-from-bottom' : 'layer-enter-from-top';
    newLayer.classList.add(enterClass);
    canvasContainer.appendChild(newLayer);

    // 强制回流以保证初始推入位置生效
    void newLayer.offsetWidth;

    // 3. 激活新图层推入动画
    newLayer.classList.remove(enterClass);
    newLayer.classList.add('layer-active');

    // 4. 旧图层执行视差推离动画 (差速后退与微暗化)
    if (activeCanvasLayer) {
      const oldLayer = activeCanvasLayer;
      exitingLayers.add(oldLayer);

      const exitClass = direction > 0 ? 'layer-exit-to-top' : 'layer-exit-to-bottom';
      oldLayer.classList.remove('layer-active');
      oldLayer.classList.add(exitClass);

      // 安全清理回调
      let cleaned = false;
      const onEnd = (e) => {
        // 确保监听的是 layer 本身的 transform 过渡，防止内部子元素冒泡导致提前移除
        if (e && e.target !== oldLayer) return;
        if (cleaned) return;
        cleaned = true;
        removeCanvasLayer(oldLayer);
      };

      oldLayer._onTransitionEnd = onEnd;
      oldLayer.addEventListener('transitionend', onEnd);

      // 820ms 超时兜底（比 780ms 过渡稍长），确保即使极端情况下事件未触发也 100% 安全移除
      oldLayer._cleanupTimer = setTimeout(() => {
        if (!cleaned) {
          cleaned = true;
          removeCanvasLayer(oldLayer);
        }
      }, 820);
    }

    activeCanvasLayer = newLayer;
  }

  // 移动端侧边标签栏与菜单按钮 DOM
  const menuToggleBtn = document.getElementById('btn-menu-toggle');
  const leftDrawer = document.getElementById('left-arc-container');

  /**
   * 移动端侧边标签栏展开/隐藏控制
   */
  function openMobileMenu() {
    if (leftDrawer) leftDrawer.classList.add('is-open');
    if (menuToggleBtn) menuToggleBtn.classList.add('is-active');
  }

  function closeMobileMenu() {
    if (leftDrawer) leftDrawer.classList.remove('is-open');
    if (menuToggleBtn) menuToggleBtn.classList.remove('is-active');
  }

  function toggleMobileMenu() {
    if (leftDrawer && leftDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  window.closeMobileMenu = closeMobileMenu;
  window.openMobileMenu = openMobileMenu;

  let lastToggleTime = 0;
  function handleMenuToggle(e) {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastToggleTime < 250) return;
    lastToggleTime = now;
    toggleMobileMenu();
  }

  if (menuToggleBtn) {
    menuToggleBtn.addEventListener('click', handleMenuToggle);
    menuToggleBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleMenuToggle(e);
    });
  }

  // 渲染首屏初始全屏画布
  const initialItem = GALLERY_ITEMS[0];
  const initialLayer = createCanvasLayer(initialItem);
  initialLayer.classList.add('layer-active');
  canvasContainer.appendChild(initialLayer);
  activeCanvasLayer = initialLayer;

  // 实例化左侧垂直圆弧纯标签轮播
  carousel = new ArcCarousel({
    container: arcTrack,
    items: GALLERY_ITEMS,
    onSelectChange: (newIndex, direction) => {
      updateGallery(newIndex, direction);
      // 拖动切换后保持标签面板展开，不自动收回面板
    }
  });

  window.arcCarouselInstance = carousel;

  // ==========================================================================
  // 全部展品总览网格视图 (All-Works Grid Overview)
  // ==========================================================================
  const gridGallery = document.getElementById('grid-gallery');
  const gridGrid = document.getElementById('grid-gallery-grid');
  const gridCount = document.getElementById('grid-gallery-count');
  const gridToggleBtn = document.getElementById('btn-grid-toggle');
  const gridCloseBtn = document.getElementById('btn-grid-close');

  // 1. 动态生成全部展品卡片（原 16 幅 + 本次新增 44 幅 = 60 幅）
  function buildGridCards() {
    if (!gridGrid) return;
    gridGrid.innerHTML = '';

    GALLERY_ITEMS.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'grid-card';
      card.dataset.index = index;
      card.style.setProperty('--card-fallback', item.accentColor || '#1a1a20');

      const formattedIndex = String(item.id || (index + 1)).padStart(2, '0');

      card.innerHTML = `
        <div class="grid-card-img-wrap">
          <div class="grid-card-skeleton">
            <div class="grid-skeleton-shimmer"></div>
            <div class="grid-skeleton-spinner"></div>
          </div>
          <img class="grid-card-img" src="${item.image}" alt="${item.title}" loading="lazy">
          <div class="grid-card-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span class="grid-card-error-text">弱网载入失败</span>
            <button class="grid-card-retry-btn" type="button">点击重试</button>
          </div>
        </div>
        <div class="grid-card-meta">
          <div class="grid-card-index">${formattedIndex}</div>
          <div class="grid-card-title">${item.title}</div>
          <div class="grid-card-sub">${item.subtitle || ''}</div>
        </div>
      `;

      const imgWrap = card.querySelector('.grid-card-img-wrap');
      const img = card.querySelector('.grid-card-img');
      const retryBtn = card.querySelector('.grid-card-retry-btn');

      function handleImgLoad() {
        if (imgWrap) {
          imgWrap.classList.remove('is-error');
          imgWrap.classList.add('is-loaded');
        }
      }

      function handleImgError() {
        if (imgWrap) {
          imgWrap.classList.remove('is-loaded');
          imgWrap.classList.add('is-error');
        }
      }

      if (img) {
        if (img.complete && img.naturalWidth !== 0) {
          handleImgLoad();
        } else {
          img.addEventListener('load', handleImgLoad);
          img.addEventListener('error', handleImgError);
        }
      }

      if (retryBtn) {
        retryBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (imgWrap) {
            imgWrap.classList.remove('is-error');
          }
          if (img) {
            const originalSrc = item.image;
            img.src = '';
            setTimeout(() => {
              img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + '_t=' + Date.now();
            }, 80);
          }
        });
      }

      // 点击卡片：定位到沉浸展厅对应展品
      card.addEventListener('click', (e) => {
        if (e.target.closest('.grid-card-retry-btn')) return;
        openGrid(false);
        if (carousel && typeof carousel.goToIndex === 'function') {
          carousel.goToIndex(index);
        }
      });

      gridGrid.appendChild(card);
    });

    if (gridCount) {
      gridCount.textContent = `共 ${GALLERY_ITEMS.length} 幅典藏 · FROGS MUSEUM COLLECTION`;
    }
  }

  /**
   * 打开 / 关闭网格总览
   * @param {boolean} open - true 打开，false 关闭
   */
  function openGrid(open) {
    if (!gridGallery) return;
    window.isGridActive = !!open;

    if (open) {
      gridGallery.classList.add('is-open');
      gridGallery.setAttribute('aria-hidden', 'false');
      // 同步当前选中态到网格滚动位置（方便回看）
      if (gridGrid && carousel) {
        const active = gridGrid.querySelector(`.grid-card[data-index="${carousel.currentIndex}"]`);
        if (active) {
          active.scrollIntoView({ block: 'nearest' });
        }
      }
    } else {
      gridGallery.classList.remove('is-open');
      gridGallery.setAttribute('aria-hidden', 'true');
    }
  }

  if (gridToggleBtn) {
    gridToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.isSplashActive) return;
      openGrid(true);
    });
  }

  if (gridCloseBtn) {
    gridCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openGrid(false);
    });
  }

  // ESC 键关闭网格总览
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gridGallery && gridGallery.classList.contains('is-open')) {
      openGrid(false);
    }
  });

  buildGridCards();

  // ==========================================================================
  // 背景音乐全局开关 (Background Music Toggle)
  // ==========================================================================
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicLabel = document.getElementById('music-label');

  function setMusicPlaying(isPlaying) {
    if (!musicToggleBtn) return;
    musicToggleBtn.classList.toggle('is-playing', isPlaying);
    musicToggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    if (musicLabel) {
      musicLabel.textContent = isPlaying ? '音乐：开' : '音乐：关';
    }
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      const playPromise = bgMusic.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
          setMusicPlaying(true);
        }).catch(() => {
          // 浏览器拦截自动播放或资源异常时，保持关闭态并提示
          setMusicPlaying(false);
          if (musicLabel) musicLabel.textContent = '音乐：不可用';
        });
      } else {
        setMusicPlaying(!bgMusic.paused);
      }
    } else {
      bgMusic.pause();
      setMusicPlaying(false);
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // 音乐自然结束（理论上 loop 不会触发）时同步状态
  if (bgMusic) {
    bgMusic.addEventListener('pause', () => {
      if (!bgMusic.ended) setMusicPlaying(false);
    });
    bgMusic.addEventListener('play', () => setMusicPlaying(true));
  }


  /**
   * 移动端全屏上下滑动切换名画手势支持 (Vertical Swipe Up / Down to Switch)
   * 向上滑 (deltaY < 0)：切换至下一幅 (next)
   * 向下滑 (deltaY > 0)：切换至上一幅 (prev)
   */
  let touchStartY = 0;
  let touchStartX = 0;
  let isSwipeActive = false;
  let lastSwipeTime = 0;

  window.addEventListener('touchstart', (e) => {
    // 开屏状态或不处于画廊沉浸视图（网格总览打开）时不触发画廊切换手势
    if (window.isSplashActive || window.isGridActive) return;

    // 若触摸点在顶部控制按钮或左侧标签轨道内部，则交给自身事件处理
    if (e.target.closest('#btn-menu-toggle, #btn-exit-splash, #left-arc-container, .lux-top-left-controls, .lux-top-controls')) {
      isSwipeActive = false;
      return;
    }

    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isSwipeActive = true;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isSwipeActive || window.isSplashActive || window.isGridActive) return;

    if (e.touches.length === 1) {
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - touchStartY;
      const deltaX = currentX - touchStartX;

      // 纵向手势为主时阻止默认可能产生的弹簧/回弹效果
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    }
  }, { passive: false });

  window.addEventListener('touchend', (e) => {
    if (!isSwipeActive || window.isSplashActive || window.isGridActive) return;
    isSwipeActive = false;

    // 防抖冷却时间 350ms
    if (Date.now() - lastSwipeTime < 350) return;

    if (e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const deltaY = touch.clientY - touchStartY;
      const deltaX = touch.clientX - touchStartX;
      const absY = Math.abs(deltaY);
      const absX = Math.abs(deltaX);

      // 判定条件：纵向滑动超过 35px 且纵向为主方向
      if (absY >= 35 && absY > absX * 1.15) {
        lastSwipeTime = Date.now();
        if (deltaY < 0) {
          // 手指上滑 -> 浏览下一幅
          carousel.next();
        } else {
          // 手指下滑 -> 浏览上一幅
          carousel.prev();
        }
      }
    }
  }, { passive: true });

  // ==========================================================================
  // 全局弱网/离线感知通知 (Network Monitor Toast)
  // ==========================================================================
  function initNetworkMonitor() {
    let toast = document.getElementById('net-status-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'net-status-toast';
      toast.className = 'net-status-toast';
      document.body.appendChild(toast);
    }

    let hideTimer = null;
    function showToast(message, type = 'warning', duration = 3800) {
      if (!toast) return;
      clearTimeout(hideTimer);
      toast.className = `net-status-toast toast-${type} is-show`;
      toast.innerHTML = `<span class="toast-dot"></span><span>${message}</span>`;

      hideTimer = setTimeout(() => {
        toast.classList.remove('is-show');
      }, duration);
    }

    window.addEventListener('offline', () => {
      showToast('网络连接已断开，正展示本地典藏缓存', 'warning', 4500);
    });

    window.addEventListener('online', () => {
      showToast('网络连接已恢复，高清画作已同步', 'success', 3000);
    });

    // 智能检测 Slow 2G / 2G / 3G 弱网连接 (如果浏览器支持 Network Information API)
    if ('connection' in navigator) {
      const conn = navigator.connection;
      if (conn && (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
        showToast('检测到当前网络信号较弱，已开启典藏加载保护', 'warning', 4000);
      }
    }
  }

  initNetworkMonitor();
});
