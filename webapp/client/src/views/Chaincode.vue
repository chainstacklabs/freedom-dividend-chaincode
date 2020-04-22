<template>
  <v-container>
    <div>
      <span class="title font-weight-bold">Chaincode Name: {{ $route.params.chaincode }} </span>
      <v-divider class="my-2"></v-divider>
      <div v-if="info">
        <span class="title font-weight-bold">Contract package info:</span>
          <ul>
            <li v-for="(key, index) in Object.keys(info)" :key="index">
              {{ key }} : {{ info[key] }}
            </li>
          </ul>
      </div>
    </div>
    <v-divider class="my-2"></v-divider>
    <span class="title font-weight-bold">Chaincode transactions:</span>
    <v-row align="center" class="px-4" v-if="contract">
      <ChaincodeTransactions
        v-for="(transaction, index) in contract.transactions"
        :transaction="transaction"
        :key="index"
      ></ChaincodeTransactions>
    </v-row>
  </v-container>


</template>

<script>
import ChaincodeTransactions from '@/components/ChaincodeTransactions.vue';
import axios from 'axios';

export default {
  name: 'Chaincode',

  components: {
    ChaincodeTransactions,
  },

  beforeRouteEnter(to, from, next) {
    axios.get(`/chaincode/${to.params.chaincode}`)
      .then(({ data: { contracts, info } }) => {
        next((vm) => vm.fetchChaincode(contracts, info));
      })
      .catch((error) => {
        window.$eventHub.$emit('showAlert', {
          message: error.response.data,
          type: 'error',
        });

        next({ name: 'Main' });
      });
  },

  data: () => ({
    contract: null,
    info: null,
  }),

  methods: {
    fetchChaincode(contracts, info) {
      this.contract = contracts[Object.keys(contracts).find((key) => key !== 'org.hyperledger.fabric')];
      this.info = info;
    },
  },
};
</script>
