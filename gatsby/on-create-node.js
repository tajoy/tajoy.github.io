function combineFn(funcs) {
  return context => {
    for (let i = 0; i < funcs.length; i++) {
      const fn = funcs[i]
      fn(context)
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
])
