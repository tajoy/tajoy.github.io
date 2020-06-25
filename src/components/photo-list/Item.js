import React from "react"
import { Link } from "gatsby"

import moment from "moment"

import styled from "styled-components"
import theme from "styled-theming"

import { rhythm, scale } from "../../utils/typography"
import { withSizes } from "../../utils/helpers"

import Icon from "../Icon"

import Preview from "./Preview"

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  font-style: italic;
  margin-bottom: ${rhythm(1)};
  @media screen and (max-width: 1024px) {
    font-size: ${rhythm(0.7)};
  }
  @media screen and (max-width: 480px) {
    font-size: 18px !important;
  }
`

const Pair = styled.div`
  white-space: nowrap;
`

const Item = ({ isDesktop, photo }) => {
  const { fields } = photo
  const { title, url, slug, description, date } = fields
  // console.log("fields", fields)
  return (
    <Container>
      <Link to={`${url}`}>
        <Preview photo={photo} />
      </Link>
      {title && <Title>{title}</Title>}
      <Subtitle>
        <Pair>
          {date && (
            <>
              <Icon type="r" id="calendar" />
              {moment(date).format("YYYY-MM-DD")}
            </>
          )}
        </Pair>
        <Pair>
          {description && (
            <>
              <Icon type="r" id="info-circle" />
              {description}
            </>
          )}
        </Pair>
      </Subtitle>
    </Container>
  )
}

export default withSizes(Item)
