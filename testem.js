/* eslint-env node */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
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
  launch_in_dev: [
    'Chrome'
  ],
  launch_in_ci: [
    "BS_Safari_Current",
    "BS_MS_Edge",
    "BS_IE_11"
  ],
  browser_args: {
    Chrome: {
      mode: 'ci',
      args: [
        '--disable-gpu',
        '--headless',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ]
    }
  }
};
