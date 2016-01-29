//+function($) {
	
	var Bee = function(swarm, options) {
		
		this.options = $.extend({}, Bee.DEFAULTS, options);
		this.swarm = swarm;
		this.interval = null;
		
		if(Bee.lookupTable == null)
		{
			for (Bee.COUNTER=1e6, Bee.lookupTable=[]; Bee.COUNTER--;) 
				Bee.lookupTable.push(2 * (Math.random() - .48));
		}
		
		this.$element = $('<img src="' + this.options.src + '" />');
		$("body").append(this.$element);
		this.$element.css("position", "absolute");
		this.setCss({
			x: this.swarm.originX,
			y: this.swarm.originY
		});
		this.setCss(this.getNextPosition());
		
		this.fly();
	}
	
	Bee.DEFAULTS = {
		src: 'data:image/gif;base64,R0lGODlhBQAFAMIAAAAAAGZmZszMzP/rAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQBBQAEACwAAAAABQAFAAADDUgqQjAhkPGICGNJlQAAIfkEAQUABwAsAAAAAAUABQAAAw14KnEwQZzxDhsqqpMAACH5BAEFAAcALAAAAAAFAAUAAAMNeBpyMOyMd0IYSjSVAAAh+QQBBQAHACwAAAAABQAFAAADDXgqcTBBnPEOGyqqkwAAOw==',
		boundary: 20,
		velocity: 15,
		interval: 25
	}
	
	Bee.COUNTER;
	Bee.GETRANDOMNUMBER = function() {
		return ++Bee.COUNTER >= Bee.lookupTable.length 
			? Bee.lookupTable[Bee.COUNTER=0] 
			: Bee.lookupTable[Bee.COUNTER];
	}
	
	Bee.prototype.getBias = function(origin, position, multiplier) {
		return Math.pow((parseInt(origin - position)) / origin, 2) 
			* ((origin - position) > 0 ? 1 : -1) * origin * multiplier;
	}
	
	Bee.prototype.correctForBoundary = function(position, windowSize, boundarySize) {
		
		if(position < boundarySize)
			position = boundarySize + position;
		
		if((windowSize - boundarySize) < position)
			position = windowSize - boundarySize - (position - windowSize - boundarySize);
		
		return position;
	}
	
	Bee.prototype.getNextPosition = function() {
		var x = parseInt(this.$element.css("left"));
		var y = parseInt(this.$element.css("top"));
		
		// nudge the bees to the center
		var biasx = this.getBias(this.swarm.originX, x, .0005);
		var biasy = this.getBias(this.swarm.originY, y, .0005);
		
		x += this.options.velocity * (Bee.GETRANDOMNUMBER() + biasx);
		y += this.options.velocity * (Bee.GETRANDOMNUMBER() + biasy);
		
		x = this.correctForBoundary(x, this.swarm.windowWidth, this.options.boundary);
		y = this.correctForBoundary(y, this.swarm.windowHeight, this.options.boundary);
		
		return { x: x, y: y };
	}
	
	Bee.prototype.setCss = function(nextPosition) {
		
		this.$element.css("left", nextPosition.x);
		this.$element.css("top", nextPosition.y);
		
		var rot = "rotate(" + (Bee.GETRANDOMNUMBER() * 180) + "deg)";
		this.$element.css({
			"-ms-transform": rot,
			"-webkit-transform": rot,
			"transform": rot,
		});
	}
	
	Bee.prototype.fly = function() {
		var b = this;
		b.interval = setInterval(function() {
			b.setCss(b.getNextPosition());
			
		}, this.options.interval);
	}
	
	Bee.prototype.kill = function() {
		var b = this;
		clearInterval(this.interval);
		
		setTimeout(function() {
			b.$element.remove();
			delete b;
		}, this.options.interval + 1);
	}
	
//}