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

const TagsContainer = styled.div`
  display: inline;
`
const CategoryContainer = styled.div`
  display: inline;
`
const SeriesContainer = styled.div`
  display: inline;
`

const More = ({ article, context, showNav = false }) => {
  const { fields = {} } = article
  const { tags, category, series } = fields
  const { page = {} } = context

  return (
    <Container>
      {category && (
        <CategoryContainer>
          <Icon type="r" id="folder" />
          <CategoryLink category={category} />
        </CategoryContainer>
      )}
      {tags && (
        <TagsContainer>
          <Icon type="s" id="tags" />
          {tags.map((tag, i) => (
            <TagLink key={i} tag={tag} />
          ))}
        </TagsContainer>
      )}
      {/* TODO: 列出同一系列的其他文章 */}
      {series && (
        <SeriesContainer>
          <Icon type="s" id="archive" />
          <SeriesLink series={series} />
        </SeriesContainer>
      )}
    </Container>
  )
}

export default withContext(More)
