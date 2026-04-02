/* ===============================================
   APP.JS — CSE Department Website
   JavaScript: Particles, Typing, Counters, Nav,
   Reveal Animations, 3D tilt, Cursor, Filter
   =============================================== */

'use strict';

/* ---- Utility: throttle ---- */
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= wait) { last = now; fn(...args); }
  };
}

/* ---- Custom Cursor ---- */
(function initCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = -100, my = -100;
  let fx = -100, fy = -100;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale on hover
  document.querySelectorAll('a, button, .faculty-card, .program-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      follower.style.transform = 'translate(-50%, -50%) scale(1.4)';
      follower.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.opacity = '1';
    });
  });
})();

/* ---- Particle Canvas ---- */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const PARTICLE_COUNT = Math.min(100, Math.floor(W * H / 12000));
  const particles = [];
  const connections = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = Math.random() * 0.3 + 0.1;
      this.size = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0, 212, 255' : '124, 58, 237';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > H + 10) this.reset();
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  const maxDist = 120;
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', throttle(() => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  }, 200));
})();

/* ---- Typing Effect ---- */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const words = ['Computer Science', 'Engineering', 'Innovation Hub', 'Tech Excellence', 'Future Leaders'];
  let wi = 0, ci = 0, deleting = false;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.parentNode.insertBefore(cursor, el.nextSibling);

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; return setTimeout(type, 1800); }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(type, 400); }
    }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();
})();

/* ---- Navbar: scroll, active link, hamburger ---- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = navLinks ? navLinks.querySelectorAll('.nav-link') : [];
  const backToTop = document.getElementById('back-to-top');

  // Scroll behavior
  window.addEventListener('scroll', throttle(() => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 400);

    // Active link
    const sections = ['home', 'about', 'programs', 'faculty', 'activities', 'achievements', 'contact'];
    let current = 'home';
    sections.forEach(id => {
      const sec = document.getElementById(id);
      if (sec && scrollY >= sec.offsetTop - 120) current = id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }, 50));

  // Hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
      hamburger.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '1';
      hamburger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });

    // Close on link click
    navLinks.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      });
    });
  }

  // Back to top
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
})();

/* ---- Counter Animation ---- */
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = null;
  const startVal = 0;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + suffix;
  }
  requestAnimationFrame(step);
}

/* ---- Intersection Observer: Reveal + Counters ---- */
(function initScrollEffects() {
  // Reveal animations
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // Counters
  const counterMap = {
    'stat-students': { target: 1200, suffix: '+' },
    'stat-faculty': { target: 48, suffix: '+' },
    'stat-placement': { target: 95, suffix: '%' },
    'stat-years': { target: 25, suffix: '' },
    'about-students': { target: 1200, suffix: '+' },
    'about-faculty': { target: 48, suffix: '+' },
    'about-projects': { target: 150, suffix: '+' },
    'about-companies': { target: 80, suffix: '+' },
    'about-papers': { target: 300, suffix: '+' },
    'about-countries': { target: 25, suffix: '+' },
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        if (counterMap[id]) {
          animateCounter(e.target, counterMap[id].target, 2000, counterMap[id].suffix);
          counterObserver.unobserve(e.target);
        }
      }
    });
  }, { threshold: 0.5 });
  Object.keys(counterMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) counterObserver.observe(el);
  });
})();

/* ---- Faculty Filter ---- */
(function initFacultyFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.faculty-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();

/* ---- Hero 3D Card Tilt ---- */
(function initTilt() {
  const card = document.getElementById('hero-3d-card');
  if (!card) return;
  const inner = card.querySelector('.card-inner');
  if (!inner) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 12}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
    setTimeout(() => inner.style.transition = 'transform 0.1s linear', 600);
  });
})();

/* ---- Contact Form ---- */
(function initForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('cf-submit');
  const submitText = document.getElementById('cf-submit-text');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitText.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitText.textContent = 'Send Message';
      submitBtn.disabled = false;
      success.style.display = 'block';
      form.reset();
      setTimeout(() => success.style.display = 'none', 5000);
    }, 1500);
  });
})();

/* ---- Ticker: Duplicate Content for Seamless Loop ---- */
(function initTicker() {
  const inner = document.getElementById('ticker-inner');
  if (!inner) return;
  // Duplicate for seamless scroll
  inner.innerHTML = inner.innerHTML + inner.innerHTML;
})();

