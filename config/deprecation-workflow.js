window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-polyfills.deprecate-merge" }, // ember-data, sigh (https://github.com/emberjs/data/pull/5812)
  ]
};
