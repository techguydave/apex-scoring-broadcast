<template>
    <div>
        <v-card>
            <v-card-title>Name</v-card-title>
            <v-card-text>
                <v-form><v-text-field solo v-model="settingsCopy.name"></v-text-field></v-form>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>Browser Source</v-card-title>
            <v-card-text>
                <v-form><v-text-field solo :value="broadcastLink" readonly></v-text-field></v-form>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-title>Override Match</v-card-title>
            <v-card-subtitle>By default this display will use the match selected in the match section of the panel (on the
                sidebar). If you want to override this display to use a specific match, chose it here.</v-card-subtitle>
            <v-card-text>
                <v-select :items="matchList" v-model="settingsCopy.selectedMatch" clearable placeholder="(default)" dense
                    solo></v-select>
            </v-card-text>
            <v-card-title>Override Apex Client</v-card-title>
            <v-card-subtitle>By default this display will use the client set as default in the Apex Clients section. If you
                want to override, chose the client here. To add a client, go to the Apex Clients section. </v-card-subtitle>
            <v-card-text> <v-select :items="clientList" v-model="settingsCopy.selectedClient" clearable
                    placeholder="(default)" dense solo></v-select>
            </v-card-text>
            <v-card-title>Observer Name</v-card-title>
            <v-card-subtitle>Set the apex name of the observer this display should follow</v-card-subtitle>
            <v-card-text> <v-text-field v-model="settingsCopy.observerName" solo placeholder="Observer Name"></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ["value", "eventId", "organizer"],
    data() {
        return {
            matchList: [],
            clientList: [],
            settingsCopy: this.value,
        }
    },
    computed: {
        broadcastLink() {
            return window.location.origin + this.$router.resolve({ name: 'broadcast', params: { organizer: this.organizer, display: this.value.id } }).href;
        }
    },
    watch: {
        value: {
            deep: true,
            handler() {
                this.settingsCopy = this.value;
                console.log(this.settingsCopy)
            }
        }
    },
    async mounted() {
        this.matchList = await this.$apex.getMatchList(this.organizer);

        this.clientList = Object.keys(await this.$apex.getClients(this.organizer));
    }
}
</script>