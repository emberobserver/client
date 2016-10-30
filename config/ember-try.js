/*jshint node:true*/
module.exports = function() {
  return {
    "scenarios": [
      {
        "name": "ember-release",
        "bower": {
          "dependencies": {
            "ember": "release"
          }
        }
      },
      {
        "name": "ember-beta",
        "bower": {
          "dependencies": {
            "ember": "beta"
          }
        }
      },
      {
        "name": "ember-canary",
        "bower": {
          "dependencies": {
            "ember": "canary"
          }
        }
      }
    ]
  };
};
