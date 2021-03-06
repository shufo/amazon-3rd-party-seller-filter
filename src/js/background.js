import statusManager from "./status.js";
import { queryParams } from "./params.js";

const status = new statusManager(true);
const filterKey = "p_6";

chrome.browserAction.onClicked.addListener(function (tab) {
  status.changeStatus();

  if (status.getStatus()) {
    chrome.browserAction.setIcon({ path: "../../icon/favicon-32x32_on.png" });
  } else {
    chrome.browserAction.setIcon({ path: "../../icon/favicon-32x32_off.png" });
  }

  let url = new URL(tab.url);
  let filter = queryParams[url.hostname];

  if (status.getStatus()) {
    if (url.searchParams.has("k") && !url.searchParams.has("rh")) {
      url.searchParams.append("rh", `${filterKey}:${filter.value}`);
      chrome.tabs.update(tab.id, { url: url.toString() });
    }
  } else {
    if (url.searchParams.has("k") && url.searchParams.has("rh")) {
      url.searchParams.delete("rh");
      chrome.tabs.update(tab.id, { url: url.toString() });
    }
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  let url = new URL(tab.url);
  let filter = queryParams[url.hostname];

  if (
    status.getStatus() &&
    url.searchParams.has("k") &&
    !url.searchParams.has("rh")
  ) {
    url.searchParams.append("rh",  `${filterKey}:${filter.value}`);
    chrome.tabs.update(tabId, { url: url.toString() });
  }
});
