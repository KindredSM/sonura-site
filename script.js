import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrlMeta = document.querySelector('meta[name="supabase-url"]');
const supabaseAnonMeta = document.querySelector('meta[name="supabase-anon-key"]');
const SUPABASE_URL = supabaseUrlMeta ? supabaseUrlMeta.content : '';
const SUPABASE_ANON_KEY = supabaseAnonMeta ? supabaseAnonMeta.content : '';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ctaButton = document.getElementById('cta-button');
const formRow = document.getElementById('form-row');
const emailInput = document.getElementById('email-input');
const sendButton = document.getElementById('send-button');
const feedbackEl = document.getElementById('feedback');
const navCta = document.querySelector('.nav-cta');

function setFeedback(message, type) {
  feedbackEl.textContent = message || '';
  feedbackEl.classList.remove('success', 'error');
  if (type) feedbackEl.classList.add(type);
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  setFeedback('Missing Supabase configuration.', 'error');
  ctaButton.disabled = true;
  sendButton.disabled = true;
}

function toggleToForm() {
  ctaButton.classList.add('hidden');
  formRow.classList.remove('hidden');
  emailInput.focus();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function submitEmail() {
  const email = emailInput.value.trim().toLowerCase();
  if (!isValidEmail(email)) {
    setFeedback('Enter a valid email address.', 'error');
    return;
  }
  setFeedback('');
  emailInput.disabled = true;
  sendButton.disabled = true;
  sendButton.textContent = 'Joining…';
  try {
    const { error } = await supabase.from('waitlist').insert([{ email }], { onConflict: 'email', ignoreDuplicates: true });
    if (error) throw error;
    setFeedback('You are on the waitlist. We will be in touch soon.', 'success');
    sendButton.textContent = 'Joined';
  } catch (e) {
    console.error(e);
    setFeedback(e.message || 'Could not join right now. Try again later.', 'error');
    emailInput.disabled = false;
    sendButton.disabled = false;
    sendButton.textContent = 'Join';
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


