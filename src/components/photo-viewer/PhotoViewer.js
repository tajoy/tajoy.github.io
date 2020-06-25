import React from "react"
import styled from "styled-components"

import Axios from "axios"

import { blobToSrc } from "../../utils/helpers"
import Viewer from "./Viewer"

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
`

const FullViewerWrapper = styled.div`
  display: none;
  margin: 0;
  padding: 0;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const FullViewer = styled.img``

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
        onClick: () => {},
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

  render() {
    const { blur, width, height } = this.state
    return (
      <Container ref={this.containerRef}>
        <Canvas
          blur={blur}
          ref={this.canvasRef}
          width={width}
          height={height}
        />
        <FullViewerWrapper>
          <FullViewer />
        </FullViewerWrapper>
      </Container>
    )
  }
}

export default PhotoViewer
