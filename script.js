// Ensure page always starts at top on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Video modal function
window.openVideoFullscreen = function() {
  // Create modal backdrop
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
  `;
  
  // Create video element
  const video = document.createElement('video');
  video.src = './videos/sonura desktop ad.mp4';
  video.controls = true;
  video.preload = 'metadata';
  video.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  `;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    font-weight: 300;
    line-height: 1;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: 0.3s;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    closeBtn.style.transform = 'scale(1.1)';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    closeBtn.style.transform = 'scale(1)';
  });
  
  // Clean up function
  const cleanup = () => {
    if (document.body.contains(modal)) {
      document.body.removeChild(modal);
    }
    document.removeEventListener('keydown', handleKeydown);
  };
  
  // Handle escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      cleanup();
    }
  };
  
  // Close modal function
  const closeModal = () => {
    cleanup();
  };
  
  // Add event listeners
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  video.addEventListener('ended', cleanup);
  video.addEventListener('loadeddata', () => {
    video.play();
  });
  document.addEventListener('keydown', handleKeydown);
  
  // Append elements
  modal.appendChild(video);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);
};

const brandLink = document.querySelector('.brand');

 

if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    if (brandLink.getAttribute('href') === '#' || window.location.pathname === '/' || window.location.pathname === '/index.html') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

const faqDetails = document.querySelectorAll('.faq details');
faqDetails.forEach((el) => {
  const summary = el.querySelector('summary');
  const contents = [];
  el.childNodes.forEach((n) => {
    if (n.nodeType === 1 && n.tagName !== 'SUMMARY') contents.push(n);
  });
  const wrapper = document.createElement('div');
  while (contents.length) wrapper.appendChild(contents.shift());
  el.appendChild(wrapper);

  function openDetails() {
    el.open = true;
    wrapper.style.height = 'auto';
    const h = wrapper.scrollHeight;
    wrapper.style.height = '0px';
    wrapper.getBoundingClientRect();
    wrapper.style.height = h + 'px';
    wrapper.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'height') {
        wrapper.style.height = 'auto';
        wrapper.removeEventListener('transitionend', handler);
      }
    });
  }

  function closeDetails() {
    const h = wrapper.scrollHeight;
    wrapper.style.height = h + 'px';
    wrapper.getBoundingClientRect();
    wrapper.style.height = '0px';
    wrapper.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'height') {
        el.open = false;
        wrapper.removeEventListener('transitionend', handler);
      }
    });
  }

  if (el.open) {
    wrapper.style.height = 'auto';
  } else {
    wrapper.style.height = '0px';
  }

  if (summary) {
    summary.addEventListener('click', (e) => {
      if (el.open) {
        e.preventDefault();
        closeDetails();
      } else {
        e.preventDefault();
        openDetails();
      }
    });
  }
});

 

 

 

 

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
      if (entry.isIntersecting) {
        const delay = target.getAttribute('data-reveal-delay');
        if (delay) target.style.transitionDelay = delay;
        target.classList.add('in-view');
        observer.unobserve(target);
      }
    }
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  let velocity = 0;
  let lastScrollY = window.scrollY;
  function onScroll() {
    const current = window.scrollY;
    velocity = current - lastScrollY;
    lastScrollY = current;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
}

// Scroll indicator functionality
const scrollArrow = document.querySelector('.scroll-arrow');
if (scrollArrow) {
  scrollArrow.addEventListener('click', () => {
    const demoSection = document.querySelector('.demo');
    if (demoSection) {
      const rect = demoSection.getBoundingClientRect();
      const offset = window.pageYOffset + rect.top - 80; // 80px offset from top
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
}

// Handle nav scroll behavior
const nav = document.querySelector('.nav');

function handleNavScroll() {
  const currentScrollY = window.scrollY;
  
  if (currentScrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mobileMenu.classList.remove('active');
    }
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('mobile-menu-item')) {
      mobileMenu.classList.remove('active');
    }
  });
}


function fmt(t) {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return m + ':' + String(s).padStart(2, '0');
}

let currentlyPlaying = null;

function pauseAllPlayers() {
  document.querySelectorAll('.player-audio').forEach(audio => {
    if (!audio.paused) {
      audio.pause();
      const player = audio.closest('.player');
      const playBtn = player.querySelector('.player-play');
      playBtn.innerHTML = '<i data-lucide="play"></i>';
    }
  });
  currentlyPlaying = null;
}

document.querySelectorAll('.player').forEach((player) => {
  const audio = player.querySelector('.player-audio');
  const playBtn = player.querySelector('.player-play');
  const backBtn = player.querySelector('.player-back');
  const fwdBtn = player.querySelector('.player-forward');
  const seek = player.querySelector('.player-seek');
  const cur = player.querySelector('.player-current');
  const dur = player.querySelector('.player-duration');
  const vol = player.querySelector('.player-volume');

  if (audio) {
    audio.addEventListener('loadedmetadata', () => {
      seek.max = String(Math.floor(audio.duration));
      dur.textContent = fmt(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      seek.value = String(Math.floor(audio.currentTime));
      cur.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      playBtn.innerHTML = '<i data-lucide="play"></i>';
      currentlyPlaying = null;
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        pauseAllPlayers();
        audio.play();
        playBtn.innerHTML = '<i data-lucide="pause"></i>';
        currentlyPlaying = audio;
      } else {
        audio.pause();
        playBtn.innerHTML = '<i data-lucide="play"></i>';
        currentlyPlaying = null;
      }
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    });
  }

  if (fwdBtn) {
    fwdBtn.addEventListener('click', () => {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
    });
  }

  if (seek) {
    seek.addEventListener('input', () => {
      audio.currentTime = Number(seek.value);
    });
  }

  if (vol && audio) {
    vol.addEventListener('input', () => {
      audio.volume = Number(vol.value);
    });
    audio.volume = Number(vol.value);
  }
});

/* cache buster */