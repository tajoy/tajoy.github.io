import $withSizes from "react-sizes"

export const withSizes = Component =>
  $withSizes(sizes => ({
    window: sizes,
    isMobile: $withSizes.isMobile(sizes),
    isTablet: $withSizes.isTablet(sizes),
    isDesktop: $withSizes.isDesktop(sizes),
  }))(Component)

export const supportSVG = () =>
  typeof window.SVGRect !== "undefined" || typeof SVGRect !== "undefined"
