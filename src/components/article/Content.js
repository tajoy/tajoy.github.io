import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"


const Container = styled.div`
`


const Content = ({ article, context }) => {
  return (
    <Container>
      <div dangerouslySetInnerHTML={{ __html: article.html }}></div>
    </Container>
  )
}

export default Content
