/**
 * returns random int from min up to max, inclusive
 */
function randInt (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

// ==================== CLASSES =========================
// TODO: refactor to make Board class separate from Game class
class Game {
  constructor () {
    this.canvas = document.querySelector('#canvas')
    this.screen = this.canvas.getContext('2d')

    this.score = 0
    this.rockLimit = 3
    this.stop = false

    this.makeBoard(10, 'black', 200, 'whitesmoke')
    this.player = new Player(this, 47, 'whitesmoke')
    this.coin = new Coin(this, 20)
    this.rocks = [new Rock(this, 35), new Rock(this, 35)]

    const tick = () => {
      this.update()
      if (!this.stop) {
        requestAnimationFrame(tick)
      } else {
        cancelAnimationFrame(tick)
        this.endOverlay()
      }
    }

    tick()
  }

  makeBoard (cellPadding, groundColor, wallLen, wallColor) {
    this.padding = cellPadding
    this.groundColor = groundColor
    this.wallLen = wallLen
    this.wallColor = wallColor

    this.screen.fillStyle = groundColor
    this.screen.fillRect(0, 0, 500, 500)

    const wall = new Path2D()
    this.screen.lineWidth = cellPadding
    this.screen.strokeStyle = wallColor
    wall.rect(150, 150, wallLen, wallLen)
    this.screen.stroke(wall)
    this.drawScore()
    this.drawHighScore()
  }

  updateHighScore () {
    Game.highScore = this.score > Game.highScore ? this.score : Game.highScore
  }

  drawHighScore () {
    this.screen.textAlign = 'start' // default
    this.screen.font = '35px serif'
    this.screen.fillStyle = 'rgba(255,255,255,.3)'
    this.screen.fillText(`High Score: ${Game.highScore}`, 155, 50)
  }

  drawScore () {
    this.screen.textAlign = 'start' // default
    if (this.score < 10) {
      this.screen.font = '140px serif'
      this.screen.fillStyle = 'rgba(50,100,200,.6)'
      this.screen.fillText(`${this.score}`, 218, 297)
    } else {
      this.screen.font = '140px serif'
      this.screen.fillStyle = 'rgba(50,100,200,.5)'
      this.screen.fillText(`${this.score}`, 185, 297)
    }
  }

  discardRocks () {
    this.rocks = this.rocks.filter(rock => !rock.isOffCanvas())
  }

  isHitBy (rock) {
    const rPos = rock.position // upper left corner
    const rSize = rock.size
    const pPos = this.player.position // upper left corner
    const pSize = this.player.size
    return (!(rPos.x + rSize < pPos.x ||
      rPos.x > pPos.x + pSize ||
      rPos.y + rSize < pPos.y ||
      rPos.y > pPos.y + pSize
    ))
  }

  increaseRockLimit () {
    if (this.score > 25) {
      this.rockLimit = 4
    } else if (this.score > 35) {
      this.rockLimit = 5
    }
  }

  endBehavior () {
    const callBack = (event) => {
      if (event.key === 'Enter') {
        document.body.removeEventListener('keydown', callBack)
        new Game()
      }
    }
    this.endOverlay()
    document.body.addEventListener('keydown', callBack)
  }

  endOverlay () {
    this.player.move = () => { } // prevents the player from drawing over the overlay if arrow keys are pressed
    this.screen.fillStyle = 'rgba(61, 58, 152, 0.7)'
    this.screen.fillRect(0, 0, 500, 500)
    this.screen.fillStyle = 'rgba(255,255,255,1)'
    this.screen.font = '3rem serif'
    this.screen.textAlign = 'center'
    const textStart = 250
    this.screen.fillText(`You Scored: ${this.score}`, textStart, 150)
    this.screen.fillText('Press enter to', textStart, 260)
    this.screen.fillText('begin a new game', textStart, 320)
  }

  update () {
    if (this.player.grid.pos.isEqual(this.coin.grid.pos)) {
      this.score += 1
      this.coin = new Coin(this, 20)
    }
    if (this.rocks.some(rock => this.isHitBy(rock))) {
      this.stop = true
      this.endBehavior()
    }
    this.updateHighScore()
    this.discardRocks()
    this.screen.clearRect(0, 0, 500, 500)
    this.makeBoard(10, 'black', 200, 'whitesmoke')
    this.coin.draw()
    if (this.rocks.length < this.rockLimit && Math.random() > 0.995) {
      this.rocks.push(new Rock(this, 35))
    } else if (this.rocks.length < 2 && Math.random() > 0.9) {
      this.rocks.push(new Rock(this, 35))
    }
    for (const rock of this.rocks) {
      rock.update()
    }
    this.player.draw()
    this.increaseRockLimit()
  }
}

// Will stay constant for all new Games that are run, until page refresh
Game.highScore = 0

// =========================== Body =====================================
// size -> Number
class Body {
  constructor (game, size, color) {
    this.game = game
    this.screen = game.screen
    this.size = size
    this.color = color
    this.position = { x: 0, y: 0 } // the upper left corner position
    this.gridOffset = { x: 227, y: 227 } // Position to place the player at (0,0) in the grid
    this.grid = new Grid()
  }

  get end () {
    // the bottom right corner
    return { x: this.position.x + this.size, y: this.position.y + this.size }
  }

  get center () {
    // only accurate for square bodies (not Coins)
    return { x: this.position + this.size / 2, y: this.position + this.size / 2 }
  }

  moveTo (x, y) {
    this.position = { x, y }
  }

  moveBy (xshift, yshift) {
    this.position.x += xshift
    this.position.y += yshift
  }

  draw () {
    this.screen.fillStyle = this.color
    this.screen.fillRect(this.position.x, this.position.y, this.size, this.size)
  }

  isOffCanvas () {
    return this.position.x < 0 || this.position.x > 495 || this.position.y < 0 || this.position.y > 495
  }

  clear () {
    this.screen.clearRect(this.position.x, this.position.y, this.size, this.size)
  }
}

// ================== Player =====================================
class Player extends Body {
  constructor (game, size, color) {
    super(game, size, color)
    this.newPosition() // move to center and then draw upon instantiation
    this.draw()
    window.addEventListener('keydown', (e) => this.move(e))

    this.game.player = this
  }

  newPosition () {
    const shift = this.size + this.game.padding
    const newPos = { x: this.grid.pos.x * shift + this.gridOffset.x, y: this.grid.pos.y * shift + this.gridOffset.y }
    this.position = newPos
  }

  move (event) {
    if (event.key === 'ArrowLeft') {
      this.clear()
      this.grid.jump('l')
      this.newPosition()
      this.draw()
    }
    if (event.key === 'ArrowRight') {
      this.clear()
      this.grid.jump('r')
      this.newPosition()
      this.draw()
    }
    if (event.key === 'ArrowUp') {
      this.clear()
      this.grid.jump('u')
      this.newPosition()
      this.draw()
    }
    if (event.key === 'ArrowDown') {
      this.clear()
      this.grid.jump('d')
      this.newPosition()
      this.draw()
    }
  }
}

// =============== Rock ====================================
class Rock extends Body {
  constructor (game, size) {
    super(game, size, 'rgb(75, 80, 109)')
    this.vel = 0
    this.newPositionAndVel()
    this.draw()
  }

  newPositionAndVel () {
    const shift = this.game.wallLen / 3 - this.game.padding
    const offset = this.gridOffset.x + (47 - this.size) / 2
    // key%2 == 0 : add to x , key%2 == 1: add to y (top, right, bottom, left)
    const wall = { 0: new Vec([0, 0]), 1: new Vec([500 - this.size, 0]), 2: new Vec([0, 500 - this.size]), 3: new Vec([0, 0]) }
    const coor1 = randInt(0, 3)
    const coor2 = randInt(-1, 1)
    if (coor1 % 2 === 0) {
      this.position = wall[coor1].add(new Vec([offset, 0])).add(new Vec([shift, 0]).scale(coor2)).toObject()
      this.vel = new Vec([0, (1 - coor1) % 2]) // ( 0 -> -1 & 2 -> 1)
    } else {
      this.position = wall[coor1].add(new Vec([0, offset])).add(new Vec([0, shift]).scale(coor2)).toObject()
      this.vel = new Vec([(coor1 - 2) % 2, 0]) // ( 1 -> 1 & 3 -> -1)
    }
    let velScale = randInt(2, 3)
    if (this.game.score > 35) {
      velScale = Math.random() * 2.8 + 1
    }
    this.vel = this.vel.scale(velScale)
  }

  update () {
    this.clear()
    this.position.x += this.vel.x
    this.position.y += this.vel.y
    this.draw()
  }
}

// =============== Coin ====================================
/**
* Coin.position is the center of a cirle
* Coin.size is the radius
*/
class Coin extends Body {
  constructor (game, size) {
    super(game, size, 'rgb(230, 230, 3)')
    this.gridOffset = { x: this.game.canvas.width / 2, y: this.game.canvas.height / 2 } // Center of canvas

    this.grid.pos = this.startCoor()
    this.newPosition() // move to center and then draw upon instantiation
    this.draw()
  }

  startCoor () {
    let vec = new Vec([randInt(-1, 1), randInt(-1, 1)])
    while (vec.isEqual(this.game.player.grid.pos)) {
      vec = new Vec([randInt(-1, 1), randInt(-1, 1)])
    }
    return vec
  }

  newPosition () {
    const shift = (this.game.wallLen - 6 * this.game.padding) / 3 + this.game.padding
    const newPos = { x: this.grid.pos.x * shift + this.gridOffset.x, y: this.grid.pos.y * shift + this.gridOffset.y }
    this.position = newPos
    return newPos
  }

  draw () {
    this.screen.fillStyle = this.color
    this.screen.beginPath()
    this.screen.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, true)
    this.screen.fill()

    this.screen.strokeStyle = 'rgb(146, 146, 0)'
    this.screen.lineWidth = 4
    this.screen.beginPath()
    this.screen.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, true)
    this.screen.stroke()

    this.screen.textAlign = 'center'
    this.screen.font = '25px serif'
    this.screen.fillStyle = 'rgb(146, 146, 0)'
    this.screen.fillText('$', this.position.x, this.position.y + 8)
  }
}

