import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"

import moment from "moment"

import GlslEditor from "./shader/GlslEditor"

import Comment from "./Comment"
import Nav from "./Nav"
import FeedbackReward from "./FeedbackReward"
import License from "./License"
import Icon from "./Icon"

const Container = styled.div``
const Title = styled.h1``

const Description = styled.p``

const SEOKeywords = styled.div`
  display: none;
`

const Subtitle = styled.div`
  margin-bottom: ${rhythm(1)};
`
const Pair = styled.div`
  white-space: nowrap;
`

const Shader = ({ shader, context }) => {
  const {
    id,
    frag,
    fields: { slug, title, date, description, keywords, showComments, draft },
  } = shader

  return (
    <Container>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      <Subtitle>
        <Pair>
          {date && <Icon type="r" id="calendar" />}
          {date && moment(date).format("YYYY-MM-DD")}
        </Pair>
      </Subtitle>
      <SEOKeywords>
        {keywords &&
          keywords.map((k, i) => (
            <div key={i}>
              <b>{k}</b>
              <strong>{k}</strong>
            </div>
          ))}
      </SEOKeywords>
      <GlslEditor frag={frag} name={title} />
      <FeedbackReward />
      <License context={context} />
      <Nav />
      <Comment show={showComments} title={title || slug} />
    </Container>
  )
}

export default Shader
