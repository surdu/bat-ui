(function() {
	'use strict';

	var pylons, devices;

	var pylonsArea;
	var canvasArea;
	var canvas = $("#map");
	var ctx = canvas.get(0).getContext('2d');

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
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.font = '14px sans-serif';
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

	function drawStage () {
		ctx.fillStyle = 'rgb(185, 185, 185)';
		var screenWidth = 300;
		var screenPos = (ctx.canvas.width / 2) - (screenWidth / 2);
		ctx.fillRect(screenPos, 0, screenWidth, 15);
	}

	function drawPylons() {
		ctx.fillStyle = 'rgb(185, 0, 0)';
		ctx.font = '14px sans-serif';

		var pylonGirth = 20;
		var pylonsIDs = Object.keys(pylons);
		for (var f = 0; f < pylonsIDs.length; f++) {
			var pylon = pylons[pylonsIDs[f]];
			ctx.beginPath();
			var coords = pylons2canvasCoords(pylon);
			ctx.arc(coords.x, coords.y, pylonGirth, 0, Math.PI * 2, true);
			ctx.fill();

			var textCoords = {};
			var middleWidth = ctx.canvas.width / 2;
			var middleHeight = ctx.canvas.height / 2;

			if (coords.x < middleWidth && coords.y < middleHeight) {
				textCoords.x = coords.x + pylonGirth;
				textCoords.y = coords.y + pylonGirth;
			}

			if (coords.x > middleWidth && coords.y < middleHeight) {
				textCoords.x = coords.x - pylonGirth * 3;
				textCoords.y = coords.y + pylonGirth;
			}

			if (coords.x > middleWidth && coords.y > middleHeight) {
				textCoords.x = coords.x - pylonGirth * 3;
				textCoords.y = coords.y - pylonGirth * 1.3;
			}

			if (coords.x < middleWidth && coords.y > middleHeight) {
				textCoords.x = coords.x + pylonGirth;
				textCoords.y = coords.y - pylonGirth;
			}


			ctx.fillText(pylonsIDs[f], textCoords.x, textCoords.y + 10);
		}
	}

	function drawChairs() {
		ctx.fillStyle = 'rgb(185, 185, 185)';
		var chairsNum = {x: 14, y: 8};
		var chairDim = {w: 20, h: 10};
		var sitanceFromStage = 200;
		var margin = 10;

		var chairAreaWidth = (chairsNum.x * (chairDim.w + margin)) - margin;

		var chairsStart = (ctx.canvas.width / 2) - (chairAreaWidth / 2);

		for (var f = 0; f < chairsNum.y; f++) {
			var coordY = sitanceFromStage + ((chairDim.h + margin) * f);
			for (var g = 0; g < chairsNum.x; g++) {
				var coordX = chairsStart + ((chairDim.w + margin) * g);
				ctx.fillRect(coordX, coordY, chairDim.w, chairDim.h);
			}
		}
	}

	function drawOrnaments() {
		drawStage();
		drawChairs();
		drawPylons();
	}


	var connection = new WebSocket('ws://localhost:1883/data');

	connection.onmessage = function (e) {
		var response = JSON.parse(e.data);
		pylons = response.pylons;
		devices = response.devices;
		resizeCanvas();
		drawOrnaments();
		plotDevices();
	};

}());
