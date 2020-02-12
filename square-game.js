class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas')
        this.screen = canvas.getContext('2d')
    }
    makeBoard = function (cellPadding, squareLen) {
        this.padding = cellPadding
        this.squareLen = squareLen
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
    }

    get end() {
        // the bottom right corner
        return { x: this.position.x + this.size, y: this.position.y + this.size }
    }

    moveTo = function (x, y) {
        this.position = { x, y }
    }

    moveBy = function (xshift, yshift) {
        this.position.x += xshift
        this.position.y += yshift
    }

    draw = function () {
        this.screen.fillStyle = this.color
        this.screen.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    clear = function () {
        this.screen.clearRect(this.position.x, this.position.y, this.size, this.size)
    }
}

// ================== Player =====================================
class Player extends Body {
    constructor(game, size, color) {
        super(game, size, color)
        this.keyboarder = new Keyboarder()
    }

    jump = function (dir) {
        this.clear()
        let shift = this.size + 10// this.game.padding
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
class Coin extends Body {

}


// ============ Samples to Play with =========================
pos = { x: 55, y: 80 }
g = new Game()
b = new Body(g, 20, 'whitesmoke')
p = new Player(g, 20, 'whitesmoke')
const l = 'left'
const r = 'right'
const u = 'up'
const d = 'down'