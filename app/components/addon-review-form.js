import Ember from 'ember';

export default Ember.Component.extend({
  questionOptions: [
    {label: 'Yes', value: 1},
    {label: 'No', value: 2},
    {label: 'N/A', value: 3},
    {label: 'Unknown', value: 4}
  ],
  questions: [
    {text: 'Is it more than an empty addon?', fieldName: 'isMoreThanEmptyAddon'},
    {text: 'Are there meaningful tests?', fieldName: 'hasTests'},
    {text: 'Is the README filled out?', fieldName: 'hasReadme'},
    {text: 'Is the source accessible?', fieldName: 'isOpenSource'},
    {text: 'If so, does the addon use only public Ember APIs?', fieldName: 'usesOnlyPublicApis'},
    {text: 'Does the addon have a build?', fieldName: 'hasBuild'}
  ],
  actions: {
    save: function(){
      this.sendAction('save', this.get('review'));
    },
    selectOption: function(fieldName, value){
      this.get('review').set(fieldName, value);
    }
  }
});
