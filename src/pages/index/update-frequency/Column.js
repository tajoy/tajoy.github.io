import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"

import moment from "moment"
import "moment/locale/zh-cn"

import { rhythm } from "../../../utils/typography"

import theme from "styled-theming"

import { LIGHT, DARK } from "../../../theme/colors"

import Cell from "./Cell"

const Container = styled.div`
  margin: 0 2px;
  margin-top: ${rhythm(2)};
  width: 26px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const YearOrMonth = styled.div`
  margin: 0 8px;
  white-space: nowrap;
  height: ${rhythm(1)};
  text-align: center;
  transform: translateX(4px) rotate(-90deg);
`

const Column = ({ year, month, updates }) => {
  return (
    <Container>
      <YearOrMonth>
        {month === 0
          ? `${year} 年`
          : (month + 1) % 3 === 0 && month !== 11
          ? `${month + 1} 月`
          : ""}
      </YearOrMonth>
      {updates.map((update, i) => (
        <Cell key={i} update={update} />
      ))}
    </Container>
  )
}

export default Column
