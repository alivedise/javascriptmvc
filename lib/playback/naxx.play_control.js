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
 * Date: 2011-05-21 16:43:23
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.play_control.js
 *
 */

;(function($) {
	$.widget("naxx.play_control", {
		options : {
			begin: 0,
			'final': 2147483647.0,
			channel: 0,
			timezone: '08:00',
			current_day: '',
			current_timestamp: 0,
			recording_data: [],
			alarm_data: [],
			bookmark_data: [],
			play_speed: 0,
			sync: false,
			scale: 7
		},

		object: {
			dogdays: null,
			zoomer: null
		},

		control_buttons: [
			{
				name: 'stop',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:stop'
				},
				callback: function(){
					$(':naxx-view.active').view('controlplayback', 1); //stop
					return false;
				}
			},
			{
				name: 'pause',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:pause'
				},
				callback: function(self, element){
					$(':naxx-view.active').view('controlplayback', 3); //pause
					$(':naxx-play_control').find(':naxx-vivobutton.play').show();
					//element.hide();
					return false;
				}
			},
			{
				name: 'play',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:play'
				},
				callback: function(){
					$(':naxx-view.active').view('controlplayback', 2); //start
					$(':naxx-play_control').find(':naxx-vivobutton.pause').show();
					//element.hide();
					return false;
				}
			},
			{
				name: 'next',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:playback_next'
				},
				callback: function(){
				}
			},
			{
				name: 'sync',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:playback_sync'
				},
				callback: function(){
					//$(':naxx-view.active').view('syncplay', Number($(':naxx-play_control').play_control('option', 'begin')));
					start = $(':naxx-view.active').view('option', 'stime');
					end = $(':naxx-view.active').view('option', 'etime');
					$(':naxx-view').view('remove');
					$(':naxx-view').view({stime: start, etime: end, sync: true});
				}
			},
			{
				name: 'speed_down',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:playback_speeddown'
				},
				callback: function(){
					$(':naxx-view.active').view('speeddown');
					return false;
				}
			},
			{
				name: 'speed_up',
				type: 'PlaybackBtn',
				attr: {
					symbol: 'title:playback_speedup'
				},
				callback: function(){
					$(':naxx-view.active').view('speedup');
					return false;
				}
			}
		],

		toggle_buttons: [
			{
				name: 'di',
				type: 'event_toggle',
				attr: {
					symbol: 'title:toggle_di_event',
					event_type: 'di'
				},
				callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').show();
				},
				deactive_callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').hide();
				}
			},
			{
				name: 'do',
				type: 'event_toggle',
				attr: {
					symbol: 'title:toggle_do_event',
					event_type: 'do'
				},
				callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').show();
				},
				deactive_callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').hide();
				}
			},
			{
				name: 'motion',
				type: 'event_toggle',
				attr: {
					symbol: 'title:toggle_motion_event',
					event_type: 'motion'
				},
				callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').show();
				},
				deactive_callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').hide();
				}
			},
			{
				name: 'pir',
				type: 'event_toggle',
				attr: {
					symbol: 'title:toggle_pir_event',
					event_type: 'pir'
				},
				callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').show();
				},
				deactive_callback: function(self, element){
					$('#homura div.event_data[type='+element.attr('event_type')+']').hide();
				}
			}
		],

		_create: function(){
			var self = this, element = $(this.element);
			element.html('<div class="dogdays" id="homura" utc_start="" utc_end=""></div><div class="control_buttons"></div><div class="toggle_buttons"></div><div class="zoomer"></div>');
			self.object.dogdays = element.find('.dogdays');

			for (var i = 0; i < self.control_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.control_buttons[i]).appendTo($('div.control_buttons', element));
			}
			for (var i = 0; i < self.toggle_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.toggle_buttons[i]).appendTo($('div.toggle_buttons', element));
			}

			$('span.sync', element).after('<span class="PlaybackBtn speed"></span>');
			self.object.zoomer = $('.zoomer', element).slider({
					value: 7,
					max: 7,
					min: 0,
					step: 1,
					range: 'min',
					change: function(event, ui)
					{
						$(':naxx-play_control').play_control('size', ui.value);
					}
			});
			$('<img class="left" src="images/widget/viewcell/half_white_left.png" />').insertBefore(self.object.zoomer.children('div'));
			$('<img class="right" src="images/widget/viewcell/half_white.png" />').insertAfter(self.object.zoomer.children('div'));

			$('<img src="images/widget/playctrl/zoom_in.png" id="timeline_zoomin" />').insertBefore(self.object.zoomer);
			$('<img src="images/widget/playctrl/zoom.png" id="timeline_zoomout" />').insertAfter(self.object.zoomer);
			
			self.object.dogdays.html('<img src="images/widget/playctrl/playback_pointer.png" class="pointer" id="soulgem" />');
			$('#soulgem', element).draggable({
				axis: 'x',
				drag: function(event, ui){
					//$(':naxx-play_control').play_control('renewSoulgem');
					if(ui.position.left < 0 || ui.position.left > self.object.dogdays.width())
						return false;
				},
				stop: function(event, ui){
					$(':naxx-play_control').play_control('renewSoulgem');
				}
			});
		$('<div id="timetip"><span></span><img src="images/widget/playctrl/playback_tooltip.png" /></div>').hide().appendTo(element);
			element.append('<span class="time_indicator_start">00:00</span><span class="time_indicator_1">06:00</span><span class="time_indicator_2">12:00</span><span class="time_indicator_3">18:00</span><span class="time_indicator_end">24:00</span>');
			self.wheel();
		},

		size : function(value)
		{
			var self = this, element = $(this.element);
			self.options.scale = value;
			$(':naxx-view.active').view('option', 'scale', value);
			var d_now = new Date(self.options.current_timestamp);
			var d_start = new Date(self.options.current_day);
			var d_end = d_start.addHours(24);
			var base_start = d_start.getTime();
			var base_end = d_end.getTime();
			var start, end, length;
			switch(value)
			{
				//1min
			case 0:
				d_start = d_now.addMinutes(0);
				d_end = d_now.addMinutes(1);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//4min
			case 1:
				d_start = d_now.addMinutes(-1);
				d_end = d_now.addMinutes(3);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//10min
			case 2:
				d_start = d_now.addMinutes(-3);
				d_end = d_now.addMinutes(7);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//30min
			case 3:
				d_start = d_now.addMinutes(-10);
				d_end = d_now.addMinutes(20);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//1hr
			case 4:
				d_start = d_now.addMinutes(-20);
				d_end = d_now.addMinutes(40);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//3hr
			case 5:
				d_start = d_now.addMinutes(-60);
				d_end = d_now.addMinutes(120);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
				//12hr
			case 6:
				d_start = d_now.addHours(-4);
				d_end = d_now.addHours(8);
				start = d_start.getTime();
				end = d_end.getTime();
				length = end - start;
				break;
							//24hr
			case 7:
				start = new Date(self.options.current_day).getTime();
				end = new Date(self.options.current_day).addHours(24).getTime();
				length = end - start;
				return self.zoom(null);
				break;
			}
			if(start < base_start){
				start = base_start;
				end = start+length;
			}
			if(end > base_end){
				end = base_end;
				start = base_end-length;
			}
			self.zoom(start, end);
		},


		jump: function(utc){
			if($(':naxx-view.active object').length == 0) return;
			if($(':naxx-view.active').view('option', 'stime') == utc) return;
			//var channel = $(':naxx-view.active').view('option', 'content');
			$(':naxx-view.active').view('createPlugin', {stime: utc});
			$.log('public create plugin');
		},

		renewSoulgem : function(offset){
			var self = this, element = $(this.element);
			if (offset == null) offset = $('#soulgem').position().left;
			$('#soulgem', element).css({left: offset/$('#homura').width()*100+'%'});
			var utc_current = self.options.begin + (self.options.final - self.options.begin)*offset/$('#homura').width();

			
			if($(':naxx-view.active object').length == 0) return;
			$(':naxx-view.active').view('play_at', utc_current);
		//	if($(':naxx-view.active').view('option', 'stime') == utc_current) return;
			//var channel = $(':naxx-view.active').view('option', 'content');
		//	$(':naxx-view.active').view('createPlugin', {stime: utc_current});
			$.log('public create plugin');
		},

		renewTooltip : function(offset){
			var self = this, element = $(this.element);
			$('#timetip', element).css({position: 'absolute', left: offset/$('#homura').width()*100+'%', top: 10, 'z-index': 11}).show();
			$('#timetip').css({left: $('#timetip').position().left});
			var utc_current = self.options.begin + (self.options.final - self.options.begin)*offset/$('#homura').width();
			$('#timetip span').text(new Date(utc_current/1000).formatDate('HH:mm:ss'));
		},

		clear: function(){
			var self = this, element = $(this.element);

			self.object.dogdays.find('div').remove();
		},

		_init : function(){
			var self = this, element = $(this.element);

			if($.browser.msie) self.options.current_day = self.options.current_day.replace(/-/g, '/');
			var thisday = new Date(1000*self.options.begin);
			var comingday = new Date(1000*self.options.final);
			comingday.addDays(1);
			self.clear();
			element.removeClass('waitingCGI');
			//self.object.zoomer.slider('value', self.options.scale);
			
			for (var i = 0; i < self.options.recording_data.length; i++)
			{
				//shit ie//
				if($.browser.msie)
				{
					self.options.recording_data[i].begin = self.options.recording_data[i].begin.replace(/\+(\d+):(\d+)/g, "+$1$2").replace(/\.\d{3}/, '').replace(/-/g, '/');

					self.options.recording_data[i].final = self.options.recording_data[i].final.replace(/\+(\d+):(\d+)/g, "+$1$2").replace(/\.\d{3}/, '').replace(/-/g, '/');
				}
				var width = 100*(self.options.recording_data[i].end - self.options.recording_data[i].start)/(self.options.final - self.options.begin)+'%';
				var left = 100*(self.options.recording_data[i].start - self.options.begin)/(self.options.final - self.options.begin)+'%';
				try{
					$('<div class="recording_data" index="'+i+'" start="'+self.options.recording_data[i].start+'" end="'+self.options.recording_data[i].end+'" utc_start="'+self.options.recording_data[i].start+'" utc_end="'+self.options.recording_data[i].end+'"></div>').width(width).css({left: left}).appendTo(self.object.dogdays);
				}
				catch(e)
				{
				}
			}
			
			for (var i = 0; i < self.options.alarm_data.length; i++)
			{
				var left = 100*(self.options.alarm_data[i].start - self.options.begin)/(self.options.final - self.options.begin)+'%';
				$('<div class="event_data" index="'+i+'" start="'+self.options.alarm_data[i].start+'" type="'+self.options.alarm_data[i].type+'"></div>').css({left: left}).appendTo(self.object.dogdays);
			}
			
			for (var i = 0; i < self.options.bookmark_data.length; i++)
			{
				var left = 100*(self.options.bookmark_data[i].start - self.options.begin)/(self.options.final - self.options.begin)+'%';
				$('<div class="bookmark_data" index="'+i+'" start="'+self.options.bookmark_data[i].start+'" title="'+htmlEncode(self.options.bookmark_data[i].content)+'"></div>').css({left: left}).appendTo(self.object.dogdays);
			}

			$(':naxx-vivobutton.event_toggle', element).trigger('click').vivobutton('active');

			self.object.dogdays.bind('mouseleave', function(){
				$('#timetip').fadeOut();
			}).bind('mousemove', function(event){
					if ($(event.target).hasClass('recording_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;
					}
					else if ($(event.target).hasClass('pointer'))
					{
						var length = $(event.target).position().left;
					}
					else if ($(event.target).hasClass('event_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;
					}
					else if ($(event.target).hasClass('bookmark_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;
					}
					else if ($(event.target).hasClass('dogdays'))
					{
						if($.browser.msie)
							var length = event.offsetX;
						else
							var length = event.layerX;
					}
					else 
					{
						return true;
					}

					length = length;
					if(length < 0) length = 0;

					self.renewTooltip(length);

			}).unbind('click').bind('click', function(event){
					if($(event.target).length == 0) return false;
					if ($(event.target).hasClass('recording_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;

						//$('.view.active').view({current_index: Number($(event.target).attr('index'))});
					}
					else if ($(event.target).hasClass('event_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;
					}
					else if ($(event.target).hasClass('bookmark_data'))
					{
						if($.browser.msie)
							var length = $(event.target).position().left + event.offsetX;
						else
							var length = $(event.target).position().left + event.layerX;
					}
					else if ($(event.target).hasClass('dogdays'))
					{
						if($.browser.msie)
							var length = event.offsetX;
						else
							var length = event.layerX;
					}
					else 
					{
						return true;
					}

					if(length < 0) length = 0;

					self.renewSoulgem(length);
					return false;
				});

			if (self.options.recording_data.length == 0)
			{
				 self.disable();
			}
			else
				self.enable();

		},

		enable: function(){
			var self = this, element = $(this.element);
			element.find('.disable_cover').remove();
		},
		disable: function(){
			var self = this, element = $(this.element);
			if($('.disable_cover', element).length == 0) element.append('<div class="disable_cover trans75"></div>');
		},

		dateTransform : function(offset, bIndicator){
			var self = this, element = $(this.element);
			if ( offset < 0 ) offset = - offset;
			var time_offset = 86400*offset/$('#homura', element).width();
			var h = parseInt(time_offset/3600, 10).toString().padL(2, '0');
			var m = (parseInt(time_offset/60, 10)%60).toString().padL(2, '0');
			var s = parseInt(time_offset%60, 10).toString().padL(2, '0');
			if(bIndicator != null && bIndicator) return h+':'+m;
			else return h+':'+m+':'+s+'.000';
		},

		/*沒驗證*/
		updateTimestamp : function(timestamp){
			var self = this, element = $(this.element);
			//if (timestamp <= 100000000) return;
			var left = (timestamp-self.options.begin/1000)/(10*(self.options.final-self.options.begin)/1000000);
			self.options.current_timestamp = timestamp;
			//$('#timetip span').text(new Date(timestamp).formatDate('HH:mm:ss'));
			$('#soulgem').css({left: left+'%'});
			//fix! 
			$('#soulgem').css({left: $('#soulgem').position().left});
			if(self.options.current_timestamp >= self.options.final/1000)
				self.shift(true);
		},

		shift : function(forward){
			var self = this, element = $(this.element);
			var utc_start = self.options.begin;
			var utc_end = self.options.final;
			var utc_length = utc_end - utc_start;

			if(forward)
			{
				self.zoom(1000*(utc_start+utc_length), 1000*(utc_end+utc_length));
			}
			else
			{
				self.zoom(1000*(utc_start-utc_length), 1000*(utc_end-utc_length));
			}
		},

		describeIndicator: function(){
			var self = this, element = $(this.element);
			
		},

		zoom : function(utc_start, utc_end){
			var self = this, element = $(this.element);
			var length = (utc_end - utc_start);
			self.clear(); //clear data first
			element.addClass('waitingCGI');

			if(utc_start == null) //whole day
			{
				$('span.time_indicator_start').text('00:00:00');
				$('span.time_indicator_1').text('09:00:00');
				$('span.time_indicator_2').text('12:00:00');
				$('span.time_indicator_3').text('18:00:00');
				$('span.time_indicator_end').text('24:00:00');
				$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_timeinterval', 'channel='+$(':naxx-view.active').view('option', 'content')+'&start='+self.options.current_day+'T00:00:00+'+self.options.timezone+'&end='+self.options.current_day+'T23:59:59.999+'+self.options.timezone, function(res){
					$.extend(self.options, res);
					self.disable();
					self._init();
					self.enable();
					$(':naxx-view.active').view('option', self.options);
				});
			}
			else
			{

				var utc_interval = utc_end - utc_start;
				var d_start = new Date(utc_start);
				var d_end = new Date(utc_end);
				var hm_end = d_end.formatDate('HH:mm:ss');
				if(hm_end == '00:00:00') hm_end = '24:00:00'
				$('span.time_indicator_start').text(d_start.formatDate('HH:mm:ss'));
				var i1 = d_start.addSeconds(utc_interval/4000);
				$('span.time_indicator_1').text(i1.formatDate('HH:mm:ss'));
				var i2 = d_start.addSeconds(2*utc_interval/4000);
				$('span.time_indicator_2').text(i2.formatDate('HH:mm:ss'));
				var i3 = d_start.addSeconds(3*utc_interval/4000);
				$('span.time_indicator_3').text(i3.formatDate('HH:mm:ss'));
				$('span.time_indicator_end').text(hm_end);
				var left = (self.options.current_timestamp-utc_start)/utc_interval;
				if (left < 0) left = 0;
				else if (left > 1) left = 1;
				$('#soulgem', element).css({left: 100*left+'%'});
				$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_timestampinterval', 'channel='+$(':naxx-view.active').view('option', 'content')+'&begin='+parseFloat(utc_start*1000.0)+'&final='+parseFloat(utc_end*1000.0), function(res){
					$.extend(self.options, res);
					self.disable();
					self._init();
					self.enable();
				});
			}
		},

    	wheel : function() {
			//support wheel
			var self = this, element = $(this.element);
            element.mousewheel(function(event, delta){
				var sliderVal = $('.zoomer', element).slider('value');//increment the current value
				if(delta>0) sliderVal -= 1;
				else if(delta<0) sliderVal += 1;
				if (sliderVal > 7) sliderVal = 7;
				else if (sliderVal < 0) sliderVal = 0;
				$('.zoomer', element).slider('value', sliderVal);
				return false;
			});
		},
		
		destroy : function(){
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$(this.element).children().unbind().remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
		}
	});
})(jQuery);
