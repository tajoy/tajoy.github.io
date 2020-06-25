const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query PhotoList {
    allFile(filter: { sourceInstanceName: { eq: "photos" } }) {
      edges {
        node {
          id
        }
      }
    }
  }
`
const PAGE_SIZE = 10

module.exports = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(QUERY)
  if (result.errors) {
    throw result.errors
  }

  const template = path.resolve(
    `${__dirname}/../../src/templates/photo-list.js`
  )

  // Create blog articles page list.
  const totalCount = result.data.allFile.edges.length
  const numPages = Math.ceil(totalCount / PAGE_SIZE)

  Array.from({ length: numPages }).forEach((_, i) => {
    const url = `/photo-list/${i + 1}`
    createPage({
      path: url,
      component: template,
      context: {
        title: "照片列表",
        total: totalCount,
        currentPage: i + 1,
        totalPage: numPages,
        pageSize: PAGE_SIZE,
        limit: PAGE_SIZE,
        skip: i * PAGE_SIZE,
      },
    })
  })
}
