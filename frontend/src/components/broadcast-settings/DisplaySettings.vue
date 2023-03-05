<template>
    <div>
        <v-card-title>Browser Source</v-card-title>
        <v-card-text>
            <v-form><v-text-field solo :value="broadcastLink" readonly></v-text-field></v-form>
        </v-card-text>
    </div>
</template>

<script>
export default {
    props: ["settings", "eventId", "organizer"],
    computed: {
        broadcastLink() {
            return window.location.origin + this.$router.resolve({ name: 'broadcast', params: { organizer: this.organizer, display: this.settings.id } }).href;
        }
    },
}
</script>