import React from "react"
import { Link } from "gatsby"

import * as $ from "jquery"

import styled from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"

import deep from "deep-get-set"
import visit from "unist-util-visit"

import { rhythm, scale } from "../utils/typography"

import Header from "./layout/Header"
import Footer from "./layout/Footer"
import Sidebar from "./layout/SideBar"
import TOC from "./layout/TOC"
import GoTop from "./layout/GoTop"

import { LIGHT, DARK } from "../theme/colors"

import { withStorage } from "./StorageProvider"
import { withContext } from "./ContextProvider"
import { withSizes } from "../utils/helpers"

import { connectModel } from "../models/utils"

import model from "./Layout.model"

const LayoutContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: ${theme("mode", {
    light: LIGHT.BG,
    dark: DARK.BG,
  })};
  color: ${theme("mode", {
    light: LIGHT.FG,
    dark: DARK.FG,
  })};

  @media screen and (max-width: 1024px) and (min-width: 480px) {
    font-size: ${rhythm(0.65)} !important;
  }
  @media screen and (max-width: 480px) {
    font-size: 12px !important;
  }

  a,
  a:link {
    color: ${theme("mode", {
      light: LIGHT.LINK.FG,
      dark: DARK.LINK.FG,
    })};
    cursor: pointer;
    box-shadow: none;
  }

  a:visited {
    color: ${theme("mode", {
      light: LIGHT.LINK.VISITED,
      dark: DARK.LINK.VISITED,
    })};
  }

  a:hover {
    color: ${theme("mode", {
      light: LIGHT.LINK.HOVER,
      dark: DARK.LINK.HOVER,
    })};
    box-shadow: 0px 1px 0px 0px currentColor !important;
  }

  a:active {
    color: ${theme("mode", {
      light: LIGHT.LINK.ACTIVE,
      dark: DARK.LINK.ACTIVE,
    })};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${theme("mode", {
      light: LIGHT.FG,
      dark: DARK.FG,
    })} !important;
    text-shadow: 2px 2px 4px
      ${theme("mode", {
        light: "#FFF",
        dark: "#000",
      })};
  }

  svg {
    max-width: 100%;
  }

  ol,
  ul,
  li,
  p {
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      margin-bottom: 12px;
    }

    @media screen and (max-width: 480px) {
      margin-bottom: 8px;
    }
  }

  blockquote {
    color: ${theme("mode", {
      light: LIGHT.FG.brighten(),
      dark: DARK.FG.darken(),
    })} !important;
    font-style: italic;
    border-color: ${theme("mode", {
      light: LIGHT.BG.darken().alpha(0.5),
      dark: DARK.BG.brighten().alpha(0.5),
    })} !important;
    margin-left: ${rhythm(0.5)};

    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.65)} !important;
      margin-left: 8px;
      padding-left: 8px;
    }
    @media screen and (max-width: 480px) {
      font-size: 12px !important;
      margin-left: 4px;
      padding-left: 4px;
      line-height: 16px;
    }
    p {
      @media screen and (max-width: 1024px) and (min-width: 480px) {
        margin-bottom: 8px;
      }

      @media screen and (max-width: 480px) {
        margin-bottom: 4px;
      }
    }
  }
  h1 {
    font-size: ${rhythm(1.55)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.95)};
    }
    @media screen and (max-width: 480px) {
      font-size: 24px !important;
    }
  }
  h2 {
    font-size: ${rhythm(1.4)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.9)};
    }
    @media screen and (max-width: 480px) {
      font-size: 22px !important;
    }
  }
  h3 {
    font-size: ${rhythm(1.25)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.85)};
    }
    @media screen and (max-width: 480px) {
      font-size: 20px !important;
    }
  }
  h4 {
    font-size: ${rhythm(1.1)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.8)};
    }
    @media screen and (max-width: 480px) {
      font-size: 18px !important;
    }
  }
  h5 {
    font-size: ${rhythm(0.95)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.75)};
    }
    @media screen and (max-width: 480px) {
      font-size: 16px !important;
    }
  }
  h6 {
    font-size: ${rhythm(0.8)};
    @media screen and (max-width: 1024px) and (min-width: 480px) {
      font-size: ${rhythm(0.7)};
    }
    @media screen and (max-width: 480px) {
      font-size: 14px !important;
    }
  }

  hr {
    height: 1px;
    margin-bottom: ${rhythm(1)};
    background: ${theme("mode", {
      light: LIGHT.BG.darken().alpha(0.5),
      dark: DARK.BG.brighten().alpha(0.5),
    })} !important;
  }

  th[align="right"],
  td[align="right"] {
    text-align: right;
  }

  th[align="left"],
  td[align="left"] {
    text-align: left;
  }

  th[align="center"],
  td[align="center"] {
    text-align: center;
  }

  figcaption {
    margin: ${rhythm(0.5)} 0;
    text-align: center;
    font-style: italic;
  }
  iframe {
    width: 100% !important;
    height: 400px !important;

    @media screen and (max-width: 1024px) and (min-width: 480px) {
      height: 300px !important;
    }
    @media screen and (max-width: 480px) {
      height: 240px !important;
    }
  }
