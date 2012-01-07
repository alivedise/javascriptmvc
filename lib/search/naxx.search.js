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
 * naxx.<template>
 *
 */

;(function($) {
	$.widget("naxx.search", {
		options : {
			index: 0,
			alarm: 5,
			bookmark: 4,
			$timer: null,
			recording: 4
		},

		_create : function(){
			var self = this, element = $(this.element);
			element.addClass('search');
			$('<div class="top"><div class="searchbar"><form id="searchForm" onsubmit="return false;"><input symbol="value:searching_and_viewing_the_records" type="text" value="" alt="Search event, bookmark, recording data.." id="keyword" /><input id="searchBtn" type="button" symbol="title:search" /></form></div></div><div class="base"><div class="left_col"><span class="title" symbol="text:alarm">Alarm</span><hr/></div><div class="right_col"><div class="right_row"><span class="title" symbol="text:bookmark">Bookmarks</span><hr/></div><div class="right_row"><span class="title" symbol="text:recording">Recording</span><hr/></div></div></div>').appendTo(element);

			$('#keyword').data('unchange', true).focus(function(){
				if($(this).data('unchange'))
					$(this).val('');
			}).blur(function(){
				if($(this).data('unchange') || $(this).val()=='' )
					$.naxx.translate();
			}).change(function(){
				$(this).data('unchange', false);
			});
			$('form', element).keydown(function(event){
				if(event.keyCode == 13 || event.which == 13) //enter
				{
					self.search();
				}
			});
		},

		search: function(){
			var self = this, element = $(this.element);
			$('div.eventlist').searchfilter({});
			$(':naxx-alayout').alayout('openSide');
			$.naxx.teleport.Exec($.naxx.path.mercury, 'search', 'keyword='+htmlEncode($('#keyword').val()), function(res){

			});
		},

		_init : function(){
			var self = this, element = $(this.element);
			$('.rare_item', element).remove();
			for( var i = 0; i < self.options.alarm; i++ )
			{
				$('<div class="rare_item alarm"></div>').appendTo($('.left_col', element));
			}
			for( var i = 0; i < self.options.bookmark; i++ )
			{
				$('<div class="rare_item bookmark"></div>').appendTo($('.right_row:eq(0)', element));
			}
			for( var i = 0; i < self.options.recording; i++ )
			{
				$('<div class="rare_item recording"></div>').appendTo($('.right_row:eq(1)', element));
			}

			self.polling();
		},

		polling: function(){
			var self = this, element = $(this.element);
			$('div.rare_item').hide();
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_last_alarm', 'count='+self.options.alarm+'&index='+self.options.index, function(res){
				$.each(res, function(key, value){
						$('div.rare_item.alarm:eq('+key+')').html('<span class="id">'+value.id+'</span><div><span>'+value.channel+'</span><span>'+$.naxx.encoder[value.channel].name+'</span><br/><span symbol="text:time"></span><span>'+new Date(value.start*1000).formatDate('yyyy/MM/dd hh:mm:ss')+'</span><br/><span symbol="text:event_type"></span><span>'+value.type+'</span></div>').attr({type: 'bookmark', id: value.id, timestamp: value.start, timestamp_end: value.end}).slideDown();
						$.naxx.Snapshot(value.channel, value.start, 0, $('.rare_item.alarm:eq('+key+')'));
						$('<span></span>').vivobutton({type: 'playq', name: 'insert', attr: { symbol: 'title:insert_to_playqueue' }, callback: function(){
								$(':naxx-playqueue').playqueue('add', [{ type: 'alarm', id: value.id, timestamp: value.start, timestamp_end: 0, channel: value.channel}]);
								return false;
						}}).appendTo($('.rare_item.alarm:eq('+key+') .screenshot'));
				});
				$.naxx.translate($.naxx.acl.language, $('.rare_item'));
			});
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_last_bookmark', 'count='+self.options.bookmark, function(res){
				$.each(res, function(key, value){
						$('div.rare_item.bookmark:eq('+key+')').html('<span class="id">'+value.id+'</span><div><span>'+value.channel+'</span><span>'+$.naxx.encoder[value.channel].name+'</span><br/><span symbol="text:time"></span><span>'+new Date(value.start*1000).formatDate('yyyy/MM/dd hh:mm:ss')+'</span><br/><span symbol="text:bookmark"></span><span>'+value.content+'</span></div>').attr({type: 'bookmark', id: value.id, timestamp: value.start, timestamp_end: 0}).slideDown();
						$.naxx.Snapshot(value.channel, value.start, 0, $('.rare_item.bookmark:eq('+key+')'));
						$('<span></span>').vivobutton({type: 'playq', name: 'insert', attr: { symbol: 'title:insert_to_playqueue' }, callback: function(){
								$(':naxx-playqueue').playqueue('add', [{ type: 'bookmark', id: value.id, timestamp: value.start, timestamp_end: 0, channel: value.channel}]);
								return false;
						}}).appendTo($('.rare_item.bookmark:eq('+key+') .screenshot'));
				});
				$.naxx.translate($.naxx.acl.language, $('.rare_item'));
			});
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_last_recording', 'count='+self.options.recording, function(res){
				$.each(res, function(key, value){
						$('div.rare_item.recording:eq('+key+')').html('<span class="id">'+value.id+'</span><div><span>'+value.channel+'</span><span>'+$.naxx.encoder[value.channel].name+'</span><br/><span symbol="text:from"></span><span>'+new Date(value.start*1000).formatDate('yyyy/MM/dd hh:mm:ss')+'</span><br/><span symbol="text:to"></span><span>'+new Date(value.end*1000).formatDate('yyyy/MM/dd hh:mm:ss')+'</span></div>').attr({type: 'bookmark', id: value.id, timestamp: value.start, timestamp_end: value.end}).slideDown();
						$.naxx.Snapshot(value.channel, value.start, 0, $('.rare_item.recording:eq('+key+')'));
						$('<span></span>').vivobutton({type: 'playq', name: 'insert', attr: { symbol: 'title:insert_to_playqueue' }, callback: function(){
								$(':naxx-playqueue').playqueue('add', [{ type: 'recording', id: value.id, timestamp: value.start, timestamp_end: value.end, channel: value.channel}]);
								return false;
						}}).appendTo($('.rare_item.recording:eq('+key+') .screenshot'));
				});
				$.naxx.translate($.naxx.acl.language, $('.rare_item'));
				//self.$timer = setTimeout(function(){self.polling();}, 3000);
			});
			
		},
		
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			if( self.$timer != null ) clearTimeout(self.$timer);
			element.children().unbind().remove();
		}
	});
})(jQuery);
