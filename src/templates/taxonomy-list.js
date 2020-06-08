import React from "react"
import { graphql, Link } from "gatsby"

import Counter from "../components/Counter"

import styled from "styled-components"

import { rhythm, scale } from "../utils/typography"

const Container = styled.div`
  margin: ${rhythm(0.1)};
`

const TaxonomyList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const TaxonomyItemContainer = styled.div`
  margin: ${rhythm(0.2)};
  min-width: ${rhythm(7)};
`

const TaxonomyItem = ({ prefix, name, slug, count }) => {
  return (
    <TaxonomyItemContainer>
      <Link to={`/${prefix}/${slug}`}>
        {name}
        <Counter>{count}</Counter>
      </Link>
    </TaxonomyItemContainer>
  )
}

const TaxonomyListTemplate = ({ location, pageContext, data }) => {
  const { title, taxonomy, taxonomyList } = pageContext
  return (
    <Container>
      <h1>{title}</h1>
      <TaxonomyList>
        {taxonomyList.map(item => (
          <TaxonomyItem
            key={item.slug}
            prefix={taxonomy}
            name={item.name}
            slug={item.slug}
            count={item.posts.length}
          />
        ))}
      </TaxonomyList>
    </Container>
  )
}

export default TaxonomyListTemplate


export const pageQuery = graphql`
  query queryTaxonomyList {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
  }
`