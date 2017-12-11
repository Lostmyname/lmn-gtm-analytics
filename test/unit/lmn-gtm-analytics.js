/* eslint-disable max-nested-callbacks */
import lmnAnalytics from '../../src/lmn-gtm-analytics';

describe('lmnAnalytics', () => {
  beforeEach(() => {
    global.analytics = {
      track: function () {},
      page: function () {},
      identify: function () {}
    };
    global.dataLayer = [];
    global.window = {};
    spy(global.analytics, 'track');
    spy(global.analytics, 'page');
    spy(global.analytics, 'identify');
  });
  describe('track function', () => {
    it('should call the dataLayer push', () => {
      lmnAnalytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      });

      expect(global.dataLayer.length).to.equal(1);
    });

    it('should call the analytics.track function', () => {
      lmnAnalytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      });

      expect(global.analytics.track).to.have.been.calledOnce;
    });

    it('should call the analytics.track function with the same arguments', () => {
      lmnAnalytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      });

      expect(global.analytics.track).to.have.been.calledWithMatch('Custom Event', {
        category: 'test',
        label: 'test'
      });
    });

    it('should call the analytics.track function with event metadata', () => {

      lmnAnalytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      });

      expect(global.dataLayer[0].clientUuid).to.not.be.null;
      expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
      expect(global.dataLayer[0].gaCookieId).to.be.null;
    });

    describe('argument shuffling', () => {
      it('should pass data if no callback is set', () => {

        lmnAnalytics.track('Custom Event', {
          category: 'Category',
          label: 'Label'
        });

        expect(global.dataLayer[0].event).to.eql('Custom Event');
        expect(global.dataLayer[0].category).to.eql('Category');
        expect(global.dataLayer[0].label).to.eql('Label');
        expect(global.dataLayer[0].value).to.eql(undefined);
      });

      it('should pass data if no callback or options are set', () => {
        lmnAnalytics.track('Custom Event-2', {
          category: 'Category-2',
          label: 'Label-2',
          value: 'Value-2'
        }, {
          integrations: {
            Optimizely: false
          }
        });

        expect(global.dataLayer[0].event).to.eql('Custom Event-2');
        expect(global.dataLayer[0].category).to.eql('Category-2');
        expect(global.dataLayer[0].label).to.eql('Label-2');
        expect(global.dataLayer[0].value).to.eql('Value-2');
      });

      it('should pass data if no callback, options, or properties are set', () => {
        lmnAnalytics.track('Custom Event-3');

        expect(global.dataLayer[0].category).to.eql('All');
        expect(global.dataLayer[0].event).to.eql('Custom Event-3');
        expect(global.dataLayer[0].action).to.eql('Custom Event-3');
        expect(global.dataLayer[0].label).to.eql(undefined);
        expect(global.dataLayer[0].value).to.eql(undefined);
      });
    });

    describe('callbacks', () => {
      it('should run a callback with all arguments passed', (done) => {
        lmnAnalytics.track('Custom Event', {
          category: 'test',
          label: 'test'
        }, {
          integrations: {
            Optimizely: false
          }
        }, () => done());
      });

      it('should shuffle the arguments if no options are set', (done) => {
        lmnAnalytics.track('Custom Event', {
          category: 'test',
          label: 'test'
        }, () => done());
      });

      it('should shuffle the arguments if no options or properties arguments are set', (done) => {
        lmnAnalytics.track('Custom Event', () => done());
      });
    });
  });

  describe('page function', () => {
    beforeEach(() => {
      spy(lmnAnalytics, 'page');
    });

    it('should call the dataLayer push', () => {
      lmnAnalytics.page('Creation Canvas', {
        locale: 'en-GB',
        orientation: 'landscape'
      });

      expect(global.dataLayer[0].event).to.eql('Creation Canvas');
      expect(global.dataLayer[0].locale).to.eql('en-GB');
      expect(global.dataLayer[0].orientation).to.eql('landscape');
    });

    it('should call analytics.page ()', () => {
      lmnAnalytics.page('Creation Canvas', {
        locale: 'en-GB'
      });

      expect(global.analytics.page).to.have.been.calledOnce;
    });

    it('should call analytics.page() with the right arguments', () => {
      lmnAnalytics.page('Creation Canvas', {
        locale: 'en-GB'
      });

      expect(global.analytics.page).to.have.been.calledWithMatch('Creation Canvas', {
        locale: 'en-GB'
      });
    });

    it('should call the analytics.page function with event metadata', () => {
      lmnAnalytics.page('Category', 'Homepage', {
        test: 'test'
      });

      expect(global.dataLayer[0].clientUuid).to.not.be.null;
      expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
      expect(global.dataLayer[0].gaCookieId).to.be.null;
    });

    describe('argument shuffling', () => {
      it('should still pass data if the options argument is omitted', () => {
        lmnAnalytics.page('Homepage', 'page name', {
          test: 'test'
        });

        expect(global.dataLayer[0].event).to.eql('Homepage');
        expect(global.dataLayer[0].pageName).to.eql('page name');
        expect(global.dataLayer[0].test).to.eql('test');
      });

      it('should still pass data if options and properties are removed', () => {
        lmnAnalytics.page('Category-2', 'Homepage-2');

        expect(global.dataLayer[0].event).to.eql('Category-2');
        expect(global.dataLayer[0].pageName).to.eql('Homepage-2');
      });

      it('should still pass data if options, properties and name are omitted', () => {
        lmnAnalytics.page('Homepage-3');

        expect(global.dataLayer[0].event).to.eql('Homepage-3');
      });

      it('should still pass data if category is a string and name is not a string', () => {
        lmnAnalytics.page('Homepage-4', {
          locale: 'en-GB'
        });

        expect(global.dataLayer[0].event).to.eql('Homepage-4');
        expect(global.dataLayer[0].locale).to.eql('en-GB');
      });
    });

    describe('callbacks', () => {
      it('should callback if provided', (done) => {
        lmnAnalytics.page('Category', 'Homepage-1', {}, {}, done());
      });
      it('should callback if options is the callback', (done) => {
        lmnAnalytics.page('Category', 'Homepage-1', {}, done());
      });
      it('should callback if properties is the callback', (done) => {
        lmnAnalytics.page('Category', 'Homepage-2', done());
      });
    });
  });

  describe('identify function', () => {
    it('should call an identify dataLayer push', () => {
      lmnAnalytics.identify('12345');

      expect(global.dataLayer.slice(-1)[0]).to
        .nested.include({ 'user.userId': '12345' });
    });

    it('should call the analytics.identify function', () => {
      lmnAnalytics.identify('12345', {
        email: 'test@example.com'
      });

      expect(global.analytics.identify).to.have.been.calledOnce;
    });

    it('should call the analytics.identify function with the right arguments', () => {
      lmnAnalytics.identify('12345', {
        email: 'test@example.com'
      });

      expect(global.analytics.identify).to.have.been.calledWithMatch('12345', {
        email: 'test@example.com',
      });
    });

    it('should call additional dimension calls for each Experiment trait', () => {
      lmnAnalytics.identify('12345', {
        'Experiment: Exp 1234567890': '1_control',
        'Experiment: Exp 0987654321': '2_variant'
      });

      expect(global.dataLayer[0].user.userId).eql('12345');
      // 1_control
      expect(global.dataLayer[1].experimentName).eql('Experiment: Exp 1234567890');
      expect(global.dataLayer[1].experimentVariant).eql('1_control');
      // 2_variant
      expect(global.dataLayer[2].experimentName).eql('Experiment: Exp 0987654321');
      expect(global.dataLayer[2].experimentVariant).eql('2_variant');
    });

    it('should not call dimension calls for non Experiment traits', () => {
      lmnAnalytics.identify('12345', {
        locale: 'en-GB',
        email: 'test@example.com'
      });

      expect(global.dataLayer[0].user.userId).eql('12345');
    });

    describe('argument shuffling', () => {
      it('should still pass data if options is omitted', () => {
        lmnAnalytics.identify('12345', {
          trait: 'test'
        });

        // @carmen
        // note in the current implementation trait is not sent, is this right?

        expect(global.dataLayer[0].user.userId).eql('12345');
      });

      it('should still pass data if options and traits are omitted', () => {
        lmnAnalytics.identify('12345123');

        expect(global.dataLayer[0].user.userId).eql('12345123');
      });
    });

    it('should call analytics.identify function with event metadata', () => {
      lmnAnalytics.identify('12345123');

      expect(global.dataLayer[0].clientUuid).to.not.be.null;
      expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
      expect(global.dataLayer[0].gaCookieId).to.be.null;
    });

    describe('callbacks', () => {
      it('should callback if provided', (done) => {
        lmnAnalytics.identify('12345', {}, {}, done());
      });
      it('should callback if the options is omitted', (done) => {
        lmnAnalytics.identify('12345', {}, done());
      });

      it('should callback if options and traits are omitted', (done) => {
        lmnAnalytics.identify('12345', done());
      });
    });
  });

  describe('ready function', () => {
    it('should callback', (done) => lmnAnalytics.ready(done()));
  });

  describe('impression function', () => {
    it('should call an impression dataLayer push', () => {
      lmnAnalytics.impression([{
        id: 'P12345',
        name: 'Product Name'
      }]);

      expect(global.dataLayer[0].ecommerce.impressions[0].id).to.eql('P12345');
      expect(global.dataLayer[0].ecommerce.impressions[0].name).to.eql('Product Name');
    });

    it('should call the analytics.impression with event metadata', () => {
      lmnAnalytics.impression([{
        id: 'P12345',
        name: 'Product Name'
      }]);

      expect(global.dataLayer[0].clientUuid).to.not.be.null;
      expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
      expect(global.dataLayer[0].gaCookieId).to.be.null;
    });
  });
});
