<template>
  <div>

    <div  class="fertilizeruniq cont" v-if="initialized">

      <div v-for="farm in labelizedAmms" :key="farm.ammId" slot="header" class="pf-record" :class="isMobile ? 'is-mobile card' : ' card'" :gutter="0">
       
       <TwitterRetweetReg
        :farm="farm"
        :show="registerTwitterRetweet"
        @onClose="() => {
          registerTwitterRetweet = false;
          updateFarms();
          }"
      />

       <div class="card-body" style="grid-row-gap: 0; row-gap: 0; padding-bottom: 15px">

          <div class="followerscount"><img src="@/assets/right-user.png" width="28" height="26" /> Follower <span>{{followerCount}}</span> </div>

          <Row class="full-border">
            <Col :span="24" class="">
              <div>
                <img width="100%" :src="farm.links.banner" />
              </div>
            </Col>
          </Row>


          <Row class="full-border pf-margin-top pf-padding-top"  :span="isMobile ? 24 : 12">
            <Col :span="isMobile ? 24 : 12" class="notstep">

              <div class="modTitle">
                <span class="icons">
                  <CoinIcon :mint-address="farm.tokenA.mint" />
                  <CoinIcon :mint-address="farm.tokenB.mint" />
                </span>

                {{farm.tokenA.symbol}} - {{farm.tokenB.symbol}}
              </div>


              <div class="walContent">
                <div class="rewardAmount"><span>Total Airdrop allocated :</span> <b>{{farm.airdrop.amount}} {{farm.airdrop.symbol}}
                  <CoinIcon :mint-address="farm.airdrop.mint" /></b></div>


                <div class="rewardNFT" v-if="farm.nft_airdrop"><span>{{farm.nft_airdrop.info}} </span>
                  <b v-for="nft in farm.nft_airdrop.list" :key="nft.picto"><img :src="nft.picto" /> {{nft.info}}</b></div>

                <div class="airdropInfo"><img src="@/assets/info.png" width="22" height="22" /> {{farm.airdrop.info}}</div>

                <div class="infoTickets" v-if="farm.pla_end_ts > currentTimestamp && isRegistered">
                  You’ve well registered into the whithelist.<br />
                  You have {{registeredDatas.submit}} lottery ticket{{registeredDatas.submit > 1 ? 's' : ''}} !
                </div>
                <div class="infoTickets" v-else-if="farm.pla_end_ts < currentTimestamp && isRegistered">

                    <span v-if="farm.airdrop.status == 'lottery'" >
                      You’ve well registered into the whithelist.<br />
                      You have {{registeredDatas.submit}} lottery ticket{{registeredDatas.submit > 1 ? 's' : ''}} !
                    </span>
                    <span v-else-if="registeredDatas.won == 0 && registeredDatas.won_nft == 0" >
                      You have {{registeredDatas.won}}/{{registeredDatas.submit}} winning ticket{{registeredDatas.won > 1 ? 's' : ''}}<br/>
                    </span>
                    <span v-else-if="registeredDatas.won" >
                      Congratulation! Airdrop winner
                      <div class="airdropWinner">{{farm.airdrop.singleValue}} {{farm.airdrop.symbol}} <CoinIcon :mint-address="farm.airdrop.mint" /></div>
                    </span>
                    <span v-else-if="registeredDatas.won_nft" >
                      Congratulation! NFT winner
                      <div class="nftWinner"><img :src="registeredDatas.won_nft" /> x1</div>
                    </span>

                </div>
              </div>



              <div class="text-center">

                  <div class="largepdding" v-if="!wallet.connected"> 
                    <div class="btncontainer">
                      <Button
                        size="large"
                        ghost
                        class="button_div"
                        style="z-index: 999; width: 100%"
                        @click="$accessor.wallet.openModal"
                      >
                        Connect wallet
                      </Button>
                    </div>
                  </div>

                  <div v-else-if="farm.pla_ts > currentTimestamp && !followed" class="largepdding">
                    <div class="share text-center">
                        <div class="btncontainer">
                          <Button
                            size="large"
                            ghost
                            class="button_div"
                            style="z-index: 999; width: 100%"
                            @click="startFollow('https://api.cropper.finance/pfo/follow/?spl='+ $accessor.wallet.address +'&farmId='+ farm.pfarmID)"
                          >
                             + Follow
                          </Button>
                        </div>

                    </div>
                  </div>
                  <div v-else-if="farm.pla_ts > currentTimestamp && followed" class="largepdding">
                    <div class="share text-center">

                      You are following this project

                    </div>
                  </div>

                  <div v-else-if="farm.pla_end_ts > currentTimestamp && isRegistered">
                    <div class="share">
                    Share your referal link to earn more lottery ticket

                    <div class="inputContent">
                      <button class="submitbutton" @click="copyToClipboard()">Copy</button>
                      <input type="text" class="twlink" :value="shareWalletAddress" />
                    </div>

                    <a :href="tgShareAdress" target="_blank" class="sharer">
                      <img src="@/assets/icons/telegram.svg" height="39" width="39" />
                    </a>

                    <a :href="twShareAdress" target="_blank" class="sharer">
                      <img src="@/assets/icons/twitter.svg" height="39" width="39" />
                    </a>


                    </div>
                  </div>

                  <div v-else-if="farm.pla_end_ts > currentTimestamp" class="largepdding">
                  <div class="btncontainer">
                    <Button
                      size="large"
                      ghost
                      class="button_div"
                      style="z-index: 999; width: 100%"
                      @click="startRegistering()"
                    >
                      + Register for Whitelist
                    </Button>
                  </div>
                  </div>
                  <div v-else-if="farm.pla_end_ts < currentTimestamp && !isRegistered" class="airdropStatus">
                    You did not participate, please wait for the public opening
                  </div>
                  <div v-else-if="farm.pla_end_ts < currentTimestamp" class="airdropStatus">
                    <span v-if="farm.airdrop.status == 'lottery'" >
                      Lottery in progress...
                    </span>
                    <span v-else-if="farm.airdrop.status == 'in progress'" >
                      Prize distribution in progress...
                    </span>
                    <span v-else-if="farm.airdrop.status == 'done'" >
                      Prize distribution complete
                    </span>
                  </div>
                  <div v-else-if="farm.pfrom_ts < currentTimestamp">
                    <h1>
                      You can use below farm now.
                    </h1>
                  </div>
              </div>


            </Col>
            <Col :span="isMobile ? 24 : 12" :class="isMobile ? ' steps' : 'steps'">

                <div class="done" >
                    <span class="span first"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                   <div><b class="t">Initialisation</b> - This project is in preparation phase. Stay tuned.</div>
                </div>

                <div :class="farm.pla_ts < currentTimestamp ? 'done' : 'notdone' " >
                    <span v-if="farm.pla_ts > currentTimestamp">2</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div><b class="t">Withelist</b> - You can now whitelist yourself for the lottery.
                    <div class="date"> {{farm.pla}} </div></div>
                </div>
                <div :class="farm.pla_end_ts < currentTimestamp ? 'done' : 'notdone' ">
                    <span v-if="farm.pla_end_ts > currentTimestamp">3</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div><b class="t">Airdrop Lottery</b> - See if you have any winning lottery tickets.<br/>
                    <div class="date"> {{farm.pla_end}} </div></div>
                </div>
                <div :class="farm.pfrom_ts < currentTimestamp ? 'done' : 'notdone' ">
                    <span v-if="farm.pfrom_ts > currentTimestamp">4</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span> 
                    <div><b class="t">Private Farm</b> - You can now stack LP in {{farm.tokenA.symbol}}-{{farm.tokenB.symbol}} farm.<br/>
                    <div class="date"> {{farm.pfrom}} </div></div>
                </div>
                <div :class="farm.pto_ts < currentTimestamp ? 'done' : 'notdone' ">
                    <span v-if="farm.pto_ts > currentTimestamp">5</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div><b class="t">Public Farm</b> - {{farm.tokenA.symbol}}-{{farm.tokenB.symbol}} farm goes public<br/>
                    <div class="date"> {{farm.pto}} </div></div>
                </div>
            </Col>
          </Row>
        </div>
      </div>

    </div>

    <div v-for="farm in showFarms" :key="farm.farmInfo.poolId">
      <div v-if="farm.labelized.pfrom_ts < currentTimestamp && isRegistered" class="farm container">
        <div class="card">
          <div class="card-body">
            <Collapse v-model="showCollapse" expand-icon-position="right">
              <CollapsePanel
                v-for="farm in showFarms"
                v-show="true"
                :key="farm.farmInfo.poolId"
                :show-arrow="poolType"
              >
                <Row slot="header" class="farm-head" :class="isMobile ? 'is-mobile' : ''" :gutter="0">
                    <div v-if="farm.labelized" class="labelized">LABELIZED</div>
                  <Col class="lp-icons" :span="isMobile ? 12 : 8">

                    <div v-if="currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="label ended"> Ended </div>
                    <div v-if="currentTimestamp < farm.farmInfo.poolInfo.start_timestamp && currentTimestamp < farm.farmInfo.poolInfo.end_timestamp" class="label soon"> Soon </div>


                    <div class="icons">
                      <CoinIcon :mint-address="farm.farmInfo.lp.coin.mintAddress" />
                      <CoinIcon :mint-address="farm.farmInfo.lp.pc.mintAddress" />
                    </div>
                    {{ isMobile ? farm.farmInfo.lp.symbol : farm.farmInfo.lp.name }}
                  </Col>
                  <Col class="state" :span="isMobile ? 6 : 4">
                    <div class="title">{{ isMobile ? 'Reward' : 'Pending Reward' }}</div>
                    
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value"> - </div>
                    <div v-else class="value">{{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}</div>
                  </Col>
                  <Col v-if="!isMobile" class="state" :span="4">
                    <div class="title">Staked 
                      <Tooltip placement="right" v-if="wallet && !(farm.farmInfo.poolInfo.start_timestamp > currentTimestamp || currentTimestamp > farm.farmInfo.poolInfo.end_timestamp) && farm.farmInfo.currentLPtokens > 0.001">
                        <template slot="title">
                          <div>
                            You got {{farm.farmInfo.currentLPtokens}} unstaked
                          </div>
                        </template>
                        <Icon type="question-circle" style="color:#f00" />
                      </Tooltip>
                      </div>
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="value"> - </div>
                    <div v-else class="value">
                      {{ !wallet.connected ? 0 : farm.userInfo.depositBalance.format() }}
                    </div>
                  </Col>
                  <Col class="state" :span="isMobile ? 6 : 4">
                    <div class="title">Total Apr 
                      <Tooltip placement="right" v-if="!(farm.farmInfo.poolInfo.start_timestamp > currentTimestamp || currentTimestamp > farm.farmInfo.poolInfo.end_timestamp)">
                        <template slot="title">
                          <div>
                            Farm APR : {{farm.farmInfo.apr_details.apr}}%<br />
                            Fees : {{farm.farmInfo.apr_details.apy}}%
                          </div>
                        </template>
                        <Icon type="question-circle" />
                      </Tooltip>
                    </div>
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp || currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="value"> - </div>
                    <div v-else class="value">{{ farm.farmInfo.apr }}%</div>
                  </Col>
                  <Col v-if="!isMobile && poolType" class="state" :span="4">
                    <div class="title">Liquidity</div>
                    <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp || currentTimestamp > farm.farmInfo.poolInfo.end_timestamp" class="value"> - </div>
                    <div v-else class="value">
                      ${{
                        Math.round(farm.farmInfo.liquidityUsdValue)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }}
                    </div>
                  </Col>
                  <Col v-if="!isMobile && !poolType" class="state" :span="4">
                    <Button v-if="!wallet.connected" size="large" ghost @click.stop="$accessor.wallet.openModal">
                      Connect Wallet
                    </Button>
                    <div v-else class="fs-container">
                      <Button
                        :disabled="!wallet.connected || farm.userInfo.depositBalance.isNullOrZero()"
                        size="large"
                        ghost
                        @click.stop="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                      >
                        Harvest & Unstake
                      </Button>
                    </div>
                  </Col>
                </Row>

                <Row v-if="poolType" :class="isMobile ? 'is-mobile' : ''" :gutter="48">
                  <Col :span="isMobile ? 24 : 4">
                  </Col>

                  <Col :span="isMobile ? 24 : 10">
                    <div class="harvest">
                      <div class="title">Pending Reward</div>
                      <div class="pending fs-container">
                        <div class="reward">
                          <div class="token">{{ farm.farmInfo.reward.symbol }} {{ !wallet.connected ? 0 : farm.userInfo.pendingReward.format() }}</div>
                        </div>
                        <div class="btncontainer">
                          <Button
                            size="large"
                            ghost
                            :disabled="!wallet.connected || harvesting || farm.userInfo.pendingReward.isNullOrZero()"
                            :loading="harvesting"
                            @click="harvest(farm.farmInfo)"
                          >
                            Harvest
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>

                  <Col :span="isMobile ? 24 : 10">
                    <div class="start">
                      <div class="title">Start farming</div>
                      <div v-if="!wallet.connected" @click="$accessor.wallet.openModal" class="btncontainer">
                      <Button size="large" ghost>
                        Connect Wallet
                      </Button>
                      </div>
                      <div v-else class="fs-container">
                        <div class="btncontainer" v-if="!farm.userInfo.depositBalance.isNullOrZero()">
                        <Button
                          class="unstake"
                          size="large"
                          ghost
                          @click="openUnstakeModal(farm.farmInfo, farm.farmInfo.lp, farm.userInfo.depositBalance)"
                        >
                          <Icon type="minus" />
                        </Button>
                        </div>
                        <div class="btncontainer" v-if="currentTimestamp < farm.farmInfo.poolInfo.end_timestamp && farm.farmInfo.poolInfo.start_timestamp < currentTimestamp">
                          <Button
                            size="large" 
                            ghost 
                            :disabled="!farm.farmInfo.poolInfo.is_allowed || 
                                        farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp"
                            @click="openStakeModal(farm.farmInfo, farm.farmInfo.lp)">
                            {{
                              (!farm.farmInfo.poolInfo.is_allowed)?"Not Allowed":
                              (currentTimestamp > farm.farmInfo.poolInfo.end_timestamp?"Ended":
                              farm.farmInfo.poolInfo.start_timestamp > currentTimestamp?"Unstarted":"Stake")
                            }}
                          </Button>
                        </div>

                        <div class="btncontainer" v-if="currentTimestamp < farm.farmInfo.poolInfo.end_timestamp && farm.farmInfo.poolInfo.start_timestamp < currentTimestamp && farm.farmInfo.currentLPtokens > 0.001">
                          <Button
                            size="large" 
                            ghost 
                            :disabled="!farm.farmInfo.poolInfo.is_allowed || 
                                        farm.farmInfo.poolInfo.end_timestamp < currentTimestamp ||
                                        farm.farmInfo.poolInfo.start_timestamp > currentTimestamp"
                            @click="openStakeModalLP(farm.farmInfo, farm.farmInfo.lp)">
                            {{
                              (!farm.farmInfo.poolInfo.is_allowed)?"Not Allowed":
                              (currentTimestamp > farm.farmInfo.poolInfo.end_timestamp?"Ended":
                              farm.farmInfo.poolInfo.start_timestamp > currentTimestamp?"Unstarted":"Stake LP")
                            }}
                          </Button>
                        </div>

                        <div v-if="farm.farmInfo.poolInfo.start_timestamp > currentTimestamp" class="unstarted">
                          <div class="token">
                             {{ getCountdownFromPeriod(farm.farmInfo.poolInfo.start_timestamp - currentTimestamp) }}
                          </div>
                        </div>

                        <div class="btncontainer" v-if="farm.farmInfo.poolInfo.owner.toBase58() == wallet.address && farm.farmInfo.poolInfo.is_allowed && currentTimestamp < farm.farmInfo.poolInfo.end_timestamp">
                          <Button size="large" ghost @click="openAddRewardModal(farm)">
                            Add Reward
                          </Button>
                        </div>
                        <div class="btncontainer" v-if="farm.farmInfo.poolInfo.owner.toBase58() == wallet.address && !farm.farmInfo.poolInfo.is_allowed && currentTimestamp < farm.farmInfo.poolInfo.end_timestamp">
                          <Button size="large" ghost @click="payFarmFee(farm)">
                            Pay Farm Fee
                          </Button>
                        </div>
                      </div>

                        <div class="btncontainer">
                          <a target="_blank" :href=farm.farmInfo.twitterShare>
                            <Button size="large" ghost>   
                              Share
                            </Button>
                          </a>
                        </div>
                    </div>
                  </Col>
                </Row>
              </CollapsePanel>
            </Collapse>
            <div style="text-align: center; width: 100%">
              <div style="width: 80%; display: inline-block">
                <Pagination :total="totalCount" :showTotal="(total, range) => `${range[0]}-${range[1]} of ${total} items`" :pageSize="pageSize" :defaultCurrent="1" v-model="currentPage">
                </Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import importIcon from '@/utils/import-icon'
import { Collapse, Col, Radio, Select, Row, Switch as Toggle, Pagination } from 'ant-design-vue'
import { get, cloneDeep } from 'lodash-es'
import { TokenAmount } from '@/utils/safe-math'
import { FarmInfo } from '@/utils/farms'
import { deposit, withdraw } from '@/utils/stake'
import { getUnixTs } from '@/utils'
import { getBigNumber } from '@/utils/layouts'
import { LiquidityPoolInfo, LIQUIDITY_POOLS } from '@/utils/pools'
import moment from 'moment'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { PAY_FARM_FEE, YieldFarm } from '@/utils/farm'
import { PublicKey } from '@solana/web3.js'
import { DEVNET_MODE, FARM_PROGRAM_ID } from '@/utils/ids'
import { TOKENS, NATIVE_SOL } from '@/utils/tokens'
import { addLiquidity, removeLiquidity } from '@/utils/liquidity'
const CollapsePanel = Collapse.Panel
const RadioGroup = Radio.Group
const RadioButton = Radio.Button


export default Vue.extend({
  components: {
    //Toggle,
    //Collapse,
    //CollapsePanel,
    //Spin,
   // Icon,
    Col,
    Row,
    //Select,
    //Pagination
  },

//    ,
//    RadioGroup,
//    RadioButton

  data() {
    return {
      isMobile: false,
      ammId : '',
      farms: [] as any[],
      showFarms:[] as any[],
      searchName:"",
      followerCount: 0,
      registeringProcess: false,
      followed: false,
      coinPicUrl : '',
      lp: null,
      isRegistered: false,
      registeredDatas: false,
      shareWalletAddress: '',
      twShareAdress: '',
      tgShareAdress: '',
      rewardCoin: null,
      farmInfo: null as any,
      harvesting: false,
      stakeModalOpening: false,
      addRewardModalOpening: false,
      staking: false,
      coinName: '',
      mintAddress : '',
      adding: false,
      paying: false,
      unstakeModalOpening: false,
      unstaking: false,
      poolType: true,
      endedFarmsPoolId: [] as string[],
      showCollapse: [] as any[],
      currentTimestamp: 0,
      tempInfo:null as any,
      stakeLPError : false,
      initialized : false,
      labelizedAmms:{} as any,
      nbFarmsLoaded: 0,
      certifiedOptions:[{value:0,label:"Labelized"},{value:1,label:"Permissionless"},{value:2,label:"All"}],
      lifeOptions:[{value:0,label:"Opened"},{value:1,label:"Future"},{value:2,label:"Ended"},{value:3,label:"All"}],
      searchCertifiedFarm:0,
      searchLifeFarm:0,
      stakedOnly:false,
      totalCount:110,
      pageSize:10,
      currentPage:1,
      current: 0,
      registerTwitterRetweet : false
    }
  },

  head: {
    title: 'CropperFinance x ... '
  },


  computed: {
    ...mapState(['app', 'wallet', 'farm', 'url', 'price', 'liquidity'])
  },

  watch: {
    'wallet.tokenAccounts': {
      handler(newTokenAccounts: any) {
       // this.updateFarms()
        this.updateCurrentLp(newTokenAccounts)
      },
      deep: true
    },

    showCollapse: {
      handler() {
        if (!this.poolType && this.showCollapse.length > 0) {
          this.showCollapse.splice(0, this.showCollapse.length)
        }
      },
      deep: true
    },
    searchName:{
      handler(newSearchName:string) {
        this.filterFarms(newSearchName);
      },
      deep: true
    }
  },

  mounted() {

    this.updateFarms()

    var hash = window.location.hash;
    if (hash) {
      hash = hash.substring(1);
      this.searchName = hash;
    } else {
      const query = new URLSearchParams(window.location.search);
      this.searchName = query.get('s') as string;
    }

    let timer = setInterval(async () => {
      if (this.nbFarmsLoaded == Object.keys(this.labelizedAmms).length) {
        this.initialized = true
      }

    }, 1000)


  },

  methods: {
    moment,
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
    copyToClipboard(){
      var textField = document.createElement('textarea')
      textField.innerText = this.shareWalletAddress
      document.body.appendChild(textField)
      textField.select()
      document.execCommand('copy')
      textField.remove()
    },
    startRegistering(){
        this.registerTwitterRetweet = true;
    },
    async startFollow(u: any){
        let responseData
        try{
          responseData = await fetch(u).then(res => res.json());
        }
        catch{
          // dummy data
          responseData = [{"ammID":"ADjGcPYAu5VZWdKwhqU3cLCgX733tEaGTYaXS2TsB2hF","labelized":true},{"ammID":"8j7uY3UiVkJprJnczC7x5c1S6kPYQnpxVUiPD7NBnKAo","labelized":true}]
        }
        finally{
          this.followed = true;
          this.updateFarms();
        }
    },
    TokenAmount,

    async updateLabelizedAmms()
    {
      const query = new URLSearchParams(window.location.search);
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

            if(query.get('f') && element.slug == query.get('f')){
              element.calculateNextStep = 'Bla bla bla'
              this.ammId = element.ammID
              this.labelizedAmms[element.ammID] = element;
              try{
                responseData2 = await fetch(
                  'https://api.cropper.finance/pfo/?farmId='+ this.labelizedAmms[element.ammID].pfarmID + '&t='+ Math.round(moment().unix()/60)
                ).then(res => res.json());
              }
              catch{
              }
              finally{
                this.labelizedAmms[element.ammID]['followers'] = Object.keys(responseData2).length;
                this.followerCount = Object.keys(responseData2).length;


                //this.labelizedAmms[element.ammID].twitterShare = `http://twitter.com/share?text=Earn ${this.labelizedAmms[element.ammID].tokenA.symbol} with our new farm on @CropperFinance&url=https://cropper.finance?s=${newFarmInfo.poolId} &hashtags=${this.labelizedAmms[element.ammID].tokenA.symbol},${this.labelizedAmms[element.ammID].tokenB.symbol},yieldfarming,Solana`

                    document.title = 'Fertilizer - CropperFinance x ' + element.name ;

                this.nbFarmsLoaded++;
              }
            }
          }

        });
      }
    },

    async updateFarms() {
      await this.updateLabelizedAmms();
      this.currentTimestamp = moment().unix();
      const farms: any = []
      const endedFarmsPoolId: string[] = []
      for (const [poolId, farmInfo] of Object.entries(this.farm.infos)) {
        let userInfo = get(this.farm.stakeAccounts, poolId)

        // @ts-ignore
        const { reward_per_share_net, reward_per_timestamp, last_timestamp } = farmInfo.poolInfo

        // @ts-ignore
        const { reward, lp } = farmInfo



        let newFarmInfo:any = cloneDeep(farmInfo)

        let isPFO = false;

        if (reward && lp) {
          const rewardPerTimestampAmount = new TokenAmount(getBigNumber(reward_per_timestamp), reward.decimals)
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)


        
          const rewardPerTimestampAmountTotalValue =
            getBigNumber(rewardPerTimestampAmount.toEther()) *
            2 *
            60 *
            60 *
            24 *
            365 *
            this.price.prices[reward.symbol as string]

          const liquidityCoinValue =
            getBigNumber((liquidityItem?.coin.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.coin.symbol as string]
          const liquidityPcValue =
            getBigNumber((liquidityItem?.pc.balance as TokenAmount).toEther()) *
            this.price.prices[liquidityItem?.pc.symbol as string]
          const liquidityTotalValue = liquidityPcValue + liquidityCoinValue
          
          const liquidityTotalSupply = getBigNumber((liquidityItem?.lp.totalSupply as TokenAmount).toEther())
          const liquidityItemValue = liquidityTotalValue / liquidityTotalSupply
          let liquidityUsdValue = getBigNumber(lp.balance.toEther()) * liquidityItemValue;
          let apr = ((rewardPerTimestampAmountTotalValue / liquidityUsdValue) * 100).toFixed(2)
          if(apr === "NaN" || apr === "Infinity"){
            apr = "0";
          }
          if(isNaN(liquidityUsdValue)){
            liquidityUsdValue = 0;
          }
          // @ts-ignore
          newFarmInfo.apr = apr

          // @ts-ignore
          newFarmInfo.liquidityUsdValue = liquidityUsdValue

          if (rewardPerTimestampAmount.toEther().toString() === '0') {
            //endedFarmsPoolId.push(poolId)
          }
        }

        if (userInfo && lp) {
          userInfo = cloneDeep(userInfo)

          const { rewardDebt, depositBalance } = userInfo
          const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
          const currentTimestamp = this.currentTimestamp;
          const duration = currentTimestamp - last_timestamp.toNumber();
          const rewardPerShareCalc = reward_per_share_net.toNumber() + 1000000000 * reward_per_timestamp.toNumber() * duration / liquidityItem.lp.totalSupply.wei.toNumber();
          
          const pendingReward = depositBalance.wei
            .multipliedBy(getBigNumber(rewardPerShareCalc))
            .dividedBy(1e9)
            .minus(rewardDebt.wei)
          userInfo.pendingReward = new TokenAmount(pendingReward, rewardDebt.decimals)
        } else {
          userInfo = {
            // @ts-ignore
            depositBalance: new TokenAmount(0, farmInfo.lp.decimals),
            // @ts-ignore
            pendingReward: new TokenAmount(0, farmInfo.reward.decimals)
          }
        }

        if((newFarmInfo as any).poolInfo.is_allowed > 0 || 
          (newFarmInfo as any).poolInfo.owner.toBase58() === this.wallet.address){
          let labelized = false;
          if(lp){
            const liquidityItem = get(this.liquidity.infos, lp.mintAddress)
            if(this.labelizedAmms[liquidityItem.ammId]){
              labelized = this.labelizedAmms[liquidityItem.ammId];
              if(labelized){
                if(this.labelizedAmms[liquidityItem.ammId].pfo == true && newFarmInfo.poolId == this.labelizedAmms[liquidityItem.ammId].pfarmID){       
                  const query = new URLSearchParams(window.location.search);
                  if(query.get('f') && this.labelizedAmms[liquidityItem.ammId].slug == query.get('f')){
                    isPFO = true;

                     newFarmInfo.twitterShare = `http://twitter.com/share?text=Earn ${newFarmInfo.reward.name} with our new farm on @CropperFinance&url=https://cropper.finance?s=${newFarmInfo.poolId} &hashtags=${newFarmInfo.lp.coin.symbol},${newFarmInfo.lp.pc.symbol},yieldfarming,Solana`


                    farms.push({
                      labelized,
                      userInfo,
                      farmInfo: newFarmInfo
                    })

                    document.title = 'Fertilizer - CropperFinance x ' + this.labelizedAmms[liquidityItem.ammId].name ;

                    let responseData
                    try{
                      responseData = await fetch(
                        'https://api.cropper.finance/pfo/?farmId='+ this.labelizedAmms[liquidityItem.ammId].pfarmID + '&t='+ Math.round(moment().unix()/60)
                      ).then(res => res.json());
                    }
                    catch{
                    }
                    finally{
                      if(responseData[this.wallet.address]){
                        if(responseData[this.wallet.address].submit > 0){
                          this.isRegistered = true;
                          this.registeredDatas = responseData[this.wallet.address];
                          this.shareWalletAddress = "http://cropper.finance/fertilizer/project/?f=" + this.labelizedAmms[liquidityItem.ammId].slug + "&r=" + this.wallet.address;

                        }

                        this.followed = true;
                        
                      }
                      this.followerCount = Object.keys(responseData).length;
                    }

                  }
                }
              }
            }
          }
        } 
      }



      let responseData
      try{
        responseData = await fetch(
          'https://api.cropper.finance/pfo/?farmId='+ this.labelizedAmms[this.ammId].pfarmID + '&t='+ Math.round(moment().unix()/60)
        ).then(res => res.json());
      }
      catch{
      }
      finally{
        if(responseData[this.wallet.address]){
          if(responseData[this.wallet.address].submit > 0){
            this.isRegistered = true;
            this.registeredDatas = responseData[this.wallet.address];
            console.log(this.registeredDatas);
            this.shareWalletAddress = "http://cropper.finance/fertilizer/project/?f=" + this.labelizedAmms[this.ammId].slug + "&r=" + this.wallet.address;
            let shareWalletAddressEsc = "http://cropper.finance/fertilizer/project/?f=" + this.labelizedAmms[this.ammId].slug + "%26r=" + this.wallet.address;

            this.twShareAdress = `http://twitter.com/share?text=Register for whishlist ${document.title}&url=${shareWalletAddressEsc} &hashtags=${this.labelizedAmms[this.ammId].tokenA.symbol},${this.labelizedAmms[this.ammId].tokenB.symbol},fertilizer,Solana,Airdrop`

            this.tgShareAdress = `https://telegram.me/share/url?text=Register for whishlist ${document.title}&url=${shareWalletAddressEsc} `

          }
          this.followed = true; 
        }
        this.followerCount = Object.keys(responseData).length;
      }

      this.farms = farms.sort((a: any, b: any ) => (b.farmInfo.liquidityUsdValue - a.farmInfo.liquidityUsdValue));
      this.endedFarmsPoolId = endedFarmsPoolId
      this.filterFarms(this.searchName);

/*
      if(Object.keys(this.farms).length < 1 && Object.keys(this.labelizedAmms).length > 0){
        this.$router.push({
           path: '/fertilizer/'
       })
      }
*/
    },
    filterFarms(searchName:string){
      this.showFarms = this.farms;

      //filter for not allowed farms
      this.showFarms = this.showFarms.filter((farm:any)=>
                                              farm.farmInfo.poolInfo.is_allowed > 0 || 
                                              (farm.farmInfo.poolInfo.owner.toBase58() === this.wallet.address &&
                                              farm.farmInfo.poolInfo.is_allowed === 0));

      if(searchName != "" && searchName != null && this.farms.filter((farm:any)=>farm.farmInfo.poolId.toLowerCase() == searchName.toLowerCase())){
        this.showFarms = this.farms.filter((farm:any)=>farm.farmInfo.poolId.toLowerCase() == searchName.toLowerCase());
      } else if(searchName != "" && searchName != null){
        this.showFarms = this.farms.filter((farm:any)=>farm.farmInfo.lp.symbol.toLowerCase().includes(searchName.toLowerCase()));
      }
    },

    updateCurrentLp(newTokenAccounts: any) {
      if (this.lp) {
        const coin = cloneDeep(this.lp)
        // @ts-ignore
        const lpBalance = get(newTokenAccounts, `${this.lp.mintAddress}.balance`)
        // @ts-ignore
        coin.balance = lpBalance

        this.lp = coin
      }
    },

    openStakeModal(poolInfo: FarmInfo, lp: any) {
      /*
      const coin = cloneDeep(lp)
      const lpBalance = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
      coin.balance = lpBalance

      this.lp = coin
      */
      this.farmInfo = cloneDeep(poolInfo)
      const coinBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.balance`)
      const pcBalance = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.balance`)
      this.farmInfo.lp.coin.balance = coinBalance;
      this.farmInfo.lp.pc.balance = pcBalance;
      this.stakeModalOpening = true
    },
    openAddRewardModal(farm:any){
      const rewardCoin = farm.farmInfo.reward;
      const coin = cloneDeep(rewardCoin)
      const rewardBalance = get(this.wallet.tokenAccounts, `${rewardCoin.mintAddress}.balance`)
      coin.balance = rewardBalance

      this.rewardCoin = coin
      this.farmInfo = cloneDeep(farm.farmInfo)
      this.addRewardModalOpening = true
    },
    async addReward(amount:string){
      this.adding = true;
      const conn = this.$web3
      const wallet = (this as any).$wallet
      const rewardAccountAddress = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(this.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )
      
      if(fetchedFarm){
        //transfer reward amount
        let addRewardAmount:number = Number.parseFloat(amount);
        let userRwardTokenPubkey = new PublicKey(rewardAccountAddress);

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm.addReward(
          wallet,
          userRwardTokenPubkey,
          addRewardAmount * Math.pow(10,this.farmInfo.reward.decimals)
        )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Add ${amount} ${this.farmInfo.reward.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Adding Reward failed',
            description: error.message
          })
        })
        .finally(() => {
          this.adding = false
          this.addRewardModalOpening = false
        })
      }

    },
    async payFarmFee(farm:any){
      this.paying = true;
      const conn = this.$web3
      const wallet = (this as any).$wallet
      let key = "USDC";
      const usdcCoin = TOKENS[key];// to test. real - USDC
      const usdcAccountAddress = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.tokenAccountAddress`)
      const usdcBalance = get(this.wallet.tokenAccounts, `${usdcCoin.mintAddress}.balance`)
      if(usdcAccountAddress === undefined || usdcAccountAddress === ""){
        this.$notify.error({
            key,
            message: 'Paying farm fee failed',
            description: "Add USDC token in your wallet, please"
          });
        return;
      }

      // check balance if wallet has enough fee
      if(usdcBalance < PAY_FARM_FEE){
        this.$notify.error({
            key,
            message: 'Paying farm fee failed',
            description: "Your USDC balance is low than farm fee"
          });
        return;
      }

      let fetchedFarm = await YieldFarm.loadFarm(
        conn,
        new PublicKey(farm.farmInfo.poolId),
        new PublicKey(FARM_PROGRAM_ID)
      )
      
      if(fetchedFarm){
        //pay farm fee
        let userUSDCTokenPubkey = new PublicKey(usdcAccountAddress);

        const key = getUnixTs().toString()
        this.$notify.info({
          key,
          message: 'Making transaction...',
          description: '',
          duration: 0
        })
        fetchedFarm.payFarmFee(
          wallet,
          userUSDCTokenPubkey,
          PAY_FARM_FEE * Math.pow(10,usdcCoin.decimals)
        )
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Pay ${PAY_FARM_FEE} ${usdcCoin.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Paying farm fee failed',
            description: error.message
          })
        })
        .finally(() => {
          this.paying = false
        })
      }
    },
    supplyAndStake(fromCoinAmount: string,toCoinAmount: string,fixedCoin: string) {
      this.staking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet
      
      const poolInfo = get(this.liquidity.infos, this.farmInfo.lp.mintAddress)

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      // @ts-ignore
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`)
      // @ts-ignore
      const toCoinAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      });

      let txStatus = "";
      addLiquidity(
        conn,
        wallet,
        poolInfo,
        fromCoinAccount,
        toCoinAccount,
        lpAccount,
        this.farmInfo.lp.coin,
        this.farmInfo.lp.pc,
        fromCoinAmount,
        toCoinAmount,
        fixedCoin
      )
      .then(async (txid) => {
        this.$notify.info({
          key,
          message: 'Transaction has been sent',
          description: (h: any) =>
            h('div', [
              'Confirmation is in progress.  Check your transaction on ',
              h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
            ])
        })

        const description = `Add liquidity for ${fromCoinAmount} ${this.farmInfo.lp.coin?.symbol} and ${toCoinAmount} ${this.farmInfo.lp.pc?.symbol}`
        this.$accessor.transaction.sub({ txid, description })

        txStatus = this.$accessor.transaction.history[txid].status;
        let totalDelayTime = 0;
        while(txStatus === "Pending" && totalDelayTime < 10000){
          let delayTime = 500;
          await this.delay(delayTime);
          totalDelayTime += delayTime;
          txStatus = this.$accessor.transaction.history[txid].status;
          await this.delay(delayTime);
          totalDelayTime += delayTime;
        }
        if(txStatus === "Fail"){
          console.log("add lp failed")
          return;
        }
        //update wallet token account infos
        this.$accessor.wallet.getTokenAccounts();
        let delayForUpdate = 500;
        await this.delay(delayForUpdate);

        let amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
        if(amount){
          amount = amount.wei.toNumber() / Math.pow(10,amount.decimals);
        }
        else{
          amount = 0;
        }

        totalDelayTime = 0;
        while(amount <= 0 && totalDelayTime < 10000){ 
          let dealyTime = 200;
          await this.delay(dealyTime);
          totalDelayTime += dealyTime;
          amount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.balance`)
          if(amount){
            amount = amount.wei.toNumber() / Math.pow(10,amount.decimals);
          }
          else{
            amount = 0;
          }
        }

        if(amount <= 0){
          this.$notify.error({
            key,
            message: 'Add liquidity failed',
            description: "Added LP token amount is 0"
          })
          console.log("added lp amount is 0")
          return;
        }

        this.stakeLP(conn, wallet,this.farmInfo, lpAccount, rewardAccount, infoAccount, amount);
        
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: 'Add liquidity failed',
          description: error.message
        });
      })
      .finally(async () => {
      })
    },
    async stakeLP(conn:any, wallet:any,farmInfo:any,lpAccount:any, rewardAccount:any, infoAccount:any, amount:number){

      const key = getUnixTs().toString()

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, amount)
      .then((txid) => {
        this.$notify.info({
          key,
          message: 'Transaction has been sent',
          description: (h: any) =>
            h('div', [
              'Confirmation is in progress.  Check your transaction on ',
              h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
            ])
        })

        const description = `Stake ${amount} ${this.farmInfo.lp.name}`
        this.$accessor.transaction.sub({ txid, description })
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: 'Stake failed',
          description: error.message
        });
        this.tempInfo = {
          conn:conn,
          wallet:wallet,
          farmInfo:farmInfo,
          lpAccount:lpAccount,
          rewardAccount:rewardAccount,
          infoAccount:infoAccount,
          amount:amount
        };
        this.stakeLPError = true;
      })
      .finally(() => {
        this.staking = false
        this.stakeModalOpening = false
        this.farmInfo = null
      })
    },
    onRetryStakeLP(){
      this.stakeLPError = false;
      if(!this.tempInfo)
      {
        return;
      }

      this.stakeLP(this.tempInfo.conn,this.tempInfo.wallet,this.tempInfo.farmInfo,this.tempInfo.lpAccount,this.tempInfo.rewardAccount,this.tempInfo.infoAccount,this.tempInfo.amount);
      this.tempInfo = null;
    },
    onRemoveLiquidity(){
      this.stakeLPError = false;
      if(!this.tempInfo)
      {
        return;
      }

      const fromCoinAccount = get(this.wallet.tokenAccounts, `${this.tempInfo.farmInfo.lp.coin.mintAddress}.tokenAccountAddress`)
      const toCoinAccount = get(this.wallet.tokenAccounts, `${this.tempInfo.farmInfo.lp.pc.mintAddress}.tokenAccountAddress`)
      this.removeLP(this.tempInfo.conn,this.tempInfo.wallet,this.tempInfo.farmInfo.lp,this.tempInfo.lpAccount,fromCoinAccount,toCoinAccount,this.tempInfo.amount);

      this.tempInfo = null;
    },
    async delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    },
    cancelStake() {
      this.lp = null
      this.farmInfo = null
      this.stakeModalOpening = false
    },
    onNothing(){
      this.stakeLPError = false;
      this.tempInfo = null;
    },
    cancelAddReward() {
      this.rewardCoin = null
      this.farmInfo = null
      this.addRewardModalOpening = false
    },

    openUnstakeModal(poolInfo: FarmInfo, lp: any, lpBalance: any) {
      const coin = cloneDeep(lp)
      coin.balance = lpBalance

      this.lp = coin
      this.farmInfo = cloneDeep(poolInfo)
      this.unstakeModalOpening = true
    },

    unstakeAndRemove(amount: string) {
      this.unstaking = true

      const conn = this.$web3
      const wallet = (this as any).$wallet
      const coin = this.farmInfo.lp.coin;
      const pc = this.farmInfo.lp.pc;
      const lp = this.farmInfo.lp;

      const lpAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${this.farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${this.farmInfo.poolId}.stakeAccountAddress`)
      const fromCoinAccount = get(this.wallet.tokenAccounts, `${coin.mintAddress}.tokenAccountAddress`)
      const toCoinAccount = get(this.wallet.tokenAccounts, `${pc.mintAddress}.tokenAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      withdraw(conn, wallet, this.farmInfo, lpAccount, rewardAccount, infoAccount, amount)
        .then(async (txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Unstake ${amount} ${lp.name}`
          this.$accessor.transaction.sub({ txid, description })

          let txStatus = this.$accessor.transaction.history[txid].status;
          while(txStatus === "Pending"){
            await this.delay(500);
            txStatus = this.$accessor.transaction.history[txid].status;
            await this.delay(500);
          }
          if(txStatus === "Fail"){
            console.log("unstake transaction failed")
            return;
          }
          let value = get(this.wallet.tokenAccounts, `${lp.mintAddress}.balance`)
          value = value.wei.toNumber() / Math.pow(10,value.decimals);
          if(value <= 0){
            console.log("remove lp amount is 0")
            return;
          }
          value = value.toString();

          this.removeLP(conn, wallet,lp,lpAccount, fromCoinAccount, toCoinAccount, value);

        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Stake failed',
            description: error.message
          })
        })
        .finally(() => {
        })
    },
    removeLP(conn:any,wallet:any,lp:any,lpAccount:any, fromCoinAccount:any, toCoinAccount:any, value:any){
      const key = getUnixTs().toString()
      const poolInfo = get(this.liquidity.infos, lp.mintAddress);
      //remove whole lp amount
      removeLiquidity(conn, wallet, poolInfo, lpAccount, fromCoinAccount, toCoinAccount, value)
      .then((txid) => {
        this.$notify.info({
          key,
          message: 'Transaction has been sent',
          description: (h: any) =>
            h('div', [
              'Confirmation is in progress.  Check your transaction on ',
              h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
            ])
        })

        const description = `Remove liquidity for ${value} ${lp.name}`

        this.$accessor.transaction.sub({ txid, description })
      })
      .catch((error) => {
        this.$notify.error({
          key,
          message: 'Remove liquidity failed',
          description: error.message
        })
      })
      .finally(() => {
        this.unstaking = false
        this.unstakeModalOpening = false
      })
    },

    cancelUnstake() {
      this.lp = null
      this.farmInfo = null
      this.unstakeModalOpening = false
    },
    getAmmId(farmInfo:FarmInfo){
      //get liquidity pool info
        let liquidityPoolInfo:LiquidityPoolInfo = LIQUIDITY_POOLS.find((item) => item.lp.mintAddress === farmInfo.lp.mintAddress) as any;

        //check liquidity pool
        if(liquidityPoolInfo == undefined){
          console.log("find liquidity pool error");
          return "";
        }
        return liquidityPoolInfo.ammId;
    },

    harvest(farmInfo: FarmInfo) {
      this.harvesting = true

      const conn = this.$web3
      const wallet = (this as any).$wallet

      const lpAccount = get(this.wallet.tokenAccounts, `${farmInfo.lp.mintAddress}.tokenAccountAddress`)
      const rewardAccount = get(this.wallet.tokenAccounts, `${farmInfo.reward.mintAddress}.tokenAccountAddress`)
      const infoAccount = get(this.farm.stakeAccounts, `${farmInfo.poolId}.stakeAccountAddress`)

      const key = getUnixTs().toString()
      this.$notify.info({
        key,
        message: 'Making transaction...',
        description: '',
        duration: 0
      })

      deposit(conn, wallet, farmInfo, lpAccount, rewardAccount, infoAccount, '0')
        .then((txid) => {
          this.$notify.info({
            key,
            message: 'Transaction has been sent',
            description: (h: any) =>
              h('div', [
                'Confirmation is in progress.  Check your transaction on ',
                h('a', { attrs: { href: `${this.url.explorer}/tx/${txid}`, target: '_blank' } }, 'here')
              ])
          })

          const description = `Harvest ${farmInfo.reward.symbol} from ${farmInfo.lp.name}`
          this.$accessor.transaction.sub({ txid, description })
        })
        .catch((error) => {
          this.$notify.error({
            key,
            message: 'Harvest failed',
            description: error.message
          })
        })
        .finally(() => {
          this.$accessor.farm.requestInfos()
          this.harvesting = false
        })
    },
    getCountdownFromPeriod(period:number){
      let remain = period;
      let days = Math.floor(remain / ( 24 * 3600));
      remain = remain % (24 * 3600);
      let hours = Math.floor(remain / 3600);
      remain = remain % 3600;
      let minutes = Math.floor(remain / 60);
      remain = remain % 60;
      let seconds = remain;
      
      return ""+days+"d : "+hours + "h : "+minutes+"m";
      
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
  border:none
}
.pf-record{
  border-bottom:none !important
}
.radioButtonStyle {
  width: 50%;
  text-align: center;
}

