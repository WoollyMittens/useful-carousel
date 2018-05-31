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
