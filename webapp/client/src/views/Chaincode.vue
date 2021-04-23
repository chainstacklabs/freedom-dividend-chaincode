<template>
  <v-container class="w-100 h-100" v-if="!loadComplete">
    <div class="w-100 h-100 d-flex justify-center align-center">
      <v-progress-circular
        :size="70"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </v-container>
  <v-container v-else>
    <p class="title font-weight-bold">{{ mspId }}</p>
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

  created() {
    axios.get(`/chaincode/${this.$route.params.chaincode}`)
      .then(({ data: { contract: { contracts, info }, mspId } }) => {
        this.fetchChaincode(contracts, info);
        this.mspId = mspId;
      })
      .catch((error) => {
        window.$eventHub.$emit('showAlert', {
          message: error.response.data,
          type: 'error',
        });

        this.$router.push({ name: 'Main' });
      });
  },

  data: () => ({
    contract: null,
    info: null,
    mspId: null,
    loadComplete: false,
  }),

  methods: {
    fetchChaincode(contracts, info) {
      this.contract = contracts[Object.keys(contracts).find((key) => key !== 'org.hyperledger.fabric')];
      this.info = info;
      this.loadComplete = true;
    },
  },
};
</script>
