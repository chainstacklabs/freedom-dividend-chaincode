<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link :to="{ name: 'Main'}">
        <v-img src="/logo.svg" max-width="220"></v-img>
      </router-link>
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <v-snackbar
        v-model="showAlert"
        :color="alertMessage.type"
        :timeout=3000
      >
        {{ alertMessage.message }}
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
      showAlert: false,
      alertMessage: {},
    };
  },

  created() {
    document.title = 'Fabric V2.1 Webapp';
    window.$eventHub.$on('showAlert', this.showAlertSnackBar);
  },

  beforeDestroy() {
    window.$eventHub.$off('showAlert');
  },

  methods: {
    showAlertSnackBar(alert) {
      this.alertMessage = alert;
      this.showAlert = true;
    },
  },
};
</script>
