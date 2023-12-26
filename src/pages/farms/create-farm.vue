<template>

  <div class="container" :class="isMobile ? 'create-pool-mobile' : 'create-pool'">
    <CoinSelect 
    v-if="coinSelectShow && wallet.connected" 
    :farmTokenASelect="selectTokenA"
    :farmTokenBSelect="selectTokenB"
    :allowedAllFarm="$wallet.publicKey.toBase58()===allowedFarmCreator"
    @onClose="() => (coinSelectShow = false,selectTokenB=false,selectTokenA=false)" 
    @onSelect="onCoinSelect" />
    <AmmIdSelect
      :show="ammIdSelectShow"
      :liquidity-list="ammIdSelectList"
      :user-close="true"
      @onClose="() => ((ammIdSelectShow = false))"
      @onSelect="onAmmIdSelect"
    />
    <div class="card">
      <div class="card-body" style="grid-row-gap: 0; row-gap: 0; padding-bottom: 15px">
        <div class="page-head fs-container">
          <span class="title">Create a farm</span>
        </div>

        <Row>
        <Col :span="isMobile ? 24 : 6" :style="isMobile ? '' : 'border-right: 1px solid #444A58;padding-top:20px'">
        

          <Steps :current="current" size="small" direction="vertical" style="width: auto" :status="stepsStatus">
            <Step
              ><template slot="title">
                <div>Select an Option</div>
              </template></Step
            >
            <Step>
              <p slot="title"  :style="current > 1 ? '':'color: rgb(87, 117, 147)'">
                {{ stepTitleInputMarket }}
                <Tooltip placement="right">
                  <div slot="title">
                    For details on creating a Serum Market, see bla bla bla
                  </div>
                  <Icon type="info-circle" />
                </Tooltip>
              </p>
            </Step>
            <Step
              ><template slot="title">
                <div v-if="current > 2 || (current === 2 && stepsStatus !== 'error')">{{ stepTitleMarketInfo }}</div>
                <div v-else-if="current === 2 && stepsStatus === 'error'" style="color: red">
                  {{ stepTitleMarketInfo }}
                </div>
                <div v-else style="color: rgb(87, 117, 147)">{{ stepTitleMarketInfo }}</div>
              </template></Step
            >
            <Step
              ><template slot="title">
                <div v-if="current > 3 || (current === 3 && stepsStatus !== 'error')">{{ stepTitleInit }}</div>
                <div v-else-if="current === 3 && stepsStatus === 'error'" style="color: red">{{ stepTitleInit }}</div>
                <div v-else style="color: rgb(87, 117, 147)">{{ stepTitleInit }}</div>
              </template></Step
            >
            
            <Step
              ><template slot="title">
                <div v-if="current > 4 && stepsStatus !== 'error'">Pool & Farm Created</div>
                <div v-else-if="current === 4 && stepsStatus === 'error'" style="color: red">Pool & Farm Created</div>
                <div v-else slot="title" style="color: rgb(87, 117, 147)">Pool Created</div>
              </template></Step
            >
            <Step
              ><template slot="title">
                <div v-if="current > 5 || (current === 5 && stepsStatus !== 'error')">Farm Informations</div>
                <div v-else-if="current === 5 && stepsStatus === 'error'" style="color: red">Farm Informations</div>
                <div v-else style="color: rgb(87, 117, 147)">Farm Informations</div>
              </template></Step
            >
            <Step
              ><template slot="title">
                <div v-if="current > 6 || (current === 6 && stepsStatus !== 'error')">Farm Created</div>
                <div v-else-if="current === 6 && stepsStatus === 'error'" style="color: red">Farm Created</div>
                <div v-else style="color: rgb(87, 117, 147)">Farm Created</div>
              </template></Step
            >
          </Steps>
        
        </Col>

        <Col :span="isMobile ? 24 : 18" class="notstep">
        <Row v-if="current === 0 && wallet.connected" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
          <Col style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            ><div style="padding-bottom: 10px; word-break: break-word">
              Here are two options. You can use existing CropperFinance AMM ID to create your own farm or create new AMM ID
            </div>
            <br />
            <div><b>Option 1 - Select token pairing or input Amm Id:</b></div>
          </Col>
          <Col style="line-height: 20px" :span="isMobile?24:12" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            >
            <CoinNameInput
              :label="'Token A'"
              :mint-address="tokenA ? tokenA.mintAddress : ''"
              :coin-name="tokenA ? tokenA.symbol : ''"
              @onSelect="openTokenASelect"
            />
          </Col>
         <Col style="line-height: 20px" :span="isMobile?24:12" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            >
            <CoinNameInput
              :label="'Token B'"
              :mint-address="tokenB ? tokenB.mintAddress : ''"
              :coin-name="tokenB ? tokenB.symbol : ''"
              @onSelect="openTokenBSelect"
            />
          </Col>
            <Col style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            >
            <div>AMM ID:</div>
          </Col>
          <Col style="line-height: 20px" :span="24"><input v-model="userCreateAmmId" /></Col>

          <Col v-if="userCreateAmmId!=''" :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div class="btncontainer">
              <Button
                size="large"
                ghost
                class="button_div"
                :disabled="!wallet.connected"
                style=" z-index: 999; width: 100%"
                @click="useExistingAMMID()"
              >
                Use Existing
              </Button>
            </div>
          </Col>
          <Col v-if="userCreateAmmId===''" style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            ><br />
            <div><b>Option 2 - Create new AMM ID:</b></div>
          </Col>

          <Col v-if="userCreateAmmId===''" :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div class="btncontainer">
              <Button
                size="large"
                ghost
                class="button_div"
                :disabled="!wallet.connected"
                style=" z-index: 999; width: 100%"
                @click="createNewAMMID()"
              >
                Create New
              </Button>
            </div>
          </Col>
        </Row>
        <Row v-if="current === 0 && !wallet.connected" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
          <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div v-if="!wallet.connected" class="btncontainer">
              <Button  size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                Connect
              </Button>
            </div>
          </Col>
        </Row>
        <Row v-if="current === 1" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
          <Col style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'"
            ><div style="padding-bottom: 10px; word-break: break-word">
              $$This tool is for advanced users. Before attempting to create a new liquidity pool, we suggest going
              through this
              <a href="#" target="_blank">
                detailed guide.</a
              >$$
            </div>
            <div>Input Serum Market ID:</div>
            <div>CRP/USDC: HPU7v2yCGM6sRujWEMaTPiiiX2qMb6fun3eWjTzSgSw1</div>
            <div>CRP/USDT: 3iCYi5bQxXN5X4omCxME1jj9D91vNpYYqzbiSw9u7tcG</div>
            <div>B2B/CRP: 2hEeVE354k6mpvHvzg8K8HvEAkL9HUMiZbcjarkuy7W7</div>
          </Col>
          <Col style="line-height: 20px" :span="24"><input v-model="inputMarket" :disabled="!marketInputFlag" /></Col>

          <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div class="btncontainer">
              <Button v-if="!wallet.connected" size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                Connect
              </Button>
              <Button
                v-else
                size="large"
                ghost
                class="button_div"
                :disabled="!wallet.connected"
                style=" z-index: 999; width: 100%"
                :loading="getMarketLoading"
                @click="marketInputFlag ? getMarketMsg() : rewriteMarket()"
              >
                {{ !wallet.connected ? 'Connect' : getMarketLoading ? '' : marketInputFlag ? 'Confirm' : 'Cancel' }}
              </Button>
            </div>
          </Col>
        </Row>
        <div v-if="current >= 2 && current < 5" style="margin-top: 10px" class="msgClass">
          <Row>
            <Col :span="isMobile ? 24 : 24" :class="isMobile ? 'item-title-mobile' : 'item-title'"><b>Market Info:</b></Col>
            <Col :span="isMobile ? 24 : 24">
              <div style="padding-left: 10px">
                <div style="width: 100%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                  Base Token Mint Address:
                  {{ getNameForMint(marketMsg.baseMintAddress.toBase58()) }}
                </div>
                <div style="width: 100%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                  Quote Token Mint Address:
                  {{ getNameForMint(marketMsg.quoteMintAddress.toBase58()) }}
                </div>

                <div style="width: 32%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                  Tick Size: {{ marketTickSize }}
                </div>

                <div style="width: 32%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                  Min Order Size: {{ marketMsg.minOrderSize }}
                </div>

                <div style="width: 32%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
                  Current Price: {{
                    marketMsg.tickSize.toString().split('.').length === 2
                      ? marketPrice.toFixed(marketMsg.tickSize.toString().split('.')[1].length)
                      : parseInt((marketPrice / marketMsg.tickSize).toFixed(0)) * marketMsg.tickSize
                  }}
                </div>

              </div>
            </Col>
            <div style="margin-left:20%;margin-top:30px;width: 40%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
              Set <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Starting Price in <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b>:
            </div>
            <div style="width: 20%; display: inline-block">
              <input
                v-model="inputPrice"
                type="number"
                :disabled="createAmmFlag"
                :step="1"
                accuracy="2"
                style="width: 100%"
              />
            </div>
            <div style="margin-left:20%;margin-top:10px;width: 40%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
              <b>{{ getSymbolForMint(marketMsg.baseMintAddress.toBase58()) }}</b> Initial Liquidity:
            </div>
            <div style="width: 20%; display: inline-block">
              <input
                v-model="inputBaseValue"
                type="number"
                :disabled="createAmmFlag"
                :step="1"
                accuracy="2"
                style="width: 100%"
              />
            </div>
            <div style="margin-left:20%;margin-top:10px;width: 40%; display: inline-block" :class="isMobile ? 'item-title-mobile' : 'item-title'">
              <b>{{ getSymbolForMint(marketMsg.quoteMintAddress.toBase58()) }}</b> Initial Liquidity:
            </div>
            <div style="width: 20%; display: inline-block">
              <input
                v-model="inputQuoteValue"
                type="number"
                :disabled="createAmmFlag"
                :step="1"
                accuracy="2"
                style="width: 100%" 
              />
            </div>
            <Col :span="24" style="padding-top: 10px">
              <div class="btncontainer" v-if="!wallet.connected">
                <Button
                  style="position: absolute; z-index: 999; width: 100%"
                  size="large"
                  ghost
                  @click="$accessor.wallet.openModal"
                >
                  Connect
                </Button>
              </div>
              <Row v-else-if="current == 4">
                <Col span="24" style="text-align: center; margin-top: 10px"
                  ><br /><br /><strong>Pool has been successfully created!</strong></Col
                >
                <!-- <Col
                  style="margin-top: 10px"
                  :span="isMobile ? 24 : 6"
                  :class="isMobile ? 'item-title-mobile' : 'item-title'"
                  >New AMM ID:</Col
                >
                <Col style="margin-top: 10px" :span="isMobile ? 24 : 18">
                  {{ userCreateAmmId }}
                </Col> -->
                <Col span="24" style="word-break: break-word; line-height: 20px;text-align:center">
                  <div class="btncontainer">
                    <Button size="large" :disabled="!wallet.connected" ghost style="z-index: 999; width: 100%" @click="goToFarmInfo">
                      Input Farm Info
                    </Button>
                  </div>
                </Col>
              </Row>
              <div v-else style="text-align: center; padding-top: 20px">
              <!--
                <Button
                  size="large"
                  ghost
                  class="button_div"
                  :disabled="!wallet.connected"
                  style="z-index: 999; width: 20%"
                  :loading="getMarketLoading"
                  @click="marketInputFlag ? getMarketMsg() : rewriteMarket()"
                >
                  {{ !wallet.connected ? 'Connect' : getMarketLoading ? '' : marketInputFlag ? 'OK' : 'Cancel' }}
                </Button> -->

                <p style="padding-top: 20px; padding-left:20%;padding-right:20%; word-break: break-word; line-height: 20px; margin: 0">
                  After clicking 'Confirm' you will need to approve two transactions in your wallet to initialize the
                  pool, create the AMM account, and add liquidity.
                </p>
