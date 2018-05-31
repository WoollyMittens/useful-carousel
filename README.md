# carousel.js: Responsive Carousel

A slideshow and product slider that adapts to various screen sizes.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-carousel">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/carousel.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/carousel.js"></script>
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
