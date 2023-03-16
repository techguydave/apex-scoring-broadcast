const placementPoints = "12,12,9,7,5,4,3,3,2,2,2,1,1,1,1,1,0,0,0,0,0".split(",").map(n => parseInt(n.trim()))
const _ = require("lodash")

function getTeamScore(team) {
    if (this.stats?.teams) {
        let teamId = team.teamId;
        let statsTeam = this.stats?.teams?.find(team => team.teamId == teamId);
        return (statsTeam?.overall_stats?.score ?? 0) + team.kills + this.getPlacementPoints(team);
    }
    return team.kills + this.getPlacementPoints(team);
}
function getPlacementPoints(team) {
    if (team.placement && team.placement != -1) {
        return placementPoints[team.placement];
    } else {
        return this.liveData.teamsAlive <= 0 ? 0 : placementPoints[this.liveData.teamsAlive];
    }
}
function sortTeams(teams) {
    return Object.values(teams ?? {}).sort((a, b) => this.getTeamScore(b) - this.getTeamScore(a));
}

function isAlive(team) {
    return _.some(team, p => p.status == "alive")
}

module.exports = {
    placementPoints,
    getTeamScore,
    getPlacementPoints,
    sortTeams,
    isAlive,
}