import React from "react"

import styled from "styled-components"

import theme from "styled-theming"
import { LIGHT, DARK } from "../theme/colors"
import { rhythm, scale } from "../utils/typography"


const Counter = styled.span`
  display: ${props => (props.show === false ? "none" : "inline")};
  color: ${theme("mode", {
    light: LIGHT.COUNT.FG,
    dark: DARK.COUNT.FG,
  })};
  background-color: ${theme("mode", {
    light: LIGHT.COUNT.BG,
    dark: DARK.COUNT.BG,
  })};
  border-radius: 20%;
  margin-left: 5px;
  font-size: ${rhythm(0.5)};
  text-align: center;
  padding: 0 2px;
`


export default Counter