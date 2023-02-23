<template>
    <div>
        <div class="list-wrap" v-for="(item, id) in items" :id="id" :key="item.id" @click.stop="$emit('selected', [id])">
            <div :style="'padding-left:' + (level + 1) * 10 + 'px'" :class="{ selected: item.selected }" class="item">{{
                item.name
            }}</div>
            <TreeNode :level="(level ?? 0) + 1" v-if="item.children" @selected="(val) => $emit('selected', [id, ...val])"
                :items="item.children">
            </TreeNode>
        </div>
    </div>
</template>

<script>
export default {
    name: "TreeNode",
    props: ["id", "items", "level"]
}
</script>

<style scoped lang="scss">
.selected.item {
    background: #{$primary}77;
}

.item {
    padding: 7px 10px;
    margin: 3px;
}
</style>