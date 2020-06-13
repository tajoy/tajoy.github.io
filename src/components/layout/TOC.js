import React from "react"
import { Link } from "gatsby"

import * as $ from "jquery"
import anime from "animejs"

import deep from "deep-get-set"
import visit from "unist-util-visit"
import toString from "hast-util-to-string"

import styled from "styled-components"
import theme from "styled-theming"
import transition from "styled-transition-group"

import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"
import { withContext } from "../ContextProvider"

const Container = transition.div`
  max-width: ${rhythm(12)};
  order: 2;
  position: fixed;
  visibility: ${props => (props.show ? "visible" : "hidden")};
  left: ${props => `${props.left}px`};
  top: ${props => `${props.top}px`};
  padding-top: ${rhythm(1)};

  &:enter {
    margin-left: 0 !important;
  }
  &:enter-active {
    margin-left: ${rhythm(14.76 / 2)} !important;
    transition: 510ms ease-in;
  }
  &:exit {
    margin-left: 0 !important;
  }
  &:exit-active {
    margin-left: ${rhythm(-14.76 / 2)} !important;
    transition: 510ms ease-in;
  }
  @media screen and (max-width: 1024px) and (min-width: 480px) {
    display: none !important;
  }

`

function isContainTarget(tree, target) {
  if (tree.target === target) return true

  for (let i = 0; i < tree.children.length; i++) {
    const children = tree.children[i]
    if (isContainTarget(children, target)) return true
  }

  return false
}

const MenuList = ({ show = true, nowItem, node, maxDepth, depth = 0 }) => {
  return (
    <ul>
      {node &&
        node.children &&
        node.children.map((n, i) => (
          <MenuItem
            key={i}
            nowItem={nowItem}
            node={n}
            maxDepth={maxDepth}
            depth={depth + 1}
          ></MenuItem>
        ))}
    </ul>
  )
}

const MenuButton = styled.button`
  background: none;
  border: none;
  transform-origin: left center;
  transform: ${props => (props.highlight ? "scale(1.2)" : "none")};
  color: ${props =>
    props.highlight
      ? theme("mode", {
          light: LIGHT.LINK.SELECTED,
          dark: DARK.LINK.SELECTED,
        })
      : theme("mode", {
          light: LIGHT.LINK.FG,
          dark: DARK.LINK.FG,
        })} !important;
  cursor: pointer;
  outline: none;
  &:hover {
    color: ${theme("mode", {
      light: LIGHT.LINK.HOVER,
      dark: DARK.LINK.HOVER,
    })};
    box-shadow: 0px 1px 0px 0px currentColor !important;
  }
  text-align: left !important;
`

const MenuItem = ({ nowItem, node, maxDepth, depth }) => {
  const onClick = e => {
    e.preventDefault()
    const $target = $(`*[data-toc-id='${node.target}']`)
    const $container = $("#scrollContainer")
    $container.animate({
      scrollTop: $container.scrollTop() + $target.offset().top - 80,
    })
  }
  return (
    <li>
      <MenuButton highlight={isContainTarget(node, nowItem)} onClick={onClick}>
        {node.text}
      </MenuButton>
      {node && node.children.length > 0 && depth < maxDepth && (
        <MenuList
          show={isContainTarget(node, nowItem)}
          nowItem={nowItem}
          node={node}
          maxDepth={maxDepth}
          depth={depth}
        />
      )}
    </li>
  )
}

const TOC = ({ isExpand, nowItem, left, top, show = false, context }) => {
  const htmlAst = deep(context, "data.markdownRemark.htmlAst")
  const tocMaxDepth = deep(
    context,
    "data.markdownRemark.frontmatter.tocMaxDepth"
  )
  let maxDepth = 3
  if (tocMaxDepth !== undefined) {
    maxDepth = tocMaxDepth
  }
  let tocTree = null
  if (htmlAst) {
    tocTree = genTocTree(htmlAst)
  } else {
    show = false
  }
  if (tocTree && tocTree.children && tocTree.children.length <= 0) {
    show = false
  }
  return (
    <Container
      id="toc"
      in={isExpand}
      isExpand={isExpand}
      timeout={510}
      left={left}
      top={top}
      show={show}
    >
      <h2>目录</h2>
      <MenuList nowItem={nowItem} node={tocTree} maxDepth={maxDepth} />
    </Container>
  )
}

function genTocTree(htmlAst) {
  const tree = {
    text: "root",
    target: null,
    level: 0,
    children: [],
  }
  let lastNode = tree
  function findParent(tree, node) {
    for (let i = 0; i < tree.children.length; i++) {
      const children = tree.children[i]
      if (node.target === children.target) {
        return tree
      } else {
        const parentNode = findParent(children, node)
        if (parentNode) return parentNode
      }
    }
    return null
  }
  function onHeading(node, index, parent) {
    const text = toString(node)
    if (!/h[1-7]/.test(node.tagName)) return
    const level = parseInt(node.tagName.match(/h([1-7])/)[1])
    if (!node.properties) node.properties = {}
    // console.log(`Title ${level} ${text} | attrs:`, node.properties)
    const newNode = {
      text,
      target: node.properties.dataTocId,
      level,
      children: [],
    }
    if (level > lastNode.level) {
      lastNode.children.push(newNode)
      lastNode = newNode
    } else if (level == lastNode.level) {
      const parentNode = findParent(tree, lastNode)
      parentNode.children.push(newNode)
      lastNode = newNode
    } else {
      let curNode = lastNode
      let parentNode
      let parentLevel
      do {
        parentNode = findParent(tree, curNode)
        parentLevel = parentNode.level
        curNode = parentNode
      } while (parentLevel >= newNode.level)
      curNode.children.push(newNode)
      lastNode = newNode
    }
  }
  visit(htmlAst, "element", onHeading)
  return tree
}

export default withContext(TOC)
