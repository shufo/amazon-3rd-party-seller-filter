import statusManager from "./status.js";
import { queryParams } from "./params.js";

const status = new statusManager(true);
const filterKey = "p_6";

chrome.action.onClicked.addListener((tab) => {
  status.changeStatus();

  if (status.getStatus()) {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_on.png" });
  } else {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_off.png" });
  }
  if (tab.url === undefined) {
    return;
  }
  const url = new URL(tab.url);
  const filter = queryParams[url.hostname];

  if (status.getStatus()) {
   
    if (isPrimeVideo(url)) {
      return;
    }

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

chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (status.getStatus()) {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_on.png" });
  } else {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_off.png" });
  }
  if (tab.url === undefined) {
    return;
  }
  const url = new URL(tab.url);
  const filter = queryParams[url.hostname];

  if (status.getStatus() && isPrimeVideo(url)) {
    return;
  }

  if (
    status.getStatus() &&
    url.searchParams.has("k") &&
    !url.searchParams.has("rh")
  ) {
    url.searchParams.append("rh", `${filterKey}:${filter.value}`);
    chrome.tabs.update(tabId, { url: url.toString() });
  }
});

// Check if the current query is a prime video
const isPrimeVideo = (url) => {
  return url.searchParams.has("i") && url.searchParams.get("i") === "instant-video";
}
