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
 * Date: 2011-05-21 09:33:21
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 * 
 * naxx.dateSelector: calendar to select date;
 *
 */

;(function($) {
	$.widget("naxx.dateSelector", {
		options : {
			channel: -1,
			dates: [],
			current: '',
			timezone: '08:00'
		},


		_create : function(){
			var self = this, element = $(this.element);
			$('<div class="nvrtoggler"><span symbol="text:calendar_selector"></span></div>').appendTo(element);
			
			$('<span symbol="title:close_side"></span>').vivobutton({ name: 'left', type: 'arrow', callback: function(self, element){$(':naxx-alayout').alayout('closeSide'); return false;}}).appendTo(element);


			element.addClass('dateSelector').DatePicker({
					flat: true,
					date: self.options.dates,
					mode: 'multiple',
					calendars: 1,
					starts: 1,
					onMonth: function(current){
						element.DatePickerClear();
						self.options.current = current;
						$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_month', 'channel='+self.options.channel+'&date='+current,
							function(res){
							var tmp = new Array();
							for (var i = 0; i < res.length; i++)
							{
								tmp.push(self.options.current+'-'+res[i]);
							}
							if(tmp.length > 0)
							{
								element.unblock();
								element.DatePickerSetDate(tmp, true);
							}
							else
							{
						//		element.find('tbody.datepickerDays').block({message: '<img src="images/noimage.png"></img>', css: {background: 'none', border: 'none'}});
								element.block({message: '<img src="images/widget/snapshot/noimage.png"></img>', css: {background: 'none', border: 'none'}});
							}
						});
					},
					onDay: function(selected){
						$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_timeinterval', 'channel='+self.options.channel+'&start='+selected+'T00:00:00+'+self.options.timezone+'&end='+selected+'T23:59:59+'+self.options.timezone, function(res){
							var $insert = $('.plugin.free:eq(0)');
							if($('.plugin.occupied').length >= 4)
							{
								$insert = $('.plugin.occupied:eq(0)');
							}
						
							res.stime = res.begin;
							res.etime = res.final;
							if($('.plugin.occupied').length > 0 && $(':naxx-vision').vision('option', 'layout') == '1x1')
							{
								$(':naxx-vision').vision('displayLayout', '2x2');
							}
							$insert.parent().view($.extend({type: 'playback', content: self.options.channel}, res)).view('setFocus');
							$(':naxx-eventlist').eventlist($.extend(res, {channel: self.options.channel}));
						});
					},
					onRender: function(date){
						return {};
					}
			});
		},

		_init: function(){
			var self = this, element = $(this.element);
			element.DatePickerClear();
			if (self.options.channel < 0 ) return;
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_recent_month', 'channel='+self.options.channel,
				function(res){
					if(res != {} && res.current != '')
					{
						self.options.current = res.current;
						var tmp = new Array();
						for (var i = 0; i < res.dates.length; i++)
						{
							tmp.push(self.options.current+'-'+res.dates[i]);
						}
						if(tmp.length > 0)
						{
							element.unblock();
							element.DatePickerSetDate(tmp, true);
						}
						else
						{
							element.block({message: '<img src="images/widget/snapshot/noimage.png"></img>', css: {background: 'none', border: 'none'}});
							//element.find('tbody.datepickerDays').block({message: '<img src="images/noimage.png"></img>', css: {background: 'none', border: 'none'}});
						}
					}
					else
					{
						//element.find('.datepickerDays').block({message: '<img src="images/noimage.png"></img>', css: {background: 'none', border: 'none'}});
						element.block({message: '<img src="images/widget/snapshot/noimage.png"></img>', css: {background: 'none', border: 'none'}});
					}
			});
		},
		
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.removeClass('dateSelector').children().remove();
		}
	});
})(jQuery);
