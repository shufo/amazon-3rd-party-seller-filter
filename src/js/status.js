/**
 * Manages the extension's status and icon state
 */
class StatusManager {
  constructor() {
    this.initializeStatus();
  }

  /**
   * Initialize the extension status from storage
   */
  async initializeStatus() {
    try {
      const result = await chrome.storage.local.get("status");
      
      if (result.status === undefined) {
        await this.setStatus(true);
        StatusManager.enableIcon();
      } else if (result.status === true) {
        StatusManager.enableIcon();
      } else {
        StatusManager.disableIcon();
      }
    } catch (error) {
      console.error('Failed to initialize status:', error);
    }
  }

  /**
   * Set status in local storage
   * @param {boolean} status - The status to set
   */
  async setStatus(status) {
    try {
      await chrome.storage.local.set({ "status": status });
      console.log("Status set to:", status);
    } catch (error) {
      console.error('Failed to set status:', error);
      throw error;
    }
  }

  /**
   * Get current status from local storage
   * @returns {Promise<boolean>} The current status
   */
  async getStatus() {
    try {
      const result = await chrome.storage.local.get("status");
      return result.status;
    } catch (error) {
      console.error('Failed to get status:', error);
      throw error;
    }
  }

  /**
   * Toggle the current status
   */
  async toggleStatus() {
    try {
      const currentStatus = await this.getStatus();
      const newStatus = !currentStatus;
      
      await this.setStatus(newStatus);
      
      if (newStatus) {
        StatusManager.enableIcon();
      } else {
        StatusManager.disableIcon();
      }
      
      return newStatus;
    } catch (error) {
      console.error('Failed to toggle status:', error);
      throw error;
    }
  }

  /**
   * Enable the extension icon
   */
  static enableIcon() {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_on.png" });
  }

  /**
   * Disable the extension icon
   */
  static disableIcon() {
    chrome.action.setIcon({ path: "../../icon/favicon-32x32_off.png" });
  }
}

export default StatusManager;
