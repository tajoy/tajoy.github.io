import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"
import { rhythm } from "../utils/typography"

import UpdateFrequency from "./index/update-frequency/UpdateFrequency"
import Recently from "./index/recently/Recently"

const Container = styled.div`
  margin: ${rhythm(0.5)};
`

const Index = ({ data, location }) => {
  return (
    <Container>
      <h1>Tajoy's Blog</h1>
      <UpdateFrequency updates={data.updateFrequency.updates} />
      <Recently posts={data.allMarkdown.posts} />
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
    updateFrequency {
      updates {
        year
        weeksInYear
        weekOfYear
        articles
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
