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
 * Date: 2011-05-21 16:11:58
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.eventlist.js: create eventlist
 *
 */

;(function($) {
	$.widget("naxx.alarmlist", {
		options : {
			channel: 0,
			count: 10,
			now: '',
			index: 0,
			current: 0,
			new_alarm_count: 0,
			event_data: [],
			inited: false,
			$timer : null
		},
		
		_create : function(){
			var self = this, element = $(this.element);
			$('<div class="nvrtoggler"><span symbol="text:alarm">Alarm</span><div>').appendTo(element);
			$('<span></span>').vivobutton({ name: 'left', type: 'arrow', attr: { symbol: 'title:close_side_panel'}, callback: function(self, element){$(':naxx-alayout').alayout('closeSide');return false;}}).appendTo(element);
			element.append('<div class="alarm_container"></div>');
			if($('#alarm_tip').length == 0){
				$('body').append('<div id="alarm_tip"><div class="description"><div class="name" /><div class="screenshot" /><div><span symbol="text:event_type"></span><span>:&nbsp;</span><span class="event_type"></span></div><div><span class="time"></span></div></div><div class="buttons"><button id="playback_alarm" class="block"></button><button id="insert_playqueue" class="block"></button></div>');
				$('#playback_alarm').button({icons: {primary: 'naxx-icon-playback'}, label: $.naxx.stranslate('playback')}).click(function(){
					if($(this).attr('timestamp') == '') return;
					$(':naxx-vivobutton.nav').removeClass('active').addClass('normal');
					$(':naxx-vivobutton.nav.playback').addClass('active').removeClass('normal').trigger('mousedown').trigger('mouseup');
				});
				$('#insert_playqueue').button({icons: {primary: 'ui-icon-plus'}, label: $.naxx.stranslate('play_later')}).click(function(){
					if($(this).attr('timestamp') == '') return;
					$(':naxx-alayout').alayout('playqueue');
					var a = new Array();
					a.push({timestamp: Number($(this).attr('timestamp')), channel: Number($(this).attr('channel')), type: 'alarm', id: Number($(this).attr('id'))});
					$(':naxx-playqueue').playqueue('add', a);
				});
			}
		},

		_init : function(){
			var self = this, element = $(this.element);

			$('.alarm_container', element).empty();

			self.options.now = new Date();
		},

		query: function(){
			var self = this, element = $(this.element);
			if(self.options.inited) return;
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_last_alarm', 'count='+self.options.count, function(res){
				$.each(res, function(index, value){
					$('<div class="event_record new_alarm" event_type="'+value.type+'" channel="'+value.channel+'" start='+value.start+' index="'+value.id+'"><span class="alarm_index hidden">'+value.id+'</span><span class="text event_source">'+(value.channel+1)+'.'+$.naxx.encoder[value.channel].name+'</span><span class="text event_time">&nbsp;('+new Date(value.start/1000).formatDate('yyyy/MM/dd hh:mm:ss')+')</span><span class="event_type">'+value.type+'</span></div>').hide().tooltip({ 
						events : {
							def: 'mouseenter,mouseleave',
							tooltip: 'mouseenter,mouseleave'
						},
						position : 'bottom right',
						offset: [-10, -150],
						predelay:200, 
						delay:200,
						tip: '#alarm_tip',
						onBeforeShow: function(){
							var alarm = this.getTrigger();
							var tip = this.getTip();
							tip.find('.event_type').text(alarm.find('.event_type').text());
							tip.find('.time').text(alarm.find('.event_time').text());
							tip.find('.name').text(alarm.find('.event_source').text());
							tip.find('.screenshot').stop().remove();
							$.naxx.Snapshot(alarm.attr('channel'), Number(alarm.attr('start')), 0, tip, true);
							tip.find('button').attr('timestamp', alarm.attr('start')).attr('channel', alarm.attr('channel')).attr('id', alarm.attr('index'));
							alarm.removeClass('new_alarm');
						},
						onHide: function(){
							var alarm = this.getTrigger();
							var tip = this.getTip();
							alarm.removeClass('new_alarm');
							tip.find('.screenshot').stop().remove();
						}
					}).appendTo($('.alarm_container', element)).slideDown();
					if(value.id>self.options.index) self.options.index = value.id;
				});
				//self.$timer = setInterval(function(){self.polling();}, 10000);
			});
			self.options.inited = true;
		},

		polling: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_alarm_since', 'index='+self.options.index, function(res){
				self.options.new_alarm_count += res.length;
				if(self.options.new_alarm_count > 0)
				{
					if($('.nvrtoggler .new_alarm').length == 0)
						$('<span class="new_alarm">'+self.options.new_alarm_count+'</span>').insertAfter($('.nvrtoggler span', element));
					$('.nvrtoggler span.new_alarm').text(self.options.new_alarm_count);
				}
				$.each(res, function(index, value){
					$('<div class="event_record new_alarm" start='+value.start+' index="'+value.id+'" channel="'+value.channel+'"><span class="alarm_index">'+value.id+'</span><span class="text event_source">'+(value.channel+1)+'.'+$.naxx.encoder[value.channel].name+'</span><span class="text event_time">&nbsp;('+new Date(value.start/1000).formatDate('hh:mm:ss')+')</span><span class="event_type">'+value.type+'</span></div>').hide(
					).tooltip({ 
						events : {
							def: 'mouseenter,lol',
							tooltip: 'mouseenter,mouseleave'
						},
						position : 'bottom right',
						offset: [-10, -150],
						predelay:200, 
						delay:200,
						tip: '#alarm_tip',
						onBeforeShow: function(){
							var alarm = this.getTrigger();
							var tip = this.getTip();
							tip.find('.event_type').text(alarm.find('.event_type').text());
							tip.find('.time').text(alarm.find('.event_time').text());
							tip.find('.name').text(alarm.find('.event_source').text());
							tip.find('.screenshot').stop().remove();
							$.naxx.Snapshot(alarm.attr('channel'), Number(alarm.attr('start')), 0, tip, true);
							tip.find('button').attr('timestamp', alarm.attr('start')).attr('channel', alarm.attr('channel')).attr('id', alarm.attr('index'));
							alarm.removeClass('new_alarm');
						},
						onHide: function(){
							var alarm = this.getTrigger();
							var tip = this.getTip();
							alarm.removeClass('new_alarm');
							tip.find('.screenshot').stop().remove();
						}
					}).prependTo($('.alarm_container', element)).slideDown('slow');
					self.options.current = value.id+1;
					if(value.id>self.options.index) self.options.index = value.id;
				});
			});
		},

		match : function(){
			var self = this, element = $(this.element);
		},

		toggle : function(){
			var self = this, element = $(this.element);
			if ( self.options.display == 'text' )
			{
				$('img.screenshot', element).hide();
			}
			else
			{
				$('span.text', element).hide();
			}
		},
	
		destroy : function(){
			var self = this, element = $(this.element);
			if(self.$timer!=null) clearInterval(self.$timer);
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$(this.element).children().unbind().remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			element.children().unbind().remove();
		}
	});
})(jQuery);
