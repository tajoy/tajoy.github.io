module.exports = ({ stage, actions }, pluginOptions) => {
  const ssr = stage === `build-html` || stage === `build-javascript`
  actions.setBabelPlugin({
    name: `@babel/plugin-proposal-decorators`,
    stage,
    options: { legacy: true },
  })
  actions.setBabelPlugin({
    name: `@babel/plugin-proposal-class-properties`,
    stage,
    options: { loose: true },
  })
}
