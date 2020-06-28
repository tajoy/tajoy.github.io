const typeDefs = `
  type Friend implements Node @infer {
    id: ID!
    name: String!
    link: String!
    headPic: String
    description: String
  }
`

module.exports = ({ actions }) => {
  const { createTypes } = actions
  createTypes(typeDefs)
}

module.exports.typeDefs = typeDefs
