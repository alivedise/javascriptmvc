/* # 
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
 * Date: 2010-12-20 14:26:14
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.videolist: generate a carousel list to show video files; 
 *                can let you drag it to free views.
 *                A youtube like video files.
 *
 */

;(function($) {
	$.widget("naxx.playqueue", {
		/*Initial options Value of Layout*/
		options : {
			list: [],
			current: 0,
			max: 16
		},
		carousel : null,

		_create: function(){
			var self = this, element = $(this.element);
			var queue_buttons = [
				{
					name: 'goplayback',
					type: 'playq',
					control: element,
					attr: {
						'symbol': 'title:playback'
					},
					callback: function(){}
				},
				{
					name: 'config',
					type: 'playq',
					control: element,
					attr: {
						'symbol': 'title:configuration'
					},
					callback: function(){}
				}
			];
			var pager_buttons = [
				{
					name: 'prev',
					type: 'playq',
					control: element,
					attr: {
						'symbol': 'title:previous'
					},
					callback: function(){
						self.carousel.scrollTail(false);
					}
				},
				{
					name: 'next',
					type: 'playq',
					control: element,
					attr: {
						'symbol': 'title:next'
					},
				callback: function(){
						self.carousel.scrollTail(true);
				}
			}
			];
			if($('.playqueue_tip').length == 0)
			{
				$('<div id="playqueue_tip" class="playqueue_tip"><div id="remove_all_items" symbol="text:remove_all"></div><div id="hide_playqueue" symbol="text:hide_playqueue"></div></div>').appendTo($('body'));
				$('#remove_all_items').click(function(){
					self.remove_all();
					$(this).parent().hide();
				});
				$('#hide_playqueue').click(function(){
					$(':naxx-alayout').alayout('hidequeue');
					$(this).parent().hide();
				});
			}
			element.html('<div class="queue-resizer" symbol="title:toggle_the_playqueue"><span symbol="title:watch_later" class="watch_later"></span><div class="queue-pager"></div></div><ul class="jcarousel-skin-nvr" id="videolist'+$('.videolist').length+'"></ul>');
			for(var i = 0; i < queue_buttons.length; i++)
			{
				$('<img src="images/widget/playqueue/playQue_line.jpg" />').appendTo($('.queue-resizer'));
				$('<span></span>').vivobutton(queue_buttons[i]).appendTo($('.queue-resizer'));
			}
			for(var i = 0; i < pager_buttons.length; i++)
			{
				$('<span></span>').vivobutton(pager_buttons[i]).appendTo($('.queue-pager'));
			}
			element.find('.queue-resizer').toggle(function(event){
				if($(event.target).is('div'))
					$(':naxx-alayout').alayout('togglequeue');
				else
					return false;
			}, function(event){
				if($(event.target).is('div'))
					$(':naxx-alayout').alayout('playqueue');
				else
					return false;
			});
			element.find('.playq.config').unbind('click').tooltip({
					cancelDefault: false,
						events : {
							def: 'mouseenter,mouseleave',
							tooltip: 'mouseenter,mouseleave'
						},
						tip: '#playqueue_tip',
						position : 'top right',
						offset: [0, -25],
						predelay:200, 
						delay:200
			});
		},
		
		_init : function(){
			var self = this, element = $(this.element);
			element.find('.jcarousel-skin-nvr').jcarousel({
					start: 0,
					scroll: 1,
					buttonNextHTML: '<div></div>',
					buttonPrevHTML: '<div></div>',
					buttonNextEvent: 'mouseover',
					buttonPrevEvent: 'mouseover'
			});

			this.carousel = element.find('#videolist'+$('.videolist').length).data('jcarousel');
			this.resetVideoList();
			this.wheel();
			$.naxx.translate($.naxx.acl.language, element);
		},

		showColorCalendar : function(index){

		},

		add: function(array){
			var self = this, element = $(this.element);
			//check for repeat
			if(self.options.list.length >= self.options.max) {
						$.pnotify({
								pnotify_title: '<span symbol="text:Invalid_operation">Invalid operation</span>',
								pnotify_type: 'error',
								pnotify_text: '<span symbol="text:playqueue_exceed_maximum_items">Items in the playqueue has exceeded maximum.</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: stack_bottomright
							});
						return true;
			}
			$.each(array, function(index, value){
				var repeat = false;
				$.each(self.options.list, function(i, v){
					if(value.id == v.id && value.type == v.type)
					{
						repeat = true;
						$.pnotify({
								pnotify_title: '<span symbol="text:Invalid_operation">Invalid operation</span>',
								pnotify_type: 'error',
								pnotify_text: '<span symbol="text:the_item_had_been_in_the_playqueue">The item is already in the playqueue.</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: stack_bottomright
							});
						return true;
					}
				});
				if(repeat) return true;
				self.carousel.add(self.options.list.length, self.gen_ShotBlock(value));
				//self.carousel.size(self.options.count+1);
				element.find('.queueitem:last').attr('index', self.options.list.length);
				$.naxx.Snapshot(value.channel, value.timestamp, 0, element.find('.queueitem:last'), false);
				$('<span class="item_index">'+(self.options.list.length+1)+'</span>').appendTo(element.find('.queueitem:last'));
				$('<span class="timeInterval">'+new Date(value.timestamp/1000).formatDate('HH:mm:ss')+'</span>').appendTo(element.find('.queueitem:last .screenshot'));
				$('<span></span>').vivobutton({
					type: 'playq',
					name: 'delete',
					control: element.find('.queueitem:last'),
					attr: {
						symbol: 'title:remove'
					},
					callback: function(button){
						self.remove(Number(button.options.control.attr('index')));
					}
				}).appendTo(element.find('.queueitem:last .screenshot'));
				self.options.list.push(value);
			});
			element.find('.watch_later').html($.naxx.stranslate('watch_later')+'(<span style="color:#0186d1">'+self.options.list.length+'</span>/<span style="color:orange">16</span>)');
			$.cookie('queue', JSON.stringify(self.options.list), {path: '/', expires: 2});
			self.carousel.size(self.options.list.length);
			//$.cookie('queue', self.options.list.toString());
		},

		remove: function(index){
			var self = this, element = $(this.element);
			self.carousel.reset();
			self.options.list.splice(index, 1);
			var a = self.options.list;
			self.options.list = [];
			self.add(a);
			if(self.options.list.length>0)
				$.cookie('queue', JSON.stringify(self.options.list), {path: '/', expires: 2});
			else
				$.cookie('queue', null);
		},

		remove_all: function(){
			var self = this, element = $(this.element);
			self.carousel.reset();
			self.options.list = [];
			element.find('.watch_later').html($.naxx.stranslate('watch_later')+'(<span style="color:#0186d1">'+self.options.list.length+'</span>/<span style="color:orange">16</span>)');
			$.cookie('queue', null);
		},
		
		getVideoInfo : function(index) {
			return this._list[index];
		},
		
		gen_ShotBlock : function(value){
			var str_innerHTML = '';
			str_innerHTML += '<li><div class="ui-corner-all queueitem"></div></li>';
			
			return str_innerHTML;
		},

		//將列表內容規零
		resetVideoList : function(channel){
			var self = this, element = $(this.element);
			if($.cookie('queue')){
				$(':naxx-alayout').alayout('playqueue');
				var j = eval('('+$.cookie('queue')+')');
				self.add(j);
				//element.find('ul').width('100%');
			}
		},

		slide : function(oriention){
			if (oriention>=0) this.carousel.prev();
			else this.carousel.next();
		},

		/*register wheel event to scroll the camera bar*/
		wheel : function() {
			var self = this;
    	//support wheel
            $(this.element).mousewheel(function(event, delta){
				self.slide(3*delta);
    			event.preventDefault();//stop any default behaviour
			});
		},

		roll: function(index){
			this.carousel.scroll(index, true);
		}
		
	});
})(jQuery);
