import statusManager from "./status.js";
import { queryParams } from "./params.js";
import { providedByAmazon } from "./category.js";

const status = new statusManager(true);
const filterKey = "p_6";

chrome.action.setTitle({ title: chrome.i18n.getMessage("extensionTitle") });

// On click event for the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  try {
    if (!tab.url) {
      return;
    }

    const newStatus = await status.toggleStatus();
    const url = new URL(tab.url);
    const filter = queryParams[url.hostname];

    if (!url.searchParams.has("k")) {
      return;
    }

    if (newStatus) {
      if (providedByAmazon(url)) {
        return;
      }

      if (!url.searchParams.has("rh")) {
        url.searchParams.append("rh", `${filterKey}:${filter.value}`);
        await chrome.tabs.update(tab.id, { url: url.toString() });
      }
    } else {
      if (url.searchParams.has("rh")) {
        url.searchParams.delete("rh");
        await chrome.tabs.update(tab.id, { url: url.toString() });
      }
    }
  } catch (error) {
    console.error('Error handling click:', error);
  }
});

// On update event for the tab
chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  if (tab.status !== "loading") {
    return;
  }

  try {
    const currentStatus = await status.getStatus();
    
    if (currentStatus) {
      if (!tab.url) {
        return;
      }

      const url = new URL(tab.url);
      const filter = queryParams[url.hostname];

      if (providedByAmazon(url)) {
        return;
      }

      if (url.searchParams.has("k") && !url.searchParams.has("rh")) {
        url.searchParams.append("rh", `${filterKey}:${filter.value}`);
        await chrome.tabs.update(tabId, { url: url.toString() });
      }
    }
  } catch (error) {
    console.error('Error handling tab update:', error);
  }
});
