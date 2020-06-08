const queryAllMarkdownPages = `
  {
    allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
      edges {
        node {
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
          }
          excerpt
          frontmatter {
            title
            date
            category
            tags
            series
          }
        }
      }
    }
  }
`

const queryCategoryByName = `
  query queryCategoryByName($name: String ) {
    allCategory(
        limit: 1000
        filter: { name: { $eq: $name }}
      ) {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
    }
  }
`

const queryTagByName = `
  query queryTagByName($name: String ) {
    allTag(
        limit: 1000
        filter: { name: { $eq: $name }}
      ) {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
    }
  }
`

const querySeriesByName = `
  query querySeriesByName($name: String ) {
    allSeries(
        limit: 1000
        filter: { name: { $eq: $name }}
      ) {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
    }
  }
`

const queryAllCategories = `
  query AllCategories {
    allCategory {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
  }
`

const queryAllTags = `
  query AllTags {
    allTag {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
  }
`

const queryAllSeries = `
  query allSeries {
    allSeries {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
  }
`


module.exports = {
  queryAllMarkdownPages,
  queryCategoryByName,
  queryTagByName,
  querySeriesByName,
  queryAllCategories,
  queryAllTags,
  queryAllSeries,
}