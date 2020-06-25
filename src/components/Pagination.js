import React from "react"
import { Link, navigate } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"
import { rhythm, scale } from "../utils/typography"
import { LIGHT, DARK } from "../theme/colors"

import Icon from "./Icon"

const Container = styled.div`
  display: ${props => (props.show ? "flex" : "none")};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Base = styled.div`
  font-size: ${rhythm(0.8)};
  margin: 0 ${rhythm(0.2)};

  color: ${props =>
    props.disable
      ? "#7777"
      : theme("mode", {
          light: LIGHT.LINK.FG,
          dark: DARK.LINK.FG,
        })};
  cursor: ${props => (props.disable ? "not-allowed" : "pointer")};
  box-shadow: none;

  :hover {
    color: ${props =>
      props.disable
        ? "#7777"
        : theme("mode", {
            light: LIGHT.LINK.HOVER,
            dark: DARK.LINK.HOVER,
          })};
    box-shadow: ${props =>
      props.disable ? "none" : "0px 1px 0px 0px currentColor !important"};
  }
`

const NavLink = ({ onClick, to, disable, current, children }) => {
  const _onClick = () => {
    if (disable) return
    navigate(to)
    // TODO: scroll to top
  }
  return (
    <Base disable={disable} onClick={_onClick}>
      {current && "<"}
      {children}
      {current && ">"}
    </Base>
  )
}

const LeftSide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const CenterSide = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const RightSide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`

const Pagination = ({ context, paginationPrefix = "" }) => {
  const { total, currentPage, totalPage, pageSize } = context || {}
  const seq = [1, 2, 3, 4, 5]
  const prevSeq = seq
    .map(n => currentPage - n)
    .filter(n => n > 0)
    .reverse()
  const nextSeq = seq.map(n => currentPage + n).filter(n => n <= totalPage)

  return (
    <Container show={currentPage !== undefined && totalPage > 1}>
      <LeftSide>
        <NavLink disable={currentPage <= 1} to={`${paginationPrefix}/1`}>
          <Icon type="s" id="angle-double-left" />
        </NavLink>
        <NavLink
          disable={currentPage <= 1}
          to={`${paginationPrefix}/${currentPage - 1}`}
        >
          <Icon type="s" id="angle-left" />
        </NavLink>
      </LeftSide>
      <CenterSide>
        {currentPage > 6 && <NavLink disable>...</NavLink>}
        {prevSeq.map(i => (
          <NavLink key={i} disable={false} to={`${paginationPrefix}/${i}`}>
            {i}
          </NavLink>
        ))}
        <NavLink disable current>
          {currentPage}
        </NavLink>
        {nextSeq.map(i => (
          <NavLink key={i} disable={false} to={`${paginationPrefix}/${i}`}>
            {i}
          </NavLink>
        ))}
        {totalPage - currentPage > 6 && <NavLink disable>...</NavLink>}
      </CenterSide>
      <RightSide>
        <NavLink
          disable={currentPage >= totalPage}
          to={`${paginationPrefix}/${currentPage + 1}`}
        >
          <Icon type="s" id="angle-right" />
        </NavLink>
        <NavLink
          disable={currentPage >= totalPage}
          to={`${paginationPrefix}/${totalPage}`}
        >
          <Icon type="s" id="angle-double-right" />
        </NavLink>
      </RightSide>
    </Container>
  )
}

export default Pagination
