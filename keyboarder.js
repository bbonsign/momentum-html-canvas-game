class Keyboarder {
  constructor() {

    this.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }

    this.isDown = function (keyCode) {
      return this.keyState[keyCode] === true
    }

    this.on = function (keyCode, callback) {
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === keyCode) {
          callback()
        }
      })
    }

    window.addEventListener('keydown',  (e) => {
      Keyboarder.keyState[e.keyCode] = true
    })

    window.addEventListener('keyup',  (e) => {
      Keyboarder.keyState[e.keyCode] = false
    })
  }
}

Keyboarder.keyState = {}


