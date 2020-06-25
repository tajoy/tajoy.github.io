import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"


import moment from "moment"

import Comment from "./Comment"
import Nav from "./Nav"
import FeedbackReward from "./FeedbackReward"
import License from "./License"
import Icon from "./Icon"
import PhotoViewer from "./photo-viewer/PhotoViewer"

const Container = styled.div``

const Title = styled.h1``

const Description = styled.p``

const Subtitle = styled.div`
  margin-bottom: ${rhythm(1)};
`
const Pair = styled.div`
  white-space: nowrap;
`

const SEOKeywords = styled.div`
  display: none;
`

const Photo = ({ photo, context }) => {
  const {
    id,
    fields: { keywords, date, title, description, showComments = true },
  } = photo

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
      <PhotoViewer photo={photo} />
      <FeedbackReward />
      <License context={context} />
      <Nav />
      <Comment id={id} show={showComments} />
    </Container>
  )
}

export default Photo
