import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from "../views/Admin";
import Broadcast from "../views/Broadcast";
import Index from "../views/Index";
import Tournament from "../views/Tournament";
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
    path: "/tournament/:organizer/:eventId/",
    name: "tournament",
    component: Tournament,
    props: true,
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
