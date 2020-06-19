const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query AllShader {
    allShader {
      edges {
        node {
          id
          fileAbsolutePath
          fields {
            url
            slug
          }
        }
      }
    }
  }
`
module.exports = async ({
  graphql,
  actions: { createPage },
  getNodeAndSavePathDependency,
}) => {
  const result = await graphql(QUERY)
  if (result.errors) {
    throw result.errors
  }

  const template = path.resolve(`${__dirname}/../../src/templates/shader.js`)

  // Create blog posts pages.
  const shaders = result.data.allShader.edges.map(({ node }) => node)

  shaders.forEach((shader, index) => {
    const previous = index === shaders.length - 1 ? null : shaders[index + 1]
    const next = index === 0 ? null : shaders[index - 1]
    // getNodeAndSavePathDependency(post.id, post.fields.url)
    createPage({
      path: shader.fields.url,
      component: template,
      context: {
        id: shader.id,
        slug: shader.fields.slug,
        previous,
        next,
      },
    })
  })
}
