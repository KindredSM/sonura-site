import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Ensure page always starts at top on reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// Fullscreen video function
window.openVideoFullscreen = function() {
  const videoSrc = './videos/Kindred Salway\'s Video - Sep 9, 2025-VEED (2).mp4';
  
  // Create video element
  const video = document.createElement('video');
  video.src = videoSrc;
  video.controls = true;
  video.autoplay = true;
  video.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: black;
    z-index: 10000;
    object-fit: contain;
  `;
  
  const closeModal = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (document.body.contains(video)) {
      document.body.removeChild(video);
    }
    document.body.style.overflow = '';
    // Clean up event listeners
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };
  
  // Handle escape key
  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  
  // Handle fullscreen change events (when user uses video controls or presses ESC)
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && document.body.contains(video)) {
      // User exited fullscreen, clean up the video
      if (document.body.contains(video)) {
        document.body.removeChild(video);
      }
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  };
  
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  document.body.appendChild(video);
  document.body.style.overflow = 'hidden';
  
  // Request fullscreen on the video element
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
};

const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
const supabaseAnonMeta = document.querySelector('meta[name="supabase-anon-key"]');
const SUPABASE_URL = supabaseUrlMeta ? supabaseUrlMeta.content : '';
const SUPABASE_ANON_KEY = supabaseAnonMeta ? supabaseAnonMeta.content : '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ctaButton = document.getElementById('cta-button');
const formRow = document.getElementById('form-row');
const earlyAccessForm = document.getElementById('early-access-form');
const rolesToggle = document.getElementById('roles-toggle');
const rolesPanel = document.getElementById('roles-panel');
const rolesChips = document.getElementById('roles-chips');
const rolesContainer = rolesChips ? rolesChips.closest('.roles') : null;
const emailInput = document.getElementById('email-input');
const sendButton = document.getElementById('send-button');
const feedbackEl = document.getElementById('feedback');
const navCta = document.querySelector('.nav-cta');
const brandLink = document.querySelector('.brand');

// Final CTA elements
const finalCtaButton = document.getElementById('final-cta-button');
const finalEarlyAccessForm = document.getElementById('final-early-access-form');
const finalRolesToggle = document.getElementById('final-roles-toggle');
const finalRolesPanel = document.getElementById('final-roles-panel');
const finalRolesChips = document.getElementById('final-roles-chips');
const finalRolesContainer = finalRolesChips ? finalRolesChips.closest('.roles') : null;
const finalEmailInput = document.getElementById('final-email-input');
const finalSendButton = document.getElementById('final-send-button');
const finalFeedbackEl = document.getElementById('final-feedback');

function setFeedback(message, type, isFinal = false) {
  const feedback = isFinal ? finalFeedbackEl : feedbackEl;
  const input = isFinal ? finalEmailInput : emailInput;
  feedback.textContent = message || '';
  feedback.classList.remove('success', 'error');
  if (type) feedback.classList.add(type);
  input.setAttribute('aria-invalid', type === 'error' ? 'true' : 'false');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  setFeedback('Missing Supabase configuration.', 'error');
  setFeedback('Missing Supabase configuration.', 'error', true);
  ctaButton.disabled = true;
  sendButton.disabled = true;
  if (finalCtaButton) finalCtaButton.disabled = true;
  if (finalSendButton) finalSendButton.disabled = true;
}

function toggleToForm(isFinal = false) {
  if (isFinal) {
    finalCtaButton.classList.add('hidden');
    finalEarlyAccessForm.classList.remove('hidden');
    finalEmailInput.focus();
  } else {
    ctaButton.classList.add('hidden');
    (earlyAccessForm || formRow).classList.remove('hidden');
    emailInput.focus();
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitEmail(isFinal = false) {
  const email = isFinal ? finalEmailInput.value.trim().toLowerCase() : emailInput.value.trim().toLowerCase();
  const form = isFinal ? finalEarlyAccessForm : earlyAccessForm;
  const roles = Array.from(form.querySelectorAll('.role-option[aria-selected="true"]')).map(i => i.getAttribute('data-value'));
  const input = isFinal ? finalEmailInput : emailInput;
  const button = isFinal ? finalSendButton : sendButton;
  
  if (!isValidEmail(email)) {
    setFeedback('Enter a valid email address.', 'error', isFinal);
    return;
  }
  setFeedback('', '', isFinal);
  input.disabled = true;
  button.disabled = true;
  button.textContent = 'Getting early access…';
  try {
    const { error } = await supabase.from('waitlist').insert([{ email, roles }], { onConflict: 'email', ignoreDuplicates: true });
    if (error) throw error;
    setFeedback('You have early access! We will be in touch soon.', 'success', isFinal);
    button.textContent = 'Joined';
  } catch (e) {
    const msg = e && e.message ? String(e.message) : '';
    const isDuplicate = (e && e.code === '23505') || /duplicate key value/i.test(msg) || /unique constraint/i.test(msg);
    if (isDuplicate) {
      setFeedback('You already have early access.', 'success', isFinal);
      button.textContent = 'Joined';
    } else {
      console.error(e);
      setFeedback(msg || 'Could not join right now. Try again later.', 'error', isFinal);
      input.disabled = false;
      button.disabled = false;
      button.textContent = 'Get early access';
    }
  }
}

ctaButton.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleToForm();
});
sendButton.addEventListener('click', submitEmail);
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitEmail();
});

// Final CTA event listeners
if (finalCtaButton) finalCtaButton.addEventListener('click', () => toggleToForm(true));
if (finalSendButton) finalSendButton.addEventListener('click', () => submitEmail(true));
if (finalEmailInput) {
  finalEmailInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitEmail(true);
  });
}

if (navCta) {
  navCta.addEventListener('click', (e) => {
    e.preventDefault();
    const signup = document.getElementById('signup');
    if (signup && signup.scrollIntoView) {
      signup.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (ctaButton.classList.contains('hidden')) {
      emailInput.focus();
    } else {
      toggleToForm();
    }
  });
}

if (brandLink) {
  brandLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

if (earlyAccessForm) {
  earlyAccessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitEmail();
  });
}

function updateChips() {
  const selected = Array.from(earlyAccessForm.querySelectorAll('.role-option[aria-selected="true"]')).map(i => i.getAttribute('data-value'));
  rolesChips.innerHTML = '';
  selected.forEach((value) => {
    const chip = document.createElement('span');
    chip.className = 'roles-chip';
    chip.textContent = value.replace(/\b\w/g, c => c.toUpperCase());
    const x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Remove ' + value);
    x.textContent = '✕';
    x.addEventListener('click', () => {
      const btn = earlyAccessForm.querySelector('.role-option[data-value="' + value + '"]');
      if (btn) btn.setAttribute('aria-selected', 'false');
      updateChips();
    });
    chip.appendChild(x);
    rolesChips.appendChild(chip);
  });
  if (rolesContainer) {
    if (selected.length > 0) rolesContainer.classList.add('has-chips');
    else rolesContainer.classList.remove('has-chips');
  }
}

if (rolesToggle && rolesPanel) {
  rolesToggle.addEventListener('click', () => {
    const expanded = rolesToggle.getAttribute('aria-expanded') === 'true';
    rolesToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    rolesPanel.classList.toggle('open', !expanded);
  });

  document.addEventListener('click', (e) => {
    if (!rolesPanel.classList.contains('open')) return;
    if (!rolesPanel.contains(e.target) && e.target !== rolesToggle) {
      rolesToggle.setAttribute('aria-expanded', 'false');
      rolesPanel.classList.remove('open');
    }
  });

  rolesPanel.addEventListener('click', (e) => {
    const btn = e.target.closest('.role-option');
    if (!btn) return;
    const value = btn.getAttribute('data-value');
    const selected = btn.getAttribute('aria-selected') === 'true';
    btn.setAttribute('aria-selected', selected ? 'false' : 'true');
    updateChips();
  });
}

// Final CTA roles functionality
function updateFinalChips() {
  const selected = Array.from(finalEarlyAccessForm.querySelectorAll('.role-option[aria-selected="true"]')).map(i => i.getAttribute('data-value'));
  finalRolesChips.innerHTML = '';
  selected.forEach((value) => {
    const chip = document.createElement('span');
    chip.className = 'roles-chip';
    chip.textContent = value.replace(/\b\w/g, c => c.toUpperCase());
    const x = document.createElement('button');
    x.type = 'button';
    x.setAttribute('aria-label', 'Remove ' + value);
    x.textContent = '✕';
    x.addEventListener('click', () => {
      const btn = finalEarlyAccessForm.querySelector('.role-option[data-value="' + value + '"]');
      if (btn) btn.setAttribute('aria-selected', 'false');
      updateFinalChips();
    });
    chip.appendChild(x);
    finalRolesChips.appendChild(chip);
  });
  if (finalRolesContainer) {
    if (selected.length > 0) finalRolesContainer.classList.add('has-chips');
    else finalRolesContainer.classList.remove('has-chips');
  }
}

if (finalRolesToggle && finalRolesPanel) {
  finalRolesToggle.addEventListener('click', () => {
    const expanded = finalRolesToggle.getAttribute('aria-expanded') === 'true';
    finalRolesToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    finalRolesPanel.classList.toggle('open', !expanded);
  });

  document.addEventListener('click', (e) => {
    if (!finalRolesPanel.classList.contains('open')) return;
    if (!finalRolesPanel.contains(e.target) && e.target !== finalRolesToggle) {
      finalRolesToggle.setAttribute('aria-expanded', 'false');
      finalRolesPanel.classList.remove('open');
    }
  });

  finalRolesPanel.addEventListener('click', (e) => {
    const btn = e.target.closest('.role-option');
    if (!btn) return;
    const value = btn.getAttribute('data-value');
    const selected = btn.getAttribute('aria-selected') === 'true';
    btn.setAttribute('aria-selected', selected ? 'false' : 'true');
    updateFinalChips();
  });
}

if (finalEarlyAccessForm) {
  finalEarlyAccessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitEmail(true);
  });
}

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

