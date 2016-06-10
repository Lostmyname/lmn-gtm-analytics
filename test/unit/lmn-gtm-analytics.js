import analytics from '../../src/lmn-gtm-analytics';

describe('analytics', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(analytics, 'greet');
      analytics.greet();
    });

    it('should have been run once', () => {
      expect(analytics.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(analytics.greet).to.have.always.returned('hello');
    });
  });
});
