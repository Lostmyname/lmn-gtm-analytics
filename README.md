# lmn-gtm-analytics

[![Travis build status](http://img.shields.io/travis/Lostmyname/lmn-gtm-analytics.svg?style=flat)](https://travis-ci.org/Lostmyname/lmn-gtm-analytics)
[![Code Climate](https://codeclimate.com/github/Lostmyname/lmn-gtm-analytics/badges/gpa.svg)](https://codeclimate.com/github/Lostmyname/lmn-gtm-analytics)
[![Test Coverage](https://codeclimate.com/github/Lostmyname/lmn-gtm-analytics/badges/coverage.svg)](https://codeclimate.com/github/Lostmyname/lmn-gtm-analytics)


GTM/Segment Integration for Lost My Name

## Installation

```shell
npm install lmn-gtm-analytics
```

and then in your JS files

```javascript
import analytics from 'lmn-gtm-analytics';

analytics.track('Custom Event', {
  category: 'Category',
  label: 'Label'
});
```

## Tests

Run the tests with

```shell
npm run coverage
```
