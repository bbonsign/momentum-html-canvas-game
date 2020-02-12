class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas')
        this.screen = canvas.getContext('2d')
        this.makeBoard(10, 'black', 200, 'whitesmoke')
    }

    makeBoard = function (cellPadding, groundColor, wallLen, wallColor) {
        this.padding = cellPadding
        this.groundColor = groundColor
        this.wallLen = wallLen
        this.wallColor = wallColor

        this.screen.fillStyle = groundColor
        this.screen.fillRect(0, 0, 500, 500)

        let wall = new Path2D()
        this.screen.lineWidth = cellPadding
        this.screen.strokeStyle = wallColor
        wall.rect(150, 150, wallLen, wallLen)
        this.screen.stroke(wall)
    }
}

Game.highScore = 0

// =========================== Body =====================================
// size -> Number
class Body {
    constructor(game, size, color) {
        this.game = game
        this.screen = game.screen
        this.size = size
        this.color = color
        this.pos = { x: 0, y: 0 } // the upper left corner position
    }

    get end() {
        // the bottom right corner
        return { x: this.pos.x + this.size, y: this.pos.y + this.size }
    }

    moveTo = function (x, y) {
        this.pos = { x, y }
    }

    moveBy = function (xshift, yshift) {
        this.pos.x += xshift
        this.pos.y += yshift
    }

    draw = function () {
        this.screen.fillStyle = this.color
        this.screen.fillRect(this.pos.x, this.pos.y, this.size, this.size)
    }

    clear = function () {
        this.screen.clearRect(this.pos.x, this.pos.y, this.size, this.size)
    }
}

// ================== Player =====================================
class Player extends Body {
    constructor(game, size, color, grid) {
        super(game, size, color)
        this.keyboarder = new Keyboarder()
        this.pos = { x: 227, y: 227 } // start in center of board
        this.grid = new Grid()
    }

    jump = function (dir) {
        this.clear()
        let shift = this.size + this.game.padding
        switch (dir) {
            case 'left':
                this.moveBy(-shift, 0)
                break
            case 'right':
                this.moveBy(shift, 0)
                break
            case 'up':
                this.moveBy(0, -shift)
                break
            case 'down':
                this.moveBy(0, shift)
                break
            default:
                break;
        }
        this.draw()
    }
}

// =============== Rock ====================================
class Rock extends Body {

}


// =============== Coin ====================================
// Coin.position is the center of a cirle
// Coin.size is the radius
class Coin extends Body {
    constructor(game, size) {
        super(game, size, 'rgb(230, 230, 3)')
    }

    draw = function () {
        this.screen.fillStyle = this.color
        // this.screen.moveTo(this.pos, this.pos.y)
        this.screen.beginPath()
        this.screen.arc(this.pos.x, this.pos.y, this.size, 0, 2 * Math.PI, true)
        // this.screen.closePath()
        this.screen.fill()
    }

}

// ================ Grid ============================
// class for a 9x9 grid to keep track of coins and player
// (0,0) is the top-left position, positive numbers mean right and down, like on the canvas element
// e.g. (2,2) is bottom-right corner and (1,1) is the middle
class Grid {
    constructor() {
        this.pos = new Vec2d([1, 1])
        this.r = new Vec2d([1, 0])
        this.l = new Vec2d([-1, 0])
        this.d = new Vec2d([0, 1])
        this.u = new Vec2d([0, -1])
    }

    // dir should be 'r', 'l', 'u', or 'd'
    jump = function (dir) {
        this.pos = this.pos.add(this[dir])
    }
}

// class for 2d vectors to simplfy some grid computations
// arr should be a two element array
class Vec2d {
    constructor(arr) {
        this.vec = arr
    }

    get x() {
        return this.vec[0]
    }

    get y() {
        return this.vec[1]
    }

    add(vec2) {
        return new Vec2d(this.vec.map((c, i) => c + vec2.vec[i]))
    }
}

// ============ Samples to Play with =========================
pos = { x: 55, y: 80 }
g = new Game()
b = new Body(g, 20, 'whitesmoke')
p = new Player(g, 47, 'whitesmoke')
c = new Coin(g, 15)
c.moveTo(100, 100)
const l = 'left'
const r = 'right'
const u = 'up'
const d = 'down'