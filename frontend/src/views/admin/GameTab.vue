<template>
	<v-row>
		<template v-if="!eventId || eventId == ''">
			<v-col sm="12" lg="6">
				<v-card>
					<v-card-text>
						<i>Please choose or create a match</i>
					</v-card-text>
				</v-card>
			</v-col>
		</template>

		<v-col v-else sm="12" lg="6">
			<v-dialog v-model="showCSVDialog" max-width="600px">
				<v-card>
					<v-toolbar color="primary" class="toolbar" flat>
						Export CSV Options<v-spacer/><icon-btn-filled icon="close" @click="showCSVDialog = false"></icon-btn-filled>
					</v-toolbar>
					<v-card-text>
						<v-radio-group v-model="optionTeamOrPlayer" inline>
							<v-radio label="Export Teams" value="team"></v-radio>
							<v-radio label="Export Players" value="player"></v-radio>
						</v-radio-group>
						
						<div v-if="optionTeamOrPlayer">
							<h3 class="mb-3">Select Data Columns</h3>
							<v-btn class="mr-3" @click="setAllCsvOptionFields(optionTeamOrPlayer)">Select All</v-btn>
							<v-btn @click="csvCols = {}">Select None</v-btn>
							<v-divider class="mt-3"/>
						</div>

						<div class="scroll-keys">
							<div v-if="optionTeamOrPlayer === 'team'">
								<v-checkbox v-for="teamCol in teamKeys" :key="teamCol.key" :label="teamCol.label" v-model="csvCols[teamCol.key]" hide-details dense></v-checkbox>
							</div>

							<div v-else-if="optionTeamOrPlayer === 'player'">
								<v-checkbox v-for="playerCol in playerKeys" :key="playerCol.key" :label="playerCol.label" v-model="csvCols[playerCol.key]" hide-details dense></v-checkbox>
							</div>
						</div>
					</v-card-text>
					<v-card-actions>
						<v-btn color="primary" :disabled="!Object.keys(csvCols).length" @click="csv">Export Data</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<v-card>
				<v-card-text>
					<v-card class="ma-1 grey darken-4">
						<v-card-title>Game Settings</v-card-title>
						<v-card-subtitle>Configure options for game. Chose the game #, and change
							scoring.</v-card-subtitle>
						<v-card-text>
							<v-combobox v-model="game" label="Game"
								:items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"></v-combobox>
							<v-expansion-panels class="ma-1  grey darken-4">
								<v-expansion-panel>
									<v-expansion-panel-header>
										Advanced Options
									</v-expansion-panel-header>
									<v-expansion-panel-content>
										<v-text-field v-model="placementPoints" label="Placement Points"></v-text-field>
										<v-text-field v-model.number="killPoints" label="Kill Points"></v-text-field>
										<v-checkbox v-model="useRingKillPoints" label="Use Per-Ring Kill Points (live data only)"></v-checkbox>
										<div v-show="useRingKillPoints">
											<v-row>
												<v-col cols="2">
													<v-text-field label="Ring 1 Countdown" v-model="ringKillPoints.ring0.countdown"></v-text-field>
													<v-text-field label="Ring 1 Closing" v-model="ringKillPoints.ring0.closing"></v-text-field>
												</v-col>
												<v-col cols="2">
													<v-text-field label="Ring 2 Countdown" v-model="ringKillPoints.ring1.countdown"></v-text-field>
													<v-text-field label="Ring 2 Closing" v-model="ringKillPoints.ring1.closing"></v-text-field>
												</v-col>
												<v-col cols="2">
													<v-text-field label="Ring 3 Countdown" v-model="ringKillPoints.ring2.countdown"></v-text-field>
													<v-text-field label="Ring 3 Closing" v-model="ringKillPoints.ring2.closing"></v-text-field>
												</v-col>
												<v-col cols="2">
													<v-text-field label="Ring 4 Countdown" v-model="ringKillPoints.ring3.countdown"></v-text-field>
													<v-text-field label="Ring 4 Closing" v-model="ringKillPoints.ring3.closing"></v-text-field>
												</v-col>
												<v-col cols="2">
													<v-text-field label="Ring 5 Countdown" v-model="ringKillPoints.ring4.countdown"></v-text-field>
													<v-text-field label="Ring 5 Closing" v-model="ringKillPoints.ring4.closing"></v-text-field>
												</v-col>
												<v-col cols="2">
													<v-text-field label="Ring 6 Countdown" v-model="ringKillPoints.ring5.countdown"></v-text-field>
													<v-text-field label="Ring 6 Closing" v-model="ringKillPoints.ring5.closing"></v-text-field>
												</v-col>
											</v-row>
										</div>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
						</v-card-text>
					</v-card>
					<v-card class="ma-1">
						<v-tabs background-color="grey darken-4" v-model="tabs2">
							<v-tab>Stats Code</v-tab>
							<v-tab>Live Data</v-tab>
						</v-tabs>
						<v-tabs-items v-model="tabs2">
							<v-tab-item>
								<v-card class="elevation-0 grey darken-4">
									<!-- <v-card-title>Stats Code</v-card-title> -->
									<v-card-subtitle>Use your EA provided stats code to fetch stats. The latest game
										will be
										used by
										default, or use the game selector to select a previous game. </v-card-subtitle>
									<v-card-text>
										<v-text-field :disabled="isAutoPolling" v-model="statsCode" label="Apex Stats Code"></v-text-field>
										<v-expansion-panels>
											<v-expansion-panel>
												<v-expansion-panel-header>
													Game Selector
												</v-expansion-panel-header>
												<v-expansion-panel-content>
													<div v-if="games && games[0]" class="game-select">
														<h3>Most Recent</h3>
														<game-select @click="selectedGame = games[0].match_start"
															:selected="selectedGame == games[0].match_start"
															:game="games[0]"></game-select>
														<h3>Other Games</h3>
														<game-select @click="selectedGame = game.match_start"
															v-for="game in games.slice(1)"
															:selected="selectedGame == game.match_start"
															:key="game.start_time" :game="game">
														</game-select>
													</div>
													<div v-else><i>Enter a stats code to view games</i></div>
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
										<!-- <v-checkbox v-model="autoLivedata" label="Automatically Attach Live Data">
										</v-checkbox> -->
									</v-card-text>
									<v-card-actions>
										<v-btn block :disabled="!statsCode" :outlined="!isAutoPolling" color="primary" @click="toggleAutoPoll">{{ !isAutoPolling ? "Start Auto Scoring" : "Cancel Auto Scoring" }}</v-btn>
									</v-card-actions>
								</v-card>
							</v-tab-item>

							<v-tab-item>
								<v-card class="elevation-0 grey darken-4">
									<!-- <v-card-title>Live Data</v-card-title> -->
									<v-card-subtitle>Supports both LiveData v1 and v2.


									</v-card-subtitle>

									<v-card-text>
										<h3>Live Data v2 (Streamed)</h3>
										<v-divider class="my-2" />

										<v-item-group v-if="unclaimedLiveData?.length > 0" v-model="selectedUnclaimed">
											<v-item class="live-data-item" v-for="unclaimed in unclaimedLiveData"
												v-slot="{ toggle }" :key="unclaimed.id">
												<div @click="toggle"> ({{ unclaimed.client }}) {{
													getDate(unclaimed.timestamp * 1000) }} {{getTime(unclaimed.timestamp * 1000) }} -
													{{ getRelative(unclaimed.timestamp * 1000) }}

												</div>
											</v-item>
										</v-item-group>
										<div v-else><i>No Streamed Live Data. </i></div>
										<h3 class="pt-4">Live Data v1 (Manual Upload) </h3>
										<v-divider class="my-2" />

										<v-file-input v-model="liveData" truncate-length="15" label="Upload live-data" chips
											prepend-icon=""></v-file-input>
									</v-card-text>
								</v-card>
							</v-tab-item>
						</v-tabs-items>
					</v-card>

				</v-card-text>

				<v-card-actions>
					<v-btn :loading="loading" color="primary" block
						:disabled="isAutoPolling || loading || !statsCode && !liveData && selectedUnclaimed === undefined"
						@click="addGame">Add Game</v-btn>
				</v-card-actions>
			</v-card>
		</v-col>
		<v-col sm="12" lg="6">
			<v-card>
				<v-card-title>Scores</v-card-title>
				<v-card-text class="small-text">
					<v-tabs v-model="tabs">
						<v-tab>Overall</v-tab>
						<v-tab v-for="(game, index) in stats.games" :key="index">{{ game.game }}</v-tab>
					</v-tabs>
					<v-tabs-items v-model="tabs">
						<v-tab-item>
							<v-btn @click="openCSVDialog('overall')">Export CSV</v-btn>
							<simple-score-table :stats="stats"></simple-score-table>
						</v-tab-item>
						<v-tab-item v-for="(game, index) in stats.games" :key="index">
							<v-btn @click="openCSVDialog(game.game)">Export CSV</v-btn>
							<v-btn @click="deleteStats(game.game)">Delete</v-btn>
							<simple-score-table :stats="game" @edit="edit"></simple-score-table>
						</v-tab-item>
					</v-tabs-items>
				</v-card-text>
			</v-card>

		</v-col>
		<v-snackbar color="green" v-model="showPollingStart">
				Auto Scoring {{ eventId }} for the next 6 hours.

				<template v-slot:action="{ attrs }">
					<v-btn color="black" text v-bind="attrs" @click="showError = false">
						Close
					</v-btn>
				</template>
			</v-snackbar>
		<v-snackbar color="red" v-model="showError">
			{{ error.msg }}

			<template v-slot:action="{ attrs }">
				<v-btn color="black" text v-bind="attrs" @click="showError = false">
					Close
				</v-btn>
			</template>
		</v-snackbar>


		<!-- <v-tooltip bottom style="pointer-events: all" v-model="showLiveHelp">
			<template v-slot:activator="{}">
				<v-btn @click="showLiveHelp = !showLiveHelp" color="primary"
					text><v-icon>mdi-information</v-icon>How
					To</v-btn>
			</template>
			<ul>
				<li>Add the launch arg:
					<pre>+cl_liveapi_enabled 1</pre>
				</li>
				<li>Create a custom lobby and join the observer slot.
				</li>
				<li>Start the game. <i>You must be an observer</i></li>
				<li>When the game is finished the data will be in
					<pre>%USERPROFILE%\Saved Games\Respawn\Apex\assets\temp\live_api</pre>
				</li>
				<li>Upload the file that coresponds with this game (probably the latest)
				</li>
			</ul>
		</v-tooltip> -->

	</v-row>
