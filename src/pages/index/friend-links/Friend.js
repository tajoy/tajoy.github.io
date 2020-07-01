import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"

import md5 from "js-md5"

import { rhythm } from "../../../utils/typography"

import theme from "styled-theming"

import { LIGHT, DARK } from "../../../theme/colors"

const Container = styled.a`
  max-width: 256px;
  margin: 24px 12px;
  display: flex;
  flex-direction: row;
  padding-bottom: 6px;
`

const HeadPic = styled.div`
  min-width: 64px;
  min-height: 64px;
  max-width: 64px;
  max-height: 64px;
  img,
  svg {
    border-radius: 8px;
    min-width: 64px;
    min-height: 64px;
    max-width: 64px;
    max-height: 64px;
    margin: 0;
    padding: 0;
  }
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 6px;
  width: 100%;
`
const Name = styled.div`
  text-align: left;
  margin-bottom: 6px;
  margin: auto 0;
`
const Description = styled.div`
  text-align: left;
  font-size: 12px;
`

function hex(v) {
  if (v === undefined) return "00"
  if (v < 16) return "0" + parseInt("" + v).toString(16)
  return parseInt("" + v).toString(16)
}

function toColor(...args) {
  let ret = ""
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    ret += hex(arg)
  }
  return "#" + ret
}

const Friend = ({ friend }) => {
  if (friend === null || friend === undefined) return <></>
  const digest = md5.digest(`${friend.name}:${friend.link}`)
  const avg = (digest[0] + digest[1] + digest[2]) / 3.0
  const color = toColor(digest[0], digest[1], digest[2])
  return (
    <Container
      href={friend.link}
      title={friend.description || friend.name}
      alt={friend.description || friend.name}
      target="_blank"
      style={{
        boxShadow: "none",
      }}
    >
      <HeadPic>
        {friend.headPic ? (
          <img src={friend.headPic} alt={friend.name} />
        ) : (
          <svg
            version="1.1"
            width="64"
            height="64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100%" height="100%" fill={color} />
            <text
              x="32"
              y="48"
              fontSize="48"
              textAnchor="middle"
              fill={avg > 127 ? "black" : "white"}
            >
              {friend.name.substring(1, 0)}
            </text>
          </svg>
        )}
      </HeadPic>
      <Content>
        <Name>{friend.name}</Name>
        <Description>{friend.description}</Description>
      </Content>
    </Container>
  )
}

export default Friend
