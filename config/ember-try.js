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
      },
      {
        "name": "ember-source",
        "bower": {
          "dependencies": {
            "ember": null
          }
        },
        "npm": {
          "devDependencies": {
            "ember-source": "2.11.0-alpha.1"
          }
        }
      }
    ]
  };
};
