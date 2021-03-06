import { set, get, isSet } from "../components/StorageProvider"

function getDefaultIsExpand() {
  if (isSet("sidebar.isExpand")) {
    return get("sidebar.isExpand")
  } else {
    try {
      return window.innerWidth >= 1024
    } catch {
      return true
    }
  }
}

export default {
  namespace: "app",

  state: {
    theme: isSet("theme") ? get("theme") : "dark",
    isExpand: getDefaultIsExpand(),
  },

  subscriptions: {
    windowSizeChange: ({ dispatch }) => {
      const onResize = () => {
        dispatch({
          type: "resize",
          size: { width: window.innerWidth, height: window.innerHeight },
        })
      }
      try {
        window.addEventListener("resize", onResize)
      } catch {}
      return () => window.removeEventListener("resize", onResize)
    },
  },

  reducers: {
    toggleTheme: (state, { payload }) => {
      const newTheme = state.theme === "light" ? "dark" : "light"
      set("theme", newTheme)
      return { ...state, theme: newTheme }
    },
    resize: state => {
      if (window.innerWidth < 1024) {
        set("sidebar.isExpand", false)
        return { ...state, isExpand: false }
      }
      return { ...state }
    },
    toggleExpand: state => {
      const isExpand = !state.isExpand
      set("sidebar.isExpand", isExpand)
      return { ...state, isExpand }
    },
  },

  sagas: {
    fetchLogoSvg: function* () {},
  },
}
