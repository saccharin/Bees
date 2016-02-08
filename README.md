# Bees

Want to add a swarm of insects to an element? (Who doesn't, right?). Then run the following code:


		<button id="bees">Danger! Bees!</button>
		
		<script>
		$("#bees").click(function(e) {
			$(this).swarm().data("swarm").execute();
		});
		</script>
		

