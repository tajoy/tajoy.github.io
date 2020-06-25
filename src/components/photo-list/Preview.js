import React from "react"
import { Link } from "gatsby"

import moment from "moment"

import styled from "styled-components"
import transition from "styled-transition-group"

import Axios from "axios"

import { rhythm, scale } from "../../utils/typography"
import { withSizes } from "../../utils/helpers"

import Icon from "../Icon"
import { blobToSrc, checkVisible } from "../../utils/helpers"

const axios = Axios.create()

const Container = styled.div`
  width: 320px;
  height: ${props => `${props.height}px`};
  margin: ${rhythm(0.5)};
`

const Canvas = styled.canvas`
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
`

const Image = transition.img`
  width: 320px;
  height: ${props => `${props.height}px`};
  margin: 0;
  padding: 0;

  &:exit {
    opacity: 0.01;
  }
  &:exit-active {
    opacity: 1;
    transition: 500ms ease-in;
  }
  &:enter {
    filter: blur(10px);
  }
  &:enter-active {
    filter: blur(0px);
    transition: 500ms ease-in;
  }

  :not(:first-child) {
    position: relative;
    top: ${props => `${-4 - props.height}px`};
  }

  :not(:last-child) {
    filter: blur(10px);
  }
`

class Preview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showImage: false,
      loaded: false,
      imageSrc: null,
      imageLoadProgress: 0,
    }
    this.containerRef = React.createRef()
  }

  addListener() {
    try {
      const container = document.getElementById("scrollContainer")
      if (!container) {
        setTimeout(addListener, 1)
        return
      }
      container.addEventListener("scroll", this.onScroll)
    } catch {}
  }

  onScroll = e => {
    if (checkVisible(this.containerRef.current)) {
      this.loadImage()
    }
  }

  loadImage() {
    if (this.state.loaded) return
    const { photo } = this.props
    const src = photo.childImageSharp.fluid.src
    const self = this
    axios
      .get(src, {
        onDownloadProgress: e => {
          // console.log("onDownloadProgress", e)
          self.setState({
            imageLoadProgress: e.loaded / e.total,
          })
        },
        responseType: "blob",
      })
      .then(async resp => {
        // console.log("resp", resp)
        if (resp.status >= 200 && resp.status < 300) {
          self.setState({
            loaded: true,
          })
          const src = blobToSrc(resp.data)
          if (src) {
            self.setState({
              showImage: true,
              imageSrc: blobToSrc(resp.data),
            })
          }
        }
      })
      .catch(e => console.error(e))
  }

  componentDidMount() {
    this.addListener()
    if (checkVisible(this.containerRef.current)) {
      this.loadImage()
    }
  }

  render() {
    const { photo } = this.props
    const { showImage, imageSrc } = this.state
    const { fields, childImageExt, childImageSharp } = photo
    const { title, description, slug } = fields
    const { metadata, smallImg } = childImageExt
    // console.log("smallImg", smallImg)
    // data:image/jpg;base64,
    // console.log("metadata", metadata)
    const imagePlaceholderSrc = `data:image/jpg;base64, ${smallImg.jpg}`
    const height = (320 * metadata.height) / metadata.width
    return (
      <Container height={height} ref={this.containerRef}>
        <Image
          in={showImage}
          timeout={500}
          height={height}
          src={imagePlaceholderSrc}
          alt={"tiny " + (title || description || slug)}
        />
        <Image
          unmountOnExit
          in={!showImage}
          timeout={500}
          height={height}
          src={imageSrc}
        />
      </Container>
    )
  }
}

export default withSizes(Preview)
