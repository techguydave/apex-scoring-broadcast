<template>
    <div>
        <v-row v-if="settings">
            <v-col sm="12" md="3">
                <div class="selector">


                    <!-- this can probably be abstracted to its own component if I want to spend the time detangling the functionality  -->

                    <div v-for="(display, i) in settings" :key="display.id" class="display-wrap">
                        <div @click="selectorValue = [i]" class="item display"
                            :class="{ selected: ld.isEqual(selectorValue, [i]) }">
                            <span class="material-symbols-outlined">tv</span>
                            <span class="main-text">{{ display.name }}</span>
                            <IconBtn @click="addScene(display)" icon="docs_add_on" />
                            <IconBtn @click="setValue([i], undefined)" icon="delete" />

                        </div>


                        <div v-for="(scene, i2) in display.scenes" :key="scene.name" class="scene-wrap">
                            <div @click="selectorValue = [i, i2]" class="item scene"
                                :class="{ selected: ld.isEqual(selectorValue, [i, i2]) }">
                                <IconBtn @click="setActive(display, scene)"
                                    :icon="display.activeScene == scene.id ? 'check_box' : 'check_box_outline_blank'" />

                                <span class="main-text">{{ scene.name }}</span>

                                <IconBtn @click="addOverlay(scene)" icon="docs_add_on" />
                                <IconBtn @click="setValue([i, i2])" icon="delete" />

                            </div>


                            <div v-for="(overlay, i3) in scene.overlays" :key="overlay.id" class="overlay-wrap">
                                <div @click="selectorValue = [i, i2, i3]" class="item overlay"
                                    :class="{ selected: ld.isEqual(selectorValue, [i, i2, i3]) }">
                                    <span class="main-text">{{ overlay.name }}</span>
                                    <IconBtn font-size="20px" @click="setValue([i, i2, i3])" icon="delete" />

                                </div>

                            </div>


                        </div>

                    </div>

                </div>
                <div class="add item">
                    <IconBtn @click="addDisplay()" icon="add"></IconBtn> New Display
                </div>

            </v-col>
            <v-col sm="12" md="8" lg="9">
                <v-row>
                    <v-col sm="12" lg="12">
                        <v-card>
                            <v-card-text>

                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-header>
                                            <h3>Settings</h3>
                                        </v-expansion-panel-header>
                                        <v-expansion-panel-content class="setting-content">

                                            <template v-if="selectorValue.length == 1">
                                                <display-settings v-model="selectedOption" :eventId="eventId"
                                                    :organizer="organizer"></display-settings>
                                            </template>
                                            <template v-else-if="selectorValue.length == 2">
                                                <scene-settings v-model="selectedOption" :eventId="eventId"
                                                    :organizer="organizer"></scene-settings>
                                            </template>
                                            <template v-else-if="selectorValue.length == 3">
                                                <component :is="selectedOption.type + 'Settings'" v-model="selectedOption"
                                                    :eventId="eventId" :organizer="organizer" />
                                            </template>
                                        </v-expansion-panel-content>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col sm="12" lg="12">
                        <v-card>
                            <v-card-title>Output: {{ selectedDisplay.name }} </v-card-title>
                            <v-card-text>
                                <div v-if="eventId" class="display-wrapper">
                                    <router-link target="_blank"
                                        :to="{ name: 'broadcast', params: { display: selectedDisplay.id, organizer } }">
                                        <broadcast class="display-viewport" :organizer="organizer"
                                            :display="selectedDisplay.id">
                                        </broadcast>
                                    </router-link>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-toolbar class="toolbar" flat>Add New Overlay<v-spacer></v-spacer><icon-btn icon="close"
                        @click="dialog = false"></icon-btn></v-toolbar>
                <v-card-text>
                    <v-select v-model="overlayAdd" :items="overlayOptions"></v-select>
                    <v-btn color="primary" block @click="doAddOverlay">Add</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
/* eslint-disable */
import Broadcast from "@/pages/BroadcastPage.vue";
import TreeSelector from "../../components/TreeSelector.vue";
import DisplaySettings from "../../components/broadcast-settings/DisplaySettings.vue";
import SceneSettings from "../../components/broadcast-settings/SceneSettings.vue";
import ScoreboardSettings from "../../components/broadcast-settings/ScoreboardSettings.vue";
import LiveTeamStatusSettings from "../../components/broadcast-settings/LiveTeamStatusSettings.vue";
import LiveCharacterSelectSettings from "../../components/broadcast-settings/LiveCharacterSelectSettings.vue";
import TickerSettings from "../../components/broadcast-settings/TickerSettings.vue";
import IconBtn from "../../components/IconBtnFilled.vue";

