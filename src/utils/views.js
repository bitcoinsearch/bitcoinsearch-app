export function parseYoutubeId(url) {
  const regexp = new RegExp(
    '(?:youtube(?:-nocookie)?.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu.be/)([^"&?/s]{11})',
    "i"
  );
  const matches = url.match(regexp);
  return matches ? matches[1] : false;
}

export function getThumbnailUrl(url) {
  if (!url) return null;
  const youtubeId = parseYoutubeId(url);
  if (youtubeId) {
    return `https://i3.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
  } else return null;
}
