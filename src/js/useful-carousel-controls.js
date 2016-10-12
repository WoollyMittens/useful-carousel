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
useful.Carousel.prototype.Controls = function(context) {

    // set the parser to strict mode
    
    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.addButtons = function () {
        var wrapper = this.model.wrapper;
        // build the previous button
        var prev = document.createElement('a');
            prev.setAttribute('class', 'carousel-prev');
            prev.setAttribute('href', '#');
            prev.addEventListener('click', this.onIncrement.bind(this, -1));
            prev.innerHTML = 'Previous';
            wrapper.appendChild(prev);
        // build the next button
        var next = document.createElement('a');
            next.setAttribute('class', 'carousel-next');
            next.setAttribute('href', '#');
            next.addEventListener('click', this.onIncrement.bind(this, 1));
            next.innerHTML = 'Next';
            wrapper.appendChild(next);
    };

    // events

    this.onIncrement = function (direction, evt) {
        // cancel any click
        if (evt) { evt.preventDefault(); }
        // refuse input if busy
        if (this.model.busy) { return false; }
        // wrap the index
        this.model.index += direction;
        this.model.index = (this.model.index < 0) ? this.model.slides.length - 1 : this.model.index;
        this.model.index = (this.model.index >= this.model.slides.length) ? 0 : this.model.index;
        // redraw the slides
        this.parent.redraw();
    };

    // execute

    this.addButtons();

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Controls;
}
