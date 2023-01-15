let data = require("./mock.json");


data = data.filter(d => (d.victim && d.victim.name == "KraziiHorse"));

data = data.map(d => ({ health: d.victim.currentHealth, sheild: d.victim.shieldHealth, damage: d.damageInflicted, cat: d.category }))


console.log(JSON.stringify(data));