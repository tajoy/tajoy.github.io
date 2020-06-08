import React from "react"
import { graphql } from "gatsby"

import styled from "styled-components"

import DecImg from "../components/DecImg"

const Container = styled.div`
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    max-width: 60vw;
    @media screen and (max-width: 1024px) {
      max-width: unset;
    }
    canvas {
      padding: 0;
      width: 320px;
      height: 240px;
      max-width: 320px;
      max-height: 240px;
      margin: auto;
      background: #000;
      border-radius: 5%;
      mix-blend-mode: exclusion;
    }
  }
`

const AboutMe = ({ data, location }) => {
  return (
    <Container>
      <DecImg
        src={data.site.siteMetadata.author.photo}
        threshold={8}
        minSize={3}
      />

      {/* MAYBE: 这里要不要改成和 sidebar 的代码一样, 从markdown转化啊? */}

      <h2>吾所特质</h2>
      <p>谭戬, 男, {String(new Date().getFullYear() - 1990)}岁.</p>
      <p>曾职: 前端工程师, 嵌入式开发, 游戏开发. </p>
      <p>现职: 自由职业者.</p>

      <h2>流惘往路</h2>
      <p>出生于中国贵州的一个小县城, 毕业于贵州民族大学计算机科学与技术专业.</p>
      <p>自主创业过3次, 曾海漂于南亚.</p>
      <p>现回家"养老"转型中.</p>

      <h2>心趋所往</h2>
      <p>生活, 自由, 艺术, 极限运动, 电子游戏, 写代码.</p>
      <p>喜欢小型团队, 工作室与作坊式的工作方式.</p>
      <p>钟爱创造与创新内容, 想做出好玩的电子游戏.</p>
    </Container>
  )
}

export default AboutMe

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        author {
          photo
        }
      }
    }
  }
`
