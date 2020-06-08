import React from "react"
import { Link } from "gatsby"

import * as $ from "jquery"

import styled from "styled-components"
import { rhythm, scale } from "../../utils/typography"

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
    
    Promise.all([
      window.loadExternalResource(
        "https://unpkg.com/gitalk/dist/gitalk.min.js",
        "js"
      ),
      window.loadExternalResource(
        "https://unpkg.com/gitalk/dist/gitalk.css",
        "css"
      ),
    ]).then(() => {
      const $container = $("#gitalk-container")
      if (["localhost", "127.0.0.1"].indexOf(window.location.hostname) != -1) {
        $container.html(
          "Gitalk comments not available by default when the website is previewed locally."
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
          id: location.pathname, // Ensure uniqueness and length less than 50
          distractionFreeMode: false, // Facebook-like distraction free mode
        })
      }
      this.gitalk.render("gitalk-container")
    })
  }

  render() {
    const { article } = this.props
    const { fields = {} } = article
    const { showComments } = fields
    // console.log("showComments", showComments)
    return <Container id="gitalk-container" show={showComments}></Container>
  }
}

export default Comment
