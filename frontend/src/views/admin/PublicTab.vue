<template>
    <v-container>

        <v-row>
            <v-col sm="12" lg="6">
                <v-card>
                    <v-card-title>Settings</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="publicData.title" label="Title"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="setPublicSettings" color="primary">Submit</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card>
                    <v-card-title>Public Link</v-card-title>
                    <v-card-text>
                        <v-form><v-text-field solo :value="publicUrl" readonly></v-text-field></v-form>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" lg="6">
                <v-card>
                    <v-card-title>Twitch Chat Intergration</v-card-title>
                    <v-card-text>
                        <v-text-field v-model="command" label="Command"></v-text-field>
                        <v-radio-group v-model="add">
                            <v-radio key="add" value="add" :label="`Add new command ${command}`"></v-radio>
                            <v-radio key="edit" value="edit" :label="`Update existing command ${command}`"></v-radio>
                            <v-radio key="raw" value="raw" :label="`Raw command (Add via website)`"></v-radio>
                        </v-radio-group>

                        <template v-if="add != 'raw'">
                            <v-text-field readonly label="Nightbot" :value="nightbotCommand"></v-text-field>
                            <v-text-field readonly label="Stream Elements" :value="SECommand"></v-text-field>
                        </template>
                        <v-text-field v-else readonly label="Command" :value="rawCommand"></v-text-field>
                    </v-card-text>

                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<script>
export default {
    props: ["eventId", "organizer"],
    data() {
        return {
            publicData: {},
            publicUrl: undefined,
            command: "!now",
            add: "edit",
        }
    },
    computed: {
        publicFullUrl() {
            return window.location.origin + this.$router.resolve({ name: 'tournament.standings', params: { eventId: this.eventId, organizer: this.organizer, game: "overall" } }).href;
        },
        summaryUrl() {
            return encodeURI(`${this.$apex.config.fullUrl}stats/${this.organizer}/${this.eventId}/summary`);
        },
        rawCommand() {
            return `$(urlfetch ${this.summaryUrl}) -- ${this.publicUrl}`;
        },
        SECommand() {
            return `!command ${this.add} ${this.command} ${this.rawCommand}`;
        },
        nightbotCommand() {
            return `!commands ${this.add} ${this.command} ${this.rawCommand}`;
        },

    },
    methods: {
        setPublicSettings() {
            this.$apex.setPublicSettings(this.organizer, this.eventId, this.publicData);
        },
        async refreshPublicOptions() {
            if (this.eventId) {
                let options = await this.$apex.getPublicSettings(this.organizer, this.eventId);
                if (options) {
                    this.publicData = options;
                }
            }
        },
        async getShortLink() {
            let { hash } = await this.$apex.getShortLink(this.publicFullUrl);
            return `${window.location.origin}/${hash}`;
        }
    },
    async mounted() {
        this.publicUrl = this.publicFullUrl;
        await this.refreshPublicOptions();
        this.publicUrl = (await this.getShortLink()) || this.publicFullUrl;
    }
}
</script>