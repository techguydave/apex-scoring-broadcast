<template>
    <div>
        <v-card>
            <v-card-title>Name</v-card-title>
            <v-card-text>
                <v-form><v-text-field solo v-model="settingsCopy.name"></v-text-field></v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    props: ["value", "eventId", "organizer"],
    data() {
        return {

            settingsCopy: this.value,
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

    }
}
</script>