//=include lib/underscore.js
//=include lib/imagesLoaded.js


$(function() {
		
"use strict";
	var gallery = {
		obj: $('section'),
		length: $('section').length,
		title: $('#title'),
		pos: 0,
		menu: true,
		width: window.innerWidth,
		height: window.innerHeight - 100,
		sizes: [100,200,300,400,500],
		preload: null,
		time: {
			img: {
				gap: 500,
				each: 300,
				all: 300,
			},
			title: {
				gap: 300,
				leave: 500,
				enter: 500,
			},
			preload: 1000,
		}
	};

	//var width = $('#grid').width();
	//var height = $('#grid').height();
	
	function hideGallery(num,direction,callback) {
		var section = gallery.obj.eq(num);
		//.find('a').fadeOut().find('img').fadeOut();
		var data = section.data('gallery');
		var sWidth = data.grid[0];
		var sHeight = data.grid[1];
		var diag = getDiagonal(sWidth,sHeight,direction);
		var timeStep = gallery.time.img.all/(sWidth * sHeight);
		var aMargin = (direction=="left") ? "25%" : (direction=="right") ? "75%" : "50%";
		
		//section.find('a').removeClass('display');
		section.find('img').each(function(i) {
			$(this).removeClass('display').velocity({
				opacity:0,
				'max-width':'50%',
				'max-height':'50%',
				left:aMargin,
			},{
				duration: gallery.time.img.each,
				easing: [0.4,0,0.2,1],
				delay:parseInt(diag[i]*timeStep),
				complete: function(elements) {
					$(elements).parent().removeClass('display').hide();
				},
			});
		});
		if(callback && $.isFunction(callback)) {
			setTimeout(callback,gallery.time.img.each+gallery.time.img.all);
		}
		
		//var diag = getDiagonal(
	}
	
	function getGrid(length) {
		var bestHeight = 1,
			bestWidth = length,
			bestSize = Math.min(gallery.width/length,gallery.height);

		for(var i=2;i<=length;i++) {
			var width = parseInt(length/i) + ((length%i==0) ? 0 : 1);
			var size = Math.min(gallery.width/width,gallery.height/i);
			if(size > bestSize) {
				bestSize = size;
				bestHeight = i;
				bestWidth = width;
			}
		}
		return [bestWidth,bestHeight];
	}
	
	function layoutGallery(num) {
		var section = gallery.obj.eq(num),
			a = section.find('a'),
			//img = section.find('img'),
			length = a.length,
			size = (gallery.width/length);
		
		var sizeNum = getGrid(length);
		var sHeight = sizeNum[1];
		var sWidth = sizeNum[0];//(parseInt(length/sizeNum) + ((length%sizeNum==0) ? 0 : 1));
		//console.log('best fit '+sWidth+'x'+sHeight+' : '+size+'px img');
		var aWidth = gallery.width/sWidth;
		var aHeight = gallery.height/sHeight;
		var aSize = 100;
		for(var i=0;i<gallery.sizes.length;i++) {
			if(aWidth < gallery.sizes[i] && aHeight < gallery.sizes) break;
			else aSize = gallery.sizes[i];
		}
		
		section.data('gallery',{grid:sizeNum,size:aSize});
		//now you have the size, load the correct images
	}

	
	function loadGallery(num) {
		var section = gallery.obj.eq(num);
		var a = section.find('a');
		var data = section.data('gallery');
		var aSize = data.size;
		a.each(function() {
			var src = $(this).attr('href').replace(/^img\//,'');
			$(this).html('<img src="img/'+aSize+'/'+src+'">');
		});
		
	}
	
	function preloadGallery(num,depth) {
		var section = gallery.obj.eq(num);
		if(section.hasClass('loaded')) {
			console.log(num +' has already been preloaded');
			//if(depth<1 && num < gallery.length-1) preloadGallery(num+1,depth+1);
		} else {
			gallery.preload = setTimeout(function() {
				console.log('preloading '+num);
				layoutGallery(num);
				loadGallery(num);
				section.imagesLoaded().always(function() {
					console.log(num+' preloaded');
					section.addClass('loaded');
					//if(depth<1 && num < gallery.length-1) preloadGallery(num+1,depth+1);
				});
			},gallery.time.preload);
		}
	}

	function setTitle(num,direction) {
		var section = gallery.obj.eq(num);
		var title = gallery.title;
		gallery.title = section.find('h2');
		
		var titleWidth = title.width();
		var titleLeft = (direction=="right") ? gallery.width : -titleWidth;
		title.velocity({
			left:titleLeft+'px',
		},{
			duration:gallery.time.title.leave,
			easing: [0.4,0,1,1],
			complete: function(elements) {
				//$(elements).hide();
				$(elements).removeClass('display');
			},
		});
			
		var galleryTitleWidth = gallery.title.width();
		var galleryMiddle = (gallery.width-galleryTitleWidth)/2 - 2;
		var galleryLeft = (direction=="right") ? -galleryTitleWidth : gallery.width;
		console.log('galleryMiddle '+galleryTitleWidth+' : '+gallery.width+' = '+galleryMiddle);
		gallery.title.addClass('display').css({top:0,left:galleryLeft+'px',width:(galleryTitleWidth+4)+'px',opacity:1}).show().velocity({
			left:galleryMiddle+'px',
		},{
			duration:gallery.time.title.leave,
			delay:gallery.time.title.gap,
			easing: [0,0,0.2,1],
			complete: function(elements) {
				//$(elements).hide();
			},
		});
	
	/*
		setTimeout(function() {
			gallery.title.addClass('show '+direction);
		},500);

		title.removeClass('left right').addClass('hide '+direction);
		setTimeout(function() {
			title.hide();
		},1000);
		
	*/	
	}
	
	function setGallery(num,direction) {
		
		var section = gallery.obj.eq(num);
		if(!section.hasClass('loaded')) {
			if(gallery.preload) clearTimeout(gallery.preload);
			console.log('loading '+num);
			layoutGallery(num);
			loadGallery(num);
		} else {
			console.log(num + ' already loaded');
		}
		//$('#title').text(title);
		var a = section.find('a');
		var data = section.data('gallery');
		var sWidth = data.grid[0];
		var sHeight = data.grid[1];
		var diag = getDiagonal(sWidth,sHeight,direction);
		
		var timeStep = gallery.time.img.all/(sWidth * sHeight);
		
		//var aWidth = gallery.width/sWidth;
		//var aHeight = gallery.height/sHeight;	
		var aWidth = 100/sWidth;
		var aTop = 10000/gallery.height;
		var aHeight = (100-aTop)/sHeight;
		
		var aMargin = (direction=="left") ? "75%" : (direction=="right") ? "25%" : "50%";
		
		section.imagesLoaded()
		.progress(function() {

		
		}).always(function() {
			//console.log('always');
			section.addClass('loaded');
		a.each(function(i) {
			var left = i%sWidth;
			var top = parseInt(i/sWidth);
			
			var smallLeft = left*aWidth;
			var smallTop = aTop + top*aHeight;
			$(this).addClass('display').show().css({top:smallTop+'%',left:smallLeft+'%',width:aWidth+'%',height:aHeight+'%'});
			var aImg = $(this).find('img');
			//var aSrc = aImg.attr('src').replace(/^img\/100\//,'img/'+aSize+'/');
			aImg.css({
				opacity:0,
				'max-width':'50%',
				'max-height':'50%',
				left:aMargin,
			}).show().velocity({
				opacity:1,
				'max-width':'90%',
				'max-height':'90%',
				left:'50%',
			},{
				duration: gallery.time.img.each,
				easing: [0.4,0,0.2,1],
				delay:parseInt(diag[i]*timeStep),
			});
				
		});

		if(num < gallery.length-1) preloadGallery(num+1,0);
		
		});
		
	}
	
	$('a').on('click',function(e) {
		e.preventDefault();
	});

/*	
	var menuInit = false;
	function createMenu() {
		if(!menuInit)
		$('section h2').map(function() {
		if($(this).hasClass('converted'))
			return '<div class="line">'+$(this).html() + '</div>';
		else
			return '<div class="text">' + $(this).text() + '</div>';
	}).get().join('');

	console.log('menu '+menu);
	$('#menu').append(menu);
		
		if(!$('#menu').hasClass('converted')) {
			//check to see if all of the titles have been made
			
			$('section > h2:not(.converted)').handwriting({height:100});
		
			//now put them all in order
			$('section > h2').css({position:'relative',margin:'auto'});
		}
	}
*/

	//init menu
	
	//$('section h2:not(.converted)').handwriting({height:100,size:62}).addClass('converted');
	$('section').each(function(i) {
		var height = $(this).find('h2').height();
		$(this).css({height:height+'px'}).data('num',i);
	});
		
	//var menuOpen = false;
	$('section h2').on('click',function() {
		
		if(!$(this).hasClass('display')) {
		
			var offset = $(this).offset();
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			var top = (offset.top - scrollTop) + 'px';
			var left = (offset.left - scrollLeft) + 'px';

			gallery.title = $(this);
			//gallery.title.css({top:top,position:'fixed'});
			
			var galleryTitleWidth = gallery.title.width();
			var galleryMiddle = (gallery.width-galleryTitleWidth)/2 - 2;
			console.log('galleryMiddle '+galleryTitleWidth+' : '+gallery.width+' = '+galleryMiddle);
			var num = $(this).parent().data('num');
			gallery.title.addClass('display').css({top:top,left:left,width:(galleryTitleWidth+4)+'px'}).velocity({
				top: 0,
			},{
				duration:gallery.time.title.enter,
				easing: [0.4,0,0.2,1],
				complete: function(elements) {
					setGallery(num,"straight");
					gallery.pos = num;
					$('#pics').addClass('ondisplay');
				},
			});
			$('section h2:not(.display)').velocity({
				opacity:0
			},500);
			

			
		} else {
			//go back to menu
			var self = $(this);
			var parent = self.parent();
			var num = parent.data('num');
			$('#pics').removeClass('ondisplay');
			var offset = parent.offset();
			var top = offset.top;
			var vHeight = window.innerHeight;
			var scrollTop = 0;
			if(top > vHeight/2) {
				scrollTop = top - vHeight/2;
				top = vHeight/2;
			}
			self.velocity({
				top:top+'px',
			},{
				duration:500,
				easing: [0.4,0,0.2,1],
				complete: function(elements) {
					//$(elements).removeClass('display');
				},
			});
			hideGallery(num,"straight",function() {
				
				$(window).scrollTop(scrollTop);

				$('section h2:not(.display)').velocity({
					opacity:1
				},500);
				self.removeClass('display');
			});
			
			
		}
	});
	
	function getDiagonal(w,h,dir) {
		//create diagonal timing list
		var diag = new Array(w*h);
		var count = 0;
		//run along length, and do each diagonal
		for(var i=0;i<w;i++) {
			var len = (i+1 < h) ? i+1 : h;
			for(var j=0;j<len;j++) {
				var x = i-j;
				var y = j;
				var pos = (dir == 'right') ? y*w + x : y*w + (w-x-1);
				diag[pos] = count++;
			}
		}
		// now run the right hand side, to get the rest
		for(var i=1;i<h;i++) {
			var len = (w < h-i) ? w : h-i;
			for(var j=0;j<len;j++) {
				var x = w-1-j;
				var y = i+j;
				var pos = (dir == 'right') ? y*w + x : y*w + (w-x-1);
				diag[pos] = count++;				
			}
		}
		return diag;
	}
	
	//setGallery(0,"right");
/*
	$('#pics').on('click',function() {
		hideGallery(gallery.pos%gallery.length);
		gallery.pos++;
		setGallery(gallery.pos%gallery.length);
	});
*/

	$(window).on('resize',_.debounce(function() {
		$('section.loaded').removeClass('loaded');
		gallery.width = window.innerWidth;
		gallery.height = window.innerHeight - 100;
	},500));
	$('#next').on('click',_.debounce(function() {
		hideGallery(gallery.pos,"left");
		gallery.pos++;
		if(gallery.pos >= gallery.length) gallery.pos = 0;
		setTitle(gallery.pos,"left");		
		setTimeout(function() {
			setGallery(gallery.pos,"left");
		},gallery.time.img.gap);
	},500,true));

	
	
	$('#prev').on('click',_.debounce(function() {
		hideGallery(gallery.pos,"right");
		gallery.pos--;
		if(gallery.pos < 0) gallery.pos = gallery.length - 1;
		setTitle(gallery.pos,"right");		
		setTimeout(function() {
			setGallery(gallery.pos,"right");		
		},gallery.time.img.gap);
	},500,true));
	//setGrid($('

	
	
	
	
	
		
});