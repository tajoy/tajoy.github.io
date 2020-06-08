import React, { useContext, useMemo, createContext } from "react"
export const Context = createContext()
export const Consumer = Context.Consumer

export const withContext = Component => {
    return props => {
      return (
        <Consumer>
          {context => (
            <Component {...{ ...props, context: { ...context, ...props.context} }}></Component>
          )}
        </Consumer>
      )
    }
}

export default function Provider(props) {
  if (!props.children) {
    return null
  }
  return (
    <Context.Provider value={props.context}>{props.children}</Context.Provider>
  )
}
