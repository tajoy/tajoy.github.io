import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"
import transition from "styled-transition-group"

import moment from "moment"
import "moment/locale/zh-cn"

import { rhythm } from "../../../utils/typography"

import theme from "styled-theming"

import { LIGHT, DARK } from "../../../theme/colors"

const Container = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${props =>
    theme("mode", {
      light: LIGHT.UPDATE.FREQUENCY[Math.min(props.update.articles.length, 4)],
      dark: DARK.UPDATE.FREQUENCY[Math.min(props.update.articles.length, 4)],
    })};
  border-radius: 4px;
  border: 1px solid #0006;
  margin: 2px;
`

const HoverPopup = transition.div`
  position: relative;
  z-index: 999;
  pointer-events: none;
  width: ${rhythm(6)};

  transform: translate(-45%, -100%);

  &:enter {
    opacity: 0.01;
  }
  &:enter-active {
    opacity: 1;
    transition: 500ms ease-in;
  }
  &:exit {
    opacity: 1;
  }
  &:exit-active {
    opacity: 0.01;
    transition: 500ms ease-out;
  }
`
const Content = styled.div`
  width: ${rhythm(6)};
  background-color: white;
  border: 1px solid #666;
  z-index: 20;

  h3 {
    margin: ${rhythm(0.1)};
    padding: 0;
    color: black !important;
    font-size: ${rhythm(0.5)} !important;
    text-shadow: none !important;
  }
  p {
    margin: ${rhythm(0.1)};
    margin-top: ${rhythm(0.3)};
    margin-left: ${rhythm(0.5)};
    padding: 0;
    color: black;
    font-size: ${rhythm(0.5)} !important;
  }
`

const Corner = styled.div`
  position: relative;
  margin-top: ${rhythm(-0.5)};
  width: ${rhythm(0.8)};
  height: ${rhythm(0.8)};
  background-color: white;
  border: 1px solid #666;
  transform: translate(${rhythm(2.65)}, ${rhythm(-0.05)}) rotate(-45deg);
  z-index: -20;
`

class Cell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPopup: false,
    }
  }

  setShowPopup = show => {
    const self = this
    return e => {
      self.setState({ showPopup: show })
    }
  }

  render() {
    const { showPopup } = this.state
    const { update } = this.props
    console.log("update", update)
    let popup = null
    if (update.articles && update.articles[0] && update.articles[0]) {
      const week = moment().year(update.year).week(update.weekOfYear - 1).day(0)
      const begin = week.clone().day(0).format("ll")
      const end = week.clone().day(6).format("ll")
      popup = (
        <HoverPopup in={showPopup} unmountOnExit timeout={500}>
          <Content>
            <h3>日期:</h3>
            <p>{begin}</p>
            <p> - {end}</p>
            <h3>发布文章:</h3>
            {update.articles.map((article, i) => (
              <p key={i}>{article.title}</p>
            ))}
          </Content>
          <Corner />
        </HoverPopup>
      )
    }
    return (
      <Container
        update={update}
        onMouseEnter={this.setShowPopup(true)}
        onMouseLeave={this.setShowPopup(false)}
      >
        {popup}
      </Container>
    )
  }
}

export default Cell
