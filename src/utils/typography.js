import Typography from "typography"
import Theme from "typography-theme-parnassus"

Theme.baseFontSize = "18px"
Theme.baseLineHeight = 1.66
Theme.scaleRatio = 4
// Theme.headerFontFamily = []
// Theme.bodyFontFamily = []
Theme.headerGray = 10
Theme.headerWeight = "900"
Theme.bodyGray = 20
Theme.bodyWeight = "400"
Theme.boldWeight = "700"


Theme.overrideThemeStyles = () => {
  return {
    "a.gatsby-resp-image-link": {
      boxShadow: `none`,
    },
  }
}

delete Theme.googleFonts

const typography = new Typography(Theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