<br />
                <div class="btncontainer">
                <Button
                  size="large"
                  ghost
                  class="button_div"
                  style="z-index: 999"
                  :loading="createAmmFlag"
                  :disabled="
                    createAmmFlag || !(inputPrice !== null && isAmountValid)
                  "
                  @click="createKey"
                >
                  {{ createAmmFlag ? '' : 'Confirm and Initialize Liquidity Pool' }}
                </Button>
                </div>

              </div>
            </Col>
          </Row>
        </div>

        <!-- Create Farm -->
        <Row v-if="current === 5" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
          <Col v-if="!isCRPTokenPair" style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <div>If you have associated your token with USDC, you will need to pay 5000 USDC to start the farm after it is created</div>
          </Col>
          <Col style="line-height: 20px" :span="24">
            <CoinInput
              v-model="fromCoinAmount"
              label="Initial Reward Token Amount"
              :balance-offset="rewardCoin && rewardCoin.symbol === 'SOL' ? -0.05 : 0"
              :mint-address="rewardCoin ? rewardCoin.mintAddress : ''"
              :coin-name="rewardCoin ? rewardCoin.symbol : ''"
              :balance="rewardCoin ? rewardCoin.balance : null"
              :show-half="true"
              @onInput="(amount) => (fromCoinAmount = amount)"
              @onFocus="
                () => {
                  fixedFromCoin = true
                }
              "
              @onMax="
                () => {
                  fixedFromCoin = true
                  fromCoinAmount = rewardCoin && rewardCoin.balance ? rewardCoin.balance.fixed() : '0'
                }
              "
              @onSelect="openFromCoinSelect"
            />
          </Col>
          
          <Col style="line-height: 20px" :span="isMobile ? 24:12" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <DatePicker
              v-model="startTime"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="Start"
              @openChange="handleStartOpenChange"
            />
          </Col>
          
          <Col style="line-height: 20px" :span="isMobile ? 24:12" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <DatePicker
              v-model="endTime"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="End"
              @openChange="handleEndOpenChange"
            />
          </Col>
          <Col style="line-height: 20px;" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <div>Reward Per Week:&nbsp;{{rewardPerWeek}} &nbsp;{{rewardCoin != null?rewardCoin.symbol : ""}}</div>
          </Col>
          <Col style="line-height: 20px;" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <div>AMM ID:&nbsp;{{userCreateAmmId}}</div>
          </Col>

          <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div class="btncontainer">
              <Button v-if="!wallet.connected" size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                Connect
              </Button>
              <Button v-else size="large" :disabled="!wallet.connected" ghost style="z-index: 999; width: 100%" @click="confirmFarmInfo">
                Confirm
              </Button>
            </div>
          </Col>
        </Row>
        <Row v-if="current === 6" style="align-items: baseline; line-height: 40px; padding-bottom: 20px">
          <Col v-if="!isCRPTokenPair" style="line-height: 20px" :span="24" :class="isMobile ? 'item-title-mobile' : 'item-title'">
            <div>Farm has been successfully created!</div>
          </Col>
          <Col :span="isMobile ? 24 : 24" style="padding-bottom: 20px; padding-top: 10px; text-align:center">
            <div class="btncontainer">
              <Button v-if="!wallet.connected" size="large" ghost style="width: 100%" @click="$accessor.wallet.openModal">
                Connect
              </Button>
              <Button v-else size="large" :disabled="!wallet.connected" ghost style="z-index: 999; width: 100%" @click="gotoFarms">
                View Farms
              </Button>
            </div>
          </Col>
        </Row>
        </Col>
        </Row>



      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { Steps, Row, Col, Button, Tooltip, Icon, DatePicker } from 'ant-design-vue'
