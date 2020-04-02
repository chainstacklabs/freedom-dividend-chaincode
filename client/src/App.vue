<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <router-link :to="{ name: 'Main'}">
        <v-img src="/chainstackLogo.svg" max-width="220"></v-img>
      </router-link>
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://docs.chainstack.com/tutorials/fabric/universal-basic-income-opt-in-chaincode"
        target="_blank"
        text
      >
        <span class="mr-2">Documentation</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    //
  }),
};
</script>
