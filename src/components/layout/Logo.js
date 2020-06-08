import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import * as $ from "jquery"
import anime from "animejs"

import { rhythm, scale } from "../../utils/typography"
import { supportSVG } from "../../utils/helpers"


const Container = styled.div`
  margin: ${rhythm(0.3)} ${rhythm(0.2)};
`

const Img = styled.img`
  width: 100%;
`

const SVG = styled.svg`
  width: 100%;
  #TAJOY-1 g {
    will-change: transform;
  }

  #TAJOY-2 g {
    will-change: transform;
  }

  path {
    will-change: auto;
  }
`

const isSupportSVG = supportSVG()

function randomG() {
  var r = 0
  for (var i = 5; i > 0; i--) {
    r += Math.random()
  }
  return r / 5
}

class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.svg = React.createRef()
  }

  componentDidMount() {
    if (!isSupportSVG) return

    const $svg = $(this.svg.current)
    $svg
      .find("#flatted path, #flatted polygon")
      .attr("fill", "#FFF0")
      .attr("fill-rule", "evenodd")
      .attr("stroke", "#FFF")
      .attr("stroke-width", "1");

    const $T1 = $svg.find("#T-1");
    const $A1 = $svg.find("#A-1");
    const $J1 = $svg.find("#J-1");
    const $O1 = $svg.find("#O-1");
    const $Y1 = $svg.find("#Y-1");

    const $T2 = $svg.find("#T-2");
    const $A2 = $svg.find("#A-2");
    const $J2 = $svg.find("#J-2");
    const $O2 = $svg.find("#O-2");
    const $Y2 = $svg.find("#Y-2");

    $svg.find("#TAJOY-1 g").css("visibility", "hidden");

    let loopCount = 0;
    const tl = anime.timeline({
      duration: 200,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
      loopBegin: function (anim) {
        loopCount += 1;
        // console.log("all loopBegin", loopCount);
      },
      complete: function (anim) {
      },
    }).add({
      delay: 1000,
      targets: "#flatted path",
      strokeDashoffset: [anime.setDashoffset, 0],
      delay: function (el, i, total) {
        return 200 + (total - i) * 80;
      },
    }).add({
      targets: "#flatted path",
      stroke: "#000",
      fill: "#000",
      delay: function (el, i, total) {
        return (total - i) * 80;
      },
    }).add({
      targets: "#T-1, #T-2",
      translateX: -10,
      translateY: -10,
      duration: 100,
      easing: function() {
        return function(t) {
          if (t === 0) return 0;
          if (t === 1) return 0;
          return randomG() * 2 - 1;
        }
      },
      changeComplete: function (anim) {
        // console.log("T loopCount", loopCount);
        if (loopCount % 2 === 1) {
          $T2.css("visibility", "hidden");
          $T1.css("visibility", "visible");
        } else {
          $T1.css("visibility", "hidden");
          $T2.css("visibility", "visible");
        }
      },
    }, "+=100").add({
      targets: "#A-1, #A-2",
      translateX: -10,
      translateY: -10,
      duration: 100,
      easing: function() {
        return function(t) {
          if (t === 0) return 0;
          if (t === 1) return 0;
          return randomG() * 2 - 1;
        }
      },
      changeComplete: function (anim) {
        // console.log("A loopCount", loopCount);
        if (loopCount % 2 === 1) {
          $A2.css("visibility", "hidden");
          $A1.css("visibility", "visible");
        } else {
          $A1.css("visibility", "hidden");
          $A2.css("visibility", "visible");
        }
      },
    }, "+=100").add({
      targets: "#J-1, #J-2",
      translateX: -10,
      translateY: -10,
      duration: 100,
      easing: function() {
        return function(t) {
          if (t === 0) return 0;
          if (t === 1) return 0;
          return randomG() * 2 - 1;
        }
      },
      changeComplete: function (anim) {
        // console.log("J loopCount", loopCount);
        if (loopCount % 2 === 1) {
          $J2.css("visibility", "hidden");
          $J1.css("visibility", "visible");
        } else {
          $J1.css("visibility", "hidden");
          $J2.css("visibility", "visible");
        }
      },
    }, "+=100").add({
      targets: "#O-1, #O-2",
      translateX: -10,
      translateY: -10,
      duration: 100,
      easing: function() {
        return function(t) {
          if (t === 0) return 0;
          if (t === 1) return 0;
          return randomG() * 2 - 1;
        }
      },
      changeComplete: function (anim) {
        // console.log("O loopCount", loopCount);
        if (loopCount % 2 === 1) {
          $O2.css("visibility", "hidden");
          $O1.css("visibility", "visible");
        } else {
          $O1.css("visibility", "hidden");
          $O2.css("visibility", "visible");
        }
      },
    }, "+=100").add({
      targets: "#Y-1, #Y-2",
      translateX: -10,
      translateY: -10,
      duration: 100,
      endDelay: 2000,
      easing: function() {
        return function(t) {
          if (t === 0) return 0;
          if (t === 1) return 0;
          return randomG() * 2 - 1;
        }
      },
      changeComplete: function (anim) {
        // console.log("Y loopCount", loopCount);
        if (loopCount % 2 === 1) {
          $Y2.css("visibility", "hidden");
          $Y1.css("visibility", "visible");
        } else {
          $Y1.css("visibility", "hidden");
          $Y2.css("visibility", "visible");
        }
      },
    }, "+=100");

  }
  
  render() {
    if (isSupportSVG) {
      return (
        <Container>
          <SVG ref={this.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 329.65 94.26">
            <title>logo</title>
            <g id="flatted">
              <g id="TAJOY-2">
                <g id="Y-2">
                  <path
                    d="M287.82 41.26c-3.62-13.12 0 0-3.62-13v-.13h18.38z"
                    transform="translate(-15.17 -11.48)"
                  />
                  <path
                    d="M307.71 55.32l18.71-27.18h18.41L326 52.63l-13.34 17.6-19.78 10.39c1-5.2 1.72-14.29 1.72-14.29-.55-2.6-1.34-5-2-7.24l-4.83-17.83 14.76-13.12z"
                    transform="translate(-15.17 -11.48)"
                  />
                  <path d="M277.71 69.14l19.75-10.39-1.75 7.03-3.94 15.89h-17.15l3.09-12.53z" />
                </g>
                <g id="O-2">
                  <path d="M238.36 34.78" />
                  <path
                    d="M271.12 43.31a16.16 16.16 0 0 0-3-7.37l-14.59 10.33a27.05 27.05 0 0 1 .58 5.87 38.21 38.21 0 0 1-1.17 6.72c-1.75 7.2-4.07 15.31-10.46 19.79-6.13 4.31-13.54 2.57-15.54-2.07-1.38-3.2-1.17-8.55-.63-11L209.1 77.71a24.69 24.69 0 0 0 3.65 7.79c2.5 3.25 4.95 5 9.65 7.12 12.39 4.08 26.45-.44 35.46-9.45 8-8 12.61-19.67 13.6-30.93a25.6 25.6 0 0 0-.34-8.93z"
                    transform="translate(-15.17 -11.48)"
                  />
                  <path
                    d="M231.6 48.77c3.39-6.1 12.68-13.18 19.51-7.33a9.85 9.85 0 0 1 2.42 4.83l14.59-10.33c-10.28-13.8-33.24-9.87-44.28 0-10.56 9.38-17.84 27.53-14.74 41.77l17.21-12.18c1.29-5.53 2.52-11.78 5.29-16.76z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="J-2">
                  <path
                    d="M199.5 28.12h-12.07l-3.13 12.69-2.46 10s-3.12 12.91-4.78 19.34c-1 3.86-2.12 8.36-6 10.26-6.51 3.17-9.15-1.94-7.59-7.57h-16.96a20.86 20.86 0 0 0-.72 9c.94 5.9 5.7 10.07 11.42 11.24a31.41 31.41 0 0 0 10.7.62c11.39-1.18 21.76-8.87 25.08-20l1.31-5 .79-3.35 9.21-37.26z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="A-2">
                  <path
                    d="M135.43 75.21l-6.18-46.46-15.56-.7v.09L93 61.34l-7.38 11.94S73.35 92.2 72.89 92.93H91l6.81-12h21.45l.42 7.27.15 4.68h18.32zM105 68.26l11.6-20.37 1.52 20.33z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="T-2">
                  <path
                    d="M59.86 27.33H30.49L27.12 40l20 .23-9.91 40.25-3.14 12.63h17.15l8.06-32.6 5-20.28h20.25l3.18-12.9z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
              </g>
            </g>
            <g id="cutted">
              <g id="TAJOY-1">
                <g id="Y-1">
                  <path
                    d="M271.12 50.44c5.35-6 14.48-13.16 13.08-22.17v-.13h17.24zM304 36.51l3.68 18.81 18.71-27.18h18.41L326 52.63l-39.38 28.93c3.66-4 8.53-9.43 8-15.23-.22-2.36-1.34-5-2-7.24l-4.83-17.83 27.18-20C311.79 24.89 304 31.24 304 36.51zm-11.12 44.11l37.84-27.81c-7.88 7.48-15.42 14.38-19.83 24.45l-3.95 15.9h-17.15z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="O-1">
                  <path
                    d="M191.46 93.83l97.39-71.51a98.82 98.82 0 0 0-13.57 13.33c-4.78 6-3.19 9.36-3.82 16.59-1 11.26-5.57 22.9-13.6 30.93-9 9-23.07 13.53-35.46 9.45-5.55-1.83-8.26-6.76-14.46-5.78-5.75.92-11.53 4.16-16.48 6.99zm35-28.88L209.1 77.71c-3.13-14.24 4.18-32.39 14.74-41.8 11-9.84 33.28-14.85 43.56-1l-22.74 16.7c1.77-1.58 8.6-7.26 6.45-10.12-6.79-5.74-16.12 1.23-19.51 7.33-2.77 4.93-3.88 10.64-5.17 16.18zm26.51-6.09a46.3 46.3 0 0 0 1.17-6.72c-.44-2.92-14.42 8.17-15.7 9.14-2.52 1.9-13.06 7.65-12.33 11.73.5 8.8 10.27 9.95 16.4 5.64 6.36-4.48 8.68-12.59 10.43-19.79z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="J-1">
                  <path
                    d="M145.79 81.92a20.86 20.86 0 0 1 .72-9h16.92c-1.56 5.63 1.08 10.74 7.59 7.57 3.92-1.9 5-6.4 6-10.26 1.66-6.43 3.19-12.89 4.78-19.34.87-5-5.08-1.23-7.12.14L204 29.53l-8.91 35.87-37.88 27.76c-5.72-1.16-10.48-5.34-11.42-11.24zm1.79 21.4l53.91-39.45q-1.92 1.67-3.58 3.36a19.8 19.8 0 0 0-4.91 6.54c-3.32 11.14-13.69 18.83-25.08 20-7.12 1.65-14.03 6.02-20.34 9.55zm64.93-83.11l-28.21 20.6 3.13-12.67h6.72a23.91 23.91 0 0 0 8.51-2.51c3.25-1.87 6.55-3.63 9.85-5.42z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="A-1">
                  <path
                    d="M134.6 67.05c.67 5.42 5.83 3.26 9.22 1.21l-30.9 22.66c3.09-2.49 4.88-6.35 6.32-9.94H97.79L91 92.93H72.89c.46-.73 13.11-20.86 10.48-20.86-4.09 0-9 3.73-12.58 5.5q29.6-21.85 59.28-43.57l4.48 32.69v.18zm15.31-50.82L90.85 59.62c10.32-7.38 16.21-21.09 22.75-31.48v-.09c13.98.56 24.67-5.05 36.31-11.82zM136 77.17l5.33-3.89c-2.78 3.09-4.48 6.09-4.48 10.25l1.3 9.4h-15.8c-9 1.39-18 7.48-25.26 12.81l22.66-16.66L136 77.13zm-31-8.91h13.12l-1.52-20.37z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
                <g id="T-1">
                  <path
                    d="M45.89 27.33L15.17 49.9c6.35-6.35 13.08-13.66 15.32-22.57zm14 0h27.82l-3.18 12.9H64.3l-5 20.28-27.83 20.42c11.17-10.66 12.12-26.32 15.68-40.7H32.59l39.14-28.75C70.82 12.3 56 26 59.86 27.33zM37.21 80.48L68.86 57.2C58.39 68.78 55 77.91 51.22 93.11H34.07z"
                    transform="translate(-15.17 -11.48)"
                  />
                </g>
              </g>
            </g>
          </SVG>
        </Container>
      )
    } else {
      return (
        <Container>
          <Img src={"/logo.png"} alt="Logo" />
        </Container>
      )
    }
  }
}


export default Logo
