import React from "react"

import { Link } from "gatsby"

import styled from "styled-components"

import Header from "./article/Header"
import Content from "./article/Content"
import Footer from "./article/Footer"

const Container = styled.div``

const Article = ({ article, context }) => {
  return (
    <Container>
      <Header article={article} context={context} />
      <Content article={article} context={context} />
      <Footer article={article} context={context} />
    </Container>
  )
}

export default Article
