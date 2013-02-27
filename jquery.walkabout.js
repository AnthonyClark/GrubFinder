(function ($) {
	var methods = {
		//Future home for methods
	}

	$.fn.walkabout = function (options, callback) {
		
		settings = $.extend({
			location: '',
			animation: 'fade',
			duration: 150
		}, options);

		//Check if element has already been positioned
		if (this.parent().attr("id") == settings.location.substring(1) || this.parent().attr("class") == settings.location.substring(1))
			return;

		console.log(this.parent().attr("id") == settings.location || this.parent().attr("class") == settings.location)

		//Move to new position
		var clone = this.clone(true);
		this.fadeOut(settings.duration, function () {
			this.remove();
			$(clone.hide()).appendTo(settings.location).fadeIn(settings.duration);
		});

		if ($.isFunction(callback)) {
			callback.call(this);
		}

		//console.log($(this).html())
		console.log(this.parent().attr("id"));
	}
})(jQuery);