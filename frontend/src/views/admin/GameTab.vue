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
										<v-text-field v-model.number="killPoints" label="Kill Points"></v-text-field>
										<v-text-field v-model="placementPoints" label="Placement Points"></v-text-field>
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
										<v-text-field v-model="statsCode" label="Apex Stats Code"></v-text-field>
										<v-expansion-panels>
											<v-expansion-panel>
												<v-expansion-panel-header>
													Game Selector
												</v-expansion-panel-header>
												<v-expansion-panel-content>
													<div v-if="games" class="game-select">
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
													getDate(unclaimed.timestamp * 1000) }} {{
		getTime(unclaimed.timestamp * 1000) }} -
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
						:disabled="loading || !statsCode && !liveData && selectedUnclaimed === undefined"
						@click="addGame">Add
						Game</v-btn>
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
							<simple-score-table :stats="stats"></simple-score-table>
						</v-tab-item>
						<v-tab-item v-for="(game, index) in stats.games" :key="index">
							<v-btn @click="deleteStats(game.game)">Delete</v-btn>
							<simple-score-table :stats="game" @edit="edit"></simple-score-table>
						</v-tab-item>
					</v-tabs-items>
				</v-card-text>
			</v-card>

		</v-col>
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

let relativeTime = require("dayjs/plugin/relativeTime");
Day.extend(relativeTime);

export default {
	components: {
		GameSelect,
		SimpleScoreTable
	},
	props: [
		"eventId",
		"organizer",
	],
	data() {
		return {
			tabs: undefined,
			tabs2: undefined,
			game: 1,
			statsCode: undefined,
			skipFetch: false,
			games: undefined,
			selectedGame: 0,
			showError: false,
			showGameSelect: false,
			placementPoints: "12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0",
			killPoints: 1,
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
		}
	},
	computed: {
		trimmedStatsCode() {
			if (this.statsCode) {
				return this.statsCode.trim();
			}
			return undefined;
		}
	},
	watch: {
		async statsCode() {
			this.games = await this.$apex.getStatsFromCode(this.statsCode);
			this.selectedGame = undefined;
		},
		eventId() {
			this.updateStats();
		}
	},
	methods: {
		async addGame() {
			this.loading = true;
			let result = await this.$apex.generateStats(
				this.eventId,
				this.trimmedStatsCode,
				this.game,
				this.selectedGame,
				this.killPoints,
				this.placementPoints,
				this.autoLivedata,
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
		async updateStats() {
			this.stats = await this.$apex.getStats(this.organizer, this.eventId, "overall");
			if (this.stats && this.stats.games)
				this.game = this.stats.games[this.stats.games.length - 1].game + 1;
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
		}
	},
	mounted() {
		console.log("Getting Stats")
		this.updateStats();

		this.getUnclaimedLiveData();
		this.inter = setInterval(() => this.getUnclaimedLiveData(), 2000);
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