import { getMarket, createAmm, clearLocal } from '@/utils/market'
import BigNumber from '@/../node_modules/bignumber.js/bignumber'
import { NATIVE_SOL, TokenInfo, TOKENS } from '@/utils/tokens'
import { createAssociatedId } from '@/utils/web3'
import { PublicKey } from '@solana/web3.js'
import { AMM_ASSOCIATED_SEED, FARM_PROGRAM_ID, LIQUIDITY_POOL_PROGRAM_ID_V4, SITE_ALLOWED_CREATOR } from '@/utils/ids'
import { getBigNumber } from '@/utils/layouts'
import { cloneDeep, get } from 'lodash-es'
import moment from 'moment'
import {YieldFarm} from '@/utils/farm'
import { getPoolListByTokenMintAddresses, LIQUIDITY_POOLS,LiquidityPoolInfo } from '@/utils/pools'
const Step = Steps.Step

@Component({
  head: {
    title: 'CropperFinance Create Pool'
  },
  components: {
    Steps,
    Row,
    Col,
    Button,
    Step,
    Tooltip,
    Icon,
    DatePicker,
  }
})
export default class CreatePool extends Vue {
  rewardCoin:TokenInfo | null = null
  tokenA:TokenInfo | null = null
  tokenB:TokenInfo | null = null
  fromCoinAmount: string = ''
  fixedFromCoin: boolean = true
  selectFromCoin:boolean = false
  selectTokenA:boolean = false
  selectTokenB:boolean = false
  allowedFarmCreator:string = SITE_ALLOWED_CREATOR
  coinSelectShow: boolean = false
  startTime: any = moment()
  endTime:  any = moment()
  endOpen: any = false
  isCRPTokenPair:boolean = false
  ammIdSelectShow:boolean = false
  ammIdSelectList: any = []

