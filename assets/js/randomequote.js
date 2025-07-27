$(document).ready(function() {
	console.log("randomequote.js: DOM ready, loading welcome.json");
	$.getJSON("/assets/data/welcome.json", function (data) {
		console.log("randomequote.js: welcome.json loaded, data length:", data.length);
		// Create a copy of the data array to pick unique quotes
		let availableQuotes = [...data];

		function getRandomQuote() {
			if (availableQuotes.length === 0) {
				// If no more unique quotes, reset the pool (optional, depending on desired behavior)
				availableQuotes = [...data];
			}
			const randomIndex = Math.floor(Math.random() * availableQuotes.length);
			const quote = availableQuotes[randomIndex];
			availableQuotes.splice(randomIndex, 1); // Remove the selected quote to ensure uniqueness
			return quote;
		}

		let hiText = getRandomQuote();
		let titleText = getRandomQuote();
		let subtitleText = getRandomQuote();
		let disclaimerText = getRandomQuote();

		console.log("randomequote.js: Selected quotes:", { hiText, titleText, subtitleText, disclaimerText });

		// Handle special cases for hiText
		if (hiText.includes("OGNUM1") && hiText.includes("SQRTNUM1")) {
			let ognum = Math.floor(Math.random() * 3000);
			hiText = "the square root of " + ognum + " is " + Math.sqrt(ognum);
		} else if (hiText.includes("CURRENTURL")) {
			hiText = window.location.hostname;
		}

		// Function to update element content
		function updateElementContent(elementId, content) {
			const element = document.getElementById(elementId);
			if (element) {
				element.innerHTML = content;
				console.log("randomequote.js: Updated", elementId, "with:", content);
			} else {
				console.log("randomequote.js: Element not found:", elementId);
			}
		}

		// Update all relevant elements
		updateElementContent("hiWelcomeText", hiText);
		updateElementContent("welcomeTitle", titleText);
		updateElementContent("welcomeSubtitle", subtitleText);
		updateElementContent("welcomeDisclaimer", disclaimerText);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.error("randomequote.js: Failed to load welcome.json:", textStatus, errorThrown);
	});
});