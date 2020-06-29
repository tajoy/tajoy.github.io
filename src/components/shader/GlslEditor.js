import React from "react"
import { graphql } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import * as $ from "jquery"

// import GlslEditor from "glslEditor/build/glslEditor"
let GlslEditor
try {
  GlslEditor = require(`glslEditor/build/glslEditor`)
  // console.log("GlslEditor", GlslEditor)
} catch (error) {
  GlslEditor = class GlslEditor {}
  // console.log("error:", error)
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: ${rhythm(1.0)} 0;

  .ge_canvas_container {
    position: static !important;
    margin: ${rhythm(1.0)} 0;
  }

  .ge_editor {
    width: 100% !important;
  }
`

class GlslEditorComp extends React.Component {
  constructor(props) {
    super(props)
    GlslEditorComp.index += 1
    this.containerRef = React.createRef()
  }
  static index = 0

  id() {
    return `glsl-editor-${GlslEditorComp.index}`
  }

  update() {
    if (!this.glslEditor) return
    const shader = this.glslEditor.shader
    shader.requestRedraw()
    for (const key in shader.canvas.textures) {
      if (shader.canvas.textures.hasOwnProperty(key)) {
        const texture = shader.canvas.textures[key]
        texture.on("loaded", args => {
          setTimeout(() => {
            shader.requestRedraw()
          }, 100)
        })
      }
    }
  }

  shouldComponentUpdate() {
    // console.log("componentDidUpdate", this.id())
    this.update()
    return true
  }

  componentDidMount() {
    try {
      if (!this.glslEditor) {
        this.glslEditor = new GlslEditor(`#${this.id()}`, {
          canvas_size: this.containerRef.current.getBoundingClientRect().width,
          canvas_draggable: false,
          canvas_follow: false,
          theme: "monokai",
          multipleBuffers: true,
          watchHash: false,
          fileDrops: false,
          menu: false,
          autofocus: false,
        })
      }
      const { frag } = this.props
      this.glslEditor.setContent(frag)
      const shader = this.glslEditor.shader
      shader.requestRedraw()
      this.glslEditor.editor.on("change", function () {
        shader.requestRedraw()
      })
      for (const key in shader.canvas.textures) {
        if (shader.canvas.textures.hasOwnProperty(key)) {
          const texture = shader.canvas.textures[key]
          texture.on("loaded", args => {
            setTimeout(() => {
              shader.requestRedraw()
            }, 100)
          })
        }
      }
    } catch (error) {
      console.log("error:", error)
    }
  }

  render() {
    const { frag } = this.props
    return <Container id={this.id()} frag={frag} ref={this.containerRef} />
  }
}

export default GlslEditorComp
