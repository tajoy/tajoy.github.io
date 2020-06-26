import chroma from "chroma-js"

function hex(v) {
  if (v === undefined) return "00"
  if (v < 16) return "0" + parseInt("" + v).toString(16)
  return parseInt("" + v).toString(16)
}

function toColor(...args) {
  let ret = ""
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    ret += hex(arg)
  }
  return "#" + ret
}

function calcAngleDegrees(x, y) {
  return (Math.atan2(y, x) * 180) / Math.PI
}

class Cell {
  constructor({ ctx, cx, cy, width, height, color }) {
    this.ctx = ctx
    this.cx = cx
    this.cy = cy
    this.width = width
    this.height = height
    this.color = color
    this.scale = 1.0
    this.rx = 0.0
    this.ry = 0.0
    this.handleColor = c => c
  }

  draw() {
    this.ctx.fillStyle = this.handleColor(this.color)
    this.ctx.fillRect(
      this.cx - this.width * this.scale * 0.5 + this.rx,
      this.cy - this.height * this.scale * 0.5 + this.ry,
      this.width * this.scale,
      this.height * this.scale
    )
  }

  reset() {
    this.scale = 1.0
    this.rx = 0.0
    this.ry = 0.0
  }

  animate({ time, width, height, progress }) {
    const delta =
      Math.sqrt(
        Math.pow(this.cx - width * 0.5, 2) + Math.pow(this.cy - height * 0.5, 2)
      ) * 0.01
    let degrees = calcAngleDegrees(
      this.cx - width * 0.5,
      this.cy - height * 0.5
    )
    degrees = (-degrees - 180) % 360
    this.handleColor = c => {
      const c1 = chroma(c)
      if (degrees > (-progress / 98) * 360) {
        return c1.hex()
      } else {
        return c1.desaturate(3).hex()
      }
    }
    this.scale =
      1.0 +
      Math.pow(Math.E, -Math.pow(1.5 * Math.sin(-time * 3 + delta) - 2, 2))
  }
}

class Viewer {
  constructor({
    canvas,
    width,
    height,
    tinyImg,
    smallImg,
    changeBlur,
  }) {
    this.canvas = canvas
    this.width = width
    this.height = height
    this.tinyImg = tinyImg
    this.smallImg = smallImg
    this.changeBlur = changeBlur
    this.ctx = canvas.getContext("2d")
    this.progress = 0.0
    this.animated = true
    this.image = null
    this.startLoop()
    this.tinyImgToCells()
  }

  startLoop() {
    try {
      // ssr 兼容
      window.requestAnimationFrame(this.loop)
    } catch {}
  }

  loop = () => {
    if (this.animated) {
      this.draw()
      window.requestAnimationFrame(this.loop)
    }
  }

  setProgress(progress) {
    this.progress = progress
    // if (this.progress > 50 && this.progress < 100) {
    //   this.smallImgToCells()
    // }
    // console.log("progress", progress)
  }

  setPhotoImage(image) {
    this.image = image
    this.progress = 100
    this.changeBlur(0)
    // console.log("image", image)
    this.cells = null
  }

  get time() {
    try {
      const t = window.performance.now()
      if (!this.beginTime) {
        this.beginTime = t
      }
      return (t - this.beginTime) / 1000.0
    } catch {
      return 0.0
    }
  }

  draw() {
    this.ctx.fillStyle = `rgba(0,0,0,0)`
    this.ctx.fillRect(0, 0, this.width, this.height)

    if (!this.image) {
      this.drawCells()
    } else {
      this.drawPhoto()
    }
  }

  drawCells() {
    if (!this.cells) return
    const t = this.time
    const sorted = this.cells //.sort((a, b) => a.scale - b.scale)
    for (let i = 0; i < sorted.length; i++) {
      sorted[i].animate({
        time: t,
        width: this.width,
        height: this.height,
        progress: this.progress,
      })
      sorted[i].draw()
    }
  }

  resetCells() {
    if (!this.cells) return
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].reset()
    }
  }

  rawBufferToCells({ raw, width, height, channels }) {
    this.cells = []
    const rw = this.width / width
    const rh = this.height / height
    this.changeBlur(parseInt("" + Math.max(rw, rh)))
    const pixels = Uint8Array.from(new Buffer(raw, "base64"))
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let color
        if (channels === 1) {
          color = toColor(pixels[y * width * channels + x * channels])
        } else if (channels === 3) {
          const r = pixels[y * width * channels + x * channels]
          const g = pixels[y * width * channels + x * channels + 1]
          const b = pixels[y * width * channels + x * channels + 2]
          color = toColor(r, g, b)
        } else if (channels === 4) {
          const r = pixels[y * width * channels + x * channels]
          const g = pixels[y * width * channels + x * channels + 1]
          const b = pixels[y * width * channels + x * channels + 2]
          const a = pixels[y * width * channels + x * channels + 3]
          color = toColor(r, g, b, a)
        }
        this.cells.push(
          new Cell({
            ctx: this.ctx,
            cx: (x - 0.5) * rw,
            cy: (y - 0.5) * rh,
            width: rw,
            height: rh,
            color,
          })
        )
      }
    }
  }

  tinyImgToCells() {
    if (this.type === "tiny") return
    this.type = "tiny"
    const { raw, width, height, channels } = this.tinyImg
    this.rawBufferToCells({ raw, width, height, channels })
  }

  smallImgToCells() {
    if (this.type === "small") return
    this.type = "small"
    const { raw, width, height, channels } = this.smallImg
    this.rawBufferToCells({ raw, width, height, channels })
  }

  drawPhoto() {
    if (!this.image) return
    this.ctx.drawImage(this.image, 0, 0, this.width, this.height)
    this.animated = false
  }
}

export default Viewer
