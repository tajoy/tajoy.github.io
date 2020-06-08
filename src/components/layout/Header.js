import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"
import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"
import { withContext } from "../ContextProvider"

import Menu from "./Menu"

const Container = styled.div`
  background-color: #ffa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${rhythm(2)};
  border-bottom: ${theme("mode", {
    light: "1px solid #0004",
    dark: "1px solid #000",
  })};
  background-color: ${theme("mode", {
    light: LIGHT.HEADER.BG,
    dark: DARK.HEADER.BG,
  })};
`

const Header = ({ needMoveLeft }) => {
  return (
    <Container>
      <Menu needMoveLeft={needMoveLeft} />
    </Container>
  )
}

export default Header
