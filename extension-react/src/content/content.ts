import { TabsActionsEnum } from "../common/enums";
import { TabsActions } from '../common/types'

chrome.runtime.onMessage.addListener((message: TabsActions, sender, sendResponse) => {
  if (message.action === TabsActionsEnum.URL_CHANGED) {
    window.postMessage(message)
  }
});

