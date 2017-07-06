/* global analytics, dataLayer */

function ensureGTM(timeout) {
  var start = Date.now();
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
    return ensureGTM().then(() => {
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
    return ensureGTM().then(() => {
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
    return ensureGTM().then(() => {
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
    return ensureGTM().then(() => {
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
