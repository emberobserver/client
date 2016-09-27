import Ember from 'ember';
import LocalStorage from './local-storage';

/*
 * This file provide a simple utility for capturing network requests into local
 * storage and playing them back later for a subsequent page load. This is
 * useful for benchmarking where you would like to remove as much variables as
 * possible (network requests in this case) to keep the runs consistent.
 *
 * To use this, simply add `?perf.capture` to the URL. Once the page has loaded
 * you can navigate to `?perf.playback` and see that all network requests were
 * served from the local cache.
 *
 * Currently, this requires manually wrapping the places where we are making
 * network requests (i.e. in the Ember Data adapter) with the `ajax` function
 * (see below). Ideally, we would want to do this at a lower level by stubbing
 * `XMLHttpRequest`, which would allow all network requests to be captured
 * automatically.
 *
 * There are also two additional benchmarking modes `?perf.profile` and
 * `?perf.tracing`. The former wraps the initial render in a CPU profile. The
 * latter is intended to be used with `chrome-tracing` where it redirects to
 * `about:blank` after the initial render as the termination signal. Both of
 * these modes implies `?perf.playback`.
 */

const SHOULD_CAPTURE  = location.search === '?perf.capture';
const SHOULD_PLAYBACK = location.search === '?perf.playback' || location.search === '?perf.profile' || location.search === '?perf.tracing';

let EXPECTED_REQUESTS;

if (SHOULD_CAPTURE) {
  EXPECTED_REQUESTS = 0;
}

if (SHOULD_PLAYBACK) {
  EXPECTED_REQUESTS = LocalStorage.fetch('CACHE-EXPECTED');

  if (!EXPECTED_REQUESTS) {
    throw new Error('MISSING CACHE-EXPECTED');
  }
}

function HIT(key) {
  console.log(`CACHE HIT: ${key}`);
}

function MISS(key) {
  throw new Error(`CACHE MISS: ${key}`);
}

function STORE(key, value) {
  LocalStorage.save(key, JSON.stringify(value));
  LocalStorage.save('CACHE-EXPECTED', JSON.stringify(++EXPECTED_REQUESTS));

  // If we don't see any new requests for another second, assume we are done
  Ember.run.debounce(null, done, 1000);

  return value;
}

function LOAD(key) {
  let value = LocalStorage.fetch(key);

  if (!value) {
    return MISS(key);
  }

  HIT(key);

  if (--EXPECTED_REQUESTS === 0) {
    done();
  }

  return JSON.parse(value);
}

/**
 * This is for wrapping the `ajax` method in Ember Data's `RestAdapter` and
 * other similar Promise-based APIs. It takes the same arguments as the
 * original `ajax` method (a URL, a request type, an options hash) and an
 * additional callback for performing the actual request. It returns a
 * Promise just like the original method.
 */
export default function ajax(url, type, options, fetch) {
  if (SHOULD_PLAYBACK) {
    let key = keyFor(url, type, options);
    return Ember.RSVP.resolve(LOAD(key));
  } else if (SHOULD_CAPTURE) {
    let key = keyFor(url, type, options);
    return fetch().then(data => STORE(key, data));
  } else {
    return fetch();
  }
}

function keyFor(url, type, options) {
  let query = JSON.stringify(options && options.data || {});
  return `AJAX-${type}-${url}-${query}`;
}

function done() {
  if (SHOULD_CAPTURE) {
    console.log(`Captured ${EXPECTED_REQUESTS} requests into localStorage`);
  } else if (SHOULD_PLAYBACK) {
    console.log(`Played back all captured requests from localStorage`);
  }

  performance.mark('dataLoaded');

  Ember.run.schedule('afterRender', renderEnd);
}

function renderEnd() {
  requestAnimationFrame(function () {
    performance.mark('beforePaint');

    requestAnimationFrame(function () {
      performance.mark('afterPaint');

      performance.measure('assets', 'domLoading', 'beforeVendor');

      performance.measure('evalVendor', 'beforeVendor', 'beforeApp');
      performance.measure('evalApp', 'beforeApp', 'afterApp');

      performance.measure('boot', 'beforeVendor', 'willTransition');
      performance.measure('routing', 'willTransition', 'didTransition');
      performance.measure('render', 'didTransition', 'beforePaint');
      performance.measure('paint', 'beforePaint', 'afterPaint');

      performance.measure('data', 'willTransition', 'dataLoaded');
      performance.measure('adterData', 'dataLoaded', 'beforePaint');

      if (location.search === '?perf.capture' || location.search === '?perf.tracing') {
        document.location.href = 'about:blank';
      } else if (location.search === '?perf.profile') {
        console.profileEnd('initialRender'); // eslint-disable-line no-console
      }
    });
  });
}
