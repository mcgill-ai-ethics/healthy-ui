import { ChromeActionsEnum } from "../common/enums";
import { ChromeAction } from '../common/types'

// Listen for changes in the URL
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === ChromeActionsEnum.GET_URL) {
    sendResponse({ url: window.location.href });
  }
});

// Detect when the video player is loaded
window.addEventListener('load', () => {
  if (window.location.hostname === 'www.youtube.com' && window.location.pathname === '/watch') {
    chrome.runtime.sendMessage({ action: ChromeActionsEnum.VIDEO_LOADED, url: window.location.href });
  }
});

