/* 
 * Copyright (c) 2010 Vivotek Inc. All rights reserved.
 *
 * +-----------------------------------------------------------------+
 * | THIS SOFTWARE IS FURNISHED UNDER A LICENSE AND MAY ONLY BE USED |
 * | AND COPIED IN ACCORDANCE WITH THE TERMS AND CONDITIONS OF SUCH  |
 * | A LICENSE AND WITH THE INCLUSION OF THE THIS COPY RIGHT NOTICE. |
 * | THIS SOFTWARE OR ANY OTHER COPIES OF THIS SOFTWARE MAY NOT BE   |
 * | PROVIDED OR OTHERWISE MADE AVAILABLE TO ANY OTHER PERSON. THE   |
 * | OWNERSHIP AND TITLE OF THIS SOFTWARE IS NOT TRANSFERRED.        |
 * |                                                                 |
 * | THE INFORMATION IN THIS SOFTWARE IS SUBJECT TO CHANGE WITHOUT   |
 * | ANY PRIOR NOTICE AND SHOULD NOT BE CONSTRUED AS A COMMITMENT BY |
 * | VIVOTEK INC.                                                    |
 * +-----------------------------------------------------------------+
 *
 * Date: 2010-11-18 11:00:24
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.emap: create emap block
 *
 */

