<template>
    <v-card color="secondary">
        <v-card-title>Apex Clients<v-btn class="mx-2" @click="newClientDiag = true">Connect new</v-btn></v-card-title>
        <v-card-text>
            <h3 class="mb-3">Connected Clients</h3>
            <div v-if="clients.length == 0"><i>Your apex client will show up here when it is connected</i></div>
            <v-row v-else class="client-wrap">
                <v-col cols="3" v-for="client in Object.keys(clients)" :key="client">
                    <v-card :class="{ connected: isConnected(client) }" class="client">
                        <v-card-title class="title">{{ client }}<v-spacer />
                            <span v-if="client == defaultClient">(Default)</span>
                        </v-card-title>
                        <v-card-text>
                            <span :class="{ connected: isConnected(client) }" class="offline">
                                {{ isConnected(client) ? 'Online' : 'Offline' }}
                            </span>
                            <span v-if="isConnected(client)">- {{ clients[client].state }}</span>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="setDefault(client)" dense>Set Default</v-btn>
                            <v-btn @click="selectedClient = client; launchArgDiag = true" dense>View Launch Args</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-card-text>
        <v-dialog v-model="newClientDiag" max-width="600px">
            <v-card>
                <v-toolbar class="toolbar" flat>Add New Client<v-spacer></v-spacer><icon-btn-filled icon="close"
                        @click="newClientDiag = false"></icon-btn-filled></v-toolbar>
                <v-card-text class="pa-4">
                    <v-text-field label="Client Name" v-model="newClient"></v-text-field>
                    <v-text-field label="Launch Args" readonly :disabled="newClient?.length == 0"
                        :value="newClient?.length > 0 ? getLaunchArgs(newClient) : 'Chose a client name'"></v-text-field>
                    Add these args to your apex launch args and start your game. Join a custom lobby in the observer slot.

                    <v-btn color="primary" block :disabled="this.newClient.length == 0" @click="addClient()">Add</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="launchArgDiag" max-width="600px">
            <v-card>
                <v-toolbar class="toolbar" flat>Copy Launch Args<v-spacer></v-spacer><icon-btn-filled icon="close"
                        @click="launchArgDiag = false"></icon-btn-filled></v-toolbar>
                <v-card-text class="pa-4">
                    <v-text-field label="Launch Args" readonly :value="getLaunchArgs(selectedClient)"></v-text-field>
                    Add these args to your apex launch args and start your game. Join a custom lobby in the observer slot.
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>
<script>
import IconBtnFilled from "@/components/IconBtnFilled.vue"

export default {
    components: {
        IconBtnFilled,
    },
    props: ["organizer"],
    data() {
        return {
            clients: [],
            defaultClient: "",
            newClient: "",
            newClientDiag: false,
            selectedClient: "",
            launchArgDiag: false,
        }
    },
    methods: {
        getLaunchArgs(client) {
            return `+cl_liveapi_enabled 1 +cl_liveapi_ws_servers "${this.$apex.config.wsUrl}/live/write/${this.$apex.getApiKey()}/${encodeURIComponent(client)}" +cl_liveapi_use_protobuf 0`
        },
        isConnected(client) {
            return this.clients[client].connected;
        },
        async getClients() {
            this.clients = await this.$apex.getClients(this.organizer);
            this.defaultClient = await this.$apex.getOrganizerDefaultApexClient(this.organizer);
            if (!this.stop) {
                setTimeout(() => this.getClients(), 1000);
            }
        },
        async setDefault(client) {
            await this.$apex.setOrganizerDefaultApexClient(this.organizer, client);
        },
        async addClient() {
            await this.$apex.addClient(this.newClient);
            this.newClientDiag = false;
            this.newClient = "";
        }
    },
    mounted() {
        this.getClients();
    },
    destroyed() {
        this.stop = true;
    }
}
</script>
<style scoped lang="scss">
.client {
    font-size: 1.2em;
    border-bottom: 2px solid red;

    &.connected {
        border-bottom: 2px solid green;
    }

    .offline {
        color: red;
    }

    .connected {
        color: green;
    }
}

.title {
    height: 64px;

    span {
        font-size: .7em;
    }
}

.toolbar.v-sheet.v-toolbar {
    background-color: $primary !important;
}
</style>