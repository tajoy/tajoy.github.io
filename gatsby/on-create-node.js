function combineFn(funcs) {
  return async context => {
    const { node, reporter } = context
    for (let i = 0; i < funcs.length; i++) {
      const fn = funcs[i]
      try {
        const ret = fn(context)
        if (ret instanceof Promise) {
          await ret
        }
      } catch (err) {
        console.dir(fn)
        reporter.panicOnBuild(
          `Error processing ${fn} ${
            node.absolutePath
              ? `file ${node.absolutePath}`
              : `in node <${node.internal.type}> ${node.id}`
          }:\n${err.message}\n${err.stack}`
        )
      }
    }
  }
}

module.exports = combineFn([
  require("./on-create-node/category"),
  require("./on-create-node/tags"),
  require("./on-create-node/series"),
  require("./on-create-node/markdown"),
  require("./on-create-node/keywords"),
  require("./on-create-node/site"),
  require("./on-create-node/shader"),
  require("./on-create-node/photos"),
])
