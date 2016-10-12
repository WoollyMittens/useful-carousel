/*
    start-up
*/

document.addEventListener("DOMContentLoaded", function(event) {

    "use strict";

    /*
        Add Engraving
    */

    var AddEngraving = function (cfg) {
        // properties
        this.cfg = {};
        for (name in cfg) { this.cfg[name] = cfg[name] }
        // methods
        this.init = function () {
            var banner;
            // if the element exist
            if (this.cfg.element) {
                // insert the banner template
                banner = document.createElement('div');
                banner.innerHTML = this.cfg.template;
                banner.querySelector('a').addEventListener('click', this.onClicked.bind(this));
                this.cfg.element.parentNode.insertBefore(banner, this.cfg.element);
                // apply classname to target
                this.cfg.element.className += ' product-options-closed';
            }
            // pass through the object
            return this;
        }
        // events
        this.onClicked = function (evt) {
            var isClosed = / product-options-closed/g,
                isOpen = / product-options-open/g,
                className = this.cfg.element.className;
            // cancel the click
            evt.preventDefault();
            // toggle the class name
            this.cfg.element.className = (isClosed.test(className)) ?
                className.replace(isClosed, ' product-options-open'):
                className.replace(isOpen, ' product-options-closed');
        };
    };

    var addEngraving = new AddEngraving({
        'template': '<figure class="add-engraving"><figcaption><h3>Engraving available on this product</h3><p>(Purchase 1 bottle at a time)</p><a href="#" class="btn">+ Add engraving</a></figcaption></figure>',
        'element': document.querySelector('.product-shop-aside .product-options')
    }).init();

    /*
        Transplant Category Title
    */

    var Transplant = function (cfg) {
        // properties
        this.cfg = {};
        for (name in cfg) { this.cfg[name] = cfg[name] }
        // methods
        this.init = function () {
            // if both elements exist
            if (this.cfg.source && this.cfg.destination) {
                // transplant the content
                this.cfg.destination.innerHTML = this.cfg.source.innerHTML;
            }
            // pass through the object
            return this;
        }
    };

    var transplantCategoryTitle = new Transplant({
        'source': document.querySelector('div.col-main > div.category-title > h1'),
        'destination': document.querySelector('div.col-left-first > div > div.block-title > strong > span')
    }).init();

    /*
        Carousel
    */

    var Carousel = function (cfg) {
        // properties
        this.cfg = { 'index': 0, 'pagers': [], 'modify': false, 'delay': -1, 'duration': 1000 };
        for (name in cfg) { this.cfg[name] = cfg[name] }
        // methods
        this.init = function () {
            // if the elements exist
            if (this.cfg.wrapper && this.cfg.slides) {
                // double the amount of slides
                this.double();
                // modify the figures
                this.modify();
                // construct the controls
                this.controls();
                // construct the pips
                this.pager();
                // apply the touch events
                this.gestures();
                // initial redraw
                this.redraw();
                // resize the component if the window changes
                window.addEventListener('resize', this.onResize.bind(this));
            }
            // pass through the object
            return this;
        };
        this.double = function () {
            var slides = this.cfg.slides, clone, originals = [], clones = [];
            // if there are not enough slides
            if (slides.length < 6) {
                // double the amount of slides
                for (var a = 0, b = slides.length; a < b; a += 1) {
                    originals[a] = slides[a];
                    clones[a] = slides[a].cloneNode(true);
                    slides[a].parentNode.appendChild(clones[a]);
                }
                // re-index the slides
                this.cfg.slides = originals.concat(clones);
            }
        };
        this.modify = function () {
            var img, slides = this.cfg.slides;
            // give up if not wanted
            if (!this.cfg.modify) { return false; }
            // for all slides
            for (var a = 0, b = slides.length; a < b; a += 1) {
                // transfer the image to the background
                img = slides[a].querySelector('img');
                slides[a].style.backgroundImage = "url('" + img.getAttribute('src') + "')";
                img.parentNode.removeChild(img);
            }
        };
        this.controls = function () {
            var wrapper = this.cfg.wrapper;
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
        this.pager = function (nav) {
            var wrapper = this.cfg.wrapper,
                slides = this.cfg.slides,
                pagers = this.cfg.pagers;
            // build the pager
                var nav = document.createElement('nav');
                nav.className = 'carousel-pager';
            // for each slide
            for (var a = 0, b = slides.length; a < b; a += 1) {
                // add a pager element
                pagers[a] = document.createElement('a');
                pagers[a].setAttribute('class', 'carousel-passive');
                pagers[a].setAttribute('href', '#');
                pagers[a].addEventListener('click', this.onIndex.bind(this, a));
                pagers[a].innerHTML = a + 1;
                nav.appendChild(pagers[a]);
            }
            // insert the pager into the carousel
            wrapper.appendChild(nav);
        };
        this.gestures = function () {
            // assign event handlers to all stages of touch
            this.cfg.wrapper.addEventListener('touchstart', this.onGesture.bind(this, 'start'));
            this.cfg.wrapper.addEventListener('touchmove', this.onGesture.bind(this, 'move'));
            this.cfg.wrapper.addEventListener('touchend', this.onGesture.bind(this, 'end'));
        };
        this.redraw = function () {
            var offset,
                idx = this.cfg.index,
                max = this.cfg.slides.length,
                prefix = this.cfg.prefix,
                slides = this.cfg.slides,
                pagers = this.cfg.pagers;
            // adjust the height of the carousel
            this.onResize(this.cfg.index);
            // apply the sequential class names to the slides
            for (var a = 0, b = slides.length; a < b; a += 1) {
                // calculate the offset
                offset = (idx + a) % max;
                // apply the class name
                slides[a].className = slides[a].className.replace(/ carousel-\d*/g, '') + ' carousel-' + offset;
                // update the corresponding pager pip
                pagers[a].className = (idx === a) ? 'carousel-active' : 'carousel-passive';
            }
            // stop processing input while the component is busy
            clearTimeout(this.cfg.automatic);
            clearTimeout(this.cfg.busy);
            this.cfg.busy = setTimeout(this.onBusy.bind(this), this.cfg.duration);
        };
        // events
        this.onResize = function () {
            var wrapper = this.cfg.wrapper,
                slides = this.cfg.slides,
                index = this.cfg.index;
            // make the container as tall as the active slide
            wrapper.style.height = (slides[index]) ? slides[index].offsetHeight + 'px' : 'auto';
        };
        this.onBusy = function () {
            // cancel busy mode
            this.cfg.busy = null;
            // order the next cycle
            if (this.cfg.delay > 0) {
                this.cfg.automatic = setTimeout(this.onIncrement.bind(this, 1), this.cfg.delay);
            }
        };
        this.onIndex = function (index, evt) {
            // cancel any click
            if (evt) { evt.preventDefault(); }
            // refuse input if busy
            if (this.cfg.busy) { return false; }
            // apply the index
            this.cfg.index = index;
            // redraw the slides
            this.redraw();
        };
        this.onIncrement = function (direction, evt) {
            // cancel any click
            if (evt) { evt.preventDefault(); }
            // refuse input if busy
            if (this.cfg.busy) { return false; }
            // wrap the index
            this.cfg.index += direction;
            this.cfg.index = (this.cfg.index < 0) ? this.cfg.slides.length - 1 : this.cfg.index;
            this.cfg.index = (this.cfg.index >= this.cfg.slides.length) ? 0 : this.cfg.index;
            // redraw the slides
            this.redraw();
        };
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
                    if (dx > 30) { evt.preventDefault(); this.onIncrement(-1); }
                    if (dx < -30) { evt.preventDefault(); this.onIncrement(1); }
                    break;
            }
        };
    };

    var homepageHero = new Carousel({
        'wrapper': document.querySelector('.wq-hero'),
        'slides': document.querySelectorAll('.wq-hero figure'),
        'delay': 6000,
        'modify': true
    }).init();

    var homepageExplore = new Carousel({
        'wrapper': document.querySelector('.wq-explore'),
        'slides': document.querySelectorAll('.wq-explore figure')
    }).init();

    var homepageProducts = new Carousel({
        'wrapper': document.querySelector('.wq-products'),
        'slides': document.querySelectorAll('.wq-products > ul > li')
    }).init();

    var upsellProducts = new Carousel({
        'wrapper': document.querySelector('.box-up-sell'),
        'slides': document.querySelectorAll('.box-up-sell > ul > li')
    }).init();

});
