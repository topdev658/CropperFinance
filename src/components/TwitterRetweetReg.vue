<template>
  <div :class="this.progression">
    <Modal
      :title="title"
      :visible="show"
      :footer="null"
      :mask-closable="true"
      :closable="true"
      @cancel="$emit('onClose')"
    >
      <div v-if="this.progression < 1">

        <Row :gutter="32" class="actions">
          <Col :span="24" style="text-align: center">
            <div class="btncontainer">
              <Button
                ghost
                @click="nextStep()"
              >
                + Register for Whitelist
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <div v-else-if="this.progression == 1" class="multistepmodal">
        <div class="steps">

                <div :class="this.twitterA ? 'notdone' : 'notdone' " >
                    <span v-if="!this.twitterA" class="first">1</span>
                    <span v-else class="span first"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>
                      <a href="https://twitter.com/CropperFinance" target="_blank" @click="validateTwitterA()" >
                        <img src="@/assets/icons/twitter.svg" width="40" height="40" />
                      </a> Follow <b>CropperFinance</b> on Twitter</div>
                </div>

                <div :class="this.telegramA ? 'notdone' : 'notdone' ">
                    <span v-if="!this.telegramA">2</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>
                      <a href="https://t.me/CropperFinance" target="_blank" @click="validateTelegramA()" >
                        <img src="@/assets/icons/telegram.svg" width="40" height="40" />
                      </a>
                      Join <b>CropperFinance</b> on Telegram</div>
                </div>


                <div v-if="this.farm.links.twitter" :class="this.twitterB ? 'notdone' : 'notdone' " >
                    <span v-if="!this.twitterB">3</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>
                      <a :href="this.farm.links.twitter" target="_blank" @click="validateTwitterB()" >
                        <img src="@/assets/icons/twitter.svg" width="40" height="40" />
                      </a> Follow <b>{{this.farm.shortname}}</b> on Twitter</div>
                </div>

                <div v-if="this.farm.links.telegram" :class="this.telegramB ? 'notdone' : 'notdone' " >
                    <span v-if="!this.telegramB">4</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>
                      <a :href="this.farm.links.telegram" target="_blank" @click="validateTelegramB()" >
                        <img src="@/assets/icons/telegram.svg" width="40" height="40" />
                      </a> Join <b>{{this.farm.shortname}}</b> on Telegram</div>
                </div>


                <div :class="this.inputtwitter ? 'notdone' : 'notdone' ">
                    <span v-if="!this.inputtwitter">{{this.farm.links.twitter ? 5 : 3}}</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span> 
                    <div>Input your twitter ID 
                      <div>
                        <span class="inputContent">
                          <input type="text" class="twlink" placeholder="Paste your twitter ID here" @input="tw($event.target.value)" />
                          <button class="submitbutton" @click="checkTw()">Submit</button>
                        </span>
                      </div>
                    </div>
                </div>

                <div :class="this.inputtelegram ? 'notdone' : 'notdone' ">
                    <span v-if="!this.inputtelegram">{{this.farm.links.twitter ? 6 : 4}}</span>
                    <span v-else class="span"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>Input your telegram ID 
                      <div>
                        <span class="inputContent">
                          <input type="text" class="twlink" placeholder="Paste your telegram ID here" @input="tg($event.target.value)" />
                          <button class="submitbutton" @click="checkTg()">Submit</button>
                        </span>
                      </div>
                    </div>
                </div>




        </div>

        <div class="infoCheck">We will be checking if you’ve did the above tasks.</div>

        <Row :gutter="32" class="actions">
          <Col :span="24" style="text-align: center">
            <div class="btncontainer"
              :disabled="!this.stepAok">
            <Button
              ghost

              :disabled="!this.stepAok"
              @click="nextStep()"
            >
              Next task
            </Button>
            </div>
          </Col>
        </Row>
      </div>


      <div v-else-if="this.progression == 3">
        <div class="congrats">

          <div v-if="registerError != ''" class="error">
              {{registerError}}
          </div>
          <div v-else>You have been successfully registered !</div>

        </div>

        <Row :gutter="32" class="actions">
          <Col :span="24" style="text-align: center">
            <div class="btncontainer">
            <Button
              ghost
              @click="$emit('onClose')"
            >
              Close
            </Button>
            </div>
          </Col>
        </Row>
      </div>

      <div v-else-if="this.progression == 2" class="multistepmodal">
        <div class="steps">

                <div :class="this.inputretwit ? 'notdone big' : 'notdone big' " >
                    <span v-if="!this.inputretwit" class="first">1</span>
                    <span v-else class="span2 first"><img src="https://cropper.finance/distant/check-one.png?t=1" alt=""></span>
                    <div>


                    <div class="inforetweet">Quote Retweet by tagging 3 friends 
