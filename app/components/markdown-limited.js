import Ember from 'ember';

var limitedRenderer = new marked.Renderer();

limitedRenderer.image = function(href, title, text) {
  return text;
}

export default Ember.Component.extend({
  limitingOptions: {
    renderer: limitedRenderer
  }
});
