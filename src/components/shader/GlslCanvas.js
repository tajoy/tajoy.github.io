import React from "react"
import { graphql } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import * as $ from "jquery"

// import GlslCanvas from "glslCanvas"

let GlslCanvas
try {
  GlslCanvas = require(`glslCanvas`).default
  // console.log("GlslCanvas", GlslCanvas)
} catch (error) {
  GlslCanvas = class GlslCanvas {}
  // console.log("error:", error)
}

const Container = styled.canvas`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: ${rhythm(1.0)} 0;
`

class GlslCanvasComp extends React.Component {
  constructor(props) {
    super(props)
    GlslCanvasComp.index += 1
    this.containerRef = React.createRef()
  }
  static index = 0

  id() {
    return `glsl-canvas-${GlslCanvasComp.index}`
  }

  update() {
    if (!this.glslCanvas) return
    const canvas = this.glslCanvas
    // console.log("canvas", canvas)
    canvas.forceRender = true
    canvas.render()
  }

  shouldComponentUpdate() {
    // console.log("componentDidUpdate", this.id())
    this.update()
    return true
  }

  componentDidMount() {
    try {
      if (!this.glslCanvas) {
        this.glslCanvas = new GlslCanvas(this.containerRef.current, {
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          backgroundColor: "rgba(1,1,1,1)",
        })
      }
      const { frag } = this.props
      const canvas = this.glslCanvas
      canvas.load(frag)
      canvas.forceRender = true
      canvas.render()
      for (const key in canvas.textures) {
        if (canvas.textures.hasOwnProperty(key)) {
          const texture = canvas.textures[key]
          texture.on("loaded", args => {
            setTimeout(() => {
              canvas.forceRender = true
              canvas.render()
            }, 100)
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { frag } = this.props
    return (
      <Container
        {...this.props}
        id={this.id()}
        frag={frag}
        ref={this.containerRef}
      />
    )
  }
}

export default GlslCanvasComp
