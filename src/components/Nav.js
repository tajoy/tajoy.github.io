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

const Image = styled.img`
  width: 60px;
  height: auto;
  margin: 0;
`

const Nav = ({ article, context }) => {
  const { page = {} } = context
  const { previous, next } = page
  return (
    <Container>
      {previous && (
        <StyledLink to={previous.fields.url}>
          <Icon type="s" id="arrow-left" />
          {previous.fields.title && <span>{previous.fields.title}</span>}
          {previous.childImageExt && previous.childImageExt.tinyImg && (
            <Image
              alt="previous photo"
              src={`data:image/jpg;base64, ${previous.childImageExt.tinyImg.jpg}`}
            />
          )}
        </StyledLink>
      ) || <div></div>}
      {next && (
        <StyledLink to={next.fields.url}>
          {next.fields.title && <span>{next.fields.title}</span>}
          {next.childImageExt && next.childImageExt.tinyImg && (
            <Image
              alt="next photo"
              src={`data:image/jpg;base64, ${next.childImageExt.tinyImg.jpg}`}
            />
          )}
          <Icon type="s" id="arrow-right" />
        </StyledLink>
      )}
    </Container>
  )
}

export default withContext(Nav)
