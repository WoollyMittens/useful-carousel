/*
	Source:
	van Creij, Maurice (2016). "useful.carousel.js: Responsive Products Slider", version 20161012, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish a place to keep our code out of everyone's way
var useful = useful || {};

// establish the constructor if it doesn't already exist
useful.Carousel = useful.Carousel || function() {};

// extend the constructor
useful.Carousel.prototype.Slides = function(context) {

    // set the parser to strict mode

    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.double = function () {
        var slides = this.model.slides, clone, originals = [], clones = [];
        // if there are not enough slides
        if (slides.length < 6) {
            // double the amount of slides
            for (var a = 0, b = slides.length; a < b; a += 1) {
                originals[a] = slides[a];
                clones[a] = slides[a].cloneNode(true);
                slides[a].parentNode.appendChild(clones[a]);
            }
            // re-index the slides
            this.model.slides = originals.concat(clones);
        }
    };

    this.modify = function () {
        var img, slides = this.model.slides;
        // give up if not wanted
        if (!this.model.modify) { return false; }
        // for all slides
        for (var a = 0, b = slides.length; a < b; a += 1) {
            // transfer the image to the background
            img = slides[a].querySelector('img');
            slides[a].style.backgroundImage = "url('" + img.getAttribute('src') + "')";
            img.parentNode.removeChild(img);
        }
    };

    this.redraw = function () {
        var offset,
            idx = this.model.index,
            max = this.model.slides.length,
            prefix = this.model.prefix,
            slides = this.model.slides,
            indicators = this.model.indicators;
        // adjust the height of the carousel
        this.onResize(this.model.index);
        // apply the sequential class names to the slides
        for (var a = 0, b = slides.length; a < b; a += 1) {
            // calculate the offset
            offset = (idx + a) % max;
            // apply the class name
            slides[a].className = slides[a].className.replace(/ carousel-\d*/g, '') + ' carousel-' + offset;
            // update the corresponding pager pip
            indicators[a].className = (idx === a) ? 'carousel-active' : 'carousel-passive';
        }
    };

    this.resize = function () {
        // what to do when the browser is resized
        window.addEventListener('resize', this.onResize.bind(this));
    };

    // events

    this.onResize = function () {
        var wrapper = this.model.wrapper,
            slides = this.model.slides,
            index = this.model.index;
        // make the container as tall as the active slide
        wrapper.style.height = (slides[index]) ? slides[index].offsetHeight + 'px' : 'auto';
    };

    // execute

    this.double();
    this.modify();
    this.redraw();
    this.resize();

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Slides;
}
