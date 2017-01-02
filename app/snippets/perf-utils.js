window.performance = window.performance || {};

if (!performance.mark) {
  performance.mark = function() {};
  performance.measure = function() {};
}

// WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=137407
window._performance = window.performance;

/* eslint-disable no-console */
if (!console.profile) {
  console.profile = function() {};
  console.profileEnd = function() {};
}
/* eslint-enable no-console */
