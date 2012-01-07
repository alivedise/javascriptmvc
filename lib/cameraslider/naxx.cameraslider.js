/* # 
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
 * Date: 2011-05-09 13:18:15
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.cameraslider: new camera slider
 *
 */

;(function($) {
	$.widget("naxx.cameraslider", {
		options : {
			mode: 'liveview',
			inited: false,
			max_do_count: 8,
			max_di_count: 8,
			sortby: '',
			top: 0
		},

		object: {
			$encoder: null,
			$timer: null
		},

		status_symbols: {
			'CAM_INIT':
			{
				symbol: 'title:the_camera_is_loading'
			},
			'CAM_ACTIVE':
			{
				symbol: 'title:the_camera_is_online'
			},
			'CAM_OFFLINE':
			{
				symbol: 'title:the_camera_is_offline'
			},
			'CAM_EMPTY':
			{
				symbol: 'title:the_camera_is_not_configured'
			},
			'CAM_DI':
			{
				symbol: 'title:the_camera_di_is_triggered'
			},
			'CAM_DO':
			{
				symbol: 'title:the_camera_do_is_triggered'
			}
		},

		buttons: [
			{
				name: 'page-up',
				type: 'navBtn',
				attr: {
					symbol: 'title:page_up'
				},
				callback: function(self, element){
					if($('.encoder_pool:animated').length>0) return false;
					$(':naxx-cameraslider').cameraslider('slidePrev');
					return false;
				}
			},
			{
				name: 'page-down',
				type: 'navBtn',
				attr: {
					symbol: 'title:page_down'
				},
				callback: function(self, element){
					if($('.encoder_pool:animated').length>0) return false;
					$(':naxx-cameraslider').cameraslider('slideNext');
					return false;
				}
			}
		],
		toggle_buttons: [
			{
				name: 'toggle online',
				type: 'status',
				subjector: '.status.toggle',
				attr: {
					symbol: 'title:sort_with_online_camera',
					'toggle': 'CAM_ACTIVE'
				},
				callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					$(':naxx-cameraslider').cameraslider('sortby', 'active');
					return true;
				},
				deactive_callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					return true;
				}
			},
			{
				name: 'toggle offline',
				type: 'status',
				subjector: '.status.toggle',
				attr: {
					symbol: 'title:sort_with_offline_camera',
					'toggle': 'CAM_OFFLINE'
				},
				callback: function(self, element){
					element.vivobutton('active');
					$(':naxx-cameraslider').cameraslider('sortby', '');
					$(':naxx-cameraslider').cameraslider('sortby', 'offline');
					return true;
				},
				deactive_callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					return false;
				}
			},
			{
				name: 'toggle cancel',
				type: 'status',
				subjector: '.status.toggle',
				attr: {
					symbol: 'title:sort_with_unconfigured_camera',
					'toggle': 'none'
				},
				callback: function(self, element){
					element.vivobutton('active');
					$(':naxx-cameraslider').cameraslider('sortby', '');
					$(':naxx-cameraslider').cameraslider('sortby', 'empty');
					return true;
				},
				deactive_callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					return false;
				}
			},
			{
				name: 'toggle di_on',
				type: 'status',
				subjector: '.status.toggle',
				attr: {
					symbol: 'title:sort_with_di_triggered_camera',
					'toggle': 'di'
				},
				callback: function(self, element){
					element.vivobutton('active');
					$(':naxx-cameraslider').cameraslider('sortby', '');
					$(':naxx-cameraslider').cameraslider('sortby', 'di');
					return true;
				},
				deactive_callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					return true;
				}
			},
			{
				name: 'toggle do_on',
				type: 'status',
				subjector: '.status.toggle',
				attr: {
					symbol: 'title:sort_with_do_triggered_camera',
					'toggle': 'do'
				},
				callback: function(self, element){
					element.vivobutton('active');
					$(':naxx-cameraslider').cameraslider('sortby', '');
					$(':naxx-cameraslider').cameraslider('sortby', 'do');
					return true;
				},
				deactive_callback: function(self, element){
					$(':naxx-cameraslider').cameraslider('sortby', '');
					return true;
				}
			}
		],
		'do': {
				name: 'do',
				type: 'cam_io',
				attr: {
					symbol: 'title:trigger_camera_do'
				},
				callback: function(self, element){
					var channel = Number(element.attr('channel'));
					var index = Number(element.attr('index'));
					$.naxx.teleport.Exec($.naxx.path.encoder+'/'+channel, 'encoder_trigger_do', 'channel='+element.attr('index')+'&switch=1', function(){
						$.naxx.status[channel]['do'][index] = 1;
						element.next().html('DO/'+'<span style="color:#0186D1;">ON</span>');
						$(':naxx-cameraslider').cameraslider('polling');
						//instant polling after sending trigger do
					});
					return true;
				},
				deactive_callback: function(self, element){
					var channel = Number(element.attr('channel'));
					var index = Number(element.attr('index'));
					$.naxx.teleport.Exec($.naxx.path.encoder+'/'+channel, 'encoder_trigger_do', 'channel='+element.attr('index')+'&switch=0', function(){
						$.naxx.status[channel]['do'][index] = 0;
						element.next().html('DO/OFF');
					});
					return false;
				}
		},
		'manual': {
				name: 'manual',
				type: 'cam_rec',
				symbols: { 
					active_symbol: 'title:stop_manual_recording',
					normal_symbol: 'title:start_manual_recording',
					disable_symbol: 'title:manual_recording_disabled'
				},
				callback: function(self, element){
					element.addClass('active').removeClass('normal').siblings('.io_text').html($.naxx.stranslate('manual')+'/'+'<span style="color:orange;">ON</span>');;
					$.naxx.teleport.Exec($.naxx.path.rec+'/'+element.attr('channel'), 'rec_start', '', function(){
						$(':naxx-cameraslider').cameraslider('polling');
						//instant polling after sending trigger do
					});
					return true;
				},
				deactive_callback: function(self, element){
					element.addClass('normal').removeClass('active').siblings('.io_text').html($.naxx.stranslate('manual')+'/OFF');
					$.naxx.teleport.Exec($.naxx.path.rec+'/'+element.attr('channel'), 'rec_stop', '', function(){
						$(':naxx-cameraslider').cameraslider('polling');
						//instant polling after sending trigger do
					});
					return false;
				}
		},

		_create : function(){
			var self = this, element = $(this.element);

			element.addClass('cameraslider');
			element.html('<div class="title"><span symbol="text:camera_list"></span></div><div class="toggler"></div><div class="pager"></div><div class="encoder_pool"></div></div>');
			if($('.encoder_tip').length == 0)
			{
				$('<div class="encoder_tip" id="encoder_tip"><div class="name"></div><div><div class="info"><span symbol="text:address"></span><span>:&nbsp;</span><span class="address">-</span></div><div class="info"><span symbol="text:model"></span><span>:&nbsp;</span><span class="model">-</span><div class="info"><span class="multichannel"><span symbol="text:device_channel"></span><span>/</span><span symbol="text:channel_count"></span><span>:&nbsp;</span><span class="channel" /></span></div></div></div><div class="rec_list"><span class="di_part"><span class="cam_rec schedule" /><br/><span class="io_text">Schedule/OFF</span></span><span class="do_part"><br/><span class="io_text">Manual/OFF</span></span></div><ul class="jcarousel-skin-nvr io_list" id="io_list"></ul></div>').appendTo('body');
				$('<span></span>').vivobutton(self['manual']).prependTo($('.encoder_tip .rec_list .do_part'));
				$('#encoder_tip').disableSelection();
				$('#io_list').jcarousel({vertical: true});
				$('#encoder_tip').find('.jcarousel-prev-vertical').attr('symbol', 'title:page_up');
				$('#encoder_tip').find('.jcarousel-next-vertical').attr('symbol', 'title:page_down');
			}
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				$('<span class="encoder" channel="'+i+'" status="CAM_INIT"><div class="status"><span class="camera status" /><span class="di status" /><span class="do status" /></div><span class="name">'+(i+1)+'</span></span>').vivobutton({type: 'encoder', attr:{channel: i, di_count: 0, do_count: 0}}).appendTo($('.encoder_pool', element));
			}
			
			for (var i = 0; i < self.buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.buttons[i]).appendTo($('.pager', element));
			}
			for (var i = 0; i < self.toggle_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.toggle_buttons[i]).appendTo($('.toggler', element));
			}

			self.object.$encoder = $('.encoder', element);
			$('.page-up.navBtn', element).vivobutton('disable');
			$('.encoder_pool', element).width(element.width() - $('.pager', element).width());
			$('.toggler', element).css({right: element.width() + 3 - 107*parseInt($('.encoder_pool').width()/107, 10)});
			if(self.options.mode!='settings'){
				self.options.top = $('.encoder_pool:visible', element).position().top;
				self.wheel();
				$('.di,.do', element.find('.encoder')).hide();
			}
			else
			{
				if(self.object.$timer != null)
				{
					clearTimeout(self.object.$timer);
					self.object.$timer = null;
				}
			}
			this.getCameraList();
		},

		resize: function(){
			var self = this, element = $(this.element);
			$('.encoder_pool', element).width(element.width() - $('.pager', element).width()).css({'top': self.options.top});
			$('.toggler', element).css({right: element.width() + 3 - 107*parseInt($('.encoder_pool').width()/107, 10)});
			$('.page-up.navBtn', element).vivobutton('disable');
			element.data('goal_top', self.options.top);
			self.checkNext();
		},

		wheel: function(){
			var self = this, element = $(this.element);
            element.mousewheel(function(event, delta){
				if(delta > 0)
				{
					if($('.encoder_pool:animated').length>0) return false;
					self.slidePrev();
				}
				else if(delta < 0)
				{
					if($('.encoder_pool:animated').length>0) return false;
					self.slideNext();
				}
				return false;
			});
		},

		/*_drag: function(){
			var self = this, element = $(this.element);
			if(typeof($.naxx.encoder[0].address) != 'undefined')
			{
				$('.encoder', element).each(function(index, value){
					if($.naxx.encoder[index].status != 'CAM_ACTIVE')
					{
						continue;
					}
					switch(self.options.mode)
					{
					case 'liveview':
					case 'emap':
						$(this).draggable({
							revert: "invalid", // when not dropped, the item will revert back to its initial position
				            containment: "body",
							appendTo: 'body',
							helper: "clone",
							cursor: "move",
							zIndex: 10000
						});
					}
					break;
				});
			}
		},*/

		_init : function(){
			var self = this, element = $(this.element);

			self.object.$encoder.unbind('dblclick');
			switch(self.options.mode)
			{
			case 'liveview':
				$('.encoder_pool', element).show();
				$('.pager', element).show();
				$('.toggler', element).show();
				$('.title', element).show();
				break;
			case 'playback':
				$('.encoder_pool', element).show();
				$('.pager', element).show();
				$('.toggler', element).show();
				$('.title', element).show();
				$('.encoder', element).click(function(){
					$(':naxx-dateSelector').dateSelector({channel: $(this).attr('channel')});
					self.object.$encoder.removeClass('active');
					$(this).addClass('active');
				});
				break;
			case 'emap':
				$('.encoder_pool', element).show();
				$('.pager', element).show();
				$('.toggler', element).show();
				$('.title', element).show();
				$('.encoder', element).draggable({
						revert: "invalid", // when not dropped, the item will revert back to its initial position
			            containment: "body",
						appendTo: 'body',
						helper: "clone",
						cursor: "move",
						zIndex: 10000
					});
				break;
			case 'settings':
				$('.encoder_pool', element).hide();
				$('.pager', element).hide();
				$('.toggler', element).hide();
				$('.title', element).hide();
				break;
			case 'search':
				break;
			}

			$('.encoder_pool', element).css({top: self.options.top});
			self.reloadSnapshot();
		},

		livebinding: function(){
			var self = this, element = $(this.element);
			$('.encoder', element).unbind('dblclick').dblclick(function(){
				if( $('.plugin.occupied').length >= $.naxx.capability.encoder )
				{
					$.pnotify({
						pnotify_title: '<span symbol="text:not_available_operation">Not available operation.</span>',
						pnotify_type: 'error',
						pnotify_text: '<span symbol="text:you_cannot_have_more_than_16_active_viewcells_in_the_same_time">You cannot have more than 16 active viewcells in the same time.</span>',
						pnotify_addclass: 'stack-bottomright',
						pnotify_history: false,
						pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
					});
					return;
				}
				$('.plugin.free:eq(0);').parent().view({content: Number($(this).attr('channel')), type: 'liveview'});
				$(':naxx-panel').panel('editmode');
			}).draggable({
				revert: "invalid", // when not dropped, the item will revert back to its initial position
			    containment: "body",
				appendTo: 'body',
				helper: "clone",
				cursor: "move",
				zIndex: 10000,
				start: function(){
					$(this).trigger('lol');
				}
			}).bind('mouseleave', function(event){
				if ($(event.relatedTarget).attr('id') != 'encoder_tip')
					$(this).trigger('lol');
			}).unbind('mouseover,mousenter').each(function(){
				$(this).tooltip({
					position: 'bottom right',
					tip: '#encoder_tip',
					offset: [-15, -107],
					events: {
						def: 'mouseenter,lol',
						tooltip: 'mouseenter,mouseleave'
					},
					predelay:200, 
					delay:200,
					onShow: function(){
						var tip = this.getTip();
						var encoder = this.getTrigger();
						var index = Number(encoder.attr('channel'));
						tip.attr('channel', index);
						//if(tip.find('.io_list:visible').length == 0 ) return;
						tip.find('.io_list').data('jcarousel').reset();
						if(typeof($.naxx.encoder[index]) != 'undefined')
						{
							tip.find('.address').text($.naxx.encoder[index].address);
							tip.find('.model').text($.naxx.encoder[index].model);
							if($.naxx.encoder[index].channel_count>1) tip.find('.multichannel').show();
							else tip.find('.multichannel').show();
							tip.find('.name').html('<span>'+(index+1)+'.'+$.naxx.encoder[index].name+'</span>').attr('title', (index+1)+'.'+$.naxx.encoder[index].name);
						}
						var more = $.naxx.encoder[index].di_count > $.naxx.encoder[index].do_count ? $.naxx.encoder[index].di_count : $.naxx.encoder[index].do_count;
						for (var i = 0; i < more; i++)
						{
								tip.find('.io_list').data('jcarousel').add(i, '<li index='+i+'><span class="index">'+(i+1)+'.</span><span class="di_part" /><span class="do_part" /></li>');
								tip.find('.io_list').data('jcarousel').size(i+1);
						}
						for (var i = 0; i < $.naxx.encoder[index].di_count; i++)
						{
							$('<span class="cam_io di normal" index="'+i+'"></span><span class="io_text">DI/OFF</span>').appendTo(tip.find('.io_list>li[index='+i+'] .di_part'));
						}
						for (var i = 0; i < $.naxx.encoder[index].do_count; i++)
						{
							$('<span index="'+i+'" channel="'+index+'"></span>').vivobutton(self['do']).appendTo(tip.find('.io_list>li[index='+i+'] .do_part'));
							$('<span class="io_text">DO/OFF</span>').appendTo(tip.find('.io_list>li[index='+i+'] .do_part'));
						}

						tip.find('.manual').attr('channel', index);

						try{
							tip.find('.cam_io.di').each(function(){
								var i = Number($(this).attr('index'));
								if(typeof($.naxx.status[index]['di'][i]) == 'undefined' || $.naxx.status[index]['di'][i] == 0)
									$(this).removeClass('active').addClass('normal').next().html('DI'+'/'+'OFF');
								else
									$(this).removeClass('normal').addClass('active').next().html('DI'+'/'+'<span style="color:#0186d1">ON</span>');
							});
							tip.find('.cam_io.do').each(function(){
								var i = Number($(this).attr('index'));
								if(typeof($.naxx.status[index]['do'][i]) == 'undefined' || $.naxx.status[index]['do'][i] == 0)
									$(this).vivobutton('enable').next().html('DO'+'/'+'OFF');
								else
									$(this).vivobutton('active').next().html('DO'+'/'+'<span style="color:#0186d1">ON</span>');
							});
							tip.find('.schedule').attr('status', $.naxx.rec[index]['schedule']);
							tip.find('.manual').attr('status', $.naxx.rec[index]['manual']);
							if($.naxx.rec[index]['schedule'] == 'ON')
							{
								tip.find('.schedule').addClass('active').removeClass('normal').siblings('.io_text').html($.naxx.stranslate('schedule')+'/<span style="color:orange">ON</span>');
							}
							else
							{
								tip.find('.schedule').addClass('active').removeClass('normal').siblings('.io_text').html($.naxx.stranslate('schedule')+'/OFF');
							}
							if($.naxx.rec[index]['manual'] == 'ON')
							{
								tip.find('.manual').vivobutton('active').siblings('.io_text').html($.naxx.stranslate('manual')+'/<span style="color:orange">ON</span>');
							}
							else
							{
								tip.find('.manual').vivobutton('enable').siblings('.io_text').html($.naxx.stranslate('manual')+'/OFF');
							}
							if($.naxx.encoder[index].status != 'CAM_ACTIVE')
							{
								tip.find('.manual').vivobutton('disable').siblings('.io_text').html($.naxx.stranslate('manual')+'/OFF');
							}
							if($.naxx.encoder[index].channel_count > 1)
							{
								tip.find('.multichannel').show().find('.channel').text($.naxx.encoder[index].device_channel+1+'/'+$.naxx.encoder[index].channel_count);
							}
							else
							{
								tip.find('.multichannel').hide();
							}
						}
						catch(e)
						{
						}
						tip.find('.jcarousel-prev-vertical').attr('symbol', 'title:page_up');
						tip.find('.jcarousel-next-vertical').attr('symbol', 'title:page_down');
						tip.find('li[index]').each(function(){ if($(this).find('.di,.do').length == 0) $(this).remove(); });
						$.naxx.translate($.naxx.acl.languague, $('#encoder_tip'));
					}
			});
			});
			$('.encoder[status=CAM_EMPTY]', element).unbind('dblclick').draggable('destroy');
			$('.encoder_tip').bind('mouseleave', function(event){
				//if($(event.target).hasClass('encoder_tip'))
					$('.encoder[channel='+$(this).attr('channel')+']').trigger('lol');
				//else
				//	return false;
			}).bind('mousewheel', function(event, delta){
					if(delta > 0)
						$('#io_list').data('jcarousel').prev();
					else
						$('#io_list').data('jcarousel').next();
			});
		},

		getCameraList : function(){
			var self = this;
			$.naxx.teleport.Export($.naxx.path.encoder, function(res)
				{
					var dif = false;
					if($.naxx.encoder != res) dif = true;
					$.naxx.encoder = {};
					$.extend($.naxx.encoder, res);
					$(':naxx-alarmlist').alarmlist('query');
					if(dif) self.loadEncoder();
					self.polling();
					if(self.options.mode!='settings') 
						self.object.$timer = setTimeout(function(){self.getCameraList()}, 5000);
				}
			);

		},

		polling : function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Export($.naxx.path.rec_status, function(res){
					$.extend($.naxx.rec, res);
					$.each(res, function(key, value){
						if( value.schedule == 'ON' || value.manual == 'ON')
						{
							$('.view[content='+Number(key)+'] .streaming_status').removeClass('live').addClass('recording').attr('title', $.naxx.stranslate('recording'));
						}
						else
						{
							$('.view[content='+Number(key)+'] .streaming_status').removeClass('recording').addClass('live').attr('title', $.naxx.stranslate('live_streaming'));
						}
						if( value.schedule == 'ON' )
						{
						
						}
						else
						{

						}
						if( value.manual == 'ON' )
						{

						}
						else
						{

						}
					});
			}, function(){});
			$.naxx.teleport.Export($.naxx.path.harute+'/status', function(res){
				$.extend($.naxx.status, res);
				$.each(res, function(key, value){
					var one = false;
					var index = -1;
					$.each(value['di'], function(k, v){
						if(v == 1){
							one = true;
							index = k;
							return false;
						}
					});
					if(!one || index < 0)
					{
						$('.encoder[channel='+key+']', element).find('span.di.status').hide();
					}
					else
					{
						$('.encoder[channel='+key+']', element).find('span.di.status').show().attr('title', 'DI');
					}
					var one = false;
					var index = -1;
					$.each(value['do'], function(k, v){
						if(v == 1){
							one = true;
							index = k;
							return false;
						}
					});

				if(!one || index < 0)
					{
						$('.encoder[channel='+key+']', element).find('span.do.status').hide();
					}
					else
					{
						$('.encoder[channel='+key+']', element).find('span.do.status').show().attr('title', 'DO');
					}
				});
				self.sortby(self.options.sortby);
			});
		},

		reloadSnapshot: function(){
			var self = this, element = $(this.element);
			$('.encoder', element).each(function(){
				var encoder = $(this);
				var index = Number($(this).attr('channel'));
				if($(this).find('img').length == 0) $(this).append('<img src="images/blank.png"></img>');
				var image = $(this).find('img');
				var d = new Date();

				var img = new Image();
				encoder.addClass('loading');
				$(img).load(function(){
					$(this).hide();
					encoder.append(this).removeClass('loading');
					$(this).fadeIn();
				})
				.error(function (res) {
					encoder.addClass('noimage').removeClass('loading');
				})
				.attr('src', 'images/SNAP-'+index+'-Latest.jpg');

			});
		},

		loadEncoder: function(){
			var self = this, element = $(this.element);
			$('.encoder', element).each(function(){
					var index = Number($(this).attr('channel'));

					/*filter 1*/
					if ($.naxx.encoder[index].status == 'CAM_FILTER')
					{
						$(this).remove();
						return;
					}

					/*filter 2*/
					if ($.naxx.encoder[index].address == '') var status = 'CAM_EMPTY';
					else{
						var status = $.naxx.encoder[index].status;
						if (status != 'CAM_ACTIVE') status = 'CAM_OFFLINE';
					}

					$(this).attr({'status': status, 'address': $.naxx.encoder[index].address, model: $.naxx.encoder[index].model}).find('.name').text((index+1)+'.'+$.naxx.encoder[index].name);
					$(this).find('.camera.status').attr('title', $.naxx.stranslate(self.status_symbols[status].symbol.split(':')[1]));
					if(!self.options.inited)
					{
					}
			});
			if(self.options.mode == 'liveview') self.livebinding();

			self.options.inited = true;
			self.checkNext();
		},

		sortby : function(sortby){
			var self = this, element = $(this.element)
			self.options.sortby = sortby;
			switch(self.options.sortby)
			{
			case 'active':
				var encoder = $('.encoder[status=CAM_ACTIVE]', element).get();
				$('.encoder_pool', element).prepend(encoder);
				//$('.encoder:hidden', element).fadeIn('slow');
				break;
			case 'offline': 
				var encoder = $('.encoder[status=CAM_OFFLINE]', element).get();
				$('.encoder_pool', element).prepend(encoder);
				//$('.encoder:hidden', element).fadeIn('slow');
				break;
			case 'empty':
				var encoder = $('.encoder[status=CAM_EMPTY]', element).get();
				$('.encoder_pool', element).prepend(encoder);
				//$('.encoder:hidden', element).fadeIn('slow');
				break;
			case 'di':
				var encoder = $('.di.status:visible', element).parent().parent().get();
				$('.encoder_pool', element).prepend(encoder);
				//$('.encoder:hidden', element).fadeIn('slow');
				break;
			case 'do':
				var encoder = $('.encoder .do.status:visible', element).parent().parent().get();
				$('.encoder_pool', element).prepend(encoder);
				//$('.encoder:hidden', element).fadeIn('slow');
				break;
			default:
				self.recover();
				break;
			}
		},

		recover : function(){
			var self = this, element = $(this.element);
			var encoder = $('.encoder', element).get();

			encoder.sort(function(a, b){
				var channelA = $(a).attr('channel');
				var channelB = $(b).attr('channel');
				return channelA - channelB;
			});

			$('.encoder_pool', element).append(encoder);
		},


		checkNext: function(){
			var self = this, element = $(this.element);
			if($('.encoder:visible', element).length == 0)
			{
				$('.page-up.navBtn', element).vivobutton('disable');
				$('.page-down.navBtn', element).vivobutton('disable');
			}
			if($('.encoder_pool', element).height() <= element.height())
			{
				$('.page-down.navBtn', element).vivobutton('disable');
			}
			else
				$('.page-down.navBtn', element).vivobutton('enable');

		},

		slideNext : function(){
			var self = this, element = $(this.element);

			$('.page-down.navBtn', element).vivobutton('disable');
			element.data('current_top', $('.encoder_pool', element).position().top);
			$('.encoder_pool', element).stop(true, true).css({top: element.data('goal_top')});
			if ($('.encoder:eq(0)', element).height() - element.data('current_top') < $('.encoder_pool', element).height() - element.height())
			{
				element.data('goal_top', element.data('current_top') - element.height());
				$('.encoder_pool', element).animate({top: element.data('goal_top')}, function(){
						if ($('.encoder:eq(0)', element).height() - element.data('goal_top') < $('.encoder_pool', element).height() - element.height())
							$('.page-down.navBtn', element).vivobutton('enable');
				});
				$('.page-up.navBtn', element).vivobutton('enable');
			}
			else
				element.data('goal_top', $('.encoder_pool', element).position().top);
		},
		
		slidePrev : function(){
			var self = this, element = $(this.element);

			$('.page-up.navBtn', element).vivobutton('disable');
			element.data('current_top', $('.encoder_pool', element).position().top);
			$('.encoder_pool', element).stop(true, true).css({top: element.data('goal_top')});
			if (element.data('current_top') < 0)
			{
				element.data('goal_top', $('.encoder_pool', element).position().top + element.height());
				$('.encoder_pool', element).animate({top: element.data('goal_top')}, function(){
					if ( element.data('goal_top') < 0)
						$('.page-up.navBtn', element).vivobutton('enable');
				});
				$('.page-down.navBtn', element).vivobutton('enable');
			}
			else
				element.data('goal_top', $('.encoder_pool', element).position().top);
		},
		
		destroy : function(){
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$(this.element).children().unbind().remove();
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			if(self.object.$timer!=null) clearTimeout(self.object.$timer);
			element.children().remove();
		}
	});
})(jQuery);
