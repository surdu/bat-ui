(function() {
	'use strict';

	var pylons, devices;

	var pylonsArea;
	var canvasArea;
	var canvas = $("#map");
	var ctx = canvas.get(0).getContext('2d');

	ctx.font = '14px serif';
	ctx.fillStyle = 'rgb(0, 0, 0)';

	function resizeCanvas() {
		if (!pylons) {
			return;
		}

		// determine pylons area dimension
		var pylonsIDs = Object.keys(pylons);
		pylonsArea = {w: 0, h: 0};
		for (var f = 0; f < pylonsIDs.length; f++) {
			var pylon = pylons[pylonsIDs[f]];
			if (pylonsArea.w < pylon.x) {
				pylonsArea.w = pylon.x;
			}

			if (pylonsArea.h < pylon.y) {
				pylonsArea.h = pylon.y;
			}
		}

		var heightFactor = pylonsArea.h / pylonsArea.w;

		canvas.height(canvas.width() * heightFactor);
		canvasArea = {w: canvas.width(), h: canvas.height()};
		ctx.canvas.width = canvasArea.w;
		ctx.canvas.height = canvasArea.h;
	}

	function pylons2canvasCoords(pylonCoords) {
		return {
			x: (canvasArea.w * pylonCoords.x) / pylonsArea.w,
			y: (canvasArea.h * pylonCoords.y) / pylonsArea.h
		};
	}

	function plotDevices() {
		var deviceIDs = Object.keys(devices);
		for (var f = 0; f < deviceIDs.length; f++) {
			var deviceID = deviceIDs[f];
			var device = devices[deviceID];
			var coords = pylons2canvasCoords(device);
			console.log("coords:",coords);
			ctx.beginPath();
			ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.fillText(deviceID, coords.x, coords.y - 10);
		}


	}

	var connection = new WebSocket('ws://localhost:1883/data');

	connection.onmessage = function (e) {
		var response = JSON.parse(e.data);
		console.log(response);
		pylons = response.pylons;
		devices = response.devices;

		resizeCanvas();
		plotDevices();
	};

}());
