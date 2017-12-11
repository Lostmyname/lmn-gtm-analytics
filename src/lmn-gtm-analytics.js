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
  return Cookies.get('_ga') || null;
}

function eventMetaData() {
  return {
    sentTimestamp: + new Date(),
    clientUuid: getClientUuid(),
    gaCookieId: getGaCookieId()
  };
}

function argumentsWithEventMetaData(args) {
  args[1] = Object.assign(args[1] || {}, eventMetaData());

  return args;
}

/**
 * Analytics wrapper for the Segment to GTM integration
 */
const lmnAnalytics = {
  track: function (action, properties, options, callback) {
    ensureSetup();
    analytics.track.apply(this, argumentsWithEventMetaData(arguments));
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
  page: function (category, name, properties = {}, options, callback) {
    ensureSetup();
    analytics.page.apply(this, argumentsWithEventMetaData(arguments));
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
    dataLayer.push(Object.assign(properties, eventMetaData()));
    return this;
  },
  identify: function (id, traits, options, callback) {
    ensureSetup();
    analytics.identify.apply(this, argumentsWithEventMetaData(arguments));
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }
    if (typeof traits === 'function') {
      callback = traits;
      options = null;
      traits = null;
    }
    dataLayer.push(
      Object.assign(eventMetaData(),
      { user: { userId: id } }
    ));

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
      analytics.track('Viewed Impression', impression);
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
