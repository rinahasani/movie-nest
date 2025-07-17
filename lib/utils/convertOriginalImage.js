function convertOriginalImageUrl(path) {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";
  const imageUrl = path ? `${TMDB_IMAGE_BASE_URL}${path}` : "";
  return imageUrl;
}
export default convertOriginalImageUrl 