  farmId: any = null  
  current: number = 0
  
  marketInputFlag: boolean = true
  marketFlag: boolean = false
  inputMarket: string = ''
  isAmountValid:boolean = false
  inputQuoteValue: number | null = null
  inputBaseValue: number | null = null
  inputPrice: number | null = null
  marketMsg: any | null = null
  getMarketLoading: boolean = false
  marketError: null | string = null
  stepsStatus: string = 'process'
  marketStr: string | null = null
  marketPrice: number | null = null
  baseMintDecimals: number | null = null
  quoteMintDecimals: number | null = null

  createAmmFlag: boolean = false

  stepTitleInputMarket: string = 'Import Serum Market ID'
  stepTitleMarketInfo: string = 'Price & Initial Liquidity'
  stepTitleInit: string = 'Initialize'

  marketTickSize: number = 1

  userCreateAmmId: string = ''

  liquidityValueChangeFlag: boolean = true

  userLocalAmmIdList: string[] = []

  expectAmmId: undefined | string

  get rewardPerWeek(){
    let result = 0;
    let initialAmount = Number.parseFloat(this.fromCoinAmount);
    

    let duration = 0;
    if(this.startTime != null && this.endTime != null){
      duration = this.endTime.unix() - this.startTime.unix();
    }
    if(duration > 0){
      result = initialAmount * 7 * 24 * 3600 / duration ;
    }
    return result;
  }
  get isMobile() {
    return this.$accessor.isMobile
  }

