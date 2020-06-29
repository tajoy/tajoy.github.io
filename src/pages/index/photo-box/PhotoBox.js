import React from "react"
import { Link, useStaticQuery, graphql, navigate } from "gatsby"

import styled from "styled-components"

import { rhythm } from "../../../utils/typography"

import Marquee from "../../../components/Marquee"

const Container = styled.div`
  h2 {
    margin-top: ${rhythm(2)};
  }
`

const PhotoAlbum = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
`
const StyledMarquee = styled(Marquee)``

const Picture = styled.img`
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

const PhotoBox = () => {
  const allPictures = useStaticQuery(graphql`
    query PhotoBox {
      allFile(
        filter: { sourceInstanceName: { eq: "photos" } }
        sort: { fields: fields___date, order: DESC }
      ) {
        edges {
          node {
            fields {
              url
              date
            }
            childImageSharp {
              fixed(
                width: 320
                height: 320
                quality: 90
                background: "rgba(0,0,0,0)"
                toFormat: PNG
                fit: CONTAIN
              ) {
                src
                width
                height
              }
            }
          }
        }
      }
    }
  `).allFile.edges.map(({ node }) => node)
  const pictures = randomPickup(allPictures, 20)
  const splitted = [[], [], [], []]
  let index = 0
  for (let i = 0; i < pictures.length; i++) {
    const picture = pictures[i]
    splitted[index].push(picture)
    index = (index + 1) % 4
  }

  const convert = pictures => {
    return pictures.map((picture, i) => {
      return {
        width: picture.childImageSharp.fixed.width,
        height: picture.childImageSharp.fixed.height,
        Component: () => (
          <Picture
            key={i}
            width={picture.childImageSharp.fixed.width}
            height={picture.childImageSharp.fixed.height}
            src={picture.childImageSharp.fixed.src}
            onClick={() => {
              navigate(picture.fields.url)
            }}
          />
        ),
      }
    })
  }

  return (
    <Container>
      <h2>摄影作品</h2>
      <PhotoAlbum>
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
          direction="down"
          items={convert(splitted[1])}
        />
        <StyledMarquee
          delay={3000}
          duration={1000}
          interval={5000}
          direction="down"
          items={convert(splitted[2])}
        />
        <StyledMarquee
          delay={4000}
          duration={1000}
          interval={5000}
          items={convert(splitted[3])}
        />
      </PhotoAlbum>
    </Container>
  )
}

export default PhotoBox
