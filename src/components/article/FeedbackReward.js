import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import * as $ from "jquery"

import { v4 as uuid } from "uuid"

import styled, { keyframes, css } from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"

import { LIGHT, DARK } from "../../theme/colors"
import { rhythm, scale } from "../../utils/typography"

import { withContext } from "../ContextProvider"

import Icon from "../Icon"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin: 2px 0;
    font-style: italic;
    font-size: ${rhythm(0.5)};

    span {
      font-style: italic !important;
      margin: 0 3px;
    }
  }
`
const random = (begin, end) => begin + Math.random() * (end - begin)
const animHover = keyframes`
  ${Array.from({ length: 100 })
    .map(
      (_, i) => `
      ${i}% {
        transform: translate(${random(-3, 3)}px, ${random(
        -3,
        3
      )}px) rotate(${random(-5, 5)}deg);
      }
  `
    )
    .join("")}
`

const Button = styled.button`
  will-change: transform;
  margin: ${rhythm(0.5)} 0;
  font-size: ${rhythm(1)};
  width: ${rhythm(6.6)};
  padding: 6px 0px;
  color: ${theme("mode", {
    light: LIGHT.REWARD.BUTTON.FG,
    dark: DARK.REWARD.BUTTON.FG,
  })};
  background-color: ${theme("mode", {
    light: LIGHT.REWARD.BUTTON.BG,
    dark: DARK.REWARD.BUTTON.BG,
  })};
  letter-spacing: ${props => (props.isHover ? "2px" : "10px")};
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: inset 0px 4px 0px #fff6, inset 4px 0px 0px #fff6,
    inset 0px -4px 0px #0006, inset -4px 0px 0px #0006, 3px 3px 0px 0px #000a;

  &:active {
    padding-top: 8px;
    padding-bottom: 4px;
    padding-left: 5px;

    box-shadow: inset 4px 0px 0px #0006, inset 0px 4px 0px #0006,
      inset 0px -4px 0px #fff6, inset -4px 0px 0px #fff6, 3px 3px 0px 0px #000a;
  }
  &:hover {
    animation-name: ${animHover};
    animation-duration: 3s;
    animation-fill-mode: both;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    color: ${theme("mode", {
      light: LIGHT.REWARD.BUTTON.FG.brighten(0.5),
      dark: DARK.REWARD.BUTTON.FG.brighten(0.5),
    })};
    background-color: ${theme("mode", {
      light: LIGHT.REWARD.BUTTON.BG.brighten(0.5),
      dark: DARK.REWARD.BUTTON.BG.brighten(0.5),
    })};
  }
  &:focus {
    outline: none;
  }
`

const RewardWrapper = transition.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 0 30vw;
  background-color: #000C;
  z-index: 999999999;

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

  img {
    width: 180px;
    height: auto;
    margin: 10px 120px;
    filter: drop-shadow(2px 4px 6px black);
  }

  span {
    font-size: 60px;
  }
`

const RewardWeixin = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const RewardAlipay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function randomItem(list) {
  const len = list.length
  return list[Math.floor(Math.random() * (len - 0.0001))]
}

class FeedbackReward extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isHover: false,
      isExpand: false,
    }
    this.qrCodeContainer = React.createRef()
  }

  onMouseEnter = e => {
    e.preventDefault()
    if (this.delaySet) {
      clearTimeout(this.delaySet)
    }
    this.setState({
      isHover: true,
    })
  }

  onMouseOut = e => {
    e.preventDefault()
    this.delaySet = setTimeout(
      () =>
        this.setState({
          isHover: false,
        }),
      500
    )
  }

  onClick = e => {
    e.preventDefault()
    this.setState({
      isExpand: !this.state.isExpand,
    })
  }

  collapse = e => {
    e.preventDefault()
    this.setState({
      isExpand: false,
    })
  }

  render() {
    const { isHover, isExpand } = this.state
    const textList = [
      <Icon type="s" id="hammer">
        打我
      </Icon>,
      <Icon type="s" id="bolt">
        用力
      </Icon>,
      <Icon type="s" id="gifts">
        赏我
      </Icon>,
      <Icon type="s" id="oil-can">
        加油
      </Icon>,
      <Icon type="s" id="heart">
        爱我
      </Icon>,
      <Icon type="s" id="kiss-wink-heart">
        爱我
      </Icon>,
      <Icon type="s" id="grin-hearts">
        爱我
      </Icon>,
      <Icon type="s" id="mars-double">
        鞭策我
      </Icon>,
      <Icon type="s" id="gavel">
        蹂躏我
      </Icon>,
      <Icon type="s" id="venus-double">
        别怜惜
      </Icon>,
      "来把昆特牌?",
    ]
    return (
      <Container>
        <p>如果我的文章帮助到了您</p>
        <p>
          请我喝杯
          <Icon type="s" id="mug-hot" />
          波波芋圆奶茶呗 ∠( ᐛ 」∠)＿
        </p>
        <p>您的鼓励和支持是我持续创造的最大支持 !!!</p>
        <Button
          onMouseEnter={this.onMouseEnter}
          onMouseOut={this.onMouseOut}
          onClick={this.onClick}
          isHover={isHover}
        >
          {isHover ? (
            randomItem(textList)
          ) : (
            <Icon type="s" id="yen-sign">
              打赏
            </Icon>
          )}
        </Button>

        <StaticQuery
          query={graphql`
            query FeedbackReward {
              site {
                siteMetadata {
                  qrcode {
                    rewardAlipay
                    rewardWeixin
                  }
                }
              }
            }
          `}
        >
          {data => (
            <RewardWrapper
              onClick={this.collapse}
              in={isExpand}
              unmountOnExit
              timeout={500}
            >
              <RewardWeixin>
                <img
                  src={data.site.siteMetadata.qrcode.rewardWeixin}
                  alt="微信支付"
                />
                <Icon type="b" id="weixin" />
              </RewardWeixin>
              <RewardAlipay>
                <img
                  src={data.site.siteMetadata.qrcode.rewardAlipay}
                  alt="支付宝支付"
                />
                <Icon type="b" id="alipay" />
              </RewardAlipay>
            </RewardWrapper>
          )}
        </StaticQuery>
      </Container>
    )
  }
}

export default FeedbackReward
