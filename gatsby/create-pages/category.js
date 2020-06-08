const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY_CATEGORY = `
  query AllCategory {
    allCategory {
      edges {
        node {
          id
          name
          slug
          posts {
            id
            fields {
              slug
              url
            }
          }
        }
      }
    }
  }
`
const QUERY_ARTICLE = `
  query ArticleListByCategory( $category: String! ) {
    allMarkdown( category: $category ) {
      posts {
        id
      }
    }
  }
`
const PAGE_SIZE = 10

module.exports = async ({
  graphql,
  actions: { createPage, createRedirect },
}) => {
  const categories = await graphql(QUERY_CATEGORY)
  if (categories.errors) {
    throw categories.errors
  }

  const templateTaxonomy = path.resolve(
    `${__dirname}/../../src/templates/taxonomy-list.js`
  )

  createPage({
    path: `/category/`,
    component: templateTaxonomy,
    context: {
      title: `所有分类`,
      taxonomy: "category",
      taxonomyList: categories.data.allCategory.edges.map(({ node }) => node),
    },
  })

  const templateList = path.resolve(
    `${__dirname}/../../src/templates/article-list.js`
  )
  await Promise.all(
    categories.data.allCategory.edges.map(({ node }) =>
      (async () => {
        const result = await graphql(QUERY_ARTICLE, { category: node.name })
        if (result.errors) {
          throw result.errors
        }
        // Create blog articles page list.
        const totalCount = result.data.allMarkdown.posts.length
        const numPages = Math.ceil(totalCount / PAGE_SIZE)

        Array.from({ length: numPages }).forEach((_, i) => {
          if (i === 0) {
            createPage({
              path: `/category/${node.slug}/`,
              component: templateList,
              context: {
                title: `分类: ${node.name}`,
                paginationPrefix: `/category/${node.slug}`,
                category: node.name,
                total: totalCount,
                currentPage: i + 1,
                totalPage: numPages,
                pageSize: PAGE_SIZE,
                limit: PAGE_SIZE,
                skip: i * PAGE_SIZE,
              },
            })
          }
          createPage({
            path: `/category/${node.slug}/article-list/${i + 1}`,
            component: templateList,
            context: {
              title: `分类: ${node.name}`,
              paginationPrefix: `/category/${node.slug}`,
              category: node.name,
              total: totalCount,
              currentPage: i + 1,
              totalPage: numPages,
              pageSize: PAGE_SIZE,
              limit: PAGE_SIZE,
              skip: i * PAGE_SIZE,
            },
          })
        })
      })()
    )
  )
}
