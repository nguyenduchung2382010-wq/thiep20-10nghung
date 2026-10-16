/**
 * THIỆP CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM 20/10
 * Pure JavaScript (ES6+), Offline-ready, No Dependencies
 */

(function () {
  'use strict';

  // --- 1. STATE MANAGEMENT ---
  const state = {
    currentScreen: 1,
    maxReachedScreen: 1,
    recipientName: '',
    flowerPlucked: false,
    soundEnabled: true,
    isVideoPlaying: false,
    isDemoPlaying: false,
    demoAnimId: null,
    audioCtx: null
  };

  // --- 2. DOM ELEMENTS CACHE ---
  const el = {
    loader: document.getElementById('initial-loader'),
    soundToggle: document.getElementById('sound-toggle'),
    soundIcon: document.querySelector('.sound-icon'),

    // Screens
    screen1: document.getElementById('screen-1'),
    screen2: document.getElementById('screen-2'),
    screen3: document.getElementById('screen-3'),
    screen4: document.getElementById('screen-4'),
    backToScreen3: document.getElementById('back-to-screen-3'),
    voteYes: document.getElementById('vote-yes'),
    voteNo: document.getElementById('vote-no'),
    voteTitle: document.getElementById('vote-title'),
    voteSubtitle: document.getElementById('vote-subtitle'),
    voteHint: document.getElementById('vote-hint'),
    voteButtons: document.getElementById('vote-buttons'),
    voteRestart: document.getElementById('vote-restart'),

    // Screen 1: Nhập tên
    nameForm: document.getElementById('name-form'),
    recipientInput: document.getElementById('recipient-name'),
    nameError: document.getElementById('name-error'),
    btnOpenGift: document.getElementById('btn-open-gift'),
    quickTags: document.querySelectorAll('.tag-btn'),

    // Screen 2: Bó hoa & Thiệp
    backToScreen1: document.getElementById('back-to-screen-1'),
    bouquetStage: document.getElementById('bouquet-stage'),
    bouquetWrapper: document.getElementById('bouquet-wrapper'),
    pullHint: document.getElementById('pull-hint'),
    pullableFlowerContainer: document.getElementById('pullable-flower-container'),
    pullableFlower: document.getElementById('pullable-flower'),
    cardStage: document.getElementById('card-stage'),
    envelope: document.getElementById('envelope'),
    envelopeFlap: document.getElementById('envelope-flap'),
    greetingLetter: document.getElementById('greeting-letter'),
    recipientNameDisplay: document.getElementById('recipient-name-display'),
    btnGoToVideo: document.getElementById('btn-go-to-video'),
    btnReplayFlower: document.getElementById('btn-replay-flower'),

    // Screen 3: Video
    backToScreen2: document.getElementById('back-to-screen-2'),
    videoNameDisplay: document.getElementById('video-name-display'),
    videoFrame: document.getElementById('video-frame'),
    video: document.getElementById('greeting-video'),
    videoPlaceholder: document.getElementById('video-placeholder'),
    videoFileInput: document.getElementById('video-file-input'),
    btnPlayDemoVideo: document.getElementById('btn-play-demo-video'),
    demoCanvas: document.getElementById('demo-video-canvas'),
    centerPlayBtn: document.getElementById('center-play-btn'),
    videoControls: document.getElementById('custom-video-controls'),
    progressContainer: document.getElementById('video-progress-container'),
    progressFill: document.getElementById('video-progress-fill'),
    ctrlPlayBtn: document.getElementById('ctrl-play-btn'),
    ctrlMuteBtn: document.getElementById('ctrl-mute-btn'),
    ctrlFullscreenBtn: document.getElementById('ctrl-fullscreen-btn'),
    timeDisplay: document.getElementById('video-time-display'),
    videoEndScreen: document.getElementById('video-end-screen'),
    endNameDisplay: document.getElementById('end-name-display'),
    btnReplayVideo: document.getElementById('btn-replay-video'),
    btnBackHome: document.getElementById('btn-back-home'),
    btnRestart: document.getElementById('btn-restart'),
    btnGoVote: document.getElementById('btn-go-vote'),

    // Progress Indicator Footer
    stepItems: document.querySelectorAll('.step-item'),
    stepLine12: document.querySelector('.line-1-2'),
    stepLine23: document.querySelector('.line-2-3'),
    stepLine34: document.querySelector('.line-3-4'),

    // Background Canvas
    petalsCanvas: document.getElementById('petals-canvas')
  };

  // --- 3. WEB AUDIO API SYNTHESIZER (100% Offline, Zero external files) ---
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        state.audioCtx = new AudioCtx();
      }
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  const sound = {
    // Tiếng chuông thanh thoát khi bấm nút
    chime: function (freq = 587.33, duration = 0.4) {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        // Fallback im lặng nếu trình duyệt chặn audio
      }
    },

    // Âm thanh huyền ảo khi rút bông hoa thành công (chuỗi nốt hạc cầm lấp lánh)
    flowerPluck: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.65);
        });
      } catch (e) {}
    },

    // Tiếng mở phong thư (sột soạt giấy và hợp âm ấm áp)
    envelopeOpen: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const chord = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.25);
        });
      } catch (e) {}
    },

    // Tiếng pháo hoa & chúc mừng khi kết thúc video
    celebrate: function () {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const fanfare = [523.25, 659.25, 783.99, 1046.50];
        fanfare.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.85);
        });
      } catch (e) {}
    }
  };

  // --- 4. PETALS & PARTICLES CANVAS BACKGROUND ---
  class PetalsAnimation {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.petals = [];
      this.burstParticles = [];
      this.maxPetals = 35;
      this.colors = [
        '#ffb3c1', '#ff758f', '#ff4d6d', '#fecdd3', '#ffe4e6', '#ffd166'
      ];
      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());
      for (let i = 0; i < this.maxPetals; i++) {
        this.petals.push(this.createPetal(true));
      }
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createPetal(initial = false) {
      return {
        x: Math.random() * this.canvas.width,
        y: initial ? Math.random() * this.canvas.height : -20,
        size: Math.random() * 12 + 8,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.2 + 0.8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        swing: Math.random() * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        opacity: Math.random() * 0.6 + 0.35,
        type: Math.random() > 0.3 ? 'petal' : 'heart'
      };
    }

    // Hiệu ứng bùng nổ cánh hoa & ánh sáng khi rút hoa hoặc hoàn thành video
    createBurst(x, y, count = 45) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 9 + 3;
        this.burstParticles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity - 2.5,
          gravity: 0.18,
          size: Math.random() * 10 + 6,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          alpha: 1,
          life: Math.random() * 40 + 45,
          maxLife: 85,
          type: Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'heart' : 'sparkle')
        });
      }
    }

    drawPetalShape(ctx, size, color, alpha) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      // Vẽ cánh hoa mềm mại
      ctx.moveTo(0, -size / 2);
      ctx.bezierCurveTo(size / 2, -size / 2, size / 2, size / 3, 0, size / 2);
      ctx.bezierCurveTo(-size / 2, size / 3, -size / 2, -size / 2, 0, -size / 2);
      ctx.fill();
      ctx.restore();
    }

    drawHeartShape(ctx, size, color, alpha) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.fill();
      ctx.restore();
    }

    drawSparkleShape(ctx, size, color, alpha) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Cánh hoa rơi liên tục
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.swing += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swing) * 0.8;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === 'heart') {
          this.drawHeartShape(this.ctx, p.size, p.color, p.opacity);
        } else {
          this.drawPetalShape(this.ctx, p.size, p.color, p.opacity);
        }
        this.ctx.restore();

        // Tái tạo khi bay ra khỏi màn hình
        if (p.y > this.canvas.height + 30 || p.x < -30 || p.x > this.canvas.width + 30) {
          this.petals[i] = this.createPetal(false);
        }
      }

      // Hạt bùng nổ (Burst Particles)
      for (let i = this.burstParticles.length - 1; i >= 0; i--) {
        const bp = this.burstParticles[i];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vy += bp.gravity;
        bp.vx *= 0.98;
        bp.rotation += bp.rotSpeed;
        bp.life--;
        bp.alpha = Math.max(0, bp.life / bp.maxLife);

        this.ctx.save();
        this.ctx.translate(bp.x, bp.y);
        this.ctx.rotate((bp.rotation * Math.PI) / 180);

        if (bp.type === 'sparkle') {
          this.drawSparkleShape(this.ctx, bp.size, '#fde047', bp.alpha);
        } else if (bp.type === 'heart') {
          this.drawHeartShape(this.ctx, bp.size, bp.color, bp.alpha);
        } else {
          this.drawPetalShape(this.ctx, bp.size, bp.color, bp.alpha);
        }
        this.ctx.restore();

        if (bp.life <= 0) {
          this.burstParticles.splice(i, 1);
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  // Khởi tạo animation cánh hoa rơi
  let petalsFX;
  if (el.petalsCanvas) {
    petalsFX = new PetalsAnimation(el.petalsCanvas);
  }

  // --- 5. ĐIỀU HƯỚNG VÀ CHUYỂN TRANG (NAVIGATION & SCREEN TRANSITIONS) ---
  function updateScreensUI(targetScreen, direction = 'next') {
    const screens = [el.screen1, el.screen2, el.screen3, el.screen4];

    screens.forEach((screen, idx) => {
      const screenNum = idx + 1;
      if (screenNum === targetScreen) {
        screen.classList.remove('exit-left', 'exit-right');
        screen.classList.add('active');
      } else if (screenNum < targetScreen) {
        screen.classList.remove('active', 'exit-right');
        screen.classList.add('exit-left');
      } else {
        screen.classList.remove('active', 'exit-left');
        screen.classList.add('exit-right');
      }
    });

    // Cập nhật tên người nhận vào các vị trí hiển thị
    const displayName = state.recipientName || 'Bạn';
    if (el.recipientNameDisplay) el.recipientNameDisplay.textContent = displayName;
    if (el.videoNameDisplay) el.videoNameDisplay.textContent = displayName;
    if (el.endNameDisplay) el.endNameDisplay.textContent = displayName;

    // Cập nhật Footer Progress Indicator
    el.stepItems.forEach((item) => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (step === targetScreen) {
        item.classList.add('active');
      } else if (step < targetScreen) {
        item.classList.add('completed');
      }
    });

    if (el.stepLine12) {
      if (targetScreen >= 2) el.stepLine12.classList.add('active');
      else el.stepLine12.classList.remove('active');
    }
    if (el.stepLine23) {
      if (targetScreen >= 3) el.stepLine23.classList.add('active');
      else el.stepLine23.classList.remove('active');
    }
    if (el.stepLine34) {
      if (targetScreen >= 4) el.stepLine34.classList.add('active');
      else el.stepLine34.classList.remove('active');
    }

    state.currentScreen = targetScreen;
    if (targetScreen > state.maxReachedScreen) {
      state.maxReachedScreen = targetScreen;
    }

    // Cuộn lên đầu màn hình nếu đang trên thiết bị di động
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToScreen(screenNumber) {
    if (screenNumber === state.currentScreen) return;
    sound.chime(659.25, 0.3); // Tiếng chime nhẹ
    updateScreensUI(screenNumber, screenNumber > state.currentScreen ? 'next' : 'prev');
  }

  // --- 6. XỬ LÝ TRANG 1: NHẬP TÊN ---
  function handleNameSubmit() {
    const rawName = el.recipientInput.value.trim();
    if (!rawName) {
      // Báo lỗi rung lắc nếu chưa nhập tên
      el.nameError.textContent = 'Hãy cho mình biết tên người nhận nhé! ✨';
      el.nameError.classList.add('show');
      el.recipientInput.classList.remove('shake');
      // Trigger reflow để kích hoạt lại animation shake
      void el.recipientInput.offsetWidth;
      el.recipientInput.classList.add('shake');
      el.recipientInput.focus();
      sound.chime(329.63, 0.25);
      return;
    }

    // Đã nhập tên hợp lệ
    el.nameError.classList.remove('show');
    state.recipientName = rawName;
    sound.chime(880, 0.4);

    // Chuyển sang Trang 2
    goToScreen(2);
  }

  // Lắng nghe sự kiện Trang 1
  if (el.nameForm) {
    el.nameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleNameSubmit();
    });
  }

  if (el.btnOpenGift) {
    el.btnOpenGift.addEventListener('click', (e) => {
      e.preventDefault();
      handleNameSubmit();
    });
  }

  if (el.recipientInput) {
    el.recipientInput.addEventListener('input', () => {
      if (el.nameError.classList.contains('show')) {
        el.nameError.classList.remove('show');
      }
    });
  }

  // Các thẻ tên gợi ý nhanh
  el.quickTags.forEach((tag) => {
    tag.addEventListener('click', () => {
      const name = tag.getAttribute('data-name');
      if (name && el.recipientInput) {
        el.recipientInput.value = name;
        el.nameError.classList.remove('show');
        sound.chime(783.99, 0.2);
        el.recipientInput.focus();
      }
    });
  });

  // Nút quay lại từ Trang 2 về Trang 1
  if (el.backToScreen1) {
    el.backToScreen1.addEventListener('click', () => {
      goToScreen(1);
    });
  }

  // Cho phép bấm vào Step Indicator để quay lại các bước đã hoàn thành
  el.stepItems.forEach((item) => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      if (step <= state.maxReachedScreen && step !== state.currentScreen) {
        goToScreen(step);
      }
    });
  });

  // --- 7. XỬ LÝ TRANG 2: TƯƠNG TÁC RÚT HOA & THIỆP MỞ RA ---
  function openGreetingCard() {
    if (state.flowerPlucked) return;
    state.flowerPlucked = true;

    // 1. Animation hoa bị rút lên
    el.pullableFlower.classList.add('plucked');
    el.pullableFlowerContainer.classList.remove('dragging');

    // 2. Âm thanh bừng sáng
    sound.flowerPluck();

    // 3. Bùng nổ hạt cánh hoa & ánh sáng
    if (petalsFX && el.pullableFlower) {
      const rect = el.pullableFlower.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 3;
      petalsFX.createBurst(centerX, centerY, 55);
    }

    // 4. Biến mất bó hoa, hiện thiệp & mở phong thư
    setTimeout(() => {
      el.bouquetStage.classList.add('fade-out');

      setTimeout(() => {
        el.bouquetStage.style.display = 'none';
        el.cardStage.classList.remove('hidden');

        // Mở nắp phong thư
        setTimeout(() => {
          el.envelope.classList.add('open');
          sound.envelopeOpen();
        }, 100);
      }, 300);
    }, 400);
  }

  function resetBouquetAndCard() {
    state.flowerPlucked = false;
    el.pullableFlower.classList.remove('plucked');
    el.pullableFlower.style.transform = '';
    el.envelope.classList.remove('open');
    el.cardStage.classList.add('hidden');
    el.bouquetStage.style.display = 'flex';
    el.bouquetStage.classList.remove('fade-out');
    sound.chime(523.25, 0.3);
  }

  // Xử lý kéo thả (Drag & Touch/Pointer) hoặc Click bông hoa
  if (el.pullableFlowerContainer && el.pullableFlower) {
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let movedDistance = 0;

    const handlePointerDown = (e) => {
      if (state.flowerPlucked) return;
      isDragging = true;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      movedDistance = 0;
      el.pullableFlowerContainer.classList.add('dragging');
      sound.chime(659.25, 0.15);
    };

    const handlePointerMove = (e) => {
      if (!isDragging || state.flowerPlucked) return;
      currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaY = currentY - startY;

      // Người dùng đang kéo hoa lên trên (deltaY âm)
      if (deltaY < 0) {
        movedDistance = Math.abs(deltaY);
        const pullDistance = Math.min(movedDistance, 80);
        const rotation = (deltaY * 0.15).toFixed(1);
        el.pullableFlower.style.transform = `translateY(${deltaY * 0.8}px) rotate(${rotation}deg) scale(${1 + pullDistance * 0.002})`;

        // Kéo vượt quá 35px -> Tự động kích hoạt rút hoa hoàn tất
        if (movedDistance > 35) {
          isDragging = false;
          openGreetingCard();
        }
      }
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.pullableFlowerContainer.classList.remove('dragging');

      if (!state.flowerPlucked) {
        // Nếu chỉ bấm nhẹ / chạm mà chưa kéo đủ xa -> vẫn kích hoạt mở hoa mượt mà
        if (movedDistance < 10) {
          openGreetingCard();
        } else {
          // Trả hoa về vị trí cũ nếu kéo lưng chừng
          el.pullableFlower.style.transform = '';
        }
      }
    };

    // Sự kiện Pointer (chuột + cảm ứng điện thoại hiện đại)
    el.pullableFlowerContainer.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    // Click trực tiếp vào hoa
    el.pullableFlower.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.flowerPlucked) {
        openGreetingCard();
      }
    });

    // Bấm phím Enter / Space khi focus vào hoa để hỗ trợ accessibility
    el.pullableFlower.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGreetingCard();
      }
    });
  }

  // Nút chuyển sang Trang 3 (Xem video)
  if (el.btnGoToVideo) {
    el.btnGoToVideo.addEventListener('click', () => {
      goToScreen(3);
      initVideoPage();
    });
  }

  // Nút cắm hoa lại / xem lại
  if (el.btnReplayFlower) {
    el.btnReplayFlower.addEventListener('click', () => {
      resetBouquetAndCard();
    });
  }

  // --- 8. XỬ LÝ TRANG 3: VIDEO HOẠT HÌNH TẠO TRỰC TIẾP BẰNG CODE ---
  let isVideoAvailable = false;

  function initVideoPage() {
  // Dừng video hoạt hình demo nếu đang chạy
    if (state.isDemoPlaying) {
      stopDemoVideo();
    }

  // Dừng video cũ
    if (el.video) {
      el.video.pause();
      el.video.currentTime = 0;

      // Nạp video.mp4 đã khai báo trong HTML
      el.video.load();
    }

    // Đợi chuyển trang xong rồi mới hiện giao diện video
    window.setTimeout(() => {
      if (state.currentScreen !== 3) return;

      if (el.demoCanvas) {
        el.demoCanvas.classList.add('hidden');
      }

      if (el.videoEndScreen) {
        el.videoEndScreen.classList.add('hidden');
      }

      // Hiện nút phát để người xem tự bấm
      if (el.centerPlayBtn) {
        el.centerPlayBtn.classList.remove('hidden');
      }
    }, 350);
  }



  // Định dạng thời gian mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // Cập nhật thanh tiến trình video
  function updateProgress() {
    if (!el.video || !el.progressFill || !el.timeDisplay) return;
    const current = el.video.currentTime;
    const duration = el.video.duration || 0;
    const percent = duration > 0 ? (current / duration) * 100 : 0;
    el.progressFill.style.width = `${percent}%`;
    el.timeDisplay.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  }


  
  function togglePlayVideo() {
    if (!el.video) return;

    // Dừng hoạt hình demo nếu còn chạy
    if (state.isDemoPlaying) {
      stopDemoVideo();
    }

    if (el.video.paused || el.video.ended) {
      if (el.video.ended) {
        el.video.currentTime = 0;
      }

      el.video.play()
        .then(() => {
          state.isVideoPlaying = true;

          if (el.videoFrame) {
            el.videoFrame.classList.add('is-playing');
          }

          if (el.ctrlPlayBtn) {
            el.ctrlPlayBtn.textContent = '❚❚';
          }

          if (el.centerPlayBtn) {
            el.centerPlayBtn.classList.add('hidden');
          }

          if (el.videoPlaceholder) {
            el.videoPlaceholder.classList.add('hidden');
          }

          if (el.videoEndScreen) {
            el.videoEndScreen.classList.add('hidden');
          }
        })
        .catch(error => {
          console.error('Không thể phát video:', error);
          showPlaceholder();
        });
    } else {
      el.video.pause();
      state.isVideoPlaying = false;

      if (el.videoFrame) {
        el.videoFrame.classList.remove('is-playing');
      }

      if (el.ctrlPlayBtn) {
        el.ctrlPlayBtn.textContent = '▶';
      }

      if (el.centerPlayBtn) {
        el.centerPlayBtn.classList.remove('hidden');
      }
    }
  }


  function hidePlaceholder() {
    if (el.videoPlaceholder) el.videoPlaceholder.classList.add('hidden');
  }

  // Khi video kết thúc
  function handleVideoEnded() {
    state.isVideoPlaying = false;
    if (el.videoFrame) el.videoFrame.classList.remove('is-playing');
    if (el.ctrlPlayBtn) el.ctrlPlayBtn.textContent = '▶';
    if (el.videoEndScreen) el.videoEndScreen.classList.remove('hidden');

    sound.celebrate();

    if (petalsFX && el.videoFrame) {
      const rect = el.videoFrame.getBoundingClientRect();
      petalsFX.createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
    }
  }

  // Xử lý các sự kiện của thẻ Video
  if (el.video) {
    el.video.addEventListener('canplay', () => {
      isVideoAvailable = true;
      if (el.videoFrame) el.videoFrame.classList.add('video-loaded');
      hidePlaceholder();
      if (el.centerPlayBtn) el.centerPlayBtn.classList.remove('hidden');
    });

    el.video.addEventListener('loadeddata', () => {
      isVideoAvailable = true;
      if (el.videoFrame) el.videoFrame.classList.add('video-loaded');
      hidePlaceholder();
      if (el.centerPlayBtn) el.centerPlayBtn.classList.remove('hidden');
    });

    el.video.addEventListener('error', () => {
      isVideoAvailable = false;
      if (el.videoFrame) {
        el.videoFrame.classList.remove('video-loaded');
        el.videoFrame.classList.remove('is-playing');
      }
      showPlaceholder();
    });

    el.video.addEventListener('timeupdate', updateProgress);
    el.video.addEventListener('ended', handleVideoEnded);

    // Nhấp vào khung video để Play/Pause
    el.video.addEventListener('click', togglePlayVideo);
  }

  if (el.centerPlayBtn) {
    el.centerPlayBtn.addEventListener('click', togglePlayVideo);
  }

  if (el.ctrlPlayBtn) {
    el.ctrlPlayBtn.addEventListener('click', togglePlayVideo);
  }

  // Tua video khi bấm vào thanh progress
  if (el.progressContainer) {
    el.progressContainer.addEventListener('click', (e) => {
      if (!el.video || !el.video.duration) return;
      const rect = el.progressContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      el.video.currentTime = pos * el.video.duration;
      updateProgress();
    });
  }

  // Nút bật/tắt tiếng trên video
  if (el.ctrlMuteBtn && el.video) {
    el.ctrlMuteBtn.addEventListener('click', () => {
      el.video.muted = !el.video.muted;
      el.ctrlMuteBtn.textContent = el.video.muted ? '🔇' : '🔊';
    });
  }

  // Nút toàn màn hình
  if (el.ctrlFullscreenBtn && el.videoFrame) {
    el.ctrlFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (el.videoFrame.requestFullscreen) {
          el.videoFrame.requestFullscreen();
        } else if (el.videoFrame.webkitRequestFullscreen) {
          el.videoFrame.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Cho phép người dùng chọn video từ máy để kiểm tra ngay lập tức
  if (el.videoFileInput && el.video) {
    el.videoFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (state.isDemoPlaying) stopDemoVideo();
        const fileURL = URL.createObjectURL(file);
        el.video.src = fileURL;
        el.video.load();
        hidePlaceholder();
        el.video.play().then(() => {
          state.isVideoPlaying = true;
          if (el.ctrlPlayBtn) el.ctrlPlayBtn.textContent = '❚❚';
          if (el.centerPlayBtn) el.centerPlayBtn.classList.add('hidden');
        }).catch(() => {});
      }
    });
  }

  // Nút xem lại video sau khi kết thúc
  if (el.btnReplayVideo) {
    el.btnReplayVideo.addEventListener('click', () => {
      if (el.videoEndScreen) el.videoEndScreen.classList.add('hidden');
      if (state.isDemoPlaying) {
        startDemoVideo();
      } else if (el.video) {
        el.video.currentTime = 0;
        el.video.play();
        state.isVideoPlaying = true;
        if (el.ctrlPlayBtn) el.ctrlPlayBtn.textContent = '❚❚';
      }
    });
  }

  // Nút quay lại từ Trang 3 về Trang 2
  if (el.backToScreen2) {
    el.backToScreen2.addEventListener('click', () => {
      if (state.isVideoPlaying && el.video) el.video.pause();
      if (state.isDemoPlaying) stopDemoVideo();
      goToScreen(2);
    });
  }

  // Nút bắt đầu lại từ đầu
  if (el.btnRestart || el.btnBackHome) {
    const handleHomeClick = () => {
      if (state.isVideoPlaying && el.video) el.video.pause();
      if (state.isDemoPlaying) stopDemoVideo();
      if (el.videoEndScreen) el.videoEndScreen.classList.add('hidden');
      resetBouquetAndCard();
      goToScreen(1);
    };

    if (el.btnRestart) el.btnRestart.addEventListener('click', handleHomeClick);
    if (el.btnBackHome) el.btnBackHome.addEventListener('click', handleHomeClick);
  }

  // --- 8B. TRANG 4: BÌNH CHỌN THÍCH THIỆP ---
  let voteNoCount = 0;
  let voteScale = 1;

  if (el.btnGoVote) {
    el.btnGoVote.addEventListener('click', () => {
      if (state.isVideoPlaying && el.video) el.video.pause();
      if (state.isDemoPlaying) stopDemoVideo();
      goToScreen(4);
    });
  }
  if (el.backToScreen3) {
    el.backToScreen3.addEventListener('click', () => goToScreen(3));
  }

  function resetVotePage() {
    voteNoCount = 0;
    voteScale = 1;
    if (el.voteYes) {
      el.voteYes.style.transform = '';
      el.voteYes.style.zIndex = '';
      el.voteYes.textContent = 'Có chứ! 💗';
      el.voteYes.hidden = false;
    }
    if (el.voteNo) {
      el.voteNo.style.opacity = '';
      el.voteNo.style.pointerEvents = '';
      el.voteNo.style.zIndex = '';
      el.voteNo.hidden = false;
    }
    if (el.voteTitle) el.voteTitle.textContent = 'Bạn có thích tấm thiệp này không?';
    if (el.voteSubtitle) el.voteSubtitle.textContent = 'Thành thật nhaaa, người làm thiệp đang hồi hộp lắm đó 💗';
    if (el.voteHint) el.voteHint.textContent = 'Thử bấm “Không” xem chuyện gì xảy ra nè =)))';
    if (el.voteButtons) el.voteButtons.classList.remove('vote-success');
    const successMessage = document.getElementById('vote-success-message');
    if (successMessage) successMessage.remove();
  }

  if (el.voteNo) {
    el.voteNo.addEventListener('click', () => {
      voteNoCount += 1;
      voteScale = Math.min(voteScale * 1.38, 7);
      el.voteYes.style.transform = `scale(${voteScale})`;
      el.voteYes.style.zIndex = '5';
      el.voteNo.style.zIndex = '3';
      if (voteScale >= 2.8) el.voteYes.textContent = 'CÓ CHỨ!!! 💗';
      if (voteScale >= 4.2) {
        el.voteNo.style.opacity = '0';
        el.voteNo.style.pointerEvents = 'none';
        el.voteHint.textContent = 'Nút “Có” chiếm hết chỗ mất rồi =))) 💗';
      } else if (voteNoCount >= 3) {
        el.voteHint.textContent = 'Bấm “Không” nữa là nút “Có” phủ kín luôn đó 😭';
      } else {
        el.voteHint.textContent = 'Ủa, nút “Có” to lên rồi kìa, thử nữa đi =)))';
      }
      sound.chime(659.25 + Math.min(voteNoCount * 45, 250), 0.22);
    });
  }

  if (el.voteYes) {
    el.voteYes.addEventListener('click', () => {
      el.voteTitle.textContent = 'Biết ngay màaa! 🥹💗';
      el.voteSubtitle.textContent = `Cảm ơn ${state.recipientName || 'bạn'} đã thích tấm thiệp này. Chúc bạn một ngày thật vui vẻ!`;
      el.voteHint.textContent = 'Gửi bạn một rừng hoa và thật nhiều yêu thương ✿';
      el.voteButtons.classList.add('vote-success');
      el.voteYes.hidden = true;
      el.voteNo.hidden = true;
      let message = document.getElementById('vote-success-message');
      if (!message) {
        message = document.createElement('div');
        message.id = 'vote-success-message';
        message.className = 'vote-success-message';
        message.innerHTML = '♡ YAY! ♡<span>Cảm ơn bạn thật nhiều!</span>';
        el.voteButtons.appendChild(message);
      }
      sound.chime(880, 0.45);
    });
  }

  if (el.voteRestart) {
    el.voteRestart.addEventListener('click', () => {
      resetVotePage();
      if (state.isVideoPlaying && el.video) el.video.pause();
      if (state.isDemoPlaying) stopDemoVideo();
      if (el.videoEndScreen) el.videoEndScreen.classList.add('hidden');
      resetBouquetAndCard();
      goToScreen(1);
    });
  }

  // --- 9. HIỆU ỨNG MÔ PHỎNG VIDEO HOẠT HÌNH (DEMO CANVAS VIDEO) ---
  // Hoạt hình lời chúc được vẽ bằng Canvas, không cần file video ngoài.
  function startDemoVideo() {
    if (!el.demoCanvas) return;
    state.isDemoPlaying = true;
    el.demoCanvas.classList.remove('hidden');
    hidePlaceholder();
    if (el.videoFrame) el.videoFrame.classList.add('is-playing');
    if (el.videoEndScreen) el.videoEndScreen.classList.add('hidden');
    if (el.ctrlPlayBtn) el.ctrlPlayBtn.textContent = '❚❚';

    const canvas = el.demoCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = el.videoFrame.clientWidth || 640;
    canvas.height = el.videoFrame.clientHeight || 360;

    let startTime = performance.now();
    const demoDuration = 12000; // 12 giây trình chiếu demo

    // Âm thanh nhạc nhẹ du dương nền cho demo
    let noteTimer = 0;
    const demoNotes = [523.25, 587.33, 659.25, 783.99, 880, 1046.50];

    function renderDemo(currentTime) {
      if (!state.isDemoPlaying) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / demoDuration, 1);

      // Cập nhật thanh thời gian
      if (el.progressFill) el.progressFill.style.width = `${progress * 100}%`;
      if (el.timeDisplay) {
        el.timeDisplay.textContent = `${formatTime(elapsed / 1000)} / ${formatTime(demoDuration / 1000)}`;
      }

      // Phát nốt nhạc chuông nhẹ
      if (currentTime - noteTimer > 800 && progress < 0.95) {
        noteTimer = currentTime;
        const randomNote = demoNotes[Math.floor(Math.random() * demoNotes.length)];
        sound.chime(randomNote, 0.4);
      }

      // Vẽ hình nền Gradient chuyển động
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const hueShift = Math.sin(elapsed * 0.001) * 20;
      grad.addColorStop(0, `hsl(${340 + hueShift}, 85%, 20%)`);
      grad.addColorStop(0.5, `hsl(${350 + hueShift}, 90%, 35%)`);
      grad.addColorStop(1, `hsl(${330 + hueShift}, 80%, 15%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vẽ các vòng tròn ánh sáng Bokeh
      for (let i = 0; i < 12; i++) {
        const bx = (Math.sin(elapsed * 0.0008 + i) * 0.5 + 0.5) * canvas.width;
        const by = (Math.cos(elapsed * 0.0006 + i * 1.5) * 0.5 + 0.5) * canvas.height;
        const br = 25 + Math.sin(elapsed * 0.002 + i) * 15;
        ctx.save();
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 182, 193, 0.2)';
        ctx.fill();
        ctx.restore();
      }

      // Đóa hoa hồng đang nở ở trung tâm
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 - 20;
      const bloomScale = 0.85 + Math.sin(elapsed * 0.002) * 0.08;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(bloomScale, bloomScale);

      // Cánh hoa xoay quanh
      for (let j = 0; j < 8; j++) {
        ctx.save();
        ctx.rotate((j * Math.PI) / 4 + elapsed * 0.0003);
        ctx.fillStyle = j % 2 === 0 ? 'rgba(255, 77, 109, 0.85)' : 'rgba(255, 117, 143, 0.85)';
        ctx.beginPath();
        ctx.ellipse(0, 35, 26, 42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Nhụy vàng phát sáng
      ctx.beginPath();
      ctx.arc(0, 0, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();

      // Dòng chữ chúc mừng trên video demo
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Tiêu đề
      ctx.font = 'bold 22px "Playfair Display", Georgia, serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 8;
      ctx.fillText('Happy Vietnamese Women’s Day 💐', cx, cy + 90);

      // Tên người nhận
      ctx.font = 'bold 28px "Dancing Script", cursive, Georgia, serif';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`Dành tặng: ${state.recipientName || 'Bạn'} ❤️`, cx, cy + 128);
      ctx.restore();

      if (progress < 1) {
        state.demoAnimId = requestAnimationFrame(renderDemo);
      } else {
        stopDemoVideo();
        handleVideoEnded();
      }
    }

    state.demoAnimId = requestAnimationFrame(renderDemo);
  }

  function stopDemoVideo() {
    state.isDemoPlaying = false;
    if (state.demoAnimId) cancelAnimationFrame(state.demoAnimId);
    if (el.demoCanvas) el.demoCanvas.classList.add('hidden');
    if (el.videoFrame) el.videoFrame.classList.remove('is-playing');
    if (el.ctrlPlayBtn) el.ctrlPlayBtn.textContent = '▶';
  }

  if (el.btnPlayDemoVideo) {
    el.btnPlayDemoVideo.addEventListener('click', startDemoVideo);
  }

  // --- 10. ÂM THANH BẬT / TẮT (SOUND TOGGLE) ---
  if (el.soundToggle) {
    el.soundToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      if (state.soundEnabled) {
        el.soundToggle.classList.remove('muted');
        if (el.soundIcon) el.soundIcon.textContent = '🔔';
        sound.chime(880, 0.3);
      } else {
        el.soundToggle.classList.add('muted');
        if (el.soundIcon) el.soundIcon.textContent = '🔕';
      }
    });
  }

  // --- 11. KHỞI TẠO ỨNG DỤNG & LOADER TẮT NHẸ NHÀNG ---
  window.addEventListener('DOMContentLoaded', () => {
    // Tắt Loader sau 900ms để trải nghiệm mượt mà
    setTimeout(() => {
      if (el.loader) {
        el.loader.classList.add('fade-out');
        setTimeout(() => {
          el.loader.style.display = 'none';
          if (el.recipientInput) el.recipientInput.focus();
        }, 800);
      }
    }, 900);
  });

})();
