/*
	Source:
	van Creij, Maurice (2018). "carousel.js: Responsive Products Slider", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Carousel = function(model) {

	function slidesPerWrapper() {
		var slideWidth = model.slides[0].offsetWidth || 200;
		var wrapperWidth = model.wrapper.offsetWidth || document.body.offsetWidth;
		return Math.round(wrapperWidth / slideWidth);
	};

	// PROPERTIES

	this.model = {
		'indicators': [],
		'modify': false,
		'delay': -1,
		'duration': 500
	};
  this.model.steps = slidesPerWrapper();
  this.model.index = this.model.steps + 1;

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
		var index = this.model.index;
		var wrapper = this.model.wrapper;
		var slides = this.model.slides;
		var steps = this.model.steps;
    // update the dimensions
    steps = slidesPerWrapper();
    wrapper.setAttribute('data-carousel', (slides.length > steps) ? 'active' : 'static');
    wrapper.style.minHeight = (slides[index]) ? slides[index].offsetHeight + 'px' : 'auto';
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

	this.onResize = function() {
    var _this = this;
    // wait for resizing to end, before redrawing
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.redraw.bind(this), 100);
  };

  window.addEventListener('resize', this.onResize.bind(this));
  var observer = new MutationObserver(this.onResize.bind(this));
  observer.observe(this.model.wrapper, { attributes: true, attributeFilter: ['class', 'style'], childList: false, subtree: false });

  this.redraw();

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Carousel });
if (typeof module != 'undefined') module.exports = Carousel;
