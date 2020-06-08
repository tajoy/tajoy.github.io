import { SagaModel } from "./SagaModel/index"

// export const models = [
//   require("./app").default,
//   require("../components/layout/SideBar.Model").default,
// ]

const sagaModel = new SagaModel()

sagaModel.register(require("./app").default)
sagaModel.register(require("../components/Layout.model").default)
// sagaModel.register(require("../components/layout/SideBar.model").default)


sagaModel.use({
  onError: (error, dispatch) => {
    // ... 统一捕获所有异常
    console.error("dispatch error", dispatch, error)
  },
})

export default sagaModel