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
    //spy(global.analytics, 'track');
    //spy(global.analytics, 'page');
    //spy(global.analytics, 'identify');
  });
  describe('track function', () => {
    //it('should call the dataLayer push', () => {
    //  lmnAnalytics.track('Custom Event', {
    //    category: 'test',
    //    label: 'test'
    //  })
    //    .then(() => {
    //      expect(global.dataLayer)
    //        .length.to.equal(1);
    //    });
    //});

    //it('should call the analytics.track function', () => {
    //  lmnAnalytics.track('Custom Event', {
    //    category: 'test',
    //    label: 'test'
    //  })
    //    .then(() => {
    //      expect(global.analytics.track)
    //        .to.have.been.calledOnce;
    //    });
    //});

    //it('should call the analytics.track function with the same arguments', () => {
    //  lmnAnalytics.track('Custom Event', {
    //    category: 'test',
    //    label: 'test'
    //  })
    //    .then(() => {
    //      expect(global.analytics.track)
    //        .to.have.been.calledWith('Custom Event', {
    //          category: 'test',
    //          label: 'test'
    //        });
    //    });
    //});

    it('should call the analytics.track function with event metadata', () => {

      lmnAnalytics.track('Custom Event', {
        category: 'test',
        label: 'test'
      }).catch(() => {
        expect.fail('To be present', 'NULL', 'Metadata missing on page event');
      }).then(() => {
        expect(global.dataLayer[0].clientUuid).to.not.be.null;
        expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
        expect(global.dataLayer[0].gaCookieId).to.be.null;
      });
    });

    //describe('argument shuffling', () => {
    //  it('should pass data if no callback is set', () => {

    //    lmnAnalytics.track('Custom Event', {
    //      category: 'Category',
    //      label: 'Label'
    //    })
    //      .then(() => {
    //        expect(global.dataLayer.slice(-1)[0])
    //          .to.eql({
    //            event: 'Custom Event',
    //            category: 'Category',
    //            label: 'Label',
    //            value: undefined
    //          });
    //      });
    //  });

    //  it('should pass data if no callback or options are set', () => {
    //    lmnAnalytics.track('Custom Event-2', {
    //      category: 'Category-2',
    //      label: 'Label-2',
    //      value: 'Value-2'
    //    }, {
    //      integrations: {
    //        Optimizely: false
    //      }
    //    })
    //      .then(() => {
    //        expect(global.dataLayer.slice(-1)[0])
    //          .to.eql({
    //            event: 'Custom Event-2',
    //            category: 'Category-2',
    //            label: 'Label-2',
    //            value: 'Value-2'
    //          });
    //      });
    //  });

    //  it('should pass data if no callback, options, or properties are set', () => {

    //    lmnAnalytics.track('Custom Event-3')
    //      .then(() => {
    //        expect(global.dataLayer.slice(-1)[0])
    //          .to.eql({
    //            event: 'Custom Event-3',
    //            category: 'All',
    //            label: undefined,
    //            value: undefined
    //          });
    //      });
    //  });
    //});

    //describe('callbacks', () => {
    //  it('should run a callback with all arguments passed', (done) => {
    //    lmnAnalytics.track('Custom Event', {
    //      category: 'test',
    //      label: 'test'
    //    }, {
    //      integrations: {
    //        Optimizely: false
    //      }
    //    }, () => done());
    //  });

    //  it('should shuffle the arguments if no options are set', (done) => {
    //    lmnAnalytics.track('Custom Event', {
    //      category: 'test',
    //      label: 'test'
    //    }, () => done());
    //  });

    //  it('should shuffle the arguments if no options or properties arguments are set', (done) => {
    //    lmnAnalytics.track('Custom Event', () => done());
    //  });
    //});
  });

  describe('page function', () => {

    beforeEach(() => {
      spy(lmnAnalytics, 'track');
    });

  //  it('should call the dataLayer push', () => {

  //    lmnAnalytics.page('Creation Canvas', {
  //      locale: 'en-GB',
  //      orientation: 'landscape'
  //    })
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            event: 'Viewed Creation Canvas Page',
  //            category: 'All',
  //            label: undefined,
  //            value: undefined
  //          });
  //      });
  //  });

  //  it('should call analytics.page ()', () => {
  //    lmnAnalytics.page('Creation Canvas', {
  //      locale: 'en-GB'
  //    })
  //      .then(() => {
  //        expect(global.analytics.page)
  //          .to.have.been.calledOnce;
  //      });
  //  });

  //  it('should call analytics.page() with the right arguments', () => {
  //    lmnAnalytics.page('Creation Canvas', {
  //      locale: 'en-GB'
  //    })
  //      .then(() => {
  //        expect(global.analytics.page)
  //          .to.have.been.calledWith('Creation Canvas', {
  //            locale: 'en-GB'
  //          });
  //      });
  //  });

    it('should call the analytics.page function with event metadata', () => {

      lmnAnalytics.page('Category', 'Homepage', {
        test: 'test'
      }).catch(() => {
        expect.fail('To be present', 'NULL', 'Metadata missing on page event');
      }).then(() => {
        expect(global.dataLayer[0].clientUuid).to.not.be.null;
        expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
        expect(global.dataLayer[0].gaCookieId).to.be.null;
      });
    });

  //  describe('argument shuffling', () => {
  //    it('should still pass data if the options argument is omitted', () => {
  //      lmnAnalytics.page('Category', 'Homepage', {
  //        test: 'test'
  //      })
  //        .then(() => {
  //          expect(global.dataLayer.slice(-1)[0])
  //            .to.eql({
  //              event: 'Viewed Homepage Page',
  //              category: 'All',
  //              label: undefined,
  //              value: undefined
  //            });
  //        });
  //    });

  //    it('should still pass data if options and properties are removed', () => {
  //      lmnAnalytics.page('Category-2', 'Homepage-2')
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            event: 'Viewed Homepage-2 Page',
  //            category: 'All',
  //            label: undefined,
  //            value: undefined
  //          });
  //      });
  //    });

  //    it('should still pass data if options, properties and name are omitted', () => {
  //      lmnAnalytics.page('Homepage-3')
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            event: 'Viewed Homepage-3 Page',
  //            category: 'All',
  //            label: undefined,
  //            value: undefined
  //          });
  //      });
  //    });

  //    it('should still pass data if category is a string and name is not a string', () => {
  //      lmnAnalytics.page('Homepage-4', {
  //        locale: 'en-GB'
  //      })
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            event: 'Viewed Homepage-4 Page',
  //            category: 'All',
  //            label: undefined,
  //            value: undefined
  //          });
  //      });
  //    });
  //  });
  //  describe('callbacks', () => {
  //    it('should callback if provided', (done) => {
  //      lmnAnalytics.page('Category', 'Homepage-1', {}, {}, done());
  //    });
  //    it('should callback if options is the callback', (done) => {
  //      lmnAnalytics.page('Category', 'Homepage-1', {}, done());
  //    });
  //    it('should callback if properties is the callback', (done) => {
  //      lmnAnalytics.page('Category', 'Homepage-2', done());
  //    });
  //  });
  });

  describe('identify function', () => {
  //  it('should call an identify dataLayer push', () => {
  //    lmnAnalytics.identify('12345')
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            user: {
  //              userId: '12345'
  //            }
  //          });
  //      });
  //  });

  //  it('should call the analytics.identify function', () => {
  //    lmnAnalytics.identify('12345', {
  //      email: 'test@example.com'
  //    })
  //      .then(() => {
  //        expect(global.analytics.identify)
  //          .to.have.been.calledOnce;
  //      });
  //  });

  //  it('should call the analytics.identify function with the right arguments', () => {
  //    lmnAnalytics.identify('12345', {
  //      email: 'test@example.com'
  //    })
  //      .then(() => {
  //        expect(global.analytics.identify)
  //          .to.have.been.calledWith('12345', {
  //            email: 'test@example.com'
  //          });
  //      });
  //  });

  //  it('should call additional dimension calls for each Experiment trait', () => {
  //    lmnAnalytics.identify('12345', {
  //      'Experiment: Exp 1234567890': '1_control',
  //      'Experiment: Exp 0987654321': '2_variant'
  //    })
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            user: {
  //              userId: '12345'
  //            }
  //          });
  //        expect(global.dataLayer.slice(-2)[0])
  //          .to.eql({
  //            experimentName: 'Experiment: Exp 1234567890',
  //            experimentVariant: '1_control'
  //          });
  //        expect(global.dataLayer.slice(-3)[0])
  //          .to.eql({
  //            experimentName: 'Experiment: Exp 0987654321',
  //            experimentVariant: '2_variant'
  //          });
  //      });
  //  });

  //  it('should not call dimension calls for non Experiment traits', () => {
  //    lmnAnalytics.identify('12345', {
  //      locale: 'en-GB',
  //      email: 'test@example.com'
  //    })
  //      .then(() => {
  //        expect(global.dataLayer.slice(-1)[0])
  //          .to.eql({
  //            user: {
  //              userId: '12345'
  //            }
  //          });
  //      });
  //  });

  //  describe('argument shuffling', () => {
  //    it('should still pass data if options is omitted', () => {
  //      lmnAnalytics.identify('12345', {
  //        trait: 'test'
  //      })
  //        .then(() => {
  //          expect(global.dataLayer.slice(-1)[0])
  //            .to.eql({
  //              user: {
  //                userId: '12345'
  //              }
  //            });
  //        });
  //    });

  //    it('should still pass data if options and traits are omitted', () => {
  //      lmnAnalytics.identify('12345123')
  //        .then(() => {
  //          expect(global.dataLayer.slice(-1)[0])
  //            .to.eql({
  //              user: {
  //                userId: '12345123'
  //              }
  //            });
  //        });
  //    });
  //  });

    it('should call analytics.identify function with event metadata', () => {
      lmnAnalytics.identify('12345123').catch(() => {
        expect.fail('To be present', 'NULL', 'Metadata missing on identify');
      }).then(() => {
        expect(global.dataLayer[0].clientUuid).to.not.be.null;
        expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
        expect(global.dataLayer[0].gaCookieId).to.be.null;
      });
    });

  //  describe('callbacks', () => {
  //    it('should callback if provided', (done) => {
  //      lmnAnalytics.identify('12345', {}, {}, done());
  //    });
  //    it('should callback if the options is omitted', (done) => {
  //      lmnAnalytics.identify('12345', {}, done());
  //    });

  //    it('should callback if options and traits are omitted', (done) => {
  //      lmnAnalytics.identify('12345', done());
  //    });
  //  });
  });

  //describe('ready function', () => {
  //  it('should callback', (done) => lmnAnalytics.ready(done()));
  //});

  describe('impression function', () => {
    //it('should call an impression dataLayer push', () => {

    //  lmnAnalytics.impression([{
    //    id: 'P12345',
    //    name: 'Product Name'
    //  }])
    //    .then(() => {
    //      expect(global.dataLayer.slice(-1)[0])
    //        .to.eql({
    //          ecommerce: {
    //            impressions: [{
    //              id: 'P12345',
    //              name: 'Product Name'
    //            }]
    //          }
    //        });
    //    });
    //});

    it('should call the analytics.impression with event metadata', () => {
      lmnAnalytics.impression([{
        id: 'P12345',
        name: 'Product Name'
      }]).catch(() => {
        expect.fail('To be present', 'NULL', 'Metadata missing on impression');
      }).then(() => {
        expect(global.dataLayer[0].clientUuid).to.not.be.null;
        expect(global.dataLayer[0].sentTimestamp).to.not.be.null;
        expect(global.dataLayer[0].gaCookieId).to.be.null;
      });
    });
  });
});

//describe('async dataLayer', () => {
//  beforeEach(() => {
//    setTimeout(() => global.dataLayer = [], 150);
//  });
//
//  describe('track', () => {
//    it('waits for dataLayer to be defined', () => {
//      lmnAnalytics.track('Custom Event')
//        .then(() => {
//          expect(global.dataLayer)
//            .to.not.equal(undefined);
//        });
//    });
//  });
//  describe('page', () => {
//    it('waits for dataLayer to be defined', () => {
//      lmnAnalytics.page('Custom Event')
//        .then(() => {
//          expect(global.dataLayer)
//            .to.not.equal(undefined);
//        });
//    });
//  });
//  describe('identify', () => {
//    it('waits for dataLayer to be defined', () => {
//      lmnAnalytics.identify('Custom Event')
//        .then(() => {
//          expect(global.dataLayer)
//            .to.not.equal(undefined);
//        });
//    });
//  });
//  describe('impression', () => {
//    it('waits for dataLayer to be defined', () => {
//      lmnAnalytics.impression({
//        name: 'Product Name'
//      })
//        .then(() => {
//          expect(global.dataLayer)
//            .to.not.equal(undefined);
//        });
//    });
//  });
//});
