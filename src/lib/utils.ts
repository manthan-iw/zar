export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

const rawImageBase = process.env.NEXT_PUBLIC_IMAGE_BASE_PATH || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://testintelliworkz.tech/Zar_backend';
export const API_IMAGE_BASE = `${rawImageBase.replace(/\/+$/, '')}/`;

// export function getImageUrl(url?: string | null): string {
//   if (!url) return '';
//   const trimmed = String(url).trim();
//   if (trimmed === '') return '';

//   // If absolute HTTP(S) URL, check hostname
//   try {
//     if (/^https?:\/\//i.test(trimmed)) {
//       const parsed = new URL(trimmed);
//       const host = parsed.hostname;

//       // If image URL points to localhost or loopback, rewrite to API_IMAGE_BASE + pathname
//       if (host === 'localhost' || host === '127.0.0.1') {
//         const path = `${parsed.pathname}${parsed.search || ''}${parsed.hash || ''}`.replace(/^\/+/, '');
//         return `${API_IMAGE_BASE}${path}`;
//       }

//       // If already points to the API host, return as-is
//       try {
//         const apiOrigin = new URL(API_IMAGE_BASE).origin;
//         if (parsed.origin === apiOrigin) return trimmed;
//       } catch {
//         /* ignore */
//       }

//       // Otherwise keep absolute URL
//       return trimmed;
//     }
//   } catch {
//     // fall through to other checks
//   }

//   // protocol-relative or root-relative — return as-is
//   if (trimmed.startsWith('//')) return trimmed;

//   // If root-relative and points to uploads (served by backend), rewrite to API base
//   if (trimmed.startsWith('/')) {
//     const path = trimmed.replace(/^\/+/, '');
//     if (path.startsWith('uploads/')) {
//       return `${API_IMAGE_BASE}${path}`;
//     }
//     return trimmed;
//   }

//   // relative path — prepend API base
//   return `${API_IMAGE_BASE}${trimmed}`;
// }

export function getImageUrl(url?: string | null): string {
  if (!url) return "";

  const trimmed = String(url).trim();
  if (!trimmed) return "";

  const BASE_PATH = "/zar";

  // Absolute URL
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const parsed = new URL(trimmed);

      // Rewrite localhost URLs to your backend
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        const path = `${parsed.pathname}${parsed.search}${parsed.hash}`.replace(
          /^\/+/,
          ""
        );
        return `${API_IMAGE_BASE}${path}`;
      }

      // Keep all other absolute URLs unchanged
      return trimmed;
    }
  } catch {
    // Ignore invalid URLs
  }

  // Protocol-relative URL
  if (trimmed.startsWith("//")) {
    return trimmed;
  }

  // Root-relative path
  if (trimmed.startsWith("/")) {
    const path = trimmed.replace(/^\/+/, "");

    // Backend uploads
    if (path.startsWith("uploads/")) {
      return `${API_IMAGE_BASE}${path}`;
    }

    // Static images from public folder
    if (trimmed.startsWith(BASE_PATH)) {
      return trimmed;
    }
    return `${BASE_PATH}${trimmed}`;
  }

  // Relative paths -> backend
  return `${API_IMAGE_BASE}${trimmed}`;
}