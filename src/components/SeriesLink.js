import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"

const SeriesLink = ({ name, slug }) => {
  return (
    <Link to={`/series/${slug}/`} style={{ marginRight: rhythm(0.2) }}>
      {name}
    </Link>
  )
}

export default SeriesLink
