const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query AllArticle {
    allMarkdown {
      posts {
        fields {
          slug
          url
          title
        }
      }
    }
  }
`
module.exports = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(QUERY)
  if (result.errors) {
    throw result.errors
  }

  const template = path.resolve(`${__dirname}/../../src/templates/article.js`)

  // Create blog posts pages.
  const posts = result.data.allMarkdown.posts

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1]
    const next = index === 0 ? null : posts[index - 1]
    createPage({
      path: post.fields.url,
      component: template,
      context: {
        slug: post.fields.slug,
        previous,
        next,
      },
    })
  })
}
