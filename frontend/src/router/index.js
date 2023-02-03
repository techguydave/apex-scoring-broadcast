import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from "../views/Admin";
import Broadcast from "../views/Broadcast";
import Index from "../views/Index";
import Tournament from "../views/Tournament";
import Players from "../views/Players";
import Player from "../views/Player";

import Standings from "../components/tournament/Standings";
import Stats from "../components/tournament/Stats";

import Scoreboard from "../components/tournament/standings/Scoreboard";
import TeamStandings from "../components/tournament/standings/TeamStandings";
import PlayerStandings from "../components/tournament/standings/PlayerStandings";
import Feed from "../components/tournament/standings/Feed";

import StatsCumulativeCharts from "../components/tournament/stats/CumulativeCharts";
import StatsGameCharts from "../components/tournament/stats/GameCharts";
import StatsPointRatioCharts from "../components/tournament/stats/PointRatio";
import StatsPickRate from "../components/tournament/stats/PickRate";

import PlayerOverview from "../components/player/Overview";
import PlayerMatches from "../components/player/Matches";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    props: true,
  },
  {
    path: "/broadcast/:organizer/:eventId",
    name: "broadcast",
    component: Broadcast,
    props: true,
  },
  {
    path: '/admin/:organizer?/:eventId?',
    name: 'admin',
    component: Admin,
    props: true,
  },
  {
    path: "/players",
    name: "players",
    component: Players,
    props: true,
  },
  {
    path: "/player/:id",
    name: "player",
    component: Player,
    props: true,
    redirect: { name: "player.overview" },
    children: [
      {
        path: "overview",
        name: "player.overview",
        component: PlayerOverview,
        props: true,
      },
      {
        path: "matches",
        name: "player.matches",
        component: PlayerMatches,
        props: true,
      }
    ]
  },
  {
    path: "/tournament/:organizer/:eventId/",
    name: "tournament",
    component: Tournament,
    props: true,
    redirect: { name: "tournament.standings", params: { game: "overall" } },
    children: [
      {
        path: "standings/:game?",
        name: "tournament.standings",
        component: Standings,
        props: true,
        redirect: { name: "tournament.standings.scoreboard" },
        children: [
          {
            path: "scoreboard",
            name: "tournament.standings.scoreboard",
            component: Scoreboard,
            props: true,
          },
          {
            path: "team-standings",
            name: "tournament.standings.team",
            component: TeamStandings,
            props: true,
          },
          {
            path: "player-standings",
            name: "tournament.standings.player",
            component: PlayerStandings,
            props: true,
          },
          {
            path: "feed",
            name: "tournament.standings.feed",
            component: Feed,
            props: true,
          }
        ]
      },
      {
        path: "stats",
        name: "tournament.stats",
        component: Stats,
        props: true,
        redirect: { name: "tournament.stats.point-ratio" },
        children: [
          {
            path: "charts",
            name: "tournament.stats.charts",
            component: StatsCumulativeCharts,
            props: true,
          },
          {
            path: "game-charts",
            name: "tournament.stats.game-charts",
            component: StatsGameCharts,
            props: true,
          },
          {
            path: "point-ratio",
            name: "tournament.stats.point-ratio",
            component: StatsPointRatioCharts,
            props: true,
          },
          {
            path: "pick-rate",
            name: "tournament.stats.pick-rate",
            component: StatsPickRate,
            props: true,
          }
        ]
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
