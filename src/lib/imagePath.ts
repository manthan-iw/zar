export const imagePath = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('/zar')) return path;
  return `/zar${path.startsWith('/') ? '' : '/'}${path}`;
};
