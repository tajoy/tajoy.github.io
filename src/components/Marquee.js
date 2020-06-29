import React, { Component } from "react"
import PropTypes from "prop-types"

import styled from "styled-components"

import _, { isNull } from "lodash"
import { rhythm } from "../utils/typography"

const Container = styled.div`
  margin-top: ${rhythm(0.5)};
  position: relative;
  overflow: hidden;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  margin-bottom: ${props => `${props.bottom}px`};
  transition: ${props => `all ${props.duration}ms ease-in ${props.delay}ms`};
`

const ItemWrapper = styled.div`
  margin: 0;
  padding: 0;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};

  transition: ${props =>
    props.shouldAnimate
      ? `all ${props.duration}ms ease-in ${props.delay}ms`
      : `none`};

  position: absolute;
  top: ${props => `${props.top || 0}px`};
  left: 0;
  opacity: ${props => `${props.opacity}`};
  * {
    margin: 0;
    padding: 0;
  }
`

class Marquee extends Component {
  static propTypes = {
    interval: PropTypes.number,
    direction: PropTypes.oneOf(["up", "down"]),
    duration: PropTypes.number,
    delay: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.object),
  }
  static defaultProps = {
    /* 移动方向, 默认向上 */
    direction: "up",
    /* 移动间隔 */
    interval: 2000,
    /* 动画时长 */
    duration: 300,
    /* 动画延迟 */
    delay: 0,

    items: [],
  }
  constructor() {
    super()
    this.state = {
      /* 当前元素 */
      currentIndex: 0,
      shouldAnimate: false,
    }
  }

  get prevItem() {
    const { items } = this.props
    const currentIndex = this.state.currentIndex || 0
    return items[currentIndex - 1 < 0 ? items.length - 1 : currentIndex - 1]
  }

  get curItem() {
    const { items } = this.props
    const currentIndex = this.state.currentIndex || 0
    return items[currentIndex]
  }

  get nextItem() {
    const { items } = this.props
    const currentIndex = this.state.currentIndex || 0
    return items[(currentIndex + 1) % items.length]
  }

  componentDidMount() {
    if (this.props.items && this.props.items.length > 1) {
      this.triggerMoveTimer()
    }
  }

  triggerMoveTimer() {
    const { interval } = this.props
    const self = this
    if (this.moveTimer) {
      clearTimeout(this.moveTimer)
    }
    this.moveTimer = setTimeout(() => {
      self.moveIt()
    }, interval)
  }

  triggerNextTimer() {
    const { duration, delay } = this.props
    const self = this
    if (this.nextTimer) {
      clearTimeout(this.nextTimer)
    }
    this.nextTimer = setTimeout(() => {
      self.next()
    }, duration + delay)
  }

  moveIt() {
    // console.log("move it")
    this.setState({
      shouldAnimate: true,
    })
    this.triggerNextTimer()
  }

  next() {
    const { duration, direction, items } = this.props
    const currentIndex = this.state.currentIndex || 0
    const isUp = direction === "up"
    // console.log("next")
    this.setState({
      shouldAnimate: false,
      currentIndex: isUp
        ? (currentIndex + 1) % items.length
        : currentIndex - 1 < 0
        ? items.length - 1
        : currentIndex - 1,
    })
    this.triggerMoveTimer()
  }

  componentWillUnmount() {
    if (this.moveTimer) {
      clearTimeout(this.moveTimer)
    }
    if (this.nextTimer) {
      clearTimeout(this.nextTimer)
    }
  }

  render() {
    const { direction, interval, duration, delay } = this.props
    const { currentIndex, shouldAnimate } = this.state
    const isUp = direction === "up"
    const width = isUp
      ? Math.max(this.curItem.width, this.nextItem.width)
      : Math.max(this.curItem.width, this.prevItem.width)
    const height = isUp
      ? Math.max(this.curItem.height, this.nextItem.height)
      : Math.max(this.curItem.height, this.prevItem.height)
    return (
      <Container
        duration={duration}
        delay={delay}
        width={width}
        height={height}
        bottom={this.curItem.height - height}
      >
        <ItemWrapper
          shouldAnimate={shouldAnimate}
          duration={duration}
          delay={delay}
          top={
            shouldAnimate
              ? isUp
                ? -this.curItem.height
                : 0
              : -this.curItem.height
          }
          opacity={shouldAnimate ? (isUp ? 0 : 1) : 0}
        >
          {this.prevItem.Component()}
        </ItemWrapper>
        <ItemWrapper
          shouldAnimate={shouldAnimate}
          duration={duration}
          delay={delay}
          top={
            shouldAnimate
              ? isUp
                ? -this.curItem.height
                : this.curItem.height
              : 0
          }
          opacity={shouldAnimate ? 0 : 1}
        >
          {this.curItem.Component()}
        </ItemWrapper>
        <ItemWrapper
          shouldAnimate={shouldAnimate}
          duration={duration}
          delay={delay}
          top={
            shouldAnimate
              ? isUp
                ? 0
                : this.curItem.height
              : this.curItem.height
          }
          opacity={shouldAnimate ? (isUp ? 1 : 0) : 0}
        >
          {this.nextItem.Component()}
        </ItemWrapper>
      </Container>
    )
  }
}

export default Marquee
