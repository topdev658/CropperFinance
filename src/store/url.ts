import { getterTree, mutationTree, actionTree } from 'typed-vuex'

export const state = () => ({
  trading: 'https://dex.cropper.finance',
  explorer: 'https://solscan.io',
  trade: 'https://dex.cropper.finance/#/market',
  whitelist : '#'
})

export const getters = getterTree(state, {})

export const mutations = mutationTree(state, {})

export const actions = actionTree({ state, getters, mutations }, {})