.fertilizeruniq{
  max-width: 1200px;
  margin: 30px auto;

  .notstep{
    padding:20px
  }
}

.fertilizeruniq .list{
  text-align:center;
  width:1300px;
  max-width: 1200px;
  margin-left:auto;
  margin-right:auto;

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
    background:#1B2028;

    .banner{
      height:100px;
      position:relative;
      overflow:hidden;

      .large{
        background:#f00;
        height:100px;
        min-width:100%;
        left:50%;
        top:50%;
        position:absolute;
        object-fit: cover;
        transform:translate(-50%,-50%)
      }
    }

    .info{
      margin-bottom:20px
    }

    .followerscount{
      text-align: left;
      font-weight: bold;
      font-size: 17px;
      margin:16px;
    }

    .ant-col{
      padding:0 10px 5px 10px;
    }

    .small{
      width: 70px;
      border: 4px solid #000;
      border-radius:50%;
      top:100px;
      z-index:2;
      left:50%;
      position:absolute;
      background:#000;
      transform:translate(-50%,-50%)
    }

    .title{
      font-size: 20px;
      margin-top: 40px;
      margin-bottom: 5px;
    }

    .icons img{
      max-height:24px;
    }
  } 
}




</style>

<style lang="less">

.text-center{
  text-align:center !important
}

