import $withSizes from "react-sizes"

export const withSizes = Component =>
  $withSizes(sizes => ({
    window: sizes,
    isMobile: $withSizes.isMobile(sizes),
    isTablet: $withSizes.isTablet(sizes),
    isDesktop: $withSizes.isDesktop(sizes),
  }))(Component)

export const supportSVG = () => {
  try {
    window === undefined
  } catch {
    return true
  }
  return typeof window.SVGRect !== "undefined" || typeof SVGRect !== "undefined"
}

export const blobToSrc = blob => {
  try {
    const urlCreator = window.URL || window.webkitURL
    return urlCreator.createObjectURL(blob)
  } catch (e) {
    return ""
  }
}
/**
 * 判断元素是否可见
 * @param {Object} elm
 */
export function checkVisible(elm) {
  if (!elm) return false
  try {
    const rect = elm.getBoundingClientRect()
    //获取当前浏览器的视口高度，不包括工具栏和滚动条
    //document.documentElement.clientHeight兼容 Internet Explorer 8、7、6、5
    const viewHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight
    )
    //bottom top是相对于视口的左上角位置
    //bottom大于0或者top-视口高度小于0可见
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0)
  } catch {
    return false // ssr 没有 window 和 document
  }
}
