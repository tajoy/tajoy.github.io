import React from "react"
import { Link } from "gatsby"

import moment from "moment"

import styled from "styled-components"
import theme from "styled-theming"

import { rhythm, scale } from "../../../utils/typography"
import { withSizes } from "../../../utils/helpers"

import Icon from "../../../components/Icon"
import TagLink from "../../../components/TagLink"
import CategoryLink from "../../../components/CategoryLink"
import SeriesLink from "../../../components/SeriesLink"

const Container = styled.div`
  padding: 0;
  margin: 0;

  &:hover {
    background-color: ${theme("mode", {
      light: "#00000005",
      dark: "#FFFFFF05",
    })} !important;
    @media screen and (max-width: 1024px) {
      background-color: #0000 !important;
    }
  }
`

const Title = styled.div`
  font-size: ${rhythm(0.8)};
  margin: ${rhythm(0.8)} 0 ${rhythm(0.4)} 0;
  @media screen and (max-width: 1024px) {
    font-size: ${rhythm(0.9)};
  }
  @media screen and (max-width: 480px) {
    font-size: 18px !important;
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const Pair = styled.div`
  white-space: nowrap;
`

const Item = ({ fields = {}, excerpt, isDesktop }) => {
  const title = fields.title || fields.slug

  return (
    <Container>
      <Title>
        <Link to={`${fields.url}`}>{title}</Link>
        <Pair>
          {fields.date && <Icon type="r" id="calendar" />}
          {fields.date && moment(fields.date).format("YYYY-MM-DD")}
        </Pair>
      </Title>
    </Container>
  )
}

export default withSizes(Item)