  get wallet() {
    return this.$accessor.wallet
  }
  

  @Watch('startTime')
  onStartTimeChanged(val: any) {
    console.log("start time changed !")
  }

  @Watch('inputQuoteValue')
  oniIputQuoteValueChanged(val: string) {
    if (
      this.inputPrice !== null &&
      this.baseMintDecimals !== null &&
      this.quoteMintDecimals !== null &&
      this.liquidityValueChangeFlag
    ) {
      this.liquidityValueChangeFlag = false
      if (val.toString().split('.').length > 1 && val.toString().split('.')[1].length > this.quoteMintDecimals) {
        this.inputQuoteValue = parseFloat(parseFloat(val).toFixed(this.quoteMintDecimals))
      }
      this.inputBaseValue =
        Math.floor(((this.inputQuoteValue ?? parseFloat(val)) / this.inputPrice) * 10 ** this.baseMintDecimals) /
        10 ** this.baseMintDecimals
      this.validateAmount()
      
    }
    setTimeout(() => {
      this.liquidityValueChangeFlag = true
    }, 1)
  }

  @Watch('inputBaseValue')
  onInputBaseValueChanged(val: string) {
    if (
      this.inputPrice !== null &&
      this.baseMintDecimals !== null &&
      this.quoteMintDecimals !== null &&
      this.liquidityValueChangeFlag
    ) {
      this.liquidityValueChangeFlag = false
      if (val.toString().split('.').length > 1 && val.toString().split('.')[1].length > this.baseMintDecimals) {
        this.inputBaseValue = parseFloat(parseFloat(val).toFixed(this.baseMintDecimals))
      }
      this.inputQuoteValue =
        Math.floor((this.inputBaseValue ?? parseFloat(val)) * this.inputPrice * 10 ** this.quoteMintDecimals) /
        10 ** this.quoteMintDecimals
      this.validateAmount()
      
    }
    setTimeout(() => {
      this.liquidityValueChangeFlag = true
    }, 1)
  }

  @Watch('inputPrice')
  onInputPriceValueChanged(val: number) {
    if (this.inputPrice) {
      if (this.inputBaseValue && this.quoteMintDecimals) {
        this.inputQuoteValue =
          Math.floor(val * this.inputPrice * 10 ** this.quoteMintDecimals) / 10 ** this.quoteMintDecimals
      } else if (this.inputQuoteValue && this.baseMintDecimals) {
        this.inputBaseValue =
          Math.floor((val / this.inputPrice) * 10 ** this.baseMintDecimals) / 10 ** this.baseMintDecimals
      }
      this.validateAmount()

    }
  }

  async validateAmount(){

    this.isAmountValid = false
    if(this.inputBaseValue && this.inputQuoteValue && this.baseMintDecimals && this.quoteMintDecimals){

      const walletBaseAmount = parseFloat(get(this.wallet.tokenAccounts, `${this.marketMsg.baseMintAddress.toBase58()}.balance`).fixed());
      const walletQuoteAmount = parseFloat(get(this.wallet.tokenAccounts, `${this.marketMsg.quoteMintAddress.toBase58()}.balance`).fixed());
      
      if(this.inputBaseValue > 0 && this.inputBaseValue < walletBaseAmount && this.inputQuoteValue > 0 && this.inputQuoteValue < walletQuoteAmount)
      {
        this.isAmountValid = true
      }
    }
  }

  @Watch('inputMarket')
  onInputMarketChanged(val: string) {
    this.inputMarket = val.replace(/(^\s*)|(\s*$)/g, '')
  }

