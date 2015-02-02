import Ember from 'ember';

export function timeAgo(input) {
  return jQuery.timeago(input);
}

export default Ember.Handlebars.makeBoundHelper(timeAgo);
