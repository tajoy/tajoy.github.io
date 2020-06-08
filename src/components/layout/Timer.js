import React from "react"

import moment from "moment"
import styled from "styled-components"

import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"

const TimerContainer = styled.div`
  display: inline-block;
  font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace !important;
`

const TimerSpan1 = styled.span`
  display: inline-block;
  margin-right: 2px;
  text-align: center;
`

const TimerSpan2 = styled.span`
  display: inline-block;
  min-width: 8px;
  margin-right: 2px;
  text-align: center;
`

class Timer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.t = setInterval(() => {
      this.forceUpdate()
    }, 1000)
  }

  render() {
    const { since } = this.props
    const now = new moment()
    const buildSince = moment(since, "YYYY/MM/DD HH:mm:SS ZZ")
    const durBuildSince = moment.duration(now.diff(buildSince))
    // const sep = durBuildSince.seconds() % 2 === 0 ? ":" : " "
    let years = durBuildSince.years()
    let months = durBuildSince.months()
    let days = durBuildSince.days()
    let hours = durBuildSince.hours()
    let minutes = durBuildSince.minutes()
    let seconds = durBuildSince.seconds()
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`
    // let timerText = ""
    // timerText += `${durBuildSince.years()}年 `
    // timerText += `${durBuildSince.months()}月 `
    // timerText += `${durBuildSince.days()}天 `
    // timerText += `${durBuildSince.hours()}${sep}`
    // timerText += `${durBuildSince.minutes()}${sep}`
    // timerText += `${durBuildSince.seconds()}`
    return (
      <TimerContainer>
        <TimerSpan1>{years}</TimerSpan1>
        <TimerSpan1>年</TimerSpan1>
        <TimerSpan1>{months}</TimerSpan1>
        <TimerSpan1>月</TimerSpan1>
        <TimerSpan1>{days}</TimerSpan1>
        <TimerSpan1>天</TimerSpan1>
        <TimerSpan2></TimerSpan2>
        <TimerSpan1>{hours}</TimerSpan1>
        <TimerSpan2>小时</TimerSpan2>
        <TimerSpan1>{minutes}</TimerSpan1>
        <TimerSpan2>分</TimerSpan2>
        <TimerSpan1>{seconds}</TimerSpan1>
        <TimerSpan2>秒</TimerSpan2>
      </TimerContainer>
    )
  }
}

export default Timer
