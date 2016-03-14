class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  distanceFrom (point) {
    const { abs, sqrt } = Math
    const deltaX = abs(this.x - point.x)
    const deltaY = abs(this.y - point.y)
    return sqrt((deltaX * deltaX) + (deltaY * deltaY))
  }

  difference (point) {
    return new Point(point.x - this.x, point.y - this.y)
  }

  normalize () {
    const length = this.length() || 0.000001
    return new Point(this.x / length, this.y / length)
  }

  length () {
    return this.distanceFrom(new Point(0, 0))
  }
}

class Bird {
  constructor (velocity, location) {
    this.velocity = velocity
    this.location = location
  }

  moveTowards (location) {
    const difference = location.difference(this.location).normalize()
    const normalizedVelocity = this.velocity.normalize()

    const newVelocity = new Point(this.velocity.x + difference.x, this.velocity.y + difference.y)
    const newLocation = new Point(this.location.x + this.velocity.x, this.location.y + this.velocity.y)

    return new Bird(newVelocity, newLocation)
  }

  distanceFrom (bird) {
    return bird.location.distanceFrom(this.location)
  }
}

function sum (arr) {
  return arr.reduce((total, value) => {
    return total + value
  }, 0)
}

function average (arr) {
  return sum(arr) / arr.length
}

function averagePoint (points) {
  return new Point(average(points.map(p => p.x)), average(points.map(p => p.y)))
}

function hatchEgg (maxX, maxY) {
  const velocity = new Point(aNumberBetween(-4, 4), aNumberBetween(-4, 4))
  const location = new Point(aNumberBetween(0, maxX), aNumberBetween(0, maxY))
  return new Bird(velocity, location)
}

function aNumberBetween (low, high) {
  return low + Math.random() * (high - low)
}

function log (...vars) {
  console.log.apply(console, vars.map(v => typeof v === 'object' ? JSON.stringify(v, null, 2) : v))
}

function drawCircle (context, position, diameter) {
  context.beginPath()
  context.arc(position.x, position.y, diameter / 2, 0, 2 * Math.PI, false)
  context.fill()
}

function renderFlock (canvas, flock) {
  const context = canvas.getContext('2d')
  context.fillStyle = '#666'
  const birdSize = 2

  flock.forEach((bird) => {
    drawCircle(context, bird.location, birdSize)
  })
}

function main () {
  const width = window.innerWidth
  const height = window.innerHeight

  const birdCount = 1000
  let flock = []

  function maintainFlockSize () {
    while (flock.length < birdCount) {
      flock.push(hatchEgg(width, height))
    }
  }

  maintainFlockSize()
  log(flock)

  const canvas = document.getElementById('flock')

  canvas.width = width
  canvas.height = height

  const maxNeighborDistance = 10

  function tick () {
    flock = flock.map((bird) => {
      const neighbors = flock.filter(b => b.distanceFrom(bird) < maxNeighborDistance)
      const averageLocation = averagePoint(neighbors.map(n => n.location))
      return bird.moveTowards(averageLocation)
    })

    flock = flock.filter(bird => {
      const { x, y } = bird.location
      return x <= width && x >= 0 && y <= height && y >= 0
    })

    maintainFlockSize()

    canvas.width = canvas.width
    renderFlock(canvas, flock)

    window.requestAnimationFrame(tick)
  }

  tick()
}

main()
