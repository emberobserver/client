import Ember from 'ember';

var limitedRenderer = window.marked ? new window.marked.Renderer() : {};

limitedRenderer.image = function(href, title, text) {
  return text;
};

export default Ember.Component.extend({
  limitingOptions: {
    renderer: limitedRenderer
  }
});
