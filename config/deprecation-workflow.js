window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-runtime.enumerable-contains" },
    { handler: "silence", matchId: "ember-htmlbars.ember-handlebars-safestring" }
  ]
};
