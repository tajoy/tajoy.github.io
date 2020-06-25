import React from "react"
import Photo from "../components/Photo"
import { graphql } from "gatsby"

const PhotoTemplate = ({ location, pageContext, data }) => {
  return (
    <Photo
      photo={data.allFile.edges[0].node}
      context={{ ...pageContext, ...data, location }}
    />
  )
}

export default PhotoTemplate

export const pageQuery = graphql`
  query PhotoBySlug($id: String!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    allFile(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          dir
          absolutePath
          publicURL
          childImageExt {
            metadata
            tinyImg
            smallImg
          }
          fields {
            slug
            url
          }
        }
      }
    }
  }
`
