import React from "react"
import styled from "styled-components"
import transition from "styled-transition-group"

import Axios from "axios"

import { blobToSrc } from "../../utils/helpers"
import Viewer from "./Viewer"
import ExifList from "./ExifList"

const axios = Axios.create()
const Container = styled.div`
  width: 100%;
`

const Canvas = styled.canvas`
  margin: 0;
  padding: 0;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  filter: ${props => `blur(${props.blur}px)`};
  transition: filter 500ms ease-in;

  cursor: ${props => (props.blur > 0.1 ? "unset" : "pointer")};
`

const FullViewerWrapper = transition.div`

  margin: 0;
  padding: 0;

  z-index: 999999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  transition: opacity 1s;
  justify-content: center;
  align-items: center;
  background-color: #000a;

  &:enter {
    opacity: 0.01;
  }
  &:enter-active {
    opacity: 1;
    transition: 500ms ease-in;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0.01;
    transition: 500ms ease-out;
  }
`

const FullViewer = styled.img`
  width: auto;
  height: auto;
  max-width: 95%;
  max-height: 95%;
`

class PhotoViewer extends React.Component {
  constructor(props) {
    super(props)
    this.containerRef = React.createRef()
    this.canvasRef = React.createRef()
    this.state = {
      width: null,
      height: null,
      imageSrc: null,
      loaded: false,
      progress: 0.0,
      blur: 10,
      showFullViewer: false,
    }
  }

  get container() {
    return this.containerRef.current
  }

  get canvas() {
    return this.canvasRef.current
  }

  loadImage() {
    const { photo } = this.props
    const self = this
    const CancelToken = Axios.CancelToken
    const source = CancelToken.source()
    if (this.source) {
      this.source.cancel("取消上次请求")
    }
    this.source = source
    axios
      .get(photo.publicURL, {
        onDownloadProgress: e => {
          self.onProgress((100 * e.loaded) / e.total)
        },
        responseType: "blob",
        cancelToken: source.token,
      })
      .then(async resp => {
        this.source = null
        // console.log("resp", resp)
        if (resp.status >= 200 && resp.status < 300) {
          self.setState({
            loaded: true,
          })
          const src = blobToSrc(resp.data)
          if (src) {
            self.setState({
              imageSrc: src,
            })
            if (this.viewer) {
              const image = new Image()
              image.src = src
              image.onload = () => {
                this.viewer.setPhotoImage(image)
              }
            }
          }
        }
      })
      .catch(e => {
        if (e.message === "取消上次请求") return
        console.error(e)
      })
  }

  onProgress(progress) {
    this.setState({
      progress,
    })
    if (this.viewer) {
      this.viewer.setProgress(progress)
    }
  }

  update() {
    const self = this
    this.loadImage()
    const { width } = this.containerRef.current.getBoundingClientRect()
    const { photo } = this.props
    const { childImageExt } = photo
    const { metadata, tinyImg, smallImg } = childImageExt
    const height = (width * metadata.height) / metadata.width
    // console.log("tinyImg", tinyImg)
    // console.log("size", { width, height })
    // const pixels = Uint8Array.from(new Buffer(tinyImg.raw, "base64"))
    // console.log("pixels", pixels)
    if (this.viewer) {
      this.viewer.width = width
      this.viewer.height = height
      this.viewer.tinyImg = tinyImg
      this.viewer.smallImg = smallImg
    } else {
      this.viewer = new Viewer({
        canvas: this.canvasRef.current,
        width,
        height,
        tinyImg,
        smallImg,
        changeBlur: blur =>
          self.setState({
            blur,
          }),
      })
    }
  }

  componentDidMount() {
    this.update()
    const { width } = this.containerRef.current.getBoundingClientRect()
    const { photo } = this.props
    const { childImageExt } = photo
    const { metadata } = childImageExt
    const height = (width * metadata.height) / metadata.width
    this.setState({
      width,
      height,
    })
  }
  componentDidUpdate() {
    if (this.lastPhotoId !== this.props.photo.id) {
      this.update()
    }
    this.lastPhotoId = this.props.photo.id
  }

  toggleFullViewer = () => {
    const { imageSrc, showFullViewer } = this.state
    if (!showFullViewer && !imageSrc) {
      return
    }
    this.setState({
      showFullViewer: !showFullViewer,
    })
  }

  render() {
    const { photo } = this.props
    const { blur, width, height, showFullViewer, imageSrc } = this.state
    return (
      <Container ref={this.containerRef}>
        <Canvas
          blur={blur}
          ref={this.canvasRef}
          width={width}
          height={height}
          onClick={this.toggleFullViewer}
        />
        <ExifList photo={photo} />
        <FullViewerWrapper
          in={showFullViewer}
          unmountOnExit
          timeout={500}
          onClick={this.toggleFullViewer}
        >
          <FullViewer src={imageSrc} />
        </FullViewerWrapper>
      </Container>
    )
  }
}

export default PhotoViewer
