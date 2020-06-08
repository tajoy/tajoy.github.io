import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"

import moment from "moment"


import { connectModel } from "../../models/utils"
import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"

import { withContext } from "../ContextProvider"
import { withStorage } from "../StorageProvider"
import { withSizes } from "../../utils/helpers"

import Logo from "./Logo"
import DecImg from "../DecImg"

import Icon from "../Icon"

import Timer from "./Timer"
import Slogan from "./Slogan"
import LinkShowImage from "./LinkShowImage"

const Container = transition.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  width: ${rhythm(14.76)};

  @media screen and (max-width: 480px) {
    display: none;
  }

  background-color: ${theme("mode", {
    light: LIGHT.SIDEBAR.BG,
    dark: DARK.SIDEBAR.BG,
  })};
  height: 100%;
  z-index: 1;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;

  margin-left: ${props => (props.isExpand ? "0" : rhythm(1.5 - 14.76))};

  background-color: ${props =>
    props.isExpand
      ? theme("mode", {
          light: LIGHT.SIDEBAR.BG,
          dark: DARK.SIDEBAR.BG,
        })
      : "#0000"};

  &:enter {
    margin-left: ${rhythm(1.5 - 14.76)};
    background-color: #0000;
  }
  &:enter-active {
    margin-left: 0 !important;
    background-color: ${theme("mode", {
      light: LIGHT.SIDEBAR.BG,
      dark: DARK.SIDEBAR.BG,
    })};
    transition: 500ms ease-in;
  }
  &:exit {
    margin-left: 0;
    background-color: ${theme("mode", {
      light: LIGHT.SIDEBAR.BG,
      dark: DARK.SIDEBAR.BG,
    })};
  }
  &:exit-active {
    margin-left: ${rhythm(1.5 - 14.76)} !important;
    background-color: #0000;
    transition: 500ms ease-in;
  }
`

const Content = styled.div`
  margin-left: ${rhythm(1)};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const ToggleHotSpot = styled.div`
  height: 100vh;
  width: ${rhythm(1.5)};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: ${rhythm(1)};

  color: ${props =>
    props.isExpand
      ? theme("mode", {
          light: LIGHT.FG.alpha(0.5),
          dark: DARK.FG.alpha(0.5),
        })
      : theme("mode", {
          light: LIGHT.FG.alpha(0.3),
          dark: DARK.FG.alpha(0.3),
        })};

  &:hover {
    background: ${props =>
      props.isExpand
        ? theme("mode", {
            light: "linear-gradient(to right, #0000, #0001)",
            dark: "linear-gradient(to right, #FFF0, #FFF1)",
          })
        : "#0000"} !important;
    cursor: pointer;
    color: ${props =>
      props.isExpand
        ? theme("mode", {
            light: LIGHT.FG.alpha(0.7),
            dark: DARK.FG.alpha(0.7),
          })
        : theme("mode", {
            light: LIGHT.FG.alpha(0.5),
            dark: DARK.FG.alpha(0.5),
          })};
  }
`

const ToggleTransWrapper = transition.div`
  transform: ${props => (props.isExpand ? "rotate(0deg)" : "rotate(180deg)")};

  &:enter {
    transform: rotate(180deg);
  }
  &:enter-active {
    transform: rotate(0deg) !important;
    transition: 500ms ease-in;
  }
  &:exit {
    transform: rotate(0deg);
  }
  &:exit-active {
    transform: rotate(180deg) !important;
    transition: 500ms ease-in;
  }
`

const Statistics = styled.div`
  margin: ${rhythm(0.3)} ${rhythm(0.2)};
  display: flex;
  justify-content: center;
  width: 80%;

  td {
    font-size: 12px;
    padding: 0;
  }

  td:last-child {
    padding-left: ${rhythm(0.5)};
  }
`

const Contacts = styled.div`
  margin: ${rhythm(0.5)} auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: ${rhythm(12)};
`

const ContactCell = styled.div`
  font-size: ${rhythm(2)};
`

