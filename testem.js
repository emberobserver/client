/* eslint-env node */
module.exports = {
  test_page: 'tests/index.html?hidepassed',
  parallel: 2,
  browser_start_timeout: 600,
  disable_watching: true,
  "launchers": {
    "bs_ie": {
      command: "node_modules/.bin/browserstack-launch --os Windows --osv 10 --b ie --bv 11.0 -t 600 -u <url>",
      "protocol": "browser"
    },
    bs_edge: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "edge", "--bv", "16.0", "-t", "600", "--u"],
      protocol: "browser"
    },
    bs_chrome: {
      exe: "node_modules/.bin/browserstack-launch",
      args: ["--os", "Windows", "--osv", "10", "--b", "chrome", "--bv", "latest", "-t", "600", "--u"],
      protocol: "browser"
    }
  },
  "launch_in_dev": [
    "bs_chrome",
    "bs_edge"
  ],
  "launch_in_ci": [
    "bs_chrome",
    "bs_edge"
  ]
};
