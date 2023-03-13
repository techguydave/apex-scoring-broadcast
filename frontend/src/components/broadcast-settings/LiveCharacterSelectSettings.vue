<template>
    <div>
        <v-checkbox label="Styled" v-model="settings.styled"></v-checkbox>

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
    }
}
</script>

<style scoped></style>