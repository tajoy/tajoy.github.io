const typeDefs = `
  type Update {
    year: Int!
    weeksInYear: Int!
    weekOfYear: Int!
    articles: [JSON!]
  }
  type UpdateFrequency {
    updates: [Update!]
  }
`

module.exports = ({
  actions,
  schema,
  getNode,
  pathPrefix,
  getNodeAndSavePathDependency,
  reporter,
  cache,
}) => {
  const { createTypes } = actions
  createTypes(typeDefs)
}
