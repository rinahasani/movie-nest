 function convertImageUrl(path) {
  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
  const THUMBNAIL_SIZE = "w500";
  const imageUrl = path ? `${TMDB_IMAGE_BASE_URL}${THUMBNAIL_SIZE}${path}` : "";
  return imageUrl;
}
export default convertImageUrl;