  mounted() {
    const localMarket = localStorage.getItem('createMarket')
    if (localMarket !== null && localMarket.length > 30) {
      this.inputMarket = localMarket
      this.getMarketMsg()
    } else {
      clearLocal()
    }
    this.updateLocalData()
  }
  async confirmFarmInfo(){
    //EgaHTGJeDbytze85LqMStxgTJgq22yjTvYSfqoiZevSK
    const connection = this.$web3;
    const wallet:any = this.$wallet;
    
    await this.$accessor.liquidity.requestInfos()

    //get liquidity pool info
    let liquidityPoolInfo:any = LIQUIDITY_POOLS.find((item) => item.ammId === this.userCreateAmmId);

    //check liquidity pool
    if(liquidityPoolInfo == undefined){
      this.$notify.error({
            key:"Liquidity",
            message: 'Finding liquidity pool',
            description: "Can't find liquidity pool"
          });
      return;
    }

    //check reward coin
    if(this.rewardCoin === null){
      this.$notify.error({
            key:"reward",
            message: 'Checking reward coin',
            description: "Select reward coin, please"
          });
      return;
    }

    let rewardMintPubkey = new PublicKey(this.rewardCoin?.mintAddress as string);
    let rewardDecimals:number = this.rewardCoin?.decimals as any;
    let lpMintPubkey = new PublicKey(liquidityPoolInfo.lp.mintAddress);
    let ammPubkey = new PublicKey(this.userCreateAmmId);
    
    let startTimestamp:any = this.startTime.unix();
    let endTimestamp:any = this.endTime.unix();

    
    let initialRewardAmount:number = Number.parseFloat(this.fromCoinAmount);
    let userRewardTokenPubkey = new PublicKey(get(this.wallet.tokenAccounts, `${rewardMintPubkey.toBase58()}.tokenAccountAddress`));
    let userRewardTokenBalance = get(this.wallet.tokenAccounts, `${rewardMintPubkey.toBase58()}.balance`);
    
    //check if creator has some reward
    if(userRewardTokenBalance <= 0 || userRewardTokenBalance < initialRewardAmount){
      this.$notify.error({
            key:"Initial Balance",
            message: 'Checking Inital Reward',
            description: "Not enough Initial Reward token balance"
          });
      return;
    }

    //check start and end
    if(startTimestamp >= endTimestamp){
      this.$notify.error({
            key:"Period",
            message: 'Checking period',
            description: "end time must be late than start time"
          });
      return;
    }
    try{
      let createdFarm = await YieldFarm.createFarmWithParams(
        connection,
        wallet,
        rewardMintPubkey,
        lpMintPubkey,
        ammPubkey,
        startTimestamp,
        endTimestamp
      );
      await this.delay(500);
    
      // wait for the synchronization
      let loopCount = 0;
      while(await connection.getAccountInfo(createdFarm.farmId) === null){
        if(loopCount > 5){ // allow loop for 5 times
          break;
        }
        loopCount++;
      }

      this.farmId = createdFarm.farmId
      let fetchedFarm = await YieldFarm.loadFarm(
        connection,
        createdFarm.farmId,
        new PublicKey(FARM_PROGRAM_ID)
      )
      if(fetchedFarm){
        await fetchedFarm.addReward(
          wallet,
          userRewardTokenPubkey,
          initialRewardAmount * Math.pow(10,rewardDecimals)
        );
        this.current += 1;
      }
    }
    catch{
      console.log("creating farm failed")
    }
  }
  async delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }
 
  gotoFarms(){
    this.$accessor.farm.requestInfos()
    this.$accessor.wallet.getTokenAccounts()
    this.$router.push({ path: `/farms/#${this.farmId}` })
  }
  goToFarmInfo(){
    this.current ++;
  }
  useExistingAMMID(){
    if(this.userCreateAmmId === ''){
      this.$notify.error({
            key:"AMMID",
            message: 'Using Existing Amm Id',
            description: "Input valid AMM ID"
          });
      return;
    }
    this.current = 5;
  }
  createNewAMMID(){
    this.userCreateAmmId = ''
    this.current++;
  }
  onAmmIdSelect(liquidityInfo: LiquidityPoolInfo | undefined) {
    this.ammIdSelectShow = false
    if (liquidityInfo) {
      this.userCreateAmmId = liquidityInfo.ammId
    } else {
      this.userCreateAmmId = ''
      this.current++;
    }
  }
  openFromCoinSelect() {
    this.selectFromCoin = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  openTokenASelect() {
    this.selectTokenA = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  openTokenBSelect() {
    this.selectTokenB = true
    this.closeAllModal('coinSelectShow')
    setTimeout(() => {
      this.coinSelectShow = true
    }, 1)
  }
  closeAllModal(showName: string) {
    if (showName !== 'coinSelectShow') {
      this.coinSelectShow = false
    }
  }
  onCoinSelect(tokenInfo: TokenInfo) {
    if (tokenInfo !== null) {
      if (this.selectFromCoin) {
        this.rewardCoin = cloneDeep(tokenInfo)
      }
      else if(this.selectTokenA || this.selectTokenB){
        if (this.selectTokenA) {
          this.tokenA = cloneDeep(tokenInfo)
          this.rewardCoin = cloneDeep(tokenInfo)
          if(this.tokenB && this.tokenA.mintAddress === this.tokenB.mintAddress){
            this.tokenB = null;
          }
        }
        else if (this.selectTokenB) {
          this.tokenB = cloneDeep(tokenInfo)
          if(this.tokenA && this.tokenB.mintAddress === this.tokenA.mintAddress){
            this.tokenA = null;
          }
        }
        if(this.tokenA && this.tokenB){
          const liquidityListV5 = getPoolListByTokenMintAddresses(
            this.tokenA.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.tokenA.mintAddress,
            this.tokenB.mintAddress === TOKENS.WSOL.mintAddress ? NATIVE_SOL.mintAddress : this.tokenB.mintAddress,
            undefined
          );
          if (liquidityListV5.length === 1) {
            this.userCreateAmmId = liquidityListV5[0].ammId;
          }
          else if (liquidityListV5.length > 1) {
            // user select amm id
            this.coinSelectShow = false
            setTimeout(() => {
              this.ammIdSelectShow = true
              
              // @ts-ignore
              this.ammIdSelectList = Object.values(this.$accessor.liquidity.infos).filter((item: LiquidityPoolInfo) =>
              liquidityListV5.find((liquidityItem) => liquidityItem.ammId === item.ammId)
              )
            }, 1)
            return
          }
        }
        else{
          this.userCreateAmmId = ''
        }
      }
    } else {
      // check coin
      if (this.rewardCoin !== null) {
        const newFromCoin = Object.values(TOKENS).find((item) => item.mintAddress === this.rewardCoin?.mintAddress)
        if (newFromCoin === null || newFromCoin === undefined) {
          this.rewardCoin = null
        }
      }
    }
    this.coinSelectShow = false
    this.selectFromCoin = false
    this.selectTokenA = false
    this.selectTokenB = false
  }

  disabledStartDate(startTime:any) {
    const endTime = this.endTime;
    if (!startTime || !endTime) {
      return false;
    }
    if(startTime < moment().endOf('day'))
    {
      return true
    }
    return startTime.valueOf() > endTime.valueOf();
  }
  disabledEndDate(endTime:any) {
    const startTime = this.startTime;
    if (!endTime || !startTime) {
      return false;
    }
    return startTime.valueOf() >= endTime.valueOf();
  }
  handleStartOpenChange(open:any) {
    if (!open) {
      this.endOpen = true;
    }
  }
  handleEndOpenChange(open:any) {
    this.endOpen = open;
  }
  updateLocalData() {
    if (localStorage.getItem('userCreateAMMID') !== null) {
      // @ts-ignore
      this.userLocalAmmIdList = localStorage.getItem('userCreateAMMID').split('+++')
    } else {
      this.userLocalAmmIdList = []
    }
  }

  getNameForMint(mint: string) {
    const mintToken = Object.values(TOKENS).find((item) => item.mintAddress === mint)
    if (mintToken) {
      return `${mintToken.symbol}: ${mint}`
    }
    return mint
  }


  getSymbolForMint(mint: string) {
    const mintToken = Object.values(TOKENS).find((item) => item.mintAddress === mint)
    if (mintToken) {
      return `${mintToken.symbol}`
    }
    return mint
  }

  async getMarketMsg() {

    //@zhaohui
    // this.getMarketLoading = true

    // let market_t = {
    //   address: new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    //   baseMintAddress: new PublicKey(TOKENS.B2B.mintAddress),
    //   quoteMintAddress: new PublicKey(TOKENS.CRP.mintAddress),
    //   tickSize: 5,
    //   minOrderSize: 10
    // }

    // this.expectAmmId = (
    //     await createAssociatedId(
    //       new PublicKey(LIQUIDITY_POOL_PROGRAM_ID_V4),
    //       new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    //       AMM_ASSOCIATED_SEED
    //     )
    //   ).toString()

    // let price_t = 3.5, baseMintDecimals_t = 9, quoteMintDecimals_t = 9
    // this.stepsStatus = 'process'
    // this.stepTitleInputMarket = 'Import Serum Market ID'
    // this.current = 2
    // this.marketMsg = market_t
    // this.marketPrice = price_t
    // this.marketTickSize = getBigNumber(new BigNumber(market_t.tickSize))
    // this.baseMintDecimals = baseMintDecimals_t
    // this.quoteMintDecimals = quoteMintDecimals_t
    // this.marketStr = this.inputMarket
    // this.getMarketLoading = false

    // // let market_info = {
    // //   address: new PublicKey('9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT'),
    // //   baseMintAddress: new PublicKey(TOKENS.USDT.mintAddress),
    // //   quoteMintAddress: new PublicKey(TOKENS.CRP.mintAddress),
    // //   ammId: new PublicKey('3gSjs6MqyHFsp8DXvaKvVUJjV7qg5itf9qmUGuhnSaWH')
    // // }

    // // createAmm(this.$web3, this.$wallet, market_info, 0.5, 1)
    // return;

    this.getMarketLoading = true
    this.marketInputFlag = !this.marketInputFlag
    const { market, price, msg, baseMintDecimals, quoteMintDecimals } = await getMarket(this.$web3, this.inputMarket)

    if (this.inputMarket && market !== null) {
      this.expectAmmId = (
        await createAssociatedId(
          new PublicKey(LIQUIDITY_POOL_PROGRAM_ID_V4),
          new PublicKey(this.inputMarket),
          AMM_ASSOCIATED_SEED
        )
      ).toString()
    }
    if (market === null) {
      this.marketInputFlag = !this.marketInputFlag
      this.stepsStatus = 'error'
      this.stepTitleInputMarket = msg
    } else {
      this.stepsStatus = 'process'
      this.stepTitleInputMarket = 'Import Serum Market ID'
      this.current = 2
      this.marketMsg = market
      this.marketPrice = price
      this.marketTickSize = getBigNumber(new BigNumber(market.tickSize))
      this.baseMintDecimals = baseMintDecimals
      this.quoteMintDecimals = quoteMintDecimals
      this.marketStr = this.inputMarket
    }
    this.getMarketLoading = false
  }

  rewriteMarket() {
    this.marketInputFlag = !this.marketInputFlag
    this.current = 0
    this.marketMsg = null
    this.inputMarket = ''
    this.inputQuoteValue = 0
    this.inputBaseValue = 0
    this.inputPrice = 0
    this.marketError = null
    this.createAmmFlag = false
    this.userCreateAmmId = ''
    this.stepTitleMarketInfo = 'Price & Initial Liquidity'
    this.stepTitleInit = 'Initialize'
    clearLocal()
  }

  createKey() {
    this.stepTitleMarketInfo = 'Price & Initial Liquidity'
    this.stepTitleInit = 'Initialize'
    if (
      this.marketMsg == null ||
      this.inputQuoteValue === null ||
      this.inputBaseValue === null ||
      this.inputPrice === null ||
      this.inputQuoteValue <= 0 ||
      this.inputBaseValue <= 0 ||
      this.inputPrice <= 0
    ) {
      this.stepTitleMarketInfo = 'Please input coin value'
      this.stepsStatus = 'error'
      return
    } else {
      this.stepTitleMarketInfo = 'Price & Initial Liquidity'
      this.stepsStatus = 'process'
    }

    this.createAmmFlag = true

    createAmm(this.$web3, this.$wallet, this.marketMsg, this.inputBaseValue, this.inputQuoteValue)
      .then(async (data) => {
        this.stepsStatus = 'process'
        this.userCreateAmmId = data
        if (localStorage.getItem('userCreateAMMID') !== null) {
          localStorage.setItem('userCreateAMMID', localStorage.getItem('userCreateAMMID') + '+++')
        } else {
          localStorage.setItem('userCreateAMMID', '')
        }
        localStorage.setItem(
          'userCreateAMMID',
          localStorage.getItem('userCreateAMMID') +
            `${new Date().getTime()}---${data}---${
              this.marketMsg.address
            }---${this.marketMsg.baseMintAddress.toString()}---${this.marketMsg.quoteMintAddress.toString()}`
        )
        this.updateLocalData()
        this.createAmmFlag = true
        await this.$accessor.liquidity.requestInfos()
        this.current = 5
      })
      .catch((error) => {
        this.stepsStatus = 'error'
        this.current = 3
        this.createAmmFlag = false
        this.stepTitleInit = error.message
        throw error
      })
  }
}
</script>
<style lang="less" scoped>

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


main{
  background-color:#000;
  background-image:unset;
  background-size:cover;
  background-position:center bottom;
}

.steps{
      display: inline-block;
    width: 30%;
    border-right: 1px solid #444A58;
    padding-top: 24px;
}


.notstep{
  vertical-align:middle;
  padding: 10px 40px;
}


.create-pool {
  max-width: 90%;

  .card-body{
      padding: 10px 60px 15px;
  }
}
.create-pool-mobile {
  width: 100%;
}
.coin-select .coin-input button:hover{
  background-color: rgba(0, 0, 0, 0.9471) !important
}

input {
  background: transparent;
  outline: none;
  border: none;
  border-bottom: 1px #ccc solid;
  width: 90%;
  margin: 0 5%;
}
.item-title {
  text-align: left;
  padding-right: 5%;
}
.item-title-mobile {
  text-align: left;
  padding-right: 5%;
}
div {
  word-break: break-all;
  word-wrap: break-word;
}
.item-msg-mobile {
  padding-left: 10px;
}
.ant-layout{
  background:#000 !important
}

.ant-col {
  margin-bottom: 10px;
}
.msgClass div {
  line-height: 30px;
}
</style>
