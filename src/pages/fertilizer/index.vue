<template>
  <div class="fertilizer cont">
  <div class="card">
   <div class="card-body">
    <div class="page-head fs-container">
      <span class="title">Fertilizer</span>
    </div>

    <div class="list" v-if="initialized">

            <div v-for="farm in labelizedAmms" :key="farm.pla" slot="header" class="pf-record" :class="isMobile ? 'is-mobile singleFarm' : ' singleFarm'" :gutter="0" >
                <div class="pf-record-content">
                  <div class="labelaner">{{farm.customForcedHeader ? farm.customForcedHeader : farm.calculateNextStep }}</div>
                  <img class="small" :src="importIcon(`/coins/${farm.tokenA.symbol}.png`)" alt="" />
                  <div class="banner"><img :src="farm.links.banner" class="large" alt="" /></div>

                     


                    <div class="addPadding">
                    <Col class="state pf-arrow" :span="16">
                        <div class="title">{{farm.name}}</div>
                        <div class="desc">{{farm.desc}}</div>
                        
                    </Col>

                    <Col class="followerscount" :span="8">
                        Followers<br />
                        <span>{{farm.followers}}</span>
                    </Col>

                    <Col :span="24">
                      <div class="btncontainer"  @click="goToProject(farm)">
                        <Button size="large" ghost>
                          Read more
                        </Button>
                      </div>
                    </Col>
                    </div>


                </div>
            </div>

    </div>



    <div v-else class="fc-container">
      <Spin :spinning="true">
        <Icon slot="indicator" type="loading" style="font-size: 24px" spin />
      </Spin>
    </div>
    </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { Collapse, Spin, Icon, Col, Radio, Select, Switch as Toggle, Pagination } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { getUnixTs } from '@/utils'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const RadioButton = Radio.Button

export default Vue.extend({
  components: {
    //Toggle,
    //Collapse,
    //CollapsePanel,
    Spin,
    Icon,
    Col,
    //Select,
    //Pagination
  },

//    ,
//    RadioGroup,
//    RadioButton

  data() {
    return {
      isMobile: false,
      searchName:"",
      coinPicUrl : '',
      initialized : false as boolean,
      labelizedAmms:{} as any,
      currentPage:1,
      coinName : '',
      mintAddress : '',
      nbFarmsLoaded : 0 as number
    }
  },

  head: {
    title: 'CropperFinance Farm'
  },

  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  async mounted() {
    await this.updateLabelizedAmms();

    let timer = setInterval(async () => {
      if (this.nbFarmsLoaded == Object.keys(this.labelizedAmms).length) {
        this.initialized = true
      }

    }, 1000)

  },

  methods: {
    importIcon,
    getCoinPicUrl() {
      let token
      if (this.mintAddress == NATIVE_SOL.mintAddress) {
        token = NATIVE_SOL
      } else {
        token = Object.values(TOKENS).find((item) => item.mintAddress === this.mintAddress)
      }
      if (token) {
        this.coinName = token.symbol.toLowerCase()
        if (token.picUrl) {
          this.coinPicUrl = token.picUrl
        } else {
          this.coinPicUrl = ''
        }
      }
    },
    TokenAmount,
    goToProject(farm:any){
        this.$router.push({
           path: '/fertilizer/project/?f=' + farm.slug
       })
    },
    async updateLabelizedAmms()
    {
      this.labelizedAmms = {};
      let responseData2 = {};
      let responseData
      try{
        responseData = await fetch(
          'https://api.cropper.finance/farms/'
        ).then(res => res.json());
      }
      catch{
        // dummy data
        responseData = [{"ammID":"ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF","labelized":true},{"ammID":"8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo","labelized":true}]
      }
      finally{
        responseData.forEach(async (element:any) => {
          if(element.pfo == true){

            element.calculateNextStep = 'Bla bla bla'

            this.labelizedAmms[element.slug] = element;
            try{
              responseData2 = await fetch(
                'https://api.cropper.finance/pfo/?farmId='+ this.labelizedAmms[element.slug].pfarmID + '&t='+ Math.round(moment().unix()/60)
              ).then(res => res.json());
            }
            catch{
            }
            finally{
              this.labelizedAmms[element.slug]['followers'] = Object.keys(responseData2).length;
              this.nbFarmsLoaded++;
            }
          }

        });
      }
    },

    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

  }
})
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.card-body {
  padding: 0;
  margin: 0;
}
.radioButtonStyle {
  width: 50%;
  text-align: center;
}

