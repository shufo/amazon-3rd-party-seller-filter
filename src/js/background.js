import statusManager from "./status.js";
import { queryParams } from "./params.js";
import { providedByAmazon } from "./category.js";

const status = new statusManager(true);
const filterKey = "p_6";

chrome.action.setTitle({ title: chrome.i18n.getMessage("extensionTitle") });

// On click event for the extension icon
chrome.action.onClicked.addListener((tab) => {
  status.changeStatus(() => {
    status.getStatus((result) => {
      if (tab.url === undefined) {
        return;
      }
      const url = new URL(tab.url);
      const filter = queryParams[url.hostname];

      if (result.status) {
        if (providedByAmazon(url)) {
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
  });
});

// On update event for the tab
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.status !== "loading") {
    return;
  }

  // Get the current status of the extension
  status.getStatus((result) => {
    if (result.status) {
      statusManager.enableIcon();

      if (tab.url === undefined) {
        return;
      }

      const url = new URL(tab.url);
      const filter = queryParams[url.hostname];

      if (providedByAmazon(url)) {
        return;
      }

      if (url.searchParams.has("k") && !url.searchParams.has("rh")) {
        url.searchParams.append("rh", `${filterKey}:${filter.value}`);
        chrome.tabs.update(tabId, { url: url.toString() });
      }
    } else {
      statusManager.disableIcon();
    }
  });
});
