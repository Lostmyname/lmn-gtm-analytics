import analytics from '../../src/lmn-gtm-analytics';

describe('analytics', () => {
  beforeEach(() => {
    global.ga = () => {};
    spy(global, 'ga');
  });
  describe('track function', () => {
    it('should call the ga() function', () => {
      analytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      }, () => {
        expect(global.ga)
          .to.have.been.calledOnce;
      });
    });

    describe('argument shuffling', () => {
      it('should pass data if no callback is set', () => {
        global.ga.reset();

        analytics.track('Custom Event', {
          category: 'Category',
          label: 'Label'
        }, () => {
          expect(global.ga)
            .to.have.been.calledWith('send', 'event', 'Category', 'Custom Event', 'Label', undefined);
        });
      });

      it('should pass data if no callback or options are set', () => {
        global.ga.reset();

        analytics.track('Custom Event-2', {
          category: 'Category-2',
          label: 'Label-2'
        }, {
          integrations: {
            Optimizely: false
          }
        }, () => {
          expect(global.ga)
            .to.have.been.calledWith('send', 'event', 'Category-2', 'Custom Event-2', 'Label-2', undefined);
        });
      });

      it('should pass data if no callback, options, or properties are set', () => {
        global.ga.reset();

        analytics.track('Custom Event-3', () => {
          expect(global.ga)
            .to.have.been.calledWith('send', 'event', undefined, 'Custom Event-3', undefined, undefined);
        });
      });
    });

    describe('callbacks', () => {
      it('should run a callback with all arguments passed', (done) => {
        analytics.track('Custom Event', {
          category: 'test',
          label: 'test'
        }, {
          integrations: {
            Optimizely: false
          }
        }, () => done());
      });

      it('should shuffle the arguments if no options are set', (done) => {
        analytics.track('Custom Event', {
          category: 'test',
          label: 'test'
        }, () => done());
      });

      it('should shuffle the arguments if no options or properties arguments are set', (done) => {
        analytics.track('Custom Event', () => done());
      });
    });
  });

  describe('page function', () => {

    beforeEach(() => {
      spy(analytics, 'track');
    });

    it('should call the ga() function', () => {
      global.ga.reset();

      analytics.page('Creation Canvas', {
        locale: 'en-GB',
        orientation: 'landscape'
      }, () => {
        expect(global.ga)
          .to.have.been.calledOnce;

        expect(analytics.track)
          .to.have.been.calledOnce;
      });
    });

    describe('argument shuffling', () => {
      it('should still pass data if the options argument is omitted', () => {
        global.ga.reset();

        analytics.page('Category', 'Homepage', {
          test: 'test'
        }, () => {
          expect(global.ga)
            .to.have.been.calledOnce;

          expect(analytics.track)
            .to.have.been.calledWith('Viewed Homepage Page', { test: 'test' }, null);
        });
      });

      it('should still pass data if options and properties are removed', () => {
        global.ga.reset();

        analytics.page('Category-2', 'Homepage-2', () => {
          expect(global.ga)
            .to.have.been.calledOnce;

          expect(analytics.track)
            .to.have.been.calledWith('Viewed Homepage-2 Page', null, null);
        });
      });

      it('should still pass data if options, properties and name are omitted', () => {
        global.ga.reset();

        analytics.page('Homepage-3', () => {
          expect(global.ga)
            .to.have.been.calledOnce;

          expect(analytics.track)
            .to.have.been.calledWith('Viewed Homepage-3 Page', null, null);
        });
      });

      it('should still pass data if category is a string and name is not a string', () => {
        global.ga.reset();

        analytics.page('Homepage-4', {
          locale: 'en-GB'
        }, () => {
          expect(global.ga)
            .to.have.been.calledOnce;

          expect(analytics.track)
            .to.have.been.calledWith('Viewed Homepage-4 Page', { locale: 'en-GB' }, undefined);
        });
      });
    });
    describe('callbacks', () => {
      it('should callback if provided', (done) => {
        analytics.page('Category', 'Homepage-1', {}, {}, done());
      });
      it('should callback if options is the callback', (done) => {
        analytics.page('Category', 'Homepage-1', {}, done());
      });
      it('should callback if properties is the callback', (done) => {
        analytics.page('Category', 'Homepage-2', done());
      });
    });
  });

  describe('identify function', () => {
    it('should call an identify ga() function', () => {
      global.ga.reset();

      analytics.identify('12345', () => {
        expect(global.ga)
          .to.have.been.calledOnce;
      });
    });

    it('should call additional dimension calls for each Experiment trait', () => {
      global.ga.reset();

      analytics.identify('12345', {
        'Experiment: Exp 1234567890': '1_control',
        'Experiment: Exp 0987654321': '2_variant'
      }, () => {
        expect(global.ga)
          .to.have.been.calledThrice;
      });
    });

    it('should not call dimension calls for non Experiment traits', () => {
      global.ga.reset();

      analytics.identify('12345', {
        locale: 'en-GB',
        email: 'test@example.com'
      }, () => {
        expect(global.ga)
          .to.have.been.calledOnce;
      });
    });

    describe('argument shuffling', () => {
      it('should still pass data if options is omitted', () => {
        global.ga.reset();

        analytics.identify('12345', {
          trait: 'test'
        }, () => {
          expect(global.ga)
            .to.have.been.calledOnce;
        });
      });

      it('should still pass data if options and traits are omitted', () => {
        global.ga.reset();

        analytics.identify('12345123', () => {
          expect(global.ga)
            .to.have.been.calledOnce;
        });
      });
    });

    describe('callbacks', () => {
      it('should callback if provided', (done) => {
        analytics.identify('12345', {}, {}, done());
      });
      it('should callback if the options is omitted', (done) => {
        analytics.identify('12345', {}, done());
      });

      it('should callback if options and traits are omitted', (done) => {
        analytics.identify('12345', done());
      });
    });
  });

  describe('ready function', () => {
    it('should callback', (done) => analytics.ready(done()));
  });

  describe('getDimensionFromName function', () => {
    it('returns a value if one of the keys exists', () => {
      expect(analytics.getDimensionFromName('Experiment: Exp 4972080620'))
        .to.equal('dimension4');
    });
    it('returns null if no key matches', () => {
      expect((analytics.getDimensionFromName('BREAKING') === undefined))
        .to.equal(true);
    });
  });
});

describe('async ga', () => {
  beforeEach(() => {
    spy(global, 'ga');
    setTimeout(() => global.ga = () => {}, 150);
  });

  describe('track', () => {
    it('waits for ga to be defined', () => {
      analytics.track('Custom Event', () => {
        expect(global.ga)
          .to.have.been.calledOnce;
        global.ga.reset();
      });
    });
  });
  describe('page', () => {
    it('waits for ga to be defined', () => {
      analytics.page('Custom Page', () => {
        expect(global.ga)
          .to.have.been.calledOnce();
        global.ga.reset();
      });
    });
  });
  describe('identify', () => {
    it('waits for ga to be defined', () => {
      analytics.identify('Custom ID', () => {
        expect(global.ga)
          .to.have.been.calledOnce();
        global.ga.reset();
      });
    });
  });
});
