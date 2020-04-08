<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="d-flex" cols="12" sm="12">
        <v-select
          v-model="channel"
          :items="network.channels"
          label="Channel"
        ></v-select>
      </v-col>
    </v-row>

    <p class="title font-weight-bold">Installed chaincode packages</p>
    <v-card class="mx-auto">
      <v-list class="pa-0">
        <v-list-group
          v-for="(item, index) in network.installed_chaincodes"
          value="true"
          :key="index"
          no-action
          disabled
          append-icon=""
          :class="{ disable_link: !item.references }"
          :ripple="item.references !== undefined"
        >
          <template v-slot:activator>
            <v-list-item-content @click="goTo(item)">
              <v-list-item-title v-text="item.label"></v-list-item-title>
            </v-list-item-content>
          </template>
          <div v-if="item.references">
            <code>{{ getDefinition(item.references) }}</code>
          </div>
        </v-list-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Main',

  created() {
    axios.get('/network')
      .then(({ data }) => {
        this.network = data;
        const [channel] = data.channels;
        this.channel = channel;
      });
  },

  data: () => ({
    network: {},
    channel: null,
  }),

  methods: {
    getDefinition(references) {
      const chaincodeName = references[this.channel].chaincodes[0].name;

      return this.network.chaincode_definitions.find(({ name }) => name === chaincodeName);
    },

    goTo({ references }) {
      if (references) {
        const { name } = this.getDefinition(references);
        this.$router.push({ name: 'Chaincode', params: { chaincode: name } });
      }
    },
  },
};
</script>

<style lang="scss">
  code {
    color: black !important;
    &:before {
      content: '' !important;
    }

    width: 100%;
    padding: 10px;
    // padding-left: 8px;
  }

  .disable_link {
    background-color: rgba(0,0,0, 0.1);
    .v-list-item {
      &:hover:before {
        opacity: 0;
      }
    }
  }
</style>
