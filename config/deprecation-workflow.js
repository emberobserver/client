window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchMessage: "Usage of `_actions` is deprecated, use `actions` instead." }
  ]
};
