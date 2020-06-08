import React from "react"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"

const IconSpan = styled.span`
  margin: 0 ${rhythm(0.2)};
  color: ${props => props.color};
  font-size: ${props => (props.size !== undefined ? props.size : "inherit")};

  &:before {
    margin: 0 ${rhythm(0.2)};
  }
`

const Icon = ({ children, color = "inherit", size, type = "fa", id }) => {
  let className = type
  if (type === "fas" || type === "solid" || type === "s") {
    className = "fas"
  }
  if (type === "fab" || type === "brands" || type === "b") {
    className = "fab"
  }
  if (type === "far" || type === "regular" || type === "r") {
    className = "far"
  }
  if (id.startsWith("fa-")) {
    className = className + " " + id
  } else {
    className = className + " fa-" + id
  }
  return (
    <IconSpan className={className} size={size} color={color}>
      {children}
    </IconSpan>
  )
}

export default Icon
