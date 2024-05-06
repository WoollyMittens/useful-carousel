# carousel.js: Responsive Carousel

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

A slideshow and product slider that adapts to various screen sizes.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/carousel.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="js/carousel.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'js/carousel.js'
], function(Carousel) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {Carousel} from "js/carousel.js";
```

## How to start the script

```javascript
var carousel = new Carousel({
	'wrapper': document.querySelector('.hero-slideshow'),
	'slides': document.querySelectorAll('.hero-slideshow figure'),
	'delay': 6000,
	'modify': true
});
```

**wrapper : {css rule}** - The wrapper for the scrolling items.

**slides : {css rule}** - The individual product items.

**delay : {integer}** - The time in milliseconds to wait before resuming the slideshow after an interaction.

**modify : {boolean}** - Turn the inline image in to the background of the parent item.

## How to control the script

### goto

```javascript
carousel.goto(index);
```

**index : {integer}** - The number of the slide to skip to directly.

### increment

```javascript
carousel.increment(offset);
```

**offset : {integer}** - Show the next (1) or previous (-1) slides.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
