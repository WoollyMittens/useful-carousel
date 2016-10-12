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
useful.Carousel.prototype.Gestures = function(context) {

    // set the parser to strict mode
    
    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.addEvents = function () {
        // assign event handlers to all stages of touch
        this.model.wrapper.addEventListener('touchstart', this.onGesture.bind(this, 'start'));
        this.model.wrapper.addEventListener('touchmove', this.onGesture.bind(this, 'move'));
        this.model.wrapper.addEventListener('touchend', this.onGesture.bind(this, 'end'));
    };

    // events

    this.onGesture = function (phase, evt) {
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
                if (dx > 30) { evt.preventDefault(); this.parent.increment(-1); }
                if (dx < -30) { evt.preventDefault(); this.parent.increment(1); }
                break;
        }
    };

    // execute

    this.addEvents();

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Gestures;
}
