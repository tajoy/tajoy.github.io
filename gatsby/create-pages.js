function combineFn(funcs) {
  return async context => {
    await Promise.all(funcs.map(fn => fn(context)))
  }
}

module.exports = combineFn([
  require("./create-pages/article"),
  require("./create-pages/article-list"),
  require("./create-pages/category"),
  require("./create-pages/series"),
  require("./create-pages/tags"),
  require("./create-pages/shader"),
  require("./create-pages/shader-list"),
  require("./create-pages/photo"),
  require("./create-pages/photo-list"),
])