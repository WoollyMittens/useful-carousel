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
useful.Carousel.prototype.init = function(model) {

    "use strict";

	// verify input

	if (model.wrapper === null || model.slides.length === 0) return false;

    // model

    this.model = {
        'index': 0,
        'indicators': [],
        'modify': false,
        'delay': -1,
        'duration': 1000
    };

    for (name in model) {
        this.model[name] = model[name];
    }

    // views

    this.slides = new this.Slides(this);
    this.controls = new this.Controls(this);
    this.indicators = new this.Indicators(this);
    this.gestures = new this.Gestures(this);
    this.idle = new this.Idle(this);

    // controler

    this.redraw = function() {
        // update the slides
        this.slides.redraw();
        // update the idle timer
        this.idle.wait();
    };

    this.goto = function (index) {
        // jump directly to the given index
        this.indicators.onIndex(index);
    };

    this.increment = function (offset) {
        // increment the slider by the given amount
        this.controls.onIncrement(offset);
    };

    return this;

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.Carousel;
}
