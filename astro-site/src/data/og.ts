/** Route ("genre/lofi" or "/genre/lofi/") to its Open Graph file name ("genre-lofi.png"). "" or "/" is the homepage. */
export function ogImageFile(route: string): string {
  const slug = route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
  return `${slug || 'home'}.png`;
}
