/* ========================================================
   루이 13세 공식 웹사이트 인터랙션 스크립트 (app.js)
   컨셉: 별빛 밤하늘 캔버스 + 4.8kg 루이 13세 인터랙션
   ======================================================== */

// 1. 상태 관리 (4.8kg 루이 13세 맞춤 대사)
const STATE = {
  soundEnabled: true,
  tributeCount: 137,
  quotes: [
    "“흡족하도다! 4.8kg의 듬직한 체구를 유지하려면 이 정도 간식은 기본이지.”",
    "“새하얀 눈썹이 실룩거리는 것이 보이는가? 매우 기분이 좋다는 뜻이니라.”",
    "“바스락 소리가 짐의 왕실 레이더 귀를 즐겁게 하는구나!”",
    "“포동포동한 볼살을 유지하는 비결? 바로 충신들의 닭가슴살 조공 덕분이지!”",
    "“밤하늘의 별빛보다 짐의 황금 왕관과 눈썹이 더 빛나지 않느냐?”",
    "“충성스러운 신하로다! 짐의 4.8kg 솜방망이 젤리 하이파이브를 하사하노라.”",
    "“더 가져오너라! 짐의 배는 아직 대우주처럼 광활하니라!”"
  ],
  characterQuotes: [
    "멍! 4.8kg의 묵직한 솜방망이 펀치 맛을 보겠느냐!",
    "동글동글 사과머리 쓰담쓰담은 하루 3회로 제한하노라!",
    "짐의 보석 왕관이 눈부시지 않느냐? 머리 털지 않도록 조심하는 중이다.",
    "간식 봉지 소리를 냈는가? 당장 이리로 가져오라!",
    "밤하늘의 별보다 짐의 새하얀 눈썹과 허스키 문양이 국보 1호이니라."
  ]
};

// 2. 초기화
document.addEventListener('DOMContentLoaded', () => {
  initStarrySkyCanvas();
  loadSavedData();
  setupTributeButtons();
  setupCharacterInteraction();
  setupGuestbook();
  setupPhotoUpload();
  setupSoundToggle();
});

/* ========================================================
   반짝반짝 별빛 밤하늘 캔버스 (Starry Night Sky)
   ======================================================== */
function initStarrySkyCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // 별 생성 (반짝이는 다양한 크기의 별들)
  const stars = [];
  const starCount = 85;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.6,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.35 ? '#FFE599' : '#FFFFFF',
      isSpecialStar: Math.random() > 0.85 // 십자형으로 반짝이는 큰 별
    });
  }

  // 가끔 떨어지는 유성 (Shooting Star)
  let shootingStar = null;
  function spawnShootingStar() {
    if (Math.random() < 0.008 && !shootingStar) {
      shootingStar = {
        x: Math.random() * (width * 0.7),
        y: Math.random() * (height * 0.3),
        length: Math.random() * 70 + 60,
        speed: Math.random() * 8 + 9,
        opacity: 1
      };
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. 별 그리기
    stars.forEach((star) => {
      star.twinklePhase += star.twinkleSpeed;
      const alpha = 0.35 + Math.sin(star.twinklePhase) * 0.5;
      const currentAlpha = Math.max(0.1, Math.min(1, alpha));

      ctx.save();
      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = star.color;

      if (star.isSpecialStar) {
        // 4각 십자별
        ctx.beginPath();
        const s = star.size * 2.5;
        ctx.moveTo(star.x, star.y - s);
        ctx.lineTo(star.x + s * 0.25, star.y);
        ctx.lineTo(star.x + s, star.y);
        ctx.lineTo(star.x + s * 0.25, star.y + s * 0.25);
        ctx.lineTo(star.x, star.y + s);
        ctx.lineTo(star.x - s * 0.25, star.y + s * 0.25);
        ctx.lineTo(star.x - s, star.y);
        ctx.lineTo(star.x - s * 0.25, star.y);
        ctx.closePath();
        ctx.fill();
      } else {
        // 일반 둥근 별
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.shadowBlur = 6;
        ctx.shadowColor = star.color;
        ctx.fill();
      }
      ctx.restore();
    });

    // 2. 유성 애니메이션
    spawnShootingStar();
    if (shootingStar) {
      ctx.save();
      ctx.strokeStyle = `rgba(255, 235, 160, ${shootingStar.opacity})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x + shootingStar.length, shootingStar.y + shootingStar.length * 0.5);
      ctx.stroke();
      ctx.restore();

      shootingStar.x += shootingStar.speed;
      shootingStar.y += shootingStar.speed * 0.5;
      shootingStar.opacity -= 0.02;

      if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ========================================================
   Web Audio API - 왕실 팡파르 & 효과음
   ======================================================== */
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playRoyalSound(type = 'chime') {
  if (!STATE.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;

    if (type === 'chime') {
      // 맑고 경쾌한 골드 차임 소리
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } else if (type === 'bark') {
      // 귀여운 치와와 단음 비프
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {
    console.log('Audio gesture note:', e);
  }
}

function setupSoundToggle() {
  const btn = document.getElementById('sound-toggle');
  const icon = document.getElementById('sound-icon');
  if (!btn) return;

  btn.addEventListener('click', () => {
    STATE.soundEnabled = !STATE.soundEnabled;
    icon.textContent = STATE.soundEnabled ? '🔔' : '🔕';
    btn.style.opacity = STATE.soundEnabled ? '1' : '0.6';
    showToast(STATE.soundEnabled ? '왕실 효과음이 켜졌습니다.' : '효과음이 꺼졌습니다.');
  });
}

/* ========================================================
   조공 바치기 (Tribute Buttons)
   ======================================================== */
function setupTributeButtons() {
  const buttons = document.querySelectorAll('.tribute-btn');
  const counterEl = document.getElementById('tribute-count');
  const reactionEl = document.getElementById('king-reaction');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const snackName = btn.dataset.name;
      const snackType = btn.dataset.snack;
      const boost = snackType === 'beef' ? 3 : 1;

      STATE.tributeCount += boost;
      counterEl.textContent = STATE.tributeCount;
      localStorage.setItem('louis_tribute_count', STATE.tributeCount);

      // 카운터 뜀 효과
      counterEl.classList.add('bump');
      setTimeout(() => counterEl.classList.remove('bump'), 250);

      // 랜덤 폐하 어록
      const randomQuote = STATE.quotes[Math.floor(Math.random() * STATE.quotes.length)];
      reactionEl.style.opacity = '0';
      setTimeout(() => {
        reactionEl.textContent = randomQuote;
        reactionEl.style.opacity = '1';
      }, 150);

      // 소리 재생 & 파티클 발사
      playRoyalSound('chime');
      createFloatingEmojis(e.clientX, e.clientY, snackType);

      showToast(`[${snackName}] 진상 완료! 폐하께서 매우 기뻐하십니다.`);
    });
  });
}

function createFloatingEmojis(x, y, snackType) {
  const emojiMap = {
    chicken: ['🍗', '✨', '🐾', '👑'],
    cheese: ['🧀', '✨', '💛', '🐾'],
    beef: ['🥩', '🔥', '👑', '⭐'],
    belly: ['🖐️', '💖', '🐾', '🥰']
  };

  const pool = emojiMap[snackType] || ['👑', '✨', '🐾'];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'flying-emoji';
    el.textContent = pool[Math.floor(Math.random() * pool.length)];

    const tx = (Math.random() - 0.5) * 160;
    const ty = -Math.random() * 120 - 60;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 1200);
  }
}

/* ========================================================
   캐릭터 클릭 인터랙션
   ======================================================== */
function setupCharacterInteraction() {
  const svg = document.querySelector('.louis-svg');
  const bubble = document.getElementById('hero-bubble');
  if (!svg || !bubble) return;

  svg.addEventListener('click', (e) => {
    playRoyalSound('bark');
    const randomSpeech = STATE.characterQuotes[Math.floor(Math.random() * STATE.characterQuotes.length)];
    bubble.textContent = randomSpeech;
    bubble.style.transform = 'scale(1.08)';
    setTimeout(() => {
      bubble.style.transform = 'scale(1)';
    }, 250);

    createFloatingEmojis(e.clientX, e.clientY, 'belly');
  });
}

/* ========================================================
   충성 방명록 (Guestbook)
   ======================================================== */
function setupGuestbook() {
  const form = document.getElementById('guestbook-form');
  const list = document.getElementById('guestbook-list');
  if (!form || !list) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const author = document.getElementById('author-name').value.trim();
    const title = document.getElementById('author-title').value;
    const msg = document.getElementById('author-msg').value.trim();

    if (!author || !msg) return;

    const entry = {
      author,
      title,
      msg,
      date: new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    saveGuestbookEntry(entry);
    renderGuestbookCard(entry, true);

    form.reset();
    playRoyalSound('chime');
    showToast('상소문이 성공적으로 궁내청에 접수되었습니다! 📜');
  });
}

function renderGuestbookCard(entry, prepend = false) {
  const list = document.getElementById('guestbook-list');
  const card = document.createElement('div');
  card.className = 'guest-card';
  card.innerHTML = `
    <div class="guest-card-header">
      <span class="guest-author">${escapeHtml(entry.author)}</span>
      <span class="guest-badge">${escapeHtml(entry.title)}</span>
    </div>
    <p class="guest-msg">"${escapeHtml(entry.msg)}"</p>
    <div class="guest-date">${entry.date} 접수</div>
  `;

  if (prepend) {
    list.prepend(card);
  } else {
    list.appendChild(card);
  }
}

function saveGuestbookEntry(entry) {
  let entries = [];
  try {
    entries = JSON.parse(localStorage.getItem('louis_guestbook') || '[]');
  } catch (e) {
    entries = [];
  }
  entries.unshift(entry);
  localStorage.setItem('louis_guestbook', JSON.stringify(entries.slice(0, 50)));
}

/* ========================================================
   사진 추가 업로드 기능 (Local Storage)
   ======================================================== */
function setupPhotoUpload() {
  const input = document.getElementById('photo-upload');
  const grid = document.getElementById('gallery-grid');
  if (!input || !grid) return;

  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const photoCard = {
        img: dataUrl,
        tag: '루이 직찍',
        title: '신하가 올린 폐하의 일상',
        desc: '단모 블랙탄의 눈부신 벨벳 광택 실물 인증샷'
      };

      addPhotoCard(photoCard, true);
      savePhotoCard(photoCard);
      showToast('루이 13세 폐하의 화보가 추가되었습니다! 📷');
    };
    reader.readAsDataURL(file);
  });
}

function addPhotoCard(cardData, prepend = false) {
  const grid = document.getElementById('gallery-grid');
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.innerHTML = `
    <div class="gallery-img-wrapper">
      <img src="${cardData.img}" alt="${escapeHtml(cardData.title)}">
    </div>
    <div class="gallery-info">
      <span class="photo-tag">${escapeHtml(cardData.tag)}</span>
      <h4>${escapeHtml(cardData.title)}</h4>
      <p>${escapeHtml(cardData.desc)}</p>
    </div>
  `;

  if (prepend) {
    grid.prepend(card);
  } else {
    grid.appendChild(card);
  }
}

function savePhotoCard(photoCard) {
  let photos = [];
  try {
    photos = JSON.parse(localStorage.getItem('louis_photos') || '[]');
  } catch (e) {
    photos = [];
  }
  photos.unshift(photoCard);
  try {
    localStorage.setItem('louis_photos', JSON.stringify(photos.slice(0, 8)));
  } catch (err) {
    console.warn('LocalStorage quota reached', err);
  }
}

/* ========================================================
   저장된 데이터 불러오기
   ======================================================== */
function loadSavedData() {
  const savedTribute = localStorage.getItem('louis_tribute_count');
  if (savedTribute) {
    STATE.tributeCount = parseInt(savedTribute, 10) || 137;
    const countEl = document.getElementById('tribute-count');
    if (countEl) countEl.textContent = STATE.tributeCount;
  }

  try {
    const savedGuestbook = JSON.parse(localStorage.getItem('louis_guestbook') || '[]');
    savedGuestbook.forEach((entry) => renderGuestbookCard(entry, false));
  } catch (e) {
    console.log('Guestbook parse error');
  }

  try {
    const savedPhotos = JSON.parse(localStorage.getItem('louis_photos') || '[]');
    savedPhotos.forEach((photo) => addPhotoCard(photo, true));
  } catch (e) {
    console.log('Photos parse error');
  }
}

/* ========================================================
   토스트 팝업 유틸리티
   ======================================================== */
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
