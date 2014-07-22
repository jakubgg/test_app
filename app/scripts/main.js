'use strict';

var speciallEffects = (function(){
	var main = document.getElementById('main-area');
	var newText = 'Unique.<br>Unforgetabble.<br>Untamed.';
	var exploreContainers = document.getElementsByClassName('explore-container');
	var logo = document.getElementById('brand-logo');
	var emblem = document.getElementById('spyker-emblem');

	var dust = document.createElement('div');
	dust.style.width = '69px';
	dust.style.height = '63px';
	dust.style.backgroundColor = 'transparent';
	dust.style.backgroundImage = 'url(images/dust-sprite.png)';
	dust.style.backgroundPosition = '-413px top';
	dust.style.position = 'absolute';
	dust.style.top = (logo.offsetTop+(logo.clientHeight /2))-32+'px';
	dust.style.left = logo.offsetLeft+logo.clientWidth+'px';
	dust.id = 'dust';

	var cover = document.createElement('div');
	cover.style.width = document.body.offsetHeight + 'px';
	cover.style.height = document.body.offsetHeight + 'px';
	cover.style.backgroundColor = 'rgba(0,0,0,0.5)';
	cover.style.position = 'absolute';
	cover.style.top = 0;
	cover.style.left = 0;
	cover.style.zIndex = '99';
	cover.id = 'cover';

	function vroomAnim (e) {
		var thisTween = null;
		// reset anim on Complete
		var resetTween = function () {
			thisTween.progress(0).pause();
			document.body.children[0].children[0].children[0].removeChild(dust);
			logo.addEventListener('mouseover', vroomAnim);
		};
		// Remove listener to avoid overlapping anims and logo creeping to the right
		logo.removeEventListener('mouseover', vroomAnim);
		// add sprite container to the document
		document.body.children[0].children[0].children[0].appendChild(dust);
		// start sprite animation
		TweenMax.fromTo(dust, 1, {backgroundPosition:'0 0'}, {backgroundPosition:'-413px 0', ease:SteppedEase.config(6)});
		// logo vrooms out of the screen
		thisTween = TweenMax.to(e.target, 1, {marginLeft:'-1000px', ease:Back.easeIn.config(1), onComplete: resetTween});
	}

	function rotateAnim (e){
		console.log('rotateAnim');
		var tw = null;
		var mouseOutHandler = function(){
			emblem.removeEventListener('mouseout', mouseOutHandler);
			tw.progress(0);
			tw.pause();
		};
		
		tw = TweenMax.to(e.target, 2, {rotation:720, ease:Circ.easeInOut, yoyo: true, repeat:-1});
		emblem.addEventListener('mouseout', mouseOutHandler);
	}

	function zoomAnim (e) {
		document.body.appendChild(cover);

		// Find container that will be animated (.explore-container) 
		// that is parent node of the click event target. 
		// Start tweening on success. 
		findParent(e.target, 'explore-container', function(animTarget){
			
			var coverClickHandler = function(){
				TweenMax.to(document.body, 0.5, {scale:1.0, ease:Power1.easeIn});
				TweenMax.to(animTarget, 0.5, {scale:1.0, ease:Power1.easeIn});
				document.body.removeChild(cover);
				animTarget.style.zIndex = '0';
				animTarget.addEventListener('click', zoomAnim);
			};
			// On 'Cover' click return to normal
			cover.addEventListener('click', coverClickHandler);
			// remove listener on animTarget to avoid invoking multiple 'Covers'
			animTarget.removeEventListener('click', zoomAnim);
			// animTarget needs z-index larger than the Cover.
			animTarget.style.zIndex = '100';
			// zoom out Body, zoom in animTarget	
			TweenMax.to(document.body, 1, {scale:0.8, ease:Power1.easeIn});
			TweenMax.to(animTarget, 1, {scale:1.4, ease:Power1.easeIn});

		});
	}

	function shakeAnim (e) {
		findParent(e.target, 'explore-container', function(animTarget){
			var tw = null;
			var mouseOutHandler = function(){
				animTarget.removeEventListener('mouseout', mouseOutHandler);
				tw.progress(0.5);
				tw.pause();
			};
			
			tw = TweenMax.fromTo(animTarget, 0.2, {rotation:-2},{rotation:2, ease:Linear.easeNone, yoyo: true, repeat:3, startAt:{rotation:0}, onComplete: mouseOutHandler});
			animTarget.addEventListener('mouseout', mouseOutHandler);
		});
	}

	/**
	 * Helper function - find parent node of a given child node
	 * @param  {Object} child  - child that will have its parent investigated
	 * @param  {[type]} parent - searched parent
	 * @callback - on success returns parent node.
	 * @return {Object}	if found return parent, otherwise empty object        
	 */
	function findParent (child, parent, callback) {
		var testObj = child.parentNode;
		var searched = new RegExp( parent,'g');
		var classToMatch = testObj.className;
		if (classToMatch.match(searched)){
			callback(testObj);
		}else{
			findParent(testObj, parent, callback);
		}
	}

	//Add event listeners and fire up auto animation(s).
	function init (){
		logo.addEventListener('mouseover', vroomAnim);
		emblem.addEventListener('mouseover', rotateAnim);

		for (var i=0; i<exploreContainers.length; i++) {
			exploreContainers[i].addEventListener('click', zoomAnim);
			exploreContainers[i].addEventListener('mouseover', shakeAnim);
		}

		TweenMax.to(main.children[0], 4, {text:{value:newText, delimiter:''}, ease:Power1.easeOut});
	}

	return {
		init : init
	};
})();


function DOMReady () {
	speciallEffects.init();
}


document.addEventListener('DOMContentLoaded',DOMReady);
