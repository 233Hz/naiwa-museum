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
   * 包含当前名画高度模糊填充背景与中心原作悬浮装裱
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
          <img class="canvas-artwork-img" src="${bgUrl}" alt="${item.title}">
        </div>
      </div>
      <div class="canvas-vignette"></div>
      <div class="canvas-grain"></div>
    `;

    return layer;
  }

  /**
   * 全屏视差画布流转切换
   * @param {number} newIndex - 新项索引
   * @param {number} direction - 移动方向 (+1 向下，-1 向上)
   */
  function updateGallery(newIndex, direction = 1) {
    const item = GALLERY_ITEMS[newIndex];
    if (!item) return;

    // 全屏背景层双缓冲视差平滑过渡
    const newLayer = createCanvasLayer(item);
    newLayer.classList.add(direction > 0 ? 'layer-enter-down' : 'layer-enter-up');
    canvasContainer.appendChild(newLayer);

    void newLayer.offsetWidth;
    newLayer.classList.add('layer-active');

    if (activeCanvasLayer) {
      const oldLayer = activeCanvasLayer;
      oldLayer.classList.add(direction > 0 ? 'layer-exit-up' : 'layer-exit-down');
      oldLayer.classList.remove('layer-active');
      setTimeout(() => {
        if (oldLayer.parentNode === canvasContainer) {
          canvasContainer.removeChild(oldLayer);
        }
      }, 700);
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
          <img class="grid-card-img" src="${item.image}" alt="${item.title}" loading="lazy"
               onerror="this.classList.add('is-broken'); this.removeAttribute('src');">
        </div>
        <div class="grid-card-meta">
          <div class="grid-card-index">${formattedIndex}</div>
          <div class="grid-card-title">${item.title}</div>
          <div class="grid-card-sub">${item.subtitle || ''}</div>
        </div>
      `;

      // 点击卡片：定位到沉浸展厅对应展品
      card.addEventListener('click', () => {
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
});
