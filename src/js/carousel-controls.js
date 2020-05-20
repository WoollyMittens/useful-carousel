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
		prev.addEventListener('click', this.onIncrement.bind(this, 1));
		prev.innerHTML = 'Previous';
		wrapper.appendChild(prev);
		// build the next button
		var next = document.createElement('a');
		next.setAttribute('class', 'carousel-next');
		next.setAttribute('href', '#');
		next.addEventListener('click', this.onIncrement.bind(this, -1));
		next.innerHTML = 'Next';
		wrapper.appendChild(next);
	};

	// events

	this.onIncrement = function(direction, evt) {
		// cancel any click
		if (evt) evt.preventDefault();
		// refuse input if busy
		if (this.model.busy) return false;
    // update the increment
    this.model.steps = Math.round(this.model.wrapper.offsetWidth / this.model.slides[0].offsetWidth);
		// wrap the index
		this.model.index += direction * this.model.steps;
		this.model.index = (this.model.index < 0) ? this.model.index + this.model.slides.length : this.model.index;
		this.model.index = (this.model.index >= this.model.slides.length) ? this.model.index - this.model.slides.length : this.model.index;
		// redraw the slides
		this.parent.redraw();
	};

	// execute

	this.addButtons();

};
