chrome.webNavigation.onCompleted.addListener((details) => {
  if (details.url.includes("youtube.com/watch")) {
    console.log("YouTube video URL:", details.url);
  }
}, { url: [{ hostContains: 'youtube.com' }] });

export { }
