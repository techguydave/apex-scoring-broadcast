const SCORE_ARRAY = [12, 9, 7, 5, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
const SCORE_SUMS = ["kills", "revivesGiven", "headshots", "assists", "survivalTime", "respawnsGiven", "damageDealt", "hits", "knockdowns", "shots", "grenadesThrown", "ultimatesUsed", "tacticalsUsed", "damageTaken"];

const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function randomString(length, chars = defaultChars) {
    return new Array(length).fill("").map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join();
}

function getOr(value, or) {
    return value || or;
}

function getOrFn(fn, or) {
    try {
        let val = fn();
        return getOr(val, or);
    } catch (err) {
        return or;
    }
}

module.exports = {
    randomString,
    getOr,
    getOrFn,
    SCORE_ARRAY,
    SCORE_SUMS,
}