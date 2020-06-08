import React from "react"
import { Provider } from "react-redux"

import { ThemeProvider } from "styled-components"

import sagaModel from "../models/index"

import StorageProvider, { get, set, isSet } from "../components/StorageProvider"

export default ({ element }) => {
  const store = sagaModel.store()
  let theme = "dark"
  if (!isSet("theme")) {
    set("theme", theme)
  } else {
    theme = get("theme")
  }
  return (
    <Provider store={store}>
      <ThemeProvider theme={{ mode: theme }}>
        <StorageProvider>{element}</StorageProvider>
      </ThemeProvider>
    </Provider>
  )
}
