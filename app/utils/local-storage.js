export default {
  storage: function() {
    return window.localStorage;
  },
  save: function(item, value) {
    if (this.storage()) {
      return this.storage().setItem(item, value);
    }
  },
  fetch: function(item) {
    if (this.storage()) {
      return this.storage().getItem(item);
    }
  },
  remove: function(item) {
    if (this.storage()) {
      return this.storage().removeItem(item);
    }
  }
};
