import React from "react"
import { Link } from "gatsby"
import { v4 as uuidv4 } from "uuid"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import Taxonomy from "./Taxonomy"

const Header = ({ article, context }) => {
  return (
    <div>
      <h1 data-toc-id={uuidv4()}>{article.fields.title}</h1>
      <Taxonomy article={article} />
    </div>
  )
}

export default Header
