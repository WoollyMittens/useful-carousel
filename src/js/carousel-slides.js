// extend the constructor
Carousel.prototype.Slides = function(context) {

  // properties

  this.parent = context;
  this.model = context.model;

  // methods

  this.double = function() {
    var slides = this.model.slides;
    var steps = this.model.steps;
    var clone;
    var originals = [];
    var clones = [];
    // if there are not enough slides
    if (slides.length > steps && slides.length < steps * 3) {
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
    if (!this.model.modify) return false;
    // for all slides
    for (var a = 0, b = slides.length; a < b; a += 1) {
      // transfer the image to the background
      img = slides[a].querySelector('img');
      slides[a].style.backgroundImage = "url('" + img.getAttribute('src') + "')";
      img.parentNode.removeChild(img);
    }
  };

  this.redraw = function() {
    this.double();
    var offset;
    var idx = this.model.index;
    var max = this.model.slides.length;
    var prefix = this.model.prefix;
    var wrapper = this.model.wrapper;
    var slides = this.model.slides;
    var indicators = this.model.indicators;
    // apply the sequential class names to the slides
    for (var a = 0, b = slides.length; a < b; a += 1) {
      // calculate the offset
      offset = (idx + a) % max;
      // apply the class name
      slides[a].className = slides[a].className.replace(/ carousel-\d*/g, '') + ' carousel-' + offset;
      // update the corresponding pager pip
      if (indicators[a]) indicators[a].className = (idx === a) ? 'carousel-active' : 'carousel-passive';
    }
  };

  // execute

  this.modify();
  this.double();

};
