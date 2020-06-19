const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query ShaderList {
    allShaders {
      shaders {
        id
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
    `${__dirname}/../../src/templates/shader-list.js`
  )

  // Create blog shaders page list.
  const totalCount = result.data.allShaders.shaders.length
  const numPages = Math.ceil(totalCount / PAGE_SIZE)

  Array.from({ length: numPages }).forEach((_, i) => {
    const url = `/shader-list/${i + 1}`
    createPage({
      path: url,
      component: template,
      context: {
        title: "Shader列表",
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
