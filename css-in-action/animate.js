	// Mills to wait between CSS value changes. Lower value means faster animation.
	var animationSpeed = 50;
	// Mills to wait betwen CSS values animation.
	var animationSpeedForValues = 2000;
	// Message dsiplay time in mills
	var messageDelay = 5000;

	// Default value to increment
	var defaultIncrement = 1;
	// stop flag
	var stopFlag = false;
	
	// Comment below to run on all console logs
	// console.log = function() {};


	/**
	 * This is where script start to run.
	 */	
	$(document).ready(function() {
		
		setDemoCodeAsPerSelection();
		
		// Hide message at start
		$('#message').hide();
		$('#cssValueMessage').hide();
		// $('#popupmessage').hide();
		hideToolTips()
		// First load panel to show HTML code in UI.
		loadCodePanel();
			
		setupSideBar();

		animateFromHashUrlIfPresent();

	});
	
	function animateFromHashUrlIfPresent(isReplay){
		// Start animation from hash in URL
		if(window.location.hash){
			var hash = window.location.hash;
			var id = hash.replace('#','');
			animations = animations_repo.filter(function(a){
				return a.id == id; 
			});	
			expandAnimationsArray();
		 animate(0,isReplay);
		}
	}
	
	function setDemoCodeAsPerSelection(){
		
		console.log("Demo dropdown selected!");
		
		if(document.getElementById("divSelection")){
			console.log("Demo dropdown selected = " + document.getElementById("divSelection").value);

			if (document.getElementById("divSelection").value == "single"){
				console.log("Setting single demo code");
				$('#demodiv').html(html_demo_single_div());
			}     
			else if (document.getElementById("divSelection").value == "side-side"){
				console.log("Setting side by side demo code");
				$('#demodiv').html(html_demo_div_side_by_side());
			}     
			else if (document.getElementById("divSelection").value == "inside"){
				console.log("Setting div inside div demo code");
				$('#demodiv').html(html_demo_div_inside_div());
			}else if (document.getElementById("divSelection").value == "three-side-side"){
				console.log("Setting three side by side demo code");
				$('#demodiv').html(html_demo_three_div_side_by_side());
			}
		} else {
	    	$('#demodiv').html(html_demo_div_side_by_side());
	    }	
		
		loadCodePanel();
	}
	
	/**
	 * Add items to side bar from animations repository & add click hover events
	 * etc. for links.
	 */
	function setupSideBar(){
		// Load list of animations
		$('#sidebar').append(html_sidebar_link_div(-1,'PapayaWhip','All','All Attributes'));
		
		for(var i=0; i< animations_repo.length; i++){
			var anim = animations_repo[i];
			var backColor = "PapayaWhip";
			if(i%2 == 0){
				backColor = "LightBlue";
			}
			
			$('#sidebar').append(html_sidebar_link_div(i,backColor,anim.id,anim.title));
		}
		
		$('.sidebarlinkdiv').hover(function(event){
			$( this ).css('background-color','khaki');
			  
		},function(event){
			var ind = $( this ).attr('ind');
			var backColor = "PapayaWhip";
			if(ind%2 == 0){
				backColor = "LightBlue";
			}
			// console.log("backColor = " + backColor);
			$( this ).css('background-color',backColor);
			  
		});
		
		$('.sidebarlink').on('click tap',function(event){
			var ind = $(this).attr('ind');
			console.log(ind);
			if(ind == -1){
				animations = animations_repo;
			}else{
			
			  animations = [animations_repo[ind]];
			}
			console.log("Animations = " + JSON.stringify(animations));
			
			resetStyling();
			expandAnimationsArray();
			  animate(0);
			  
		}); 
		
		
		$('#stopButton').on('click tap',function(event){
				stop();			  
		}); 
		
	}

	/**
	 * This method loads or refreshes code panel with latest HTML of divs in
	 * demo.
	 */
	function loadCodePanel(attrIndex, styleattr, styleval) {
		var codeString = $('#demodiv').html();
		
		var escapedCodeString = $("<div>").text(codeString).html();
		
		// console.log(escapedCodeString);
		
		console.log("Highlight css = " + styleattr + " = " + styleval);
		escapedCodeString = highlightCSS(escapedCodeString, styleattr, styleval, true);
		
		console.log("loadCodePanel attrIndex = -" + attrIndex+"-");

		if (attrIndex != null && animations[attrIndex].additional) {
			console.log("loadCodePanel attrIndex = " + attrIndex + " animations[attrIndex] = " + JSON.stringify(animations[attrIndex]));
			var adddiv;
			for (adddiv of animations[attrIndex].additional){
				console.log("Additional div = " + adddiv.divname);
				var addcss;
				for (addcss of adddiv.css){
					console.log("Highlight Additional css = " + addcss.attr + " = " + addcss.val);

					escapedCodeString = highlightCSS(escapedCodeString, addcss.attr, addcss.val);
				}
			}
		}
	
		escapedCodeString = highlightCode(escapedCodeString);

		$('#codepaste').html(escapedCodeString);
	}
	
	/**
	 * This method highlights code syntax keywords to make it look like code.
	 */
	function highlightCode(escapedCodeString) {
		
		escapedCodeString = escapedCodeString.replace(/"/g, html_highlight_code('"'));
		escapedCodeString = escapedCodeString.replace(/&lt;/g,html_highlight_code("&lt;") );
		escapedCodeString = escapedCodeString.replace(/&gt;/g,html_highlight_code("&gt;") );	
		escapedCodeString = escapedCodeString.replace(/id\=/g,html_highlight_code('id\=') );
		escapedCodeString = escapedCodeString.replace(/style\=/g,html_highlight_code('style\=')  );
		
		var codewords = ['div'];
		
		for(codeword of codewords){
		
			var regex = new RegExp('\\b' + codeword + '\\b', "g");
		
			escapedCodeString = escapedCodeString.replace(regex, html_highlight_code(codeword));
		
		}
		

		
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
		
		var cssconcat = styleattr+": " +styleval;
		console.log(" highlightCSS cssconcat -" + cssconcat+"-");
		escapedCodeString = escapedCodeString.replace( new RegExp( cssconcat , "g"),"<strong><font color='"+color+"' >"+cssconcat+"</font></strong>");
		return escapedCodeString; 
	}

	/**
	 * Apply given style along with additional CSS for given animation step.
	 */
	function applyCSS(attrIndex, styleattr, styleval, template) {
		console.log(animations[attrIndex].divname);
		console.log('Applying attrIndex ' + attrIndex + ' styleattr '
				+ styleattr + ' styleval ' + styleval + ' template ' + template);
		
		clearToolTipMessages();
		
		var finalStyleVal = styleval;
		if(template){
			finalStyleVal = resolveTemplate(template, styleval);
			console.log("finalStyleVal = " + finalStyleVal);
		}		
		setToolTipMessage(animations[attrIndex].divname,( "<strong>"+styleattr+": "+finalStyleVal+"</strong><br/>"));
		
// var additionalPopupMessage = "";
		if (animations[attrIndex].additional) {			
			
			var adddiv;
			for (adddiv of animations[attrIndex].additional){
				console.log("Additional div = " + adddiv.divname + " | " + adddiv.removeAttr);
				
				if(adddiv.removeAttr){
					var remAttr;
					for (remAttr of adddiv.removeAttr){
						console.log(" Removing attr = " + adddiv.divname + " = " + remAttr);
						$('#' + adddiv.divname).css(remAttr,"");
					}
				}
				
				var addcss;
				for (addcss of adddiv.css){
					
// if(animations[attrIndex].divname == adddiv.divname){
// additionalPopupMessage = additionalPopupMessage + addcss.attr + ": " +
// addcss.val +"; ";
// }else{
// window['additionalPopupMessage'+adddiv.divname] =
// window['additionalPopupMessage'+adddiv.divname] + addcss.attr + ": " +
// addcss.val +"; ";
// }
					setToolTipMessage(adddiv.divname,( addcss.attr + ": " + addcss.val +"; "));
					
					
					console.log("Additional css = " + addcss.attr + " = " + addcss.val);
					$('#' + adddiv.divname).css(
							addcss.attr,
							addcss.val);
				}
			}
		}
		
		console.log('Applying CSS div ' + ('#' + animations[attrIndex].divname) + ' styleattr '
				+ styleattr + ' finalStyleVal ' + finalStyleVal );
		$('#' + animations[attrIndex].divname).css(styleattr, finalStyleVal);
		
		// Popup message
// $('#popupmessage').html("<strong>"+styleattr+": "+finalStyleVal+
// "</strong><br/>"+ additionalPopupMessage);
// var offset = $('#' + animations[attrIndex].divname).offset();
// console.log('Offset = ' + offset.top + " " + offset.left + " "
// + $('#' + animations[attrIndex].divname).outerHeight(false) + " "
// + $('#' + animations[attrIndex].divname).outerWidth(false) + " " +
// $('#popupmessage').outerWidth(false));
// var popupTop = offset.top+$('#' +
// animations[attrIndex].divname).outerHeight(false) + 2;
// var popupLeft = offset.left+$('#' +
// animations[attrIndex].divname).outerWidth(false)-$('#popupmessage').outerWidth(false);
// console.log('Offset popupmessage = ' + popupTop + " " + popupLeft);
// $('#popupmessage').offset({ top: popupTop, left: popupLeft});
		
		positionAllToopTips();
		// setToolTipMessage(animations[attrIndex].divname,
		// "<strong>"+styleattr+": "+finalStyleVal+ "</strong><br/>"+
		// additionalPopupMessage);
		
		
		loadCodePanel(attrIndex, styleattr, finalStyleVal);
	}
	
	function setToolTipMessage(divname, message){
		console.log("setToolTipMessage - " + divname  + " " + message);
//		if(append){
			var existingMessage = $('#popupmessage'+divname).html();
			console.log("setToolTipMessage existingMessage " +divname + " "+ existingMessage);
			$('#popupmessage'+divname).html(existingMessage+message);
//		}else{
//			$('#popupmessage'+divname).html(message);
//		}
	}
	
	function positionToolTipMessage(divname){
		// Popup message
		
		var offset = $('#' + divname).offset();
		if(offset){
		var popupMessageWidth = ($('#popupmessage'+divname).outerWidth(false)||0);
		console.log('Offset = ' + divname + ' ' + offset.top + " " + offset.left + " "
				+ $('#' + divname).outerHeight(false) + " " 
				+ $('#' + divname).outerWidth(false)	+ " " +  popupMessageWidth);
		console.log($('#popupmessage'+divname).outerWidth(false));
		var popupTop = offset.top+$('#' + divname).outerHeight(false) + 2;
		var popupLeft = offset.left+$('#' + divname).outerWidth(false)-popupMessageWidth;
		console.log('Offset popupmessage = '+ ' ' + divname +" " + popupTop + " " + popupLeft);
		$('#popupmessage'+divname).offset({ top: popupTop, left: popupLeft});
	}
	}
	
	function positionAllToopTips(){
		positionToolTipMessage('firstdiv');
		positionToolTipMessage('seconddiv');
		positionToolTipMessage('thirddiv');
	}
	
	function hideToolTips(){
		clearToolTipMessages();
		$('#popupmessagefirstdiv').hide();
		$('#popupmessageseconddiv').hide();
		$('#popupmessagethirddiv').hide();
	}
	
	function clearToolTipMessages(){
		$('#popupmessagefirstdiv').text(' ');
		$('#popupmessageseconddiv').text(' ');
		$('#popupmessagethirddiv').text(' ');
	}
	
	function showToolTips(){
		$('#popupmessagefirstdiv').show();
		$('#popupmessageseconddiv').show();
		$('#popupmessagethirddiv').show();
	}
	
	function resolveTemplate(template, val){
		return eval('`'+template+'`');
	}
	
	function animationStepProgressPercentage(attrIndex){
		var perc = ((attrIndex + 1)/animations.length)*100;
		console.log("Percentage = " + perc);
		return perc;
	}
	
	/**
	 * This method checks if there are any side specific CSS properties present
	 * i.e. ones which have variations of left right bottom top. If yes, then it
	 * will add them as separate animation object in animations array for all
	 * side variations so that they will also play in animations.
	 */
	function expandAnimationsArray(){
		var sideVariations = ['left','right','top','bottom'];
	// var unitVariations = ['px','%'];
		var tempAnimatons = [];
		var tempIndex = 0;
		for(var i=0;i< animations.length; i++){			
			
			if(animations[i].changes){
			
				for( change of animations[i].changes){
					
					tempAnimatons[tempIndex] = $.extend(true, {}, animations[i]);
					delete tempAnimatons[tempIndex].changes;
				
					console.log("setting main unit : "  + change.unit + " tempIndex = " + tempIndex 
							+ " change.min " + change.min + " change.max "+change.max);
					tempAnimatons[tempIndex].attr = change.attr;
					tempAnimatons[tempIndex].animationSpeed = change.animationSpeed;
					
					tempAnimatons[tempIndex].unit = change.unit;
					tempAnimatons[tempIndex].template = change.template;
					tempAnimatons[tempIndex].min = change.min;
					tempAnimatons[tempIndex].max = change.max;					
					tempAnimatons[tempIndex].increment = change.increment;
					
					// If specific additional property given then override
					// global with this specific.
					if(change.additional){
						delete tempAnimatons[tempIndex].additional;
						tempAnimatons[tempIndex].additional = change.additional;
					}
					
					tempAnimatons[tempIndex].values = change.values;
					
					tempIndex++;
				
					if(change.sideSpecific == true){
						
						for(side of sideVariations){
							var newAnim = $.extend(true, {}, animations[i]);
							newAnim.id = newAnim.id + "-" + side;
							newAnim.title = newAnim.title + " (" + side + ")";
							newAnim.attr = change.attr + "-" + side;						
							newAnim.sideSpecific = false;
							console.log("setting sideSpecific unit : "  + change.unit + " tempIndex = " + tempIndex);
							newAnim.unit = change.unit;
							newAnim.template = change.template;
							newAnim.min = change.min;
							newAnim.max = change.max;
							newAnim.animationSpeed = change.animationSpeed;
							newAnim.increment = change.increment;
							
							// If specific additional property given then
							// override
							// global with this specific.
							if(change.additional){
								delete newAnim.additional;
								newAnim.additional = change.additional;
							}

							tempAnimatons[tempIndex] = newAnim;
							tempIndex++;
						}
					}
				}
			}/*
				 * else{
				 * 
				 * tempAnimatons[tempIndex] = $.extend(true, {}, animations[i]);
				 * delete tempAnimatons[tempIndex].changes;
				 * 
				 * tempIndex++; }
				 */
		}
		console.log(JSON.stringify(tempAnimatons))
		animations = tempAnimatons;
	}

	/**
	 * Main animation method.
	 */
	function animate(attrIndex, isReplay) {		
		
		if (animations[attrIndex] && !isStop()) {	
			
			if(animations[attrIndex] && !isReplay){
				console.log("Default demo code = " + animations[attrIndex].defaultDemo);
				$("#divSelection").val(animations[attrIndex].defaultDemo);
				setDemoCodeAsPerSelection();
			}
			
			// Display description message for animation about to start.
			var message = prepareMessageFlash(attrIndex);
			$('#message').html(message);
			$('#message').show();
			console.log("Message " + animations[attrIndex].title + " - " + animations[attrIndex].desc);
			
			$('#codeheader').html(html_code_header(animations[attrIndex].title, animations[attrIndex].desc));
			
			// Keep showing message for some time & then start animation.
			setTimeout(function() {
				$('#message').hide();
				animateStart(attrIndex, isReplay);
			}, messageDelay);
			
		} else {
			resetStop();
			console.log("Completed !");
		}

	}
	
	function prepareMessageFlash(attrIndex){
		var message = animations[attrIndex].title;
		message = message + " - " + animations[attrIndex].attr;
		message = message + (animations[attrIndex].unit ? ( " (" + animations[attrIndex].unit + ")") : "");
		return html_flash_screen(animations[attrIndex].divname,animations[attrIndex].title, animations[attrIndex].desc, animations[attrIndex].attr, animations[attrIndex].unit);
	}
	
	function animateStart(attrIndex, isReplay){
		// $('#popupmessage').show();
		showToolTips();
		var styleattr = animations[attrIndex].attr;
		if (styleattr) {
			console.log("start changing up " + styleattr);
			if(animations[attrIndex].values){
				animateValues(attrIndex, 0, isReplay);
			} else{
			animateup(attrIndex, animations[attrIndex].min, isReplay);
			}
		} else {
			// $('#popupmessage').hide();
			hideToolTips();
			console.log("Completed !");
		}
	}
	
	function animateValues(attrIndex, cssValIndex, isReplay){
		console.log("CSS VAL animate = " + animations[attrIndex].values[cssValIndex]);
			if(animations[attrIndex].values[cssValIndex] && !isStop()){
				var styleattr = animations[attrIndex].attr;
				var cssVal = animations[attrIndex].values[cssValIndex];
				
				applyCSS(attrIndex, styleattr, cssVal);
				setTimeout(function() {	// $('#cssValueMessage').show();
					// $('#cssValueMessage').text(styleattr + " = " + cssVal);
					// console.log("CSS Val message = " + styleattr + " = " +
					// cssVal);
				animateValues(attrIndex, cssValIndex+1, isReplay)
				}, animationSpeedForValues);
			} else{
				
				setTimeout(function() {
					$('#cssValueMessage').hide();
// $('#popupmessage').text('');
// $('#popupmessage').hide();
					hideToolTips();
					console.log("Completed values !");
					resetStyling();
					animate(attrIndex + 1, isReplay);
				}, animationSpeedForValues);				
			}
			
	}
	
	/**
	 * Animate with values growing up by 1 each time.
	 */
	function animateup(attrIndex, start, isReplay) {
		
		if(isStop()){
			resetStop();
			return;
		}
		
		console.log("UP start " + start + " animations[attrIndex].max " + animations[attrIndex].max + " condition " +(start < animations[attrIndex].max) );
		if (start < animations[attrIndex].max) {
			
			var currentAnimationSpeed = animations[attrIndex].animationSpeed ? animations[attrIndex].animationSpeed : animationSpeed;
			var currentIncrement = animations[attrIndex].increment ? animations[attrIndex].increment : defaultIncrement;
			var currentStart = Number((currentIncrement < 1) ? start.toFixed(1) : start);
			
			console.log("UP currentAnimationSpeed " + currentAnimationSpeed + " currentIncrement " + currentIncrement + " currentStart " + currentStart);
			
			setTimeout(function() {
				var styleattr = animations[attrIndex].attr;
				var styleval = (currentStart + animations[attrIndex].unit) + animations[attrIndex].suffix;
				console.log("changing up " + styleattr + " to " + styleval);
				applyCSS(attrIndex, styleattr, styleval, animations[attrIndex].template);
				animateup(attrIndex, currentStart + currentIncrement, isReplay);
			}, currentAnimationSpeed);
		} else {
			var styleattr = animations[attrIndex].attr;
			console.log("start changing down " + styleattr);
			animatedown(attrIndex, animations[attrIndex].max,
					animations[attrIndex].min, isReplay);
		}
	}

	/**
	 * Animate with values reducing down by 1 each time.
	 */
	function animatedown(attrIndex, start, min,isReplay) {
		if(isStop()){
			resetStop();
			return;
		}
		if (start >= min) {
			
			var currentAnimationSpeed = animations[attrIndex].animationSpeed ? animations[attrIndex].animationSpeed : animationSpeed;
			var currentIncrement = animations[attrIndex].increment ? animations[attrIndex].increment : defaultIncrement;
			var currentStart = Number((currentIncrement < 1) ? start.toFixed(1) : start);
			
			console.log("DOWN currentAnimationSpeed " + currentAnimationSpeed + " currentIncrement " + currentIncrement + " currentStart " + currentStart);

			setTimeout(function() {
				var styleattr = animations[attrIndex].attr;
				var styleval = (currentStart + animations[attrIndex].unit) + animations[attrIndex].suffix;
				console.log("changing down " + styleattr + " to " + styleval);
				applyCSS(attrIndex, styleattr, styleval, animations[attrIndex].template);
				animatedown(attrIndex, currentStart - currentIncrement, min, isReplay);
			}, currentAnimationSpeed);
		} else {
// $('#popupmessage').text('');
// $('#popupmessage').hide();
			hideToolTips();
			resetStyling();
			animate(attrIndex + 1, isReplay);
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
	
	function isStop(){
				console.log("STOP FLAG CHECK ------------ ! - " + stopFlag);
				return stopFlag;
	}
	
	function stop(){
		stopFlag = true;
		console.log("STOP FLAG ------------ ! - " + stopFlag);
	}
	
	function resetStop(){
		stopFlag = false;
		console.log("STOP FLAG RESET ------------ ! - " + stopFlag);
	}
	
	function html_sidebar_link_div(indexOfLink, backColor,idOfLink, titleOfLink){
		return `<div class="sidebarlinkdiv" ind="${indexOfLink}" style=" margin: 0px; padding: 10px 0px 0px 10px;  background-color: ${backColor};"><a class="sidebarlink" style="color: blue; display: block;" ind="${indexOfLink}" href="#${idOfLink}">${titleOfLink}</a><div>
				 <br/>`
	}
	
	function html_code_header(title,desc){
		return `<font color='green'><br/><strong>CSS Property(s): </strong>${title}&emsp;
				<br/><strong>In Action: </strong>${desc}</font><br/>`
	}
	
	function html_demo_single_div(){
		return `
<div
			id="firstdiv"
			style="border: 4px solid; border-color: blue;">
This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. 
</div>`;
	}
	
	
	function html_demo_div_side_by_side(){
		return `
<div
			id="firstdiv"
			style="border: 4px solid; border-color: blue;">
This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. 
</div>

<div
	id="seconddiv"
	style="border: 4px solid; border-color: red;">
This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV.  
</div>`;
	}
	
	function html_demo_three_div_side_by_side(){
		return `
<div
			id="firstdiv"
			style="border: 4px solid; border-color: blue;">
This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. 
</div>

<div
	id="seconddiv"
	style="border: 4px solid; border-color: red;">
This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV.  
</div>

<div
	id="thirddiv"
	style="border: 4px solid; border-color: green;">
This is the content of the THIRD-DIV. This is the content of the THIRD-DIV. This is the content of the THIRD-DIV. This is the content of the THIRD-DIV. This is the content of the THIRD-DIV. This is the content of the THIRD-DIV. This is the content of the THIRD-DIV.  
</div>
`;
	}	
	
	function html_demo_div_inside_div(){
		return `
<div
			id="firstdiv"
			style="border: 4px solid; border-color: blue;">
This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. This is the content of the FIRST-DIV. 
	<div
		id="seconddiv"
		style="border: 4px solid; border-color: red;">
		This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV. This is the content of the SECOND-DIV.  
	</div>
</div>
`;
	}
	
	function html_highlight_code(code){
		return `<strong><font color='blue'>${code}</font></strong>`;
	}
	
	function html_flash_screen(divname,title,desc, attr, unit){
		return `<h2 align="center">${title}</h2><!--<h5 align="center">(${desc})</h5>--><span style="font-size:20"><strong>CSS Property:</strong> ${attr} ${unit ? '<br/><strong>Unit: </strong>' + unit : ''}<br/><strong>Div to apply:</strong> ${divname}</span>`;
	}
	