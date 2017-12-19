[![Travis](https://img.shields.io/travis/nabble/unveil2.svg)](https://travis-ci.org/nabble/unveil2)
[![Code Climate](https://img.shields.io/codeclimate/github/nabble/unveil2.svg)](https://codeclimate.com/github/nabble/unveil2)
[![npm](https://img.shields.io/npm/v/unveil2.svg)](https://www.npmjs.com/package/unveil2)
[![Bower](https://img.shields.io/bower/v/unveil2.svg)](http://bower.io/search/?q=unveil2)
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/unveil2/badge)](https://www.jsdelivr.com/package/npm/unveil2)
[![cdnjs](https://img.shields.io/cdnjs/v/unveil2.svg)](https://cdnjs.com/libraries/unveil2)

# unveil2.js

> __A very lightweight plugin to lazy load images for jQuery__  
> Based on [luis-almeida/unveil](https://github.com/luis-almeida/unveil).

## Getting started

Install unveil2.js by downloading a copy of [`jquery.unveil2.min.js`](https://raw.githubusercontent.com/nabble/unveil2/develop/dist/jquery.unveil2.min.js) and add it to your page after [jQuery](http://jquery.com):

```html
<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="jquery.unveil2.min.js"></script>
```

And call the unveil plugin on the images you want to be lazily loaded:

```js
$('img').unveil();
```

__Note:__ If you load scripts at the bottom of the page, [you don't have to wait for `$.ready`](http://stackoverflow.com/a/9558601/938297).

[That's all folks](https://www.youtube.com/watch?v=gBzJGckMYO4)!

## More examples

CSS background, retina images, breakpoints and more: [see online examples](http://nabble.github.io/unveil2/).

## More configuration options

For a complete list of options, see [API section](http://nabble.github.io/unveil2/docs/api.html).

## Cross-browser tests

[![Sauce Labs](https://saucelabs.com/browser-matrix/joram.svg)](https://saucelabs.com/u/joram)

## License

[MIT](http://opensource.org/licenses/MIT)
