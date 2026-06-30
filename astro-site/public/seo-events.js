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
    if (existing && existing.first_landing_page) return existing;

    const touch = {
      first_landing_page: window.location.pathname + window.location.search,
      first_landing_path: window.location.pathname,
      first_page_type: pageType(window.location.pathname),
      first_campaign_intent: campaignIntent(window.location.pathname),
      first_referrer: document.referrer || '',
      first_touch_ts: new Date().toISOString(),
      ...getSearchParams(),
    };
    writeFirstTouch(touch);
    return touch;
  }

  function currentContext(extra) {
    return {
      page_location: window.location.href,
      page_path: window.location.pathname,
      page_type: pageType(window.location.pathname),
      campaign_intent: campaignIntent(window.location.pathname),
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
      first_landing_page: touch.first_landing_page,
      first_landing_path: touch.first_landing_path,
      first_page_type: touch.first_page_type,
      first_campaign_intent: touch.first_campaign_intent,
      first_referrer: touch.first_referrer,
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
