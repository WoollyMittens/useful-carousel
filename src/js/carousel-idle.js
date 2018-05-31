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