and using the #CropperFiance #Fertilizer</div>

                    <div>

                    <blockquote class="twitter-tweet"><p lang="en" dir="ltr">👨🏻‍🌾 Dear Croppers,<br><br>📣 We’re excited to announce our Farm Launcher’s hero feature. <br><br>🎉 Introducing a feature that celebrates DeFi innovation while rewarding farmers. <br><br>🤝 Meet <a href="https://twitter.com/hashtag/Fertilizer?src=hash&amp;ref_src=twsrc%5Etfw">#Fertilizer</a>🧪<a href="https://t.co/BeuvL2aUbz">https://t.co/BeuvL2aUbz</a></p>&mdash; CropperFinance (@CropperFinance) <a href="https://twitter.com/CropperFinance/status/1443533161913372672?ref_src=twsrc%5Etfw">September 30, 2021</a></blockquote> <script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                    </div>

                  <div class="twitter-link">

                    
                      <span class="inputContent">
                        <input type="text" class="twlink" placeholder="Paste your retweet link here" @input="nurl($event.target.value)" />
                        <button class="submitbutton" @click="checkUrl()">Submit</button>
                      </span>
                  </div>
              </div>
          </div>

        </div>

        <div class="infoCheck">We will be checking if you’ve did the above tasks.</div>


        <Row :gutter="32" class="actions">
          <Col :span="24" style="text-align: center">
          <div class="btncontainer"
              :disabled="!this.stepBok">
            <Button
              ghost
              :disabled="!this.stepBok"
              @click="nextStep()"
            >
              Done
            </Button>
            </div>
          </Col>
        </Row>
      </div>


    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal, Button, Row, Col } from 'ant-design-vue'

Vue.use(Modal)


export default Vue.extend({
  components: {
    Modal,
    Button,
    Row,
    Col
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    farm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      progression: 0,
      url : false as any,
      inputtelegramContent : false as any,
      inputtwitterContent : false as any,
      twitterA : false as any,
      twitterB : false as any,
      telegramA : false as any,
      telegramB : false as any,
      inputtelegram : false as any,
      inputtwitter : false as any,
      inputretwit : false as any,
      stepAok : false as any,
      stepBok : false as any,
      registerError : "",
      walletAddress: false as any,
      title: this.farm.tokenA.symbol + "-" + this.farm.tokenB.symbol +" Private Farm "
    }
  },
  methods: {
    async nextStep(){
      if(this.progression < 1){ 
        this.progression = 0;
      }
      this.progression++;
      this.walletAddress = "https://api.cropper.finance/fertilizer/project/?f=" + this.farm.slug + "&r=" + this.$accessor.wallet.address;


      if(this.progression == 3){ 
        let registerUrl = 'https://api.cropper.finance/pfo/register/?spl=' + this.$accessor.wallet.address + '&farmId='+ this.farm.pfarmID;


        const query = new URLSearchParams(window.location.search);
        if(query.get('r')){
          registerUrl += '&referer=' + query.get('r');
        }


        this.registerError = "";
        let responseData
        try{
          responseData = await fetch(
            registerUrl
          ).then(res => res.json());
        }
        catch{
          this.registerError = "An error occured"
        }
        finally{
            this.progression = 3;

        }
      }
    },

    validateTwitterA(){
      this.twitterA = true;
      this.checkStepA();
    },

    validateTelegramA(){
      this.telegramA = true;
      this.checkStepA();
    },

    validateTwitterB(){
      this.twitterB = true;
      this.checkStepA();
    },

    validateTelegramB(){
      this.telegramB = true;
      this.checkStepA();
    },

    checkTw(){

      if(this.inputtwitterContent.length < 5 || this.inputtwitterContent == false){  
        this.inputtwitter =  false; 
      } else {
        this.inputtwitter =  true; 
      }
      this.checkStepA();
    },

    checkTg(){

      if(this.inputtelegramContent.length < 5 || this.inputtelegramContent == false){  
        this.inputtelegram =  false; 
      } else {
        this.inputtelegram =  true; 
      }
      this.checkStepA();
    },

    checkStepA(){
      if(!this.twitterA) { this.stepAok = false; return; }
      if(!this.telegramA) { this.stepAok =  false; return; }

      if(this.farm.links.twitter){
        if(!this.twitterB) { this.stepAok =  false; return; }
      }

      if(this.farm.links.telegram){
        if(!this.telegramB) { this.stepAok =  false; return; }  
      } 

      if(this.inputtelegramContent.length < 5 || this.inputtelegramContent == false){  this.stepAok =  false; return;  }
      if(this.inputtwitterContent.length < 5 || this.inputtwitterContent == false){  this.stepAok =  false; return;  }

      this.stepAok = true;

    },

    nurl(url: string) {
        this.url = url
    },


    tw(url: string) {
        this.inputtwitterContent = url

    },

    tg(url: string) {
        this.inputtelegramContent = url
    },


    checkStepB(){
      if(!this.inputretwit){  this.stepBok =  false; return;  }

      this.stepBok = true;

    },

    async checkUrl(){
      let url;


      this.inputretwit = false;
      
      try {
        url = new URL(this.url);
      } catch (_) {
        return false;  
      }


      this.inputretwit = true;
      this.checkStepB();


      return url.protocol === "http:" || url.protocol === "https:";
    }
  }

})
</script>

