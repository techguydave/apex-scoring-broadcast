<template>
    <v-container>

        <v-row>
            <v-col sm="12" lg="6">
                <v-card>
                    <v-card-title>Settings</v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="3">
                                <v-checkbox label="Styled" v-model="displayChoices.styled"></v-checkbox>
                            </v-col>
                            <v-col cols="3">
                                <v-checkbox label="Light Text" v-model="displayChoices.dark"></v-checkbox>
                            </v-col>
                            <v-col cols="3">
                                <v-checkbox label="Show Header" v-model="displayChoices.header"></v-checkbox>
                            </v-col>
                            <v-col cols="3">
                                <v-checkbox label="Show Characters" v-model="displayChoices.showCharacters"></v-checkbox>
                            </v-col>
                        </v-row>
                        <v-select :items="displayOptions.game" v-model="displayChoices.game"></v-select>
                        <v-select :items="displayOptions.mode" v-model="displayChoices.mode"
                            @change="
                                this.displayChoices.display = undefined;
                            this.displayChoices.display2 = undefined;
                                                                                                                                                                            "></v-select>
                        <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
                            v-model="displayChoices.display"></v-select>
                        <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
                            v-model="displayChoices.display2" clearable></v-select>
                        <v-btn @click="updateDisplayView" color="blue" class="ma-2">Update</v-btn>
                    </v-card-text>
                </v-card>
                <v-card>
                    <v-card-title>Link</v-card-title>
                    <v-card-text>
                        <v-form><v-text-field solo :value="broadcastLink" readonly></v-text-field></v-form>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col sm="12" lg="6">
                <v-card>
                    <v-card-title>Broadcast Output</v-card-title>
                    <v-card-text>
                        <div v-if="eventId" class="display-wrapper">
                            <router-link target="_blank" :to="{ name: 'broadcast', params: { eventId, organizer } }">
                                <broadcast class="display-viewport" :organizer="organizer" :eventId="eventId">
                                </broadcast>
                            </router-link>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
</v-container>
</template>


<script>
import Broadcast from "@/pages/BroadcastPage.vue";

import { displayOptions } from "../../utils/statsUtils";

export default {
    components: {
        Broadcast
    },
    props: [
        "organizer",
        "eventId",
    ],
    data() {
        return {
            displayChoices: {
                styled: true,
                mode: undefined,
                display: undefined,
                display2: undefined,
                header: true,
                game: "overall",
                dark: false,
            },
            displayOptions,
        }
    },
    computed: {
        broadcastLink() {
            return window.location.origin + this.$router.resolve({ name: 'broadcast', params: { eventId: this.eventId, organizer: this.organizer } }).href;
        }
    },
    methods: {
        updateDisplayView() {
            this.$apex.setBroadcastSettings(this.organizer, this.displayChoices);
        },
        async refreshBroadcastOptions() {
            if (this.eventId) {
                let options = await this.$apex.getBroadcastSettings(this.organizer);
                if (options) {
                    this.displayChoices = options;
                }
            }
        }
    },
    async mounted() {
        await this.refreshBroadcastOptions();
    }
}
</script>

<style scoped>
.display-viewport {
    transform: scale(.43);
    transform-origin: left;
}

.display-viewport>>>.scoreboard-wrap {
    border: 4px solid #333;
}

.display-wrapper {
    position: relative;
    height: 465px;
}
</style>