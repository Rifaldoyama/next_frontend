export function resolveImage(path?: string | null) {
  if (!path) return undefined;

  return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`.replace(
    /([^:]\/)\/+/g,
    "$1"
  );
}
