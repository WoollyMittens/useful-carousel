/*
	Source:
	van Creij, Maurice (2014). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// public object
var useful = useful || {};

(function() {

  // Invoke strict mode
  "use strict";

  // Create a private object for this library
  useful.polyfills = {

    // enabled the use of HTML5 elements in Internet Explorer
    html5: function() {
      var a, b, elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
      if (navigator.userAgent.match(/msie/gi)) {
        for (a = 0, b = elementsList.length; a < b; a += 1) {
          document.createElement(elementsList[a]);
        }
      }
    },

    // allow array.indexOf in older browsers
    arrayIndexOf: function() {
      if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
          for (var i = (start || 0), j = this.length; i < j; i += 1) {
            if (this[i] === obj) {
              return i;
            }
          }
          return -1;
        };
      }
    },

    // allow array.isArray in older browsers
    arrayIsArray: function() {
      if (!Array.isArray) {
        Array.isArray = function(arg) {
          return Object.prototype.toString.call(arg) === '[object Array]';
        };
      }
    },

    // allow array.map in older browsers (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
    arrayMap: function() {

      // Production steps of ECMA-262, Edition 5, 15.4.4.19
      // Reference: http://es5.github.io/#x15.4.4.19
      if (!Array.prototype.map) {

        Array.prototype.map = function(callback, thisArg) {

          var T, A, k;

          if (this == null) {
            throw new TypeError(' this is null or not defined');
          }

          // 1. Let O be the result of calling ToObject passing the |this|
          //    value as the argument.
          var O = Object(this);

          // 2. Let lenValue be the result of calling the Get internal
          //    method of O with the argument "length".
          // 3. Let len be ToUint32(lenValue).
          var len = O.length >>> 0;

          // 4. If IsCallable(callback) is false, throw a TypeError exception.
          // See: http://es5.github.com/#x9.11
          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }

          // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 1) {
            T = thisArg;
          }

          // 6. Let A be a new array created as if by the expression new Array(len)
          //    where Array is the standard built-in constructor with that name and
          //    len is the value of len.
          A = new Array(len);

          // 7. Let k be 0
          k = 0;

          // 8. Repeat, while k < len
          while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

              // i. Let kValue be the result of calling the Get internal
              //    method of O with argument Pk.
              kValue = O[k];

              // ii. Let mappedValue be the result of calling the Call internal
              //     method of callback with T as the this value and argument
              //     list containing kValue, k, and O.
              mappedValue = callback.call(T, kValue, k, O);

              // iii. Call the DefineOwnProperty internal method of A with arguments
              // Pk, Property Descriptor
              // { Value: mappedValue,
              //   Writable: true,
              //   Enumerable: true,
              //   Configurable: true },
              // and false.

              // In browsers that support Object.defineProperty, use the following:
              // Object.defineProperty(A, k, {
              //   value: mappedValue,
              //   writable: true,
              //   enumerable: true,
              //   configurable: true
              // });

              // For best browser support, use the following:
              A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
          }

          // 9. return A
          return A;
        };
      }

    },

    // allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
    querySelectorAll: function() {
      if (!document.querySelectorAll) {
        document.querySelectorAll = function(a) {
          var b = document,
            c = b.documentElement.firstChild,
            d = b.createElement("STYLE");
          return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
        };
      }
    },

    // allow addEventListener (https://gist.github.com/jonathantneal/3748027)
    addEventListener: function() {
      !window.addEventListener && (function(WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
        WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function(type, listener) {
          var target = this;
          registry.unshift([target, type, listener, function(event) {
            event.currentTarget = target;
            event.preventDefault = function() {
              event.returnValue = false;
            };
            event.stopPropagation = function() {
              event.cancelBubble = true;
            };
            event.target = event.srcElement || target;
            listener.call(target, event);
          }]);
          this.attachEvent("on" + type, registry[0][3]);
        };
        WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function(type, listener) {
          for (var index = 0, register; register = registry[index]; ++index) {
            if (register[0] == this && register[1] == type && register[2] == listener) {
              return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
          }
        };
        WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function(eventObject) {
          return this.fireEvent("on" + eventObject.type, eventObject);
        };
      })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
    },

    // allow console.log
    consoleLog: function() {
      var overrideTest = new RegExp('console-log', 'i');
      if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
        window.console = {};
        window.console.log = function() {
          // if the reporting panel doesn't exist
          var a, b, messages = '',
            reportPanel = document.getElementById('reportPanel');
          if (!reportPanel) {
            // create the panel
            reportPanel = document.createElement('DIV');
            reportPanel.id = 'reportPanel';
            reportPanel.style.background = '#fff none';
            reportPanel.style.border = 'solid 1px #000';
            reportPanel.style.color = '#000';
            reportPanel.style.fontSize = '12px';
            reportPanel.style.padding = '10px';
            reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
            reportPanel.style.right = '10px';
            reportPanel.style.bottom = '10px';
            reportPanel.style.width = '180px';
            reportPanel.style.height = '320px';
            reportPanel.style.overflow = 'auto';
            reportPanel.style.zIndex = '100000';
            reportPanel.innerHTML = '&nbsp;';
            // store a copy of this node in the move buffer
            document.body.appendChild(reportPanel);
          }
          // truncate the queue
          var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
          // process the arguments
          for (a = 0, b = arguments.length; a < b; a += 1) {
            messages += arguments[a] + '<br/>';
          }
          // add a break after the message
          messages += '<hr/>';
          // output the queue to the panel
          reportPanel.innerHTML = messages + reportString;
        };
      }
    },

    // allows Object.create (https://gist.github.com/rxgx/1597825)
    objectCreate: function() {
      if (typeof Object.create !== "function") {
        Object.create = function(original) {
          function Clone() {}
          Clone.prototype = original;
          return new Clone();
        };
      }
    },

    // allows String.trim (https://gist.github.com/eliperelman/1035982)
    stringTrim: function() {
      if (!String.prototype.trim) {
        String.prototype.trim = function() {
          return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
        };
      }
      if (!String.prototype.ltrim) {
        String.prototype.ltrim = function() {
          return this.replace(/^\s+/, '');
        };
      }
      if (!String.prototype.rtrim) {
        String.prototype.rtrim = function() {
          return this.replace(/\s+$/, '');
        };
      }
      if (!String.prototype.fulltrim) {
        String.prototype.fulltrim = function() {
          return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
        };
      }
    },

    // allows localStorage support
    localStorage: function() {
      if (!window.localStorage) {
        if (/MSIE 8|MSIE 7|MSIE 6/i.test(navigator.userAgent)) {
          window.localStorage = {
            getItem: function(sKey) {
              if (!sKey || !this.hasOwnProperty(sKey)) {
                return null;
              }
              return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
            },
            key: function(nKeyId) {
              return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
            },
            setItem: function(sKey, sValue) {
              if (!sKey) {
                return;
              }
              document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
              this.length = document.cookie.match(/\=/g).length;
            },
            length: 0,
            removeItem: function(sKey) {
              if (!sKey || !this.hasOwnProperty(sKey)) {
                return;
              }
              document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              this.length--;
            },
            hasOwnProperty: function(sKey) {
              return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            }
          };
          window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
        } else {
          Object.defineProperty(window, "localStorage", new(function() {
            var aKeys = [],
              oStorage = {};
            Object.defineProperty(oStorage, "getItem", {
              value: function(sKey) {
                return sKey ? this[sKey] : null;
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "key", {
              value: function(nKeyId) {
                return aKeys[nKeyId];
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "setItem", {
              value: function(sKey, sValue) {
                if (!sKey) {
                  return;
                }
                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "length", {
              get: function() {
                return aKeys.length;
              },
              configurable: false,
              enumerable: false
            });
            Object.defineProperty(oStorage, "removeItem", {
              value: function(sKey) {
                if (!sKey) {
                  return;
                }
                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
              },
              writable: false,
              configurable: false,
              enumerable: false
            });
            this.get = function() {
              var iThisIndx;
              for (var sKey in oStorage) {
                iThisIndx = aKeys.indexOf(sKey);
                if (iThisIndx === -1) {
                  oStorage.setItem(sKey, oStorage[sKey]);
                } else {
                  aKeys.splice(iThisIndx, 1);
                }
                delete oStorage[sKey];
              }
              for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) {
                oStorage.removeItem(aKeys[0]);
              }
              for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
                aCouple = aCouples[nIdx].split(/\s*=\s*/);
                if (aCouple.length > 1) {
                  oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
                  aKeys.push(iKey);
                }
              }
              return oStorage;
            };
            this.configurable = false;
            this.enumerable = true;
          })());
        }
      }
    },

    // allows bind support
    functionBind: function() {
      // Credit to Douglas Crockford for this bind method
      if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
          if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
              return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
          fNOP.prototype = this.prototype;
          fBound.prototype = new fNOP();
          return fBound;
        };
      }
    }

  };

  // startup
  useful.polyfills.html5();
  useful.polyfills.arrayIndexOf();
  useful.polyfills.arrayIsArray();
  useful.polyfills.arrayMap();
  useful.polyfills.querySelectorAll();
  useful.polyfills.addEventListener();
  useful.polyfills.consoleLog();
  useful.polyfills.objectCreate();
  useful.polyfills.stringTrim();
  useful.polyfills.localStorage();
  useful.polyfills.functionBind();

  // return as a require.js module
  if (typeof module !== 'undefined') {
    exports = module.exports = useful.polyfills;
  }

})();

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
useful.Carousel.prototype.Controls = function(context) {

    // set the parser to strict mode
    
    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.addButtons = function () {
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

    this.onIncrement = function (direction, evt) {
        // cancel any click
        if (evt) { evt.preventDefault(); }
        // refuse input if busy
        if (this.model.busy) { return false; }
        // wrap the index
        this.model.index += direction;
        this.model.index = (this.model.index < 0) ? this.model.slides.length - 1 : this.model.index;
        this.model.index = (this.model.index >= this.model.slides.length) ? 0 : this.model.index;
        // redraw the slides
        this.parent.redraw();
    };

    // execute

    this.addButtons();

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Controls;
}

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
useful.Carousel.prototype.Indicators = function(context) {

    // set the parser to strict mode
    
    "use strict";

    // properties

    this.parent = context;
    this.model = context.model;

    // methods

    this.addPips = function (nav) {
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

    this.onIndex = function (index, evt) {
        // cancel any click
        if (evt) { evt.preventDefault(); }
        // refuse input if busy
        if (this.model.busy) { return false; }
        // apply the index
        this.model.index = index;
        // redraw the slides
        this.parent.redraw();
    };

    // execute

    this.addPips();

};

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Indicators;
}

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
useful.Carousel.prototype.Slides = function(context) {

    // set the parser to strict mode

    "use strict";

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

// return as a require.js module
if (typeof module !== 'undefined') {
  exports = module.exports = useful.Carousel.Slides;
}

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
useful.Carousel.prototype.init = function(model) {

    "use strict";

	// verify input

	if (model.wrapper === null || model.slides.length === 0) return false;

    // model

    this.model = {
        'index': 0,
        'indicators': [],
        'modify': false,
        'delay': -1,
        'duration': 1000
    };

    for (name in model) {
        this.model[name] = model[name];
    }

    // views

    this.slides = new this.Slides(this);
    this.controls = new this.Controls(this);
    this.indicators = new this.Indicators(this);
    this.gestures = new this.Gestures(this);
    this.idle = new this.Idle(this);

    // controler

    this.redraw = function() {
        // update the slides
        this.slides.redraw();
        // update the idle timer
        this.idle.wait();
    };

    this.goto = function (index) {
        // jump directly to the given index
        this.indicators.onIndex(index);
    };

    this.increment = function (offset) {
        // increment the slider by the given amount
        this.controls.onIncrement(offset);
    };

    return this;

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.Carousel;
}
