const path = require(`path`)

const { pathify } = require(`../utils`)

const QUERY = `
  query AllPhotos {
    allFile(filter: { sourceInstanceName: { eq: "photos" } }) {
      edges {
        node {
          id
          childImageExt {
            tinyImg
          }
          fields {
            slug
            url
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

  const template = path.resolve(`${__dirname}/../../src/templates/photo.js`)

  // Create blog posts pages.
  const photos = result.data.allFile.edges.map(({ node }) => node)

  photos.forEach((photo, index) => {
    const previous = index === photos.length - 1 ? null : photos[index + 1]
    const next = index === 0 ? null : photos[index - 1]
    // console.log("node", JSON.stringify(photo, null, 2))
    // getNodeAndSavePathDependency(post.id, post.fields.url)
    createPage({
      path: photo.fields.url,
      component: template,
      context: {
        id: photo.id,
        slug: photo.fields.slug,
        previous,
        next,
      },
    })
  })
}
