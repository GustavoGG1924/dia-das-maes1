
const CONFIG = {
  motherName: 'Mãe',          // ← Personalize aqui o nome da mãe
  typewriterText: 'Para a mulher mais importante da minha vida…',
  typewriterSpeed: 55,
  petalEmojis: ['🌸', '🌺', '🌷', '✿', '❀', '🌼', '💮', '🏵️'],
};

let currentScreen = 'screen-1';

/* ──────────────────────────────────────────
   2. LOADER
─────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  // Aguarda animação do carregamento (2.6s) depois esconde
  setTimeout(() => {
    loader.classList.add('hidden');
    // Após esconder, inicializa tela 1
    setTimeout(() => {
      startScreen1();
    }, 900);
  }, 2800);
}

/* ──────────────────────────────────────────
   3. PARTÍCULAS (canvas global – bolhas brilhantes)
─────────────────────────────────────────── */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2.2 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.hue = Math.random() > 0.5
        ? `${330 + Math.random() * 30}` // rosé
        : `${270 + Math.random() * 30}`; // lilás
      this.life = 0;
      this.maxLife = Math.random() * 200 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const a = this.alpha * Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 85%, ${a})`;
      ctx.fill();
    }
  }

  // Inicializa partículas
  for (let i = 0; i < 80; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife); // distribui ao longo do ciclo
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ──────────────────────────────────────────
   4. PÉTALA FLUTUANTE
─────────────────────────────────────────── */
function spawnPetals(containerId, count = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.classList.add('petal');
    petal.textContent = CONFIG.petalEmojis[Math.floor(Math.random() * CONFIG.petalEmojis.length)];

    const size = 0.8 + Math.random() * 1.2;
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${0.4 + Math.random() * 0.4};
    `;
    container.appendChild(petal);
  }
}

/* ──────────────────────────────────────────
   5. TYPEWRITER
─────────────────────────────────────────── */
function typeWriter(elementId, text, speed, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let i = 0;
  el.textContent = '';

  function tick() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(tick, speed);
    } else if (callback) {
      setTimeout(callback, 400);
    }
  }
  tick();
}

/* ──────────────────────────────────────────
   6. NAVEGAÇÃO ENTRE TELAS
─────────────────────────────────────────── */
function goToScreen(targetId) {
  const current = document.getElementById(currentScreen);
  const target = document.getElementById(targetId);
  if (!target) return;

  // Fade out atual
  current.style.opacity = '0';
  current.style.visibility = 'hidden';
  setTimeout(() => {
    current.classList.remove('active');
    current.style.opacity = '';
    current.style.visibility = '';
  }, 900);

  // Fade in destino
  setTimeout(() => {
    target.classList.add('active');
    currentScreen = targetId;
    onScreenEnter(targetId);
  }, 600);
}

function onScreenEnter(screenId) {
  switch(screenId) {
    case 'screen-2': triggerScreen2(); break;
    case 'screen-3': triggerScreen3(); break;
    case 'screen-4': triggerScreen4(); break;
    case 'screen-5': triggerScreen5(); break;
    case 'screen-6': break;
    case 'screen-7': triggerScreen7(); break;
    case 'screen-final': triggerFinalScreen(); break;
  }
}

// Botões "Continuar"
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.dataset.next;
    if (next) goToScreen(next);
  });
});

// Botão abertura
document.getElementById('btnOpen')?.addEventListener('click', () => {
  goToScreen('screen-2');
});

