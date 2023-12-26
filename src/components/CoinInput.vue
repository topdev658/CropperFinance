<template>
  <div class="coin-select">
    <div class="label fs-container">
      <span>{{ label }}</span>
      <span v-if="balance && !balance.wei.isNaN()"> Balance: {{ balance.fixed() }} </span>
    </div>
    <div class="coin-input">
      <div class="main-input fs-container">
        <input
          ref="input"
          :value="value"
          inputmode="decimal"
          autocomplete="off"
          autocorrect="off"
          placeholder="0.00"
          type="text"
          pattern="^[0-9]*[.,]?[0-9]*$"
          minlength="1"
          maxlength="79"
          spellcheck="false"
          :disabled="disabled"
          @input="$emit('onInput', $event.target.value)"
          @focus="$emit('onFocus')"
        />
        <div class="rangeGroup">
          <button v-if="!disabled && showHalf && balance" class="input-button" @click="inputBalanceByPercent(1)"> 
            <!-- v-if="!disabled && showHalf && balance" -->
            max.
          </button>
          <button v-if="!disabled && balance" class="input-button" @click="inputBalanceByPercent(0.5)">half</button>
          <!-- v-if="!disabled && balance" -->
        </div>
        <button class="select-button fc-container" @click="$emit('onSelect')">
          <div v-if="coinName" class="fc-container">
            <CoinIcon :mint-address="mintAddress" />
            <span>{{ coinName }}</span>
          </div>
          <span v-else>Select a token</span>
          <Icon type="caret-down" />
        </button>
      </div>
      <!-- <input // Maybe it will use soon or later
        v-if="!disabled && balance"
        ref="range"
        :value="value"
        class="input-range"
        type="range"
        min="0"
        :max="balance ? balance.toEther() : ''"
        step="any"
        @change="$emit('onInput', $event.target.value)"
        @mousedown="focusInput()"
      />
      <div v-if="!disabled && balance" class="shortcut-btns">
        <button class="input-button" @click="inputBalanceByPercent(0)">0</button>
        <button class="input-button" @click="inputBalanceByPercent(0.25)">25%</button>
        <button class="input-button" @click="inputBalanceByPercent(0.5)">50%</button>
        <button class="input-button" @click="inputBalanceByPercent(0.75)">75%</button>
        <button class="input-button" @click="inputBalanceByPercent(1)">MAX</button>
      </div> -->
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
  border-radius: 13px;

  .label {
    padding: 0.75rem 1rem 0;
    font-size: 18px;
    line-height: 14px;
    color: rgb(133, 133, 141);
  }

  input {
    width: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    flex: 1 1 auto;
    color: @text-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }
  }

  input[disabled] {
    cursor: not-allowed;
  }

  .coin-input {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    margin: 9px;
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

    .rangeGroup {
      display: block;
      width: min-content;
    }

    .input-range {
      width: 100%;
      // &::-webkit-slider-runnable-track {
      //   background: #ddd;
      // }
      // &::-webkit-slider-thumb {
      //   background: dodgerblue;
      //   width: 4px;
      //   height: 4px;
      //   border-radius: 50%;
      // }
    }
    .input-button {
      height: 20px;
      width: 42px;
      margin: 2px;
      padding: 0 4px;
      font-size: 0.9em;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-sizing: border-box;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.6) !important;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    
    .select-button {
      padding: 0.5rem;
      line-height: 24px;
      margin-left: 2px;
      background: #01033C;
      border-radius: 8px;
      border: 2px solid;
      border-color: linear-gradient(97.63deg, #280C86 -29.92%, #22B5B6 103.89%);
      width: 120px;

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
