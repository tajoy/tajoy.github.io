import React from "react"
import Item from "./Item"

import styled from "styled-components"
import theme from "styled-theming"
import { rhythm, scale } from "../../utils/typography"

import Pagination from "../Pagination"

const Container = styled.div`
  margin-bottom: ${rhythm(0.5)};
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const List = ({ photos, context }) => {
  return (
    <Container>
      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/photo-list" />
      )}

      <ListContainer>
        {photos.map((photo, i) => (
          <Item key={i} context={context} photo={photo} />
        ))}
      </ListContainer>

      {context && context.currentPage && (
        <Pagination context={context} paginationPrefix="/photo-list" />
      )}
    </Container>
  )
}

export default List