/* ──────────────────────────────────────────
   7. SCROLL REVEAL – Timeline
─────────────────────────────────────────── */
function initScrollReveal(screenId) {
  const screen = document.getElementById(screenId);
  if (!screen) return;

  const items = screen.querySelectorAll('.timeline-item, .reveal-left, .reveal-right');
  if (items.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { root: screen.querySelector('.screen-content'), threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

function triggerScreen4() {
  spawnPetals('petals4', 10);
  setTimeout(() => {
    initScrollReveal('screen-4');
    // Força reveal dos primeiros itens
    const firstItems = document.querySelectorAll('#screen-4 .timeline-item');
    setTimeout(() => {
      firstItems[0]?.classList.add('visible');
    }, 200);
  }, 300);
}

/* ──────────────────────────────────────────
   8. MOMENT CARDS REVEAL (Tela 3)
─────────────────────────────────────────── */
function triggerScreen3() {
  spawnPetals('petals3', 14);
  const cards = document.querySelectorAll('.moment-card');
  cards.forEach((card, i) => {
    const delay = parseInt(card.dataset.delay || 0);
    setTimeout(() => {
      card.classList.add('visible');
    }, delay + 200);
  });
}

/* ──────────────────────────────────────────
   TRIGGER TELA 2
─────────────────────────────────────────── */
function triggerScreen2() {
  spawnPetals('petals2', 10);
}

/* ──────────────────────────────────────────
   TRIGGER TELA 5
─────────────────────────────────────────── */
function triggerScreen5() {
  spawnPetals('petals5', 10);
  initPolaroidModal();
}

/* ──────────────────────────────────────────
   9. POLAROID MODAL
─────────────────────────────────────────── */
function initPolaroidModal() {
  const modal = document.getElementById('polaroidModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const modalPhoto = document.getElementById('modalPhoto');
  const modalCaption = document.getElementById('modalCaption');

  // Mapeia as classes de foto
  const photoClasses = ['photo-1','photo-2','photo-3','photo-4','photo-5','photo-6'];
  const photoEmojis = ['🌸','💜','⭐','🌹','💙','💛'];

  document.querySelectorAll('.polaroid').forEach((pol, index) => {
    pol.addEventListener('click', () => {
      const caption = pol.dataset.caption || '';
      const emojiIdx = index % photoEmojis.length;

      modalPhoto.style.cssText = window.getComputedStyle(
        pol.querySelector('.polaroid-photo')
      ).cssText;
      modalPhoto.textContent = photoEmojis[emojiIdx];
      modalPhoto.style.fontSize = '6rem';
      modalPhoto.style.display = 'flex';
      modalPhoto.style.alignItems = 'center';
      modalPhoto.style.justifyContent = 'center';
      const backgrounds = [
        'linear-gradient(135deg,#ffb3c6,#ffd6e0)',
        'linear-gradient(135deg,#d8c8f5,#b59de8)',
        'linear-gradient(135deg,#f5d88a,#e8c870)',
        'linear-gradient(135deg,#ffb3c6,#c8a0e0)',
        'linear-gradient(135deg,#a8d8ea,#80c0d8)',
        'linear-gradient(135deg,#f5c0a0,#e8a880)',
      ];
      modalPhoto.style.background = backgrounds[emojiIdx];
      modalPhoto.style.width = 'min(300px,70vw)';
      modalPhoto.style.height = 'min(300px,70vw)';
      modalCaption.textContent = caption;
      modal.classList.add('open');
    });
  });

  function closeModal() { modal.classList.remove('open'); }
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ──────────────────────────────────────────
   10. REASONS INTERACTION (Tela 6)
─────────────────────────────────────────── */
function initReasons() {
  const display = document.getElementById('reasonDisplay');
  const displayP = display?.querySelector('p');

  document.querySelectorAll('.reason-item').forEach(item => {
    item.addEventListener('click', () => {
      const reason = item.dataset.reason;

      // Remove active de todos
      document.querySelectorAll('.reason-item').forEach(r => r.classList.remove('active'));
      item.classList.add('active');

      // Atualiza display
      if (displayP) {
        displayP.style.opacity = '0';
        displayP.style.transform = 'translateY(10px)';
        setTimeout(() => {
          displayP.textContent = reason;
          displayP.style.opacity = '1';
          displayP.style.transform = 'translateY(0)';
          displayP.style.transition = 'all 0.4s ease';
        }, 250);
      }

      // Cria faíscas ao redor do item
      createSparklesAt(item);
    });
  });
}

function createSparklesAt(element) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const sparkleEmojis = ['✨', '💫', '⭐', '🌟', '💖'];

  for (let i = 0; i < 6; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${0.8 + Math.random() * 0.8}rem;
      pointer-events: none;
      z-index: 9999;
      transition: none;
    `;
    spark.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    document.body.appendChild(spark);

    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      spark.style.transition = 'all 0.8s cubic-bezier(0.2,0,0.8,1)';
      spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 900);
  }
}

/* ──────────────────────────────────────────
   11. CARTA LETTER REVEAL (Tela 7)
─────────────────────────────────────────── */
function triggerScreen7() {
  spawnPetals('petals7', 8);
  setTimeout(() => {
    const letterBody = document.getElementById('letterBody');
    letterBody?.classList.add('animate');
  }, 400);
}

/* ──────────────────────────────────────────
   12. CANVAS FINAL – Chuva de corações/flores
─────────────────────────────────────────── */
function initFinalCanvas() {
  const canvas = document.getElementById('finalCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const symbols = ['❤️','🌸','🌹','✨','💕','🌷','💖','🌺','💫','🎀'];
  const particles = [];

  class FinalParticle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : -40;
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.size = 16 + Math.random() * 22;
      this.vy = 0.8 + Math.random() * 1.8;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.alpha = 0.7 + Math.random() * 0.3;
      this.swing = Math.random() * Math.PI * 2;
    }
    update() {
      this.swing += 0.02;
      this.x += this.vx + Math.sin(this.swing) * 0.4;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 50) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 55; i++) {
    particles.push(new FinalParticle());
  }

  let running = true;
  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  return () => { running = false; };
}

/* ──────────────────────────────────────────
   TRIGGER TELA FINAL
─────────────────────────────────────────── */
function triggerFinalScreen() {
  spawnPetals('petalsFinal', 20);
  initFinalCanvas();
}

/* ──────────────────────────────────────────
   13. BOTÃO LOVE — explosão de partículas
─────────────────────────────────────────── */
function initBtnLove() {
  const btn = document.getElementById('btnLove');
  btn?.addEventListener('click', () => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const burst = ['❤️','💖','💗','💕','🌸','✨','💫','🌹'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        font-size: ${1 + Math.random() * 1.5}rem;
        pointer-events: none;
        z-index: 99999;
      `;
      el.textContent = burst[Math.floor(Math.random() * burst.length)];
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        el.style.transition = `all ${0.8 + Math.random() * 0.6}s cubic-bezier(0.1,0,0.8,1)`;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random()*360}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1500);
    }

    // Feedback visual no botão
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  });
}

