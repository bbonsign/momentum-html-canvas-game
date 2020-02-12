

class Game {
    constructor() {
        this.canvas = document.querySelector('#canvas')
        this.screen = canvas.getContext('2d')
    }
}

// size = { x: width , y: height }
class Body {
    constructor(game, size, color) {
        this.game = game
        this.screen = game.screen
        this.size = { x: size.x, y: size.y }
        this.keyboarder = new Keyboarder()
        this.color = color
        this.position = { x: 0, y: 0 } // the upper left corner position
    }

    get end() {
        // the bottom right corner
        return { x: this.position.x + this.size.x, y: this.position.y + this.size.y }
    }

    moveTo = function (x, y) {
        this.position = { x, y }
    }

    moveBy = function (xshift, yshift) {
        this.position.x += xshift
        this.position.y += yshift
    }

    draw = function (x, y) {
        this.screen.fillStyle = this.color
        this.screen.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    }

    clear = function () {
        this.screen.clearRect(this.x, this.y, this.size.x, this.size.y)
    }
}

// ================== Player =====================================
class Player extends Body {
    constructor(game, size, color) {
        super(game, size, color)
    }

    jump = function (dir) {
        switch (dir) {
            case 'left':
                this.position.x += -this.size.x
                break
            case 'right':
                this.position.x += this.size.x
                break
            case 'up':
                this.position.y += -this.size.y
                break
            case 'down':
                this.position.y += this.size.y
                break
            default:
                break;
        }

    }
}

// =============== Rock ====================================
class Rock extends Body {

}


// =============== Coin ====================================
class Coin extends Body {

}


pos = { x: 55, y: 80 }
g = new Game()
b = new Body(g, { x: 15, y: 15 }, 'whitesmoke')
p = new Player(g, { x: 15, y: 15 }, 'whitesmoke')
