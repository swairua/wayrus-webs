# Image Optimization Strategy

This document outlines the comprehensive image optimization approach implemented across the Wayrus website.

## Overview

The website uses a multi-layered approach to optimize image performance:

1. **Smart Image Component** - Responsive, lazy-loaded images with WebP support
2. **Browser Caching** - Long-term cache for static assets
3. **Responsive Image Serving** - Different sizes for different devices
4. **Modern Formats** - WebP with fallback to JPEG/PNG
5. **Progressive Enhancement** - Images load gracefully with fallbacks

## Implementation Details

### 1. OptimizedImage Component

Located in: `client/components/ui/optimized-image.tsx`

The component provides three variants:

#### `OptimizedImage` (Base)

- Lazy loading with `loading="lazy"` attribute
- Responsive image sources with `srcset`
- WebP format support with JPEG/PNG fallback
- Fade-in animation on load
- Custom image quality control

```tsx
<OptimizedImage
  src="https://images.unsplash.com/photo-..."
  alt="Description"
  width={1200}
  height={800}
  className="object-cover"
/>
```

#### `HeroImage` (Priority)

- Eager loading for above-the-fold images
- Preloading for instant display
- Used for hero sections and critical images
- Larger dimensions for full-width backgrounds

```tsx
<HeroImage
  src="https://images.unsplash.com/photo-..."
  alt="Hero image"
  width={2000}
  height={1200}
  className="absolute inset-0 object-cover"
/>
```

#### `CardImage` (Lazy)

- Lazy loading for below-the-fold cards
- Optimized for card dimensions
- Used in service cards, portfolio items
- Medium quality to balance speed and appearance

```tsx
<CardImage
  src="https://images.unsplash.com/photo-..."
  alt="Card image"
  width={800}
  height={600}
  className="h-full w-full object-cover"
/>
```

### 2. Responsive Image Sizes

The component generates multiple image sizes:

| Size   | Width       | Use Case       |
| ------ | ----------- | -------------- |
| Small  | 640px       | Mobile devices |
| Medium | 1024px      | Tablets        |
| Large  | 1200-2000px | Desktop/Hero   |

Browser automatically selects the best size based on:

- Viewport width
- Device pixel ratio (DPR)
- Available connection speed

### 3. Modern Image Formats

#### WebP Format

- ~25% smaller than JPEG
- ~40% smaller than PNG
- Supported in all modern browsers
- Automatic generation from Unsplash/Pexels URLs

#### JPEG/PNG Fallback

- For older browsers
- Automatically selected if WebP not supported
- Optimized quality (80%) for faster delivery

#### Image Delivery

```html
<picture>
  <!-- Modern format (WebP) -->
  <source type="image/webp" srcset="..." sizes="..." />

  <!-- Fallback format (JPEG) -->
  <source srcset="..." sizes="..." />

  <!-- Legacy fallback -->
  <img src="..." alt="..." loading="lazy" decoding="async" />
</picture>
```

### 4. Browser Caching Strategy

**Cache Duration**: 1 year (31,536,000 seconds)
**Type**: Public, immutable cache

Cache headers set for:

- Images: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`
- Stylesheets: `.css`
- JavaScript: `.js`
- Fonts: `.woff`, `.woff2`

```
Cache-Control: public, max-age=31536000, immutable, stale-while-revalidate=31536000
```

**HTML Cache Duration**: 1 hour (3,600 seconds)

- Allows short-term revalidation
- Stale-while-revalidate for 24 hours
- Ensures content updates within an hour

```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
```

### 5. Pages Using Optimization

#### Index/Home Page

- **Hero Images**: 3 carousel images with HeroImage component
- **Service Cards**: 6 cards with CardImage component (400x300px)
- **Case Studies**: 3 portfolio preview cards with CardImage component

#### Services Page

- **Service Cards**: 6 service cards with CardImage component
- **Total Images**: 6 optimized images

#### Portfolio Page

- **Portfolio Items**: Dynamic list with CardImage component
- **Screenshot URLs**: Optimized for thumbnail display

## Performance Benefits

### Page Load Speed

- **Lazy Loading**: Images below fold load only when visible
- **Preloading**: Critical hero images load immediately
- **Format Optimization**: WebP saves 25-40% bandwidth

### User Experience

- **Progressive Loading**: Images fade in smoothly
- **No Layout Shift**: Proper aspect ratios maintained
- **Responsive Design**: Optimal image size for each device

### SEO Benefits

- **Faster LCP**: Largest Contentful Paint improves with HeroImage preloading
- **Better FID**: Lazy loading prevents layout thrashing
- **Mobile Optimization**: Responsive images improve mobile scores

## Technical Specifications

### Image Quality Settings

- **Hero Images**: Quality 80 (high visibility, larger file acceptable)
- **Card Images**: Quality 80 (balance between quality and size)
- **Format**: WebP preferred, JPEG fallback

### Supported Image Sources

- **Unsplash**: Full support with URL parameter optimization
- **Pexels**: Full support with lazy loading
- **Local images**: Supported via `public/` folder

### Browser Support

- **WebP**: All modern browsers (Chrome, Firefox, Safari 16+, Edge)
- **Fallback**: All browsers with JPEG/PNG support
- **Lazy Loading**: Supported natively in all modern browsers

## Migration Guide

### Converting Existing Images

**Before:**

```tsx
<img src="https://images.unsplash.com/..." alt="..." />
```

**After (Hero):**

```tsx
import { HeroImage } from "@/components/ui/optimized-image";

<HeroImage
  src="https://images.unsplash.com/..."
  alt="..."
  className="w-full h-full object-cover"
/>;
```

**After (Card):**

```tsx
import { CardImage } from "@/components/ui/optimized-image";

<CardImage
  src="https://images.unsplash.com/..."
  alt="..."
  className="h-full w-full object-cover"
/>;
```

## Monitoring & Optimization

### Metrics to Track

1. **Largest Contentful Paint (LCP)**: Should be < 2.5s
2. **Cumulative Layout Shift (CLS)**: Should be < 0.1
3. **First Input Delay (FID)**: Should be < 100ms
4. **Image Load Time**: Average < 1s for card images
5. **Cache Hit Ratio**: > 95% for static assets

### Tools

- Google PageSpeed Insights
- WebPageTest
- Chrome DevTools Lighthouse
- CloudFlare Analytics

## Best Practices

1. **Use HeroImage for above-fold images**
   - Ensures fast LCP
   - Preloads critical images

2. **Use CardImage for below-fold images**
   - Implements lazy loading
   - Saves bandwidth for users who don't scroll

3. **Set proper dimensions**
   - Prevents layout shift
   - Helps browser optimize loading

4. **Use descriptive alt text**
   - Improves accessibility
   - Helps with SEO

5. **Monitor performance**
   - Check Core Web Vitals regularly
   - Adjust quality/size as needed

## Future Improvements

1. **CDN Integration**: Consider using a CDN (Cloudflare, Fastly) for edge caching
2. **Image Compression Service**: Add automatic compression for local images
3. **AVIF Format**: Use even more modern AVIF format (when browser support improves)
4. **Adaptive Bitrate**: Serve different qualities based on connection speed
5. **Critical Image List**: Optimize first 5 images more aggressively

## Resources

- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev - Image Optimization](https://web.dev/image-optimization/)
- [Unsplash API](https://unsplash.com/documentation)
- [Web Vitals](https://web.dev/vitals/)
