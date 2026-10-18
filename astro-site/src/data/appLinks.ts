export const APP_ROOT = 'https://app.sonurastudio.com/';

export function withAppPrompt(appUrl: string, prompt?: string): string {
  if (!prompt || appUrl !== APP_ROOT) return appUrl;
  return `${APP_ROOT}?prompt=${encodeURIComponent(prompt)}`;
}
