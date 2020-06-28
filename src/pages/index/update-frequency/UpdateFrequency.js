import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"

import moment from "moment"
import "moment/locale/zh-cn"

import { rhythm } from "../../../utils/typography"

import Cell from "./Cell"
import Column from "./Column"

const Container = styled.div`
  width: auto;
`

const CellsContainer = styled.div`
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: nowrap;
`

const Example = styled.div`
  margin-left: ${rhythm(1)};
  margin-top: ${rhythm(1)};
  width: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  flex-wrap: nowrap;
  * {
    margin: 0 ${rhythm(0.2)};
  }
`

const UpdateFrequency = ({ updates = [] }) => {
  const now = moment()
  const begin = moment().year(now.year() - 1)
  const weeks = now.clone().subtract(begin).get("weeks")
  // console.log("weeks", weeks)
  const findUpdate = m => {
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i]
      if (update.year === m.weekYear() && update.weekOfYear === m.weeks()) {
        // console.log("update", update)
        return { ...update, month: m.month() }
      }
    }
    // console.log("m", m.format("YYYY-MM-DD"), m.weekYear(), m.weeks())
    return {
      year: m.weekYear(),
      month: m.month(),
      weeksInYear: m.weeksInYear(),
      weekOfYear: m.weeks(),
      articles: [],
    }
  }

  const cells = []
  for (let i = 0; i < weeks; i++) {
    const it = now.clone().subtract(moment.duration(i, "weeks"))
    const found = findUpdate(it)
    cells.push(found)
  }
  const columns = []
  const findColumn = cell => {
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i]
      if (cell.month === column.month) {
        return column
      }
    }
    const column = {
      year: cell.year,
      month: cell.month,
      updates: [],
    }
    columns.push(column)
    return column
  }
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    const column = findColumn(cell)
    column.updates.push(cell)
  }

  // console.log("columns", columns)
  return (
    <Container>
      <h2>更新频次</h2>
      <CellsContainer>
        {columns.map((column, i) => <Column key={i} {...column} />).reverse()}
      </CellsContainer>
      <Example>
        更少
        <Cell update={{ articles: [] }} />
        <Cell update={{ articles: [false] }} />
        <Cell update={{ articles: [false, false] }} />
        <Cell update={{ articles: [false, false, false] }} />
        <Cell update={{ articles: [false, false, false, false] }} />
        更多
      </Example>
    </Container>
  )
}

export default UpdateFrequency
