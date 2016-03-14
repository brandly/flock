(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: 'distanceFrom',
    value: function distanceFrom(point) {
      var abs = Math.abs;
      var sqrt = Math.sqrt;

      var deltaX = abs(this.x - point.x);
      var deltaY = abs(this.y - point.y);
      return sqrt(deltaX * deltaX + deltaY * deltaY);
    }
  }, {
    key: 'difference',
    value: function difference(point) {
      return new Point(point.x - this.x, point.y - this.y);
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      var length = this.length() || 0.000001;
      return new Point(this.x / length, this.y / length);
    }
  }, {
    key: 'length',
    value: function length() {
      return this.distanceFrom(new Point(0, 0));
    }
  }]);

  return Point;
}();

var Bird = function () {
  function Bird(velocity, location) {
    _classCallCheck(this, Bird);

    this.velocity = velocity;
    this.location = location;
  }

  _createClass(Bird, [{
    key: 'moveTowards',
    value: function moveTowards(location) {
      var difference = location.difference(this.location).normalize();
      var normalizedVelocity = this.velocity.normalize();

      var newVelocity = new Point(this.velocity.x + difference.x, this.velocity.y + difference.y);
      var newLocation = new Point(this.location.x + this.velocity.x, this.location.y + this.velocity.y);

      return new Bird(newVelocity, newLocation);
    }
  }, {
    key: 'distanceFrom',
    value: function distanceFrom(bird) {
      return bird.location.distanceFrom(this.location);
    }
  }]);

  return Bird;
}();

function sum(arr) {
  return arr.reduce(function (total, value) {
    return total + value;
  }, 0);
}

function average(arr) {
  return sum(arr) / arr.length;
}

function averagePoint(points) {
  return new Point(average(points.map(function (p) {
    return p.x;
  })), average(points.map(function (p) {
    return p.y;
  })));
}

function hatchEgg(maxX, maxY) {
  var velocity = new Point(aNumberBetween(-4, 4), aNumberBetween(-4, 4));
  var location = new Point(aNumberBetween(0, maxX), aNumberBetween(0, maxY));
  return new Bird(velocity, location);
}

function aNumberBetween(low, high) {
  return low + Math.random() * (high - low);
}

function log() {
  for (var _len = arguments.length, vars = Array(_len), _key = 0; _key < _len; _key++) {
    vars[_key] = arguments[_key];
  }

  console.log.apply(console, vars.map(function (v) {
    return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' ? JSON.stringify(v, null, 2) : v;
  }));
}

function drawCircle(context, position, diameter) {
  context.beginPath();
  context.arc(position.x, position.y, diameter / 2, 0, 2 * Math.PI, false);
  context.fill();
}

function renderFlock(canvas, flock) {
  var context = canvas.getContext('2d');
  context.fillStyle = '#666';
  var birdSize = 2;

  flock.forEach(function (bird) {
    drawCircle(context, bird.location, birdSize);
  });
}

function main() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var birdCount = 1000;
  var flock = [];

  function maintainFlockSize() {
    while (flock.length < birdCount) {
      flock.push(hatchEgg(width, height));
    }
  }

  maintainFlockSize();
  log(flock);

  var canvas = document.getElementById('flock');

  canvas.width = width;
  canvas.height = height;

  var maxNeighborDistance = 10;

  function tick() {
    flock = flock.map(function (bird) {
      var neighbors = flock.filter(function (b) {
        return b.distanceFrom(bird) < maxNeighborDistance;
      });
      var averageLocation = averagePoint(neighbors.map(function (n) {
        return n.location;
      }));
      return bird.moveTowards(averageLocation);
    });

    flock = flock.filter(function (bird) {
      var _bird$location = bird.location;
      var x = _bird$location.x;
      var y = _bird$location.y;

      return x <= width && x >= 0 && y <= height && y >= 0;
    });

    maintainFlockSize();

    canvas.width = canvas.width;
    renderFlock(canvas, flock);

    window.requestAnimationFrame(tick);
  }

  tick();
}

main();

},{}]},{},[1]);
