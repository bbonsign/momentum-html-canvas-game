class Keyboarder {
  constructor() {
    this.keyState = {}

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
      this.keyState[e.keyCode] = true
    })

    window.addEventListener('keyup',  (e) => {
      this.keyState[e.keyCode] = false
    })
  }
}

Keyboarder.KEYS = { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40, S: 83 }


