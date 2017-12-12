/* global analytics, dataLayer */

import Cookies from 'js-cookie';
import uuid from 'uuid';

function ensureSetup() {
  window.dataLayer = window.dataLayer || [];
}

function getClientUuid() {
  var foundCookie = Cookies.get('clientUuid');
  if (foundCookie) {
    return foundCookie;
  }

  var newUuid = uuid.v4();
  Cookies.set('clientUuid', newUuid, { expires: 365 });
  return newUuid;
}

function getGaCookieId() {
  return Cookies.get('_ga') || 'not-set';
}

function eventMetaData() {
  return {
    sentTimestamp: (+new Date()).toString(),
    clientUuid: getClientUuid().toString(),
    gaCookieId: getGaCookieId().toString()
  };
}

/**
 * Analytics wrapper for the Segment to GTM integration
 */
const lmnAnalytics = {
  track: function (action, properties, options, callback) {
    ensureSetup();

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

    Object.assign(properties, eventMetaData());
    // reconstruct arguments after sanitisation to proxy through
    const args = [action, properties, options, callback].filter(x => x);
    analytics.track.apply(this, args);

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
  },
  page: function (category, name, properties, options, callback) {
    ensureSetup();

    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    if (typeof properties === 'function') {
      callback = properties;
      options = null;
      properties = {};
    }
    if (typeof name === 'function') {
      callback = name;
      options = null;
      properties = {};
      name = null;
    }
    if (typeof name === 'object') {
      options = properties;
      properties = name;
      name = null;
    }
    if (typeof category === 'string' && typeof name !== 'string') {
      name = null;
    }
    if (!properties) {
      properties = {};
    }

    Object.assign(properties, eventMetaData());
    // reconstruct arguments after sanitisation to proxy through
    const args = [category, name, properties, options, callback].filter(x => x);
    analytics.page.apply(this, args);

    dataLayer.push(Object.assign(properties, {
      event: category,
      pageName: name
    }));

    if (callback) {
      callback();
    }
  },
  identify: function (id, traits, options, callback) {
    ensureSetup();

    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    if (typeof traits === 'function') {
      callback = traits;
      options = null;
      traits = null;
    }

    traits = Object.assign(traits || {}, eventMetaData());
    // reconstruct arguments after sanitisation to proxy through
    const args = [id, traits, options, callback].filter(x => x);
    analytics.identify.apply(this, args);

    dataLayer.push(
      Object.assign(
        traits,
        { user: { userId: id } }
      )
    );

    if (traits && typeof traits !== 'function') {
      Object.keys(traits).forEach(trait => {
        if (trait.startsWith('Experiment:')) {
          dataLayer.push(
            Object.assign(eventMetaData(),
            { experimentName: trait, experimentVariant: traits[trait] }
          ));
        }
      });
    }

    if (callback) {
      callback();
    }
    return this;
  },
  impression: function (impressions) {
    ensureSetup();
    impressions.forEach(impression => {
      analytics.track(
        'Viewed Impression',
        Object.assign(impression, eventMetaData())
      );
    });

    dataLayer.push(
      Object.assign(eventMetaData(),
      { ecommerce: { impressions: impressions } }
    ));
  },
  ready: function (callback) {
    if (callback) {
      callback();
    }
    return this;
  }
};

export default lmnAnalytics;
