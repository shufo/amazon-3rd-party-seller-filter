class statusManager {
  constructor(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  changeStatus() {
    this.status = !this.status;
  }
}

export default statusManager;