</template>

<script>
import SimpleScoreTable from '@/components/SimpleScoreTable.vue';
import GameSelect from '@/components/GameSelect.vue';
import Day from "dayjs";
import IconBtnFilled from "@/components/IconBtnFilled";
import { displayOptions, getDisplayName } from '../../utils/statsUtils';

const DEFAULT_RING_KP = {
	"ring0": {
		countdown: 1,
		closing: 1,
	},
	"ring1": {
		countdown: 1,
		closing: 1,
	},
	"ring2": {
		countdown: 1,
		closing: 1,
	},
	"ring3": {
		countdown: 1,
		closing: 1,
	},
	"ring4": {
		countdown: 1,
		closing: 1,
	},
	"ring5": {
		countdown: 1,
		closing: 1,
	},
};
const DEFAULT_PLACEMENT = "12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0";
let relativeTime = require("dayjs/plugin/relativeTime");
Day.extend(relativeTime);

export default {
	components: {
		GameSelect,
		SimpleScoreTable,
		IconBtnFilled
	},
	props: [
		"eventId",
		"organizer",
		"matchId",
	],
	data() {
		return {
			showCSVDialog: false,
			optionTeamOrPlayer: "",
			csvCols: {},
			csvGame: 0,
			tabs: undefined,
			tabs2: undefined,
			game: 1,
			statsCode: undefined,
			skipFetch: false,
			games: undefined,
			selectedGame: 0,
			showError: false,
			showGameSelect: false,
			placementPoints: undefined,
			killPoints: undefined,
			stats: {
				teams: []
			},
			liveData: undefined,
			autoLivedata: true,
			error: {},
			showLiveHelp: false,
			loading: false,
			unclaimedLiveData: [],
			selectedUnclaimed: undefined,
			ringKillPoints: DEFAULT_RING_KP,
			useRingKillPoints: false,
			settings: undefined,
			autoPollSettings: undefined,
			loaded: false,
			showPollingStart: false,
		}
	},
	computed: {
		trimmedStatsCode() {
			return this.statsCode?.trim();
		},
		isAutoPolling() {
			let now = Date.now();
			return this.autoPollSettings?.pollStart && this.autoPollSettings.pollStart < now && this.autoPollSettings.pollEnd > now;
		},
		teamKeys() {
			const teamKeys = displayOptions.display.team.map(key => {
				return {key, label: getDisplayName(key)}
			})
			return [{key:"name", label:"Team Name"}, ...teamKeys]
		},
		playerKeys() {
			const playerKeys = displayOptions.display.player.filter(key => key !== "score").map(key => {
				return {key, label: getDisplayName(key)}
			})
			return [{key:"name", label:"Player Name"}, ...playerKeys]
		}
	},
	watch: {
		async statsCode() {
			this.games = await this.$apex.getStatsFromCode(this.statsCode);
			this.selectedGame = undefined;
		},
		async eventId() {
			this.loaded = false;
			await this.updateStats();
			await this.fetchSettings();
		},
		ringKillPoints: {
			deep: true,
			handler() {
				this.pushSettings();
			}
		},
		placementPoints() {
			this.pushSettings();
		},
		killPoints() {
			this.pushSettings();
		},
		useRingKillPoints() {
			this.pushSettings();
		},
		showCSVDialog() {
			if(this.showCSVDialog) {
				this.optionTeamOrPlayer = "team"
			}
		},
		optionTeamOrPlayer(newVal) {
			if(newVal === "team")
				this.csvCols = {
					name: true,
					score: true,
					kills:true
				}
			else
				this.csvCols = {
					name:true,
					kills:true
				}
		}
	},
	methods: {
		csv() {
			let selectedKeys = []
			
			if(this.optionTeamOrPlayer === "team")
				selectedKeys = this.teamKeys.filter(key => Object.keys(this.csvCols).filter(csvKey => csvKey).includes(key.key))
			else if(this.optionTeamOrPlayer === "player")
				selectedKeys = this.playerKeys.filter(key => Object.keys(this.csvCols).filter(csvKey => csvKey).includes(key.key))

			this.showCSVDialog = false

			this.$apex.exportCsv(
				this.organizer,
				this.eventId,
				this.csvGame,
				this.optionTeamOrPlayer,
				selectedKeys,
				this.stats);
		},
		openCSVDialog(game) {
			this.showCSVDialog = true
			this.csvGame = game
		},
		setAllCsvOptionFields(option) {
			if(option === "team") {
				this.teamKeys.forEach(key => {
					this.$set(this.csvCols, key.key, true)
				})
			}else if(option === "player"){
				this.playerKeys.forEach(key => {
					this.$set(this.csvCols, key.key, true)
				})
			}
		},
		async addGame() {
			this.loading = true;
			let result = await this.$apex.generateStats(
				this.eventId,
				this.trimmedStatsCode,
				this.game,
				this.selectedGame,
				this.unclaimedLiveData?.[this.selectedUnclaimed]?.id,
				this.liveData,
			);
			if (result.err) {
				this.error = result;
				this.showError = true;
			} else {
				await this.updateStats();
				this.liveData = undefined;
			}
			this.loading = false;
		},
		async toggleAutoPoll() {
			if (this.isAutoPolling) {
				await this.$apex.setMatchPolling(this.matchId, 0, 0, this.statsCode);
			} else {
				const now = Date.now();
				await this.$apex.setMatchPolling(this.matchId, now, now + (6 * 60 * 60 * 1000), this.statsCode);
				this.showPollingStart = true;
			}
			await this.fetchSettings();
		},
		async updateStats() {
			this.stats = await this.$apex.getStats(this.organizer, this.eventId, "overall");
			if (this.stats && this.stats.games)
				this.game = this.stats.games[this.stats.games.length - 1].game + 1;
			else
				this.game = 1;
		},
		async deleteStats(game) {
			await this.$apex.deleteStats(this.organizer, this.eventId, game);
			await this.updateStats();
		},
		async getUnclaimedLiveData() {
			this.unclaimedLiveData = await this.$apex.getUnclaimedLiveData();
		},
		getDate(timestamp) {
			return Intl.DateTimeFormat(navigator.language, { month: 'short', day: 'numeric', year: "numeric" }).format(new Date(timestamp))
		},
		getTime(timestamp) {
			return Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "numeric", hour12: true, timeZoneName: "short" }).format(new Date(timestamp));
		},
		getRelative(timestamp) {
			return Day(timestamp).from(Day());
		},
		async edit({ gameId, teamId, score }) {
			await this.$apex.editScore(gameId, teamId, score);
			await this.updateStats();
		},
		async pushSettings() {
			if (!this.loaded) return;
			this.settings.scoring = {
				placementPoints: this.placementPoints?.split(",").map(i => parseInt(i)) || DEFAULT_PLACEMENT,
				killPoints: this.killPoints ?? 1,
				ringKillPoints: this.ringKillPoints || DEFAULT_RING_KP,
				useRingKillPoints: this.useRingKillPoints,
			}
			await this.$apex.setPublicSettings(this.matchId, this.settings);
		},
		async fetchSettings() {
			this.settings = await this.$apex.getPublicSettings(this.matchId) || {};
			this.placementPoints = this.settings.scoring?.placementPoints.join(", ") ?? DEFAULT_PLACEMENT; 
			this.killPoints = this.settings.scoring?.killPoints ?? 1;
			this.ringKillPoints = this.settings.scoring?.ringKillPoints || DEFAULT_RING_KP;
			this.useRingKillPoints = this.settings.scoring?.useRingKillPoints || false;

			this.autoPollSettings = await this.$apex.getMatchPolling(this.matchId);
			this.statsCode = this.autoPollSettings.statsCodes;

			await this.$nextTick();
			this.loaded = true;
		}
	},
	async mounted() {
		this.updateStats();

		this.getUnclaimedLiveData();
		this.inter = setInterval(() => this.getUnclaimedLiveData(), 5000);
		this.inter2 = setInterval(() => this.updateStats(), 1000 * 60 * 2);
		await this.fetchSettings();
	},
	destroyed() {
		clearInterval(this.inter);
	}
}
</script>

<style scoped lang="scss">
.game-select {
	max-height: 500px;
	overflow: auto;
}

.scroll-keys {
	max-height: 350px;
	overflow: auto;
}

.small-text {
	font-size: .8em;
}

.v-tooltip__content {
	pointer-events: all;
}

.live-data-item {
	border: 1px solid #333;
	background: $second-tone;
	padding: 5px 10px;
	margin: 5px 3px;
	border-radius: 5px;
	cursor: pointer;

	&.v-item--active {
		background: $primary;
	}
}
</style>