.fertilizeruniq {

  h1{
      margin:20px;
      font-size:30px;
  }


div.inputContent{
  background: #09B17F;
  padding: 2px;
  display: inline-block;
  border-radius: 5px;
  margin-top:3px;

  .twlink{
    border:none;
    padding:9px 10px;
    border-radius:5px 0 0 5px;
    background:#1B2028;
    width: 293px; 
  }

  .submitbutton{
    border:none;
    padding:9px 10px;
    border-radius:5px;
    margin-right:5px;
    background:#09B17F;
    cursor:pointer;
  }
}

  .airdropStatus{
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    margin-top:29px;
  }

  .info{
    font-weight: bold;
    padding: 20px;
  }

  .modTitle{
    font-style: normal;
    font-weight: bold;
    font-size: 32px;
    line-height: 37px;
  }

  .walContent{
    background: #000;
    border-radius: 13px;
    margin-top:9px;
    padding:16px 12px;
  }

  .airdropWinner{
    color:#13ECAB;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    img{
      margin-left: 10px;
      border-radius:50%;
      width:20px;
      position:relative;
      top:-3px;
    }
  }

  .nftWinner{
    color:#13ECAB;
    margin-top: 10px;
    margin-bottom: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    img{
      margin-left: 10px;
      border-radius:50%;
      width:51px;
      position:relative;
      top:-3px;
    }
  }

  input.link{
    color: #000;
    padding: 5px 20px;
    display: inline-block;
    width: 90%;
    border-radius: 5px;
    border: none;
    margin-top: 5px;
  }
  
  .text-center{
    text-align:center;
  } 

  .largepdding{
    padding-top:55px;
  }

   .followerscount span{
      color:#13ECAB
    }

   .followerscount img{
      position:relative;
      top:-3px;
    }

    .share{
    text-align:left;
    margin-top:10px;
    font-size: 16px;
    line-height: 19px;
    }

  .steps > div{
    background:#000;
    border-radius:6px;
    margin:10px 30px 10px 90px;
    padding:0 11px;
    height:59px;
    position:relative;

    & > .span{
      position:absolute;
      left: -60px;
      top: 50%;
      height: 37px;
      transform:translate(0, -50%);
      &:not(.first)::before{
        content: '';
        width: 2px;
        background: #09B17F;
        height: 26px;
        left: 17.5px;
        display: inline-block;
        position: absolute;
        top: -29px;
      }
    }

    & > span:not(.span){
      position:absolute;
      left: -60px;
      top: 50%;
      transform:translate(0, -50%);
      color: #C6C6C6;
      border: #C6C6C6 3px solid;
      border-radius: 50%;
      text-align: center;
      width: 37px;
      height: 37px;
      line-height: 30px;
      display: inline-block;
      font-weight: normal;
      font-size: 18px;
      &::before{
        content: '';
        width: 2px;
        background: #C6C6C6;
        height: 26px;
        left: 13.5px;
        display: inline-block;
        position: absolute;
        top: -32px;
      }
    }

    &.done{
      background: #09B17F;
      .date{
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
      }
    }
  }

  .done > div {
    color:#fff !important
  }

  .steps > div:not(.done) div.date{
    font-weight: 400;
    font-size: 14px;
    background: #47A3D5;
    border-radius: 10.5px;
    height: 21px;
    line-height: 21px;
    display: inline-block;
    color: #fff;
    padding: 0 10px !important;
    margin-top: 3px;
  }

  .steps > div > div{
    font-style: normal;
    font-size: 14px;
    line-height: 16px;
    color: #C6C6C6;
    position:absolute;
    font-weight:300;
    top:50%;
    transform:translate(0, -50%);

    .t{
      font-weight:400
    }

  }

  .followerscount{
    font-size:24px;
    margin:16px;

  }

  .sharer{
    float:right;
    margin-left:12px;
  }

  .icons img{
    max-width:43px;
    margin-right:4px;
    margin-bottom:10px;
    border-radius:50%;
  }

  .rewardNFT,
  .rewardAmount{
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 21px;
    margin-bottom:25px;
  }

  .airdropInfo{
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 16px;
    color: #FFF;
  }

  .infoTickets{
    font-weight: 500;
    font-size: 21px;
    line-height: 25px;
    color: #FFF;
    text-align:center;
    margin-top:14px;
  }

  .rewardAmount b {
    float:right;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #13ECAB;

    img{
      max-width:20px;
      border-radius:50%;
      position:relative;
      top:-2px;
      margin-left:10px;
    }
  }

  .rewardNFT b{
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: #13ECAB;
    margin-right:15px;

    img{
      max-width:33px;
      border-radius:50%;
      position:relative;
      top:-2px;
      margin-left:10px;
    }

  }



  .done{
    background: #09B17F;
    color:#fff;
  }



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

      &.button_div{
        padding: 10px 20px;
      }
    }

  }


  .label.soon{
      border: 1px solid #13d89d;
      color:#13d89d;
    position: absolute;
    padding: 0 20px 0 20px;
    border-radius: 3px;
    right: 60px;
  }

  .label.ended{
      border: 1px solid #f00;
      color:#f00;
    position: absolute;
    padding: 0 20px 0 20px;
    border-radius: 3px;
    right: 60px;
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
.farm {

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

.farm.container {
  max-width: 1200px;
  background: #1B2028;
  margin-top:20px;
  margin-bottom:20px;


  .page-head a{
    z-index: 2;
    padding-left: 15px;
    background: #1b2028;
    position: absolute;
    right: 0;

    .btncontainer{
      display:inline-block
    }
  }

  .card {
    .card-body {
      padding: 0;
      background:#000;
      overflow-x: scroll;
      scrollbar-width: none;
      -ms-overflow-style: none;

      .ant-collapse {
        border: 0;
        background-color: rgba(0, 0, 0, 0.9471);

        .ant-collapse-item {
          border-bottom: 0;
        }

        .ant-collapse-item:not(:last-child) {
          border-bottom: 1px solid #d9d9d9;
        }

      }

      .start .btncontainer{
        display: inline-block;
      }
    }
  }

  .harvest {
    .reward {
      .token {
        font-weight: 600;
        font-size: 20px;
      }

      .value {
        font-size: 12px;
      }
    }

    button {
      padding: 0 30px;
    }
  }

  .start {
    .unstarted {
      .token {
        font-weight: 600;
        font-size: 20px;
      }

      .value {
        font-size: 12px;
      }
    }
    
    .unstake {
      margin-right: 10px;
    }

    button {
      width: 100%;
    }
  }

  .harvest,
  .start {
    padding: 16px;
    border: 2px solid #1c274f;
    border-radius: 4px;

    .title {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

  }

  .farm-head {
    display: flex;
    align-items: center;

    .lp-icons {
      width: 32%;
      left: 6%;

      .icons {
        margin-right: 8px;
      }
    }

    .state {
      display: flex;
      flex-direction: column;
      text-align: left;

      .title {
        font-size: 12px;
        text-transform: uppercase;
      }

      .value {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .farm-head.is-mobile {
    padding: 24px 16px !important;
  }

  .is-mobile {
    .harvest,
    .start {
      margin-top: 16px;
    }
  }

  p {
    margin-bottom: 0;
  }
}

@media (max-width: 700px){
  .fertilizeruniq .notstep,
  .fertilizeruniq .steps,
  .fertilizeruniq .twlink{
  width:100%;
  }
  .rewardAmount > span,
  .rewardNFT > span{
    display:block;
    margin-top:5px;
    margin-bottom:5px;
  }

.fertilizeruniq .rewardAmount b {
    float: unset;
}

.fertilizeruniq .rewardNFT b {
    float: unset;
    white-space:nowrap
}

 .fertilizeruniq div.inputContent{
    margin-bottom:5px;
    width:100%;

 }

 .fertilizeruniq div.inputContent .twlink{
    width: calc(100% - 80px);
  }
}

</style>


