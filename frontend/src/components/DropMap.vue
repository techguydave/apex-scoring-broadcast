<template>
    <div>
        <div v-if="mode == 'dev'">
            <textarea :value="JSON.stringify(locations)" style="color: white" cols="100"></textarea>
            <div class="edit-line" v-for="(l, i) in locations" :key="i">
                <v-text-field v-model="l.name" label="name"></v-text-field>
                <v-checkbox v-model="l.primary" label="primary"></v-checkbox>
                <v-btn @click="active = i; setNameLoc = true">Set Name Pos</v-btn>
                <v-btn @click="active = i; l.points = []">Draw</v-btn>
                <v-btn @click="active = i; linking = true">Link</v-btn>
            </div>
            <v-btn @click="drawLink = undefined">Done Link</v-btn>
            <v-btn @click="add">ADD</v-btn>
        </div>

        <div class="actions text-center" v-if="mode == 'claim'">
            <v-btn v-if="!claiming" color="primary" class="mt-2" @click="claimDropDiag = true">Claim Drop Spot</v-btn>
            <v-btn v-if="claiming" color="primary" :disabled="claiming.length == 0" class="mt-2"
                @click="finishClaim">Done</v-btn>
            <v-btn v-if="claiming" color="secondary" class="mt-2" @click="claiming = undefined;refreshClaims()">Cancel</v-btn>
            <!-- <v-btn class="ma-2">Export</v-btn> -->
        </div>
          <div class="actions text-center" v-if="mode == 'admin'">
                <v-btn color="primary" class="ma-2" @click="resetTeam">Clear Team</v-btn>
                <v-btn class="ma-2" @click="resetMap">Clear All</v-btn>
            </div>

        <div class="map-wrap mt-4">
            <svg viewBox="0 0 2048 2048" width="100%" xmlns="http://www.w3.org/2000/svg" ref="svg" @click="handleClick">
                <image width="2048" height="2048" :href="`/maps/${map}.webp`" />
                <svg:style type="text/css">
                    .poi-name {
                        font-size: 30px;
                        fill: white;
                        stroke: black;
                        stroke-width: 8px;
                        paint-order: stroke;
                        cursor: pointer;
                    }
                    .primary-poi {
                        font-size: 38px;    
                    }
                    .team-name {
                        font-size: 25px;
                        fill: white;
                        stroke: #0009;
                        stroke-width: 4px;
                        paint-order: stroke;
                    }
                    
                    .link {
                        stroke: #0b970bff;
                        fill: #0b970b77;
                    }
                    .dotted {
                    fill: none;
                    }
                </svg:style>
                <template v-if="mode == 'dev'">
                    <svg>
                        <g v-for="l in locations" :key="l.name">
                            <polygon :points="l.points.map(p => p.join(',')).join(' ')"
                                stroke-width="4" class="poly"></polygon>
                            <polygon v-for="(link, i) in l.links" :key="i + link.link"
                                :points="link.points.map(p => p.join(',')).join(' ')" stroke-width="4" class="link poly">
                            </polygon>
                            <text v-if="l.namePos" @click="doLink(l)" :x="l.namePos.x" :y="l.namePos.y" text-anchor="middle"
                                class="poi-name" :class="{ 'primary-poi': l.primary }">{{
                                    l.name }}</text>
                            <text v-for="(t, k) in l.teams" :x="l.namePos.x" :y="l.namePos.y + (35 * (k + 1)) + 5"
                                text-anchor="middle" class="team-name" :key="t + team">{{ t }}</text>
                        </g>
                    </svg>
                </template>
                <template v-else-if="mode == 'display'">

                </template>
                <template v-else-if="mode == 'claim' || mode == 'admin'">
                    <svg>
                        <svg v-for="(points, i) in claimedPoints" :key="i">

                            <pattern :id="'stripe' + i" :width="points?.colors?.length * 4" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <rect v-for="(color, i) in points?.colors" :x="i * 4" y="0" width="4" height="10" :style="`fill: ${color}77`" :key="i" />
                            </pattern>
                            <polygon :fill="'url(#stripe' + i + ')'" :points="points?.regions[0]?.map(p => p?.join(',')).join(' ')" stroke-width="4"
                                class="poly" :stroke="points?.colors[0]"></polygon>
                        </svg>
                       
                       
                        <g v-for="l in locations" :key="l.name">
                            <polygon v-if="claiming && shouldShowName(l)" @click="claim(l)" 
                                :points="l.points.map(p => p.join(',')).join(' ')" stroke-width="4" class="poly dotted"
                                stroke-dasharray="4 1 2" ></polygon>
                            <text @click="claim(l)" v-if="shouldShowName(l)" :x="l.namePos.x" :y="l.namePos.y"
                                text-anchor="middle" class="poi-name" :class="{ 'primary-poi': l.primary }">{{
                                    l.name }}</text>
                            <text v-for="(t, k) in l.teams" :x="l.namePos.x" :y="l.namePos.y + (35 * (k + 1)) + 5"
                                text-anchor="middle" class="team-name" :key="t">{{ t }}</text>
                        </g>
                    </svg>
                </template>
            </svg>
        </div>

        <v-dialog v-model="claimDropDiag" max-width="600px">
            <v-card>
                <v-toolbar color="primary" class="toolbar" flat>Claim Drop Spot<v-spacer></v-spacer><icon-btn-filled
                        icon="close" @click="claimDropDiag = false"></icon-btn-filled></v-toolbar>
                <v-card-text>
                    <v-text-field label="Team Name" v-model="teamName"></v-text-field>
                    <v-text-field type="password" label="Password" v-model="pass"></v-text-field>

                    <v-color-picker
                        dot-size="10"
                        hide-canvas
                        hide-inputs
                        hide-mode-switch
                        hide-sliders
                        mode="rgba"
                        show-swatches
                        swatches-max-height="100"
                        v-model="teamColor"
                    ></v-color-picker>

                    <v-btn color="primary" block :disabled="teamName.length == 0 || pass.length == 0" class="my-3"
                        @click="claiming = []; claimDropDiag = false">Claim</v-btn>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import maps from "@/utils/MapLocs";
