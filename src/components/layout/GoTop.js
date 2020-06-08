import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"

import * as $ from "jquery"

import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"
import { withContext } from "../ContextProvider"

import Icon from "../Icon"

const Container = transition.div`
  max-width: ${rhythm(12)};
  order: 2;
  position: fixed;
  display: ${props => (props.show ? "block" : "none")};
  left: ${props => `${props.left}px`};
  bottom: ${rhythm(4)};
  padding-top: ${rhythm(1)};
  cursor: pointer;

  font-size: ${rhythm(4)};
  &:enter {
    display: block !important;
    opacity: 0.0001 !important;
  }
  &:enter-active {
    display: block !important;
    opacity: 1 !important;
    transition: 510ms ease-in;
  }
  &:exit {
    display: block !important;
    opacity: 1 !important;
  }
  &:exit-active {
    display: block !important;
    opacity: 0 !important;
    transition: 510ms ease-in;
  }
  @media screen and (max-width: 1024px) and (min-width: 480px) {
    display: none !important;
  }
`

const GoTop = ({ isExpand, left, show }) => {
  console.log("show", show)
  const onClick = e => {
    e.preventDefault()
    const $container = $("#scrollContainer")
    $container.animate({
      scrollTop: 0,
    })
  }
  return (
    <Container
      id="go-top"
      in={show}
      isExpand={isExpand}
      timeout={510}
      left={left}
      show={show}
      onClick={onClick}
    >
      <Icon type="s" id="arrow-alt-circle-up" />
    </Container>
  )
}

export default GoTop
