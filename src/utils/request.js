import Axios from "axios"

const axios = Axios.create()
export const request = (opts) => {
  return axios.request(opts)
}

export const get = opts => {
  return axios.get(opts)
}

export const post = opts => {
  return axios.post(opts)
}