<template>
  <v-app>
    <v-app-bar
      app
      dark
      color="primary"
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
        :timeout="10000"
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
    document.title = 'Fabric v2.1 web app';
    window.$eventHub.$on('showAlert', this.showAlertSnackBar);
  },

  beforeDestroy() {
    window.$eventHub.$off('showAlert');
  },

  methods: {
    showAlertSnackBar(alert) {
      if (alert) {
        this.alertMessage = alert;
        this.showAlert = true;
      }
    },
  },
};
</script>
