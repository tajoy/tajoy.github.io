const path = require(`path`)
const _ = require(`lodash`)
const toml = require("toml")
const glslify = require("glslify")
const genPreview = require("./generate-shader-preview")
const matter = require(`gray-matter`)

const DEFAULT_VERTEX = `
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

const DEFAULT_FRAGMENT = `
#ifdef GL_ES
precision mediump float;
#endif
varying vec2 v_texcoord;
void main(){
    gl_FragColor = vec4(0.0);
}
`

module.exports = async function onCreateNode(
  {
    node,
    loadNodeContent,
    actions,
    createNodeId,
    reporter,
    createContentDigest,
    getNodesByType,
  },
  pluginOptions
) {
  const { createNode, createParentChildLink } = actions

  // We only care about markdown content.
  if (node.internal.type !== `File`) {
    return {}
  }
  if (!node.absolutePath || !node.absolutePath.endsWith(".frag")) {
    return {}
  }

  const content = await loadNodeContent(node)

  try {
    const shaderNode = {
      id: createNodeId(`${node.id} >>> Shader`),
      children: [],
      parent: node.id,
      internal: {
        content: content,
        type: `Shader`,
      },
      fileAbsolutePath: node.absolutePath,
      vert: DEFAULT_VERTEX,
      frag: DEFAULT_FRAGMENT,
    }
    shaderNode.internal.contentDigest = createContentDigest(shaderNode)

    const data = matter(content, {
      excerpt: false,
      engines: {
        toml: toml.parse.bind(toml),
      },
      language: "toml",
      delims: ["/***", "***/"],
    })

    if (data.data) {
      data.data = _.mapValues(data.data, value => {
        if (_.isDate(value)) {
          return value.toJSON()
        }
        return value
      })
    }

    shaderNode.frontmatter = data.data

    if (shaderNode.frontmatter.title) {
      shaderNode.title = shaderNode.frontmatter.title
    } else {
      shaderNode.title = path.basename(node.dir)
    }
    if (shaderNode.frontmatter.description) {
      shaderNode.description = shaderNode.frontmatter.description
    }

    shaderNode.frag = data.content

    const glslifyOpts = {
      basedir: node.dir,
      transform: ["glslify-hex", ...(shaderNode.frontmatter.transform || [])],
    }

    // GLSL Module:
    // - glsl-noise
    // - glsl-fog
    // - glsl-square-frame
    // - glsl-range
    // - glsl-luma
    // - glsl-dither
    // - glsl-hsv2rgb
    // - glsl-directional-light
    // - glsl-hemisphere-light
    // - glsl-point-light

    if (!_.isEmpty(shaderNode.vert)) {
      shaderNode.vert = glslify(shaderNode.vert, glslifyOpts)
    }
    if (!_.isEmpty(shaderNode.frag)) {
      shaderNode.frag = glslify(shaderNode.frag, glslifyOpts)
    }

    const preview = await genPreview(
      node.dir,
      shaderNode.vert,
      shaderNode.frag,
      {
        width: 128,
        height: 128,
      }
    )
    shaderNode.preview = `data:image/${preview.type};base64, `
    shaderNode.preview += `${preview.data.toString("base64")}`
    createNode(shaderNode)
    createParentChildLink({ parent: node, child: shaderNode })
    return shaderNode
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing Shader ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
      ${err.message ? err.message : err}\n
      ${err.stack ? err.stack : ""}`
    )
    return {} // eslint
  }
}
