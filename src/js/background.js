import statusManager from "./status.js";
import { queryParams } from "./params.js";
import { providedByAmazon } from "./category.js";

const status = new statusManager(true);
const filterKey = "p_6";

chrome.action.setTitle({ title: chrome.i18n.getMessage("extensionTitle") });

const isValidSearchUrl = (url) => {
  return url?.searchParams.has("k") && !providedByAmazon(url);
};

const updateUrlWithFilter = (url, shouldApplyFilter) => {
  if (!url || !queryParams[url.hostname]) return url;
  
  const filter = queryParams[url.hostname];
  
  if (shouldApplyFilter && !url.searchParams.has("rh")) {
    url.searchParams.append("rh", `${filterKey}:${filter.value}`);
  } else if (!shouldApplyFilter && url.searchParams.has("rh")) {
    url.searchParams.delete("rh");
  }
  
  return url;
};

const handleUrlUpdate = async (tabId, urlString, shouldApplyFilter) => {
  if (!urlString) return;
  
  try {
    const url = new URL(urlString);
    if (!isValidSearchUrl(url)) return;
    
    const updatedUrl = updateUrlWithFilter(url, shouldApplyFilter);
    if (updatedUrl.toString() !== urlString) {
      await chrome.tabs.update(tabId, { url: updatedUrl.toString() });
    }
  } catch (error) {
    console.error('Error updating URL:', error);
  }
};

chrome.action.onClicked.addListener(async (tab) => {
  try {
    const newStatus = await status.toggleStatus();
    await handleUrlUpdate(tab.id, tab.url, newStatus);
  } catch (error) {
    console.error('Error handling click:', error);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, tab) => {
  if (tab.status !== "loading") return;
  
  try {
    const currentStatus = await status.getStatus();
    if (currentStatus) {
      await handleUrlUpdate(tabId, tab.url, true);
    }
  } catch (error) {
    console.error('Error handling tab update:', error);
  }
});
