/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {
	'use strict';

	// DOM Elements
	const $window = $(window);
	const $body = $('body');
	const $wrapper = $('#wrapper');
	const $header = $('#header');
	const $footer = $('#footer');
	const $main = $('#main');
	const $mainArticles = $main.children('article');

	// Configuration
	const config = {
		delay: 325,
		breakpoints: {
			xlarge: ['1281px', '1680px'],
			large: ['981px', '1280px'],
			medium: ['737px', '980px'],
			small: ['481px', '736px'],
			xsmall: ['361px', '480px'],
			xxsmall: [null, '360px']
		}
	};

	// State management
	let isLocked = false;

	// Initialize breakpoints
	breakpoints(config.breakpoints);

	// Play initial animations on page load
	$window.on('load', () => {
		setTimeout(() => {
			$body.removeClass('is-preload');
		}, 0);
	});

	// Fix: Flexbox min-height bug on IE
	if (browser.name === 'ie') {
		let flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', () => {
			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(() => {
				if ($wrapper.prop('scrollHeight') > $window.height()) {
					$wrapper.css('height', 'auto');
				} else {
					$wrapper.css('height', '100vh');
				}
			}, 250);
		}).triggerHandler('resize.flexbox-fix');
	}

	// Navigation setup
	const $nav = $header.children('nav');
	const $navLi = $nav.find('li');

	// Add "middle" alignment classes for even number of items
	if ($navLi.length % 2 === 0) {
		$nav.addClass('use-middle');
		$navLi.eq($navLi.length / 2).addClass('is-middle');
	}

	const Main = {
		// Show article
		show: function (id, initial = false) {
		  const $article = $mainArticles.filter(`#${id}`);
	  
		  // No such article? Bail
		  if ($article.length === 0) return;
	  
		  // If we're locked or this is the initial load, do an immediate swap:
		  if (isLocked || initial) {
			$body.addClass('is-article-visible');
			$main.show();
			$article.show().addClass('active');
			isLocked = false;
	  
			// Allow #main to scroll
			$main.css('overflow-y', 'auto').scrollTop(0);
		  } else {
			// Otherwise do the animated swap
			isLocked = true;
	  
			if ($body.hasClass('is-article-visible')) {
			  // Already visible: swap out old article
			  const $current = $mainArticles.filter('.active');
			  $current.removeClass('active');
	  
			  setTimeout(() => {
				$current.hide();
				$article.show();
	  
				setTimeout(() => {
				  $article.addClass('active');
	  
				  // Allow #main to scroll
				  $main.css('overflow-y', 'auto').scrollTop(0);
	  
				  setTimeout(() => {
					isLocked = false;
				  }, config.delay);
				}, 25);
			  }, config.delay);
			} else {
			  // First time showing an article
			  $body.addClass('is-article-visible');
	  
			  setTimeout(() => {
				$main.show();
				$header.hide();
				$footer.hide();
	  
				setTimeout(() => {
				  $mainArticles.hide();
				  $article.show();
	  
				  setTimeout(() => {
					$article.addClass('active');
	  
					// Allow #main to scroll
					$main.css('overflow-y', 'auto').scrollTop(0);
	  
					setTimeout(() => {
					  isLocked = false;
					}, config.delay);
				  }, 25);
				}, config.delay);
			  }, 25);
			}
		  }
		},
	  
		// Hide article
		hide: function (addHistory = true) {
		  if (!$body.hasClass('is-article-visible')) return;
		  if (addHistory) history.pushState(null, null, '#');
		  if (isLocked) return;
	  
		  isLocked = true;
		  const $article = $mainArticles.filter('.active');
		  $article.removeClass('active');
	  
		  setTimeout(() => {
			$article.hide();
	  
			setTimeout(() => {
			  $main.hide();
			  $header.show();
			  $footer.show();
	  
			  setTimeout(() => {
				$body.removeClass('is-article-visible');
	  
				// Remove custom overflow on #main
				$main.css('overflow-y', '');
	  
				setTimeout(() => {
				  isLocked = false;
				}, config.delay);
			  }, 25);
			}, config.delay);
		  }, config.delay);
		}
	  };

	// Bind main methods
	$main._show = Main.show;
	$main._hide = Main.hide;

	// Navigation events
	$nav.on('click', 'a', function(event) {
		const $this = $(this);
		const href = $this.attr('href');

		// Not an article link? Bail
		if (href.charAt(0) !== '#') return;

		// Prevent default
		event.preventDefault();
		event.stopPropagation();

		// Hide article
		$main._hide();

		// Show article
		setTimeout(() => {
			$main._show(href.substr(1));
		}, config.delay);
	});

	// Close button events
	$main.on('click', '.close', function(event) {
		event.preventDefault();
		event.stopPropagation();

		$main._hide();
	});

	// Prevent clicks from inside article from bubbling
	$main.on('click', 'article', function(event) {
		event.stopPropagation();
	});

	// Global events
	$body.on('click', function(event) {
		// Article visible? Hide
		if ($body.hasClass('is-article-visible')) {
			$main._hide(true);
		}
	});

	$window.on('keyup', function(event) {
		switch (event.keyCode) {
			case 27: // Escape
				// Article visible? Hide
				if ($body.hasClass('is-article-visible')) {
					$main._hide(true);
				}
				break;
		}
	});

	$window.on('hashchange', function(event) {
		// Empty hash?
		if (location.hash === '' || location.hash === '#') {
			// Prevent default
			event.preventDefault();
			event.stopPropagation();

			// Hide
			$main._hide();
		}
		// Otherwise, check for a matching article
		else if ($mainArticles.filter(location.hash).length > 0) {
			// Prevent default
			event.preventDefault();
			event.stopPropagation();

			// Show article
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration
	// This prevents the page from scrolling back to the top on a hashchange
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	} else {
		let oldScrollPos = 0;
		let scrollPos = 0;
		const $htmlbody = $('html,body');

		$window
			.on('scroll', () => {
				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();
			})
			.on('hashchange', () => {
				$window.scrollTop(oldScrollPos);
			});
	}

	// Initialize
	// Hide main, articles
	$main.hide();
	$mainArticles.hide();

	// Initial article
	if (location.hash !== '' && location.hash !== '#') {
		$window.on('load', () => {
			$main._show(location.hash.substr(1), true);
		});
	}

	// Contact form handler
	$('#contact-form').on('submit', function(event) {
		event.preventDefault();
		
		const $form = $(this);
		const $submitBtn = $form.find('input[type="submit"]');
		const originalText = $submitBtn.val();
		
		// Show loading state
		$submitBtn.val('Sending...').prop('disabled', true);
		
		// Simulate form submission (replace with actual form handling)
		setTimeout(() => {
			// Show success message
			$form.html('<div class="success-message"><h3>Message Sent!</h3><p>Thank you for your message. I\'ll get back to you soon!</p></div>');
		}, 1500);
	});

})(jQuery);