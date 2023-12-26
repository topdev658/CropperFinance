<template>
  <Footer :class="isMobile ? 'mobile' : 'pc'">
    <div v-if="!isMobile" class="logo">
      <a href="/"><img src="@/assets/icons/logo-text.svg"  width="161" height="26" /></a>
    </div>
    <div class="link-menu">
    <span>Decentralized 2021</span>
    </div>
    <div class="icon_list">
      <a :href="linkUrl.twitter" target="_blank" style="padding-left: 8px; padding-right: 8px;">
        <img src="@/assets/icons/twitter.svg" width="40" height="40" />
      </a>
      <a :href="linkUrl.discord" target="_blank" style="padding-left: 8px; padding-right: 8px;">
        <img src="@/assets/icons/discord.svg" width="40" height="40" />
      </a>
      <a :href="linkUrl.telegram" target="_blank" style="padding-left: 8px; padding-right: 8px;">
        <img src="@/assets/icons/telegram.svg" width="40" height="40" />
      </a>
      <a :href="linkUrl.medium" target="_blank" style="padding-left: 8px; padding-right: 8px;">
        <img src="@/assets/icons/medium.svg" width="40" height="40" />
      </a>
    </div>
    <div v-if="isMobile" class="logo">
      <a href="/"><img src="@/assets/icons/logo-text.svg" /></a>
    </div>
    <img class="planet-img-bottom" src="@/assets/Green Planet 2.png" />
  </Footer>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

import { Layout } from 'ant-design-vue'

const { Footer } = Layout

@Component({
  components: {
    Footer
  }
})
export default class Foot extends Vue {
  navOpened = false
  linkUrl = {
    home: '/',
    app: '/swap/',
    twitter: 'https://twitter.com/CropperFinance',
    discord: 'https://discord.gg/CropperFinance',
    telegram: 'https://t.me/CropperFinance',
    medium: 'https://cropperfinance.medium.com/'
  }

  get isMobile() {
    return this.$accessor.isMobile
  }

  beforeMount() {
    this.$accessor.queryIsMobile()
  }
}
</script>

<style lang="less" scoped>

.planet-img-bottom {
  position: absolute;
  right: 0;
}

.mobile {
  .link-menu {
    span {
      display: inline-block;
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: #84879c;
      padding-top: 16px;
    }
  }

  .icon_list {
    text-align: center;
    margin: 48px 0;
  }

  .logo {
    text-align: center;
    margin-bottom: 50px;
  }

  .planet-img-bottom {
    bottom: 300px;
  }
}

.pc {
  display: flex;
  justify-content: space-between;
  position: relative;

  .logo{
      line-height:40px
  }
  .link-menu {
    span{
      line-height:40px
    }
    a {
      display: inline-block;
      width: 100px;
      text-align: center;
      font-size: 14px;
      color: #84879c;

      &:hover {
        color: #fff;
      }
    }
  }

  .planet-img-bottom {
    bottom: 90px;
  }
}
</style>