const SideBar = ({
  location,
  children,
  context,
  storage,
  $app: {
    $model: { isExpand },
    $actions: { toggleExpand },
  },
  ...transOpts
}) => {
  const {
    site: { siteMetadata },
    siteBuildMetadata,
    allMarkdownRemark,
  } = useStaticQuery(graphql`
    query SiteMetadata {
      site {
        siteMetadata {
          title
          description
          siteUrl
          social {
            github
            qq
            twitter
            wechat
          }
          qrcode {
            qq
            wechat
          }
          author {
            name
            summary
          }
          slogan
          buildSince
        }
      }
      siteBuildMetadata {
        buildTime
      }
      allMarkdownRemark {
        totalCount

        edges {
          node {
            timeToRead
            cnWordCount
          }
        }
      }
    }
  `)
  const { windowWidth = window.innerWidth } = context
  let allWordCount = 0
  let timeToReadAll = 0
  for (let i = 0; i < allMarkdownRemark.edges.length; i++) {
    const node = allMarkdownRemark.edges[i].node
    allWordCount += node.cnWordCount
    timeToReadAll += node.timeToRead
  }

  // console.log("now", now.toString())
  // console.log("siteBuildMetadata.buildTime", siteBuildMetadata.buildTime)
  // console.log("siteMetadata.buildSince", siteMetadata.buildSince, buildSince)
  // console.log("durBuildSince", durBuildSince)
  const strBuildTime = moment(siteBuildMetadata.buildTime).format(
    "YYYY-MM-DD HH:mm:SS"
  )

  const [isTrans, setIsTrans] = useState(false)

  const onToggle = e => {
    if (isTrans) return
    toggleExpand()
  }
  // console.log("transOpts", transOpts)
  return (
    <Container
      isExpand={transOpts.in}
      in={transOpts.in}
      timeout={transOpts.timeout}
    >
      <Content>
        <Logo />
        <DecImg src="/profile.jpg" animation />
        <Slogan dangerouslySetInnerHTML={{ __html: siteMetadata.slogan }} />
        <Statistics>
          <table>
            <tbody>
              <tr>
                <td>全站文章</td>
                <td>{allMarkdownRemark.totalCount} 篇</td>
              </tr>
              <tr>
                <td>全站字数</td>
                <td>{allWordCount} (中字+英词)</td>
              </tr>
              <tr>
                <td>总阅时长</td>
                <td>{timeToReadAll} 分钟</td>
              </tr>
              <tr>
                <td>创站时长</td>
                <td>
                  <Timer since={siteMetadata.buildSince} />
                </td>
              </tr>
              <tr>
                <td>构建时间</td>
                <td>{strBuildTime}</td>
              </tr>
            </tbody>
          </table>
        </Statistics>
        <Contacts>
          <ContactCell>
            <a
              target="_blank"
              href={`https://github.com/${siteMetadata.social.github}`}
              title={siteMetadata.social.github}
            >
              <Icon type="b" id="github" />
            </a>
          </ContactCell>
          <ContactCell>
            <LinkShowImage
              src={siteMetadata.qrcode.qq}
              alt={siteMetadata.social.qq}
            >
              <Icon type="b" id="qq" />
            </LinkShowImage>
          </ContactCell>
          <ContactCell>
            <LinkShowImage
              src={siteMetadata.qrcode.wechat}
              alt={siteMetadata.social.wechat}
            >
              <Icon type="b" id="weixin" />
            </LinkShowImage>
          </ContactCell>
          <ContactCell>
            <Link target="_blank" to="/rss.xml" title="Tajoy's Blog RSS Feed">
              <Icon type="s" id="rss" />
            </Link>
          </ContactCell>
        </Contacts>
      </Content>
      <ToggleHotSpot
        isExpand={transOpts.in}
        onTouchStart={onToggle}
        onMouseDown={onToggle}
      >
        <ToggleTransWrapper
          isExpand={transOpts.in}
          in={transOpts.in}
          timeout={transOpts.timeout}
          onEntered={() => setIsTrans(false)}
          onExited={() => setIsTrans(false)}
          onEntering={() => setIsTrans(true)}
          onExiting={() => setIsTrans(true)}
        >
          <Icon type="s" id="arrow-left" />
        </ToggleTransWrapper>
      </ToggleHotSpot>
    </Container>
  )
}

const tailCall = [connectModel, withStorage, withContext, withSizes, SideBar]

export default tailCall.reduceRight((a, b) => b(a))


