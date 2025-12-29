# Sonura Website (Astro)

A scalable, maintainable website built with [Astro](https://astro.build).

## 🚀 Quick Start

```bash
npm install
npm run dev     # Start dev server at localhost:4321
npm run build   # Build for production
npm run preview # Preview production build
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Nav.astro    # Navigation (used on ALL pages)
│   └── Footer.astro # Footer (used on ALL pages)
├── layouts/          # Page layouts
│   ├── BaseLayout.astro   # Base layout with head, nav, footer
│   ├── BlogLayout.astro   # Blog post layout
│   └── GenreLayout.astro  # Genre page layout
├── pages/            # All pages (URL = file path)
│   ├── index.astro          # Homepage
│   ├── blog/
│   │   ├── index.astro      # Blog listing
│   │   └── [slug]/index.astro
│   └── genre/
│       └── [genre]/index.astro
├── styles/
│   └── global.css    # Global styles (your original styles.css)
public/               # Static assets (images, videos, etc.)
```

## ✨ Adding New Pages

### Add a New Genre Page

Create `src/pages/genre/[genre-name]/index.astro`:

```astro
---
import GenreLayout from '../../../layouts/GenreLayout.astro';
---

<GenreLayout
  genre="EDM"
  genreSlug="edm"
  title="Free EDM Maker | AI EDM Generator - Sonura"
  description="Create EDM tracks in seconds with AI."
  keywords="edm maker, edm generator, ai edm"
  headline="Create Powerful EDM Tracks Instantly"
  subhead="AI-powered drops, builds, and synths."
  features={[
    { title: "Massive Drops", description: "Epic drops that shake the room." },
    { title: "Build-ups", description: "Tension-building risers and sweeps." },
  ]}
  faqs={[
    { question: "How do I make EDM?", answer: "Just describe your track!" },
  ]}
  embedIds={["your-embed-id-here"]}
/>
```

### Add a New Blog Post

Create `src/pages/blog/[your-slug]/index.astro`:

```astro
---
import BlogLayout from '../../../layouts/BlogLayout.astro';

const toc = [
  { id: 'intro', label: 'Introduction' },
  { id: 'section-1', label: 'First Section' },
];
---

<BlogLayout
  title="Your Blog Post Title"
  description="Brief description for SEO"
  keywords="keyword1, keyword2"
  slug="your-slug"
  publishedDate="2025-01-15"
  readTime="5 min read"
  toc={toc}
>
  <section>
    <h2 id="intro">Introduction</h2>
    <p>Your content here...</p>
  </section>
</BlogLayout>
```

**Don't forget** to add the post to the blog index in `src/pages/blog/index.astro`!

## 🎨 Changing Shared Elements

### Update Navigation
Edit `src/components/Nav.astro` - changes apply to ALL pages.

### Update Footer
Edit `src/components/Footer.astro` - changes apply to ALL pages.

### Update Head Tags (SEO, fonts, etc.)
Edit `src/layouts/BaseLayout.astro` - changes apply to ALL pages.

### Update Styles
Edit `src/styles/global.css` - changes apply to ALL pages.

## 🚀 Deployment

The site automatically deploys to GitHub Pages when you push to `main`.

You can also run `npm run build` locally and deploy the `dist/` folder anywhere.

## 📝 Key Benefits

1. **Single Source of Truth**: Nav, footer, head tags defined once
2. **Easy to Add Pages**: Just create a new `.astro` file
3. **Type-Safe Layouts**: Props are validated at build time
4. **Fast Builds**: Only changed pages rebuild
5. **SEO Optimized**: Schema.org, Open Graph, all handled by layouts
