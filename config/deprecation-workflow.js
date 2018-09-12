window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-routing.route-router" }, // ember-cli-document-title
    { handler: "silence", matchId: "ember-console.deprecate-logger" }, // ember-moment
  ]
};
