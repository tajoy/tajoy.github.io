// Texture management
const getPixels = require("get-pixels")
const sharp = require("sharp")
function isPowerOf2(value) {
  return (value & (value - 1)) === 0
}

// GL texture wrapper object for keeping track of a global set of textures, keyed by a unique user-defined name
class Texture {
  constructor(gl, name, options = {}) {
    this.gl = gl
    this.texture = gl.createTexture()
    if (this.texture) {
      this.valid = true
    }
    this.bind()

    this.name = name
    this.source = null
    this.sourceType = null
    this.loading = null // a Promise object to track the loading state of this texture

    // Default to a 1-pixel black texture so we can safely render while we wait for an image to load
    // See: http://stackoverflow.com/questions/19722247/webgl-wait-for-texture-to-load
    this.setData(1, 1, new Uint8Array([0, 0, 0, 255]), { filtering: "linear" })
    this.setFiltering(options.filtering)

    this.load(options)
  }

  trigger(name, ...args) {
    if (!this.listener) {
      this.listener = {}
    }
    if (!this.listener[name]) {
      this.listener[name] = []
    }
    this.listener[name].forEach(cb => {
      cb(...args)
    })
  }

  off(name, cb) {
    if (!this.listener) {
      this.listener = {}
    }
    if (!this.listener[name]) {
      this.listener[name] = []
    }
    this.listener[name] = this.listener[name].filter(fn => fn !== cb)
  }

  on(name, cb) {
    this.off(name, cb)
    this.listener[name].push(cb)
  }

  // Destroy a single texture instance
  destroy() {
    if (!this.valid) {
      return
    }
    this.gl.deleteTexture(this.texture)
    this.texture = null
    delete this.data
    this.data = null
    this.valid = false
  }

  bind(unit) {
    if (!this.valid) {
      return
    }
    if (typeof unit === "number") {
      if (Texture.activeUnit !== unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit)
        Texture.activeUnit = unit
      }
    }
    if (Texture.activeTexture !== this.texture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
      Texture.activeTexture = this.texture
    }
  }

  load(options = {}) {
    this.loading = null
    if (typeof options.filepath === "string") {
      const setData = this.setData.bind(this)
      const img = sharp(options.filepath)
      img
        .ensureAlpha()
        .toColourspace("srgb")
        .rotate()
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
          // getPixels(data, "image/jpeg", function (err, pixels) {
          //   if (err) {
          //     console.error(`load image ${options.filepath} failed: ${err}`)
          //     return
          //   }
          //   setData(pixels.shape[0], pixels.shape[1], pixels.data, options)
          // })
          // console.log("info", info)
          setData(info.width, info.height, data, options)
        })
        .catch(err => {
          console.error(`load image ${options.filepath} failed: ${err}`)
        })
    } else if (options.data && options.width && options.height) {
      this.setData(options.width, options.height, options.data, options)
    }
  }

  // Sets texture to a raw image buffer
  setData(width, height, data, options = {}) {
    this.width = width
    this.height = height

    this.data = data

    this.update(options)
    this.setFiltering(options)

    this.loading = Promise.resolve(this)
    return this.loading
  }

  // Uploads current image or buffer to the GPU (can be used to update animated textures on the fly)
  update(options = {}) {
    if (!this.valid) {
      return
    }

    this.bind()
    this.gl.pixelStorei(
      this.gl.UNPACK_FLIP_Y_WEBGL,
      options.UNPACK_FLIP_Y_WEBGL === false ? false : true
    )
    this.gl.pixelStorei(
      this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      options.UNPACK_PREMULTIPLY_ALPHA_WEBGL || false
    )

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.width,
      this.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      this.data
    )
    this.trigger("loaded", {})
  }

  // Determines appropriate filtering mode
  setFiltering(options = {}) {
    if (!this.valid) {
      return
    }

    this.powerOf2 = isPowerOf2(this.width) && isPowerOf2(this.height)
    let defaultFilter = this.powerOf2 ? "mipmap" : "linear"
    this.filtering = options.filtering || defaultFilter

    var gl = this.gl
    this.bind()

    // For power-of-2 textures, the following presets are available:
    // mipmap: linear blend from nearest mip
    // linear: linear blend from original image (no mips)
    // nearest: nearest pixel from original image (no mips, 'blocky' look)
    if (this.powerOf2) {
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        options.TEXTURE_WRAP_S ||
          (options.repeat && gl.REPEAT) ||
          gl.CLAMP_TO_EDGE
      )
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        options.TEXTURE_WRAP_T ||
          (options.repeat && gl.REPEAT) ||
          gl.CLAMP_TO_EDGE
      )

      if (this.filtering === "mipmap") {
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR
        ) // TODO: use trilinear filtering by defualt instead?
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)
      } else if (this.filtering === "linear") {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      } else if (this.filtering === "nearest") {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      }
    } else {
      // WebGL has strict requirements on non-power-of-2 textures:
      // No mipmaps and must clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      if (this.filtering === "mipmap") {
        this.filtering = "linear"
      }

      if (this.filtering === "nearest") {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      } else {
        // default to linear for non-power-of-2 textures
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      }
    }
  }
}

// Report max texture size for a GL context
Texture.getMaxTextureSize = function (gl) {
  return gl.getParameter(gl.MAX_TEXTURE_SIZE)
}

// Global set of textures, by name
Texture.activeUnit = -1

module.exports = Texture
