const path = require("path")
const { performance } = require("perf_hooks")
const {
  createProgram,
  createShader,
  parseUniforms,
  setupWebGL,
} = require("./gl/gl")
const Texture = require("./gl/Texture")

function isDiff(a, b) {
  if (a && b) {
    return a.toString() !== b.toString()
  }
  return false
}

module.exports = class GlslCanvas {
  constructor(gl, contextOptions, options) {
    contextOptions = contextOptions || {}
    options = options || {}

    this.gl = undefined
    this.program = undefined
    this.textures = {}
    this.buffers = {}
    this.uniforms = {}
    this.vbo = {}
    this.isValid = false
    this.animationFrameRequest = undefined

    this.width = contextOptions.width
    this.height = contextOptions.height

    if (options.basedir) this.basedir = options.basedir
    else this.basedir = __dirname

    this.BUFFER_COUNT = 0
    // this.TEXTURE_COUNT = 0;

    this.vertexString =
      contextOptions.vertexString ||
      `
#ifdef GL_ES
precision mediump float;
#endif
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texcoord = a_texcoord;
}
`
    this.fragmentString =
      contextOptions.fragmentString ||
      `
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texcoord;
void main(){
    gl_FragColor = vec4(0.0);
}
`

    // GL Context
    this.gl = gl
    this.timeLoad = this.timePrev = performance.now()
    this.timeDelta = 0.0
    this.forceRender = true
    this.paused = false
    this.realToCSSPixels = /*window.devicePixelRatio ||*/ 1

    this.load()

    if (!this.program) {
      return
    }

    // Define Vertex buffer
    let texCoordsLoc = gl.getAttribLocation(this.program, "a_texcoord")
    this.vbo.texCoords = gl.createBuffer()
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.texCoords)
    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        0.0,
        1.0,
        1.0,
        0.0,
        1.0,
        1.0,
      ]),
      gl.STATIC_DRAW
    )
    this.gl.enableVertexAttribArray(texCoordsLoc)
    this.gl.vertexAttribPointer(texCoordsLoc, 2, gl.FLOAT, false, 0, 0)

    let verticesLoc = gl.getAttribLocation(this.program, "a_position")
    this.vbo.vertices = gl.createBuffer()
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo.vertices)
    this.gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0,
        -1.0,
        1.0,
        -1.0,
        -1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
        -1.0,
        1.0,
        1.0,
      ]),
      gl.STATIC_DRAW
    )
    this.gl.enableVertexAttribArray(verticesLoc)
    this.gl.vertexAttribPointer(verticesLoc, 2, gl.FLOAT, false, 0, 0)

    // load TEXTURES
    if (contextOptions.textures && contextOptions.textures.length > 0) {
      let imgList = contextOptions.textures
      for (let nImg in imgList) {
        this.setUniform("u_tex" + nImg, imgList[nImg])
      }
    }

    // ========================== EVENTS
    let mouse = {
      x: 0,
      y: 0,
    }
    // Start
    this.setMouse(mouse)
    return this
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
    off(name, cb)
    this.listener[name].push(cb)
  }

  destroy() {
    // Stop the animation
    // cancelAnimationFrame(this.animationFrameRequest)

    this.animated = false
    this.isValid = false
    for (let tex in this.textures) {
      if (tex.destroy) {
        tex.destroy()
      }
    }
    this.textures = {}
    for (let att in this.attribs) {
      this.gl.deleteBuffer(this.attribs[att])
    }
    this.gl.useProgram(null)
    this.gl.deleteProgram(this.program)
    for (let key in this.buffers) {
      const buffer = this.buffers[key]
      this.gl.deleteProgram(buffer.program)
    }

    this.program = null
    this.gl = null
  }

  load(fragString, vertString) {
    // Load vertex shader if there is one
    if (vertString) {
      this.vertexString = vertString
    }

    // Load fragment shader if there is one
    if (fragString) {
      this.fragmentString = fragString
    }


    this.animated = false
    this.nDelta = (this.fragmentString.match(/u_delta/g) || []).length
    this.nTime = (this.fragmentString.match(/u_time/g) || []).length
    this.nDate = (this.fragmentString.match(/u_date/g) || []).length
    this.nMouse = (this.fragmentString.match(/u_mouse/g) || []).length
    this.animated = this.nDate > 1 || this.nTime > 1 || this.nMouse > 1

    let nTextures = this.fragmentString.search(/sampler2D/g)
    if (nTextures) {
      let lines = this.fragmentString.split("\n")
      for (let i = 0; i < lines.length; i++) {
        let match = lines[i].match(
          /uniform\s*sampler2D\s*([\w]*);\s*\/\/\s*([\w|\:\/\/|\.|\-|\_]*)/i
        )
        if (match) {
          let ext = match[2].split(".").pop().toLowerCase()
          if (
            match[1] &&
            match[2] &&
            (ext === "jpg" ||
              ext === "jpeg" ||
              ext === "png" ||
              ext === "ogv" ||
              ext === "webm" ||
              ext === "mp4")
          ) {
            this.setUniform(match[1], match[2])
          }
        }
        let main = lines[i].match(/\s*void\s*main\s*/g)
        if (main) {
          break
        }
      }
    }

    let vertexShader = createShader(
      this,
      this.vertexString,
      this.gl.VERTEX_SHADER
    )
    let fragmentShader = createShader(
      this,
      this.fragmentString,
      this.gl.FRAGMENT_SHADER
    )

    // If Fragment shader fails load a empty one to sign the error
    if (!fragmentShader) {
      fragmentShader = createShader(
        this,
        "void main(){\n\tgl_FragColor = vec4(1.0);\n}",
        this.gl.FRAGMENT_SHADER
      )
      this.isValid = false
    } else {
      this.isValid = true
    }

    // Create and use program
    let program = createProgram(this, [vertexShader, fragmentShader]) //, [0,1],['a_texcoord','a_position']);
    this.gl.useProgram(program)

    // Delete shaders
    // this.gl.detachShader(program, vertexShader);
    // this.gl.detachShader(program, fragmentShader);
    this.gl.deleteShader(vertexShader)
    this.gl.deleteShader(fragmentShader)
    

    this.program = program
    this.change = true

    this.BUFFER_COUNT = 0
    const buffers = this.getBuffers(this.fragmentString)
    if (Object.keys(buffers).length) {
      this.loadPrograms(buffers)
    }
    this.buffers = buffers
    this.textureIndex = this.BUFFER_COUNT

    // Trigger event
    this.trigger("load", {})

    this.forceRender = true
    this.render()
  }

  test(callback, fragString, vertString) {
    // Thanks to @thespite for the help here
    // https://www.khronos.org/registry/webgl/extensions/EXT_disjoint_timer_query/
    let pre_test_vert = this.vertexString
    let pre_test_frag = this.fragmentString
    let pre_test_paused = this.paused

    let ext = this.gl.getExtension("EXT_disjoint_timer_query")
    let query = ext.createQueryEXT()
    let wasValid = this.isValid

    if (fragString || vertString) {
      this.load(fragString, vertString)
      wasValid = this.isValid
      this.forceRender = true
      this.render()
    }

    this.paused = true
    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query)
    this.forceRender = true
    this.render()
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT)

    let sandbox = this
    function finishTest() {
      // Revert changes... go back to normal
      sandbox.paused = pre_test_paused
      if (fragString || vertString) {
        sandbox.load(pre_test_frag, pre_test_vert)
      }
    }
    function waitForTest() {
      sandbox.forceRender = true
      sandbox.render()
      let available = ext.getQueryObjectEXT(
        query,
        ext.QUERY_RESULT_AVAILABLE_EXT
      )
      let disjoint = sandbox.gl.getParameter(ext.GPU_DISJOINT_EXT)
      if (available && !disjoint) {
        let ret = {
          wasValid: wasValid,
          frag: fragString || sandbox.fragmentString,
          vert: vertString || sandbox.vertexString,
          timeElapsedMs:
            ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT) / 1000000.0,
        }
        finishTest()
        callback(ret)
      } else {
        window.requestAnimationFrame(waitForTest)
      }
    }
    waitForTest()
  }

  loadTexture(name, urlElementOrData, options) {
    if (!options) {
      options = {}
    }

    if (!options.basedir) {
      options.basedir = this.basedir
    }

    if (typeof urlElementOrData === "string") {
      if (urlElementOrData.startsWith("/")) {
        options.filepath = urlElementOrData
      } else {
        options.filepath = path.join(options.basedir, urlElementOrData)
      }
    } else if (
      typeof urlElementOrData === "object" &&
      urlElementOrData.data &&
      urlElementOrData.width &&
      urlElementOrData.height
    ) {
      options.data = urlElementOrData.data
      options.width = urlElementOrData.width
      options.height = urlElementOrData.height
    }

    if (this.textures[name]) {
      if (this.textures[name]) {
        this.textures[name].load(options)
        this.textures[name].on("loaded", args => {
          this.forceRender = true
        })
      }
    } else {
      this.textures[name] = new Texture(this.gl, name, options)
      this.textures[name].on("loaded", args => {
        this.forceRender = true
      })
    }
  }

  refreshUniforms() {
    this.uniforms = {}
  }

  setUniform(name, ...value) {
    let u = {}
    u[name] = value
    this.setUniforms(u)
  }

  setUniforms(uniforms) {
    let parsed = parseUniforms(uniforms)
    // Set each uniform
    for (let u in parsed) {
      if (parsed[u].type === "sampler2D") {
        // For textures, we need to track texture units, so we have a special setter
        // this.uniformTexture(parsed[u].name, parsed[u].value[0]);
        this.loadTexture(parsed[u].name, parsed[u].value[0])
      } else {
        this.uniform(
          parsed[u].method,
          parsed[u].type,
          parsed[u].name,
          parsed[u].value
        )
      }
    }
    this.forceRender = true
  }

  setMouse(mouse) {
    // set the mouse uniform
    // let rect = this.canvas.getBoundingClientRect()
    // if (
    //   mouse &&
    //   mouse.x &&
    //   mouse.x >= rect.left &&
    //   mouse.x <= rect.right &&
    //   mouse.y &&
    //   mouse.y >= rect.top &&
    //   mouse.y <= rect.bottom
    // ) {
    //   let mouse_x = (mouse.x - rect.left) * this.realToCSSPixels
    //   let mouse_y =
    //     this.canvas.height - (mouse.y - rect.top) * this.realToCSSPixels
    //   this.uniform("2f", "vec2", "u_mouse", mouse_x, mouse_y)
    // }
    this.uniform("2f", "vec2", "u_mouse", mouse.x, mouse.y)
  }

  // ex: program.uniform('3f', 'position', x, y, z);
  uniform(method, type, name, ...value) {
    // 'value' is a method-appropriate arguments list
    this.uniforms[name] = this.uniforms[name] || {}
    let uniform = this.uniforms[name]
    let change = isDiff(uniform.value, value)

    // remember and keep track of uniforms location to save calls
    if (change || this.change || !uniform.location || !uniform.value) {
      uniform.name = name
      uniform.type = type
      uniform.value = value
      uniform.method = "uniform" + method
      this.gl.useProgram(this.program)
      uniform.location = this.gl.getUniformLocation(this.program, name)
      this.gl[uniform.method].apply(
        this.gl,
        [uniform.location].concat(uniform.value)
      )
      // If there is change update and there is buffer update manually one by one
      for (let key in this.buffers) {
        let buffer = this.buffers[key]
        this.gl.useProgram(buffer.program)
        let location = this.gl.getUniformLocation(buffer.program, name)
        this.gl[uniform.method].apply(this.gl, [location].concat(uniform.value))
      }
    }
  }

  uniformTexture(name, texture, options) {
    if (this.textures[name] === undefined) {
      this.loadTexture(name, texture, options)
    } else {
      this.uniform("1i", "sampler2D", name, this.textureIndex)

      for (let key in this.buffers) {
        const buffer = this.buffers[key]
        this.gl.useProgram(buffer.program)
        this.gl.activeTexture(this.gl.TEXTURE0 + this.textureIndex)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[name].texture)
      }
      this.gl.useProgram(this.program)
      this.gl.activeTexture(this.gl.TEXTURE0 + this.textureIndex)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[name].texture)
      this.uniform(
        "2f",
        "vec2",
        name + "Resolution",
        this.textures[name].width,
        this.textures[name].height
      )
    }
  }

  resize() {
    // if (
    //   this.width !== this.canvas.clientWidth ||
    //   this.height !== this.canvas.clientHeight
    // ) {
    //   this.realToCSSPixels = 1

    //   // Lookup the size the browser is displaying the canvas in CSS pixels
    //   // and compute a size needed to make our drawingbuffer match it in
    //   // device pixels.
    //   let displayWidth = Math.floor(
    //     this.gl.canvas.clientWidth * this.realToCSSPixels
    //   )
    //   let displayHeight = Math.floor(
    //     this.gl.canvas.clientHeight * this.realToCSSPixels
    //   )

    //   // Check if the canvas is not the same size.
    //   if (
    //     this.gl.canvas.width !== displayWidth ||
    //     this.gl.canvas.height !== displayHeight
    //   ) {
    //     // Make the canvas the same size
    //     this.gl.canvas.width = displayWidth
    //     this.gl.canvas.height = displayHeight
    //     // Set the viewport to match
    //     this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
    //   }
    //   this.width = this.canvas.clientWidth
    //   this.height = this.canvas.clientHeight
    //   this.resizeSwappableBuffers()
    //   return true
    // } else {
    return false
    // }
  }

  render() {
    this.visible = true // isCanvasVisible(this.canvas)
    if (
      this.forceRender ||
      this.change ||
      (this.animated && this.visible && !this.paused)
    ) {
      // Update Uniforms when are need
      let date = new Date()
      let now = performance.now()
      this.timeDelta = (now - this.timePrev) / 1000.0
      this.timePrev = now
      if (this.nDelta > 1) {
        // set the delta time uniform
        this.uniform("1f", "float", "u_delta", this.timeDelta)
      }

      if (this.nTime > 1) {
        // set the elapsed time uniform
        this.uniform("1f", "float", "u_time", (now - this.timeLoad) / 1000.0)
      }

      if (this.nDate) {
        // Set date uniform: year/month/day/time_in_sec
        this.uniform(
          "4f",
          "float",
          "u_date",
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours() * 3600 +
            date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() * 0.001
        )
      }

      // set the resolution uniform
      this.uniform("2f", "vec2", "u_resolution", this.width, this.height)

      for (let key in this.buffers) {
        const buffer = this.buffers[key]
        this.uniform("1i", "sampler2D", buffer.name, buffer.bundle.input.index)
      }

      this.textureIndex = this.BUFFER_COUNT
      for (let tex in this.textures) {
        this.uniformTexture(tex)
        this.textureIndex++
      }

      this.renderPrograms()

      // Trigger event
      this.trigger("render", {})
      this.change = false
      this.forceRender = false
    }
  }

  pause() {
    this.paused = true
  }

  play() {
    this.paused = false
  }

  // render main and buffers programs
  renderPrograms() {
    const gl = this.gl
    const W = this.width
    const H = this.height

    gl.viewport(0, 0, W, H)

    for (let key in this.buffers) {
      const buffer = this.buffers[key]
      buffer.bundle.render(W, H, buffer.program, buffer.name)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    }

    gl.useProgram(this.program)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  // parse input strings
  getBuffers(fragString) {
    let buffers = {}
    if (fragString) {
      fragString.replace(
        /(?:^\s*)((?:#if|#elif)(?:\s*)(defined\s*\(\s*BUFFER_)(\d+)(?:\s*\))|(?:#ifdef)(?:\s*BUFFER_)(\d+)(?:\s*))/gm,
        function () {
          const i = arguments[3] || arguments[4]
          buffers["u_buffer" + i] = {
            fragment: "#define BUFFER_" + i + "\n" + fragString,
          }
        }
      )
    }
    return buffers
  }

  // load buffers programs
  loadPrograms(buffers) {
    const glsl = this
    const gl = this.gl
    const vertex = createShader(glsl, glsl.vertexString, gl.VERTEX_SHADER)
    for (let key in buffers) {
      const buffer = buffers[key]
      let fragment = createShader(glsl, buffer.fragment, gl.FRAGMENT_SHADER, 1)
      if (!fragment) {
        fragment = createShader(
          glsl,
          "void main(){\n\tgl_FragColor = vec4(1.0);\n}",
          gl.FRAGMENT_SHADER
        )
        glsl.isValid = false
      } else {
        glsl.isValid = true
      }
      const program = createProgram(glsl, [vertex, fragment])
      buffer.name = key
      buffer.program = program
      buffer.bundle = glsl.createSwappableBuffer(
        glsl.width,
        glsl.height,
        program
      )
      gl.deleteShader(fragment)
    }
    gl.deleteShader(vertex)
  }

  // create an input / output swappable buffer
  createSwappableBuffer(W, H, program) {
    var input = this.createBuffer(W, H, program)
    var output = this.createBuffer(W, H, program)
    const gl = this.gl
    return {
      input: input,
      output: output,
      swap: function () {
        var temp = input
        input = output
        output = temp
        this.input = input
        this.output = output
      },
      render: function (W, H, program, name) {
        gl.useProgram(program)
        gl.viewport(0, 0, W, H)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.input.buffer)
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          this.output.texture,
          0
        )
        gl.drawArrays(gl.TRIANGLES, 0, 6)
        this.swap()
      },
      resize: function (W, H, program, name) {
        gl.useProgram(program)
        gl.viewport(0, 0, W, H)
        this.input.resize(W, H)
        this.output.resize(W, H)
      },
    }
  }

  // create a buffers
  createBuffer(W, H, program) {
    const gl = this.gl
    let index = this.BUFFER_COUNT
    this.BUFFER_COUNT += 2
    gl.getExtension("OES_texture_float")
    var texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.FLOAT, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    var buffer = gl.createFramebuffer()
    return {
      index: index,
      texture: texture,
      buffer: buffer,
      W: W,
      H: H,
      resize: function (W, H) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
        var minW = Math.min(W, this.W)
        var minH = Math.min(H, this.H)
        var pixels = new Float32Array(minW * minH * 4)
        gl.readPixels(0, 0, minW, minH, gl.RGBA, gl.FLOAT, pixels)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        var newIndex = index + 1
        var newTexture = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0 + newIndex)
        gl.bindTexture(gl.TEXTURE_2D, newTexture)
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          W,
          H,
          0,
          gl.RGBA,
          gl.FLOAT,
          null
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texSubImage2D(
          gl.TEXTURE_2D,
          0,
          0,
          0,
          minW,
          minH,
          gl.RGBA,
          gl.FLOAT,
          pixels
        )
        var newBuffer = gl.createFramebuffer()
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.deleteTexture(texture)
        gl.activeTexture(gl.TEXTURE0 + index)
        gl.bindTexture(gl.TEXTURE_2D, newTexture)
        index = this.index = index
        texture = this.texture = newTexture
        buffer = this.buffer = newBuffer
        this.W = W
        this.H = H
      },
    }
  }

  // resize buffers on canvas resize
  // consider applying a throttle of 50 ms on canvas resize
  // to avoid requestAnimationFrame and Gl violations
  resizeSwappableBuffers() {
    const gl = this.gl
    const W = this.width,
      H = this.height
    gl.viewport(0, 0, W, H)
    for (let key in this.buffers) {
      const buffer = this.buffers[key]
      buffer.bundle.resize(W, H, buffer.program, buffer.name)
    }
    gl.useProgram(this.program)
  }

  version() {
    return "0.1.7"
  }
}