import _ from "lodash";
const { v4: uuid } = require('uuid');
const overlayDefaults = [
    {
        type: "Scoreboard",
        name: "Scoreboard",
        settings: {
            "dark": true,
            "game": "overall",
            "mode": "team",
            "header": true,
            "styled": true,
            "showCharacters": true,
            "display": "score",
            "display2": "kills",
        }
    },
    {
        type: "LiveTeamStatus",
        name: "(Live) Team Scoreboard",
        settings: {
            styled: true,
            dark: false,
        }
    },
    {
        type: "LiveCharacterSelect",
        name: "(Live) Character Select",
        settings: {
            styled: true,
            dark: false,
        }
    },
    {
        type: "Ticker",
        name: "Ticker",
        settings: {
            styled: true,
            dark: false,
            smooth: true,
            speed: 15,
        }
    }
]


export default {
    components: {
        Broadcast,
        TreeSelector,
        DisplaySettings,
        SceneSettings,
        ScoreboardSettings,
        IconBtn,
        LiveCharacterSelectSettings,
        LiveTeamStatusSettings,
        TickerSettings,
    },
    props: [
        "organizer",
        "eventId",
    ],
    data() {
        return {
            selectorValue: [0],
            settings: undefined,
            ld: _,
            dialog: false,
            addingScene: undefined,
            overlayAdd: undefined,
        }
    },
    computed: {
        selectedOption: {
            get() {
                return this.getSettingsValueDeep(this.selectorValue);
            },
            set(value) {
                this.setValue(this.selectorValue, value)
            }
        },
        overlayOptions() {
            return overlayDefaults.map(o => ({ text: o.name, value: o.type }));
        },
        selectedDisplay() {
            return this.getSettingsValueDeep([this.selectorValue[0]]);
        }
    },
    methods: {
        getSettingsValue(s) {
            if (s.length == 1) return this.settings;
            if (s.length == 2) return this.settings[s[0]].scenes;
            if (s.length == 3) return this.settings[s[0]].scenes[s[1]].overlays;
        },
        getSettingsValueDeep(s) {
            return this.getSettingsValue(s)[s[s.length - 1]];
        },
        setValue(s, value) {
            if (value)
                this.getSettingsValue(s).splice(s[s.length - 1], 1, value);
            else {
                this.getSettingsValue(s).splice(s[s.length - 1], 1);
                this.selectorValue = [0]
            }
        },
        async refreshBroadcastOptions() {
            if (this.eventId) {
                this.settings = await this.$apex.getBroadcastSettings(this.organizer);
            }
        },
        addDisplay() {
            let display = {
                id: uuid(),
                name: "Display " + (this.settings.length + 1),
                scenes: [],
            }
            this.addScene(display)
            display.activeScene = display.scenes[0].id;
            this.settings.push(display)
        },
        addScene(display) {
            display.scenes.push({
                id: uuid(),
                name: "Scene " + (display.scenes.length + 1),
                overlays: [],
            })
        },
        addOverlay(scene) {
            this.addingScene = scene;
            this.dialog = true;
        },
        doAddOverlay() {
            let value = overlayDefaults.find(i => i.type == this.overlayAdd);
            value = _.cloneDeep(value);
            value.id = uuid();
            this.addingScene.overlays.push(value);
            this.dialog = false;
        },
        setActive(display, scene) {
            display.activeScene = scene.id;
        },
        updateBroadcastSettings: _.debounce(function () {
            this.$apex.setBroadcastSettings(this.organizer, this.settings);
        }, 250),
    },
    watch: {
        settings: {
            handler() {
                this.updateBroadcastSettings();
            },
            deep: true,
        }
    },
    async mounted() {
        this.refreshBroadcastOptions();
    }
}
</script>

<style scoped lang="scss">
.display-viewport {
    transform: scale(.43);
    transform-origin: left;
    background: black;
}

.setting-content {
    max-height: 400px;
    overflow: auto;
}

.display-viewport ::v-deep .broadcast-page {
    border: 4px solid #333;
    background: black;
    overflow: hidden;

}

::v-deep .v-messages {
    display: none;
}

.display-wrapper {
    position: relative;
    height: 465px;
}

.selected.item {
    background: #{$primary}77;
}

.toolbar.v-sheet.v-toolbar {
    background-color: $primary !important;
}

.material-symbols-outlined {
    padding: 0 5px;
}

.selector {
    // border: 1px solid black;
    border-radius: 3px;
    max-height: 600px;
    overflow: auto;
}

.display-wrap {
    // border: 1px solid black;
    margin: 3px;
    padding: 3px;
}

.scene-wrap {
    border-left: 1px solid black;
    margin-left: 25px;
}

.overlay-wrap {
    border-left: 1px solid black;
    margin-left: 25px;
    padding-left: 10px;
}

.item {
    padding: 3px 10px;
    display: flex;
    align-items: center;
    font-size: 1em;
    cursor: pointer;

    .main-text {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 3px;
    }

    &.scene {
        padding-bottom: 0px;
    }

    &.overlay {}

    &.add {
        margin: 5px 0px;
        padding: 5px;
    }
}
</style>