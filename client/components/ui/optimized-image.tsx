import { ImgHTMLAttributes, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  preload?: boolean;
}

/**
 * Generate optimized image URLs with different sizes
 * Works with Unsplash URLs to get different image sizes
 */
function getOptimizedSrc(src: string, width: number): string {
  if (!src) return src;

  // Handle Unsplash URLs
  if (src.includes("unsplash.com")) {
    // Unsplash allows query parameters for optimization
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}&q=80&auto=format&fit=crop`;
  }

  // Handle Pexels URLs
  if (src.includes("pexels.com")) {
    return src; // Pexels URLs are already optimized
  }

  return src;
}

/**
 * Generate WebP fallback source
 */
function getWebPSrc(src: string): string {
  if (!src) return src;

  // Unsplash supports automatic WebP conversion
  if (src.includes("unsplash.com")) {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}fm=webp&q=80`;
  }

  return src;
}

export function OptimizedImage({
  src,
  alt,
  width = 1200,
  height,
  priority = false,
  quality = 80,
  sizes,
  className,
  preload = false,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Optimize image URLs
  const smallSrc = getOptimizedSrc(src, 640);
  const mediumSrc = getOptimizedSrc(src, 1024);
  const largeSrc = getOptimizedSrc(src, width);

  // WebP versions for better compression
  const webpSmallSrc = getWebPSrc(smallSrc);
  const webpMediumSrc = getWebPSrc(mediumSrc);
  const webpLargeSrc = getWebPSrc(largeSrc);

  // Preload image if priority or preload is set
  useEffect(() => {
    if (priority || preload) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = largeSrc;
      document.head.appendChild(link);

      // Also preload WebP version
      const linkWebP = document.createElement("link");
      linkWebP.rel = "preload";
      linkWebP.as = "image";
      linkWebP.href = webpLargeSrc;
      linkWebP.imagesrcset = `${webpSmallSrc} 640w, ${webpMediumSrc} 1024w, ${webpLargeSrc} ${width}w`;
      document.head.appendChild(linkWebP);
    }
  }, [
    priority,
    preload,
    largeSrc,
    webpLargeSrc,
    webpSmallSrc,
    webpMediumSrc,
    width,
  ]);

  return (
    <picture>
      {/* WebP sources for better compression */}
      <source
        type="image/webp"
        srcSet={`${webpSmallSrc} 640w, ${webpMediumSrc} 1024w, ${webpLargeSrc} ${width}w`}
        sizes={
          sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        }
      />

      {/* Fallback JPEG sources */}
      <source
        srcSet={`${smallSrc} 640w, ${mediumSrc} 1024w, ${largeSrc} ${width}w`}
        sizes={
          sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
        }
      />

      {/* Fallback img tag with lazy loading */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...props}
      />
    </picture>
  );
}

/**
 * Hero image component with preloading and optimized delivery
 */
export function HeroImage({
  src,
  alt,
  width = 2000,
  height = 1200,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={true}
      preload={true}
      {...props}
    />
  );
}

/**
 * Card image component with lazy loading
 */
export function CardImage({
  src,
  alt,
  width = 1200,
  height = 400,
  ...props
}: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={false}
      {...props}
    />
  );
}
