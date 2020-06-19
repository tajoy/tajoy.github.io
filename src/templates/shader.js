import React from "react"
import { graphql } from "gatsby"

import Shader from "../components/Shader"

const ShaderTemplate = ({ location, pageContext, data }) => {
  const shader = data.allShader.edges[0].node
  return (
    <Shader shader={shader} context={{ ...pageContext, ...data, location }} />
  )
}

export default ShaderTemplate

export const pageQuery = graphql`
  query ShaderById($id: String!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    allShader(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          frag
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
  }
`
