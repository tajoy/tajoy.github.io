import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import styled from "styled-components"

import Fade from "react-reveal/Fade"
import theme from "styled-theming"
import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"
import { useStaticQuery } from "../../utils/helpers"
import { withContext } from "../ContextProvider"
import { withSizes } from "../../utils/helpers"

import Counter from "../Counter"
import Icon from "../Icon"

const QUERY = graphql`
  query AllTagsCategoriesSeries {
    allCategory {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
    allTag {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
    allSeries {
      edges {
        node {
          id
          name
          slug
          posts {
            fields {
              url
              title
              description
            }
            excerpt
          }
        }
      }
      totalCount
    }
  }
`

const Container = styled.div`
  margin: 0 ${rhythm(0.5)};
  width: ${rhythm(40)};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-left: ${props => (props.needMoveLeft ? "-10rem" : "0")};

  @media screen and (max-width: 1440px) {
    font-size: 12px !important;
  }

  @media screen and (max-width: 1024px){
    font-size: 12px !important;
  }

  @media screen and (max-width: 480px) {
    font-size: 12px !important;
  }
`

const Item = styled.div`
  display: flex;
  width: auto;
  vertical-align: middle;
  margin: 0;
  margin-right: ${rhythm(0.5)};
  min-width: ${rhythm(4)};
  flex-direction: column;
  justify-content: center;
  align-items: baseline;
  height: 100%;

  @media screen and (max-width: 1440px) {
    min-width: ${rhythm(2)} !important;
    width: ${rhythm(1.5)} !important;
  }

  @media screen and (max-width: 1024px) and (min-width: 480px) {
    min-width: ${rhythm(1.25)} !important;
    width: ${rhythm(1.25)} !important;
    margin-right: ${rhythm(0.8)};
  }
  @media screen and (max-width: 480px) {
    min-width: ${rhythm(1.25)} !important;
    width: ${rhythm(1.25)} !important;
    margin-right: ${rhythm(0.8)};
  }
`

const SubMenu = styled.div`
  display: ${props => (props.show ? "flex" : "none")};
  flex-direction: row;
  position: absolute;
  width: ${rhythm(8)};
  padding: ${rhythm(0.5)} 0;
  border: 1px solid #000;
  border-top: none;
  margin: ${rhythm(0.6)} 0 0 ${rhythm(-2.5)};
  text-align: center;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background-color: ${theme("mode", {
    light: LIGHT.HEADER.BG,
    dark: DARK.HEADER.BG,
  })};

  @media screen and (max-width: 1024px) {
    display: none !important;
  }
`

const SubMenuItem = styled.div`
  display: inline-block;
  width: auto;
  vertical-align: middle;
  margin: ${rhythm(0.615)};
  margin-top: 0;
`

// const MenuLink = styled(Link)(props => {
//   const isCurrent = props.to === props.current
//   if (isCurrent) {
//     return styled.css`
//       cursor: not-allowed;
//       pointer-events: none;
//     `
//   } else {
//     return styled.css`
//       cursor: default;
//       pointer-events: all;
//     `
//   }
// })

const CurrentLink = styled(Link)`
  pointer-events: none;
  color: ${theme("mode", {
    light: LIGHT.LINK.SELECTED,
    dark: DARK.LINK.SELECTED,
  })} !important;

  &::after {
    content: " ☜";
  }

  @media screen and (max-width: 1440px) {
    white-space: pre;
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &::after {
      content: "" !important;
    }
  }

  @media screen and (max-width: 1024px) {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: break-spaces;
    text-align: center;
  }
  white-space: pre !important;
`

const NormalLink = styled(Link)`
  @media screen and (max-width: 1440px) {
    white-space: pre;
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  @media screen and (max-width: 1024px) {
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: break-spaces;
    text-align: center;
  }
  white-space: pre !important;
`

const MenuLink = props => {
  const isCurrent = props.to === props.location.pathname
  if (isCurrent) {
    return <CurrentLink {...props}>{props.children}</CurrentLink>
  } else {
    return <NormalLink {...props}>{props.children}</NormalLink>
  }
}

