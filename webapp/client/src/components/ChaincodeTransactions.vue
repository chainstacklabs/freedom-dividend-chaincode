<template>
  <div style="width: 100%">
    <v-form class="pb-5" ref="form" v-model="valid" style="width: 100%">
      <v-card class="pa-4" outlined>
        <v-row no-gutters>
          <v-col cols="12" xs="12"
            v-for="(parameter, index) in transaction.parameters"
            :key="index">
            <v-text-field
              required
              v-model="values[parameter.name]"
              :rules="[(v) => !!v || `${parameter.name} is required`]"
              :label="parameter.description"
            ></v-text-field>
          </v-col>
          <v-btn
            class="mr-4"
            color="primary"
            :disabled="!valid"
            :loading="loading"
            @click="submit()"
          >
            {{ transaction.name }}
          </v-btn>
        </v-row>
      </v-card>
    </v-form>

    <v-textarea
      class="mt-2"
      clearable
      outlined
      v-if="response"
      v-model="response"
      :error="isError"
      :success="!isError"
      :label="transaction.name"
    ></v-textarea>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChaincodeTransaction',

  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },

  created() {
    this.transaction.parameters.forEach((parameter) => {
      this.values[parameter.name] = null;
    });
  },

  data: () => ({
    valid: true,
    values: {},
    loading: false,
    response: null,
    isError: false,
  }),

  methods: {
    reset() {
      this.$refs.form.reset();
    },

    submit() {
      this.loading = true;
      axios.post('/chaincode/transaction', {
        contract: this.$route.params.chaincode,
        args: [this.transaction.name].concat(Object.values(this.values)),
      })
        .then(({ data }) => {
          this.isError = false;
          window.$eventHub.$emit('showAlert', {
            type: 'success',
            message: `${this.transaction.name} successfully invoked.`,
          });

          if (data) {
            this.response = decodeURIComponent(data);
          } else {
            this.response = null;
          }
          this.reset();
        })
        .catch((error) => {
          this.isError = true;
          window.$eventHub.$emit('showAlert', {
            type: 'error',
            message: `${this.transaction.name} failed to invoke.`,
          });
          this.response = error.response.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
