/**
 * returns random int from min up to max, inclusive
 */
function randInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min
}

// ==================== CLASSES =========================

class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas')
        this.screen = canvas.getContext('2d')
        this.makeBoard(10, 'black', 200, 'whitesmoke')
        this.bodies = []
        let tick = () => {
            this.update()
            requestAnimationFrame(tick)
        }
        tick()
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

    addBody = function (body) {
        this.bodies.push(body)

    }

    update() {
        for (let body of this.bodies) {
            body.update()
        }
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
        this.position = { x: 0, y: 0 } // the upper left corner position
        this.gridOffset = { x: 227, y: 227 } // Position to place the player at (0,0) in the grid
        this.grid = new Grid()

        this.game.addBody(this)
    }

    get end() {
        // the bottom right corner
        return { x: this.position.x + this.size, y: this.position.y + this.size }
    }

    moveTo(x, y) {
        this.position = { x, y }
    }

    moveBy(xshift, yshift) {
        this.position.x += xshift
        this.position.y += yshift
    }

    draw() {
        this.screen.fillStyle = this.color
        this.screen.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    clear() {
        this.screen.clearRect(this.position.x, this.position.y, this.size, this.size)
    }

    update() {
    }
}

// ================== Player =====================================
class Player extends Body {
    constructor(game, size, color) {
        super(game, size, color)
        // this.keyboarder = new Keyboarder()

        // this.grid = new Grid() // keeps track of players grid coordinate.  Starts at (0,0)

        this.newPosition() // move to center and then draw upon instantiation
        this.draw()
        window.addEventListener('keydown', (e) => this.move(e))
    }

    newPosition() {
        let shift = this.size + this.game.padding
        console.log(shift)
        let newPos = { x: this.grid.pos.x * shift + this.gridOffset.x, y: this.grid.pos.y * shift + this.gridOffset.y }
        this.position = newPos
    }

    move(e) {
        if (event.key == 'ArrowLeft') {
            this.clear()
            this.grid.jump('l')
            this.newPosition()
            this.draw()
        }
        if (event.key == 'ArrowRight') {
            this.clear()
            this.grid.jump('r')
            this.newPosition()
            this.draw()
        }
        if (event.key == 'ArrowUp') {
            this.clear()
            this.grid.jump('u')
            this.newPosition()
            this.draw()
        }
        if (event.key == 'ArrowDown') {
            this.clear()
            this.grid.jump('d')
            this.newPosition()
            this.draw()
        }
    }

}

// =============== Rock ====================================
class Rock extends Body {

}


// =============== Coin ====================================
/**
* Coin.position is the center of a cirle
* Coin.size is the radius
*/
class Coin extends Body {
    constructor(game, size) {
        super(game, size, 'rgb(230, 230, 3)')
        this.gridOffset = { x: this.game.canvas.width/2, y: this.game.canvas.height/2 } // Center of canvas

        this.grid.pos = new Vec2d([randInt(-1,1),randInt(-1,1)])
        this.newPosition() // move to center and then draw upon instantiation
        this.draw()
    }

    newPosition() {
        let shift = (this.game.wallLen-6*this.game.padding)/3 + this.game.padding
        console.log(shift)
        let newPos = { x: this.grid.pos.x * shift + this.gridOffset.x, y: this.grid.pos.y * shift + this.gridOffset.y }
        this.position = newPos
        return newPos
    }

    draw() {
        this.screen.fillStyle = this.color
        this.screen.beginPath()
        this.screen.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI, true)
        this.screen.fill()
    }

}

// ========================= Grid ==============================================
/**
* class for a 9x9 grid to keep track of coins and player
* (0,0) is the middle position, positive numbers mean right and down, like on the canvas element
* e.g. (1,1) is bottom-right corner and (-1,-1) is the top-left
*/
class Grid {
    constructor() {
        this.pos = new Vec2d([0, 0])
        this.r = new Vec2d([1, 0])
        this.l = new Vec2d([-1, 0])
        this.d = new Vec2d([0, 1])
        this.u = new Vec2d([0, -1])
    }

    // dir should be 'r', 'l', 'u', or 'd'
    jump = function (dir) {
        if (this.pos.x >= 1 && dir == 'r') {
            return
        }
        else if (this.pos.x <= -1 && dir == 'l') {
            return
        }
        else if (this.pos.y >= 1 && dir == 'd') {
            return
        }
        else if (this.pos.y <= -1 && dir == 'u') {
            return
        }
        else {
            this.pos = this.pos.add(this[dir])
        }
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

    isEqual(vec2) {
        return this.x == vec2.x && this.y == vec2.y
    }
}



// ============ Samples to Play with =========================
pos = { x: 55, y: 80 }
g = new Game()
b = new Body(g, 20, 'whitesmoke')
p = new Player(g, 47, 'whitesmoke')
c = new Coin(g, 20)
c.moveTo(100, 100)
const l = 'left'
const r = 'right'
const u = 'up'
const d = 'down'


v = new Vec2d([1, 2])
w = new Vec2d([2, 3])
x = new Vec2d([1, 2])