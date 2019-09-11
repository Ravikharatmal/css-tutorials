	/**
	 * This is where script start to run.
	 */	
	$(document).ready(function() {
		// Hide message at start
		$('#message').hide();
		// First load panel to show HTML code in UI.
		loadCodePanel();
		// Start animation from 0th element in animations array.
		animate(0);
	});

	/**
	 * This method loads or refreshes code panel with latest HTML of divs in
	 * demo.
	 */
	function loadCodePanel(codeheaderval, styleattr, styleval) {
		var codeString = $('#demodiv').html();

		if(codeheaderval){
			codeheaderval = codeheaderval + "<br/>";
		}
		$('#codeheader').html(codeheaderval);
		$('#codepaste').text(codeString);
	}

	/**
	 * Apply given style along with additional CSS for given animation step.
	 */
	function applyCSS(attrIndex, styleattr, styleval) {
		console.log(animations[attrIndex].divname);
		console.log('Applying attrIndex ' + attrIndex + ' styleattr '
				+ styleattr + ' styleval ' + styleval);
		
		var codeheaderval = "<ul>Change: <br/><ul><li>"+animations[attrIndex].divname+": "+styleattr + " = " + styleval  +"</li>";
				
		$('#' + animations[attrIndex].divname).css(styleattr, styleval);
		if (animations[attrIndex].additional) {
			var adddiv;
			for (adddiv of animations[attrIndex].additional){
				console.log("Additional div = " + adddiv.divname);
				var addcss;
				for (addcss of adddiv.css){
					
					codeheaderval = codeheaderval + "<li>"+adddiv.divname+": " + addcss.attr + " = " + addcss.val + "</li>";
					
					console.log("Additional css = " + addcss.attr + " = " + addcss.val);
					$('#' + adddiv.divname).css(
							addcss.attr,
							addcss.val);
				}
			}
		}
		
		codeheaderval = codeheaderval + "</ul>Code:</ul>"
		
		loadCodePanel(codeheaderval, styleattr, styleval);
	}

	/**
	 * Main animation method.
	 */
	function animate(attrIndex) {		
		
		if (animations[attrIndex]) {
			// Display description message for animation about to start.
			$('#message').show();
			console.log("Message " + animations[attrIndex].desc);
			$('#message').text(animations[attrIndex].desc);
			
			// Keep showing message for some time & then start animation.
			setTimeout(function() {
				$('#message').hide();
				animateStart(attrIndex);
			}, messageDelay);
			
		} else {
			console.log("Completed !");
		}

	}
	
	function animateStart(attrIndex){
		var styleattr = animations[attrIndex].attr;
		if (styleattr) {
			console.log("start changing up " + styleattr);
			animateup(attrIndex, animations[attrIndex].min);
		} else {
			console.log("Completed !");
		}
	}
	
	/**
	 * Animate with values growing up by 1 each time.
	 */
	function animateup(attrIndex, start) {
		if (start < animations[attrIndex].max) {
			setTimeout(function() {
				var styleattr = animations[attrIndex].attr;
				var styleval = (start + 'px') + animations[attrIndex].suffix;
				console.log("changing up " + styleattr + " to " + styleval);
				applyCSS(attrIndex, styleattr, styleval);
				animateup(attrIndex, start + 1);
			}, animationSpeed);
		} else {
			var styleattr = animations[attrIndex].attr;
			console.log("start changing down " + styleattr);
			animatedown(attrIndex, animations[attrIndex].max,
					animations[attrIndex].min);
		}
	}

	/**
	 * Animate with values reducing down by 1 each time.
	 */
	function animatedown(attrIndex, start, min) {
		if (start >= min) {
			setTimeout(function() {
				var styleattr = animations[attrIndex].attr;
				var styleval = (start + 'px') + animations[attrIndex].suffix;
				console.log("changing down " + styleattr + " to " + styleval);
				applyCSS(attrIndex, styleattr, styleval);
				animatedown(attrIndex, start - 1, min);
			}, animationSpeed);
		} else {
			resetStyling();
			animate(attrIndex + 1);
		}
	}
	
	function resetStyling(){
		if (resetStyle) {
			var adddiv;
			for (adddiv of resetStyle.additional){
				console.log("RESETTING div = " + adddiv.divname);
				$('#' + adddiv.divname).removeAttr( 'style' );
				var addcss;
				for (addcss of adddiv.css){
									
					console.log("RESETTING css = " + addcss.attr + " = " + addcss.val);
					$('#' + adddiv.divname).css(
							addcss.attr,
							addcss.val);
				}
			}
		}
	}