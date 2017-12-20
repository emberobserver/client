var TapReporter = require('testem/lib/reporters/tap_reporter');

function FailureOnlyReporter() {
  TapReporter.apply(this, arguments);
  this._reportCount = 0;
}

FailureOnlyReporter.prototype = Object.create(TapReporter.prototype);
FailureOnlyReporter.prototype.constructor = FailureOnlyReporter;

FailureOnlyReporter.prototype.display = function(prefix, result) {
  this._reportCount++;

  if (!result.passed) {
    TapReporter.prototype.display.apply(this, arguments);
  }

  if (this._reportCount > 100) {
    this.out.write('pass count: ' + this.pass);
    this._reportCount = 0;
  }
};

module.exports = {
  framework: "qunit",
  test_page: "dist/tests/index.html?hidepassed&hideskipped&timeout=60000",
  timeout: 540,
  reporter: FailureOnlyReporter,
  browser_start_timeout: 400,
  parallel: 4,
  disable_watching: true,
  launchers: {
    BS_Chrome_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "chrome", "--bv", "latest", "--u", "<url>"],
      protocol: "browser"
    },
    BS_Firefox_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "firefox", "--bv", "latest", "--u", "<url>"],
      protocol: "browser"
    },
    BS_Safari_Current: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "OS X", "--osv", "High Sierra", "--b", "safari", "--bv", "11", "--u", "<url>"],
      protocol: "browser"
    },
    BS_Safari_Last: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "OS X", "--osv", "Sierra", "--b", "safari", "--bv", "10.1", "--u", "<url>"],
      protocol: "browser"
    },
    BS_MS_Edge: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "edge", "--bv", "latest", "--u", "<url>"],
      protocol: "browser"
    },
    BS_IE_11: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "ie", "--bv", "11.0", "--u", "<url>"],
      protocol: "browser"
    }
  },
  launch_in_dev: [],
  launch_in_ci: [
    "BS_Safari_Current",
    "BS_MS_Edge",
    "BS_IE_11"
  ]
};
