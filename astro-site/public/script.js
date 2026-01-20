// Ensure page always starts at top on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.playHeroVideo = function() {
  const container = document.getElementById('hero-video-container');
  const thumbnail = document.getElementById('video-thumbnail');
  const overlay = document.getElementById('video-overlay');
  
  if (!container || !thumbnail) return;
  
  const iframe = document.createElement('iframe');
  iframe.className = 'hero-video-element';
  iframe.src = 'https://www.youtube.com/embed/xUuqIAWetXk?rel=0&modestbranding=1&autoplay=1';
  iframe.title = 'Sonura AI Music Generator Demo';
  iframe.frameBorder = '0';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  thumbnail.remove();
  if (overlay) overlay.remove();
  container.appendChild(iframe);
};

window.openVideoFullscreen = function() {
  if (document.getElementById('video-modal')) return;
  
  const modal = document.createElement('div');
  modal.id = 'video-modal';
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
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  const video = document.createElement('video');
  video.src = './videos/sonura desktop ad.mp4';
  video.controls = true;
  video.preload = 'metadata';
  video.style.cssText = `
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    transform: scale(0.95);
    transition: transform 0.3s ease;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
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
  
  let isCleaningUp = false;
  
  const handleMouseEnter = () => {
    if (isCleaningUp) return;
    closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    closeBtn.style.transform = 'scale(1.1)';
  };
  
  const handleMouseLeave = () => {
    if (isCleaningUp) return;
    closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    closeBtn.style.transform = 'scale(1)';
  };
  
  closeBtn.addEventListener('mouseenter', handleMouseEnter);
  closeBtn.addEventListener('mouseleave', handleMouseLeave);
  
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && !isCleaningUp) {
      cleanup();
    }
  };
  
  const handleModalClick = (e) => {
    if (e.target === modal && !isCleaningUp) {
      cleanup();
    }
  };
  
  const handleVideoEnded = () => {
    if (!isCleaningUp) cleanup();
  };
  
  const handleVideoLoaded = () => {
    if (!isCleaningUp) video.play();
  };
  
  const cleanup = () => {
    if (isCleaningUp) return;
    isCleaningUp = true;
    
    modal.style.opacity = '0';
    video.style.transform = 'scale(0.95)';
    video.pause();
    video.src = '';
    
    closeBtn.removeEventListener('mouseenter', handleMouseEnter);
    closeBtn.removeEventListener('mouseleave', handleMouseLeave);
    closeBtn.removeEventListener('click', cleanup);
    modal.removeEventListener('click', handleModalClick);
    video.removeEventListener('ended', handleVideoEnded);
    video.removeEventListener('loadeddata', handleVideoLoaded);
    document.removeEventListener('keydown', handleKeydown);
    
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 300);
  };
  
  closeBtn.addEventListener('click', cleanup);
  modal.addEventListener('click', handleModalClick);
  video.addEventListener('ended', handleVideoEnded);
  video.addEventListener('loadeddata', handleVideoLoaded);
  document.addEventListener('keydown', handleKeydown);
  
  modal.appendChild(video);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);

  requestAnimationFrame(() => {
    modal.style.opacity = '1';
    video.style.transform = 'scale(1)';
  });
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

// FAQ Logic
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

  let transitionHandler = null;
  
  function openDetails() {
    if (transitionHandler) {
      wrapper.removeEventListener('transitionend', transitionHandler);
      transitionHandler = null;
    }
    
    el.open = true;
    wrapper.style.height = 'auto';
    const h = wrapper.scrollHeight;
    wrapper.style.height = '0px';
    wrapper.getBoundingClientRect();
    wrapper.style.height = h + 'px';
    
    transitionHandler = function handler(e) {
      if (e.propertyName === 'height' && e.target === wrapper) {
        wrapper.style.height = 'auto';
        transitionHandler = null;
      }
    };
    wrapper.addEventListener('transitionend', transitionHandler, { once: true });
  }

  function closeDetails() {
    if (transitionHandler) {
      wrapper.removeEventListener('transitionend', transitionHandler);
      transitionHandler = null;
    }
    
    const h = wrapper.scrollHeight;
    wrapper.style.height = h + 'px';
    wrapper.getBoundingClientRect();
    wrapper.style.height = '0px';
    
    transitionHandler = function handler(e) {
      if (e.propertyName === 'height' && e.target === wrapper) {
        el.open = false;
        transitionHandler = null;
      }
    };
    wrapper.addEventListener('transitionend', transitionHandler, { once: true });
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

// GSAP Animations
let scrollTriggers = [];

function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  if (typeof ScrollTrigger.getAll === 'function') {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
  }
  scrollTriggers = [];

  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => {
    const delay = element.getAttribute('data-reveal-delay') 
      ? parseFloat(element.getAttribute('data-reveal-delay')) 
      : 0;

    const animation = gsap.fromTo(element, 
      { 
        y: 30, 
        opacity: 0 
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: delay,
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          toggleActions: "play none none reverse",
          toggleClass: "in-view"
        }
      }
    );
    
    if (animation.scrollTrigger) {
      scrollTriggers.push(animation.scrollTrigger);
    }
  });

  const cables = document.querySelectorAll('.cable-path');
  cables.forEach((cable) => {
    const length = cable.getTotalLength();
    
    gsap.set(cable, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0.6
    });

    const animation = gsap.to(cable, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: cable.closest('section'),
        start: "top 70%"
      }
    });
    
    if (animation.scrollTrigger) {
      scrollTriggers.push(animation.scrollTrigger);
    }
  });
}

function cleanupGSAPAnimations() {
  scrollTriggers.forEach(trigger => {
    if (trigger && typeof trigger.kill === 'function') {
      trigger.kill();
    }
  });
  scrollTriggers = [];
  
  if (typeof ScrollTrigger !== 'undefined' && typeof ScrollTrigger.getAll === 'function') {
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger && typeof trigger.kill === 'function') {
        trigger.kill();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initGSAPAnimations);
} else {
  initGSAPAnimations();
}

window.addEventListener('beforeunload', cleanupGSAPAnimations);

if (window.lucide && window.lucide.createIcons) {
  window.lucide.createIcons();
}

// Nav Scroll
const nav = document.querySelector('.nav');
let scrollTimeout = null;
function handleNavScroll() {
  if (scrollTimeout) return;
  scrollTimeout = requestAnimationFrame(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    scrollTimeout = null;
  });
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

// Mobile Menu
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

// Audio Players
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
    let timeUpdateTimeout = null;
    
    audio.addEventListener('loadedmetadata', () => {
      seek.max = String(Math.floor(audio.duration));
      dur.textContent = fmt(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      if (timeUpdateTimeout) return;
      timeUpdateTimeout = requestAnimationFrame(() => {
        seek.value = String(Math.floor(audio.currentTime));
        cur.textContent = fmt(audio.currentTime);
        timeUpdateTimeout = null;
      });
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

  // Simplified event listeners for other controls
  if (backBtn) backBtn.addEventListener('click', () => audio.currentTime = Math.max(0, audio.currentTime - 10));
  if (fwdBtn) fwdBtn.addEventListener('click', () => audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10));
  if (seek) seek.addEventListener('input', () => audio.currentTime = Number(seek.value));
  if (vol && audio) {
    vol.addEventListener('input', () => audio.volume = Number(vol.value));
    audio.volume = Number(vol.value);
  }
});
