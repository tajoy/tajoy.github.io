import React from "react"
import { Link } from "gatsby"

import * as $ from "jquery"

import md5 from "js-md5"

import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"
import Gitalk from "gitalk"

const Container = styled.div`
  display: ${props => (props.show ? "block" : "none")};
`

class Comment extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.gitalk) {
      this.gitalk.render("gitalk-container")
      return
    }
    const { id = md5(location.pathname), title } = this.props
    const $container = $("#gitalk-container")
    if (
      ["localhost", "127.0.0.1"].indexOf(
        window.location.hostname
      ) != -1 ||
      /192\.[0-9\.]+/.test(window.location.hostname)
    ) {
      $container.html(
        "Gitalk 评论不支持本地预览."
      )
      return
    }
    if (!this.gitalk) {
      this.gitalk = new Gitalk({
        clientID: "8b460a9d68322500a100",
        clientSecret: "926c457c4295803c58f53b7c20ec366c8792a996",
        repo: "tajoy.github.io",
        owner: "tajoy",
        admin: ["tajoy"],
        id: id.substr(0, 50), // Ensure uniqueness and length less than 50
        distractionFreeMode: false, // Facebook-like distraction free mode
        title,
      })
    }
    this.gitalk.render("gitalk-container")
  }

  render() {
    const { show = true } = this.props
    // console.log("showComments", show)
    return <Container id="gitalk-container" show={show}></Container>
  }
}

export default Comment
