import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"

import Header from "./article/Header"
import Content from "./article/Content"
import Footer from "./article/Footer"

const Container = styled.div``

const SEOKeywords = styled.div`
  display: none;
`

const Article = ({ article, context }) => {
  const {
    fields: { keywords },
  } = article

  return (
    <Container>
      <Header article={article} context={context} />
      <SEOKeywords>
        {keywords &&
          keywords.map(k => (
            <>
              <b>{k}</b>
              <strong>{k}</strong>
            </>
          ))}
      </SEOKeywords>
      <Content article={article} context={context} />
      <Footer article={article} context={context} />
    </Container>
  )
}

export default Article
