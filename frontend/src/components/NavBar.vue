<template>
    <header class="main-nav elevation-0">
        <div class="toolbar-link-container">
            <router-link class="toolbar-link" :to="{ name: 'index', params: $props }"><img height="25" src="/img/overstat_logo.png"></router-link>
            <router-link class="toolbar-link" :to="{ name: 'players', params: $props }">Players</router-link>
        </div>
        <div class="toolbar-right-container">
            <router-link class="toolbar-link" :to="{ name: 'admin', params: $props }">Tournament Manager</router-link>
        </div>
    </header>
</template>

<style lang="scss" scoped>
.toolbar-link-container,
.toolbar-right-container,
.container {
    display: inline-block;
    height: 100%;
    vertical-align: baseline;
    display: flex;
}

.main-nav {
    max-width: 1200px;
    margin: auto;
    background-color: transparent;
    display: flex;
    align-items: center;
    height: 60px;
}

.toolbar-link-container {
    flex: 1;
}

.toolbar-link {
    padding: 0 20px;
    color: white !important;
    text-decoration: none;
    align-self: end;
    margin-bottom: -4px;
    height: 80%;
}
</style>