import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"
import { rhythm } from "../utils/typography"

import FriendLinks from "./index/friend-links/FriendLinks"
import UpdateFrequency from "./index/update-frequency/UpdateFrequency"
import Recently from "./index/recently/Recently"

import PhotoBox from "./index/photo-box/PhotoBox"
import ShaderBox from "./index/shader-box/ShaderBox"

const Container = styled.div`
  margin: ${rhythm(0.5)};
`
const Title = styled.h1`
  text-align: center;
  font-size: ${rhythm(2)} !important;
`

const Index = ({ data, location }) => {
  const titles = [
    "Tajoy's Blog",
    "欢迎来到我的博客~",
    "来啦~ 老弟",
    "此站我建, 求个留言!",
    "来啦~ 老妹",
    "来啦~ 老铁",
    "来啦~ 兄贵",
    "常回家看看~ 回家看看~",
  ]
  const title = titles[Math.floor(Math.random() * titles.length)]

  return (
    <Container>
      <Title>{title}</Title>
      <Recently posts={data.allMarkdown.posts} />
      <ShaderBox />
      <PhotoBox />
      <UpdateFrequency updates={data.updateFrequency.updates} />
      <FriendLinks friends={data.allFriend.edges.map(({ node }) => node)} />
    </Container>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allFriend {
      edges {
        node {
          name
          link
          headPic
          description
        }
      }
    }
    updateFrequency {
      updates {
        year
        weeksInYear
        weekOfYear
        articles
      }
    }
    allMarkdown(limit: 5) {
      posts {
        id
        excerpt(pruneLength: 160)
        fields {
          slug
          url
          title
          date(formatString: "YYYY-MM-DD")
          description
          category {
            name
            slug
          }
          tags {
            name
            slug
          }
          series {
            name
            slug
          }
        }
      }
    }
  }
`