const LCounter = ({to, location, children, isDesktop}) => {
  const isCurrent = to === location.pathname
  return <Counter show={!isCurrent && isDesktop}>{children}</Counter>
}

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCategory: false,
      showTag: false,
      showSeries: false,
    }
  }

  showCategory = (isShow, e) => {
    this.setState({ showCategory: isShow })
  }

  showTag = (isShow, e) => {
    this.setState({ showTag: isShow })
  }

  showSeries = (isShow, e) => {
    this.setState({ showSeries: isShow })
  }

  render() {
    const {
      context: { location },
      needMoveLeft,
      isDesktop,
    } = this.props
    const { showCategory, showTag, showSeries } = this.state

    return (
      <StaticQuery query={QUERY}>
        {data => {
          const { allCategory, allTag, allSeries } = data
          return (
            <Container needMoveLeft={needMoveLeft}>
              <Item>
                <MenuLink location={location} to="/">
                  <Icon type="s" id="home" />
                  首页
                </MenuLink>
              </Item>
              <Item>
                <MenuLink location={location} to="/article-list/1">
                  <Icon type="s" id="list" />
                  文章列表
                </MenuLink>
              </Item>
              <Item
                onMouseOver={e => this.showCategory(true, e)}
                onMouseEnter={e => this.showCategory(true, e)}
                onMouseLeave={e => this.showCategory(false, e)}
              >
                <MenuLink location={location} to="/category/">
                  <Icon type="s" id="th" />
                  内容分类
                  <LCounter isDesktop={isDesktop} location={location} to="/category/" to="/category/">
                    {allCategory.edges.length}
                  </LCounter>
                </MenuLink>
                <Fade duration={200} top unmountOnExit when={showCategory}>
                  <SubMenu show={showCategory}>
                    {allCategory.edges.map(({ node }) => (
                      <SubMenuItem key={node.slug}>
                        <MenuLink
                          location={location}
                          to={`/category/${node.slug}/`}
                        >
                          <span>{node.name}</span>
                          <LCounter isDesktop={isDesktop}
                            location={location}
                            to={`/category/${node.slug}/`}
                          >
                            {node.posts.length}
                          </LCounter>
                        </MenuLink>
                      </SubMenuItem>
                    ))}
                  </SubMenu>
                </Fade>
              </Item>
              <Item
                onMouseOver={e => this.showTag(true, e)}
                onMouseEnter={e => this.showTag(true, e)}
                onMouseLeave={e => this.showTag(false, e)}
              >
                <MenuLink location={location} to="/tags/">
                  <Icon type="s" id="tags" />
                  标签汇总
                  <LCounter isDesktop={isDesktop} location={location} to="/tags/">
                    {allTag.edges.length}
                  </LCounter>
                </MenuLink>
                <Fade duration={200} top unmountOnExit when={showTag}>
                  <SubMenu show={showTag}>
                    {allTag.edges.map(({ node }) => (
                      <SubMenuItem key={node.slug}>
                        <MenuLink
                          location={location}
                          to={`/tags/${node.slug}/`}
                        >
                          <span>{node.name}</span>
                          <LCounter isDesktop={isDesktop}
                            location={location}
                            to={`/tags/${node.slug}/`}
                          >
                            {node.posts.length}
                          </LCounter>
                        </MenuLink>
                      </SubMenuItem>
                    ))}
                  </SubMenu>
                </Fade>
              </Item>
              <Item
                onMouseOver={e => this.showSeries(true, e)}
                onMouseEnter={e => this.showSeries(true, e)}
                onMouseLeave={e => this.showSeries(false, e)}
              >
                <MenuLink location={location} to="/series/">
                  <Icon type="s" id="pen-square" />
                  系列文章
                  <LCounter isDesktop={isDesktop} location={location} to="/series/">
                    {allSeries.edges.length}
                  </LCounter>
                </MenuLink>
                <Fade duration={200} top unmountOnExit when={showSeries}>
                  <SubMenu show={showSeries}>
                    {allSeries.edges.map(({ node }) => (
                      <SubMenuItem key={node.slug}>
                        <MenuLink
                          location={location}
                          to={`/series/${node.slug}/`}
                        >
                          <span>{node.name}</span>
                          <LCounter isDesktop={isDesktop}
                            location={location}
                            to={`/series/${node.slug}/`}
                          >
                            {node.posts.length}
                          </LCounter>
                        </MenuLink>
                      </SubMenuItem>
                    ))}
                  </SubMenu>
                </Fade>
              </Item>
              <Item>
                <MenuLink location={location} to="/about-me/">
                  <Icon type="s" id="meh-rolling-eyes" />
                  说说自己
                </MenuLink>
              </Item>
            </Container>
          )
        }}
      </StaticQuery>
    )
  }
}

export default withContext(withSizes(Menu))
