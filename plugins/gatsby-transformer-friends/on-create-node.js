const path = require(`path`)
const _ = require(`lodash`)
const toml = require("toml")
const yaml = require("js-yaml")

module.exports = async function onCreateNode(
  {
    node,
    loadNodeContent,
    actions,
    createNodeId,
    reporter,
    createContentDigest,
    getNodesByType,
  },
  pluginOptions
) {
  const { createNode, createParentChildLink } = actions

  // We only care about markdown content.
  if (node.internal.type !== `File`) {
    return {}
  }
  if (node.sourceInstanceName !== pluginOptions.source) {
    return {}
  }
  if (!node.absolutePath) {
    return {}
  }
  if (!node.ext === ".json" && !node.ext === ".toml" && !node.ext === ".yaml") {
    return {}
  }

  try {
    const content = await loadNodeContent(node)
    let friendNode = {
      id: createNodeId(`${node.id} >>> Friend`),
      children: [],
      parent: node.id,
      internal: {
        content: content,
        type: `Friend`,
      },
    }
    friendNode.internal.contentDigest = createContentDigest(friendNode)

    let parsed = null
    if (node.ext === ".json") {
      parsed = JSON.parse(content)
    }
    if (node.ext === ".toml") {
      parsed = toml.parse(content)
    }
    if (node.ext === ".yaml") {
      parsed = yaml.safeLoad(content)
    }

    if (parsed === null) {
      throw `not support format: ${node.ext}`
    } else {
      if (_.isEmpty(parsed.name)) {
        throw `require field with "name"`
      }
      if (_.isEmpty(parsed.link)) {
        throw `require field with "link"`
      }
    }

    friendNode = _.merge({}, friendNode, parsed)

    createNode(friendNode)
    createParentChildLink({ parent: node, child: friendNode })
    return friendNode
  } catch (err) {
    reporter.panicOnBuild(
      `Error processing Friend ${
        node.absolutePath ? `file ${node.absolutePath}` : `in node ${node.id}`
      }:\n
      ${err.message || err}\n
      ${err.stack || ""}`
    )
    return {} // eslint
  }
}