.btncontainer {
  background: linear-gradient(91.9deg, rgba(19, 236, 171, 0.8) -8.51%, rgba(200, 52, 247, 0.8) 110.83%);
  display: inline-block;
  width: unset;
  text-align: center;
  position: relative;
  max-width: 400px;
  margin: 10px auto;
  padding: 2px;
  border-radius: 30px;
  max-height: 50px;

  button{
    background:#000 !important;
    position: relative;
    border-radius: 30px;
    border-color: transparent;
  }

}



.fertilizer .list{
  text-align:center;

  .pf-record .pf-record-content{
    padding:0;
  }

  .singleFarm{
    width:calc(33.33333333% - 20px);
    display:inline-block;
    vertical-align:top;
    border-bottom:none !important;
    position:relative;
    margin:0 10px 20px 10px;
    background:#000;
    border-radius:25px;



    .labelaner{
        background:#16edac;
        background:linear-gradient(180deg, #16edac 0%, #14bb89 100%);
        color:#fff;
        padding:10px 0;
        border-radius: 25px 25px 0 0;
    }

    .addPadding{
      padding: 0 10px 20px
    }


    .btncontainer {
      background: linear-gradient(91.9deg, rgba(19, 236, 171, 0.8) -8.51%, rgba(200, 52, 247, 0.8) 110.83%);
      display: inline-block;
      width: unset;
      text-align: center;
      position: relative;
      max-width: 400px;
      margin: 10px auto;
      padding: 2px;
      border-radius: 30px;
      max-height: 50px;
      font-size:16px;
      cursor: pointer;
      cursor: hand;

      button{
        background:#000 !important;
        position: relative;
        border-radius: 30px;
        padding:5px 10px;
        border-color: transparent;
        cursor: pointer;
        cursor: hand;
      }

    }


    .banner{
      height:132px;
      position:relative;
      overflow:hidden;

      .large{
        background:#f00;
        height:140px;
        min-width:100%;
        left:50%;
        top:50%;
        position:absolute;
        object-fit: cover;
        transform:translate(-50%,-50%)
      }
    }

    .followerscount{
      text-align: right;
      font-weight: normal;
      font-size: 24px;
      color:#fff;
      margin-top:40px;

      span{
        color:#16edac
      }
    }

    .title{
      text-align:left;
      font-weight: normal;
      font-size: 17px;    
      margin-top: 48px;
    }

    .desc{
      font-size: 14px;
      text-align:left;
      min-height:90px;
    }

    .ant-col{
      padding:0 10px 5px 10px;
    }

    .small{
      width: 70px;
      border: 4px solid #000;
      border-radius:50%;
      top:181px;
      z-index:2;
      left:50%;
      position:absolute;
      background:#000;
      transform:translate(-50%,-50%)
    }

    .info{
      color:#fff
    }

    .icons img{
      max-height:24px;
    }
  } 
}

@media (max-width: 700px){
    .singleFarm{
        width:calc(100% - 20px) !important
    }

    .fertilizer.cont {
      max-width: 95%;
    }
}


</style>

<style lang="less">


.farm {

  .page-head .title{
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .farm-head {
    padding: 24px 32px !important;
  }

  .ant-collapse-header {
    padding: 0 !important;

    .farm-head {
      padding: 24px 32px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid #1c274f;
    background-color: rgba(0, 0, 0, 0.9471) !important;
  
  }
}

.ant-alert-warning {
  width: 500px;
  margin-top: 30px;
  background-color: transparent;
  border: 1px solid #85858d;

  .anticon-close {
    color: #fff;
  }
}



.fertilizer.cont {
  max-width: calc(100% - 80px);
  background: #1B2028;
  margin-left:auto;
  margin-right:auto;
  margin-top:20px;
  margin-bottom:20px;
  padding:15px;

  .page-head .title{
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    &::after{
      content: 'βETA';
      position: absolute;
      left: 100%;
      top: -9px;
      font-style: italic;
      color: #ccc;
      font-weight: normal;
      font-size: 11px;
    }
  }

  .farm-head {
    padding: 24px 32px !important;
  }

}

main{
  background-color:#000;
  background-image:unset;
  background-size:cover;
  background-position:center bottom;
}

.ant-table-thead > tr > th.ant-table-column-sort {
  background: transparent;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  color: #fff;
  background: #1c274f;
  border: 1px solid #d9d9d9;
  box-shadow: none;
  border-left-width: 0;
}
.ant-radio-button-wrapper {
  color: #aaa;
  background: transparent;
  // border: 1px solid #d9d9d9;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
  border: 1px solid #d9d9d9;
  box-shadow: none;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):first-child {
  border: 1px solid #d9d9d9;
}
.input-search{
  border-radius: 5px;
}
.pf-arrow{
    text-align: right;
}
.pf-record{
    background-color: #000;
    border-bottom: 1px solid #d9d9d9;

    .pf-record-content{
      padding: 36px 32px 56px 32px;
    }
}
</style>
