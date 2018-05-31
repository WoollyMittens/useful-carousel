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