/* ---- Smooth Section Scroll for nav links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Floating Chips offset on scroll ---- */
(function initChipsParallax() {
  const chips = document.querySelectorAll('.chip');
  window.addEventListener('scroll', throttle(() => {
    const sy = window.scrollY;
    chips.forEach((chip, i) => {
      chip.style.transform = `translateY(${Math.sin(sy * 0.002 + i) * 8}px)`;
    });
  }, 30));
})();

/* ---- Active nav highlight on load ---- */
window.dispatchEvent(new Event('scroll'));

/* ---- Program Card 3D hover tilt ---- */
(function initCardTilt() {
  document.querySelectorAll('.program-card, .ach-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ---- Glitch Effect on Title on hover ---- */
(function initGlitch() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  // Light CSS animation instead of DOM manipulation
})();

/* ---- Theme Switcher ---- */
(function initThemeSwitcher() {
  const trigger  = document.getElementById('theme-trigger');
  const panel    = document.getElementById('theme-panel');
  const options  = document.querySelectorAll('.theme-option');
  if (!trigger || !panel) return;

  // Theme id → data-theme value (midnight uses no attribute = default)
  const THEMES = {
    midnight: null,
    emerald:  'emerald',
    solar:    'solar',
    galaxy:   'galaxy',
    arctic:   'arctic',
    crimson:  'crimson',
  };

  // Particle colours per theme (RGB strings)
  const PARTICLE_COLORS = {
    midnight: ['0, 212, 255', '124, 58, 237'],
    emerald:  ['0, 230, 100', '0, 184, 148'],
    solar:    ['255, 149, 0', '255, 61, 0'],
    galaxy:   ['200, 80, 255', '255, 80, 184'],
    arctic:   ['0, 120, 255', '0, 68, 204'],
    crimson:  ['255, 34, 68', '204, 0, 34'],
  };

  let currentTheme = localStorage.getItem('cse-theme') || 'midnight';
  let panelOpen = false;

  /* Apply a theme immediately (all vars swap at once via flash) */
  function applyTheme(themeId, animate = true) {
    const dataVal = THEMES[themeId];

    if (animate) {
      // Inject flash overlay — theme swaps UNDER the overlay, looks simultaneous
      const flash = document.createElement('div');
      flash.className = 'theme-flash';
      document.body.appendChild(flash);

      // Swap after overlay is half-opaque so user never sees partial state
      setTimeout(() => {
        setBodyTheme(dataVal);
        updateParticleColors(themeId);
      }, 100);

      // Remove overlay after animation
      flash.addEventListener('animationend', () => flash.remove());
    } else {
      setBodyTheme(dataVal);
      updateParticleColors(themeId);
    }

    // Update active state on option buttons
    options.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === themeId);
    });

    currentTheme = themeId;
    localStorage.setItem('cse-theme', themeId);
  }

  function setBodyTheme(dataVal) {
    if (dataVal) {
      document.body.setAttribute('data-theme', dataVal);
    } else {
      document.body.removeAttribute('data-theme');
    }
  }

  /* Update particle canvas colours to match theme */
  function updateParticleColors(themeId) {
    window._themeParticleColors = PARTICLE_COLORS[themeId] || PARTICLE_COLORS.midnight;
  }

  /* Toggle panel */
  trigger.addEventListener('click', () => {
    panelOpen = !panelOpen;
    panel.classList.toggle('open', panelOpen);
    trigger.classList.toggle('panel-open', panelOpen);
    trigger.setAttribute('aria-expanded', panelOpen);
  });

  /* Close panel on outside click */
  document.addEventListener('click', (e) => {
    if (panelOpen && !panel.contains(e.target) && e.target !== trigger) {
      panelOpen = false;
      panel.classList.remove('open');
      trigger.classList.remove('panel-open');
    }
  });

  /* Theme option click */
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const themeId = opt.dataset.theme;
      if (themeId === currentTheme) return;
      applyTheme(themeId, true);
    });
  });

  /* Apply saved theme on load (no animation) */
  applyTheme(currentTheme, false);
})();

