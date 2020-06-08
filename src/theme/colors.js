import chroma from "chroma-js"
/* ref: https://coolors.co/22223b-4a4e69-9a8c98-c9ada7-f2e9e4 */
const c11 = chroma(`#22223b`)
const c12 = chroma(`#4a4e69`)
const c13 = chroma(`#9a8c98`)
const c14 = chroma(`#c9ada7`)
const c15 = chroma(`#f2e9e4`)

/* ref: https://coolors.co/666a86-788aa3-92b6b1-b2c9ab-e8ddb5 */
const c21 = chroma(`#666a86`)
const c22 = chroma(`#788aa3`)
const c23 = chroma(`#92b6b1`)
const c24 = chroma(`#b2c9ab`)
const c25 = chroma(`#e8ddb5`)

export const DARK = {
  BG: c11,
  FG: c12.brighten(2.5),

  NOT_FOUND: {
    FG: c14.darken(0.2),
  },

  SIDEBAR: {
    FG: c22.brighten(0.4),
    BG: c12.darken(0.4),
    CLOSE: c11,
  },

  COUNT: {
    FG: c21.darken(0.2),
    BG: c25.darken(0.2),
  },

  HEADER: {
    BG: c11.darken(0.2),
  },

  CONTENT: {
    REWARD_BTN: {
      FG: chroma("#7d1111"),
      BG: chroma("#eaae24"),
    },
  },

  FOOTER: {
    BG: c11.darken(0.2),
  },

  LINK: {
    FG: c23,
    VISITED: c23.darken(0.4).desaturate(0.25),
    HOVER: c23.brighten(0.5),
    ACTIVE: c23.darken(0.4),
    SELECTED: c23.brighten(1.2).desaturate(2),
  },

  LICENSE: {
    BAR: chroma("#3e0505"),
  },

  REWARD: {
    BUTTON: {
      FG: chroma("#7d1111"),
      BG: chroma("#eaae24"),
    },
  },
}

export const LIGHT = {
  BG: c11,
  FG: c12.brighten(2.5),

  NOT_FOUND: {
    FG: c14.darken(0.2),
  },

  SIDEBAR: {
    FG: c22.brighten(0.4),
    BG: c12.darken(0.4),
    CLOSE: c11,
  },

  COUNT: {
    FG: c21.darken(0.2),
    BG: c25.darken(0.2),
  },

  HEADER: {
    BG: c11.darken(0.2),
  },

  CONTENT: {
    REWARD_BTN: {
      FG: chroma("#7d1111"),
      BG: chroma("#eaae24"),
    },
  },

  FOOTER: {
    BG: c11.darken(0.2),
  },

  LINK: {
    FG: c23,
    VISITED: c23.darken(0.4).desaturate(0.25),
    HOVER: c23.brighten(0.5),
    ACTIVE: c23.darken(0.4),
    SELECTED: c23.brighten(1.2).desaturate(2),
  },

  LICENSE: {
    BAR: chroma("#3e0505"),
  },

  REWARD: {
    BUTTON: {
      FG: chroma("#7d1111"),
      BG: chroma("#eaae24"),
    },
  },
}
