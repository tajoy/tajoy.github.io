const createContext = require("gl")
const sharp = require("sharp")
const GIFEncoder = require("gifencoder")
const concat = require("concat-stream")
const { performance } = require("perf_hooks")

const GlslCanvas = require("./GlslCanvas")

const sleep = t => new Promise(resolve => setTimeout(resolve, t))

const WIDTH = 128
const HEIGHT = 128

module.exports = async function generatePreview(
  basedir,
  vert,
  frag,
  opts = {}
) {
  opts.width = opts.width || WIDTH
  opts.height = opts.height || HEIGHT
  opts.duration = opts.duration || 3.0

  const gl = createContext(opts.width, opts.height, {
    preserveDrawingBuffer: true,
  })

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // gl.enable(gl.DEPTH_TEST)
  // gl.enable(gl.CULL_FACE)
  // gl.viewport(0, 0, opts.width, opts.height)

  const canvas = new GlslCanvas(
    gl,
    {
      width: opts.width,
      height: opts.height,
      vertexString: vert,
      fragmentString: frag,
    },
    {
      basedir: basedir,
    }
  )
  // console.log("canvas.textures", JSON.stringify(canvas.textures, null, 2))
  // process.exit(-1)
  const waitLoadTextures = () =>
    new Promise(resolve => {
      const count = Object.keys(canvas.textures || {}).length
      let loadedCount = 0
      if (canvas.textures && count > 0) {
        for (const key in canvas.textures) {
          if (canvas.textures.hasOwnProperty(key)) {
            const texture = canvas.textures[key]
            texture.on("loaded", args => {
              // console.log("texture loaded", texture)
              loadedCount += 1
              if (loadedCount >= count) {
                resolve()
              }
            })
          }
        }
      } else {
        resolve()
      }
    })
  await waitLoadTextures()

  const ret = {}

  if (canvas.animated) {
    ret.type = "gif"
    ret.data = null
    let begin = performance.now()
    let last = performance.now()
    const encoder = new GIFEncoder(opts.width, opts.height)
    const delay = 100
    const ws = concat()
    encoder.createReadStream().pipe(ws)
    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(delay)
    encoder.setQuality(100)
    while (performance.now() - begin < opts.duration * 1000) {
      last = performance.now()
      canvas.forceRender = true
      canvas.render()
      const pixels = new Uint8Array(opts.width * opts.height * 4)
      gl.readPixels(
        0,
        0,
        opts.width,
        opts.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      )
      const buffer = Buffer.from(pixels)
      const imageData = await sharp(buffer, {
        raw: {
          width: opts.width,
          height: opts.height,
          channels: 4,
        },
      })
        .raw()
        .flip()
        .toBuffer()
      encoder.addFrame(imageData)
      await sleep(Math.max(delay - (performance.now() - last), 1))
    }
    encoder.finish()
    ret.data = ws.getBody()
  } else {
    ret.type = "jpeg"
    // ret.data = null
    canvas.forceRender = true
    canvas.render()
    var pixels = new Uint8Array(opts.width * opts.height * 4)
    gl.readPixels(
      0,
      0,
      opts.width,
      opts.height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    )
    const buffer = Buffer.from(pixels)
    ret.data = await sharp(buffer, {
      raw: {
        width: opts.width,
        height: opts.height,
        channels: 4,
      },
    })
      .flip()
      .toFormat("jpeg")
      .toBuffer()
  }

  canvas.destroy()
  gl.destroy()
  return ret
}
