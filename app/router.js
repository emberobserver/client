import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route("categories", function() {
    this.route("show", { path: "/:slug" });
  });

  this.route("addons", function() {
    this.route("show", { path: "/:name" });
    this.route("correct", { path: "/:name/correct" });
  });

  this.route("maintainers", function(){
    this.route("show", { path: "/:name" });
  });

  this.route("login");
  this.route("admin", function(){
  });

  this.route("about");

  this.route('not-found', { path: '/*path' });
});
