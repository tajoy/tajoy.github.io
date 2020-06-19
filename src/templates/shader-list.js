import React from "react"
import { graphql } from "gatsby"

import List from "../components/shader-list/List"

const ShaderListTemplate = ({ location, pageContext, data }) => {
  const { title, currentPage, totalPage } = pageContext
  return (
    <div>
      <h1>
        {title}{" "}
        {currentPage !== undefined &&
          totalPage > 1 &&
          `(${currentPage} / ${totalPage})`}
      </h1>
      <List shaders={data.allShaders.shaders} context={pageContext} />
    </div>
  )
}

export const pageQuery = graphql`
  query QueryShaderList(
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
    allShaders(
      limit: $limit
      skip: $skip
    ) {
      shaders {
          id
          frag
          preview
          fields {
            title
            date
            description
            keywords
            showComments
            draft
            slug
            url
          }
      }
    }
  }
`

export default ShaderListTemplate
