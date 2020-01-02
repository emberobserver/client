import Component from '@ember/component';

export default Component.extend({
  questionOptions: [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 },
    { label: 'N/A', value: 3 },
    { label: 'Unknown', value: 4 }
  ],
  actions: {
    save() {
      this.sendAction('save', this.review);
    },
    selectOption(fieldName, value) {
      this.review.set(fieldName, value);
    }
  }
});
