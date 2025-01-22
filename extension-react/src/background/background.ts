import { TabsActionsEnum } from "../common/enums";

// retrieve url on video loaded
chrome.webNavigation.onCompleted.addListener((loadedPageDetails) => {
  if (loadedPageDetails.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(loadedPageDetails.tabId, { action: TabsActionsEnum.URL_CHANGED, url: loadedPageDetails.url })
  }
}, { url: [{ hostContains: 'youtube.com' }] });

// retrieve url on tab change
chrome.tabs.onActivated.addListener((tabDetails) => {
  chrome.tabs.get(tabDetails.tabId, (tab) => {
    chrome.tabs.sendMessage(tabDetails.tabId, { action: TabsActionsEnum.URL_CHANGED, url: tab.url })
  });
});

