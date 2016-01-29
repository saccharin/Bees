+function($) {
	
	var Swarm = function(element, options) {
		this.$element = $(element);
		this.options = $.extend({}, Swarm.DEFAULTS, options);
		
		this.originX = this.$element.offset().left + (this.$element.width() * .5);
		this.originY = this.$element.offset().top + (this.$element.height() * .5);
		
		this.windowWidth = $(window).width();
		this.windowHeight = $(window).height();
		
		this.bees = [];
		this.interval = null;
	}
	
	Swarm.DEFAULTS = {
		numberOfBees: 250,
		interval: 450,
	}
	
	/*
	Swarm.prototype.buildBee = function() {
		//this.$element.bee().data("swarm").execute();
		return new Bee(this.$element, this, {});
	}
	*/
	
	Swarm.prototype.execute = function() {
		var s = this;
		this.interval = setInterval(function() {
			var b = new Bee(s, {});
			s.bees.push(b);
			
			if(s.bees.length > s.options.numberOfBees)
			{
				var x = s.bees.shift();
				x.kill();
			}
			
		}, this.options.interval);
	}
	
	Swarm.prototype.end = function(killBees) {
		clearInterval(this.interval);
		
		if(!killBees)
			return;
		
		this.bees.forEach(function(b) {
			b.kill();
		});
		delete this.bees;
		this.bees = [];
	}
	
	function Plugin(option) {
		return this.each(function() {
			var $this = $(this);
			var options = typeof option == 'object' && option;
			var data = $this.data("swarm");
			
			if(!data) 
				$this.data("swarm", (data = new Swarm(this, option)));
		
		})
	}
	
		
	  var old = $.fn.swarm

	  $.fn.swarm = Plugin;
	  $.fn.swarm.Constructor = Swarm;
	  
	  
}(jQuery);
