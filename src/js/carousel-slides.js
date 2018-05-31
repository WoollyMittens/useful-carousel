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
