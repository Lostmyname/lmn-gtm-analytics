/* global ga */

function ensureGA(timeout) {
  var start = Date.now();
  return new Promise(waitForGA);
  function waitForGA(resolve, reject) {
    if (typeof ga !== 'undefined') {
      return resolve();
    } else if (timeout && (Date.now() - start) >= timeout) {
      return reject(new Error('Timeout'));
    }
    setTimeout(waitForGA.bind(this, resolve, reject), 50);
  }
}
/**
 * Analytics wrapper for the Segment to GTM integration
 */
const analytics = {
  track: (action, properties, options, callback) => {
    return ensureGA()
      .then(() => {
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
        if (typeof ga === 'function') {
          ga('send', 'event', properties.category, action, properties.label, properties.value);
        }
        if (callback) {
          callback();
        }
      });
  },
  page: (category, name, properties, options, callback) => {
    return ensureGA()
      .then(() => {
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
          callback =  name;
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
        if (typeof ga === 'function' && typeof window !== 'undefined') {
          console.log(window.location.pathname);
          ga('send', 'pageview', window.location.pathname);
        }
        this.track(`Viewed ${name} Page`, properties, options);
        if (callback) {
          callback();
        }
        return this;
      });

  },
  getDimensionFromName: (name) => {
    // Get Gianluca to look at this - can GTM do it better?
    const dimensions = {
      'Experiment: Exp 4972080620': 'dimension4',
      'Experiment: Exp 5139652954': 'dimension11',
      'Experiment: Exp 5332020036': 'dimension6',
      'Experiment: Exp 5338213541': 'dimension14',
      'Experiment: Exp 5344250821': 'dimension5',
      'Experiment: Exp 5470320276': 'dimension10',
      'Experiment: Exp 5533390779': 'dimension9',
      'Experiment: Exp 5711160113': 'dimension15',
      'Experiment: Exp 5777770141': 'dimension7',
      'Experiment: Exp 5957381339': 'dimension8',
      'Experiment: Exp 6010632105': 'dimension7',
      containsDeluxe: 'dimension13',
      containsGiftWrap: 'dimension12'
    };
    return dimensions[name];
  },
  identify: (id, traits, options, callback) => {
    return ensureGA()
      .then(() => {
        if (typeof options === 'function') {
          callback = options;
          options = null;
        }
        if (typeof traits === 'function') {
          callback = traits;
          options = null;
          traits = null;
        }
        if (typeof ga === 'function') {
          ga('set', 'userId', id);
        }
        if (traits && typeof traits !== 'function') {
          Object.keys(traits).forEach((trait) => {
            if (trait.startsWith('Experiment:')) {
              if (typeof ga === 'function') {
                ga('set', this.getDimensionFromName(trait), traits[trait]);
              }
            }
          });
        }

        if (callback) {
          callback();
        }
        return this;
      });
  },
  impression: (productObject) => {
    return ensureGA()
      .then(() => {
        if (typeof ga === 'function') {
          ga('ec:addImpression', productObject);
        }
      });
  },
  ready: (callback) => {
    if (callback) {
      callback();
    }
    return this;
  }
};



export default analytics;
