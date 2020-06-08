import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"
import { rhythm } from "../utils/typography"

import List from "../components/article-list/List"

const Container = styled.div`
  margin: ${rhythm(0.5)};
`

const StyledLink = styled(Link)`
  margin: ${rhythm(1)};
  font-size: ${rhythm(1)};
  @media screen and (max-width: 1024px) {
    font-size: ${rhythm(0.9)};
  }
  @media screen and (max-width: 480px) {
    font-size: 18px !important;
  }
`

const Index = ({ data, location }) => {
  return (
    <Container>
      <h1>最近发布</h1>
      <List posts={data.allMarkdown.posts} />
      <StyledLink to="/article-list/1">查看更多...</StyledLink>
    </Container>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdown(limit: 5) {
      posts {
        id
        excerpt(pruneLength: 160)
        fields {
          slug
          url
          title
          date(formatString: "YYYY-MM-DD")
          description
          category {
            name
            slug
          }
          tags {
            name
            slug
          }
          series {
            name
            slug
          }
        }
      }
    }
  }
`
