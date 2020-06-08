const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY_TAGS = `
  query AllTags {
    allTag {
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
  query ArticleListByTags( $tag: String! ) {
    allMarkdown( tag: $tag ) {
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
  const tags = await graphql(QUERY_TAGS)
  if (tags.errors) {
    throw tags.errors
  }

  const templateTaxonomy = path.resolve(
    `${__dirname}/../../src/templates/taxonomy-list.js`
  )

  createPage({
    path: `/tags/`,
    component: templateTaxonomy,
    context: {
      title: `所有标签`,
      taxonomy: "tag",
      taxonomyList: tags.data.allTag.edges.map(({ node }) => node),
    },
  })

  const templateList = path.resolve(
    `${__dirname}/../../src/templates/article-list.js`
  )
  await Promise.all(
    tags.data.allTag.edges.map(({ node }) =>
      (async () => {
        const result = await graphql(QUERY_ARTICLE, { tag: node.name })
        if (result.errors) {
          throw result.errors
        }
        // Create blog articles page list.
        const totalCount = result.data.allMarkdown.posts.length
        const numPages = Math.ceil(totalCount / PAGE_SIZE)

        Array.from({ length: numPages }).forEach((_, i) => {
          if (i === 0) {
            createPage({
              path: `/tags/${node.slug}/`,
              component: templateList,
              context: {
                title: `标签: ${node.name}`,
                paginationPrefix: `/tags/${node.slug}`,
                tag: node.name,
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
            path: `/tags/${node.slug}/article-list/${i + 1}`,
            component: templateList,
            context: {
              title: `标签: ${node.name}`,
              paginationPrefix: `/tags/${node.slug}`,
              tags: node.name,
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
