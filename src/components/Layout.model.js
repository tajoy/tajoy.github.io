import { call, put, takeEvery, takeLatest } from "redux-saga/effects"
import * as $ from "jquery"

export default {
  namespace: "layout",

  state: {
    tocOffsetX: 0,
    tocOffsetY: 0,
    tocShow: false,
    tocOutView: null,
    nowItem: null,
    goTopShow: false,
  },

  subscriptions: {
    onSizeChange: ({ dispatch }) => {
      const listener = () => {
        dispatch({
          type: "onResize",
        })
      }
      try {
        window.addEventListener("resize", listener)
      } catch {}
      return () => window.removeEventListener("resize", listener)
    },
    onScroll: ({ dispatch }) => {
      const listener = () => {
        dispatch({
          type: "onScroll",
        })
      }
      const addListener = () => {
        const container = document.getElementById("scrollContainer")
        if (!container) {
          setTimeout(addListener, 1)
          return
        }
        container.addEventListener("scroll", listener)
      }
      try {
        addListener()
      } catch {}
      return () => container.removeEventListener("scroll", listener)
    },
  },

  reducers: {
    onResize: (state, { payload }) => {
      const $wrapper = $("#contentContainer")
      if (!$wrapper[0]) return { ...state }
      let isOutView = false
      const $window = $(window)
      const $container = $("#toc")
      // if ($container[0]) {
      //   isOutView =
      //     $window.scrollLeft() + $window.width() <
      //     $container.offset().left + +$container.outerWidth()
      // }
      return {
        ...state,
        tocOffsetX: $wrapper.offset().left + $wrapper[0].scrollWidth + 10,
        tocOffsetY: 0,
        tocShow: !isOutView,
      }
    },

    onScroll: (state, { payload }) => {
      const scrollLayer = document.getElementById("scrollContainer")
      if (!scrollLayer) return { ...state }
      const scrollTop = scrollLayer.scrollTop
      if (scrollTop === undefined) return { ...state }
      const scrollHeight = scrollLayer.scrollHeight
      if (scrollHeight === undefined) return { ...state }
      const items = [...$("h1, h2, h3, h4, h5, h6")].sort(
        (a, b) => a.offsetTop - b.offsetTop
      )
      let nowItem = items[0]
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (nowItem.offsetTop > scrollTop + scrollHeight) {
          break
        }
        nowItem = item
        if (
          nowItem.offsetTop > scrollTop &&
          nowItem.offsetTop < scrollTop + scrollHeight
        ) {
          break
        }
      }
      // console.log(
      //   "scrollTop",
      //   scrollTop,
      //   "scrollHeight",
      //   scrollHeight,
      //   "nowItem",
      //   nowItem.getAttribute("data-toc-id")
      // )
      // console.log("window.innerHeight", window.innerHeight)
      return {
        ...state,
        nowItem: nowItem.getAttribute("data-toc-id"),
        goTopShow: scrollTop > window.innerHeight * 0.5,
      }
    },
  },

  sagas: {},
}
