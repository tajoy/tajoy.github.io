import React from "react"
import { Link, graphql } from "gatsby"

import styled from "styled-components"
import { rhythm } from "../utils/typography"

import FriendLinks from "./index/friend-links/FriendLinks"
import UpdateFrequency from "./index/update-frequency/UpdateFrequency"
import Recently from "./index/recently/Recently"

import PhotoBox from "./index/photo-box/PhotoBox"
import ShaderBox from "./index/shader-box/ShaderBox"

import Comment from "../components/Comment"

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
      <h2>留言簿</h2>
      <p>即时版聊区，话题不限，欢迎留言。交换友链请留言。</p>
      <b>友链格式:</b>
      <pre>
        <code>
          <br />
          名称: 你希望显示的网站名称
          <br />
          地址: 访问地址
          <br />
          Icon/头像(可选): 图片地址/base64格式图片
          <br />
          描述(可选): 简短介绍
        </code>
      </pre>
      <b>本站链接:</b>
      <pre>
        <code>
          名称: Tajoy's blog
          <br />
          头像: https://wx2.sbimg.cn/2020/07/23/DiyUU.jpg
          <br />
          描述: 一个不会摄影的程序猿, 不是一个好的艺术家. <br />
          地址: https://tajoy.net
          <br />
        </code>
      </pre>
      <Comment id="message-box" title="留言簿" />
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
