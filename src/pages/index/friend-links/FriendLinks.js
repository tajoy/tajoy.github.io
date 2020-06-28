import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"

import { rhythm } from "../../../utils/typography"

import theme from "styled-theming"

import { LIGHT, DARK } from "../../../theme/colors"

import Friend from "./Friend"

const Container = styled.div``

const FriendsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
const FriendLinks = ({ friends = [] }) => {
  return (
    <Container>
      <h2>友情链接</h2>
      <FriendsContainer>
        {friends.map((friend, i) => (
          <Friend key={i} friend={friend} />
        ))}
      </FriendsContainer>
    </Container>
  )
}

export default FriendLinks
