import { Plugin } from '@nuxt/types'
import { NuxtApiInstance } from '@/types/api'

const VERSION = '1.1.0'

const apiPlugin: Plugin = (ctx, inject) => {
  const api: NuxtApiInstance = {
    getPrices: () => ctx.$axios.get('https://api.cropper.finance/prices/?t='+ Math.round((new Date().getTime()) / 60000) ),
    getEpochInfo: (rpc: string) => ctx.$axios.post(rpc, { jsonrpc: '2.0', id: 1, method: 'getEpochInfo' })
  }

  ctx.$api = api
  inject('api', api)
}

export default apiPlugin
