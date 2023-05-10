<template>
    <div v-if="observerPlayer" :class="{ styled: settings.styled }">
        <div class="wrap pos1">
            <div v-for="item in items" :key="item.key">
                <div class="item">
                    <span class="count">{{ observerPlayer.inv[item.key] ?? 0 }}</span>
                    <span :style="{ transform: 'translate( ' + item.left + 'px ,' + item.top + 'px)' }" class="regen-icon">
                        <RegenIcon :left="item.left" :top="item.top" :icon="item.img" :height="item.size"></RegenIcon>
                    </span>
                </div>
            </div>
        </div>
        <div class="wrap pos2">
            <div v-for="item in items2" :key="item.key">
                <div class="item">
                    <span class="count">{{ observerPlayer.inv[item.key] ?? 0 }}</span>
                    <span :style="{ transform: 'translate( ' + item.left + 'px ,' + item.top + 'px)' }" class="regen-icon">
                        <RegenIcon :left="item.left" :top="item.top" :icon="item.img" :height="item.size"></RegenIcon>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RegenIcon from '../../components/RegenIcon.vue';
export default {
    props: ["settings", "observerPlayer"],
    components: {
        RegenIcon,
    },
    data() {
        return {
            items: [
                {
                    key: "Syringe",
                    img: "Syringe",
                    size: 45,
                    left: 2,
                    top: 3,
                },
                {
                    key: "Med Kit (Level 2)",
                    img: "Med_Kit",
                    size: 45,
                    left: 2,
                    top: 0,
                },
                {
                    key: "Shield Cell",
                    img: "Shield_Cell",
                    size: 38,
                    left: -0,
                    top: -2,
                },
                {
                    key: "Shield Battery (Level 2)",
                    img: "Shield_Battery",
                    size: 45,
                    left: 0,
                    top: 0,
                }
            ],
            items2: [{

                key: "Phoenix Kit (Level 3)",
                img: "Phoenix_Kit",
                size: 45,
                left: 0,
                top: 0,
            },
            {
                key: "Ultimate Accelerant (Level 2)",
                img: "Ultimate_Accelerant",
                size: 40,
                left: 2,
                top: 0,
            }]
        };
    },
}
</script>

<style scoped lang="scss">
.wrap {
    color: white;
    display: flex;
    position: absolute;

    &.pos1 {
        bottom: 120px;
        right: 400px;
    }
     &.pos2 {
        bottom: 43px;
        right: 625px;
    }
}



.count {
    padding-bottom: 2px;
    margin-left: -10px;
}

.item {
    display: flex;
    align-items: baseline;
    background-position: bottom;
    background-size: 110px;
    height: 110px;
    width: 95px;
    display: flex;
    align-items: end;
    justify-content: center;
}

.styled {
    .item {
        background-image: url("/public/img/regen_backing.png");
    }
}

.regen-icon {
    padding-right: 7px;
}
</style>