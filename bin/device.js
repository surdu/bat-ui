const pylons = require("./pylons");

module.exports =
class Device {
	constructor() {
		this.pylons = {};
		var pylonsKeys = Object.keys(pylons);
		for (let f = 0; f < pylonsKeys.length; f++) {
			this.pylons[pylonsKeys[f]] = 0;
		}
	}
}
