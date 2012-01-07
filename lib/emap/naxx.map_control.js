/* 
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
 * Date: 2011-05-27 11:10:37
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.map_control
 *
 */

;(function($) {
	$.widget("naxx.map_control", {
		options : {
		},

		direction_buttons: [
			{
				name: 'up',
				type: 'direction',
				callback: function(self, element){
					$(':naxx-emap').emap('reposMap', 0, 1);
					return false;
				}
			},
			{
				name: 'down',
				type: 'direction',
				callback: function(self, element){
					$(':naxx-emap').emap('reposMap', 0, -1);
					return false;
				}
			},
			{
				name: 'left',
				type: 'direction',
				callback: function(self, element){
					$(':naxx-emap').emap('reposMap', 1, 0);
					return false;
				}
			},
			{
				name: 'right',
				type: 'direction',
				callback: function(self, element){
					$(':naxx-emap').emap('reposMap', -1, 0);
					return false;
				}
			}
		],

		zoom_buttons: [
			{
				name: 'zoomin',
				type: 'emapctrl',
				callback: function(self, element){
					$(':naxx-emap').emap('scale', 5);
					return false;
				}
			},
			{
				name: 'zoomout',
				type: 'emapctrl',
				callback: function(self, element){
					$(':naxx-emap').emap('scale', -5);
					return false;
				}
			}
		],

		lift_buttons: [
			{
				name: 'up',
				type: 'emapctrl',
				callback: function(self, element){
					$(':naxx-emap').emap('lift', 0.1);
					return false;
				}
			},
			{
				name: 'down',
				type: 'emapctrl',
				callback: function(self, element){
					$(':naxx-emap').emap('lift', -0.1);
					return false;
				}
			}
		],


		_create : function(){
			var self = this, element = $(this.element);
			$('<div class="emapctrl"><div class="emap2D"><div class="zoom_ctrl"></div><span class="direction_wheel"><img src="images/panel/emapctrl/emapctrlCircle.png" /></span></div><div class="emap25D"><input id="theta" type="text" value=0 /><div class="lift_ctrl"></div></div></div>').appendTo(element);
			$('<div class="emapSelector"><img src="images/button/emapselector/emapselector_normal.png"></img><span class="name">E-Map 1</span><span id="selector"></span></div>').appendTo(element);
			for (var i = 0; i < self.direction_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.direction_buttons[i]).appendTo($('.direction_wheel', element));
			}
			for (var i = 0; i < self.zoom_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.zoom_buttons[i]).appendTo($('.zoom_ctrl', element));
				$('<br/>').appendTo($('.zoom_ctrl', element));
			}
			for (var i = 0; i < self.lift_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.lift_buttons[i]).appendTo($('.lift_ctrl', element));
				$('<br/>').appendTo($('.lift_ctrl', element));
			}
			$('#selector', element).vivobutton({ name: 'list', type: 'direction', attr: { symbol: 'title:select_emap' }, callback: function(){
						$('img.emapshots').each(function(index){
							$(this).attr('src', $.naxx.desktop.emap[index].map_path);
							if( $.naxx.desktop.emap[index].map_path == '' ) $(this).attr('src', 'images/blank.png');
						});

						$.blockUI({message: $('#emaplist'), css: { border: 'none', background: 'none', width: '100%', height: '100%', top: 0, left: 0, color: 'white', cursor: 'default' }});
						return false;
					//$.blockUI({message: '<span>123</span>'});
			}});

			$('<div id="emaplist"><div><img src="images/emapicon.png" /><span symbol="title:select_your_emap">Select your e-map</span></div><hr/><div id="emapshots"></div></div>').appendTo('body');

			for(var i = 0; i < $.naxx.capability.emap; i ++)
			{
				$('<img src="" class="emapshots ui-corner-all" index="'+i+'" alt="Upload your e-map" />').click(function(){
					$.unblockUI();
					$(':naxx-emap').emap($.extend($.naxx.desktop.emap[$(this).attr('index')], {index: $(this).attr('index')}));
					$('.emapSelector .name').text($.naxx.desktop.emap[$(this).attr('index')].name);
				}).appendTo($('#emapshots'));
			}
		/*	
			if(!$.browser.msie)
				$('input', element).wheel({background: 'images/emapctrlCircle.png', radius: 25, max: 360, textvisible: false});
			else
			{
				$('input', element).hide();
			}

			$('.emap25D', element).hide();*/
				$('input', element).hide();
		},

		_init : function(){
			var self = this, element = $(this.element);

		},
		
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.children().remove();
		}
	});
})(jQuery);
