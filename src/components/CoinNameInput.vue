<template>
  <div class="coin-select">
    <div class="label fs-container">
      <span>{{ label }}</span>
    </div>
    <div class="coin-input">
      <div class="main-input fs-container">
        <button class="select-button fc-container" @click="$emit('onSelect')">
          <div v-if="coinName" class="fc-container">
            <CoinIcon :mint-address="mintAddress" />
            <span>{{ coinName }}</span>
          </div>
          <span v-else>Select a token</span>
          <Icon type="caret-down" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from 'ant-design-vue'

import { lt } from '@/utils/safe-math'

export default Vue.extend({
  components: {
    Icon
  },

  model: {
    prop: 'value',
    event: 'onInput'
  },

  props: {
    label: {
      type: String,
      default: 'From'
    },
    coinName: {
      type: String,
      default: ''
    },
    mintAddress: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    balance: {
      type: Object,
      default: null
    },
    balanceOffset: {
      type: Number,
      default: 0
    },
    showMax: {
      type: Boolean,
      default: true
    },
    showHalf: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    lt,
    focusInput() {
      const input = this.$refs.input as HTMLInputElement
      input.focus()
    },
    inputBalanceByPercent(percent: number) {
      // error balance
      if (!this.balance || this.balance.wei.isNaN()) return

      const availableBalance = Number(this.balance.toEther()) + (this.balanceOffset ?? 0)

      // can't send negative balance
      if (availableBalance < 0) return

      const inputValue = (availableBalance * percent).toFixed(this.balance.decimals)
      this.focusInput()
      this.$emit('onInput', inputValue)
    }
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';

.coin-select {
  background: rgba(0,0,0,0.9471);
  border-radius: 13px;

  .label {
    padding: 0.75rem 1rem 0;
    font-size: 12px;
    line-height: 14px;
    color: rgb(133, 133, 141);
  }
  .coin-input {
    padding: 0.75rem 0.75rem 0.75rem 1rem;

    button {
      border: none;
      background-color: transparent;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      border-radius: 4px;
      white-space: nowrap;
      cursor: pointer;

      &:active,
      &:focus,
      &:hover {
        outline: 0;
      }

      &:hover {
        background-color: @modal-header-bg;
      }
    }
    .select-button {
      padding: 0.5rem;
      line-height: 24px;

      .anticon {
        margin-left: 4px;
        font-size: 8px;
      }

      img {
        margin-right: 5px;
        height: 24px;
        width: 24px;
      }
    }

    .shortcut-btns {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