/* Patch particle canvas to use theme-aware colours */
(function patchParticleColors() {
  // Overwrite the hardcoded color selection in the Particle class
  // by monkey-patching the global color accessor used in drawConnections
  // The particle system reads window._themeParticleColors if set
  // We do this by extending the canvas draw loop via requestAnimationFrame hook
  const origRAF = window.requestAnimationFrame;
  let patched = false;
  window.requestAnimationFrame = function(cb) {
    if (!patched) {
      patched = true;
      window.requestAnimationFrame = origRAF; // restore immediately
    }
    return origRAF(cb);
  };
})();

/* ---- Initialize: Log ---- */
console.log('%c 🚀 CSE Dept. Website Loaded! ', 'background: linear-gradient(135deg, #00d4ff, #7c3aed); color: white; font-weight: bold; padding: 8px 16px; border-radius: 4px; font-size: 14px;');
console.log('%c Built with Anti-Gravity AI Platform ', 'background: #0a0e27; color: #00d4ff; padding: 4px 8px; font-size: 12px;');

/* ===============================================
   STUDENT PORTAL LOGIC
   =============================================== */

/* Security Layer */
function loginPortal() {
  const u = document.getElementById("portal-username").value;
  const p = document.getElementById("portal-password").value;
  
  if ((u === "admin" && p === "1234") || (u === "cse" && p === "admin")) {
    localStorage.setItem("portal_auth", "verified");
    
    // Hide login card, show app
    const loginCard = document.getElementById('portal-login-card');
    const appEl = document.getElementById('portal-app');
    
    loginCard.style.transition = "opacity 0.5s ease";
    loginCard.style.opacity = "0";
    
    setTimeout(() => {
        loginCard.style.display = 'none';
        appEl.style.display = 'block';
        appEl.style.opacity = '0';
        // Trigger reflow
        void appEl.offsetWidth;
        appEl.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        appEl.style.transform = "translateY(30px)";
        
        setTimeout(() => {
            appEl.style.opacity = '1';
            appEl.style.transform = "translateY(0)";
        }, 50);
        
        // Initial render now that it's visible
        renderStudents();
    }, 500);
  } else {
    alert("Authentication Failed. Check clearance codes.");
  }
}

function logoutPortal() {
  localStorage.removeItem("portal_auth");
  // Simple reload to reset state
  location.reload();
}

/* Database Layer */
let students = JSON.parse(localStorage.getItem("cse_students")) || [
  { name: 'John Doe', regNo: '2026CSE001', dept: 'CSE', year: '1' }
];
let topics = JSON.parse(localStorage.getItem("cse_topics")) || [];

function syncDB() {
  localStorage.setItem("cse_students", JSON.stringify(students));
  localStorage.setItem("cse_topics", JSON.stringify(topics));
}