<style lang="less" scoped>
@import '../styles/variables';

input.link{
    width: 100%;
    padding: 10px;
    border-radius: 10px;
    margin-top: 5px;
}

.twitter-link {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  color: #fff;
  a{
    color:gray
  }
  a[disabled] {
    color: gray;
  }
  &.current a{
    color:#fff;
    font-weight:bold
  }
}

span.inputContent{
  background: #09B17F;
  padding: 2px;
  display: inline-block;
  border-radius: 5px;
  margin-top:3px;

  .twlink{
    border:none;
    padding:4px 10px;
    border-radius:5px 0 0 5px;
    background:#01033C;
    width: 230px; 
  }

  .submitbutton{
    border:none;
    padding:4px 10px;
    border-radius:5px;
    margin-right:5px;
    background:#09B17F;
    cursor:pointer;
  }
}



.retweet {
  display: grid;
  grid-auto-rows: auto;
  row-gap: 14px;
  margin-top: 10px;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-right: 20px;

  .retweet-image {
    height: 200px;
    border: 1px solid @primary-color;
  }

  input {
    color: #000;
    padding: 5px 20px;
    display: inline-block;
    width: 90%;
    border-radius: 5px;
    border: none;
    margin-top: 13px;

    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }
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

    &[disabled]{
      background: #CCC;
    }

    button{
      background:#01033C !important;
      position: relative;
      border-radius: 30px;
      border-color: transparent;
    }

  }

.infoCheck{
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #FFF;
  background: #1E4559;
  border: 1px solid #47A3D5;
  box-sizing: border-box;
  border-radius: 6px;
  padding:7px 0;
  margin:30px auto;
}

.inforetweet{
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  color: #FFF;
}

.multistepmodal .steps{
  & > div{
    background:#01033C;
    border-radius:6px;
    margin:10px 30px 10px 90px;
    padding:0 11px;
    position:relative;

    & > div{
      font-style: normal;
      font-size: 14px;
      line-height: 16px;
      color: #fff;
      position:absolute;
      width:100%;
      font-weight:300;
      top:50%;
      transform:translate(0, -50%);
      a{
        position:absolute;
        right:20px;
        top:50%;
        transform:translate(0, -50%);
      }
    }

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

    & > span:not(.span,.span2){
      position:absolute;
      left: -60px;
      top: 50% !important;
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
      &:not(.first)::before{
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
    & > .span2{
      position:absolute;
      left: -60px;
      top: 59px;
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

    & > span:not(.span2,.span){
      position:absolute;
      left: -60px;
      top: 59px;
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
      &:not(.first)::before{
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

  &:not(.big){
    height:59px;
  }

  &.big > div{
    position:relative;
    top:unset;
    transform:unset;
    padding-bottom:7px;
    padding-top:7px;
  }
    &.done{
      background: #09B17F;
      .date{
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
      }

      & > div {
        color:#fff !important
      }
      & >div:not(.done) div.date{
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
    }


  }


  

}




.error{
  color: red;
    padding: 0 0 20px;
    font-weight: bold;
    text-align: center;
}

.congrats{
  font-size: 18px;
  text-align: center;
  padding: 20px;
  margin: auto;
}


@media (max-width: 700px){

  .multistepmodal .steps > div{
    margin: 10px -30px 10px 40px;
  }

  span.inputContent .twlink{
    width: 190px;
  }

}

</style>
