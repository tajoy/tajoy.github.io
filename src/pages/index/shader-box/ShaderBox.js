import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"

import styled from "styled-components"

import { rhythm } from "../../../utils/typography"

import Marquee from "../../../components/Marquee"

import GlslCanvas from "../../../components/shader/GlslCanvas"

const Container = styled.div`
  h2 {
    margin-top: ${rhythm(2)};
  }
`

const ShaderAlbum = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
`
const StyledMarquee = styled(Marquee)``

const StyledGlslCanvas = styled(GlslCanvas)`
  margin: 0;
  padding: 0;
  width: ${props => `${props.width}px`};
  height: ${props => `${props.height}px`};
  cursor: pointer;
`

let RANDOM_CACHE = null

const randomPickup = (items, count) => {
  if (RANDOM_CACHE) return RANDOM_CACHE
  const copyItems = [...items]
  for (let i = 0; i < copyItems.length * 3; i++) {
    const i1 = parseInt(`${Math.random() * copyItems.length}`)
    const i2 = parseInt(`${Math.random() * copyItems.length}`)
    const temp = copyItems[i1]
    copyItems[i1] = copyItems[i2]
    copyItems[i2] = temp
  }
  RANDOM_CACHE = copyItems.slice(0, count)
  return RANDOM_CACHE
}

const ShaderBox = () => {
  const allShaders = useStaticQuery(graphql`
    query ShaderBox {
      allShaders {
        shaders {
          id
          frag
          fields {
            url
          }
        }
      }
    }
  `).allShaders.shaders
  const shaders = randomPickup(allShaders, 20)
  const splitted = [[], [], [], []]
  let index = 0
  for (let i = 0; i < shaders.length; i++) {
    const shader = shaders[i]
    splitted[index].push(shader)
    index = (index + 1) % 4
  }

  const convert = shaders => {
    return shaders.map((shader, i) => {
      return {
        width: 180,
        height: 180,
        Component: () => (
          <StyledGlslCanvas
            key={i}
            width={180}
            height={180}
            frag={shader.frag}
            onClick={() => {
              navigate(shader.fields.url)
            }}
          />
        ),
      }
    })
  }

  return (
    <Container>
      <h2>Shader</h2>
      <ShaderAlbum>
        <StyledMarquee
          delay={1000}
          duration={1000}
          interval={5000}
          items={convert(splitted[0])}
        />
        <StyledMarquee
          delay={2000}
          duration={1000}
          interval={5000}
          items={convert(splitted[1])}
        />
        <StyledMarquee
          delay={3000}
          duration={1000}
          interval={5000}
          items={convert(splitted[2])}
        />
        <StyledMarquee
          delay={4000}
          duration={1000}
          interval={5000}
          items={convert(splitted[3])}
        />
      </ShaderAlbum>
    </Container>
  )
}

export default ShaderBox