import IconBtnFilled from "@/components/IconBtnFilled";
import PolyBool from "polybooljs";
import _ from "lodash";

export default {
    props: ["matchId", "map", "mode", "adminKey"],
    data() {
        return {
            claimDropDiag: false,
            pass: "",
            setNameLoc: false,
            setTeamLoc: false,
            teamName: "",
            teamColor: undefined,
            drawLink: undefined,
            active: 0,
            locations: undefined,
            claiming: undefined,
            claimed: [],
            console,
        }
    },
    components: {
        IconBtnFilled
    },
    computed: {
        claimedPoints() {
            let claimed = this.claiming ? this.claimed.concat([this.claiming]) : this.claimed;
            console.log(JSON.stringify(claimed));
            let map = claimed.map(team => team.map(poi => ({ regions: [poi.points], inverted: false, colors: poi.colors }))
                .concat(team.flatMap(poi => poi.links?.flatMap(l => team.find(c => c.name == l.link) ? { regions: [l.points], inverted: false } : undefined)))
                .filter(o => o));

            let result = map.map(m => m.reduce((val, cur) => val && cur ? { ...PolyBool.union(val, cur), colors: _.uniq(cur.colors ? cur.colors.concat(val.colors) : val.colors ?? ["#bb3333"])} : cur, m[0]))
            console.log(JSON.stringify(result));
            return result
        },
        claimingPoints() {
            console.log(JSON.stringify(this.claiming));
            let result = this.claiming?.map(poi => ({ regions: [poi.points], inverted: false }));

            if(result?.length > 1)
                result = result?.reduce((val, cur) => PolyBool.union(val, cur), result[0]);
            return result
        },
    },
    watch: {
        map() {
            this.refreshClaims();
        }
    },
    methods: {
        handleClick(e) {
            if (this.mode != 'dev')
                return;
            var rect = this.$refs.svg.getBoundingClientRect();

            var x = parseInt(2048 * ((e.clientX - rect.left) / (rect.right - rect.left)));
            var y = parseInt(2048 * ((e.clientY - rect.top) / (rect.bottom - rect.top)));

            let locs = this.locations[this.active];

            if (this.setNameLoc) {
                locs.namePos = { x, y };
                this.setNameLoc = false;
            }
            else if (this.setTeamLoc) {
                locs.teamPos = { x, y };
                this.setTeamLoc = false;
            }
            else if (this.drawLink) {
                this.drawLink.points.push([x, y]);
                console.log("drawLink", x, y)
                this.$forceUpdate();
            }
            else {
                locs.points.push([x, y]);
            }

        },
        shouldShowName(l) {
            if (l.namePos && (!this.claiming || this.claiming.length == 0) && l.primary) {
                return true;
            }
            else if (this.claiming?.find(c => c.name == l.name || c.links?.find(i => i.link == l.name))) {
                return true;
            }
        },
        doLink(link) {
            let poi = this.locations[this.active];
            if (this.linking) {
                if (!poi.links) {
                    this.$set(poi, "links", [])
                }
                this.drawLink = {
                    link: link.name,
                    points: []
                }
                poi.links.push(this.drawLink)
                console.log("dolink", link, poi, this.drawLink)
            }
        },
        claim(poi) {
            if (!this.claiming)
                return;
            if (!poi.teams)
                poi.teams = [];
            poi.teams.push(this.teamName)
            this.claiming.push({ ...poi, colors: [this.teamColor.hex] });
        },
        async finishClaim() {
            let token = localStorage.getItem("claim-token");
            
            for (let claim of this.claiming) {
                let result = await this.$apex.setDrop(this.matchId, this.teamName, this.map, this.pass, token, this.teamColor?.hex, claim.name);
                token = result.token;
            }
                
            localStorage.setItem("claim-token", token);
            this.claiming = undefined;
            this.refreshClaims();

        },
        add() {
            this.locations.push({
                name: " ",
                namePos: undefined,
                primary: true,
                points: [],
            })
        },
        async refreshClaims() {
            this.locations = _.cloneDeep(maps[this.map])

            this.claimed = [];

            let claimed = await this.$apex.getDrops(this.matchId, this.map);
            console.log(JSON.stringify(claimed));

            Object.values(claimed).forEach(team => {
                let loc = team.map(claim => {
                    let loc = this.locations.find(c => c.name == claim.drop);
                    if (!loc.teams)
                        loc.teams = [];
                    loc.teams.push(claim.teamName)
                    if (!loc.colors)
                        loc.colors = [];
                    loc.colors.push(claim.color);
                    return loc;
                });
                this.claimed.push(loc);
            })
        }
    },
    async mounted() {
        this.refreshClaims();
    }
};
</script>

<style scoped lang="scss">
.toolbar.v-sheet.v-toolbar {
  background-color: $primary !important;
}

.edit-line {
    display: flex;
}
</style>