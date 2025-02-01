// retrieve url on video loaded
chrome.webNavigation.onHistoryStateUpdated.addListener((loadedPageDetails) => {
  console.log("url %s", (loadedPageDetails.url))//test
  if (loadedPageDetails.url.includes("youtube.com/watch")) {
    chrome.storage.local.set({ url: loadedPageDetails.url })
  }
}, { url: [{ hostContains: 'youtube.com' }] });

// retrieve url on tab change
chrome.tabs.onActivated.addListener((tabDetails) => {
  chrome.tabs.get(tabDetails.tabId, (tab) => {
    chrome.storage.local.set({ url: tab.url })
    console.log("background changed local storage to :", tab.url)//test
  });
});

export { }
