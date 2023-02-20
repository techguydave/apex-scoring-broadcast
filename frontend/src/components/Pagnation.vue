<template>
    <div class="text-center">
        <v-pagination v-model="page" :length="length"></v-pagination>
    </div>
</template>
<script>
export default {
    props: ["value", "count", "total"],
    data() {
        return {
            page: 1,
        }
    },
    watch: {
        page(old, n) {
            if (old != n)
                this.$emit("input", this.count * (this.page - 1));
        }
    },
    computed: {
        length() {
            return Math.ceil(this.total / this.count);
        },
    },
}
</script>