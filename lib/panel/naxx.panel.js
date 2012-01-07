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
 * Date: 2011-05-10 17:37:56
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.panel: make a vast-like top-panel
 *
 */

;(function($) {
	$.widget("naxx.panel", {
		/*Initial options Value of Layout*/
		options : {
			mode: 'liveview',
			timezone: 0,
			timestamp: 0,
			width: {
				liveview: 505,
				playback: 395,
				settings: 270
			}
		},
		timer: null,
		object: {
			$upload: null
		},
		layout_buttons : [
			{
				name: 'L1x1',
				type: 'layout',
				attr: { 
					mode: 'liveview,playback', layout: '1x1'
					, symbol: 'title:_1x1'
				},
				subjector: '.layout',
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '1x1');
					$(':naxx-panel').panel('editmode');
					return true;
				}
				,deactive_callback: false
			},
			{
				name: 'L1_3',
				type: 'layout',
				subjector: '.layout',
				attr: { mode: 'liveview,playback', layout: '1_3'
					, symbol: 'title:_1_3_for_4_3'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '1_3');
					$(':naxx-panel').panel('editmode');
				}
				,deactive_callback: false
			},
			{
				name: 'L2x2',
				type: 'layout',
				subjector: '.layout',
				attr: {
					mode: 'liveview,playback', layout: '2x2'
					, symbol: 'title:_2x2'
					//symbol: 'title:2x2'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '2x2');
					$(':naxx-panel').panel('editmode');
				}
				,deactive_callback: false
			},
			{
				name: 'L1_5',
				type: 'layout',
				subjector: '.layout',
				attr: { mode: 'liveview', layout: '1+5'
					, symbol: 'title:_1_5'
					//symbol: 'title:1+5'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '1+5');
					$(':naxx-panel').panel('editmode');
				}
				,deactive_callback: false
			},
			{
				name: 'L4x4',
				type: 'layout',
				subjector: '.layout',
				attr: { mode: 'liveview', layout: '4x4'
					, symbol: 'title:_4x4'
			//		symbol: 'title:4x4'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '4x4');
					$(':naxx-panel').panel('editmode');
				}
				,deactive_callback: false
			},
			{
				name: 'layout1',
				type: 'layout layout_display',
				attr: { 
					mode: 'liveview',
					symbol: 'title:change_user_layout'
				},
				callback: function(){
				//	$('#layout_more').toggle();
				}
			},
			{
				name: 'L1a3',
				type: 'layout',
				subjector: '.layout',
				attr: { mode: 'playback', layout: '1+3'
					, symbol: 'title:_1_3_for_16_9'
					//symbol: 'title:1+3'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayLayout', '1+3');
				}
				,deactive_callback: false
			},
			{
				name: 'alloffline',
				type: 'navBtn',
				attr: { 
					mode: 'playback',
					symbol: 'title:remove_all_viewcells'
				},
				callback: function(){
					$(':naxx-view').view('remove');
					$(':naxx-play_control').play_control('disable');
					return false;
				}
			}
		],
		action_buttons : [
			{
				name: 'page-left',
				type: 'navBtn',
				attr: {
					mode: 'liveview',
					symbol: 'title:layout_page_left'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayPrev');
					return false;
				}
			},
			{
				name: 'page-right',
				type: 'navBtn',
				attr: {
					mode: 'liveview',
					symbol: 'title:layout_page_right'
				},
				callback: function(self, element){
					$(':naxx-vision').vision('displayNext');
					return false;
				}
			},
			{
				name: 'rotate',
				type: 'navBtn',
				attr: { 
					mode: 'liveview',
					symbol: 'title:rotate'
				},
				callback: function(){
					$(':naxx-vision').vision('displayRotate', true);
				},
				deactive_callback: function(){
					$(':naxx-vision').vision('displayRotate', false);
				}
			},
			{
				name: 'alloffline',
				type: 'navBtn',
				attr: { 
					mode: 'liveview',
					symbol: 'title:remove_all_viewcells'
				},
				callback: function(){
					$(':naxx-view').view('remove');
					$(':naxx-panel').panel('editmode');
					return false;
				}
			},
			{
				name: 'toggle',
				type: 'navBtn',
				attr: { mode: 'emap',
					symbol: 'title:toggle_emap_view'
				},
				callback: function(){
					$(':naxx-view .plugin').show();
					$(':naxx-view:visible').addClass('active');
				},
				deactive_callback: function(){
					$(':naxx-view .plugin').hide();
					$(':naxx-view:visible').removeClass('active');
				}
			},
			{
				name: 'upload',
				type: 'navBtn',
				attr: { mode: 'emap',
					symbol: 'title:upload_emap'
				},
				callback: function(){
					//$('#localname').empty();
					$.blockUI({message: $('#emapupload'), css: {top: ($(window).height()-416)/2, border: 'none', 'text-align': 'left', color: 'white', width: '550px', height: '419px', cursor: 'default'}});
					var upload = $('span#ocupload').upload({
							name: 'send_file',
							action: '/fcgi-bin/system.upload',
							autoSubmit: false,
							enctype: 'multipart/form-data',
							onSelect: function(){
								$('#localname').text(upload.filename());
							},
							onComplete: function(result){
								$.naxx.desktop.emap[$('#targetemap').val()].map_path = 'emap/'+ $('#targetemap').val();
								$.naxx.desktop.emap[$('#targetemap').val()].name = $('#name').val();
								$.naxx.teleport.Import($.naxx.path.emap+'/'+$('#targetemap').val(), $.naxx.desktop.emap[$('#targetemap').val()], function(){
										$.unblockUI();
										if($(':naxx-emap').emap('option', 'index') == $('#targetemap').val())
										{
											$('.emapback img').attr('src', $.naxx.desktop.emap[$('#targetemap').val()].map_path);
											$('.minimap img').attr('src', $.naxx.desktop.emap[$('#targetemap').val()].map_path);
											$('.emapSelector span').text($.naxx.desktop.emap[$('#targetemap').val()].name);
										}
									});
							}
						});
					$('#btnUpload').button().click(function(){
						upload.params({'send_path' :  $('#targetemap').val()});
						upload.submit();
					});
					$.naxx.translate();
					return false;
				}
			},
			{
				name: 'theater',
				type: 'navBtn',
				attr: { mode: 'e25D' },
				callback: function(){
					$(':naxx-emap').emap('option', 'layout', 'movie');
					return false;
				}
			},
			{
				name: 'alloffline',
				type: 'navBtn',
				attr: { 
					mode: 'emap',
					symbol: 'title:remove_all_cameras_from_emap'
				},
				callback: function(){
					$(':naxx-emap').emap('removeAllCameras');
					return false;
				}
			}
		],
		switch_buttons : [
			{
				name: 'liveview',
				type: 'nav',
				attr:
				{
					symbol: 'title:live'
				},
				subjector: '.nav',
				callback: function(){
					$.cookie('mode', 'liveview');
					$('.panel').panel('liveview');
				}
				,deactive_callback: false
			},
			{
				name: 'playback',
				type: 'nav',
				subjector: '.nav',
				attr:
				{
					symbol: 'title:playback_control'
				},
				callback: function(){
					$.cookie('mode', 'playback');
					window.location.href = '';
					//$('.panel').panel('playback');
				}
				,deactive_callback: false
			},
/*			{
				name: 'emap',
				type: 'nav',
				subjector: '.nav',
				attr:
				{
					symbol: 'title:emap'
				},
				callback: function(){
					//$.cookie('mode', 'emap');
					$(':naxx-panel').panel('emap');
				}
				,deactive_callback: false
			},*/
			{
				name: 'settings',
				type: 'nav',
				subjector: '.nav',
				attr:
				{
					symbol: 'title:configuration'
				},
				callback: function(){
					$.cookie('mode', 'settings');
					$(':naxx-panel').panel('settings');
				}
				,deactive_callback: false
			}
		],

		object: {
			layout: null,
			vision: null,
			body: null,
			action_pane: null,
			layout_pane: null,
			//info_pane: null,
			divider: null
		},
		
		playback: function(){
			var self = this, element = $(this.element);
			self.options.mode = 'playback';
			if(!self.checkUnsaved()) return false;
			$.blockUI({message: '<img src="images/gif/stream-loader.gif" />', css: {cursor: 'wait', border: 'none', background: 'none'}, overlayCSS: {cursor: 'wait'}});
			setTimeout(function(){
					$(':naxx-alayout').alayout('playback');
					self.options.mode = 'playback';

					$('.cameraslider', element).show();
					self.object.layout.sizePane('east', self.options.width.playback);
					self.object.action_pane.hide();
					self.object.layout_pane.show();
					self.object.divider.show();
					$(':naxx-vivobutton[mode]', element).hide();
					$(':naxx-vivobutton[mode*=playback]', element).show();
					$.naxx.translate();
				$.unblockUI();
			}, 500);
		},

		change: function(){
			var self = this, element = $(this.element);
			switch(self.options.mode)
			{
			case 'liveview':
				self.liveview();
				break;
			case 'playback':
				self.playback();
			case 'search':
				self.search();
			case 'settings':
				self.settings();
			case 'emap':
				self.emap();
			}
		},

		liveview: function(){
			var self = this, element = $(this.element);
			self.options.mode = 'liveview';
			if(!self.checkUnsaved()) return false;
			$.blockUI({message: '<img src="images/gif/stream-loader.gif" />', css: {cursor: 'wait', border: 'none', background: 'none'}, overlayCSS: {cursor: 'wait'}});
			setTimeout(function(){
					$('.cameraslider', element).show();
					$(':naxx-alayout').alayout('liveview');
					$('.layout_display').removeClass('layout1 layout2 layout3 layout4').addClass('layout1');
					self.object.layout.sizePane('east', self.options.width.liveview );
					self.object.action_pane.show();
					self.object.layout_pane.show();

					self.object.divider.show();
					$(':naxx-vivobutton[mode]', element).hide();
					$(':naxx-vivobutton[mode*=liveview]', element).show();
					$.naxx.translate();
			$.unblockUI();
			$('*').each(function(index){
				
				if($(this).attr('id') == '')
					try{
						$(this).attr('id') = $(this).attr('class').replace(' ',',')+index;
					}
				catch(e)
				{
				}

			});
			}, 500);
		},

		emap: function(){
			var self = this, element = $(this.element);
			return false;
			self.options.mode = 'emap';
			if(!self.checkUnsaved()) return false;
			$.blockUI({message: '<img src="images/gif/stream-loader.gif" />', css: {cursor: 'wait', border: 'none', background: 'none'}, overlayCSS: {cursor: 'wait'}});
			setTimeout(function(){
					self.options.mode = 'emap';
					$(':naxx-alayout').alayout('emap');
					$('.cameraslider', element).show();
					self.object.layout.sizePane('east', self.options.width.emap);
					self.object.action_pane.show();
					self.object.layout_pane.hide();
					self.object.divider.show();
					$(':naxx-vivobutton[mode]', element).hide();
					$(':naxx-vivobutton[mode*=emap]', element).show();
					if($.naxx.acl.settings == false && $.naxx.acl.username != 'admin')
					{
						$('span.navBtn.upload').hide();
					}
		
				$.naxx.translate();
			$.unblockUI();
			}, 500);
		},

		settings: function(){
			var self = this, element = $(this.element);
			self.options.mode = 'settings';
			if(!self.checkUnsaved()) return false;
			if(!$.naxx.acl.settings && $.naxx.acl.username != 'admin'){
				self.options.mode = 'liveview';
				self._init();
				if($.naxx.loader)
					$.naxx.loader.pnotify({
						pnotify_title: '<span symbol="text:no_permission">No permission</span>',
						pnotify_type: 'error',
						pnotify_text: '<span symbol="text:you_dont_have_permission_to_access_settings_redirect_to_liveview">You don\'t have permission to access configuration page; redirect to liveview page.</span>',
						pnotify_addclass: 'stack-bottomright',
						pnotify_delay: $.naxx.pnotify_timeout,
						pnotify_history: false,
						pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15},
						pnotify_after_close: function(){
							$.naxx.loader = null;
						}
					});
				else
				{
					$.pnotify({
						pnotify_title: '<span symbol="text:no_permission">No permission</span>',
						pnotify_type: 'error',
						pnotify_text: '<span symbol="text:you_dont_have_permission_to_access_settings_redirect_to_liveview">You don\'t have permission to access configuration page; redirect to liveview page.</span>',
						pnotify_addclass: 'stack-bottomright',
						pnotify_delay: $.naxx.pnotify_timeout,
						pnotify_history: false,
						pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15},
						pnotify_after_close: function(){
							$.naxx.loader = null;
						}
					});
				}
				return false;
			}

			$.blockUI({message: '<img src="images/gif/stream-loader.gif" />', css: {cursor: 'wait', border: 'none', background: 'none'}, overlayCSS: {cursor: 'wait'}});

			setTimeout(function(){
					self.options.mode = 'settings';
					$('.cameraslider', element).show();
					self.object.layout.sizePane('east', self.options.width.settings);
					$(':naxx-alayout').alayout('settings');
					self.object.layout_pane.hide();
					self.object.action_pane.hide();
					self.object.divider.hide();
					$(':naxx-vivobutton[mode]', element).hide();
					$(':naxx-vivobutton[mode*=settings]', element).show();
					$.naxx.translate();
				$.unblockUI();
			}, 500);
		},

		search: function(){
			var self = this, element = $(this.element);
			self.options.mode = 'search';
			if(!self.checkUnsaved()) return false;
			//self.object.layout.hide('east');
			$.blockUI({message: '<img src="images/gif/stream-loader.gif" />', css: {cursor: 'wait', border: 'none', background: 'none'}, overlayCSS: {cursor: 'wait'}});
			setTimeout(function(){
					self.options.mode = 'search';
					$(':naxx-alayout').alayout('search');
					self.object.layout_pane.hide();
					self.object.action_pane.hide();
					self.object.divider.hide();
					$('.cameraslider', element).hide();
					$.naxx.translate();
			$.unblockUI();
			}, 500);
		},
		
		skipeditmode: function(){
			var self = this, element = $(this.element);
			$('.edit:visible,.edit:animated', element).stop().hide('fade');
		},

		editmode : function(){
			var self = this, element = $(this.element);
			if (self.options.mode != 'playback' && (($.naxx.acl.settings) || ($.naxx.acl.username == 'admin')))
			{
				$('.edit', element).show('fade');
				switch(self.options.mode)
				{
				case 'liveview':
					var index = Number($(':naxx-vision').vision('option', 'index'));
					var symbol='';
					switch(index){
					case 0: symbol="text:layout_content_has_been_changed_do_you_want_to_save_into_user_layout_1";
						break;
					case 1: symbol="text:layout_content_has_been_changed_do_you_want_to_save_into_user_layout_2";
						break;
					case 2: symbol="text:layout_content_has_been_changed_do_you_want_to_save_into_user_layout_3";
						break;
					case 3: symbol="text:layout_content_has_been_changed_do_you_want_to_save_into_user_layout_4";
						break;
					}
					$('.edit div.q').html($.naxx.stranslate(symbol.split(':')[1])+'?');
					break;
				case 'emap':
					var index = Number($(':naxx-emap').emap('option', 'index'));
					var symbol = '';
					switch(index){
					case 0: symbol="text:emap_content_has_been_changed_do_you_want_to_save_into_emap_config_1";
						break;
					case 1: symbol="text:emap_content_has_been_changed_do_you_want_to_save_into_emap_config_2";
						break;
					case 2: symbol="text:emap_content_has_been_changed_do_you_want_to_save_into_emap_config_3";
						break;
					case 3: symbol="text:emap_content_has_been_changed_do_you_want_to_save_into_emap_config_4";
						break;
					}
					$('.edit div.q').html($.naxx.stranslate(symbol.split(':')[1])+'?');
					break;
				case 'settings':
					var symbol="text:you_have_not_save_change_do_you_want_to_leave";
					$('.edit div.q').html($.naxx.stranslate(symbol.split(':')[1])+'?');
					break;
				}
			}
		},


		symbols: {
			l1_symbol: 'title:switch_to_user_layout_1',
			l2_symbol: 'title:switch_to_user_layout_2',
			l3_symbol: 'title:switch_to_user_layout_3',
			l4_symbol: 'title:switch_to_user_layout_4', 
			s1_symbol: 'text:set_1',
			s2_symbol: 'text:set_2',
			s3_symbol: 'text:set_3',
			s4_symbol: 'text:set_4'
		},

		/*Overriding _init of $.widget*/
		_create: function(){
			var self = this, element = $(this.element);
			element.html('<div class="cameraslider slider-pane"></div><div class="fix-pane"><div><img class="divider" src="images/widget/toppanel/BannerDividLine.jpg" /></div><div class="layout-pane"><div class="title"><span symbol="text:layout"></span></div></div><div class="action-pane"></div><div><img class="divider" src="images/widget/toppanel/BannerDividLine.jpg" /></div><div class="menu-pane"><div class="infoboard"><img src="images/widget/toppanel/bannerInfoBoard.png" /></div><div class="navigator"></div><div class="edit"><div class="q" /><button id="yes" symbol="text:save">Save layout</button><button id="no" symbol="text:cancel">Exit</button></div></div>');
			$('.edit #yes').click(function(){
				$(':naxx-vision').vision('saveVision');
				$(':naxx-emap').emap('saveMap');
				$('.edit', element).hide('fade');
			}).button();
			$('.edit #no').click(function(){
				$('.edit', element).hide('fade');
			}).button();
			self.object.layout = element.layout({
				closable: false,
				resizable: false,
				slidable: false,
				showOverflowOnHover: false,

				//東邊pane大小
				east__size: self.options.width.liveview,
				east__spacing_open:0,//邊框的間隙
				east__spacing_closed:0, //關閉時邊框的間隙
				east__paneSelector: '.fix-pane', //關閉時邊框的間隙
				//西邊pane大小
				center__paneSelector: '.slider-pane',
				onresize_end: function(){
					$(':naxx-cameraslider').cameraslider('resize');
				}

			});
				
			for (var i = 0; i < self.layout_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.layout_buttons[i]).appendTo($('.layout-pane', element));
				//if ( i % 2 == 1 ) $('<br/>').appendTo($('.layout-pane', element));
			}
			for (var i = 0; i < self.action_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.action_buttons[i]).appendTo($('.action-pane', element));
				//if ( i % 2 == 1 ) $('<br/>').appendTo($('.action-pane', element));
			}
			for (var i = 0; i < self.switch_buttons.length; i++)
			{
				$('<span></span>').vivobutton(self.switch_buttons[i]).appendTo($('.menu-pane .navigator', element));
			}
			$('<div id="layout_more"><div><span symbol="text:user_layout"></span></div></div>').appendTo($('body'));
			$('span.layout.layout1', element).unbind('click').tooltip({
					tip: '#layout_more', 
					position: 'bottom right',
					offset: [-20, -27],
					cancelDefault: false,
						//events: { def: 'click,mouseleave', tooltip:'mouseenter,mouseleave'}
					onBeforeShow: function(){
						var tip = this.getTip();
						if(tip.find(':naxx-vivobutton').length == 0)
						{
							tip.empty().text('').append('<div><span symbol="text:user_layout"></span></div>');
							for (var i = 1; i <= 4; i++)
							{
								$('<span vision="'+(i-1)+'"><span symbol="text:set_'+i+'"></span></span>').vivobutton({
									name: 'layout'+i,
									type: 'layout',
									attr:{
										symbol: 'title:switch_to_user_layout_'+i
									},
									callback:  function(self, element){
										$(':naxx-panel').panel('skipeditmode');
										$(':naxx-vision span:animated').stop();
										$(':naxx-vision').vision($.extend($.naxx.desktop.vision[element.attr('vision')], {index: element.attr('vision')}));
										$('.layout_display').removeClass('layout1 layout2 layout3 layout4').addClass('layout'+(Number(element.attr('vision'))+1));
										return false;
									}
								}).appendTo(tip);
							}
							tip.find('span[vision]').wrap('<div class="layout"></div>');
							$('div.layout:first').addClass('first');
							$.naxx.translate($.naxx.acl.language, tip);
						}
					}
			});
			$('<span class="user"><span class="username" title="'+$.naxx.acl.username+'">'+$.naxx.acl.username+'</span><span class="logout">(<a id="logout" href="#" symbol="text:logout">Logout</a>)</span></span>').appendTo($('div.infoboard'));
			$('<select id="multilingual" name="multilingual" class="hidden"></select>').appendTo($('div.infoboard'));
			for (var i = 0; i < $.naxx.language.length; i++)
			{
				$('<option value='+i+'>'+$.naxx.language[i]+'</option>').appendTo($('#multilingual'));
			}
			$('#multilingual').change(function(){
				$.naxx.translate($(this).val());
			}).val($.naxx.acl.language).trigger('change');
			if($.naxx.acl.settings == false && $.naxx.acl.username != 'admin')
			{
				$('span.nav.setting').vivobutton('disable');
				$('span.navBtn.upload').hide();
			}
			$('#logout').click(function(){
				$.naxx.blockWarn('<span symbol="text:do_you_really_want_to_logout">Do you really want to logout?</span><br/><button id="btnlogout" symbol="text:logout">Logout</button><button id="btncancel" symbol="text:cancel">Cancel</button>');
				$('#btnlogout').button().click(function(){
					$.naxx.teleport.Logout(function(){
						$.unblockUI();
						window.location.href = '';
						return false;
					});
				});
				$.naxx.translate();
				$('#btncancel').button().click(function(){$.unblockUI();});
			});

			$('<div class="blocklogo"><img src="images/VIVOTEK_logo.png" /></div>"').appendTo($('.infoboard', element));

			/*$('<span></span>').vivobutton({name:'search', type: 'navBtn', attr: {symbol:'title:search'}, callback: function(){
				$(':naxx-panel').panel('search');
				return false;
			}}).appendTo($('.infoboard', element));*/
					
			self.object.vision = $('.vision');
			self.object.layout_pane = $('.layout-pane', element);
			self.object.action_pane = $('.action-pane', element);
			self.object.divider = $('img.divider', element);
			$('.edit', element).hide();

			$('<div id="emapupload"><h3>Upload e-map image</h3><hr/><p><span id="ocupload" symbol="text:emap_select_image_to_upload">select an image to upload</span><span id="localname"></span></p><p><label for="#name" symbol="text:rename_emap">rename e-map</label><input type=text value="" id="name" /></p><p><label for="targetemap" symbol="text:replace_emap">replace emap:</label><select id="targetemap"></select></p><p class="button"><button id="btnUpload" symbol="text:upload">Upload</button><button id="btnCancel" symbol="text:cancel">Cancel</button></p><img symbol="alt:no_image" src="" class="targetshot" id="targetshot" alt="No image"></div>').appendTo($('body'));

			for (var i = 0; i < $.naxx.capability.emap; i++)
			{
				$('#targetemap').append('<option value='+i+'></option>');
			}

			$('#targetemap').change(function(){
				$('#targetshot').attr('src', $.naxx.desktop.emap[$(this).val()].map_path);;
				$('#name').val($.naxx.desktop.emap[$(this).val()].name);;
			});

			$('#btnCancel').button().click(function(){
				$.unblockUI();
				$('#emapupload').hide();
			});

			$('<span class="system_time"></span>').appendTo($('.infoboard', element));

			self.getSystemTime();
		},

		getSystemTime: function(){
			var self = this, element = $(this.element);
			var d = new Date();
			var localOffset = d.getTimezoneOffset() * 60;
			$.naxx.teleport.Exec($.naxx.path.raphael, 'exec_get_system_time', '', function(res){
				self.options.timezone = res.timezone;
				self.options.timestamp = res.timestamp;
				$('.system_time', element).text(new Date((res.timestamp-res.timezone+localOffset)*1000).formatDate('yyyy-MM-dd HH:mm:ss'));
				if (self.timer != null) clearInterval(self.timer);
				self.timer = setInterval(function(){self.updateTime()}, 1000);
			});
		},

		updateTime : function(){
			var self = this, element = $(this.element);
			self.options.timestamp += 1;
			var localOffset = new Date().getTimezoneOffset()*60;
			//$('.system_time', element).text(new Date((self.options.timestamp-self.options.timezone+localOffset)*1000).formatDate('yyyy-MM-dd')+new Date((self.options.timestamp-self.options.timezone+localOffset)*1000).formatDate('HH:mm:ss'));
			$('.system_time', element).text(new Date((self.options.timestamp-self.options.timezone+localOffset)*1000).formatDate('yyyy-MM-dd HH:mm:ss'));
		},

		checkUnsaved: function(mode){
			var self = this, element = $(this.element);
			if( !$.naxx.discard && $('.settingCell div.clear').data('widget') && $('.settingCell div.clear').data('widget').modelChanged() ) {
				$.naxx.blockWarn('<span symbol="text:you_have_unsaved_change_to_settings_do_you_really_want_to_leave"></span><br/><button class="block" id="savenow" symbol="text:save_now" /></button><button symbol="text:discard" id="discard" class="block"></button><button symbol="text:cancel" id="cancel" class="block"></button>');
				$('#savenow').button().click(function(){
						$.naxx.discard = true;
						$('.settingCell div.clear').data('widget').apply();
						$.unblockUI();
					});
				$('#discard').button().click(function(){
						$.naxx.discard = true;
						self.change(mode);
						$.naxx.discard = false;
					});
				$('#cancel').button().click(function(){
						$.unblockUI();
					});
				return false;
			}
			$.naxx.discard = false;
			return true;
		},

		_init: function(){
			var self = this, element = $(this.element);
			switch(self.options.mode)
			{
			case 'emap':
			case 'liveview':
				$('span.nav.liveview').vivobutton('active');
				$('span.page-left', element).vivobutton('disable');
				self.liveview();
				break;
			case 'playback':
				$('span.nav.playback').vivobutton('active');
				self.playback();
				break;
			case 'settings':
				$('span.nav.settings').vivobutton('active');
				if(!$.naxx.acl.settings && $.naxx.acl.username != 'admin'){
					self.options.mode = 'liveview';
					self._init();
					if($.naxx.loader)
						$.naxx.loader.pnotify({
							pnotify_title: '<span symbol="text:no_permission">No permission</span>',
							pnotify_type: 'error',
							pnotify_text: '<span symbol="text:you_dont_have_permission_to_access_settings_redirect_to_liveview">You don\'t have permission to access configuration page; redirect to liveview page.</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_delay: $.naxx.pnotify_timeout,
							pnotify_history: false,
							pnotify_stack: false,
							pnotify_after_close: function(){
								$.naxx.loader = null;
							}
						});
					else
					{
						$.pnotify({
							pnotify_title: '<span symbol="text:no_permission">No permission</span>',
							pnotify_type: 'error',
							pnotify_text: '<span symbol="text:you_dont_have_permission_to_access_settings_redirect_to_liveview">You don\'t have permission to access configuration page; redirect to liveview page.</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_delay: $.naxx.pnotify_timeout,
							pnotify_history: false,
							pnotify_stack: false,
							pnotify_after_close: function(){
								$.naxx.loader = null;
							}
						});
					}
				}
			}
		}
	});
})(jQuery);

