/**
 * MAHANANDIGARI HARSHA VARDHAN REDDY - PORTFOLIO INTERACTION ENGINE
 * Seamless Page Switching, Ambient Canvas Physics, Audio FX & Modal Systems
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentSection: 'home',
    mode: 'page', // 'page' or 'scroll'
    soundEnabled: true,
    audioCtx: null,
    sections: ['home', 'experience', 'skills', 'education', 'projects']
  };

  // Cache DOM Elements
  const body = document.body;
  const navPills = document.querySelectorAll('.nav-pill');
  const pageSections = document.querySelectorAll('.page-section');
  const modeToggleBtn = document.getElementById('mode-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioOnIcon = document.querySelector('.audio-on-icon');
  const audioOffIcon = document.querySelector('.audio-off-icon');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const headerContactBtn = document.getElementById('header-contact-btn');
  const mobileContactBtn = document.getElementById('mobile-contact-btn');
  const heroExploreBtn = document.getElementById('hero-explore-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const connectModalBtn = document.getElementById('connect-modal-btn');
  const projectModal = document.getElementById('project-modal');
  const contactModal = document.getElementById('contact-modal');
  const resumeModal = document.getElementById('resume-modal');
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // SYNTHESIZED SOUND EFFECTS (WEB AUDIO API)
  // =========================================================================
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        state.audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, state.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, state.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start();
      osc.stop(state.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  function playClickSound() {
    playTone(720, 'sine', 0.07, 0.04);
  }

  function playHoverSound() {
    playTone(480, 'triangle', 0.04, 0.015);
  }

  function playSuccessSound() {
    playTone(520, 'sine', 0.1, 0.04);
    setTimeout(() => playTone(880, 'sine', 0.18, 0.05), 100);
  }

  // Audio Toggle Button
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      if (state.soundEnabled) {
        audioOnIcon.classList.remove('hidden');
        audioOffIcon.classList.add('hidden');
        showToast('Sound effects enabled');
        playClickSound();
      } else {
        audioOnIcon.classList.add('hidden');
        audioOffIcon.classList.remove('hidden');
        showToast('Sound effects muted');
      }
    });
  }

  // =========================================================================
  // NAVIGATION & VIEW SWITCHING (PAGE MODE vs SCROLL MODE)
  // =========================================================================
  function switchPage(targetId) {
    if (!targetId) return;
    state.currentSection = targetId;

    if (state.mode === 'page') {
      pageSections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    } else {
      const el = document.getElementById(targetId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    // Update Nav Pills Highlight
    navPills.forEach(pill => {
      if (pill.getAttribute('data-target') === targetId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Update Mobile Nav
    mobileNavLinks.forEach(link => {
      if (link.getAttribute('data-target') === targetId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Mobile Bottom Bar
    document.querySelectorAll('.mobile-bottom-btn').forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    playClickSound();
  }

  // Mobile Bottom Bar Click Handlers
  document.querySelectorAll('.mobile-bottom-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchPage(target);
    });
  });

  // Nav Pills Click
  navPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const target = pill.getAttribute('data-target');
      switchPage(target);
    });
    pill.addEventListener('mouseenter', playHoverSound);
  });

  // Slide Next Arrow Buttons
  document.querySelectorAll('.slide-next-arrow').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchPage(target);
    });
    btn.addEventListener('mouseenter', playHoverSound);
  });

  // Brand Logo Click -> Go to Home
  document.getElementById('brand-logo').addEventListener('click', (e) => {
    e.preventDefault();
    switchPage('home');
  });

  // Mode Toggle (Slide Presentation Mode vs One-Page Continuous Scroll Mode)
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      const modeText = modeToggleBtn.querySelector('.mode-text');
      if (state.mode === 'page') {
        state.mode = 'scroll';
        body.classList.remove('page-mode');
        body.classList.add('scroll-mode');
        modeText.textContent = 'Scroll View';
        showToast('Switched to Continuous Scroll Mode');
      } else {
        state.mode = 'page';
        body.classList.remove('scroll-mode');
        body.classList.add('page-mode');
        modeText.textContent = 'Page View';
        switchPage(state.currentSection);
        showToast('Switched to Slide Pages Mode');
      }
      playClickSound();
    });
  }

  // Continuous Scroll Spy (Intersection Observer)
  const scrollObserver = new IntersectionObserver((entries) => {
    if (state.mode !== 'scroll') return;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        state.currentSection = id;
        navPills.forEach(pill => {
          if (pill.getAttribute('data-target') === id) {
            pill.classList.add('active');
          } else {
            pill.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  pageSections.forEach(sec => scrollObserver.observe(sec));

  // =========================================================================
  // MOBILE DRAWER
  // =========================================================================
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      playClickSound();
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      playClickSound();
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      mobileDrawer.classList.remove('open');
      if (target === 'contact') {
        openContactModal();
      } else {
        switchPage(target);
      }
    });
  });

  // =========================================================================
  // CTA BUTTON ACTIONS
  // =========================================================================
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', () => switchPage('projects'));
    heroExploreBtn.addEventListener('mouseenter', playHoverSound);
  }

  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', openResumeModal);
    heroResumeBtn.addEventListener('mouseenter', playHoverSound);
  }

  if (headerContactBtn) {
    headerContactBtn.addEventListener('click', openContactModal);
    headerContactBtn.addEventListener('mouseenter', playHoverSound);
  }

  if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      openContactModal();
    });
  }

  if (connectModalBtn) {
    connectModalBtn.addEventListener('click', openContactModal);
    connectModalBtn.addEventListener('mouseenter', playHoverSound);
  }

  // =========================================================================
  // PROJECT MODAL CONTENT & LOGIC
  // =========================================================================
  const projectsData = {
    agrivision: {
      title: 'Agri Vision',
      category: 'AI & Machine Learning / Agriculture',
      image: 'assets/proj-agrivision-hd.jpg',
      tagline: 'Multilingual Agri Assistant with Crop Recommendation & Plant Vision',
      description: 'An AI-powered agricultural platform designed to empower farmers across diverse regions. It combines advanced Computer Vision for instantaneous pest and disease detection with multi-factor soil, weather, and fertilizer recommendation engines.',
      techStack: ['Python', 'Next.js', 'Machine Learning', 'Computer Vision', 'NLP', 'APIs'],
      metrics: [
        { label: 'Classification Accuracy', val: '94.8%' },
        { label: 'Supported Languages', val: '6 Indian Languages' },
        { label: 'Plant Pathologies', val: '38+ Crops & Diseases' }
      ],
      features: [
        'Developed an AI-powered agricultural platform featuring crop recommendation, pest detection, and fertilizer calculator.',
        'Integrated machine learning models with weather and market APIs to provide real-time insights for farmers.',
        'Built multilingual AI assistant supporting voice and text interactions using Natural Language Processing.',
        'Designed responsive dashboard using Next.js for seamless user experience across devices.'
      ],
      github: 'https://github.com',
      demo: 'https://github.com'
    },
    sevasetu: {
      title: 'Seva Setu',
      category: 'Social Impact / AI & Blockchain Platform',
      image: 'assets/proj-sevasetu-hd.jpg',
      tagline: 'Direct-to-worker platform connecting users with verified skilled professionals',
      description: 'A direct-to-worker platform connecting users with verified skilled professionals using AI-driven smart matching, automated task analysis, and blockchain-backed transparency.',
      techStack: ['Python', 'OpenCV', 'React', 'SQL', 'AI/ML', 'Blockchain'],
      metrics: [
        { label: 'Worker Onboarding', val: '1,200+ Profiles' },
        { label: 'Match Latency', val: '< 30 Seconds' },
        { label: 'Verification', val: 'Blockchain Secured' }
      ],
      features: [
        'Created direct-to-worker platform connecting users with verified skilled professionals using AI-driven smart matching.',
        'Implemented AI task analysis system to determine DIY vs professional hire recommendations.',
        'Integrated blockchain-based verification and payment system ensuring transparent transactions.',
        'Developed secure profile validation using computer vision and machine learning models.'
      ],
      github: 'https://github.com',
      demo: 'https://github.com'
    },
    salespulse: {
      title: 'Sales Pulse Dashboard',
      category: 'Business Intelligence & Predictive Analytics',
      image: 'assets/proj-salespulse-hd.jpg',
      tagline: 'Real-time Fraud & Enterprise Sales Analytics Engine',
      description: 'An interactive BI dashboard visualizing multi-dimensional sales metrics across markets, segments, and categories with real-time decision support for stakeholders.',
      techStack: ['Power BI', 'Python', 'DAX', 'SQL', 'Predictive Modeling'],
      metrics: [
        { label: 'ETL Throughput', val: '2.4M Records / hr' },
        { label: 'Decision Latency', val: 'Real-time Support' },
        { label: 'Trend Analysis', val: 'Sales, Profit & Discount' }
      ],
      features: [
        'Designed interactive BI dashboard visualizing multi-dimensional sales metrics across markets, segments, and categories.',
        'Implemented dynamic filters, KPIs, and visual analytics (pie, bar, line charts) for actionable business insights.',
        'Processed backend data using Python to enable real-time decision support for stakeholders.',
        'Analyzed sales, profit, and discount trends to identify optimization opportunities.'
      ],
      github: 'https://github.com',
      demo: 'https://github.com'
    },
    weather: {
      title: 'Weather Report Dashboard',
      category: 'Meteorological Analytics & Decision Support',
      image: 'assets/proj-weather-hd.jpg',
      tagline: 'Interactive Weather Analytics Dashboard with Real-time Data Feeds',
      description: 'An interactive weather analytics dashboard with real-time feeds, advanced DAX calculations, and dynamic filtering to empower weather-dependent operations.',
      techStack: ['Power BI', 'DAX', 'Python', 'Data Transformation'],
      metrics: [
        { label: 'Calculation Engine', val: 'Advanced DAX' },
        { label: 'Data Processing', val: 'Python Automated' },
        { label: 'Filtering', val: 'Dynamic Multi-tier' }
      ],
      features: [
        'Built interactive weather analytics dashboard with real-time data feeds and advanced DAX calculations.',
        'Performed data preparation, transformation, and visualization revealing hidden weather trends.',
        'Integrated dynamic filtering capabilities improving decision-making for weather-dependent operations.'
      ],
      github: 'https://github.com',
      demo: 'https://github.com'
    }
  };

  function openProjectModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    const modalContent = document.getElementById('project-modal-content');
    modalContent.innerHTML = `
      <div class="project-modal-header" style="margin-bottom: 1.5rem;">
        <span class="modal-tag">${data.category}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.9rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem; margin-bottom: 0.35rem;">${data.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.98rem;">${data.tagline}</p>
      </div>

      <div style="width: 100%; height: 210px; border-radius: 14px; overflow: hidden; margin-bottom: 1.6rem; border: 1px solid rgba(255, 255, 255, 0.12);">
        <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin-bottom: 1.6rem;">
        ${data.metrics.map(m => `
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 0.75rem 0.9rem; border-radius: 12px; text-align: center;">
            <div style="font-size: 1.15rem; font-weight: 800; color: #ffffff; font-family: var(--font-heading);">${m.val}</div>
            <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.5px;">${m.label}</div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #ffffff; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5rem;">Overview</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.55;">${data.description}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="color: #ffffff; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.6rem;">Key Capabilities</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
          ${data.features.map(f => `
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.88rem; color: #cbd5e1;">
              <span style="color: #38bdf8; font-weight: bold;">✦</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 1.8rem;">
        <h4 style="color: #ffffff; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.6rem;">Technologies Applied</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.45rem;">
          ${data.techStack.map(t => `<span class="mini-tag" style="background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); font-size: 0.78rem; padding: 0.25rem 0.65rem;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 0.8rem; margin-top: 1rem;">
        <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 0.6rem 1.3rem; font-size: 0.88rem; text-decoration: none;">
          <span>GitHub Code</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 0.6rem 1.3rem; font-size: 0.88rem; text-decoration: none;">
          <span>Live Demo</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    playClickSound();
  }

  // Hook up "View Project" buttons
  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      openProjectModal(projId);
    });
    btn.addEventListener('mouseenter', playHoverSound);
  });

  // Modal Closers
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    playClickSound();
  });

  // =========================================================================
  // CONTACT MODAL & FORM SUBMISSION
  // =========================================================================
  function openContactModal() {
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    playClickSound();
  }

  document.getElementById('contact-modal-close-btn').addEventListener('click', () => {
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    playClickSound();
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Sending...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactModal.classList.remove('open');
        contactForm.reset();
        playSuccessSound();
        showToast('Message sent successfully! Harsha will reach back soon.');
      }, 900);
    });
  }

  // =========================================================================
  // RESUME MODAL & PRINT/DOWNLOAD
  // =========================================================================
  function openResumeModal() {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    playClickSound();
  }

  document.getElementById('resume-modal-close-btn').addEventListener('click', () => {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    playClickSound();
  });

  document.getElementById('resume-print-btn').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('resume-download-btn').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Downloading Harsha_Vardhan_Reddy_Resume.pdf...');
    playSuccessSound();
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#resume-download';
    link.download = 'Mahanandigari_Harsha_Vardhan_Reddy_Resume.pdf';
    document.body.appendChild(link);
    setTimeout(() => document.body.removeChild(link), 100);
  });

  // Global Backdrop Click Closes Modals
  [projectModal, contactModal, resumeModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        playClickSound();
      }
    });
  });

  // Keyboard Shortcuts: Esc to close modal, 1-5 to switch sections
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [projectModal, contactModal, resumeModal].forEach(m => m.classList.remove('open'));
      mobileDrawer.classList.remove('open');
    }
    // Only if not typing in form
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key >= '1' && e.key <= '5') {
      const idx = parseInt(e.key) - 1;
      switchPage(state.sections[idx]);
    } else if (e.key === 'ArrowRight' && state.mode === 'page') {
      const currentIdx = state.sections.indexOf(state.currentSection);
      const nextIdx = (currentIdx + 1) % state.sections.length;
      switchPage(state.sections[nextIdx]);
    } else if (e.key === 'ArrowLeft' && state.mode === 'page') {
      const currentIdx = state.sections.indexOf(state.currentSection);
      const prevIdx = (currentIdx - 1 + state.sections.length) % state.sections.length;
      switchPage(state.sections[prevIdx]);
    }
  });

  // =========================================================================
  // TOAST NOTIFICATION HELPER
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'all 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // =========================================================================
  // 3D MOUSE PARALLAX TILT EFFECT
  // =========================================================================
  const tiltCard = document.getElementById('portrait-3d-wrap');
  if (tiltCard) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;
      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
      tiltCard.style.transition = 'transform 0.6s ease';
    });

    tiltCard.addEventListener('mouseenter', () => {
      tiltCard.style.transition = 'none';
    });
  }

  // =========================================================================
  // INTERACTIVE AMBIENT CANVAS (NEURAL PARTICLES & CONSTELLATION)
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    const mouse = { x: null, y: null, radius: 120 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.8 + 0.8;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse gentle repulsion/interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  // Set initial page from hash if present
  const initialHash = window.location.hash.replace('#', '');
  if (state.sections.includes(initialHash)) {
    switchPage(initialHash);
  }
});
