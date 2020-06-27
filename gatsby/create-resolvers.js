const _ = require(`lodash`)
const subs = [
  require(`./create-resolvers/allMarkdown`),
  require(`./create-resolvers/updateFrequency`),
]

module.exports = ({ createResolvers }) => {
  const resolvers = _.merge({}, ...subs)
  createResolvers(resolvers)
}
