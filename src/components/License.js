import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"

import { LIGHT, DARK } from "../theme/colors"
import { rhythm, scale } from "../utils/typography"

import { withContext } from "./ContextProvider"

import Icon from "./Icon"

const Container = styled.div`
  border-left: 3px solid
    ${theme("mode", {
      light: LIGHT.LICENSE.BAR,
      dark: DARK.LICENSE.BAR,
    })};

  background-color: ${theme("mode", {
    light: "#0001",
    dark: "#FFF1",
  })};
  padding: 1px;
  margin: 20px 0;
  table {
    margin: ${rhythm(0.5)};
    white-space: nowrap;

    @media screen and (max-width: 480px) {
      margin: 0;
    }
    tr {
      border: none;
      @media screen and (max-width: 480px) {
        vertical-align: top;
      }
    }
    td {
      border: none;
      padding: ${rhythm(0.1)};
      @media screen and (max-width: 480px) {
        padding: ${rhythm(0.1)};
      }

      &:first-child {
        @media screen and (max-width: 480px) {
          padding-left: ${rhythm(0.25)};
        }
      }

      &:last-child {
        overflow-wrap: anywhere;
        white-space: pre-wrap;

        @media screen and (max-width: 480px) {
          padding-right: ${rhythm(0.2)};
        }
      }
    }
  }
`

const License = ({ context }) => {
  const { site, location } = context
  return (
    <Container>
      <table>
        <tbody>
          <tr>
            <td align="right">本文作者：</td>
            <td>{site.siteMetadata.author.name}</td>
          </tr>
          <tr>
            <td align="right">本文链接：</td>
            <td>
              <a href={location.href}>{location.href}</a>
            </td>
          </tr>
          <tr>
            <td align="right">版权声明：</td>
            <td>
              本博客所有文章除特别声明外，均采用
              <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                <Icon type="b" id="creative-commons" />
                BY-NC-SA
              </a>
              许可协议。转载请注明出处！
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  )
}

export default withContext(License)
