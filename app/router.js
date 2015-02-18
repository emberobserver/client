import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route("categories", function() {
    this.route("show", { path: "/:id" });
  });

  this.route("addons", function() {
    this.route("show", { path: "/:id" });
  });

  this.route("maintainers", function(){
    this.route("show", { path: "/:id" });
  });

  this.route("login");
  this.route("admin", function(){
  });

  this.route('not-found', { path: '/*path' });
});

export default Router;
