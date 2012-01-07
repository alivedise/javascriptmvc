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
 * Date: 2011-04-28 11:25:18
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.rptz: new ptz
 *
 */

;(function($) {
	$.widget("naxx.rptz", {
		options : {
			eptz: '0',
			camctrl: '0',
			preset_location: {
				mechanical: {},
				digital: {}
			}
		},

		symbols: {
			disable_symbol:'alt: no_preset_locations'
		},

		_create : function(){
			var self = this, element = $(this.element);
			$('<div class="nvrtoggler"><span symbol="text:ptz_pane">PTZ</span></div>').appendTo(element);
			$('<span></span>').vivobutton({ name: 'down', type: 'arrow', attr: { symbol: 'title:close_ptz_pane' }, callback: function(self, element){$(':naxx-alayout').alayout('closePTZ'); element.hide(); element.siblings('span').show(); return false;}}).appendTo(element);
			$('<span></span>').vivobutton({ name: 'up', type: 'arrow', attr: { symbol: 'title:open_ptz_pane' }, callback: function(self, element){$(':naxx-alayout').alayout('openPTZ'); element.hide(); element.siblings('span').show(); return false;}}).hide().appendTo(element);
			
			element.addClass('rptz').append('<div class="bigo"><img id="move" src="images/button/ptz/ptz_normal.png" usemap="#bigCircle" /></div>')

				.append('<div class="zoom"><img src="images/button/ptz/zoom_normal.png" id="zoom" usemap="" /><div><span symbol="text:zoom">Zoom</span></div></div>')
				.append('<div class="focus"><img src="images/button/ptz/zoom_normal.png" id="focus" usemap="" /><div><img src="images/button/ptz/auto_normal.png" id="auto_focus" /><span symbol="text:focus">Focus></span></div></div>')
				.append('<div class="pan_patrol"><img src="images/button/ptz/pan_patrol_normal.png" id="pan_patrol" usemap="#" /><div><img src="images/button/ptz/stop_normal.png" id="stop_pp" /><span symbol="text:stop">Stop</span></div></div>')
				.append('<img id="preset" src="images/button/ptz/preset_normal.png" />');
			$('body').append('<div id="preset_list"></div>');

			self.generateImageMap();
			self.disable();
		},

		disable: function(){
			this.toggle(false);
		},

		enable: function(){
			this.toggle(true);
		},
		
		destroy : function(){
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$(this.element).children().unbind().remove();
			$('#preset_list').children().unbind().remove();
			$('#preset_list').remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.children().unbind();
			element.children().remove();
		},

		_init : function(){
			var self = this, element = $(this.element);
			if ((((self.options.camctrl & 128) >0) && (self.options.isptz > 0)) || (((self.options.camctrl & 128) == 0) && ((self.options.camctrl & 4) > 0)))
			{
				self.enable();
			}
			else
			{
				self.disable();
			}
		},

		toggle: function(enable){
			var self = this, element = $(this.element);

			if(!enable)
			{
				$('#move').attr('src', 'images/button/ptz/ptz_disable.png').attr('usemap', '').attr('alt', $.naxx.stranslate());
				$('#zoom').attr('src', 'images/button/ptz/zoom_disable.png').attr('usemap', '');
				$('#focus').attr('src', 'images/button/ptz/zoom_disable.png').attr('usemap', '');
				$('#auto_focus').attr('src', 'images/button/ptz/auto_disable.png').attr('usemap', '');
				$('#pan_patrol').attr('src', 'images/button/ptz/pan_patrol_disable.png').attr('usemap', '');
				$('#preset').attr('src', 'images/button/ptz/preset_disable.png').attr('usemap', '').unbind();
				$('#preset_list').hide().empty();
			}
			else
			{
				/* TILT: bit 3 */
				if((self.options.camctrl & 8) > 0) $('#move').attr('src', 'images/button/ptz/ptz_normal.png').attr('usemap', '#mapMove');
				else $('#move').attr('src', 'images/button/ptz/ptz_disable.png').attr('usemap', '').attr('alt', $.naxx.stranslate());
				
				/* ZOOM: bit 4 */
				if((self.options.camctrl & 16) > 0) $('#zoom').attr('src', 'images/button/ptz/zoom_normal.png').attr('usemap', '#mapZoom');
				else $('#zoom').attr('src', 'images/button/ptz/zoom_disable.png').attr('usemap', '');
				
				/* FOCUS: bit 5 */
				if((self.options.camctrl & 32) > 0)
				{
					$('#focus').attr('src', 'images/button/ptz/zoom_normal.png').attr('usemap', '#mapFocus');
					$('#auto_focus').attr('src', 'images/button/ptz/auto_normal.png').attr('usemap', '#mapAutoFocus');
				}
				else
				{
					$('#focus').attr('src', 'images/button/ptz/zoom_disable.png').attr('usemap', '');
					$('#auto_focus').attr('src', 'images/button/ptz/auto_disable.png').attr('usemap', '');
				}
				
				/* PAN: bit 2 */
				if((self.options.camctrl & 4) > 0) $('#pan_patrol').attr('src', 'images/button/ptz/pan_patrol_normal.png').attr('usemap', '#mapPP');
				else $('#pan_patrol').attr('src', 'images/button/ptz/pan_patrol_disable.png').attr('usemap', '');

				$('#preset').attr('src', 'images/button/ptz/preset_normal.png').attr('usemap', '#mapPreset');
				
				$('#stop_pp').attr('src', 'images/button/ptz/stop_normal.png').attr('usemap', '#mapStopPP');
				self.generatePresetLocation();
			}
		},

		generatePresetLocation: function(){
			var self = this, element = $(this.element);

			$('#preset_list').empty();
			/*for (var i = 0; i < getJsonLength(self.options.preset_location.electrical[1]); i++)
			{
				var name = self.options.preset_location.electrical[1][i].name;
				if (name != '')
					$('<div class="preset_location" goto='+name+' title='+name+'>'+name+'</option>').click(function(){
						var channel = $('.view.active').attr('content');
						$.naxx.teleport.Exec($.naxx.path.encoder+'/'+channel, 'encoder_camctrl', 'action=recall&param='+$(this).attr('goto')+'&eptz=false&stream=0', function(res){
							$('#preset_list').hide('fade');
						});
					}).appendTo($('#preset_list'));
			}*/
			for (var i = 0; i < getJsonLength(self.options.preset_location.mechanical); i++)
			{
				var name = self.options.preset_location.mechanical[i].name;
				if (name != '')
					$('<div class="preset_location" goto='+name+' title='+name+'>'+name+'</option>').click(function(){
						var channel = $('.view.active').attr('content');
						$('#preset_list').hide('fade');
						$('#preset').data('tooltip').hide();
						$.naxx.teleport.Exec($.naxx.path.encoder+'/'+channel, 'encoder_camctrl', 'action=recall&param='+$(this).attr('goto')+'&eptz=false&stream=0', function(res){
								$('#preset_list').hide('fade');
						});
				}).appendTo($('#preset_list')).wordLimit();
			}
			
			for (var i = 0; i < getJsonLength(self.options.preset_location.digital); i++)
			{
				//if (self.options.preset_location.digital[i].name != '')
					//$('#preset_list', element).append('<option value='+self.options.preset_location.mechanical[i].name+'>'+self.options.preset_location.digital[i].name+'</option>');
			}


			if ($('.preset_location').length > 0)
			{
				$('#preset', element).tooltip({ 
						events : { def: 'click, mouseleave'},
						position : 'center right',
						tip: '#preset_list',
						effect: 'fade'
				});
			}
			else
			{
				$('#preset').attr('src', 'images/button/ptz/preset_disable.png').attr('usemap', '');
			}
		},

		generateImageMap : function(){
			var self = this, element = $(this.element);

			var R = 57, r = 20, S = 91, R2 = 49;

			//
			var coords = ['', '', '', '', '', '', '', ''];
			for (var x = Number(S-R*Math.cos(Math.PI/4)); x <= Number(S-R*Math.cos(3*Math.PI/4)); x++ )
			{
				var y = S - Number(Math.sqrt(R*R - (x-S)*(x-S)));
				var y2 = S + Number(Math.sqrt(R*R - (x-S)*(x-S)));
				coords[0] = coords[0]+x+','+y;
				coords[1] = coords[1]+y+','+x;
				coords[2] = coords[2]+x+','+y2;
				coords[3] = coords[3]+y2+','+x;
				if (x != Number(S-R*Math.cos(3*Math.PI/4))){
					coords[0]=coords[0]+',';
					coords[1]=coords[1]+',';
					coords[2]=coords[2]+',';
					coords[3]=coords[3]+',';
				}
			}

			for (var x = Number(S-r*Math.cos(3*Math.PI/4)); x >= Number(S-r*Math.cos(Math.PI/4)); x-- )
			{
				var y = S - Number(Math.sqrt(r*r - (x-S)*(x-S)));
				var y2 = S + Number(Math.sqrt(r*r - (x-S)*(x-S)));
				coords[0] = coords[0]+x+','+y;
				coords[1] = coords[1]+y+','+x;
				coords[2] = coords[2]+x+','+y2;
				coords[3] = coords[3]+y2+','+x;
				if (x != Number(S-r*Math.cos(Math.PI/4))){
					coords[0]=coords[0]+',';
					coords[1]=coords[1]+',';
					coords[2]=coords[2]+',';
					coords[3]=coords[3]+',';
				}
			}
			
			S = 39;
			R2 = 20;
			for (var x = S - R2; x <= S + R2; x++ )
			{
				var y = S - Number(Math.sqrt(R2*R2 - (x-S)*(x-S)));
				var y2 = S + Number(Math.sqrt(R2*R2 - (x-S)*(x-S)));
				coords[4] = coords[4]+x+','+y;
				coords[5] = coords[5]+x+','+y2;
				if ( x!= S+R2)
				{
					coords[4]=coords[4]+',';
					coords[5]=coords[5]+',';
				}
			}
			
			for (var y = S - R2; y <= S + R2; y++ )
			{
				var x = S - Number(Math.sqrt(R2*R2 - (y-S)*(y-S)));
				var x2 = S + Number(Math.sqrt(R2*R2 - (y-S)*(y-S)));
				coords[6] = coords[6]+x+','+y;
				coords[7] = coords[7]+x2+','+y;
				if ( y!= S+R2)
				{
					coords[6]=coords[6]+',';
					coords[7]=coords[7]+',';
				}
			}

			for (var i = 0; i < 4; i++)
				coords[i] = coords[i].slice(0, coords[i].length-2);

			element.append('<map name="mapMove"><area title=" " href="#" symbol="alt:move_up" shape=poly coords="'+coords[0]+'" action="move" param="up" img="up" tar="#move" ori="images/button/ptz/ptz_normal.png"><area symbol="alt:move_left" shape=poly coords="'+coords[1]+'" href="#" action="move" param="left" img="left" tar="#move" ori="images/button/ptz/ptz_normal.png"><area symbol="alt:move_down" shape=poly coords="'+coords[2]+'" href="#" action="move" param="down" img="down" tar="#move" ori="images/button/ptz/ptz_normal.png"><area symbol="alt:move_right" shape=poly coords="'+coords[3]+'" href="#" action="move" param="right" img="right" tar="#move" ori="images//button/ptz/ptz_normal.png"><area symbol="alt:move_home" shape="circle" coords="91,91,15" href="#" action="move" param="home" img="home" tar="#move" ori="images/button/ptz/ptz_normal.png"></map>');

			element.append('<map name="mapZoom"><area symbol="alt:zoom_tele" shape=poly coords="'+coords[4]+'" href="#" action="zoom" param="tele" img="plus" tar="#zoom" ori="images/button/ptz/zoom_normal.png"><area symbol="alt:zoom_wide" shape=poly coords="'+coords[5]+'" href="#" action="zoom" param="wide" img="minus" tar="#zoom" ori="images/button/ptz/zoom_normal.png"></map>');
			element.append('<map name="mapFocus"><area symbol="alt:focus_near" shape=poly coords="'+coords[4]+'" href="#" action="focus" param="near" img="plus" tar="#focus" ori="images/button/ptz/zoom_normal.png"><area symbol="alt:focus_far" shape=poly coords="'+coords[5]+'" href="#" action="focus" param="far" tar="#focus" img="minus" ori="images/button/ptz/zoom_normal.png"></map>');
			element.append('<map name="mapPP"><area symbol="alt:auto_pan" shape=poly coords="'+coords[6]+'" href="#" action="pan" param="auto" img="pan" tar="#pan_patrol" ori="images/button/ptz/pan_patrol_normal.png"><area symbol="alt:auto_patrol" shape=poly coords="'+coords[7]+'" href="#" action="patrol" param="auto" img="patrol" tar="#pan_patrol" ori="images/button/ptz/pan_patrol_normal.png"></map>');

			element.append('<map name="mapPreset"><area symbol="alt:preset_location" shape="circle" coords="22,22,22" href="#" action="recall" param="" img="presetlocation" tar="#preset" ori="images/button/ptz/preset_normal.png"></map>');
			element.append('<map name="mapAutoFocus"><area symbol="alt:focus_auto" shape="circle" coords="14,14,14" href="#" action="focus" param="auto" img="auto" tar="#auto_focus" ori="images/button/ptz/auto_normal.png"></map>');
			element.append('<map name="mapStopPP"><area symbol="alt:stop_pan_and_patrol" shape="circle" coords="14,14,14" href="#" action="stop" param="stop" img="stop tar="#stop_pp" ori="images/button/ptz/stop_normal.png"></map>');

			$('area', element).click(function(){
				var action = $(this).attr('action');
				var param = $(this).attr('param');
				var channel = $('.view.active').attr('content');
				if (channel == null) return;
				if (action == 'recall' && $('.preset_location').length > 0)
				{
					$('#preset', element).data('tooltip').show();
					$('#preset_list').show();
					return false;
				}
				$.naxx.teleport.Exec($.naxx.path.encoder+'/'+channel, 'encoder_camctrl', 'action='+action+'&param='+param+'&eptz=false&stream=1', function(res){});
				return false;
			}).mousedown(function(event){
				var param = $(this).attr('img');
				var target = $($(this).attr('tar'));
				target.attr('src', 'images/button/ptz/'+param+'_pressed.png');
			}).mouseup(function(event){
				var param = $(this).attr('img');
				var target = $($(this).attr('tar'));
				target.attr('src', 'images/button/ptz/'+param+'_hover.png');
			}).hover(function(){
				var target = $($(this).attr('tar'));
				var param = $(this).attr('img');
				target.attr('src', 'images/button/ptz/'+param+'_hover.png');
			},
			function(){
				var target = $($(this).attr('tar'));
				var ori = $(this).attr('ori');
				target.attr('src', ori);
			});
			if($.browser.msie)
				$('area', element).focus(function(){
					$(this).blur();
				});
		}
	});
})(jQuery);
