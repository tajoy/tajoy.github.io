import React from "react"
import Item from "./Item"

import styled from "styled-components"
import theme from "styled-theming"
import { rhythm, scale } from "../../utils/typography"

import Pagination from "../Pagination"

const Container = styled.div`
  margin-bottom: ${rhythm(0.5)};
`

const List = ({ posts, context }) => {
  return (
    <Container>
      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/article-list" />
      )}
      {posts.map(post => (
        <Item key={post.fields.slug} context={context} {...post} />
      ))}
      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/article-list" />
      )}
    </Container>
  )
}

export default List
