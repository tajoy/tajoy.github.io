import React from "react"
import { Link } from "gatsby"

import styled from "styled-components"
import theme from "styled-theming"

import { LIGHT, DARK } from "../../theme/colors"

import { rhythm, scale } from "../../utils/typography"
import { withContext } from "../ContextProvider"

import Icon from "../Icon"

const Container = styled.footer`
  background-color: ${theme("mode", {
    light: LIGHT.FOOTER.BG,
    dark: DARK.FOOTER.BG,
  })};
  padding: 0.5rem;
  border-top: 1px solid #000;
`

const Information = styled.div`
  text-align: center;
  white-space: nowrap;
`

const Support = styled.div`
  padding-top: ${rhythm(0.1)};
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const GithubBadge = styled.div`
  display: inline-block;
  border-radius: 4px;
  text-shadow: none;
  font-size: 12px;
  line-height: 15px;
  margin: 10px 5px;
  white-space: nowrap;

  @media screen and (max-width: 480px) {
    margin: 5px;
    margin-left: -10px;
    margin-right: -10px;
    transform: scale(0.8);
  }
`

const Subject = styled.div`
  display: inline-block;
  background-color: rgb(60, 60, 60);
  padding: 4px 4px 4px 6px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
`

const Value = styled.div`
  display: inline-block;
  padding: 4px 6px 4px 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: ${({ bg }) => bg};
`

const Footer = ({ location, children }) => {
  return (
    <Container>
      <Information>
        用
        <Icon color="#bc344b" type="r" id="heart" />
        和
        <Icon color="#D7B273" type="r" id="grin-squint" />
        制作于2020年。
      </Information>
      <Support>
        <GithubBadge>
          <a
            rel="powered-by"
            href="https://www.gatsbyjs.org/"
            target="_blank"
            title="Hugo"
          >
            <Subject>Power By</Subject>
            <Value bg="#50546f">Gatsby</Value>
          </a>
        </GithubBadge>
        <GithubBadge>
          <a
            rel="powered-by"
            href="https://reactjs.org/"
            target="_blank"
            title="React"
          >
            <Subject>Power By</Subject>
            <Value bg="#36485e">React</Value>
          </a>
        </GithubBadge>
        <GithubBadge>
          <a
            rel="powered-by"
            href="https://remark.js.org/"
            target="_blank"
            title="Remark"
          >
            <Subject>Power By</Subject>
            <Value bg="#385955">Remark</Value>
          </a>
        </GithubBadge>
      </Support>
    </Container>
  )
}

export default Footer