/* ──────────────────────────────────────────
   TELA 1 — INÍCIO
─────────────────────────────────────────── */
function startScreen1() {
  // Seta nome da mãe
  const nameEl = document.getElementById('motherName');
  if (nameEl) nameEl.textContent = CONFIG.motherName;

  spawnPetals('petals1', 16);

  // Inicia typewriter após 600ms
  setTimeout(() => {
    typeWriter('typewriter1', CONFIG.typewriterText, CONFIG.typewriterSpeed, () => {
      // Ao finalizar, pisca o cursor
      const el = document.getElementById('typewriter1');
      if (el) {
        el.style.borderRight = '2px solid rgba(255,180,200,0.7)';
        el.style.paddingRight = '3px';
        el.style.animation = 'blink-cursor 0.8s step-end infinite';
        const style = document.createElement('style');
        style.textContent = '@keyframes blink-cursor{0%,100%{border-color:rgba(255,180,200,0.7)}50%{border-color:transparent}}';
        document.head.appendChild(style);
      }
    });
  }, 600);
}

/* ──────────────────────────────────────────
   SCROLL REVEAL para tela 4 via IntersectionObserver
   com fallback por timeout
─────────────────────────────────────────── */
function initTimelineReveal() {
  // Adiciona observador direto no DOM para os items da timeline
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}

