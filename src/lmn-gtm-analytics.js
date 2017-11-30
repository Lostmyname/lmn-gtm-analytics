/* global analytics, dataLayer, ga, crypto */

let eventProperties = {
  ga_cookie_id: null,
  user_id: null,
  timestamp: null
}

// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
    .toString(16)
  )
}


function ensureSetup(timeout) {
  var start = Date.now();
  eventProperties.timestamp = + new Date();
  if (typeof ga !== 'undefined') {
    eventProperties.ga_cookie_id = ga.getAll()[0].get('clientId');
  }
  eventProperties.user_id = uuidv4();

  debugger

  return new Promise(waitForGTM);
  function waitForGTM(resolve, reject) {
    if (typeof dataLayer !== 'undefined') {
      return resolve();
    } else if (timeout && Date.now() - start >= timeout) {
      return reject(new Error('Timeout'));
    }
    setTimeout(waitForGTM.bind(this, resolve, reject), 50);
  }
}
/**
 * Analytics wrapper for the Segment to GTM integration
 */
const lmnAnalytics = {
  track: function (action, properties, options, callback) {
    return ensureSetup().then(() => {
      analytics.track.apply(this, arguments);
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }
      if (typeof properties === 'function') {
        callback = properties;
        options = null;
        properties = {};
      }
      if (!properties) {
        properties = {};
      }
      if (!properties.category) {
        properties.category = 'All';
      }
      dataLayer.push(
        Object.assign(properties, {
          event: action,
          action: action,
          category: properties.category,
          label: properties.label,
          value: properties.value
        })
      );
      if (callback) {
        callback();
      }
    });
  },
  page: function (category, name, properties, options, callback) {
    return ensureSetup().then(() => {
      analytics.page.apply(this, arguments);
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }
      if (typeof properties === 'function') {
        callback = properties;
        options = null;
        properties = null;
      }
      if (typeof name === 'function') {
        callback = name;
        options = null;
        properties = null;
        name = null;
      }
      if (typeof name === 'object') {
        options = properties;
        properties = name;
        name = null;
      }
      if (typeof category === 'string' && typeof name !== 'string') {
        name = category;
        category = null;
      }
      if (callback) {
        callback();
      }
      dataLayer.push(properties);
      return this;
    });
  },
  identify: function (id, traits, options, callback) {
    return ensureSetup().then(() => {
      analytics.identify.apply(this, arguments);
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }
      if (typeof traits === 'function') {
        callback = traits;
        options = null;
        traits = null;
      }
      dataLayer.push({
        user: {
          userId: id
        }
      });
      if (traits && typeof traits !== 'function') {
        Object.keys(traits).forEach(trait => {
          if (trait.startsWith('Experiment:')) {
            dataLayer.push({
              experimentName: trait,
              experimentVariant: traits[trait]
            });
          }
        });
      }

      if (callback) {
        callback();
      }
      return this;
    });
  },
  impression: function (impressions) {
    return ensureSetup().then(() => {
      impressions.forEach(impression => {
        analytics.track('Viewed Impression', impression);
      });
      dataLayer.push({
        ecommerce: {
          impressions: impressions
        }
      });
    });
  },
  ready: function (callback) {
    if (callback) {
      callback();
    }
    return this;
  }
};

export default lmnAnalytics;
