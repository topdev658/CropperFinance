<template>
  <Modal title="An error occured" :visible="true" :footer="null" :width="600" centered @cancel="$emit('onNothing')">
    <div class="card">
      <div class="card-body">
        <div>
          An error occured during the stake process.<br><br>

          Currently, your liquidity is in the liquidity pool
          and you will receive fees on swaps but no reward from the farm.
          <br>
          What do you want to do?
          <br>
        </div>
        
      </div>
    </div>
    <Row :gutter="32" class="actions">
      <Col :span="8">
        <Button ghost @click="$emit('onRetry')" >Retry to stake</Button>
      </Col>
      <Col :span="8">
        <Button ghost @click="$emit('onRemove')" >Remove Liquidity</Button>
      </Col>
      <Col :span="8">
        <Button ghost @click="$emit('onNothing')">Nothing</Button>
      </Col>
    </Row>
  </Modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Modal,  Button, Row, Col } from 'ant-design-vue'

// fix: Failed to resolve directive: ant-portal
Vue.use(Modal)

export default Vue.extend({
  components: {
    Modal,
    Button,
    Row,
    Col
  },
  data() {
    return {
    }
  },
  methods: {
    
  }
})
</script>

<style lang="less" scoped>
@import '../styles/variables';
.actions {
  margin-top: 10px;

  button {
    width: 100%;
  }
}
</style>
