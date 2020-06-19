const typeDefs = `
  type Shader implements Node @infer {
    id: ID!
    frag: String!
    fileAbsolutePath: String
    frontmatter: JSON
    preview: String
  }
  type allShaders {
    shaders: [Shader]
  }
`

module.exports = ({ actions }) => {
  const { createTypes } = actions
  createTypes(typeDefs)
}

module.exports.typeDefs = typeDefs
