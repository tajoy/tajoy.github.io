import React, { useState, useMemo, createContext } from "react"
import Storages from "js-storage"

let localStorage = null

export const Context = createContext()
export const Consumer = Context.Consumer

const init = () => {
  try {
    window === undefined
    localStorage = null
  } catch {
    localStorage = {
      keys: () => [],
      get: () => null,
      set: () => {},
      isEmpty: () => true,
      isSet: () => false,
      remove: () => {},
      removeAll: () => {},
    }
    return
  }
  if (!localStorage) {
    localStorage = Storages.initNamespaceStorage("tajoy-blog").localStorage
  }
}

export const withStorage = Component => {
  return props => {
    return (
      <Consumer>
        {storage => {
          return (
            <Component
              {...{ ...props, storage: { ...storage, ...props.storage } }}
            ></Component>
          )
        }}
      </Consumer>
    )
  }
}

function getStorage() {
  const storage = {}
  init()
  localStorage.keys().forEach(key => {
    storage[key] = localStorage.get(key)
  })
  return storage
}

// 防止循环调用锁
let rLock = false

let _orig_set = null
const Provider = ({ children = null }) => {
  if (!children) {
    return ""
  }
  // console.log("getStorage()", getStorage())
  const [storage, setStorage] = useState(getStorage())

  const updateStorage = () => {
    init()
    if (rLock) {
      return
    }
    rLock = true
    setStorage(getStorage())
    setTimeout(() => {
      rLock = false
    }, 1)
  }
  if (_orig_set === null) {
    _orig_set = localStorage.set.bind(localStorage)
    localStorage.set = (...args) => {
      _orig_set(...args)
      updateStorage()
    }
  }
  const method = {
    $get: (...args) => {
      return localStorage.get(...args)
    },
    $set: (...args) => {
      localStorage.set(...args)
      updateStorage()
    },
    $keys: (...args) => {
      return localStorage.keys(...args)
    },
    $isEmpty: (...args) => {
      return localStorage.isEmpty(...args)
    },
    $isSet: (...args) => {
      return localStorage.isSet(...args)
    },
    $remove: (...args) => {
      localStorage.remove(...args)
      updateStorage()
    },
    $removeAll: (...args) => {
      localStorage.removeAll(...args)
      updateStorage()
    },
  }

  return (
    <Context.Provider value={{ ...storage, ...method }}>
      {children}
    </Context.Provider>
  )
}

export default Provider

export const get = (...args) => {
  init()
  return localStorage.get(...args)
}
export const set = (...args) => {
  init()
  localStorage.set(...args)
}
export const keys = (...args) => {
  init()
  return localStorage.keys(...args)
}
export const isEmpty = (...args) => {
  init()
  return localStorage.isEmpty(...args)
}
export const isSet = (...args) => {
  init()
  return localStorage.isSet(...args)
}
export const remove = (...args) => {
  init()
  localStorage.remove(...args)
}
export const removeAll = (...args) => {
  init()
  localStorage.removeAll(...args)
}
