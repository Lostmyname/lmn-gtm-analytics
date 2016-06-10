# lmn-gtm-analytics

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
