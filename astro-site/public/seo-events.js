(function () {
  const APP_HOST = 'app.sonurastudio.com';
  const STORAGE_KEY = 'sonura_first_touch';
  const ATTR_KEYS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'msclkid',
  ];

  function pageType(pathname) {
    if (pathname === '/' || pathname === '/index.html') return 'homepage';
    const first = pathname.split('/').filter(Boolean)[0];
    return first || 'homepage';
  }

  function campaignIntent(pathname) {
    if (pathname.startsWith('/pricing')) return 'subscription';
    if (pathname.startsWith('/alternatives')) return 'competitor_comparison';
    if (pathname.startsWith('/plugin')) return 'plugin_download';
    if (pathname.startsWith('/tools')) return 'free_tool_to_paid';
    if (pathname.startsWith('/samples')) return 'sample_generation';
    if (pathname.startsWith('/genre')) return 'genre_creation';
    if (pathname.startsWith('/use-cases')) return 'use_case';
    if (pathname.startsWith('/features')) return 'feature';
    if (pathname.startsWith('/blog')) return 'content';
    return 'general';
  }

  // Hostnames of AI assistants / answer engines that can send referral traffic.
  // Detection is best-effort: some assistants strip the referrer, but when present
  // this lets us measure LLM/AI-search visibility ("LLMSEO") instead of guessing.
  const AI_REFERRERS = [
    { host: 'chatgpt.com', source: 'chatgpt' },
    { host: 'chat.openai.com', source: 'chatgpt' },
    { host: 'perplexity.ai', source: 'perplexity' },
    { host: 'gemini.google.com', source: 'gemini' },
    { host: 'bard.google.com', source: 'gemini' },
    { host: 'claude.ai', source: 'claude' },
    { host: 'copilot.microsoft.com', source: 'copilot' },
    { host: 'you.com', source: 'you' },
    { host: 'poe.com', source: 'poe' },
    { host: 'grok.com', source: 'grok' },
  ];

  function aiReferrerSource(referrer) {
    if (!referrer) return '';
    let host;
    try {
      host = new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
    const match = AI_REFERRERS.find(
      (entry) => host === entry.host || host.endsWith('.' + entry.host)
    );
    return match ? match.source : '';
  }

  function getSearchParams() {
    const params = new URLSearchParams(window.location.search);
    return ATTR_KEYS.reduce((acc, key) => {
      const value = params.get(key);
      if (value) acc[key] = value;
      return acc;
    }, {});
  }

  function readFirstTouch() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeFirstTouch(touch) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
    } catch {
      // localStorage may be blocked; link decoration still uses in-memory data.
    }
  }

  function getFirstTouch() {
    const existing = readFirstTouch();
    if (existing && existing.first_landing_page) {
      // a visitor from before the cookie shipped still has their origin in localStorage
      writeFirstTouchCookie(existing);
      return existing;
    }

    const touch = {
      first_landing_page: window.location.pathname + window.location.search,
      first_landing_path: window.location.pathname,
      first_page_type: pageType(window.location.pathname),
      first_campaign_intent: campaignIntent(window.location.pathname),
      first_referrer: document.referrer || '',
      first_ai_referrer: aiReferrerSource(document.referrer),
      first_touch_ts: new Date().toISOString(),
      ...getSearchParams(),
    };
    writeFirstTouch(touch);
    writeFirstTouchCookie(touch);
    return touch;
  }

  function currentContext(extra) {
    return {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_type: pageType(window.location.pathname),
      campaign_intent: campaignIntent(window.location.pathname),
      referrer: document.referrer || '',
      ai_referrer: aiReferrerSource(document.referrer),
      ...getFirstTouch(),
      ...(extra || {}),
    };
  }

  function track(eventName, params) {
    const payload = currentContext(params);

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }

    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...payload });
    }

    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(eventName, payload);
    }

    if (eventName === 'signup_started' && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: 'Sonura signup',
        content_category: payload.page_type,
      });
    }
  }

  // Decorate every PostHog event (autocapture, $pageview, custom) with stable
  // first-touch + campaign context so funnels can be sliced without joining.
  function registerPostHogContext() {
    if (!window.posthog || typeof window.posthog.register !== 'function') return;
    const touch = getFirstTouch();
    window.posthog.register({
      page_type: pageType(window.location.pathname),
      campaign_intent: campaignIntent(window.location.pathname),
      ai_referrer: aiReferrerSource(document.referrer),
      first_landing_page: touch.first_landing_page,
      first_landing_path: touch.first_landing_path,
      first_page_type: touch.first_page_type,
      first_campaign_intent: touch.first_campaign_intent,
      first_referrer: touch.first_referrer,
      first_ai_referrer: touch.first_ai_referrer,
      first_touch_ts: touch.first_touch_ts,
      utm_source: touch.utm_source,
      utm_medium: touch.utm_medium,
      utm_campaign: touch.utm_campaign,
      utm_term: touch.utm_term,
      utm_content: touch.utm_content,
      gclid: touch.gclid,
      fbclid: touch.fbclid,
      msclkid: touch.msclkid,
    });
  }

  function isAppUrl(url) {
    try {
      return new URL(url, window.location.href).hostname === APP_HOST;
    } catch {
      return false;
    }
  }

  function getCtaLocation(element) {
    const explicit = element.closest('[data-cta-location]')?.getAttribute('data-cta-location');
    if (explicit) return explicit;

    const section = element.closest('section, header, footer, nav, main');
    if (section?.id) return section.id;
    if (section?.className && typeof section.className === 'string') {
      const className = section.className.split(/\s+/).find(Boolean);
      if (className) return className;
    }
    return 'unknown';
  }

  function buildAppUrl(inputUrl, extra) {
    const url = new URL(inputUrl, window.location.href);
    if (url.hostname !== APP_HOST) return url.toString();

    const context = currentContext(extra);
    const outboundParams = {
      sn_first_landing_page: context.first_landing_page,
      sn_first_landing_path: context.first_landing_path,
      sn_first_page_type: context.first_page_type,
      sn_first_campaign_intent: context.first_campaign_intent,
      sn_first_referrer: context.first_referrer,
      sn_first_touch_ts: context.first_touch_ts,
      sn_current_page: context.page_path,
      sn_current_page_type: context.page_type,
      sn_campaign_intent: context.campaign_intent,
      sn_cta_location: context.cta_location,
      sn_cta_text: context.cta_text,
      sn_plan: context.plan,
      sn_interval: context.interval,
      sn_trial: context.trial,
      utm_source: context.utm_source,
      utm_medium: context.utm_medium,
      utm_campaign: context.utm_campaign,
      utm_term: context.utm_term,
      utm_content: context.utm_content,
      gclid: context.gclid,
      fbclid: context.fbclid,
      msclkid: context.msclkid,
    };

    Object.entries(outboundParams).forEach(([key, value]) => {
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, String(value));
      }
    });

    return url.toString();
  }

  function decorateAnchor(anchor, extra) {
    if (!anchor || !isAppUrl(anchor.href)) return;
    anchor.href = buildAppUrl(anchor.href, {
      cta_location: getCtaLocation(anchor),
      cta_text: anchor.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || '',
      ...extra,
    });
  }

  function classifyAppClick(url) {
    const parsed = new URL(url, window.location.href);
    if (parsed.pathname.startsWith('/auth')) return 'signup_started';
    if (parsed.searchParams.has('subscribe')) return 'checkout_started';
    return 'seo_cta_click';
  }

  function decorateAllAppLinks() {
    document.querySelectorAll('a[href*="app.sonurastudio.com"]').forEach((anchor) => {
      decorateAnchor(anchor);
    });
  }

  window.sonuraSeoTrack = track;
  window.sonuraBuildAppUrl = buildAppUrl;
  window.sonuraSeoContext = currentContext;

  // Shared first-touch cookie, read by the app on app.sonurastudio.com.
  // localStorage above is this site's own; it cannot cross the origin boundary, and link
  // decoration only covers visitors who arrive by clicking a decorated anchor. The cookie
  // covers everyone, including a Google OAuth or Stripe return straight into the app.
  // Name and JSON shape must match frontend/src/lib/attribution.ts.
  const FT_COOKIE = 'sonura_attribution';
  const FT_MAX_AGE = 90 * 24 * 60 * 60;
  const PASS_THROUGH_HOSTS = [
    'sonurastudio.com',
    'accounts.google.com',
    'stripe.com',
    'login.microsoftonline.com',
    'appleid.apple.com',
  ];
  const CLICK_IDS = [
    { param: 'gclid', source: 'google', medium: 'cpc' },
    { param: 'gbraid', source: 'google', medium: 'cpc' },
    { param: 'wbraid', source: 'google', medium: 'cpc' },
    { param: 'msclkid', source: 'bing', medium: 'cpc' },
    { param: 'fbclid', source: 'facebook', medium: 'social' },
    { param: 'ttclid', source: 'tiktok', medium: 'social' },
  ];

  function externalReferrerHost(referrer) {
    if (!referrer) return '';
    let host;
    try {
      host = new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
    const passThrough = PASS_THROUGH_HOSTS.some(
      (h) => host === h || host.endsWith('.' + h)
    );
    return passThrough ? '' : host;
  }

  function hasFirstTouchCookie() {
    return document.cookie.split(';').some((part) => part.trim().startsWith(FT_COOKIE + '='));
  }

  // write-once: a later visit with different tags is a return, not an origin
  function writeFirstTouchCookie(touch) {
    if (hasFirstTouchCookie()) return;

    const params = new URLSearchParams(window.location.search);
    const click = CLICK_IDS.find((entry) => params.get(entry.param));
    const referrerHost = externalReferrerHost(touch.first_referrer);
    const source = touch.utm_source || touch.first_ai_referrer || referrerHost || (click && click.source) || 'direct';
    const medium =
      touch.utm_medium ||
      (touch.utm_source ? '' : referrerHost ? 'referral' : click ? click.medium : 'none');

    const value = JSON.stringify({
      source: String(source).slice(0, 120),
      medium: String(medium).slice(0, 120),
      campaign: (touch.utm_campaign || '').slice(0, 120),
      content: (touch.utm_content || '').slice(0, 120),
      referrer: referrerHost ? String(touch.first_referrer).slice(0, 120) : '',
      landingPath: String(touch.first_landing_path || '/').slice(0, 120),
      capturedAt: touch.first_touch_ts || new Date().toISOString(),
    });

    // scoped to the parent domain so app.sonurastudio.com reads what this site wrote
    document.cookie =
      FT_COOKIE + '=' + encodeURIComponent(value) +
      '; path=/; max-age=' + FT_MAX_AGE +
      '; domain=.sonurastudio.com; SameSite=Lax; Secure';
  }

  getFirstTouch();
  registerPostHogContext();

  const inboundEvent = new URLSearchParams(window.location.search).get('sonura_event');
  if (['signup_completed', 'subscription_started'].includes(inboundEvent)) {
    track(inboundEvent, { event_source: 'return_url' });
  }

  document.addEventListener('DOMContentLoaded', decorateAllAppLinks);
  document.addEventListener('pointerdown', (event) => {
    const anchor = event.target.closest?.('a[href]');
    if (anchor) decorateAnchor(anchor);
  }, true);

  document.addEventListener('click', (event) => {
    const planButton = event.target.closest?.('[data-plan]');
    if (planButton) {
      const plan = planButton.getAttribute('data-plan');
      const trial = planButton.getAttribute('data-trial') === 'true';
      const interval = document.querySelector('.billing-btn.active')?.getAttribute('data-interval') || 'month';
      track('pricing_plan_click', {
        plan,
        interval,
        trial,
        cta_location: getCtaLocation(planButton),
        cta_text: planButton.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || '',
      });
      track('checkout_started', { plan, interval, trial, cta_location: 'pricing' });
      return;
    }

    const anchor = event.target.closest?.('a[href]');
    if (!anchor || !isAppUrl(anchor.href)) return;
    decorateAnchor(anchor);
    const eventName = classifyAppClick(anchor.href);
    const url = new URL(anchor.href, window.location.href);
    track('seo_cta_click', {
      link_url: anchor.href,
      link_path: url.pathname,
      cta_location: getCtaLocation(anchor),
      cta_text: anchor.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) || '',
    });
    if (eventName !== 'seo_cta_click') {
      track(eventName, {
        link_url: anchor.href,
        cta_location: getCtaLocation(anchor),
      });
    }
  }, true);
})();
