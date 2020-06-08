import React from "react"
import { graphql } from "gatsby"

import List from "../components/article-list/List"

const ArticleListTemplate = ({ location, pageContext, data }) => {
  const { title, currentPage, totalPage } = pageContext
  return (
    <div>
      <h1>
        {title}{" "}
        {currentPage !== undefined &&
          totalPage > 1 &&
          `(${currentPage} / ${totalPage})`}
      </h1>
      <List posts={data.allMarkdown.posts} context={pageContext} />
    </div>
  )
}

export const pageQuery = graphql`
  query QueryArticleList(
    $tag: String
    $category: String
    $series: String
    $skip: Int!
    $limit: Int!
  ) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    allMarkdown(
      tag: $tag
      category: $category
      series: $series
      limit: $limit
      skip: $skip
    ) {
      posts {
        fields {
          slug
          url
          title
          date
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
          description
          keywords
          draft
          showComments
        }
        timeToRead
        cnWordCount
        excerpt
      }
    }
  }
`

export default ArticleListTemplate
