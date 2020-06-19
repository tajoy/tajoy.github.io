/*
 *	Create a Vertex of a specific type (gl.VERTEX_SHADER/)
 */
module.exports.createShader = function (main, source, type, offset) {
  let gl = main.gl

  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (!compiled) {
    // Something went wrong during compilation; get the error
    lastError = gl.getShaderInfoLog(shader)
    // console.error("*** Error compiling shader " + shader + ":" + lastError)
    // main.trigger("error", {
    //   shader: shader,
    //   source: source,
    //   type: type,
    //   error: lastError,
    //   offset: offset || 0,
    // })
    gl.deleteShader(shader)
    throw "*** Error compiling shader " + shader + ":" + lastError
    return null
  }

  return shader
}

/**
 * Loads a shader.
 * @param {!WebGLContext} gl The WebGLContext to use.
 * @param {string} shaderSource The shader source.
 * @param {number} shaderType The type of shader.
 * @param {function(string): void) opt_errorCallback callback for errors.
 * @return {!WebGLShader} The created shader.
 */
module.exports.createProgram = function (
  main,
  shaders,
  optAttribs,
  optLocations
) {
  let gl = main.gl

  let program = gl.createProgram()
  for (let ii = 0; ii < shaders.length; ++ii) {
    gl.attachShader(program, shaders[ii])
  }
  if (optAttribs) {
    for (let ii = 0; ii < optAttribs.length; ++ii) {
      gl.bindAttribLocation(
        program,
        optLocations ? optLocations[ii] : ii,
        optAttribs[ii]
      )
    }
  }
  gl.linkProgram(program)

  // Check the link status
  let linked = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!linked) {
    // something went wrong with the link
    lastError = gl.getProgramInfoLog(program)
    // console.log("Error in program linking:" + lastError)
    gl.deleteProgram(program)
    throw "Error in program linking:" + lastError
    return null
  }
  return program
}

// By Brett Camber on
// https://github.com/tangrams/tangram/blob/master/src/gl/glsl.js
module.exports.parseUniforms = function (uniforms, prefix = null) {
  let parsed = []

  for (let name in uniforms) {
    let uniform = uniforms[name]
    let u

    if (prefix) {
      name = prefix + "." + name
    }

    // Single float
    if (typeof uniform === "number") {
      parsed.push({
        type: "float",
        method: "1f",
        name,
        value: uniform,
      })
    }
    // Array: vector, array of floats, array of textures, or array of structs
    else if (Array.isArray(uniform)) {
      // Numeric values
      if (typeof uniform[0] === "number") {
        // float vectors (vec2, vec3, vec4)
        if (uniform.length === 1) {
          parsed.push({
            type: "float",
            method: "1f",
            name,
            value: uniform,
          })
        }
        // float vectors (vec2, vec3, vec4)
        else if (uniform.length >= 2 && uniform.length <= 4) {
          parsed.push({
            type: "vec" + uniform.length,
            method: uniform.length + "fv",
            name,
            value: uniform,
          })
        }
        // float array
        else if (uniform.length > 4) {
          parsed.push({
            type: "float[]",
            method: "1fv",
            name: name + "[0]",
            value: uniform,
          })
        }
        // TODO: assume matrix for (typeof == Float32Array && length == 16)?
      }
      // Array of textures
      else if (typeof uniform[0] === "string") {
        parsed.push({
          type: "sampler2D",
          method: "1i",
          name: name,
          value: uniform,
        })
      }
      // Array of arrays - but only arrays of vectors are allowed in this case
      else if (Array.isArray(uniform[0]) && typeof uniform[0][0] === "number") {
        // float vectors (vec2, vec3, vec4)
        if (uniform[0].length >= 2 && uniform[0].length <= 4) {
          // Set each vector in the array
          for (u = 0; u < uniform.length; u++) {
            parsed.push({
              type: "vec" + uniform[0].length,
              method: uniform[u].length + "fv",
              name: name + "[" + u + "]",
              value: uniform[u],
            })
          }
        }
        // else error?
      }
      // Array of structures
      else if (typeof uniform[0] === "object") {
        for (u = 0; u < uniform.length; u++) {
          // Set each struct in the array
          parsed.push(...parseUniforms(uniform[u], name + "[" + u + "]"))
        }
      }
    }
    // Boolean
    else if (typeof uniform === "boolean") {
      parsed.push({
        type: "bool",
        method: "1i",
        name,
        value: uniform,
      })
    }
    // Texture
    else if (typeof uniform === "string") {
      parsed.push({
        type: "sampler2D",
        method: "1i",
        name,
        value: uniform,
      })
    }
    // Structure
    else if (typeof uniform === "object") {
      // Set each field in the struct
      parsed.push(...parseUniforms(uniform, name))
    }
    // TODO: support other non-float types? (int, etc.)
  }
  return parsed
}
