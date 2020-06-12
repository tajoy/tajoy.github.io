import React from "react"
import Article from "../components/Article"
import { graphql } from "gatsby"

const ArticleTemplate = ({ location, pageContext, data }) => {
  return (
    <Article
      article={data.markdownRemark}
      context={{ ...pageContext, ...data, location }}
    />
  )
}

export default ArticleTemplate

export const pageQuery = graphql`
  query ArticleBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      htmlAst
      timeToRead
      cnWordCount
      excerpt
      
      frontmatter {
        tocMaxDepth
      }

      fields {
        title
        slug
        url
        date(formatString: "YYYY-MM-DD")
        description
        keywords
        draft
        showComments
        category {
          name
          slug
        }
        series {
          name
          slug
        }
        tags {
          name
          slug
        }
      }
    }
  }
`
