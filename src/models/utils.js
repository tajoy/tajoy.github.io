import deep from "deep-get-set"
import { connect } from "react-redux"

import appModel from "./app"

import { isArray, merge } from "lodash"

function makeActionDispatcher(name, namespace, dispatch) {
  return payload => {
    dispatch({ type: `${namespace}/${name}`, payload })
  }
}

const _connectModel = (Component, models, prefix) => {
  const mapStateToProps = (state /*, ownProps*/) => {
    const props = {}
    for (let i = 0; i < models.length; i++) {
      let prefix = null
      let model = models[i]
      if (isArray(model)) {
        prefix = model[0]
        model = model[1]
      }
      let modelState = deep(state, model.namespace) || {}
      if (prefix) {
        props[prefix] = merge(props[prefix], { $model: modelState })
      } else {
        props.$model = merge(props.$model, modelState)
      }
    }
    return props
  }
  const mapDispatchToProps = (dispatch /*, ownProps*/) => {
    const props = {}
    for (let i = 0; i < models.length; i++) {
      let prefix = null
      let model = models[i]
      if (isArray(model)) {
        prefix = model[0]
        model = model[1]
      }
      const actionDispatchers = {}
      for (const [key] of Object.entries(model.reducers)) {
        actionDispatchers[key] = makeActionDispatcher(
          key,
          model.namespace,
          dispatch
        )
      }
      for (const [key] of Object.entries(model.sagas)) {
        actionDispatchers[key] = makeActionDispatcher(
          key,
          model.namespace,
          dispatch
        )
      }
      if (prefix) {
        props[prefix] = merge(props[prefix], { $actions: actionDispatchers })
      }
      props.$actions = merge(props.$actions, actionDispatchers)
    }
    return props
  }
  const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return merge(stateProps, dispatchProps, ownProps)
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps)(Component)
}

export const connectModel = (Component, model) => {
  const models = [["$app", appModel]]
  if (model) {
    models.push(model)
  }
  return _connectModel(Component, models)
}
