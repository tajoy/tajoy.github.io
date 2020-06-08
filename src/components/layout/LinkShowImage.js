import React from "react"

import styled from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"


import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"


const ShowImageLayerContainer = transition.div`
  display: flex;
  z-index: 9999;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
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

const ShowImageLayer = ({
  src,
  alt = "show layer",
  visible,
  onClick = () => {},
}) => {
  return (
    <ShowImageLayerContainer
      in={visible}
      unmountOnExit
      timeout={500}
      onClick={onClick}
    >
      <img src={src} alt={alt} />
    </ShowImageLayerContainer>
  )
}

class LinkShowImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  render() {
    const { children, src, alt } = this.props
    const { visible } = this.state
    const onClick = () => {
      this.setState({ visible: !visible })
    }
    return (
      <a onClick={onClick}>
        {children}
        <ShowImageLayer
          src={src}
          alt={alt}
          onClick={onClick}
          visible={visible}
        />
      </a>
    )
  }
}

export default LinkShowImage