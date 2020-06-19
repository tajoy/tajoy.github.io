import React from "react"
import { Link } from "gatsby"

import moment from "moment"

import styled from "styled-components"
import theme from "styled-theming"

import { rhythm, scale } from "../../utils/typography"
import { withSizes } from "../../utils/helpers"

import Icon from "../Icon"

const Container = styled.div`
  padding: ${rhythm(1)};
  padding-top: ${rhythm(0.1)};

  &:hover {
    background-color: ${theme("mode", {
      light: "#00000005",
      dark: "#FFFFFF05",
    })} !important;
    @media screen and (max-width: 1024px) {
      background-color: #0000 !important;
    }
  }

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`

const SubContainer = styled.div``

const Preview = styled.img`
  width: ${rhythm(5.0)};
  height: ${rhythm(5.0)};
`

const Title = styled.div`
  font-size: ${rhythm(1.2)};
  margin: ${rhythm(1.2)} 0 ${rhythm(0.4)} 0;
  @media screen and (max-width: 1024px) {
    font-size: ${rhythm(0.9)};
  }
  @media screen and (max-width: 480px) {
    font-size: 18px !important;
  }
`

const Subtitle = styled.div`
  margin-bottom: ${rhythm(1)};
`
const Pair = styled.div`
  white-space: nowrap;
`

const Item = ({ fields, preview, isDesktop }) => {
  const title = fields.title || fields.slug
  return (
    <Container>
      <SubContainer>
        <Preview src={preview} alt={title} />
      </SubContainer>
      <SubContainer>
        <Title>
          <Link to={`${fields.url}`}>{title}</Link>
        </Title>
        <Subtitle>
          <Pair>
            {fields.date && <Icon type="r" id="calendar" />}
            {fields.date && moment(fields.date).format("YYYY-MM-DD")}
          </Pair>
        </Subtitle>
      </SubContainer>
    </Container>
  )
}

export default withSizes(Item)
