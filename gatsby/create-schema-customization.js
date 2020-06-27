const subs = [
  require(`./create-schema-customization/blog`),
  require(`./create-schema-customization/image-ext`),
  require(`./create-schema-customization/update-frequency`),
]

module.exports = context => {
  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i]
    sub(context)
  }
}
