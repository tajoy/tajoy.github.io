import React from "react"
import Item from "./Item"

import styled from "styled-components"
import theme from "styled-theming"
import { rhythm, scale } from "../../utils/typography"

import Pagination from "../Pagination"

const Container = styled.div`
  margin-bottom: ${rhythm(0.5)};
`

const List = ({ shaders, context }) => {
  return (
    <Container>
      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/shader-list" />
      )}
      {shaders.map((shader, i) => (
        <Item key={i} context={context} {...shader} />
      ))}
      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/shader-list" />
      )}
    </Container>
  )
}

export default List
