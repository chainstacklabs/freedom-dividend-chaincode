<template>
  <v-container>
    <p class="title">
      <span class="font-weight-bold">Chaincode</span>: {{ $route.params.chaincode }}
    </p>
    <v-row align="center" class="px-4">
      <v-form class="pb-4" ref="form" v-model="valid" style="width: 100%">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field v-model="ssnId" :rules="ssnIdRules"
              label="SSN ID" required></v-text-field>
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field v-model="description" :rules="descriptionRules"
              label="description" required>
            </v-text-field>
          </v-col>
        </v-row>
        <v-btn :disabled="!valid || isSubmitting" color="primary" class="mr-4" @click="optIn">
          Opt In
        </v-btn>
      </v-form>

      <v-form class="pb-4" ref="form" v-model="valid" style="width: 100%">
        <v-text-field v-model="querySsnId" :rules="ssnIdRules"
            label="SSN ID" required></v-text-field>
        <v-btn :disabled="!valid || isSubmitting" color="primary" class="mr-4" @click="querySSN">
          Query SSN
        </v-btn>
      </v-form>
    </v-row>

    <v-snackbar v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
    >
      {{ snackbarText }}
    </v-snackbar>

    <v-textarea
      v-if="responseData"
      class="mt-2"
      clearable
      outlined
      :error="isError"
      :success="!isError"
      :label="isError ? 'Error' : 'SSN description'"
      v-model="responseData"
    ></v-textarea>
  </v-container>


</template>

<script>
import axios from 'axios';

export default {
  name: 'Chaincode',

  data: () => ({
    valid: true,
    ssnId: '123-456-789',
    querySsnId: '123-456-789',
    description: 'Some freedom divided v4 ',
    ssnIdRules: [(v) => !!v || 'SSN ID is required'],
    descriptionRules: [(v) => !!v || 'Description is required'],
    snackbar: false,
    snackbarText: '',
    isSubmitting: false,
    snackbarColor: '',
    responseData: null,
    isError: false,
  }),

  methods: {
    optIn() {
      this.responseData = null;
      this.isSubmitting = true;
      axios.post('/chaincode/transaction', {
        contract: this.$route.params.chaincode,
        args: ['optIn', this.ssnId, this.description],
      })
        .then(() => {
          this.snackbarText = `Opt In successfully invoked with ${this.ssnId}.`;
          this.snackbarColor = 'success';
        })
        .catch((error) => {
          this.responseData = error.response.data;
          this.snackbarText = 'Opt In failed to invoke.';
          this.snackbarColor = 'error';
        })
        .finally(() => {
          this.snackbar = true;
          this.isSubmitting = false;
        });
    },

    querySSN() {
      this.responseData = null;
      this.isSubmitting = true;
      axios.post('/chaincode/transaction', {
        contract: this.$route.params.chaincode,
        args: ['querySSN', this.querySsnId],
      })
        .then(({ data }) => {
          this.responseData = JSON.stringify(data);
        })
        .catch((error) => {
          this.responseData = error.response.data;
          this.snackbar = true;
          this.snackbarText = 'Opt In failed to invoke.';
          this.snackbarColor = 'error';
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>
