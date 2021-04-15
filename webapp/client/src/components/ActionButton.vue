<template>
    <v-tooltip
      right
      :disabled="tooltipContent === ''"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          small
          v-on="on"
          :icon="icon"
          :loading="isLoading"
          @click="submit"
        >
          <v-icon v-if="icon" color="primary">{{ display }}</v-icon>
          <span v-else>{{ display }}</span>
        </v-btn>
      </template>
      <span>{{ tooltipContent }}</span>
    </v-tooltip>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ActionButton',

  props: {
    action: {
      type: Object,
      required: true,
    },

    display: {
      type: String,
      required: true,
    },

    icon: {
      type: Boolean,
      default: false,
    },

    tooltipContent: {
      type: String,
      default: '',
    },

    postAction: {
      type: Function,
      default: () => {},
    },
  },

  data: () => ({
    isLoading: false,
  }),

  methods: {
    async submit() {
      this.isLoading = true;
      const { action, path, parameter } = this.action;

      const parameters = {
        method: action,
        url: path,
      };

      if (parameter) {
        parameters.data = parameter;
      }

      await axios(parameters)
        .then(({ data }) => { this.$emit('response', data); })
        .then(async () => { await this.postAction(); })
        .catch((error) => {
          window.$eventHub.$emit('showAlert', {
            type: 'error',
            message: error.response.data.message,
          });
        });

      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .v-btn {
    font-family: Roboto, sans-serif !important;
  }
</style>
