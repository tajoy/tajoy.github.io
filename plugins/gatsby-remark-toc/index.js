const visit = require("unist-util-visit")
const { v4: uuidv4 } = require("uuid")

function toc({ markdownAST }, pluginOptions) {
  function onHeading(node, index, parent) {
    const props = {
      "data-toc-id": uuidv4(),
    }
    if (node.data == undefined) node.data = {}
    node.data.hProperties = Object.assign({}, node.data.hProperties, props)
  }
  visit(markdownAST, "heading", onHeading)
}
module.exports = toc