/* ──────────────────────────────────────────
   14. INIT — Ponto de entrada
─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Canvas global de partículas
  initParticleCanvas();

  // Loader
  initLoader();

  // Pré-inicializa reasons (para quando a tela estiver visível)
  initReasons();

  // Botão final
  initBtnLove();

  // Botão abrir homenagem (tela 1 → tela 2)
  document.getElementById('btnOpen')?.addEventListener('click', () => {
    goToScreen('screen-2');
  });

  // Timeline: observer de scroll
  // (será ativado quando screen-4 ficar visível via onScreenEnter)

  // Listener para scroll nas screens que precisam de reveal
  document.querySelectorAll('.screen-content').forEach(content => {
    content.addEventListener('scroll', () => {
      if (currentScreen === 'screen-4') {
        document.querySelectorAll('#screen-4 .timeline-item').forEach(item => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
            item.classList.add('visible');
          }
        });
      }
    });
  });

  // Extra: toca música do sistema de homenagem se o browser permitir
  // (Omitido para garantir compatibilidade — adicione um <audio> se desejar)

  console.log('💖 Feliz Dia das Mães! Feito com amor.');
});


(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,130,170,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
  });


const CONFIG = {
  motherName: 'Mãe',          // ← Personalize aqui o nome da mãe
  typewriterText: 'Para a mulher mais importante da minha vida…',
  typewriterSpeed: 55,
  petalEmojis: ['🌸', '🌺', '🌷', '✿', '❀', '🌼', '💮', '🏵️'],
};

let currentScreen = 'screen-1';

/* ──────────────────────────────────────────
   2. LOADER
─────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  // Aguarda animação do carregamento (2.6s) depois esconde
  setTimeout(() => {
    loader.classList.add('hidden');
    // Após esconder, inicializa tela 1
    setTimeout(() => {
      startScreen1();
    }, 900);
  }, 2800);
}

/* ──────────────────────────────────────────
   3. PARTÍCULAS (canvas global – bolhas brilhantes)
─────────────────────────────────────────── */
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = Math.random() * 2.2 + 0.4;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.hue = Math.random() > 0.5
        ? `${330 + Math.random() * 30}` // rosé
        : `${270 + Math.random() * 30}`; // lilás
      this.life = 0;
      this.maxLife = Math.random() * 200 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life >= this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const a = this.alpha * Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 85%, ${a})`;
      ctx.fill();
    }
  }

  // Inicializa partículas
  for (let i = 0; i < 80; i++) {
    const p = new Particle();
    p.life = Math.floor(Math.random() * p.maxLife); // distribui ao longo do ciclo
    particles.push(p);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ──────────────────────────────────────────
   4. PÉTALA FLUTUANTE
─────────────────────────────────────────── */
function spawnPetals(containerId, count = 12) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.classList.add('petal');
    petal.textContent = CONFIG.petalEmojis[Math.floor(Math.random() * CONFIG.petalEmojis.length)];

    const size = 0.8 + Math.random() * 1.2;
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${0.4 + Math.random() * 0.4};
    `;
    container.appendChild(petal);
  }
}

/* ──────────────────────────────────────────
   5. TYPEWRITER
─────────────────────────────────────────── */
function typeWriter(elementId, text, speed, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let i = 0;
  el.textContent = '';

  function tick() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(tick, speed);
    } else if (callback) {
      setTimeout(callback, 400);
    }
  }
  tick();
}

/* ──────────────────────────────────────────
   6. NAVEGAÇÃO ENTRE TELAS
─────────────────────────────────────────── */
function goToScreen(targetId) {
  const current = document.getElementById(currentScreen);
  const target = document.getElementById(targetId);
  if (!target) return;

  // Fade out atual
  current.style.opacity = '0';
  current.style.visibility = 'hidden';
  setTimeout(() => {
    current.classList.remove('active');
    current.style.opacity = '';
    current.style.visibility = '';
  }, 900);

  // Fade in destino
  setTimeout(() => {
    target.classList.add('active');
    currentScreen = targetId;
    onScreenEnter(targetId);
  }, 600);
}

function onScreenEnter(screenId) {
  switch(screenId) {
    case 'screen-2': triggerScreen2(); break;
    case 'screen-3': triggerScreen3(); break;
    case 'screen-4': triggerScreen4(); break;
    case 'screen-5': triggerScreen5(); break;
    case 'screen-6': break;
    case 'screen-7': triggerScreen7(); break;
    case 'screen-final': triggerFinalScreen(); break;
  }
}

// Botões "Continuar"
document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = btn.dataset.next;
    if (next) goToScreen(next);
  });
});

// Botão abertura
document.getElementById('btnOpen')?.addEventListener('click', () => {
  goToScreen('screen-2');
});