`

const Page = transition.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;

  margin-left: ${props => (props.isExpand ? rhythm(14.76) : "0")};

  &:exit {
    margin-left: ${rhythm(14.76)};
  }
  &:exit-active {
    margin-left: 0;
    transition: 500ms ease-in;
  }
  &:enter {
    margin-left: 0;
  }
  &:enter-active {
    margin-left: ${rhythm(14.76)};
    transition: 500ms ease-in;
  }
`

const ScrollLayer = styled.div`
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-left: ${props => (props.needMoveLeft ? "-10rem" : "0")};
`

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
`

const ArticleWrapper = styled.div`
  flex-grow: 1;
  width: ${rhythm(28)};

  @media screen and (max-width: 1024px) and (min-width: 480px) {
    width: ${rhythm(18)} !important;
  }

  @media screen and (max-width: 480px) {
    width: ${rhythm(12)} !important;
  }
`

const Main = styled.main`
  flex-grow: 1;
  order: 1;
`

function shouldShowTOC(context) {
  let show = false
  const htmlAst = deep(context, "data.markdownRemark.htmlAst")
  const find = node => {
    if (/h[1-7]/.test(node.tagName)) {
      show = true
    }
  }
  if (htmlAst) {
    visit(htmlAst, "element", find)
  } else {
    show = false
  }
  return show
}
const lastSize = {}

const Layout = ({
  children,
  storage,
  context,
  isDesktop,
  $model,
  $app: {
    $model: { isExpand },
  },
  $actions: { onResize },
}) => {
  const { tocOffsetX, tocOffsetY, tocShow, nowItem, goTopShow } = $model
  let needMoveLeft = shouldShowTOC(context)
  if (!isDesktop) {
    needMoveLeft = false
  }
  const updateTOC = () => {
    if (lastSize.width !== innerWidth && lastSize.height !== innerHeight) {
      onResize()
    }
    lastSize.width = innerWidth
    lastSize.height = innerHeight
  }
  setTimeout(updateTOC, 1)
  return (
    <LayoutContainer>
      <Sidebar in={isExpand} timeout={500} />
      <Page
        in={isExpand}
        isExpand={isExpand}
        timeout={500}
        onEntered={updateTOC}
        onExited={updateTOC}
      >
        <Header needMoveLeft={needMoveLeft} />
        <ScrollLayer
          id="scrollContainer"
          isExpand={isExpand}
          needMoveLeft={needMoveLeft}
        >
          <ContentWrapper id="contentContainer">
            <ArticleWrapper>
              <TOC
                isExpand={isExpand}
                nowItem={nowItem}
                left={tocOffsetX}
                top={tocOffsetY}
                show={tocShow}
              />
              <Main>{children}</Main>
              <GoTop isExpand={isExpand} left={tocOffsetX} show={goTopShow} />
            </ArticleWrapper>
          </ContentWrapper>
          <Footer isExpand={isExpand} />
        </ScrollLayer>
      </Page>
    </LayoutContainer>
  )
}

const tailCall = [withStorage, withContext, withSizes, Layout]
export default connectModel(
  tailCall.reduceRight((a, b) => b(a)),
  model
)