// ========================= Grid ==============================================
/**
* class for a 9x9 grid to keep track of coins and player
* (0,0) is the middle position, positive numbers mean right and down, like on the canvas element
* e.g. (1,1) is bottom-right corner and (-1,-1) is the top-left
*/
class Grid {
  constructor () {
    this.pos = new Vec([0, 0])
    this.r = new Vec([1, 0])
    this.l = new Vec([-1, 0])
    this.d = new Vec([0, 1])
    this.u = new Vec([0, -1])
  }

  // dir should be 'r', 'l', 'u', or 'd'
  jump (dir) {
    if (this.pos.x >= 1 && dir === 'r') { } else if (this.pos.x <= -1 && dir === 'l') { } else if (this.pos.y >= 1 && dir === 'd') { } else if (this.pos.y <= -1 && dir === 'u') { } else {
      this.pos = this.pos.add(this[dir])
    }
  }
}

// class for 2d vectors to simplfy some grid computations
// arr should be a two element array
class Vec {
  constructor (arr) {
    this.vec = arr
  }

  get x () {
    return this.vec[0]
  }

  get y () {
    return this.vec[1]
  }

  scale (c) {
    return new Vec([this.x * c, this.y * c])
  }

  add (vec2) {
    return new Vec(this.vec.map((c, i) => c + vec2.vec[i]))
  }

  toObject () {
    return { x: this.x, y: this.y }
  }

  isEqual (vec2) {
    return this.x === vec2.x && this.y === vec2.y
  }
}

// ============ Start a game =========================
new Game()
