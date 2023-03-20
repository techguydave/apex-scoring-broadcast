<template>
    <div>
        <TreeNode @selected="selected" :items="items" />
    </div>
</template>

<script>
import TreeNode from './TreeNode.vue';
export default {
    name: "TreeSelector",
    components: {
        TreeNode,
    },
    props: ["items"],
    methods: {
        selected(val) {
            this.$emit("selected", val)
        }
    }
}
</script>
<style scoped>
ul {
    list-style-type: none;
    padding-left: 10px;
}
</style>