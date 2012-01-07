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
	$.widget("naxx.eventlist", {
		options : {
			channel: 0,
			alarm_data: [],
			bookmark_data: [],
			recording_data: [],
			count: 0
		},

		object: {
			$grid: null
		},

		grid: function(){
			var self = this, element = $(this.element);
		},
		table: function(){
			var self = this, element = $(this.element);
		},
		
		_create : function(){
			var self = this, element = $(this.element);
			$('<div class="nvrtoggler"><span symbol="text:related_alarm"></span><div>').appendTo(element);

			$('<span symbol="title:close_related_alarm_pane"></span>').vivobutton({ name: 'down', type: 'arrow', callback: function(self, element){$(':naxx-alayout').alayout('closePTZ'); element.hide(); element.siblings('span').show(); return false;}}).appendTo(element.find('.nvrtoggler'));

			$('<span symbol="title:open_related_alarm_pane"></span>').vivobutton({ name: 'up', type: 'arrow', callback: function(self, element){$(':naxx-alayout').alayout('openPTZ'); element.hide(); element.siblings('span').show(); return false;}}).hide().appendTo(element.find('.nvrtoggler'));

			element.append('<div class="toolbar"></div><table id="alarm_container"></table>');
			$('<span></span>').vivobutton({ name: 'table', type: 'playrt', subject: '.playrt', callback: function(){
						self.table();
						return false;
			}}).appendTo(element.find('.toolbar'));
			$('<span></span>').vivobutton({ name: 'grid', type: 'playrt', subject: '.playrt', callback: function(){
						self.grid();
						return false;
			}}).appendTo(element.find('.toolbar'));
			self.object.$grid = element.find('table#alarm_container').jqGrid({
						altRows: true,
						//rownumbers: true,
						rowNum: 1000,
						autowidth: true,
						width: 270,
						height: element.height() - element.find('.nvrtoggler').height() - element.find('.toolbar').height(),
						viewrecords: true,
						shrikToFit: true,
						sortable: true,
						datatype: 'local',
						colNames : ['device_name', 'time' , 'utc','type' , 'content'],
						colModel : [
							{ name : 'camera_name', index: 'camera_name', width : 110, align: 'left', sorttype: 'text' },
							{ name : 'start', index: 'start', width : 130, align: 'left', sorttype: 'date', datefmt:'yyyy-m-d H:i:s'},
							{ name : 'utc', index: 'utc', width : 130, align: 'left', sorttype: 'int', hidden: true},
							{ name : 'type', index: 'type', width : 60, align: 'left', sortable: false},
							{ name : 'content', index: 'content', width : 100, align: 'left', edittype: 'select', sorttype: 'text' }
						],
						onSelectRow: function(id){
							var data = self.object.$grid.getRowData(id);
							$(':naxx-view.active').view('play_at', data.utc);
						}
			});
			element.watch('height', function(){
					self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height() - element.find('.nvrtoggler').height() - element.find('.toolbar').height());
			});
		},

		_init : function(){
			var self = this, element = $(this.element);

			self.object.$grid.clearGridData();
			var localOffset = new Date().getTimezoneOffset()*60*1000;
			for (var i = 0; i < self.options.alarm_data.length; i++)
			{
				self.object.$grid.addRowData(i, {camera_name: $.naxx.encoder[self.options.channel].name, type: 'alarm', 'content': self.options.alarm_data[i].type, start: new Date(self.options.alarm_data[i].start/1000).formatDate('yyyy-MM-dd HH:mm:ss'), utc: self.options.alarm_data[i].start});
				self.options.count = i;
			}
			for (var i = 0; i < self.options.bookmark_data.length; i++)
			{
				self.object.$grid.addRowData(i + self.options.count, {camera_name: $.naxx.encoder[self.options.channel].name, type: 'bookmark', 'content': self.options.bookmark_data[i].content, start: new Date(self.options.bookmark_data[i].start/1000).formatDate('yyyy-MM-dd HH:mm:ss'), utc: self.options.bookmark_data[i].start});
			}
			for (var i = 0; i < self.options.recording_data.length; i++)
			{
				self.object.$grid.addRowData(i + self.options.count, {camera_name: $.naxx.encoder[self.options.channel].name, type: 'recording', 'content': new Date((self.options.recording_data[i].end-self.options.recording_data[i].start)/1000+localOffset).formatDate('HH:mm:ss'), start: new Date(self.options.recording_data[i].start/1000).formatDate('yyyy-MM-dd HH:mm:ss'), utc: self.options.recording_data[i].start});
			}

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
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			element.children().remove();
		}
	});
})(jQuery);
