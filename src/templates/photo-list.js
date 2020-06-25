import React from "react"
import { graphql } from "gatsby"

import List from "../components/photo-list/List"

const PhotoListTemplate = ({ location, pageContext, data }) => {
  const { title, currentPage, totalPage } = pageContext
  return (
    <div>
      <h1>
        {title}{" "}
        {currentPage !== undefined &&
          totalPage > 1 &&
          `(${currentPage} / ${totalPage})`}
      </h1>
      <List
        photos={data.allFile.edges.map(({ node }) => node)}
        context={{ ...pageContext, site: data.site }}
      />
    </div>
  )
}

export const pageQuery = graphql`
  query QueryPhotoList($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
    allFile(
      filter: { sourceInstanceName: { eq: "photos" } }
      skip: $skip
      limit: $limit
    ) {
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
            date
          }
          childImageSharp {
            fluid(
              maxWidth: 320
              background: "rgba(0,0,0,0.5)"
              toFormat: JPG
              fit: CONTAIN
            ) {
              aspectRatio
              src
              srcSet
              sizes
            }
          }
        }
      }
    }
  }
`

export default PhotoListTemplate
