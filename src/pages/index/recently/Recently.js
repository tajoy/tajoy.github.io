import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"
import { rhythm, scale } from "../../../utils/typography"

import Item from "./Item"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${rhythm(1)} 0;
  h2 {
    margin: ${rhythm(1)} 0;
  }
`

const StyledLink = styled(Link)`
  margin: ${rhythm(1)} auto;
  font-size: ${rhythm(0.8)};
  text-align: center;
  @media screen and (max-width: 1024px) {
    font-size: ${rhythm(0.9)};
  }
  @media screen and (max-width: 480px) {
    font-size: 18px !important;
  }
`

const Recently = ({ posts = [], context }) => {
  return (
    <Container>
      <h2>最近发布</h2>
      {posts.map((post, i) => (
        <Item key={i} context={context} {...post} />
      ))}
      <StyledLink to="/article-list/1">查看更多...</StyledLink>
    </Container>
  )
}

export default Recently
