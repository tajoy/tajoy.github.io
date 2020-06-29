import React from "react"
import { Link, graphql } from "gatsby"

const NotFoundPage = ({ data, location }) => {
  return (
    <div>
      <h1>404 - 哇哦, 这是什么?</h1>
      <p>你貌似发现了什么, 但是不要遗失在这未知的领域!</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}

export default NotFoundPage

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `
