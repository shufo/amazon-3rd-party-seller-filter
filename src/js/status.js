class statusManager {
  constructor(status) {
    // if already status set in local storage, then use it
    // else initialize with true
    chrome.storage.local.get("status").then((result) => {
      if (result.status === undefined) {
        this.initializeStatus(true);
        statusManager.enableIcon();
      }

      if (result.status === true) {
        statusManager.enableIcon();
      }
    });
  }

  // Initialize status in local storage
  initializeStatus(status) {
    chrome.storage.local.set({ "status": status }, () => {
      console.log("Status initialized", status);
    });
  }

  // Get status from local storage
  getStatus(callback) {
    chrome.storage.local.get("status").then(callback);
  }

  // Change status in local storage
  changeStatus(callback) {
    this.getStatus((result) => {
      const changesTo = !result.status;
      chrome.storage.local.set({ "status": changesTo }, callback);

      console.log("Status changed to", changesTo);
    });
  }

  static enableIcon() {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_on.png" });
  }

  static disableIcon() {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_off.png" });
  }
}

export default statusManager;
