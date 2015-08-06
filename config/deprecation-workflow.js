window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Ember.Handlebars.helper is deprecated, please refactor to Ember.Helper.helper" },
    { handler: "silence", matchMessage: "Using Ember.Handlebars.makeBoundHelper is deprecated. Please refactor to using `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: "Using `Ember.HTMLBars.makeBoundHelper` is deprecated. Please refactor to using `Ember.Helper` or `Ember.Helper.helper`." },
    { handler: "silence", matchMessage: "Using Ember.HTMLBars._registerHelper is deprecated. Helpers (even dashless ones) are automatically resolved." },
    { handler: "silence", matchMessage: "`lookupFactory` was called on a Registry. The `initializer` API no longer receives a container, and you should use an `instanceInitializer` to look up objects from the container." },
    { handler: "silence", matchMessage: "Your custom serializer uses the old version of the Serializer API, with `extract` hooks. Please upgrade your serializers to the new Serializer API using `normalizeResponse` hooks instead." },
    { handler: "silence", matchMessage: "Using store.pushMany() has been deprecated since store.push() now handles multiple items. You should use store.push() instead." },
    { handler: "silence", matchMessage: "store.push(type, data) has been deprecated. Please provide a JSON-API document object as the first and only argument to store.push." },
    { handler: "silence", matchMessage: "Using the same function as getter and setter is deprecated." }
  ]
};
