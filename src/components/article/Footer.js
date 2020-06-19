import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import Comment from "../Comment"
import Nav from "../Nav"
import FeedbackReward from "../FeedbackReward"
import License from "../License"

import Taxonomy from "./Taxonomy"


const Container = styled.div``

const Footer = ({ article, context }) => {
  const { id, fields = {} } = article
  const { showComments = true } = fields
  return (
    <Container>
      <FeedbackReward />
      <License context={context} />
      <Taxonomy article={article} />
      <Nav />
      <Comment id={id} show={showComments} />
    </Container>
  )
}

export default Footer
