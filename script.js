// Fader controls
document.querySelectorAll(".fader-handle").forEach((handle) => {
	let isDragging = false;
	let startY, startTop;

	handle.addEventListener("mousedown", (e) => {
		isDragging = true;
		startY = e.clientY;
		startTop = parseInt(handle.style.top || "70");
		document.body.style.cursor = "grabbing";
	});

	document.addEventListener("mousemove", (e) => {
		if (!isDragging) return;

		const deltaY = e.clientY - startY;
		let newTop = startTop + deltaY;
		newTop = Math.max(0, Math.min(newTop, 140));
		handle.style.top = `${newTop}px`;

		const control = handle.dataset.control;
		if (control === "speedL" || control === "speedR") {
			const speed = 3 - (newTop / 140) * 2;
			const vinyl = document.getElementById(
				control === "speedL" ? "leftVinyl" : "rightVinyl"
			);
			vinyl.style.animationDuration = `${3 / speed}s`;

			// Speed display
			const display = vinyl.closest(".turntable").querySelector(".speed-display");
			display.textContent = `Speed: ${speed.toFixed(1)}x`;
		}
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
		document.body.style.cursor = "default";
	});
});

// Volume meter control
const leds = Array.from(document.querySelectorAll(".led-light")).reverse();

function updateVolumeMeter(rotation) {
	const volume = ((rotation + 150) / 300) * 100;

	// Led Brightness
	leds.forEach((led, index) => {
		const ledThreshold = (index + 1) * 10;
		const ledBrightness = Math.min(
			1,
			Math.max(0, (volume - (ledThreshold - 10)) / 10)
		);
		led.style.opacity = 0.1 + ledBrightness * 0.9;
	});
}

// Knob control
document.querySelectorAll(".knob").forEach((knob) => {
	let rotation = 0;
	let isDragging = false;
	let startAngle;

	knob.addEventListener("mousedown", (e) => {
		isDragging = true;
		const rect = knob.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
	});

	document.addEventListener("mousemove", (e) => {
		if (!isDragging) return;
		const rect = knob.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
		const angleDiff = currentAngle - startAngle;

		rotation += angleDiff * (180 / Math.PI);
		rotation = Math.min(150, Math.max(-150, rotation));

		// Sadece knob'un içindeki after elementini döndürüyoruz
		knob.style.transform = `rotate(${rotation}deg)`;

		if (knob.dataset.control === "volume") {
			updateVolumeMeter(rotation);
		}

		startAngle = currentAngle;
	});

	document.addEventListener("mouseup", () => {
		isDragging = false;
	});
});

// Turn speed control
const vinyls = document.querySelectorAll(".vinyl");
document.querySelectorAll(".control-button").forEach((button) => {
	button.addEventListener("click", (e) => {
		const speed = e.target.textContent;
		const turntable = e.target.closest(".turntable");
		const speedDisplay = turntable.querySelector(".speed-display");
		const vinyl = turntable.querySelector(".vinyl");

		speedDisplay.textContent = `${speed} RPM`;
		vinyl.style.animationDuration = speed === "33" ? "2s" : "1.5s";
	});
});