/* ──────────────────────────────────────────
   7. SCROLL REVEAL – Timeline
─────────────────────────────────────────── */
function initScrollReveal(screenId) {
  const screen = document.getElementById(screenId);
  if (!screen) return;

  const items = screen.querySelectorAll('.timeline-item, .reveal-left, .reveal-right');
  if (items.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { root: screen.querySelector('.screen-content'), threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

function triggerScreen4() {
  spawnPetals('petals4', 10);
  setTimeout(() => {
    initScrollReveal('screen-4');
    // Força reveal dos primeiros itens
    const firstItems = document.querySelectorAll('#screen-4 .timeline-item');
    setTimeout(() => {
      firstItems[0]?.classList.add('visible');
    }, 200);
  }, 300);
}

/* ──────────────────────────────────────────
   8. MOMENT CARDS REVEAL (Tela 3)
─────────────────────────────────────────── */
function triggerScreen3() {
  spawnPetals('petals3', 14);
  const cards = document.querySelectorAll('.moment-card');
  cards.forEach((card, i) => {
    const delay = parseInt(card.dataset.delay || 0);
    setTimeout(() => {
      card.classList.add('visible');
    }, delay + 200);
  });
}

/* ──────────────────────────────────────────
   TRIGGER TELA 2
─────────────────────────────────────────── */
function triggerScreen2() {
  spawnPetals('petals2', 10);
}

/* ──────────────────────────────────────────
   TRIGGER TELA 5
─────────────────────────────────────────── */
function triggerScreen5() {
  spawnPetals('petals5', 10);
  initPolaroidModal();
}

/* ──────────────────────────────────────────
   9. POLAROID MODAL
─────────────────────────────────────────── */
function initPolaroidModal() {
  const modal = document.getElementById('polaroidModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const modalPhoto = document.getElementById('modalPhoto');
  const modalCaption = document.getElementById('modalCaption');

  // Mapeia as classes de foto
  const photoClasses = ['photo-1','photo-2','photo-3','photo-4','photo-5','photo-6'];
  const photoEmojis = ['🌸','💜','⭐','🌹','💙','💛'];

  document.querySelectorAll('.polaroid').forEach((pol, index) => {
    pol.addEventListener('click', () => {
      const caption = pol.dataset.caption || '';
      const emojiIdx = index % photoEmojis.length;

      modalPhoto.style.cssText = window.getComputedStyle(
        pol.querySelector('.polaroid-photo')
      ).cssText;
      modalPhoto.textContent = photoEmojis[emojiIdx];
      modalPhoto.style.fontSize = '6rem';
      modalPhoto.style.display = 'flex';
      modalPhoto.style.alignItems = 'center';
      modalPhoto.style.justifyContent = 'center';
      const backgrounds = [
        'linear-gradient(135deg,#ffb3c6,#ffd6e0)',
        'linear-gradient(135deg,#d8c8f5,#b59de8)',
        'linear-gradient(135deg,#f5d88a,#e8c870)',
        'linear-gradient(135deg,#ffb3c6,#c8a0e0)',
        'linear-gradient(135deg,#a8d8ea,#80c0d8)',
        'linear-gradient(135deg,#f5c0a0,#e8a880)',
      ];
      modalPhoto.style.background = backgrounds[emojiIdx];
      modalPhoto.style.width = 'min(300px,70vw)';
      modalPhoto.style.height = 'min(300px,70vw)';
      modalCaption.textContent = caption;
      modal.classList.add('open');
    });
  });

  function closeModal() { modal.classList.remove('open'); }
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ──────────────────────────────────────────
   10. REASONS INTERACTION (Tela 6)
─────────────────────────────────────────── */
function initReasons() {
  const display = document.getElementById('reasonDisplay');
  const displayP = display?.querySelector('p');

  document.querySelectorAll('.reason-item').forEach(item => {
    item.addEventListener('click', () => {
      const reason = item.dataset.reason;

      // Remove active de todos
      document.querySelectorAll('.reason-item').forEach(r => r.classList.remove('active'));
      item.classList.add('active');

      // Atualiza display
      if (displayP) {
        displayP.style.opacity = '0';
        displayP.style.transform = 'translateY(10px)';
        setTimeout(() => {
          displayP.textContent = reason;
          displayP.style.opacity = '1';
          displayP.style.transform = 'translateY(0)';
          displayP.style.transition = 'all 0.4s ease';
        }, 250);
      }

      // Cria faíscas ao redor do item
      createSparklesAt(item);
    });
  });
}

function createSparklesAt(element) {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const sparkleEmojis = ['✨', '💫', '⭐', '🌟', '💖'];

  for (let i = 0; i < 6; i++) {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      font-size: ${0.8 + Math.random() * 0.8}rem;
      pointer-events: none;
      z-index: 9999;
      transition: none;
    `;
    spark.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
    document.body.appendChild(spark);

    const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 40 + Math.random() * 60;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      spark.style.transition = 'all 0.8s cubic-bezier(0.2,0,0.8,1)';
      spark.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => spark.remove(), 900);
  }
}

/* ──────────────────────────────────────────
   11. CARTA LETTER REVEAL (Tela 7)
─────────────────────────────────────────── */
function triggerScreen7() {
  spawnPetals('petals7', 8);
  setTimeout(() => {
    const letterBody = document.getElementById('letterBody');
    letterBody?.classList.add('animate');
  }, 400);
}

/* ──────────────────────────────────────────
   12. CANVAS FINAL – Chuva de corações/flores
─────────────────────────────────────────── */
function initFinalCanvas() {
  const canvas = document.getElementById('finalCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const symbols = ['❤️','🌸','🌹','✨','💕','🌷','💖','🌺','💫','🎀'];
  const particles = [];

  class FinalParticle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : -40;
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.size = 16 + Math.random() * 22;
      this.vy = 0.8 + Math.random() * 1.8;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.alpha = 0.7 + Math.random() * 0.3;
      this.swing = Math.random() * Math.PI * 2;
    }
    update() {
      this.swing += 0.02;
      this.x += this.vx + Math.sin(this.swing) * 0.4;
      this.y += this.vy;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 50) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, 0, 0);
      ctx.restore();
    }
  }

  for (let i = 0; i < 55; i++) {
    particles.push(new FinalParticle());
  }

  let running = true;
  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  return () => { running = false; };
}

/* ──────────────────────────────────────────
   TRIGGER TELA FINAL
─────────────────────────────────────────── */
function triggerFinalScreen() {
  spawnPetals('petalsFinal', 20);
  initFinalCanvas();
}

/* ──────────────────────────────────────────
   13. BOTÃO LOVE — explosão de partículas
─────────────────────────────────────────── */
function initBtnLove() {
  const btn = document.getElementById('btnLove');
  btn?.addEventListener('click', () => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const burst = ['❤️','💖','💗','💕','🌸','✨','💫','🌹'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        font-size: ${1 + Math.random() * 1.5}rem;
        pointer-events: none;
        z-index: 99999;
      `;
      el.textContent = burst[Math.floor(Math.random() * burst.length)];
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 160;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        el.style.transition = `all ${0.8 + Math.random() * 0.6}s cubic-bezier(0.1,0,0.8,1)`;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(0) rotate(${Math.random()*360}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1500);
    }

    // Feedback visual no botão
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  });
}

/* ──────────────────────────────────────────
   TELA 1 — INÍCIO
─────────────────────────────────────────── */
function startScreen1() {
  // Seta nome da mãe
  const nameEl = document.getElementById('motherName');
  if (nameEl) nameEl.textContent = CONFIG.motherName;

  spawnPetals('petals1', 16);

  // Inicia typewriter após 600ms
  setTimeout(() => {
    typeWriter('typewriter1', CONFIG.typewriterText, CONFIG.typewriterSpeed, () => {
      // Ao finalizar, pisca o cursor
      const el = document.getElementById('typewriter1');
      if (el) {
        el.style.borderRight = '2px solid rgba(255,180,200,0.7)';
        el.style.paddingRight = '3px';
        el.style.animation = 'blink-cursor 0.8s step-end infinite';
        const style = document.createElement('style');
        style.textContent = '@keyframes blink-cursor{0%,100%{border-color:rgba(255,180,200,0.7)}50%{border-color:transparent}}';
        document.head.appendChild(style);
      }
    });
  }, 600);
}

/* ──────────────────────────────────────────
   SCROLL REVEAL para tela 4 via IntersectionObserver
   com fallback por timeout
─────────────────────────────────────────── */
function initTimelineReveal() {
  // Adiciona observador direto no DOM para os items da timeline
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.timeline-item').forEach(item => {
    observer.observe(item);
  });
}

/* ──────────────────────────────────────────
   14. INIT — Ponto de entrada
─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Canvas global de partículas
  initParticleCanvas();

  // Loader
  initLoader();

  // Pré-inicializa reasons (para quando a tela estiver visível)
  initReasons();

  // Botão final
  initBtnLove();

  // Botão abrir homenagem (tela 1 → tela 2)
  document.getElementById('btnOpen')?.addEventListener('click', () => {
    goToScreen('screen-2');
  });

  // Timeline: observer de scroll
  // (será ativado quando screen-4 ficar visível via onScreenEnter)

  // Listener para scroll nas screens que precisam de reveal
  document.querySelectorAll('.screen-content').forEach(content => {
    content.addEventListener('scroll', () => {
      if (currentScreen === 'screen-4') {
        document.querySelectorAll('#screen-4 .timeline-item').forEach(item => {
          const rect = item.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9) {
            item.classList.add('visible');
          }
        });
      }
    });
  });

  // Extra: toca música do sistema de homenagem se o browser permitir
  // (Omitido para garantir compatibilidade — adicione um <audio> se desejar)

  console.log('💖 Feliz Dia das Mães! Feito com amor.');
});

/* ──────────────────────────────────────────
   EXTRA: Efeito de brilho no cursor (desktop)
─────────────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,130,170,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%,-50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
  });

})()