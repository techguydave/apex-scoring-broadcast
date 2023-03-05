<template>
    <div>
        <div v-for="line in liveData.feed.slice(liveData.feed.length - 10, liveData.feed.length - 1).reverse()" :key="line">
            <FeedCard :feed="line" :startTime="liveData.match_start"></FeedCard>
        </div>
    </div>
</template>