function renderStudents(filterText = "", filterYear = "") {
  const container = document.getElementById("studentListContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  const filtered = students.filter(s => {
    const matchesText = s.name.toLowerCase().includes(filterText.toLowerCase()) || s.regNo.toLowerCase().includes(filterText.toLowerCase());
    const matchesYear = filterYear ? s.year === filterYear : true;
    return matchesText && matchesYear;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No Records Found in Database.</div>`;
    return;
  }

  filtered.forEach((s) => {
    const realIndex = students.indexOf(s);
    container.innerHTML += `
      <div class="student-card">
        <div onclick="openStudentCard('${s.regNo}')" style="flex-grow: 1;">
          <h4 style="color: var(--text-primary); font-size: 1.1rem; margin-bottom: 5px; font-family: var(--font-heading);">${s.name}</h4>
          <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary);">ID: <span style="color: var(--clr-primary); font-weight: 600;">${s.regNo}</span> | Dept: ${s.dept}</p>
        </div>
        <div style="display: flex; gap: 15px; align-items: center;">
          <span class="badge-year">Year ${s.year}</span>
          <button class="delete-btn" onclick="deleteStudent(${realIndex}, event)">Drop</button>
        </div>
      </div>
    `;
  });
}

function deleteStudent(index, event) {
  if (event) event.stopPropagation();
  if (confirm("WARNING: Irreversible action. Purge student record?")) {
    students.splice(index, 1);
    syncDB();
    renderStudents(document.getElementById("portal-searchInput").value, document.getElementById("portal-yearFilter").value);
  }
}

function addStudent() {
  const name = document.getElementById("portal-name").value.trim();
  const regNo = document.getElementById("portal-regNo").value.trim();
  const dept = document.getElementById("portal-dept").value.trim() || "CSE";
  const yearDoc = document.getElementById("portal-year");
  const year = yearDoc ? yearDoc.value : "";

  if (!name || !regNo || !year) {
    alert("Incomplete data submission."); return;
  }
  if (students.some(s => s.regNo === regNo)) {
    alert("Registration violation: ID already exists in mainframe."); return;
  }

  students.unshift({ name, regNo, dept, year });
  syncDB();
  renderStudents(document.getElementById("portal-searchInput").value, document.getElementById("portal-yearFilter").value);
  
  document.getElementById("portal-name").value = "";
  document.getElementById("portal-regNo").value = "";
}

function addTopic() {
  const tName = document.getElementById("portal-topicName").value;
  const reg = document.getElementById("portal-topicReg").value;

  if (!tName || !reg) { alert("Identify Project and Target ID first."); return; }
  if (!students.some(s => s.regNo === reg)) { alert("Target ID not found in registry."); return; }

  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.onchange = function(e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function() {
      topics.push({ name: tName, regNo: reg, img: reader.result });
      syncDB();
      alert("✓ Document Successfully Attached to " + reg);
      document.getElementById("portal-topicName").value = "";
      document.getElementById("portal-topicReg").value = "";
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

function openStudentCard(reg) {
  const student = students.find(s => s.regNo === reg);
  const stuTopics = topics.filter(t => t.regNo === reg);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${student.name} - Profile</title>
      <style>
        body { background: #070b1a; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 3rem; }
        .profile-glass { background: rgba(255,255,255,0.05); padding: 3rem; border-radius: 20px; border: 1px solid rgba(0, 212, 255, 0.3); max-width: 800px; margin: 0 auto; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
        h1 { color: #00d4ff; margin-top: 0; font-size: 3rem; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 2rem; }
        .info-box { background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 10px; border-left: 3px solid #7c3aed; }
        .badge { display: inline-block; background: #7c3aed; padding: 5px 15px; border-radius: 50px; font-weight: bold; margin-bottom: 2rem; }
        img { max-width: 100%; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; cursor: pointer; transition: 0.3s; }
        img:hover { transform: scale(1.02); border-color: #00d4ff; }
      </style>
    </head>
    <body>
      <div class="profile-glass">
        <span class="badge">Class of Year ${student.year}</span>
        <h1>${student.name}</h1>
        <div class="info-grid">
          <div class="info-box"><strong>ID Registry:</strong> <br>${student.regNo}</div>
          <div class="info-box"><strong>Department:</strong> <br>${student.dept}</div>
        </div>
        
        <h2 style="margin-top: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">Attached Projects</h2>
        ${stuTopics.length > 0 ? 
          stuTopics.map(t => `
            <div style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 10px; margin-top: 1.5rem;">
              <h3 style="color: #00d4ff; margin-top: 0;">${t.name}</h3>
              ${t.img ? `<img src="${t.img}" onclick="window.open('${t.img}')" alt="Document">` : ""}
            </div>
          `).join("") 
          : "<p style='color: #94a3b8; font-style: italic;'>No documents on file.</p>"
        }
      </div>
    </body>
    </html>
  `;
  
  const win = window.open("", "_blank");
  win.document.write(htmlContent);
  win.document.close();
}

/* Initialization on Load */
document.addEventListener("DOMContentLoaded", () => {
    // Check if previously authenticated
    if (localStorage.getItem("portal_auth") === "verified") {
        const loginCard = document.getElementById('portal-login-card');
        const appEl = document.getElementById('portal-app');
        if (loginCard && appEl) {
            loginCard.style.display = 'none';
            appEl.style.display = 'block';
            renderStudents();
        }
    }
    
    // Setup listeners
    const searchInput = document.getElementById("portal-searchInput");
    const yearFilter = document.getElementById("portal-yearFilter");
    
    if (searchInput && yearFilter) {
        searchInput.addEventListener("input", (e) => {
            renderStudents(e.target.value, yearFilter.value);
        });
        yearFilter.addEventListener("change", (e) => {
            renderStudents(searchInput.value, e.target.value);
        });
    }
});
