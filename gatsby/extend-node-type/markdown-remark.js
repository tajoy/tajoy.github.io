const {
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLJSON,
} = require("gatsby/graphql")

const unified = require(`unified`)
const parse = require(`remark-parse`)
const stringify = require(`remark-stringify`)
const english = require(`retext-english`)
const remark2retext = require(`remark-retext`)
const visit = require(`unist-util-visit`)

const { cnWordCount } = require(`../utils`)

module.exports = ({
  type,
  basePath,
  getNode,
  getNodesByType,
  cache,
  getCache,
  reporter,
}) => {
  if (type.name !== `MarkdownRemark`) {
    return null
  }

  return {
    cnWordCount: {
      type: GraphQLInt,
      resolve(markdownNode) {
        let counts = {}
        const count = () => {
          return tree => {
            visit(tree, node => {
              counts[node.type] = (counts[node.type] || 0) + 1
            })
          }
        }
        unified()
          .use(parse)
          .use(remark2retext, unified().use(english).use(count))
          .use(stringify)
          .processSync(markdownNode.internal.content)
        return counts.WordNode + cnWordCount(markdownNode.internal.content)
      },
    },
  }
}
