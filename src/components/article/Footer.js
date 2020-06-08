import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import Comment from "./Comment"
import Taxonomy from "./Taxonomy"
import Nav from "./Nav"
import FeedbackReward from "./FeedbackReward"
import License from "./License"

const Container = styled.div``

const Footer = ({ article, context }) => {
  return (
    <Container>
      <FeedbackReward />
      <License article={article} context={context} />
      <Taxonomy article={article} />
      <Nav />
      <Comment article={article} />
    </Container>
  )
}

export default Footer
