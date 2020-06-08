const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY_SERIES = `
  query AllSeries {
    allSeries {
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
  query ArticleListBySeries( $series: String! ) {
    allMarkdown( series: $series ) {
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
  const series = await graphql(QUERY_SERIES)
  if (series.errors) {
    throw series.errors
  }

  const templateTaxonomy = path.resolve(
    `${__dirname}/../../src/templates/taxonomy-list.js`
  )

  createPage({
    path: `/series/`,
    component: templateTaxonomy,
    context: {
      title: `所有系列`,
      taxonomy: "series",
      taxonomyList: series.data.allSeries.edges.map(({ node }) => node),
    },
  })

  const templateList = path.resolve(
    `${__dirname}/../../src/templates/article-list.js`
  )
  await Promise.all(
    series.data.allSeries.edges.map(({ node }) =>
      (async () => {
        const result = await graphql(QUERY_ARTICLE, { series: node.name })
        if (result.errors) {
          throw result.errors
        }
        // Create blog articles page list.
        const totalCount = result.data.allMarkdown.posts.length
        const numPages = Math.ceil(totalCount / PAGE_SIZE)

        Array.from({ length: numPages }).forEach((_, i) => {
          if (i === 0) {
            createPage({
              path: `/series/${node.slug}/`,
              component: templateList,
              context: {
                title: `系列: ${node.name}`,
                paginationPrefix: `/series/${node.slug}`,
                series: node.name,
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
            path: `/series/${node.slug}/article-list/${i + 1}`,
            component: templateList,
            context: {
              title: `系列: ${node.name}`,
              paginationPrefix: `/series/${node.slug}`,
              series: node.name,
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
