<template>
    <div v-if="settingsCopy">
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
            <v-card-title>Theme</v-card-title>
            <v-card-text>
                <v-select solo :items="presetNames" v-model="theme"></v-select>
                <v-row v-if="theme == 'Custom'">
                    <v-col cols="12" md="4">
                        <v-card-title>Primary</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.primary" dot-size="15" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-title>Secondary</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.secondary" dot-size="25" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-title>Background</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.background" dot-size="25" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-title>Primary Text</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.primaryText" dot-size="25" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-title>Secondary Text</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.secondaryText" dot-size="25" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card-title>Body Text</v-card-title>
                        <v-color-picker v-model="settingsCopy.colors.text" dot-size="25" mode="hexa"
                            swatches-max-height="200"></v-color-picker>
                    </v-col>

                </v-row>
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
import IconBtnFilled from '../IconBtnFilled.vue';

const presets = {
    Custom: {},
    Overstat: {
        primary: "#970b0b",
        secondary: "#261f1f",
        background: "#000",
        text: "#fff",
        primaryText: "#fff",
        secondaryText: "#fff",
    },
    Dawn: {
        primary: "#47DEFFFF",
        secondary: "#1B3541FF",
        background: "#D7F7FFFF",
        text: "#CEDFE7FF",
        primaryText: "#000000FF",
        secondaryText: "#000000FF",
    },
    Dusk: {
        primary: "#47DEFF",
        secondary: "#1B3541",
        background: "#22232A",
        text: "#B4D5E4",
        primaryText: "#000000",
        secondaryText: "#ABC6D3",
    },
    Charcoal: {
        primary: "#757575",
        secondary: "#1B1B1B",
        background: "#000",
        text: "#eee",
        primaryText: "#000",
        secondaryText: "#eee",
    }
}

export default {
    props: ["value", "eventId", "organizer"],
    data() {
        return {
            matchList: [],
            clientList: [],
            settingsCopy: this.value,
            presets,
            presetNames: Object.keys(presets),
            theme: this.settingsCopy?.theme ?? "Overstat",
        };
    },
    computed: {
        broadcastLink() {
            return window.location.origin + this.$router.resolve({ name: "broadcast", params: { organizer: this.organizer, display: this.value.id } }).href;
        }
    },
    watch: {
        value: {
            deep: true,
            handler() {
                this.settingsCopy = this.value;
            }
        },
        theme() {
            if (this.theme) {
                this.settingsCopy.theme = this.theme;
                if (this.theme != "Custom") {
                    this.settingsCopy.colors = presets[this.theme];
                }
            }
        }
    },
    async mounted() {
        let matchList = await this.$apex.getMatchList(this.organizer);
        this.matchList = matchList?.map(m => m.eventId);
        this.clientList = Object.keys(await this.$apex.getClients(this.organizer));
    },
    components: { IconBtnFilled }
}
</script>