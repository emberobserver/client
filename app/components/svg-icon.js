import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  alignBaseline: true,
}).reopenClass({
  positionalParams: ['iconName']
});
