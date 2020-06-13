import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

import { withContext } from "../ContextProvider"

import Icon from "../Icon"
import TagLink from "../TagLink"
import CategoryLink from "../CategoryLink"
import SeriesLink from "../SeriesLink"

const Container = styled.div`
  margin: ${rhythm(0.5)} 0;
`

const TagsContainer = styled.strong`
  display: inline;
`
const CategoryContainer = styled.strong`
  display: inline;
`
const SeriesContainer = styled.strong`
  display: inline;
`

const Taxonomy = ({ article, context, showNav = false }) => {
  const { fields = {} } = article
  const { tags, category, series } = fields
  const { page = {} } = context

  // console.log("tags", tags, "category", category, "series", series)
  return (
    <Container>
      {category && (
        <CategoryContainer>
          <Icon type="r" id="folder" />
          <CategoryLink name={category.name} slug={category.slug} />
        </CategoryContainer>
      )}
      {tags && (
        <TagsContainer>
          <Icon type="s" id="tags" />
          {tags.map((tag, i) => (
            <TagLink key={i} name={tag.name} slug={tag.slug} />
          ))}
        </TagsContainer>
      )}
      {/* TODO: 列出同一系列的其他文章 */}
      {series && (
        <SeriesContainer>
          <Icon type="s" id="archive" />
          <SeriesLink name={series.name} slug={series.slug} />
        </SeriesContainer>
      )}
    </Container>
  )
}

export default withContext(Taxonomy)
