<template>
    <div><v-row>
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
        <v-select :items="displayOptions.mode" v-model="displayChoices.mode" @change="
            this.displayChoices.display = undefined;
        this.displayChoices.display2 = undefined;"></v-select>
        <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
            v-model="displayChoices.display"></v-select>
        <v-select v-if="displayChoices.mode" :items="displayOptions.display[displayChoices.mode]"
            v-model="displayChoices.display2" clearable></v-select>
        <v-btn color="primary" @click="update()">Update</v-btn>
    </div>
</template>
<script>
import { displayOptions } from "../../utils/statsUtils";

export default {
    props: ["value"],
    data() {
        return {
            displayOptions,
            displayChoices: JSON.parse(JSON.stringify(this.value.settings)),
        }
    },
    watch: {
        value() {
            this.displayChoices = JSON.parse(JSON.stringify(this.value.settings));
        }
    },
    methods: {
        update() {
            this.$emit('input', { ...this.value, settings: this.displayChoices })
        }
    }
}
</script>