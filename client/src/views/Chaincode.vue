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
      v-if="error"
      clearable
      outlined
      error
      label="Error"
      v-model="error"
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
    error: null,
  }),

  methods: {
    optIn() {
      this.error = null;
      this.isSubmitting = true;
      axios.post('/chaincode/transaction', {
        contract: this.$route.params.chaincode,
        args: ['optIn', this.ssnId, this.description],
      })
        .then(() => {
          this.snackbarText = 'Opt In successfully invoked.';
          this.snackbarColor = 'success';
        })
        .catch((error) => {
          this.error = error.response.data;
          this.snackbarText = 'Opt In failed to invoke.';
          this.snackbarColor = 'error';
        })
        .finally(() => {
          this.snackbar = true;
          this.isSubmitting = false;
        });
    },

    querySSN() {
      this.error = null;
      this.isSubmitting = true;
      axios.post('/chaincode/transaction', {
        contract: this.$route.params.chaincode,
        args: ['querySSN', this.querySsnId],
      })
        .then(({ data }) => {
          this.snackbarText = JSON.stringify(data);
          this.snackbarColor = 'success';
        })
        .catch((error) => {
          this.error = error.response.data;
          this.snackbarText = 'Opt In failed to invoke.';
          this.snackbarColor = 'error';
        })
        .finally(() => {
          this.snackbar = true;
          this.isSubmitting = false;
        });
    },
  },
};
</script>
