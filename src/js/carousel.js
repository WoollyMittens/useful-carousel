/*
	Source:
	van Creij, Maurice (2018). "carousel.js: Responsive Products Slider", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Carousel = function(model) {

	// PROPERTIES

	this.model = {
		'index': 0,
		'indicators': [],
		'modify': false,
		'delay': -1,
		'duration': 1000
	};

	for (key in model) {
		this.model[key] = model[key];
	}

	// CLASSES

	this.slides = new this.Slides(this);
	this.controls = new this.Controls(this);
	this.indicators = new this.Indicators(this);
	this.gestures = new this.Gestures(this);
	this.idle = new this.Idle(this);

	// METHODS

	this.redraw = function() {
		// update the slides
		this.slides.redraw();
		// update the idle timer
		this.idle.wait();
	};

	this.goto = function(index) {
		// jump directly to the given index
		this.indicators.onIndex(index);
	};

	this.increment = function(offset) {
		// increment the slider by the given amount
		this.controls.onIncrement(offset);
	};

	// EVENTS

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Carousel });
if (typeof module != 'undefined') module.exports = Carousel;
