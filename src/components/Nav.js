import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"

import { withContext } from "./ContextProvider"

import Icon from "./Icon"

const Container = styled.div`
  margin: ${rhythm(0.5)} 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const StyledLink = styled(Link)`
  max-width: 40vw;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Nav = ({ article, context }) => {
  const { page = {} } = context
  const { previous, next } = page

  return (
    <Container>
      {previous && (
        <StyledLink to={previous.fields.url}>
          <Icon type="s" id="arrow-left" />
          <span>{previous.fields.title}</span>
        </StyledLink>
      )}
      {next && (
        <StyledLink to={next.fields.url}>
          <span>{next.fields.title}</span>
          <Icon type="s" id="arrow-right" />
        </StyledLink>
      )}
    </Container>
  )
}

export default withContext(Nav)
