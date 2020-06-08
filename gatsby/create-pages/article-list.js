const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query ArticleList {
    allMarkdown {
      posts {
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

  const template = path.resolve(`${__dirname}/../../src/templates/article-list.js`)

  // Create blog articles page list.
  const totalCount = result.data.allMarkdown.posts.length
  const numPages = Math.ceil(totalCount / PAGE_SIZE)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: `/article-list/${i + 1}`,
      component: template,
      context: {
        title: "文章列表",
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
