import React from "react"
import Layout from "../components/Layout"
import ContextProvider from "../components/ContextProvider"
import SEO from "../components/SEO"

import deep from "deep-get-set"

const concatTitle = (title, text) => {
  if (text === undefined) return title
  if (title.length > 0) {
    title += " - " + text
  } else {
    title = text
  }
  return title
}

const concatDesc = (description, text) => {
  if (text === undefined) return description
  if (description.length > 0) {
    description += " " + text
  } else {
    description = text
  }
  return description
}


export default ({ element, props }) => {
  const context = {}
  context.location = props.location
  context.data = props.data
  context.page = props.pageContext
  context.site = deep(props, "data.site.siteMetadata")
  context.siteTitle = deep(props, "data.site.siteMetadata.title")
  context.post = deep(props, "data.markdownRemark")
  context.frontmatter = deep(props, "data.markdownRemark.frontmatter")
  context.postTitle = deep(props, "data.markdownRemark.fields.title")
  if (!context.postTitle)
    context.postTitle = deep(props, "data.markdownRemark.frontmatter.title")
  context.fields = deep(props, "data.markdownRemark.fields")
  context.excerpt = deep(props, "data.markdownRemark.excerpt")

  let title = ""
  title = concatTitle(title, context.postTitle)
  title = concatTitle(title, context.title)

  let description = ""
  description = concatDesc(description, deep(props, "pageContext.description"))
  description = concatDesc(
    description,
    deep(props, "data.markdownRemark.fields.description")
  )
  return (
    <ContextProvider context={context}>
      <SEO
        title={title}
        lang="zh-CN"
        description={description}
        keywords={deep(props, "data.markdownRemark.fields.keywords")}
      />
      <Layout>{element}</Layout>
    </ContextProvider>
  )
}
