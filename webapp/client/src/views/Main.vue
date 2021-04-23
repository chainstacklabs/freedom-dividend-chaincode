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
    <v-row no-gutters>
      <p class="title font-weight-bold" v-if="network.installed_chaincodes">Installed chaincodes</p>
      <v-spacer></v-spacer>
      <ActionButton
        v-if="!network.installed_chaincodes"
        display="Install Chaincode"
        :action="{ action: 'post', path: '/chaincode/install' }"
        :post-action="getNetwork"
      ></ActionButton>
    </v-row>

    <v-card class="mx-auto">
      <v-list class="pa-0">
        <v-list-group
          no-action
          v-for="(item, index) in network.installed_chaincodes"
          value="true"
          :key="index"
          :class="{ disable_link: !item.references }"
        >
          <template v-slot:activator>
            <v-list-item class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold"
                  v-text="item.label"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <div>
            <code>
              Package ID: {{ item.package_id }}
              <ActionButton
                v-if="item.details.approvals && item.details.approvals[mspId] != true"
                display="Approve"
                tooltip-content="Approve chaincode"
                :action="{
                  action: 'post',
                  path: '/chaincode/approve',
                  parameter: { package_id: item.package_id },
                }"
                :post-action="getNetwork"
              ></ActionButton>

              <ActionButton
                v-else-if="!item.details.name"
                display="Commit"
                tooltip-content="Commit chaincode"
                :action="{
                  action: 'post',
                  path: '/chaincode/commit',
                }"
                :post-action="getNetwork"
              ></ActionButton>
            </code>
            <code>{{ item.details }}</code>
            <v-card-actions v-if="item.committed">
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="goTo(item.details.name)">Access Chaincode</v-btn>
            </v-card-actions>
          </div>
        </v-list-group>
      </v-list>
    </v-card>

    <p class="title font-weight-bold my-4">Fabric channel details</p>

    <v-card class="mx-auto">
      <v-list class="pa-0">
        <v-list-group
          no-action
          v-for="config in configs"
          :key="config.type"
          value="true"
        >
          <template v-slot:activator>
            <v-list-item class="pa-0">
              <v-list-item-content>
                <v-list-item-title
                  class="font-weight-bold"
                  v-text="config.display"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <code>
            <tree-view :data="network[config.type]" :options="{maxDepth: 2}"></tree-view>
          </code>
        </v-list-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import ActionButton from '@/components/ActionButton.vue';

export default {
  name: 'Main',

  components: {
    ActionButton,
  },

  created() {
    this.getNetwork()
      .finally(() => {
        this.loadComplete = true;
        this.poll();
      });
  },

  data: () => ({
    network: {},
    loadComplete: false,
    mspId: null,
    configs: [{ type: 'config', display: 'Channel config' }, { type: 'peers', display: 'Channel peers' }],
  }),

  methods: {
    poll() {
      setInterval(this.getNetwork, 10000);
    },

    goTo(name) {
      this.$router.push({ name: 'Chaincode', params: { chaincode: name } })
        .catch(() => {});
    },

    getNetwork() {
      return axios.get('/network')
        .then(({ data }) => {
          this.network = data;
          this.mspId = data.mspId;
        })
        .catch((error) => {
          window.$eventHub.$emit('showAlert', {
            type: 'error',
            message: error.response.data.message,
          });
        })
        .finally(() => {
          this.loadComplete = true;
        });
    },
  },
};

</script>

<style lang="scss">
  .w-100 {
    width: 100%;
  }
  .h-100 {
    height: 100%;
  }
  code {
    padding: 10px 16px !important;
    // color: black !important;
    word-wrap: break-word !important;
    &:before {
      content: '' !important;
    }

    &:after {
      content: none !important;
    }

    border-radius: 0 !important;
    width: 100%;
    padding: 10px;
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
