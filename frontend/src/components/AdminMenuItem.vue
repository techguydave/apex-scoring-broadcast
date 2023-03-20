<template>
    <div class="menu-item" :class="{ selected: value == id }" @click="$emit('input', id)">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ["value", "id"],
}
</script>

<style scoped lang="scss">
.menu-item {
    background-color: $first-tone;
    border-radius: 5px;
    margin: 10px;
    padding: 10px;

    &:hover {
        cursor: pointer;
    }

}

.selected {
    background-color: $primary;
}
</style>