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
useful.Carousel.prototype.Idle = function(context) {

    // set the parser to strict mode
    
    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.wait = function() {
        // stop processing input while the component is busy
        clearTimeout(this.model.automatic);
        clearTimeout(this.model.busy);
        this.model.busy = setTimeout(
            this.onBusy.bind(this),
            this.model.duration
        );
    };

    this.perform = function () {
        // what to do after each idle timeout
        this.parent.increment(1);
    };

    // events

    this.onBusy = function () {
        // cancel busy mode
        this.model.busy = null;
        // order the next cycle
        if (this.model.delay > 0) {
            this.model.automatic = setTimeout(
                this.perform.bind(this),
                this.model.delay
            );
        }
    };

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Idle;
}
