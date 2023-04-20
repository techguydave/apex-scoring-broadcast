<template>
    <div>
        <v-row><v-col><v-checkbox label="Styled" v-model="settings.styled"></v-checkbox></v-col>
            <v-col><v-checkbox label="Hide Players" v-model="settings.hidePlayers"></v-checkbox></v-col></v-row>
        <v-text-field label="Static Teams Count" v-model.number="settings.static" placeholder="20"
            message="Always show the top X teams"></v-text-field>
        <v-text-field label="Rotating Teams" v-model.number="settings.rotate" placeholder="0"
            message="Rotate through the remaining teams, show X amount"></v-text-field>
        <v-btn color="primary" @click="update()">Update</v-btn>

    </div>
</template>

<script>
export default {
    props: ["value"],
    data() {
        return {
            settings: this.value.settings,
        }
    },
    methods: {
        update() {
            this.$emit('input', { ...this.value, settings: this.settings })
        }
    },
    mounted() {
        if (!this.settings.static) {
            this.settings.static = 20;
            this.settings.rotate = 0;

            this.update();
        }
    }
}
</script>

<style scoped></style>