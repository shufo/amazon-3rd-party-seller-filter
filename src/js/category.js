export const providedByAmazon = (url) => {
  return isPrimeVideo(url) || isDigitalMusic(url);
};

// Check if the current query has amazon prime video
const isPrimeVideo = (url) => {
  return url.searchParams.has("i") && url.searchParams.get("i") === "instant-video";
}

// Check if the current query has amazon music
const isDigitalMusic = (url) => {
  return url.searchParams.has("i") && url.searchParams.get("i") === "digital-music";
}