;(function($) {
	$emap = $.widget("naxx.emap", {	//integrate with mouse event widget
		options : {
			index: 0,
			map_path: '',
			saved: null,
			currentStream: 3,
			maxZoomer: 300,
			scale: 0,
			layout: 'fixed',
			viewwidth: 160,
			viewheight: 120,
			salute: false,
			turn: false, //自動翻轉
			rotate: false //自動旋轉
		},
		
		clicking: false,
		object: {
			$view: null,
			$map: null,
			$btnfront: null,
			$btnback: null,
			$btnleft: null,
			$btnright: null,
			$btnup: null,
			$btndown: null,
			$minimap: null
		},
		tlwh: [],
		camera: [],
		connector: [],
		color: [],
		emapOffset: {top: 0, left: 0, width: 0, height: 0},
		three: {
			particle1: null,
			light1: null,
			theta: 275,
			alpha: null,
			camera: null,
			stats: null,
			scene: null,
			renderer: null,
			mesh: null,
			map: null,
			viewcell: [],
			ray: null,
			projector: null,
			screen2D: null,
			screen3D: null,
			mouse2D: null,
			mouse3D: null
		},

		/*選擇Emap*/
		_init : function(){
			var self = this;
			var element = $(this.element);
			if(self.options.view != null)
			{
				self.object.$view.each(function(index){
					$(this).view(self.options.view[index]);
				});
			}
			if (self.options.map_path == ''){
				self.object.$map.children('img').attr('src', 'images/blank.png');
				self.object.$minimap.find('.miniback').attr('src', 'images/blank.png');
			}
			else
			{
				self.object.$map.children('img').error(function(){$(this).attr('src', 'images/blank.png');}).attr('src', 'images/1.jpg');
				self.object.$minimap.find('.miniback').error(function(){$(this).attr('src', 'images/blank.png');}).attr('src', 'images/1.jpg');
			}
            this.wheel();
		},

		removeAllCameras: function(){
			var self = this, element = $(this.element);
			for(var i = 0; i < $.naxx.capability.encoder; i++)
			{
				self.removeView(i);
			}
		},

		removeView: function(channel){
			var self = this, element = $(this.element);
			self.options.view[channel].left = '-100%';
			self.options.view[channel].top = '-100%';
			self.options.view[channel].width = '0%';
			self.options.view[channel].height = '0%';
			var css = self.options.view[channel];
			delete css['content'];
			delete css['type']; //for ie
			self.object.$view.eq(channel).view('option', css).hide();
			$(':naxx-panel').panel('editmode');
		},
		
		/*Overriding initial function*/
		_create : function() {
			var self = this, element = $(this.element);
			element.addClass('vision emap').append('<div class="emap emapback"><img class="emap" src="'+this.options.map_path+'" /></div>');

    		/*create line blocks*/
			self.object.$map = element.find('.emapback');
    		
    		for (var i = 0; i < $.naxx.capability.encoder; i++)
    		{
				$('<div class="view emap active"></div>').view({content: i, type: 'emap', width: '10%', height: '10%'}).hide().appendTo(self.object.$map);//;.append('<div class="emap emapcamera" cid='+i+' vid='+i+' ip="" model=""><span class="camimg" channel='+i+'></span><span class="cid trans75">'+(i+1)+'</span></div>');
			}

    		self.object.$view = $(':naxx-view').draggable({
				cursor: 'move',
    			containment: 'parent',
    			start: function(event, ui){
					$(this).data('dragging', true);
					if( self.options.scale != 0)
						return false;
    			},
    			drag: function(event, ui){
    			},
    			stop: function(event, ui){
					$(this).data('dragging', true);
    				var index = parseInt($(this).attr('content'), 10);
    				self.saveCamera(index, ui.position.top, ui.position.left);
    			}
			});

			/*drop camera*/
			element.droppable(
				{
					accept: '.encoder',
					drop: function(event, ui)
					{
						//$ui.draggable;
						$channel = Number(ui.draggable.attr('channel'));
						self.saveCamera($channel, (event.clientY - self.object.$map.offset().top), (event.clientX - self.object.$map.offset().left));
						$(':naxx-panel').panel('editmode');
					}
				}
			);

			$('<div></div>').minimap().appendTo(element);
			self.object.$minimap = $(':naxx-emap-minimap', element);

			/*map draggable*/
			self.object.$map.draggable({
				containment: [0, 0, element.width(), element.height()],
				cursor: 'url("images/grab.ico")',
				start: function(event, ui){
					if (ui.position.left > 0){
					}
				},
				drag: function(event, ui){
					if (ui.position.left > 0){
						$(this).css('left', 0);
						return false;
					}
					if (ui.position.top > 0){
						$(this).css('top', 0);
						return false;
					}
					if (ui.position.left < - self.options.scale*element.width())
					{
						$(this).css('left', - self.options.scale*element.width());
						return false;
					}
					if (ui.position.top < - self.options.scale*element.height())
					{
						$(this).css('top', - self.options.scale*element.height());
						return false;
					}
				},
				stop: function(event, ui){
					self.object.$minimap.minimap('reposMiniscreen', self.options.scale);
					//$(this).css('cursor': url("images/maphand.ico"));
				}
			});

    	},

		reposMap : function(w, h){
			var self = this, element = $(this.element);
			var new_top = self.object.$map.position().top+(h/10)*self.object.$map.height();
			var new_left = self.object.$map.position().left+(w/10)*self.object.$map.width();
			if (new_top > 0 ) new_top = 0;
			else if (new_top + self.object.$map.height() < element.height()) new_top = element.height() - self.object.$map.height();
			if (new_left > 0 ) new_left = 0;
			else if (new_left + self.object.$map.width() < element.width()) new_left = element.width() - self.object.$map.width();
			self.object.$map.animate({top: new_top, left: new_left});

		},
    	
    	centerView : function(index){
    		if(index < 0 || index > $.naxx.capability.encoder) return;
    		var $target = $('.view:visible[cid='+(index-1)+']');
			var self = this;
			var element = $(this.element);

    		if ($target.length > 0) //存在目標
    		{
    			var viewL = $target.position().left;
    			var viewT = $target.position().top;
    			var viewW = $target.width();
    			var viewH = $target.height();
    			var divW = element.width();
    			var divH = element.height();
    			var deltaW = divW/2 - (viewL+viewW/2);
    			var deltaH = divH/2 - (viewT+viewH/2);
    			this.focusView(index-1, true);
    			//this.reposMap(deltaW, deltaH);
    		}
    	},

		_editable : function(bool){
			var self = this;
			var element = $(this.element);

			if(bool)
			{
				self.object.$view.resizable({
					handles: 'e,s,n,w,se',
					start: function(e){
						e.preventDefault();
					},
					stop: function(){	//save dragging end position
					var index = parseInt($(this).attr('vid'), 10);
					self.focusView(index, false);
					self.saveView(index);
					}
				});
			}
			else
			{
				self.object.$view.each(function(){
					if($(this).hasClass('ui-draggable'))
						$(this).draggable('destroy');
					if($(this).hasClass('ui-resizable'))
						$(this).resizable('destroy');
				});
			}
    		
		},

		scale : function(scale) {
			var self = this;
			var element = $(this.element);

			self.options.scale += scale/10;
			if ( element.find('.emapback>canvas').length>0 ) //canvas mode
			{
				self.loop();
			}
			else
			{
				if (self.options.scale < 0) self.options.scale = 0;
				if (self.options.scale > 3) self.options.scale = 3; /*最大四倍*/
				element.find('.emapback').stop().animate({ width: element.width()*(1+self.options.scale), height: element.height()*(1+self.options.scale), top:-element.height()*self.options.scale/2 ,left: -element.width()*self.options.scale/2}).draggable('option', 'containment', [- self.options.scale*element.width(), - self.options.scale*element.height(), element.width()*(1+self.options.scale), element.height()*(1+self.options.scale)]);
				self.object.$minimap.minimap('reposMiniscreen', self.options.scale);
			}
		},
    	
    	wheel : function() {
			//support wheel
			var self = this;
    		var element = $(this.element);
            element.mousewheel(function(event, delta){
            	var speed = 10;//set the speed of the scroll
				//var slider
     			var sliderVal = (delta*speed);//increment the current value

				if ( element.find('.emapback>canvas').length>0 ) //canvas mode
				{
					self.options.scale += delta*speed;
				}
				else
     			{
     				clearTimeout();
     				self.scale(sliderVal + self.options.scale*100);
     			}
    			event.preventDefault();//stop any default behaviour
    			$(this).focus();
			});
    	},

    	showMap : function(){
			var self = this;
			var element = $(this.element);
            this.wheel();
    		$('.emap').show(); 		
    		element.children('.emapback').show();

			//20110215 Alive: 避免livestream類型的draggable殘留
			self.object.$view.each(function(){
				$(this).removeClass('.cameraitem').hide();
				if($(this).hasClass('ui-draggable'))
					$(this).draggable('destroy');
			});

			//self.object.#

    		this._hideEmpty();
    		$('.plugin').addClass('inscreen');
    		$(document).keypress(function(e){
				switch (e.keyCode)
				{
					case 37: //left
						//self.reposMap(10, 0);
						break;
					case 38: //up
						//self.reposMap(0, 10);
						break;
					case 39: //right
						//self.reposMap(-10, 0);
						break;
					case 40: //down
						//self.reposMap(0, -10);
						break;
					default:
						var code = (e.keyCode ? e.keyCode : e.which)
						if (code >= 122) code = code -122+48+10;
						if (code >= 97) code = code -97+48+10;
						self.centerView(code-48);
				}
			});
    		this.displayEmapLayout('triangle');
    	},
    	
    	refineStream : function(stream){
    		var self = $(this.element);
    		this.options.currentStream = stream;
    		//check if the view is in the screen
    		var $plugin = $('.view').children('.plugin.occupied').parent();
    		var divW = self.width();
    		var divH = self.height();
    		for (var i = 0; i < $plugin.length; i++)
    		{
    			var viewL = $plugin.eq(i).position().left;
    			var viewT = $plugin.eq(i).position().top;
    			var viewW = $plugin.eq(i).width();
    			var viewH = $plugin.eq(i).height();
    				
    			if ((viewL+viewW<0)||(viewT+viewH<0)||(viewT>divH)||(viewL>divW))
    			{
    				$plugin.eq(i).removeClass('inscreen');
    				continue;
    			}
    			$plugin.eq(i).find('.plugin').plugin('reStream', stream);
    			$plugin.eq(i).addClass('inscreen');
    		}
    	},
		
		saveMap : function(){
			var self = this, element = $(this.element);
			
			$.naxx.desktop.emap[self.options.index].layout = self.options.layout;
			$.naxx.desktop.emap[self.options.index].map_path = self.options.map_path;
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				$.naxx.desktop.emap[self.options.index].view[i].type = self.options.view[i].type;
				$.naxx.desktop.emap[self.options.index].view[i].content = self.options.view[i].content;
				$.naxx.desktop.emap[self.options.index].view[i].width = self.options.view[i].width;
				$.naxx.desktop.emap[self.options.index].view[i].height = self.options.view[i].height;
				$.naxx.desktop.emap[self.options.index].view[i].top = self.options.view[i].top;
				$.naxx.desktop.emap[self.options.index].view[i].left = self.options.view[i].left;
			}
			
			$.naxx.teleport.Import($.naxx.path.emap+'/'+self.options.index, $.naxx.desktop.emap[self.options.index],
				function()
				{
				}
			);
		},
    	
    	focusView : function(index, bFocus) {
    		$('.view').removeClass('view-hover');
    		$('.emapcamera').removeClass('camera-hover');
    		if (bFocus)
    		{
    			$('.view').eq(index).addClass('view-hover');
    			$('.emapcamera').eq(index).addClass('camera-hover');
				$('.cameraitem').eq(index).addClass('ui-state-highlight');
    		}
    		else
    		{
    			$('.view').eq(index).removeClass('view-hover');
    			$('.emapcamera').eq(index).removeClass('camera-hover');
				$('.cameraitem').eq(index).removeClass('ui-state-highlight');
    		}
    	},
    	
    	saveView : function(index){
			var self = this;
			var element = $(this.element);
			var $targetview = self.object.$view.eq(index);

			$targetview.css({top: 100*$targetview.position().top/self.object.$map.height()+'%',
							left: 100*$targetview.position().left/self.object.$map.width()+'%'})
				.width(100*$targetview.width()/self.object.$map.width()+'%')
				.height(100*$targetview.height()/self.object.$map.height()+'%');
    	},

    	saveCamera : function(index, top, left){
			var self = this;
			var element = $(this.element);

			self.options.view[index].left = 100*left/self.object.$map.width()+'%';
			self.options.view[index].top = 100*top/self.object.$map.height()+'%';
			self.options.view[index].width = '10%';
			self.options.view[index].height = '10%';
			var css = self.options.view[index];
			delete css['content'];
			delete css['type']; //for ie
			self.object.$view.eq(index).css(css).view('option', self.options.view[index]).show();
			$(':naxx-panel').panel('editmode');
    	},

		toggleView : function(){
			$('.emapcamera:visible').each(function(index)
			{
				var $channel = $(this).attr('cid');
				$('.view').eq($channel).toggle();
			});
		},
    	
    	displayEmapLayout : function(type, view)
		{
			var self = this;
			var element = $(this.element);
			var divW = element.width();
			var divH = element.height();
			var $emap = element.find('.emapback');
			if ( element.find('.emapback>canvas').length>0 ) //canvas mode
			{
				switch(type)
				{
					//正常t-bar模式
					case 'fixed':
						for(var i = 0; i < self.three.viewcell.length; i++)
						{
							self.three.viewcell[i].viewcell.position.x = self.three.viewcell[i].camera.position.x;
							self.three.viewcell[i].viewcell.position.z = self.three.viewcell[i].camera.position.z;
							self.three.viewcell[i].viewcell.position.y = 160;
							self.three.viewcell[i].line.visible = false;
							self.three.viewcell[i].triangle.visible = true;
							self.three.viewcell[i].triangle.rotation = self.three.viewcell[i].viewcell.rotation;
						}
						break;
					//環繞劇場模式
					case 'movie':
						for (var i = 0; i < self.three.viewcell.length; i++)
						{
							if ( i < 6 )
							{
								self.three.viewcell[i].viewcell.position.x = ( 2.5 - i )* divW/3;
								self.three.viewcell[i].viewcell.position.z = - divH;
								self.three.viewcell[i].viewcell.rotation.y = 0;
							}
							else if ( i < 8 )
							{
								self.three.viewcell[i].viewcell.position.x = divW;
								self.three.viewcell[i].viewcell.position.z = ( 6.5 - i ) * divH;
								self.three.viewcell[i].viewcell.rotation.y = Math.PI/2;
							}
							else if ( i < 15 )
							{
								self.three.viewcell[i].viewcell.position.x = ( 10.5 - i )* divW/3;
								self.three.viewcell[i].viewcell.position.z = divH;
								self.three.viewcell[i].viewcell.rotation.y = 0;
							}
							else 
							{
								self.three.viewcell[i].viewcell.position.x = - divW;
								self.three.viewcell[i].viewcell.position.z = ( 14.5 - i ) * divH;
								self.three.viewcell[i].viewcell.rotation.y = Math.PI/2;
							}
							self.three.viewcell[i].viewcell.position.y = 300;
							//self.three.viewcell[i].viewcell.visible = true;
							var geometry = new THREE.Geometry();
							geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( self.three.viewcell[i].camera.position.x, self.three.viewcell[i].camera.position.y, self.three.viewcell[i].camera.position.z ) ) );
							geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( self.three.viewcell[i].viewcell.position.x, self.three.viewcell[i].viewcell.position.y, self.three.viewcell[i].viewcell.position.z ) ) );

							var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x055298, opacity: 0.2 } ) );
							line.position.z = 0;
							line.position.x = 0;
							line.position.y = 0;
							self.three.scene.addObject(line);
							self.three.viewcell[i].triangle.visible = false;
							self.three.viewcell[i].panel.visible = true;
							self.three.viewcell[i].line = line;
					}
					self.loop();
					break;
				}
				return;
			}
			//only show occupied views (?)
		//	$('.view').children('.plugin.occupied').parent().show();
		//	$('.view').children('.plugin.free').parent().hide();
			self.object.$view.hide();
			self.options.layout = type;
			switch (type)
			{
			/*Fix mode: on CameraPoint up*/
			default:
			case 'fixed':
				$emap.css({top: 0, left :0}).width('100%').height('100%');
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					var emapTop = 100*self.object.$camera.eq(i).position().top/$emap.height();
					var emapLeft = 100*self.object.$camera.eq(i).position().left/$emap.width();
					var fitWidth = 100/6;
					var fitHeight = 100/6;
					var fitTop = Number(emapTop) - 2*fitHeight;
					var fitLeft = Number(emapLeft) - fitWidth/2;
					//check if overlap..pending

					if (fitTop <=0) fitTop = 5 - fitTop;
					if (fitLeft <=0) fitLeft = 5 - fitLeft;
					//if (fitLeft + fitWidth >= divW) fitLeft = divW - fitLeft;
					//if (fitTop + fitHeight >= divH) fitTop = divH - fitTop;
					//this.reposView(i, {top: fitTop, left: fitLeft, width: fitWidth, height: fitHeight});
					self.object.$view.eq(i).css({top: fitTop+'%', left: fitLeft+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
				}
				this._editable(false);
				break;
			/*Triangle mode: set random fittest points with camera*/
			case 'triangle':
				$emap.css({top: 0, left :0}).width('100%').height('100%');
				var fitWidth = 100*1/6;
				var fitHeight = 100*1/6;
				var triangle = 5;
				var i, j, count = 0;

				for (i = 0; i < triangle; i++)
				{
					for (j = 0; j < triangle - i; j++)
					{
						var triangleLeft = j*(fitWidth + 2) + 6;
						var triangleTop = i*(fitHeight + 2) + 2;
						self.object.$view.eq(count).css({top: triangleTop+'%', left: triangleLeft+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
						count++;
					}
				}
	
				self.object.$view.eq($.naxx.capability.encoder-1).css({top: '66%', left:'66%'}).width(2*fitWidth+'%').height(2*fitHeight+'%').show();
				this._editable(false);
				break;
			case 'around':
				var fitWidth = 100*1/3;
				var fitHeight = 100*1/3;
				$emap.css({left: 100*1/5+'%', top: 100*1/5+'%'}).width(100*3/5+'%').height(100*3/5+'%');
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{

					//determine t/l
					//20110215 Alive: 邏輯待修改
					if ( i< $.naxx.capability.encoder/4)
					{
						self.object.$view.eq(i).css({top: -fitHeight+'%', left: fitWidth*(i-1)+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
					else if (i < $.naxx.capability.encoder/4+4)
					{
						self.object.$view.eq(i).css({top: fitHeight*(i-5)+'%', left: fitWidth*3+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
					else if (i < $.naxx.capability.encoder/4+8)
					{
						self.object.$view.eq(i).css({top: fitHeight*3+'%', left: fitWidth*(11-i)+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
					else
					{
						self.object.$view.eq(i).css({top: fitHeight*(15-i)+'%', left: - fitWidth+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
				}
				this._editable(false);
				break;
			case 'film':
				var fitWidth = 100*1/8;
				var fitHeight = 100*1/4;
				$emap.css({left: 0, top: 100*1/6+'%'}).height(100*4/6+'%').width('100%');
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{

					//determine t/l
					//20110215 Alive: 邏輯待修改
					if ( i< $.naxx.capability.encoder/2)
					{
						self.object.$view.eq(i).css({top: -fitHeight+'%', left: fitWidth*(i)+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
					else 
					{
						self.object.$view.eq(i).css({top: fitHeight*4+'%', left: fitWidth*(15-i)+'%'}).width(fitWidth+'%').height(fitHeight+'%').show();
					}
				}
				this._editable(false);
				break;
			case 'free':
				self.object.$view.each(function(index){
					$(this).show();
					if(index < $.naxx.capability.encoder)
					{
//						$(this).css({top: view[index].top, left: view[index].left}).width(view[index].width).height(view[index].height);
					}
				});
				this._editable(true);
			}
		},
		
		_hideEmpty : function() {
			var self = this;
			var element = $(this.element);
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				{
					self.object.$view.eq(i).hide();
					$('.emapcamera').eq(i).hide();
				}
			}
		},

		create3DViewcell: function(index){
			var self = this, element = $(this.element);

			
		},

		rotate: function(angle){
			var self = this, element = $(this.element);
			self.three.theta = angle;
		},
		
		lift: function(offset){
			var self = this, element = $(this.element);
			self.three.alpha += offset;
		},

		//render loop
		loop : function() {
			var self = this;
			var element = $(this.element);
			var divW = element.width();
			var divH = element.height();

			if (self.options.rotate)
			{
				self.three.theta += self.three.mouse2D.x*3;
				
				for (var i = 0; i < self.three.viewcell.length; i++)
				{
					self.three.viewcell[i].shadow.rotation.z = Math.PI - (Math.atan(self.three.camera.position.x/self.three.camera.position.z));
				}
			}
			self.three.camera.position.x = Math.sin( self.three.theta*Math.PI/360 )*element.width()*(self.options.scale/100+1); 
			self.three.camera.position.z = Math.cos( self.three.theta*Math.PI/360 )*element.width()*(self.options.scale/100+1);

			if (self.options.turn)
			{
				self.three.alpha += 0.05;
			}
			if (self.three.alpha == null)
			{
				var len = Math.sqrt((self.three.camera.position.z*self.three.camera.position.z) + (self.three.camera.position.x*self.three.camera.position.x));
				self.three.alpha = Math.atan(self.three.camera.position.y/len);
			}
			self.three.camera.position.y = element.height()*Math.sin(self.three.alpha); 

			if ( $.browser.mozilla )
			{
				for (var i = 0; i < self.three.viewcell.length; i++)
				{
					var center = self.toScreenXY(self.three.viewcell[i].viewcell.position, self.three.camera);
					self.three.viewcell[i].viewcell.visible = false;
					if(self.three.viewcell[i].triangle.visible)
					{ 
						self.object.$view.eq(i).css({top: center.top - self.object.$view.eq(i).height()/2,
							left: center.left - self.object.$view.eq(i).width()/2 }).show();
					}
					else
					{
						self.object.$view.eq(i).hide();
					}
				}
			}

			if(self.options.salute) self.salute();
			self.three.renderer.render(self.three.scene, self.three.camera);

			var miniW = $('.minimapPanel').width();
			var miniH = $('.minimapPanel').height();
			$('.minimapPanel')
			    .clearRect([-miniW/2, -miniH/2])
				.beginPath()
				.moveTo([-10, 0])
				.lineTo([10, 0])
				.moveTo([0, -10])
				.lineTo([0, 10])
				.moveTo([-self.three.camera.position.x*0.1, -self.three.camera.position.z*0.1])
				.lineTo([self.three.camera.target.position.x*(-80/divW), self.three.camera.target.position.z*(-40/divH)])
				.rect([-self.three.camera.position.x*0.1-5, -self.three.camera.position.z*0.1-5], {width: 10, height:10})
				.rect([self.three.camera.target.position.x*(-80/divW)-5, self.three.camera.target.position.z*(-40/divH)-5], {width: 10, height:10})
				.rect([-40*divW/divH, -40], {width: 80*divW/divH, height: 80})
				.closePath()
				.stroke();
				
			for(var i = 0 ; i < self.three.viewcell.length; i++)
			{
				//略縮圖
				$('.minimapPanel')
					.beginPath()
					.rect([-80*(self.three.viewcell[i].camera.position.x/divW), -40*(self.three.viewcell[i].camera.position.z)/divH], {width:3, height:3})
					.closePath()
					.stroke();
			}
		},

		//轉化3D電子地圖
		drawCanvas : function() {  
			var self = this;
			var element = $(this.element);

			if($('canvas', element).length > 0) {
				$('canvas', element).remove();
				$('.emapback>img').show();
				self._init();
				return;
			}

            var divW = element.width();
            var divH = element.height();
            var imgW = element.find('.emapback').width();
			var imgH = element.find('.emapback').height();
			element.find('.emapback>img').hide();
			element.find('.emapback').css({top: 0, left: 0}).width(element.width()).height(element.height());
			self.options.viewwidth = 320/2;
			self.options.viewheight = 240/2;

			self.three.camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
			self.three.camera.position.x = 0;
			self.three.camera.position.y = 400;
			self.three.camera.position.z = - 1.3*divW;
			self.three.camera.target.position.x = 0;
			self.three.camera.target.position.y = 0;
			self.three.camera.target.position.z = 0;

			self.three.mouse2D = new THREE.Vector3( 0, 10000, 0.5 );
			self.three.ray = new THREE.Ray( self.three.camera.position, null );
			self.three.projector = new THREE.Projector();

			self.three.scene = new THREE.Scene();

			// Grid

			var geometry = new THREE.Geometry();
			geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - divH, 0, 0 ) ) );
			geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( divH, 0, 0 ) ) );
			var geometry2 = new THREE.Geometry();
			geometry2.vertices.push( new THREE.Vertex( new THREE.Vector3( - divW, 0, 0 ) ) );
			geometry2.vertices.push( new THREE.Vertex( new THREE.Vector3( divW, 0, 0 ) ) );

			for ( var i = 0; i <= 20; i ++ ) {

				var line = new THREE.Line( geometry2, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ) );
				line.position.z = ( i * divH/10 ) - divH;
				line.position.x = 0;
				self.three.scene.addObject( line );

				var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x0186D1, opacity: 0.2 } ) );
				line.position.x = ( i * divW/10 ) - divW;
				line.rotation.y = 90 * Math.PI / 180;
				self.three.scene.addObject( line );

			}

			//texture
			geometry = new Plane(element.width()*2, element.height()*2, 33, 33);
			var material = new THREE.MeshBasicMaterial({map: ImageUtils.loadTexture(this.options.map_path)});
			var plane = new THREE.Mesh(geometry, material);
			plane.position.x = 0;
			plane.position.z = 0;
			plane.rotation.x = -90 * Math.PI / 180;
			plane.rotation.z = 180 * Math.PI / 180;;

			self.three.scene.addObject( plane );

			self.three.renderer = new THREE.CanvasRenderer();
			self.three.renderer.setSize( element.width(), element.height() );
			self.three.map = plane;
			
			geometry = new Plane(element.width()*2, 500, 1, 1);

			element.find('.emapback')[0].appendChild( self.three.renderer.domElement );
			
			//put camera
			$(':naxx-view:visible').each(
				  function(index){
					  if ($(this).position().left < 0 || $(this).position().top < 0 ) return;
					  //self.camera[$(this).attr('cid')] = { top: $(this).position().top, left: $(this).position().left };

					  /* Create On-Map Camera Indicator */
					  geometry = new Cube(50, 50, 1);
					  var channel_n = Number($(this).attr('content'))+1;
					  material = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/pin'+(Number($(this).attr('content'))+1)+'_normal.png')});
					  var camera_indicator = new THREE.Mesh(geometry, material);
					  camera_indicator.rotation.x = 180 * Math.PI / 180;
					  camera_indicator.rotation.z = 180 * Math.PI / 180;
					  camera_indicator.position.y = 50/2;
					  camera_indicator.position.x = - 2*($(this).position().left - divW/2);
					  camera_indicator.position.z = - 2*($(this).position().top - divH/2);
					  camera_indicator.doubleSided = true;
					  camera_indicator.flipSided = true;
					  self.three.scene.addObject( camera_indicator );

					  /* Create On-Map Camera Indicator shadow!*/
					  geometry = new Plane(150, 150, 1, 1);
					  material = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/pin_shadow.png'), opacity: 0.7});
					  var camera_shadow = new THREE.Mesh(geometry, material);
					  camera_shadow.rotation.x = 90 * Math.PI / 180;
					  camera_shadow.position.x = - 2*($(this).position().left - divW/2);
					  camera_shadow.position.z = - 2*($(this).position().top - divH/2);
					  camera_shadow.doubleSided = true;
					  camera_shadow.flipSided = true;
					  self.three.scene.addObject( camera_shadow );

					  /*viewcell*/
					  if ($.naxx.encoder[index].address != '')
					  {
						//geometry = new Plane(320, 240, 5, 5);
						geometry = new Cube(self.options.viewwidth, self.options.viewheight, 5);
						//material = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/loadingcell.png')});
						material = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('http://'+$.naxx.encoder[index].address+'/videoany.mjpg?codectype=mjpeg')});

						if(! $.browser.mozilla)
						{
							var img=new Image();
							img.onload = function(){
								self.three.viewcell[index].viewcell.materials[0] = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('http://'+$.naxx.encoder[index].address+'/videoany.mjpg?codectype=mjpeg')});
							}; 
							img.onerror = function(){
								self.three.viewcell[index].viewcell.materials[0] = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/notsupport.png')});
								self.three.viewcell[index].viewcell.visible = false;
								self.three.viewcell[index].triangle.visible = false;
								self.three.viewcell[index].close.visible = false;
								self.three.viewcell[index].channel.visible = false;
								self.three.viewcell[index].panel.visible = false;
							};
							//img.src='http://'+$.naxx.encoder[index].address+'/videoany.mjpg?codectype=mjpeg';
						}
					  }
					  else
					  {
						geometry = new Cube(self.options.viewwidth, self.options.viewheight, 5);
						material = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/cell-unknown.jpg')});
					  }

					  var viewcell = new THREE.Mesh(geometry, material);
					  
					  viewcell.position.x = - 2*($(this).position().left - divW/2);
					  viewcell.position.z = - 2*($(this).position().top - divH/2);
					  viewcell.rotation.x = 180 * Math.PI / 180;
					  viewcell.rotation.z = 180 * Math.PI / 180;;
					  //viewcell.position.y = 0.6*(element.height()-$(this).position().top)+70;
					  viewcell.position.y = 160;
					  viewcell.doubleSided = true;
					  self.three.scene.addObject( viewcell );
					  
					  geometry = new Plane(self.options.viewwidth+15, self.options.viewheight+15, 1, 1);
					  var panel = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.5 } ) );
					  panel.position = viewcell.position;
					  panel.rotation = viewcell.rotation;
					  panel.doubleSided = true;
					  self.three.scene.addObject( panel );

					  /*Triangle*/

					  geometry = new THREE.Geometry();
					  if ($.browser.mozilla)
					  {
						var v0 = new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) );
						var v1 = new THREE.Vertex( new THREE.Vector3( -20, viewcell.position.y - self.options.viewheight/2 - 20 , 0 ) );  //up-y axis line
						var v2 =  new THREE.Vertex( new THREE.Vector3( -80, viewcell.position.y - self.options.viewheight/2 - 20, 0 ) );  //up-y axis line
					  }
					  else
					  {
						var v0 = new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) );
						var v1 = new THREE.Vertex( new THREE.Vector3( -20, viewcell.position.y - self.options.viewheight/2 , 0 ) );  //up-y axis line
						var v2 =  new THREE.Vertex( new THREE.Vector3( -80, viewcell.position.y - self.options.viewheight/2, 0 ) );  //up-y axis line
					  }
					  var face = new THREE.Face3( geometry.vertices.push(v0) - 1, geometry.vertices.push(v1) - 1, geometry.vertices.push( v2)-1, null, new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ));
					  geometry.faces.push( face );
					  geometry.computeFaceNormals();
					  geometry.computeCentroids();
					  var triangle = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.5 } ) );
					  triangle.doubleSided = true;
					  triangle.position.x = - 2*($(this).position().left - divW/2);
					  triangle.position.z = - 2*($(this).position().top - divH/2);
					  triangle.rotation.x = 180 * Math.PI / 180;
					  triangle.rotation.z = 180 * Math.PI / 180;
					  self.three.scene.addObject( triangle );

					  //close button

					  var close = new THREE.Mesh(new Plane(20, 20, 1, 1), new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/Delete.png'), opacity: 0.5}));
					  close.position.x = panel.position.x + (self.options.viewwidth - 5 - 1)/2;
					  close.position.z = panel.position.z;
					  close.position.y = panel.position.y + (self.options.viewwidth*3/8+10);
					  close.rotation = viewcell.rotation;
					  close.doubleSided = true;
					  close.flipSided = true;
					  self.three.scene.addObject( close );

					  //channel number

					  var channel = new THREE.Mesh(new Plane(20, 20, 1, 1), new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/c'+(Number($(this).attr('content'))+1)+'.png'), opacity: 0.8}));
					  channel.position.x = panel.position.x - (self.options.viewwidth - 5 - 1)/2;
					  channel.position.z = panel.position.z;
					  channel.position.y = close.position.y;
					  channel.rotation = viewcell.rotation;
					  channel.doubleSided = true;
					  channel.flipSided = true;
					  self.three.scene.addObject( channel );
					  
					  if ($.naxx.encoder[index].address == '')
					  {
						  viewcell.visible = false;
						  triangle.visible = false;
						  close.visible = false;
						  channel.visible = false;
						  panel.visible = false;
					  }
					  
					  self.three.viewcell.push({
						  viewcell: viewcell,
						  close: close,
						  channel: channel,
						  triangle: triangle,
						  camera: camera_indicator,
						  shadow: camera_shadow,
						  panel: panel,
						  data: {
							  channel: Number($(this).attr('cid'))
						  }
					  });
					  
				  }
			);

			self.three.stats = new Stats();
			self.three.stats.domElement.style.position = 'absolute';
			self.three.stats.domElement.style.top = '0px';
			element.find('.emapback')[0].appendChild(self.three.stats.domElement);
			$(document).unbind('keypress');
			$(document).keydown(function(event)
			{
				switch(event.keyCode) {
					case 38://up
						self.three.camera.position.z += 10;
						break;
					case 39://right
						self.three.theta += 10;
						break;
					case 40://down
						self.three.camera.position.z -= 10;
						break;
					case 37://left
						self.three.theta -= 10;
						break;
					case 87://w
						self.three.camera.position.y += 10;
						break;
					case 83://s
						self.three.camera.position.y -= 10;
						break;
					case 90://z
						self.three.camera.target.position.x -= 10;
						break;
					case 88://x
						self.three.camera.target.position.x += 10;
						break;
					case 16:
						self.options.rotate = ! self.options.rotate;
						break;
					case 17:
						self.options.turn = ! self.options.turn;
						break;
					default://num
						var vid = event.keyCode - 49;
						if (vid < -1 || vid >= $.naxx.capability.encoder + 7) break;
						self.three.camera.position.x = 100;
						self.three.camera.position.z = 100;

						if (vid >= 16 && vid <= 22)
								vid = vid - 16 + 9;

						/*clear focus*/
						for(var i = 0; i < $.naxx.capability.encoder; i++)
						{
							self.three.viewcell[i].camera.materials[0] = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/pin'+(i+1)+'_normal.png'), opacity: 0.5});

							if(vid >= 0 && vid != i)
							{
								self.three.viewcell[i].viewcell.visible = false;
								self.three.viewcell[i].triangle.visible = false;
								self.three.viewcell[i].close.visible = false;
								self.three.viewcell[i].channel.visible = false;
								self.three.viewcell[i].panel.visible = false;
							}
							else
							{
								self.three.viewcell[i].viewcell.visible = true;
								self.three.viewcell[i].triangle.visible = true;
								self.three.viewcell[i].close.visible = true;
								self.three.viewcell[i].channel.visible = true;
								self.three.viewcell[i].panel.visible = true;
							}
						}

						if (vid < 0)
						{
							self.three.camera.target.position.x = 0;;
							self.three.camera.target.position.z = 0;
							self.three.camera.target.position.y = 0;
						}
						else
						{
							self.three.camera.target.position.x = -2*(self.view[vid].position().left - divW/2);
							self.three.camera.target.position.z = -2*(self.view[vid].position().top - divH/2);
							if (self.three.viewcell[vid].viewcell.visible) 
								self.three.camera.target.position.y = self.three.viewcell[vid].viewcell.position.y;
							else
								self.three.camera.target.position.y = self.three.viewcell[vid].camera.position.y;
							self.three.viewcell[vid].camera.materials[0] = new THREE.MeshBasicMaterial({map:ImageUtils.loadTexture('images/pin'+(vid+1)+'_focus.png'), opacity: 0.5});
						}
						break;
				}    
				self.loop();
			});
			
			$('canvas', element).mousemove(function(event){
				self.three.mouse2D.x = ((event.offsetX ? event.offsetX : event.layerX)/divW)*2-1;
				self.three.mouse2D.y = - ((event.offsetY ? event.offsetY : event.layerY)/divH)*2+1;
				return false;
			});

			element.click(function(event){
				self.three.mouse2D.x = ((event.offsetX ? event.offsetX : event.layerX)/divW)*2-1;
				self.three.mouse2D.y = - ((event.offsetY ? event.offsetY : event.layerY)/divH)*2+1;
				self.three.mouse3D = self.three.projector.unprojectVector(self.three.mouse2D.clone(), self.three.camera);
				self.three.ray.direction = self.three.mouse3D.subSelf(self.three.camera.position).normalize();
				var intersects = self.three.ray.intersectScene( self.three.scene );
				if (intersects.length > 0){
					for( var  i= 0; i< intersects.length; i++ ) {	 
						if(intersects[i].object != self.three.map)
						{
							for (var j = 0; j < self.three.viewcell.length; j++)
							{
								if(intersects[i].object == self.three.viewcell[j].camera)
								{
									if (! $.browser.mozilla ) self.three.viewcell[j].viewcell.visible = !self.three.viewcell[j].viewcell.visible;
									self.three.viewcell[j].triangle.visible = !self.three.viewcell[j].triangle.visible;
									self.three.viewcell[j].close.visible = !self.three.viewcell[j].close.visible;
									self.three.viewcell[j].channel.visible = !self.three.viewcell[j].channel.visible;
									self.three.viewcell[j].panel.visible = !self.three.viewcell[j].panel.visible;
									return false;
								}
								else if(intersects[i].object == self.three.viewcell[j].triangle)
								{
								}
								else if(intersects[i].object == self.three.viewcell[j].close)
								{
									self.three.viewcell[j].viewcell.visible = false;
									self.three.viewcell[j].triangle.visible = false;
									self.three.viewcell[j].close.visible = false;
									self.three.viewcell[j].channel.visible = false;
									self.three.viewcell[j].panel.visible = false;
									return false;
								}
							}
						}
					}
				}

			});

			//把2D地圖物件隱藏
			$('.emapcamera,.view').hide();
			$('.minimapPanel').empty().canvas();
			var info = []; // will get populated with info
			$( '.minimapPanel').canvasinfo( info);   // info[ 0].width  point to the width
			//info[0].context.setTransform(1, 0, 0, 1, $('.minimapPanel').width()/2, $('.minimapPanel').height()/2);


			$('.emapptz').hide();

			this.animate();
		},

		animate: function(){
			var self = this;
			requestAnimationFrame( function(){self.animate();} );
			self.loop();
			self.three.stats.update();
		},

		toScreenXY: function ( position, camera) {
			var self = this, element = $(this.element);
		    var pos = position.clone();
		    projScreenMat = new THREE.Matrix4();
		    projScreenMat.multiply( camera.projectionMatrix, camera.matrix );
		    projScreenMat.multiplyVector3( pos );
		
		    return { left: ( pos.x + 1 ) * element.width() / 2 ,
			         top: ( - pos.y + 1) * element.height() / 2 };
				 
		},

		/*所有viewcell面向自己*/
		salute: function(){
			var self = this, element = $(this.element);
			for (var j = 0; j < self.three.viewcell.length; j++)
			{
				var theta = - (Math.atan(self.three.camera.position.x/self.three.camera.position.z));
				self.three.viewcell[j].viewcell.rotation.y = theta;
				self.three.viewcell[j].panel.rotation.y = self.three.viewcell[j].triangle.rotation.y = self.three.viewcell[j].close.rotation.y = self.three.viewcell[j].viewcell.rotation.y;
				self.three.viewcell[j].close.position.x = self.three.viewcell[j].panel.position.x + (self.options.viewwidth-5-1)*Math.cos(theta)/2;
				self.three.viewcell[j].close.position.z = self.three.viewcell[j].panel.position.z + (self.options.viewwidth-5-1)*Math.sin(theta)/2;
				self.three.viewcell[j].channel.position.x = self.three.viewcell[j].panel.position.x - (self.options.viewwidth-5-1)*Math.cos(theta)/2;
				self.three.viewcell[j].channel.position.z = self.three.viewcell[j].panel.position.z - (self.options.viewwidth-5-1)*Math.sin(theta)/2;
			}
		},

		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.droppable('destroy');
			element.removeClass('emap').children().remove();
		}

	});
})(jQuery);
