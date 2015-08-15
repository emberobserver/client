export default {
  storage() {
    return window.localStorage;
  },
  save(item, value) {
    if (this.storage()) {
      return this.storage().setItem(item, value);
    }
  },
  fetch(item) {
    if (this.storage()) {
      return this.storage().getItem(item);
    }
  },
  remove(item) {
    if (this.storage()) {
      return this.storage().removeItem(item);
    }
  }
};
