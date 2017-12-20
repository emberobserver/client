module.exports = {
  framework: "qunit",
  test_page: "dist/tests/index.html?hidepassed&hideskipped&timeout=60000",
  timeout: 540,
  tap_quiet_logs: true,
  browser_start_timeout: 600,
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
