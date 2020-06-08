const typeDefs = `
  type Tag implements Node @infer {
    id: ID!
    name: String!
    slug: String!
    posts: [MarkdownRemark]
  }
  type Category implements Node @infer {
    id: ID!
    name: String!
    slug: String!
    posts: [MarkdownRemark]
  }
  type Series implements Node @infer {
    id: ID!
    name: String!
    slug: String!
    posts: [MarkdownRemark]
  }
  type allMarkdown {
    posts: [MarkdownRemark]
  }
  type TOCNode {
    id: ID!
    text: String!
    target: String!
    child: [TOCNode]
  }
`

module.exports = ({ actions }) => {
  const { createTypes } = actions
  createTypes(typeDefs)
}

module.exports.typeDefs = typeDefs
