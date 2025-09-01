import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
const supabaseAnonMeta = document.querySelector('meta[name="supabase-anon-key"]');
const SUPABASE_URL = supabaseUrlMeta ? supabaseUrlMeta.content : '';
const SUPABASE_ANON_KEY = supabaseAnonMeta ? supabaseAnonMeta.content : '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ctaButton = document.getElementById('cta-button');
const formRow = document.getElementById('form-row');
const waitlistForm = document.getElementById('waitlist-form');
const rolesToggle = document.getElementById('roles-toggle');
const rolesPanel = document.getElementById('roles-panel');
const rolesChips = document.getElementById('roles-chips');
const rolesContainer = rolesChips ? rolesChips.closest('.roles') : null;
const emailInput = document.getElementById('email-input');
const sendButton = document.getElementById('send-button');
const feedbackEl = document.getElementById('feedback');
const navCta = document.querySelector('.nav-cta');

function setFeedback(message, type) {
  feedbackEl.textContent = message || '';
  feedbackEl.classList.remove('success', 'error');
  if (type) feedbackEl.classList.add(type);
  emailInput.setAttribute('aria-invalid', type === 'error' ? 'true' : 'false');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  setFeedback('Missing Supabase configuration.', 'error');
  ctaButton.disabled = true;
  sendButton.disabled = true;
}

function toggleToForm() {
  ctaButton.classList.add('hidden');
  (waitlistForm || formRow).classList.remove('hidden');
  emailInput.focus();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitEmail() {
  const email = emailInput.value.trim().toLowerCase();
  const roles = Array.from(waitlistForm.querySelectorAll('.role-option[aria-selected="true"]')).map(i => i.getAttribute('data-value'));
  if (!isValidEmail(email)) {
    setFeedback('Enter a valid email address.', 'error');
    return;
  }
  setFeedback('');
  emailInput.disabled = true;
  sendButton.disabled = true;
  sendButton.textContent = 'Joining…';
  try {
    const { error } = await supabase.from('waitlist').insert([{ email, roles }], { onConflict: 'email', ignoreDuplicates: true });
    if (error) throw error;
    setFeedback('You are on the waitlist. We will be in touch soon.', 'success');
    sendButton.textContent = 'Joined';
  } catch (e) {
    const msg = e && e.message ? String(e.message) : '';
    const isDuplicate = (e && e.code === '23505') || /duplicate key value/i.test(msg) || /unique constraint/i.test(msg);
    if (isDuplicate) {
      setFeedback('You are already on the waitlist.', 'success');
      sendButton.textContent = 'Joined';
    } else {
      console.error(e);
      setFeedback(msg || 'Could not join right now. Try again later.', 'error');
      emailInput.disabled = false;
      sendButton.disabled = false;
      sendButton.textContent = 'Join';
    }
  }
}

ctaButton.addEventListener('click', toggleToForm);
sendButton.addEventListener('click', submitEmail);
emailInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitEmail();
});

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

if (waitlistForm) {
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitEmail();
  });
}

function updateChips() {
  const selected = Array.from(waitlistForm.querySelectorAll('.role-option[aria-selected="true"]')).map(i => i.getAttribute('data-value'));
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
      const btn = waitlistForm.querySelector('.role-option[data-value="' + value + '"]');
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


