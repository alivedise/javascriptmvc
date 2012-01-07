/*# 
 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
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
 * Date: 2011-04-27 18:08:09
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.alayout: new main layout component
 *
 */

;(function($) {
	$.widget("naxx.alayout", {
		options : {
			mode: 'liveview',
			panel: 150,
			side: 270,
			ptz: 345,
			south: 85,
			play: 111,
			playqueue: 134,
			calendar: 272
		},
		object: {
			body_layout: null,
			side_layout: null,
			main_layout: null,
			play_layout: null
		},

		_create: function(){
			$.naxx.teleport.Export($.naxx.path.raphael+'/network', function(res){
				//res.hostname
				document.title = 'VIVOTEK '+res.hostname;
				$.extend($.naxx.raphael, {network: res});
			});
		},
		
		_init : function(){
			var self = this, element = $(this.element);
			if ($.naxx.inited == true) return;
			$.naxx.inited = true;
			//if($.browser.msie) jQuery.fx.off = true;
			//jQuery.fx.off = true;
			
			self.object.body_layout = $('body').layout({
				//resizeWithWindow: false,
				resizable: false,
				slidable: false,
				closable: true,
				south__size: self.options.playqueue,
				south__initHidden: true,
				spacing_open: 0,//邊框的間隙 
				showOverflowOnHover: false,
				spacing_closed: 0 //關閉時邊框的間隙
			//	togglerLength_open: 150,//pane打開時邊框按鈕的長度
			//	togglerLength_closed: 150,//pane關閉時邊框按鈕的長度
			//	togglerAlign_open: 'left',  
			//	togglerAlign_closed: 'left',  
				//togglerContent_open: '<span symbol="title:watch_later" class="queue_control"><span>Watch later</span></span><span></span>',
			//	togglerContent_closed: '<span symbol="title:watch_later" class="queue_control"><span>Watch later</span></span><span></span>'
			});


			self.object.main_layout = $('#inner').layout({
				//resizeWithWindow: false,
				closable: false,
				resizable: false,
				slidable: false,
				togglerLength_closed: 30,
				togglerAlign_closed: 'top',
				togglerContent_closed: '<span class="arrow right normal" symbol="title:open_side_panel"></span>',
				showOverflowOnHover: false,

				//北邊pane設定
				north__size: self.options.panel,
				north__closable: false,
				north__spacing_open:0,//邊框的間隙 
				north__spacing_closed:0, //關閉時邊框的間隙

				//西邊pane設定
				west__size: self.options.side,
				west__closable:true,
				west__slidable:false,
				west__spacing_open:0,//邊框的間隙
				west__spacing_closed:28, //關閉時邊框的間隙
				
				//南邊pane設定
				south__size: self.options.south,
				south__closable: true,
				south__slidable:false,
				south__spacing_open:0,//邊框的間隙 
				south__spacing_closed:0, //關閉時邊框的間隙
				south__initHidden: true,


				onopen_end: function(){
				}

				//縮放關閉結束時呼叫layout重整函數
			});
			
			self.object.side_layout = $('#sidemenu').layout({
				//resizeWithWindow: false,
				slidable: false,
				resizable: false,
				south__size: self.options.ptz,
				closable:true,
				slidable:false,
				togglerLength_open:15,// WIDTH of toggler on north/south edges - HEIGHT on east/west					edges,
				togglerLength_closed:15,
				spacing_open:0,
				spacing_closed:15
			});

			self.object.play_layout = $('#play_layout').layout({
				//resizeWithWindow: false,
				slidable: false,
				resizable: false,
				//center__paneSelector: '.vision',
				south__size: self.options.play,
				south__initHidden: true,
				closable:true,
				slidable:false,
				spacing_open:0,
				spacing_closed:0,
				onopen_end: function(){
					$(':naxx-vision').vision('displayLayout');
				},
				onresize_end: function(){
					$(':naxx-vision').vision('displayLayout');
				},
				onclose_end: function(){
					$(':naxx-vision').vision('displayLayout');
				}
			});

			$('.playqueue').playqueue();
			$('.panel').panel({mode: self.options.mode});

			self.ie8resize();

			//if($.browser.msie) jQuery.fx.off = false;
		},

		clear: function(){
			var self = this, element = $(this.element);
			$('span:animated').stop();
			$('#sidemenu').removeClass('settings');
			if($(':naxx-vision').length>0) $(':naxx-vision').vision('destroy');
			if($(':naxx-search').length>0) $(':naxx-search').search('destroy');
			if($(':naxx-alarmlist').length>0) $(':naxx-alarmlist').alarmlist('destroy');
			if($(':naxx-rptz').length>0) $(':naxx-rptz').rptz('destroy');
			if($(':naxx-eventlist').length>0) $(':naxx-eventlist').eventlist('destroy');
			if($(':naxx-emap').length>0) $(':naxx-emap').emap('destroy');
			if($(':naxx-settings').length>0) $(':naxx-settings').settings('destroy');
			if($(':naxx-settingtree').length>0) $(':naxx-settingtree').settingtree('destroy');
			if($(':naxx-dateSelector').length>0) $(':naxx-dateSelector').dateSelector('destroy');
			if($(':naxx-searchfilter').length>0) $(':naxx-searchfilter').searchfilter('destroy');
			if($(':naxx-play_control').length>0) $(':naxx-play_control').play_control('destroy');
			if($(':naxx-map_control').length>0) $(':naxx-map_control').map_control('destroy');
			if($(':naxx-cameraslider').length>0) $(':naxx-cameraslider').cameraslider('destroy');
			//if($(':naxx-panel').length>0) $(':naxx-dateSelector').dateSelector('destroy');
		},

		liveview: function(){
			var self = this, element = $(this.element);
			self.clear();
			//self.object.body_layout.hide('south');
			self.object.side_layout.show('south');
			self.openPTZ();
			self.object.main_layout.show('west');
			self.object.main_layout.hide('south');
			self.object.play_layout.hide('south');
			$('.cameraslider').cameraslider({mode: 'liveview'});
			$('.ptzcontrol').rptz();
			$('div.eventlist').alarmlist();
			//self.object.body_layout.hide('south');
			$.naxx.teleport.Export($.naxx.path.raphael, function(res){
				$.extend($.naxx.raphael, res);
				$.naxx.teleport.Export($.naxx.path.vision, function(res)
				{
					$.extend($.naxx.desktop.vision, res);
					$('#content').vision($.naxx.desktop.vision[0]);
					//$(':naxx-vision').vision($.extend($.naxx.desktop.vision[0], {index: 0}));
					}
				);
			});
			$.cookie('mode', 'liveview');
		},

		playback: function(){
			var self = this, element = $(this.element);
			self.clear();
			//self.object.body_layout.hide('south');
			self.object.side_layout.show('south');
			self.openPTZ();
			$('.ptzcontrol').eventlist();
			self.object.main_layout.show('west');
			self.object.main_layout.hide('south');
			self.object.play_layout.show('south');
			$.naxx.teleport.Export($.naxx.path.raphael, function(res){
				$.extend($.naxx.raphael, res);
			});
			$('#content').vision({mode: 'playback'});
			$('div.eventlist').dateSelector();
			$('.play_control').play_control();
			$('.cameraslider').cameraslider({mode: 'playback'});
			$.cookie('mode', 'playback');
		},
		
		settings: function(){
			var self = this, element = $(this.element);
			self.clear();
			//self.object.body_layout.hide('south');
			self.object.side_layout.hide('south');
			//self.object.main_layout.hide('west');
			self.object.main_layout.show('west');
			self.object.main_layout.hide('south');
			self.object.play_layout.hide('south');
			$('#content').settings();
			$('#sidemenu').addClass('settings');
			$('.cameraslider').cameraslider({mode: 'settings'});
			$.cookie('mode', 'settings');
		},
		
		emap: function(){
			var self = this, element = $(this.element);
			self.clear();
			//self.object.body_layout.hide('south');
			self.object.side_layout.show('south');
			self.openPTZ();
			self.object.main_layout.show('west');
			self.object.main_layout.show('south');
			self.object.play_layout.hide('south');
			$('div.eventlist').alarmlist();
			$('.ptzcontrol').rptz();
			$('#content').emap();
			$('.cameraslider').cameraslider({mode: 'emap'});
			$('.map_control').map_control();
			$.naxx.teleport.Export($.naxx.path.emap, function(res)
				{
					$.extend($.naxx.desktop.emap, res);
					$(':naxx-emap').emap($.extend($.naxx.desktop.emap[0], {index: 0}));
					$('#targetemap option').each(function(index){
						$(this).text($.naxx.desktop.emap[index].name);
					});
					if ($.naxx.desktop.emap[0].map_path == '') var path = 'images/blank.png';
					else var path = $.naxx.desktop.emap[0].map_path;
					$('#targetshots').attr('src', path);
					$('#name').val($.naxx.desktop.emap[0].name);
				}
			);
			$.cookie('mode', 'emap');
		},
		
		search: function(){
			var self = this, element = $(this.element);
			self.clear();
			//self.object.body_layout.hide('south');
			self.object.main_layout.hide('west');
			self.object.play_layout.hide('south');
			self.object.main_layout.hide('south');
			$('#content').search();
		},
		
		closePTZ : function(){
			var self = this, element = $(this.element);
			self.object.side_layout.sizePane('south', 22);
		},
		
		openPTZ : function(){
			var self = this, element = $(this.element);
			self.object.side_layout.sizePane('south', self.options.ptz);
		},
		
		openSide : function(){
			var self = this, element = $(this.element);
			self.object.main_layout.show('west');
		},

		closeSide : function(){
			var self = this, element = $(this.element);
			self.object.main_layout.hide('west');
		},

		playqueue: function(){
			var self = this, element = $(this.element);
			self.object.body_layout.show('south');
			self.object.body_layout.sizePane('south', self.options.playqueue);
		},
		
		togglequeue: function(){
			var self = this, element = $(this.element);
			self.object.body_layout.sizePane('south', 29);
		},
		
		hidequeue: function(){
			var self = this, element = $(this.element);
			self.object.body_layout.hide('south');
		},

		ie8resize: function(){
			var self = this, element = $(this.element);
			if($.browser.msie && $.browser.version == '8.0')  //hacking to the IE8
			{
				self.options.lastDPI = screen.deviceXDPI; 
				setInterval( function(){
						if (self.options.lastDPI !== screen.deviceXDPI) { 
							self.options.lastDPI = screen.deviceXDPI; 
							self.object.body_layout.resizeAll(); // CHANGE as needed 
						} 
				}, 1000 ) 
			}
		},

		destroy : function(){
		}
	});
})(jQuery);
