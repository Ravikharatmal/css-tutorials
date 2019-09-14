	/**
	 * This is where script start to run.
	 */	
	$(document).ready(function() {
		// Hide message at start
		$('#message').hide();
		// First load panel to show HTML code in UI.
		loadCodePanel();
		// Start animation from 0th element in animations array.
		// animate(0);
		
		// Load list of animations
		$('#sidebar').append('<a class="sidebarlink" ind="'+-1+'" href="#'+'All'+'">'+'All Attributes'+'</a><br/>');
		for(var i=0; i< animations_repo.length; i++){
			var anim = animations_repo[i];
			$('#sidebar').append('<a class="sidebarlink" style="color: blue;" ind="'+i+'" href="#'+anim.title+'">'+anim.title+'</a><br/>');
		}
		
		$('.sidebarlink').hover(function(event){
			$( this ).css('background-color','yellow');
			  
		},function(event){
			$( this ).css('background-color','white');
			  
		});
		
		$('.sidebarlink').click(function(event){
			var ind = $(this).attr('ind');
			console.log(ind);
			if(ind == -1){
				animations = animations_repo;
			}else{
			
			  animations = [animations_repo[ind]];
			}
			  animate(0);
			  
		}); 
		
	});

	/**
	 * This method loads or refreshes code panel with latest HTML of divs in
	 * demo.
	 */
	function loadCodePanel(attrIndex, codeheaderval, styleattr, styleval) {
		var codeString = $('#demodiv').html();
		
		var escapedCodeString = $("<div>").text(codeString).html();
		
		// console.log(escapedCodeString);
		
		escapedCodeString = highlightCSS(escapedCodeString, styleattr, styleval, true);
		
		if (attrIndex && animations[attrIndex].additional) {
			var adddiv;
			for (adddiv of animations[attrIndex].additional){
				console.log("Additional div = " + adddiv.divname);
				var addcss;
				for (addcss of adddiv.css){
					console.log("Additional css = " + addcss.attr + " = " + addcss.val);

					escapedCodeString = highlightCSS(escapedCodeString, addcss.attr, addcss.val);
				}
			}
		}
	
		escapedCodeString = highlightCode(escapedCodeString);

		if(codeheaderval){
			codeheaderval = codeheaderval + "<br/>";
		}
// $('#codeheader').html(codeheaderval);
		$('#codepaste').html(escapedCodeString);
	}
	
	/**
	 * This method highlights code syntax keywords to make it look like code.
	 */
	function highlightCode(escapedCodeString) {
	
		var codePrefix = "<strong><font color='blue' size='3'>";
		var codeSuffix = "</font></strong>";
		
		var codewords = ['div'];
		
		for(codeword of codewords){
		
			var regex = new RegExp('\\b' + codeword + '\\b', "g");
		
			escapedCodeString = escapedCodeString.replace(regex, codePrefix+codeword+"</font></strong>");
		
		}
		escapedCodeString = escapedCodeString.replace(/&lt;/g, codePrefix+"&lt;"+codeSuffix);
		escapedCodeString = escapedCodeString.replace(/&gt;/g, codePrefix+"&gt;"+codeSuffix);
		escapedCodeString = escapedCodeString.replace(/"/g, codePrefix+'"'+codeSuffix);
		escapedCodeString = escapedCodeString.replace(/id\=/g,codePrefix+'id\='+codeSuffix);
		escapedCodeString = escapedCodeString.replace(/style\=/g, codePrefix+'style\='+codeSuffix);

		
		return escapedCodeString;
		
	}
	
	/**
	 * This method highlights CSS class & values which are to be shown to user
	 * as part of this demo.
	 */
	function highlightCSS(escapedCodeString, styleattr, styleval, animatingCss){
		
		var color = "crimson";
		if(animatingCss){
			color = "red";
		}
		
		var cssconcat = styleattr+": " +styleval ;
		escapedCodeString = escapedCodeString.replace( new RegExp('\\b' + cssconcat + '\\b', "g"),"<strong><font color='"+color+"' size='4'>"+cssconcat+"</font></strong>");
		return escapedCodeString; 
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
		
		loadCodePanel(attrIndex,codeheaderval, styleattr, styleval);
	}
	
	function animationStepProgressPercentage(attrIndex){
		var perc = ((attrIndex + 1)/animations.length)*100;
		console.log("Percentage = " + perc);
		return perc;
	}

	/**
	 * Main animation method.
	 */
	function animate(attrIndex) {		
		
		if (animations[attrIndex]) {
			// Display description message for animation about to start.
			$('#message').show();
			console.log("Message " + animations[attrIndex].title + " - " + animations[attrIndex].desc);
			$('#codeheader').html("<font color='green' size='4'><br/><strong>Attribute(s): </strong>"+animations[attrIndex].title+"<br/><strong>Change:</strong> "+animations[attrIndex].desc+"</font><br/>");
			$('#message').text(animations[attrIndex].title);
			
			// $('#progressbar').val(animationStepProgressPercentage(attrIndex));

			
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