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
if (typeof define != 'undefined') define(['carousel'], function () { return Carousel });
if (typeof module != 'undefined') module.exports = Carousel;

// extend the constructor
Carousel.prototype.Controls = function(context) {

	// properties

	this.parent = context;
	this.model = context.model;

	// methods

	this.addButtons = function() {
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

	this.onIncrement = function(direction, evt) {
		// cancel any click
		if (evt) {
			evt.preventDefault();
		}
		// refuse input if busy
		if (this.model.busy) {
			return false;
		}
		// wrap the index
		this.model.index += direction;
		this.model.index = (this.model.index < 0)
			? this.model.slides.length - 1
			: this.model.index;
		this.model.index = (this.model.index >= this.model.slides.length)
			? 0
			: this.model.index;
		// redraw the slides
		this.parent.redraw();
	};

	// execute

	this.addButtons();

};

// extend the constructor
Carousel.prototype.Gestures = function(context) {

	// properties

	this.parent = context;
	this.model = context.model;

	// methods

	this.addEvents = function() {
		// assign event handlers to all stages of touch
		this.model.wrapper.addEventListener('touchstart', this.onGesture.bind(this, 'start'));
		this.model.wrapper.addEventListener('touchmove', this.onGesture.bind(this, 'move'));
		this.model.wrapper.addEventListener('touchend', this.onGesture.bind(this, 'end'));
	};

	// events

	this.onGesture = function(phase, evt) {
		// for the given phase of the gesture
		switch (phase) {
				// note the start point of the gesture
			case 'start':
				this.x0 = this.x1 = evt.touches[0].pageX;
				break;
				// keep track of the distance
			case 'move':
				this.x1 = evt.touches[0].pageX;
				break;
				// react to the distance traveled
			case 'end':
				var dx = this.x1 - this.x0;
				if (dx > 30) {
					evt.preventDefault();
					this.parent.increment(-1);
				}
				if (dx < -30) {
					evt.preventDefault();
					this.parent.increment(1);
				}
				break;
		}
	};

	// execute

	this.addEvents();

};

// extend the constructor
Carousel.prototype.Idle = function(context) {

	// properties

	this.parent = context;
	this.model = context.model;

	// methods

	this.wait = function() {
		// stop processing input while the component is busy
		clearTimeout(this.model.automatic);
		clearTimeout(this.model.busy);
		this.model.busy = setTimeout(this.onBusy.bind(this), this.model.duration);
	};

	this.perform = function() {
		// what to do after each idle timeout
		this.parent.increment(1);
	};

	// events

	this.onBusy = function() {
		// cancel busy mode
		this.model.busy = null;
		// order the next cycle
		if (this.model.delay > 0) {
			this.model.automatic = setTimeout(this.perform.bind(this), this.model.delay);
		}
	};

};

// extend the constructor
Carousel.prototype.Indicators = function(context) {

	// properties

	this.parent = context;
	this.model = context.model;

	// methods

	this.addPips = function(nav) {
		var wrapper = this.model.wrapper,
			slides = this.model.slides,
			indicators = this.model.indicators;
		// build the pager
		var nav = document.createElement('nav');
		nav.className = 'carousel-indicators';
		// for each slide
		for (var a = 0, b = slides.length; a < b; a += 1) {
			// add a pager element
			indicators[a] = document.createElement('a');
			indicators[a].setAttribute('class', 'carousel-passive');
			indicators[a].setAttribute('href', '#');
			indicators[a].addEventListener('click', this.onIndex.bind(this, a));
			indicators[a].innerHTML = a + 1;
			nav.appendChild(indicators[a]);
		}
		// insert the pager into the carousel
		wrapper.appendChild(nav);
	};

	// events

	this.onIndex = function(index, evt) {
		// cancel any click
		if (evt) {
			evt.preventDefault();
		}
		// refuse input if busy
		if (this.model.busy) {
			return false;
		}
		// apply the index
		this.model.index = index;
		// redraw the slides
		this.parent.redraw();
	};

	// execute

	this.addPips();

};

// extend the constructor
Carousel.prototype.Slides = function(context) {

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
// TODO: needs to be updated via parent object instead
            if (indicators[a]) { indicators[a].className = (idx === a) ? 'carousel-active' : 'carousel-passive'; }
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
    this.double();
    this.double();
    this.modify();
    this.redraw();
    this.resize();

};
