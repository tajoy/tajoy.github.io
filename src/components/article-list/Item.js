import React from "react"
import { Link } from "gatsby"

import moment from "moment"

import styled from "styled-components"
import theme from "styled-theming"

import { rhythm, scale } from "../../utils/typography"
import { withSizes } from "../../utils/helpers"

import Icon from "../Icon"
import TagLink from "../TagLink"
import CategoryLink from "../CategoryLink"
import SeriesLink from "../SeriesLink"

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

const Excerpt = styled.div`
  font-size: ${rhythm(0.5)};
  font-style: italic;
`

const Subtitle = styled.div`
  margin-bottom: ${rhythm(1)};
`
const Pair = styled.div`
  white-space: nowrap;
`

const Item = ({ fields, excerpt, isDesktop }) => {
  const title = fields.title || fields.slug

  return (
    <Container>
      <Title>
        <Link to={`${fields.url}`}>{title}</Link>
      </Title>
      <Subtitle>
        <Pair>
          {fields.date && <Icon type="r" id="calendar" />}
          {fields.date && moment(fields.date).format("YYYY-MM-DD")}
        </Pair>

        <Pair>
          {fields.category && <Icon type="r" id="folder" />}
          {fields.category && <CategoryLink name={fields.category.name} slug={fields.category.slug} />}
        </Pair>

        <Pair>
          {fields.series && <Icon type="s" id="archive" />}
          {fields.series && (
            <SeriesLink name={fields.series.name} slug={fields.series.slug} />
          )}
        </Pair>

        <Pair>
          {fields.tags && <Icon type="s" id="tags" />}
          {fields.tags &&
            fields.tags.map(tag => (
              <TagLink key={tag.name} name={tag.name} slug={tag.slug} />
            ))}
        </Pair>
      </Subtitle>

      <Excerpt
        dangerouslySetInnerHTML={{
          __html: fields.description || excerpt || "...",
        }}
      />
    </Container>
  )
}

export default withSizes(Item)
