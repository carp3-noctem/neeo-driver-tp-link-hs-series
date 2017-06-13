# tokensearch.js

<a href="https://nodei.co/npm/tokensearch.js/"><img src="https://nodei.co/npm/tokensearch.js.png?downloads=true"></a>

[![Dependency Status](https://gemnasium.com/neophob/tokensearch.js.svg)](https://gemnasium.com/neophob/tokensearch.js) [![Build Status](https://secure.travis-ci.org/neophob/tokensearch.js.png?branch=master)](http://travis-ci.org/neophob/tokensearch.js)

**tokensearch.js** is a simple substring search functions for collections. You can search for multiple search tokens in a json file, the result array contains the original object plus a search `score` (0: perfect, 1: forget it). See the example or unit tests for more details.

Inspired by https://github.com/krisk/Fuse, users.json file is ripped from this project.

## Options

```
Tokensearch.defaultOptions = {
  //split strings with those delimiters, default delimiters: space and dash
  delimiter: /[\s-]+/,

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKeys: [],

  //the result just contains unique results (based on collection keys)
  unique: false,

  // search all 'needles' in the 'haystack', return a score for each function call
  searchAlgorithm: function(haystack, needles) {
    var score = 0;
    var arrayLength = needles.length;
    for (var i = 0; i < arrayLength; i++) {
      var needle = needles[i];
      var stringPos = haystack.indexOf(needle);
      if (stringPos > -1) {
        if (haystack === needle) {
          score += 6;
        } else if (stringPos === 0) {
          score += 2;
        } else {
          score += 1;
        }
      }
    }
    return score;
  },

  //postprocess all elements (=contains all elements with a score)
  postprocessAlgorithm: function(collection, maxScore, threshold) {
    var normalizedScore = 1 / maxScore;
    var result = [];
    collection.forEach(function(e) {
      e.score = 1-e.score*normalizedScore;
      if (e.score <= threshold) {
        result.push(e);
      }
    });
    return result;
  },

  // sort the result array (=output of the postprocess step)
  sortAlgorithm: function(array) {
    return array.sort(function(a, b) {
    return a.score - b.score;
    });
  }};
```

You can pass one or multiple parameter when creating the object, for example

```
new Tokensearch(myCollection, { collectionKeys: ['key1', 'key2'], threshold: 0.5 });
```

## Examples

### Simple
Search for text tokens in one JSON field, use space as delimiter.

**Setup:**

```
var collection = [{
  "name": "JOHN PETER DOW",
  "id": "123"
}, {
  "name": "FOO BAR JOHN",
  "id": "127",
}, {
  "name": "BODE JON MULLER",
  "id": "147",
}];
var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'] });

```

**Search:**
```
var result = tokenSearch.search('JOHN BAR');
```

**Result:**
```
[
  {"item":{"name":"FOO BAR JOHN","id":"127}","score":0},
  {"item":{"name":"JOHN PETER DOW","id":"123"},"score":0.5}
]
```

### Advanced 1
Search for text tokens in two JSON fields, use space and : as delimiter.

**Setup:**

```
var collection = [{
  "name": "JOHN PETER DOW",
  "address": "a:funny:street:44",
  "id": "123"
}, {
  "name": "FOO BAR JON",
  "address": "bullvd:33",
  "id": "127",
}, {
  "name": "BODE JOHN MULLER",
  "address": "upside:street",
  "id": "147",
}];
var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name', 'address'], delimiter: /[\s:]+/, threshold: 0.5});

```

**Search:**
```
var result = tokenSearch.search('JOHN:street');
```

**Result:**
```
[
  {"item":{"name":"JOHN PETER DOW","address":"a:funny:street:44","id":"123"},"score":0},
  {"item":{"name":"BODE JOHN MULLER","address":"upside:street","id":"147"},"score":0}
]
```

### Advanced 2
Search for text tokens in two JSON fields, use space and : as delimiter, use a custom search algorithm.

**Setup:**

```
    var collection = [{
      "name": "JOHN DOE",
      "address": "a:funny:street:44",
      "id": "123"
    }, {
      "name": "FOO BAR JON",
      "address": "bullvd:33",
      "id": "127",
    }, {
      "name": "BODE MULLER",
      "address": "john:upside:street",
      "id": "147",
    }];

    var tokenSearch = function(haystack, needles) {
      var score = 0;
      var arrayLength = needles.length;
      for (var i = 0; i < arrayLength; i++) {
        var needle = needles[i];
        if (haystack === needle) {
          score ++;
        }
      }
      return score;
    };
    var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name', 'address'], delimiter: /[\s:]+/, threshold: 0.5, searchAlgorithm: tokenSearch});

```

**Search:**
```
var result = tokenSearch.search('JOHN');
```

**Result:**
```
[
  {"item":{"name":"JOHN DOE","address":"a:funny:street:44","id":"123"},"score":0},
  {"item":{"name":"BODE MULLER","address":"john:upside:street","id":"147"},"score":0}
]
```

## Build
- to run **tests**: `npm test`
- to run **jshint**: `npm run-script jshint`
- to **minify** code: `npm run-script minify`
- to create a new **release**: `npm run-script release`
- to check code **coverage**: `npm run-script coverage`
