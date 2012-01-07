/* 
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
 * Date: 2010-11-17 11:09:28
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.view: liveview: make a plugin and related control buttons
 *
 */

;(function($) {
	$.widget("naxx.view", {
		options : {
			name: '',
			begin: 0,
			'final': 2147483647.0,
			type : 'liveview',
			ip : '',
			content : -1,
			stream : -1,
			index : -1,
			stime : '', //for playback
			etime : '',
			current_index: -1,
			current_day: '',
			recording_data: [],
			event_data: [],
			bookmark_data: [],
			width: '100%',
			height: '100%',
			top: '0%',
			left: '0%',
			//for vision only
			mtop: 0,
			mleft: 0,
			mwidth: 0,
			mheight: 0,
			play_speed: 1,
			min_width: 301,
			sync: false,
			scale: 7,
			interval: 10*60,
			encoder: {}
		},

		tie2Encoder: function(encoder){
			var self = this, element = $(this.element);
			try{
				if(typeof(encoder) == 'undefined') encoder = $.naxx.encoder[self.options.content];
			}
			catch(e)
			{
				return;
			}

			$.extend(self.options.encoder, encoder);
			if(self.options.encoder.enable_fisheye)
			{
				var fisheye = [
					'f1O', 'f1P', 'f1R', 'f1O1R', 'f2P', 'f1P2R', 'f1O3R', 'f4R', 'f4RPRO', 'f1P3R', 'f1O8R'
				];

				$('<span class="mounting_type"><button index=0 symbol="text:wall" /><button index=1 symbol="text:cieling" /><button index=2 symbol="text:floor" /></span>').appendTo($('.top_rightside', element));

				$('.mounting_type button').button().click(function(){
					var index = Number($(this).attr('index'));
					self.createPlugin({windowed: 1, ChangePresentMode: self.VivoPlugin.ChangePresentMode, enable_fisheye: 1, fisheye_mounttype: index});
				});
				$('.mounting_type').buttonset();

			
				$.each(fisheye, function(index, value)
				{
					$('<span mode='+index+'></span').vivobutton({name: value, type: 'fisheye', callback: function(itself, button){
						self.createPlugin({windowed: 1, ChangePresentMode: index+1, enable_fisheye: 1});
						return true;
					},
					deactive_callback: function(itself, button){
						self.createPlugin({windowed: 0, ChangePresentMode: 0, enable_fisheye: 1});
						return true;
					}
					}).appendTo($('.top_rightside', element));
					$('span.fisheye[mode='+index+']', element).addClass(value.length>4?'wide':'');
				});

				$.naxx.translate($.naxx.acl.language, $('.fisheye_controller', element));
			}
		},

		intervals: [
			{
				option: '5s',
				symbol: 'text:_5s',
				value: 5
			},
			{
				option: '10s',
				symbol: 'text:_10s',
				value: 10
			},
			{
				option: '30s',
				symbol: 'text:_30s',
				value: 30
			},
			{
				option: '1min',
				symbol: 'text:_1min',
				value: 60
			},
			{
				option: '5min',
				symbol: 'text:_5min',
				value: 300
			},
			{
				option: '10min',
				symbol: 'text:_10min',
				value: 600
			},
			{
				option: '30min',
				symbol: 'text:_30min',
				value: 1800
			},
		],

		object : {
			$volume: null,
			$plugin: null,
			$control: null
		},
		
		/*Overriding _create function*/
    	_create : function() {
    		var self = this, element = $(this.element);
			element.addClass(this.options.type);
			if($('.viewcell_tip').length == 0)
			{
				$('<div id="viewcell_tip" class="viewcell_tip"></div>').appendTo($('body'));
			}
			//element.attr('vid', $('div.view').length);
		},

		_init: function() {
			var self = this, element = $(this.element);
			element.attr({'content': self.options.content, type: self.options.type});
			element.html('<div class="plugin free"></div><div class="cover"></div><div class="controlbtn"></div>');
			if(element.hasClass('ui-droppable')) element.droppable('destroy');

			switch(self.options.type)
			{
				case 'liveview':
				case 'playback':
					self._createPlugin();
					break;
				case 'emap':
					element.append('<div class="emap emapcamera"><span class="camimg"></span></div>');
					self.createControl();
					element.show();
					break;
				default:
					self._createPlugin();
					break;
			}

			element.css({top: self.options.top, left: self.options.left, width: self.options.width, height: self.options.height});
			//Calculate mtop/mleft
			if(self.options.type == 'emap')
			{
				self.options.mtop = self.options.top;
				self.options.mleft = self.options.left;
				element.removeClass('active').find('.cover,.plugin').hide();
				self.options.width = '320';
				self.options.height = '240';
			}
			this.binding();
		},							

		status: function(){
			var self = this, element = $(this.element);
			if(this.VivoPlugin == null) return 0;
			else if(this.VivoPlugin.StreamStatus == 0) return 0;
			else return 1;
		},

		setFocus : function() {
			var self = this, element = $(this.element);
			var width = self.options.width, height = self.options.height, top = self.options.top, left = self.options.left;
			element.find('input').focus();

			switch(self.options.type){
				case 'playback':
					$(':naxx-play_control').play_control(self.options);
					if(this.VivoPlugin != null)
					{
						if(this.VivoPlugin.StreamStatus == 0)	//Stop
						{
							//$(':naxx-play_control').find(':naxx-vivobutton.pause').hide();
							$(':naxx-play_control').find(':naxx-vivobutton.play').show();
						}
						else  //Connected
						{
							//$(':naxx-play_control').find(':naxx-vivobutton.pause').show();
						//	$(':naxx-play_control').find(':naxx-vivobutton.play').hide();
						}
					}
				case 'instantplayback':
				case 'liveview':
					if(element.hasClass('active'))
					{
						if ($(':naxx-vision').vision('option', 'layout') != '1x1')
						{
							self.max();
							return;
						}
						else
							return;
					}
					else
					{
						if ($(':naxx-vision').vision('option', 'layout') == '1x1')
						{
							width =  $(':naxx-vision').width() - 10;
							height =  $(':naxx-vision').height() - 25 - 45;
							element.addClass('max');
							top = 0;
							left = 0;
						}
						else if (left == 0 && top == 0 && ( $(':naxx-vision').vision('option', 'layout') == '1+3' || $(':naxx-vision').vision('option', 'layout') == '1_3'))
						{
							if($(':naxx-vision').vision('option', 'layout') == '1+3')
							{
								width = $(':naxx-vision').width() - 10;
								height = 1.1*height;
							}	
							if($(':naxx-vision').vision('option', 'layout') == '1_3')
							{
								height = $(':naxx-vision').height() - 10 - 40;
								width = 1.1*width;
							}
						}
						else
						{
							var focus_width = width*1.1;
							var focus_height = height*1.1;
							if(focus_width <  self.options.min_width)
								focus_width = self.options.min_width;
							var focus_top =  top - 0.05*height - 9;
							var focus_left =  left - (focus_width-width)/2 - 9;
							if (focus_top < 0) focus_top = 0;
							else if (focus_top > $(':naxx-vision').height() - focus_height - 40) focus_top = $(':naxx-vision').height() - focus_height - 40 - 10 ;
							if (focus_left < 0){
								focus_left = 0;
							}
							else if (focus_left > $(':naxx-vision').width() - focus_width){
								focus_left = $(':naxx-vision').width() - focus_width -13 ;
							}
							width = focus_width;
							left = focus_left;
							height = focus_height;
							top = focus_top;
						}

						$(':naxx-view.active').view('recover');
						element.addClass('active ui-corner-all');

						if( self.options.content >= 0 )
							$(':naxx-rptz').rptz($.naxx.encoder[self.options.content]);
						else
							$(':naxx-rptz').rptz('disable');	

						$('.plugin.occupied').parent().view('mute', true).view('resetPip').find('.pip').hide();
						
						

						
						if(this.VivoPlugin) 
						{
							if(this.VivoPlugin.StreamStatus != 0)
							{
								$('.cover>.pip', element).show().find('.pipout').hide().siblings('.pipin').show();
								self.normalCell();
								$('div.volume', element).css({display: 'inline-block'});
								$(':naxx-vivobutton.pause', element).css('display', 'inline-block');
								$(':naxx-vivobutton.play', element).hide();
								$(':naxx-vivobutton.streaming_status', element).vivobutton('enable');
								self.mute(false);
								self.setVolume(50);
							}
						}

					}
					break;
				case 'emap':
					if(element.hasClass('active'))
					{
						element.find('.plugin').hide();
						element.find('.timestamp').hide();
						self.normalCell();
						element.removeClass('active');
						if ($('object', element).length == 0) self._createPlugin();
						return;
					}
					else
					{
					//	width = $(':naxx-emap').width()/10;
					//	height = $(':naxx-emap').height()/10;
						element.addClass('active ui-corner-all');
						element.find('.plugin').show();
						self.connectingCell();
						//element.find('.plugin').animate({width: width, height: height});
						element.find('.plugin').css({width: self.options.width, height: self.options.height});
						element.width('auto').height('auto');
						if ($('object', element).length == 0) self._createPlugin();
						return;
					}
					break;
			}
			
			/*element.animate({
				top: top,
				left: left
			});
			element.find('.plugin').animate({width: width, height: height});*/
			element.css({
				top: 100*top/$(':naxx-vision').height()+'%',
				left: 100*left/$(':naxx-vision').width()+'%'
			});

			element.find('.plugin').css({width: width, height: height });
			element.width('auto').height('auto');
			self.options.mtop = top;
			self.options.mleft = left;
			self.options.mwidth = width;
			self.options.mheight = height;
		},

		pretend_focus: function(){
			var self = this, element = $(this.element);
			var width = self.options.width, height = self.options.height, top = self.options.top, left = self.options.left;
			if ($(':naxx-vision').vision('option', 'layout') == '1x1')
			{
				width =  100*($(':naxx-vision').width() - 10)/$(':naxx-vision').width()+'%';
				height = 100*($(':naxx-vision').height() - 45)/$(':naxx-vision').height()+'%';
				top = 0;
				left = 0;
			}
			else
			{
				width = 1.1*element.width();
				height = 1.1*element.height();
				if(width < self.options.min_width)
					width = self.options.min_width;
				top = element.position().top - 0.05*self.options.height - 9;
				left = element.position().left - 0.05*self.options.width - 9;
				if (top < 0) top = 0;
				else if (top > $(':naxx-vision').height() - 1.1*self.options.height - 40) top = $(':naxx-vision').height() - self.options.height*1.1 - 40 - 10 ;
				if (left < 0) left = 0;
				else if (left > $(':naxx-vision').width() - 1.1*self.options.width) left = $(':naxx-vision').width() - self.options.width*1.1 -13 ;
			}
		},

		recover: function(){
			var self = this, element = $(this.element);

			if(self.options.type != 'emap')
			{
				element.removeClass('active ui-corner-all max');
				element.width(self.options.width).height(self.options.height);
				element.find('.plugin').width('auto').height('auto');
				element.css({top: self.options.top, left: self.options.left});
				self.mute();
				self.resetPip();
			}
			else
			{
				element.find('.plugin').width($(':naxx-emap').width()/5).height($(':naxx-emap').height()/5);
				element.width('auto').height('auto').css({top: self.options.top, left: self.options.left});
			}
			element.find('.pip').hide();
			$(':naxx-vision').vision('displayLayout');
		},

		max: function(){
			var self = this, element = $(this.element);

			if($(':naxx-vision').vision('option', 'layout') == '1x1') return;
		
			if(element.hasClass('max'))
			{
				$(':naxx-view').removeClass('max');
				//element.find('.plugin').animate({width: 1.1*self.options.width, height: 1.1*self.options.height});
				element.find('.plugin').css({width: self.options.mwidth, height: self.options.mheight});
				//if(self.options.type!='emap') element.animate({top: self.options.mtop, left: self.options.mleft});
				if(self.options.type!='emap') element.css({top: self.options.mtop, left: self.options.mleft});
				else element.width('auto').height('auto');
				$('.emapcamera', element).show();
			}
			else
			{
				element.addClass('max');
				//element.find('.plugin').animate({width: $(':naxx-vision,:naxx-emap').width() -10, height:$(':naxx-vision,:naxx-emap').height()-45});
				//element.animate({top: 0, left: 0});
				element.find('.plugin').css({width: $(':naxx-vision,:naxx-emap').width() -10, height:$(':naxx-vision,:naxx-emap').height()-25-45});
				element.css({top: 0, left: 0, width: 'auto', height: 'auto'});
				$('.emapcamera', element).hide();
			}

			try{
				if ($.browser.msie)
					document.selection.empty();
				else if($.browser.mozilla)
					window.getSelection().removeAllRanges();
			}
			catch(e)
			{
				//20110311 Alive: unknown error
			}
		},

		remove : function(){
			var self = this;
			var element = $(this.element);
			console.log('remove viewcell');
			self._endWinLessPluginCallbackFn();

			self.options.content = -1;
			self.options.encoder = {};
			element.attr('content', -1);
			self.VivoPlugin = element.find('object')[0];
			if(self.VivoPLugin != null) 
				this.VivoPlugin.Disconnect();
			self.normalCell();
			element.find('.pip').remove();
			element.find('.controlbtn').children().remove();
			element.find('.encoder_name').remove();
			element.find('.streaming_status').remove();
			element.find('.top_rightside').children().remove();
			self._createPlugin();
		},

		/*Under is plugin setup*/

		plugin_options : {
			PLUGIN_NAME : '/VVTK_Plugin_Installer.exe',
			PLUGIN_VER : '1,0,0,57',
			'NP-Plugin' : '1.0.0.59',

			/*For Vivotek Winless Plugin Param*/
			AspectRatioSection : 0,
			AutoReStartMP4Recording : false,
			AutoStartConnection : false,
			BeAspectRatio : false,
			BePlaybackChannel : false,
			BitmapFile : null,
			ClickEventHandler : 0, /*Tell the control how to response to the mouse click event.*/
			ClientOptions : 127,
			ConnectionProtocol : 2,
			ControlPort : 554, 
			CurrentJoystickIndex : 0,
			DarwinConnection : true,
			Deblocking : false,
			Deinterlace : false, 
			DigitalZoomDisplayDC : null,
			DigitalZoomDisplayPlugin :null,
			DigitalZoomEnabled : false,
			DigitalZoomPluginInst : null,
			DigitalZoomDrawFrameInfo : null,
			DisplayErrorMsg : false,
			DisplayTimeFormat : 0,
			EnableAntiTearing : false,
			EnableJoystick : false,
			EnableMuteWhenTalk : true,
			EnableROI : false,
			HttpPort : 80,
			HTTPProxyAddress : null,
			HTTPProxyPassword : null,
			HTTPProxyPort : 0,
			HTTPProxyType : 2,
			HTTPProxyUserName : null,
			IgnoreBorder : false,
			IgnoreCaption : false,
			IsFullscreen : false,
			IsPermissionSufficient : false,
			JoystickBtnTriggerStyle : 0,
			JoystickSpeedLvs : 5, 
			JoystickUpdateInterval : 100,
			MDTuningFreq : null,
			MediaType : null,
			MicMute : false,
			MicVolume : 50,
			MP4RecState : 1,
			Password : null,
			PlayMute : true,
			PlayVolume : 50,
			PluginCtrlID : null,
			PtzURL : "/cgi-bin/viewer/camctrl.cgi",
			ReadSettingByParam : false, 
			RemoteIPAddr : null,
			SnapshotUrl : "http://127.0.0.1:%d/video%d.jpg",
			ShowShrunkImgOnly : false,
			ShrunkBrightness : 0,
			StreamStatus : 0,
			Stretch : false,
			TalkState : 2,
			TalkWithVideoServerMap : 0,
			Url : "",
			UseBitmap : false,
			UserDateFormat : true,
			UserName : null,
			VideoSolutionWidth : 0,
			VideoSolutionHeight : 0,
			ViewChannel : 0,
			ViewStream : 0,
			VNDPWrapperUrlPath : null,
			VNDPWrapperVersion : null,
			windowed: 0,
			WheelEventHandler : true
			/*End For Vivotek Winless Plugin Param*/


		},
		VivoPlugin : null,
		PipPlugin : null,
		pipinfo: {top: 30, left: 40, width: 80, height: 60},
		
		
		destroy : function(){
			var element = $(this.element);
			this.remove();
			$(':naxx-vivobutton', $(this.element)).vivobutton('destroy');
			$(this.element).children().unbind().remove();
			if (this.VivoPlugin != null)
			{
				try {
					this.VivoPlugin.Disconnect();
				}
				catch(err)
				{
				}
			}
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			console.log('destroy viewcell.');
		},

		QueryTime: function(){
			var self = this, element = $(this.element); 
			var ts_start = $(':naxx-panel').panel('option', 'timestamp');
			var ts_end = ts_start - self.options.interval;
			$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_query_instant', 'channel='+self.options.content+'&interval='+self.options.interval, function(res){
					element.find('.start_time_indicator').text(new Date(res.begin/1000).formatDate('HH:mm:ss'));
					element.find('.end_time_indicator').text(new Date(res.final/1000).formatDate('HH:mm:ss'));
					$.each(res.recording_data, function(index, value){
							//value.begin
							//value['query_end']
					});
			});
		},

		instantPlayback: function(){
			var self = this, element = $(this.element); 
			var c = self.options.content;
			self.remove();
			self.options.type = 'instantplayback';
			self.options.content = c;
			self._createPlugin();
			self.QueryTime();
		},
		backtoLiveView: function(){
			var self = this, element = $(this.element); 
			var c = self.options.content;
			self.remove();
			self.options.type = 'liveview';
			self.options.content = c;
			self._createPlugin();
		},

		createPlugin : function(options){
			var self = this, element = $(this.element); 
			var c = self.options.content;
			$.extend(options, {content: c});
			self.remove();
			if(typeof(options)!='undefined') $.extend(self.options, options);
			self._createPlugin(options);
		},

		_removeControl: function(){
			var self = this, element = $(this.element); 
			element.find('.controlbtn').children().remove();
		},

		_createPlugin : function(options){
			var self = this, element = $(this.element); 
			var str_innerHTML = '';
			var settings = $.extend({}, options, self.plugin_options, self.options);
			element.attr('content', settings.content);

			if (settings.content == -1)	//has Url Options -> Create Plugin
			{
				$('.plugin', element).html('<span></span><img src="images/widget/viewcell/ViewCellLogo.png" class="empty" />').addClass('free').removeClass('occupied');
				self.VivoPlugin = null;
				if($('.controlbtn span', element).length == 0) self.createControl();
				return;
			}
			else	//No Url Options -> Create Empty-Image
			{
				settings.Url = window.location.hostname;
				self.options.Url = window.location.hostname;
				$('.plugin', element).removeClass('free').addClass('occupied');
			}
			if(settings.windowed)
			{
				element.addClass('windowed');
			}
			else
			{
				element.removeClass('windowed');
			}

			settings.ControlPort = $.naxx.raphael.network.protocol['rtsp_port'];
			switch (this.options.type)
			{
				case 'liveview':
				case 'emap':
				console.log('create vivo-plugin for channel '+self.options.content);
				if ($.browser.msie)
				{
					str_innerHTML += '<object name="WinlessStreamingPlugin" CLASSID="CLSID:64865E5A-E8D7-44C1-89E1-99A84F6E56D0" width="100%" height="100%" codeBase="/VVTK_Plugin_Installer.exe#version=1,0,0,64">';
					str_innerHTML += '<param name="AutoStartConnection" value="1">';
					str_innerHTML += '<param name="HttpPort" value='+settings.HttpPort+'>';
					str_innerHTML += '<param name="ControlPort" value='+settings.ControlPort+'>';
					str_innerHTML += '<param name="Stretch" value="1">';
					str_innerHTML += '<param name="ReadSettingByParam" value="1">';
					str_innerHTML += '<param name="ConnectionProtocol" value='+settings.ConnectionProtocol+'>';
					str_innerHTML += '<param name="DarwinConnection" value="1">';
					str_innerHTML += '<param name="DisplayErrorMsg" value='+settings.DisplayErrorMsg+'>';
					str_innerHTML += '<param name="IgnoreBorder" value="1">';
					str_innerHTML += '<param name="IgnoreCaption" value="1">';
					str_innerHTML += '<param name="MDTuningFreq" value=5000>';
					str_innerHTML += '<param name="PlayMute" value=1>';
					str_innerHTML += '<param name="ClickEventHandler" value=2>';
					str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/relay?ch='+this.options.content+'">';;
					str_innerHTML += '<param name="windowed" value='+settings.windowed+'>';
					str_innerHTML += '<param name="EnableFishEye" value='+settings.enable_fisheye+'>';
					str_innerHTML += '<param name="FishEyeMountType" value='+settings.fisheye_mounttype+'>';
					str_innerHTML += '<param name="ChangePresentMode" value='+settings.ChangePresentMode+'>';
					//str_innerHTML += '<param name="Url" value="rtsp://'+$.naxx.encoder[self.options.content].address+'/live.sdp">';
					str_innerHTML += '</object>';
				}
				else if ($.browser.mozilla)
				{ 		
					self.install_ffplugin();
					str_innerHTML += '<object name="WinlessStreamingPlugin" type="application/x-streamctrl" width="100%" height="100%">';
					str_innerHTML += '<param name="AutoStartConnection" value=1>';
					str_innerHTML += '<param value="1" name="AutoReconnect">';
					str_innerHTML += '<param name="HttpPort" value='+settings.HttpPort+'>';
					str_innerHTML += '<param name="ControlPort" value='+settings.ControlPort+'>';
					str_innerHTML += '<param name="Stretch" value=1>';
					str_innerHTML += '<param name="ReadSettingByParam" value=1>';
					str_innerHTML += '<param name="ConnectionProtocol" value=2>';
					str_innerHTML += '<param name="DarwinConnection" value=1>';
					str_innerHTML += '<param name="DisplayErrorMsg" value=0>';
					str_innerHTML += '<param name="IgnoreBorder" value=1>';
					str_innerHTML += '<param name="IgnoreCaption" value=1>';
					str_innerHTML += '<param name="MDTuningFreq" value=5000>';
					str_innerHTML += '<param name="PlayMute" value=1>';
					str_innerHTML += '<param name="ClickEventHandler" value=0>';
					str_innerHTML += '<param name="EnableFishEye" value=1>';
					str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/relay?ch='+settings.content+'">';
					/*this is for test!*/
					//str_innerHTML += '<param name="Url" value="rtsp://'+$.naxx.encoder[self.options.content].address+'/live.sdp">';
					str_innerHTML += '</object>';
				}

				$('.plugin', element).html(str_innerHTML);
				//element.find('.cover').append('<span></span><img src="images/stream-loader.gif" /><span>Connecting......</span>');
				self.connectingCell();
				break;
				case 'playback':
				case 'instantplayback':
				if(self.options.stime == '')
				{
					var timestamp = $(':naxx-panel').panel('option', 'timestamp');
					self.options.stime = (timestamp - self.options.interval);
					self.options.etime = timestamp;
				}
				
				if ($.browser.msie || $.browser.safari)
				{
					str_innerHTML += '<object name="WinlessStreamingPlugin" width="100%" height="100%" classid="CLSID:02C24B7C-70FF-4372-B160-312E9EB5560C" codeBase="/VVTK_Playback_Plugin_Installer.exe#version=1,0,0,15">';
					str_innerHTML += '<param name="IgnoreBorder" value="1">';
					str_innerHTML += '<param name="HttpPort" value="'+settings.HttpPort+'">';
					str_innerHTML += '<param name="ControlPort" value="'+settings.ControlPort+'">';
					str_innerHTML += '<param name="Stretch" value="1">';
					str_innerHTML += '<param name="ReadSettingByParam" value="1">';
					str_innerHTML += '<param name="ConnectionProtocol" value="2">';
					str_innerHTML += '<param name="AutoStartConnection" value="1">';
					str_innerHTML += '<param name="DarwinConnection" value="1">';
					str_innerHTML += '<param name="IgnoreBorder" value="1">';
					str_innerHTML += '<param name="IgnoreCaption" value="1">';
					str_innerHTML += '<param name="MDTuningFreq" value=5000>';
					str_innerHTML += '<param name="DisplayErrorMsg" value="0">';
					str_innerHTML += '<param name="MediaType" value=3>';
					str_innerHTML += '<param name="ClickEventHandler" value=0>';
					str_innerHTML += '<param name="PlayMute" value="1">';
					str_innerHTML += '<param name="ID" value="'+new Date().getTime()+'">';
					str_innerHTML += '<param name="windowed" value='+settings.windowed+'>';
					str_innerHTML += '<param name="EnableFishEye" value=1>';
					str_innerHTML += '<param name="ChangePresentMode" value=7>';
					if(self.options.sync) var mode='synchronize';
					else var mode='normal';
					if(this.options.etime != '')
						str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/mod?ch='+settings.content+'&start='+settings.stime+'&end='+settings.etime+'&mode='+mode+'">';
					else
						str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/mod?ch='+settings.content+'&start='+settings.stime+'&mode='+mode+'">';
					str_innerHTML += '</object>';
				}
				else if ($.browser.mozilla)
				{ 		
					self.install_ffplugin_playback();
					str_innerHTML += '<object name="WinlessStreamingPlugin" type="application/x-vivotek-playbackctrl" width="100%" height="100%">';
					str_innerHTML += '<param name="IgnoreBorder" value="1">';
					str_innerHTML += '<param name="HttpPort" value='+settings.HttpPort+'>';
					str_innerHTML += '<param name="ControlPort" value='+settings.ControlPort+'>';
					str_innerHTML += '<param name="Stretch" value=1>';
					str_innerHTML += '<param name="ReadSettingByParam" value=1>';
					str_innerHTML += '<param name="ConnectionProtocol" value=2>';
					str_innerHTML += '<param name="AutoStartConnection" value=1>';
					str_innerHTML += '<param name="DarwinConnection" value=1>';
					str_innerHTML += '<param name="IgnoreBorder" value=1>';
					str_innerHTML += '<param name="IgnoreCaption" value=1>';
					str_innerHTML += '<param name="MDTuningFreq" value=5001>';
					str_innerHTML += '<param name="DisplayErrorMsg" value=0>';
					str_innerHTML += '<param name="MediaType" value=3>';
					str_innerHTML += '<param name="PlayMute" value=1>';
					str_innerHTML += '<param name="ClickEventHandler" value=0>';
					str_innerHTML += '<param name="windowed" value='+settings.windowed+'>';
					str_innerHTML += '<param name="EnableFishEye" value=1>';
					if(self.options.sync) var mode='synchronize';
					else var mode='normal';
					if(self.options.etime)
						str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/mod?ch='+settings.content+'&start='+settings.stime+'&end='+settings.etime+'&mode='+mode+'">';
					else
						str_innerHTML += '<param name="Url" value="rtsp://'+settings.Url+'/mod?ch='+settings.content+'&start='+settings.stime+'&mode='+mode+'">';

					str_innerHTML += '</object>';
				}

				$('.plugin', element).html(str_innerHTML);
				self.connectingCell();
				break;
				}
				this.VivoPlugin = $('.plugin', element).children('object')[0];
				self.createControl();
				$('span.fisheye[mode='+settings.ChangePresentMode+']', element).removeClass('normal').addClass('active');
				this.setName();
				this._initWinLessPluginCallbackFn();
		},


		binding: function(){
			var self = this, element = $(this.element);
			// 2011/05/24 Alive224 Alive: init more than once; so unbind first 
			if(self.options.type != 'emap')
			{
				element.unbind('click').click(function(event){
						if($(event.target).is('.leftside,.rightside,.cover,.controlbtn,.empty,object'))
						{
							self.setFocus();
							return false;
						}
						return true;
					});
				element.unbind('keydown').bind('keydown', function(event){
					if((event.keyCode && event.keyCode == 13) || (event.which == 13)) //enter
					{
						self.UpdateBookmark();
					}
					else if((event.keyCode && event.keyCode == 27) || (event.which == 27))  //esc
					{
						element.find('div.bookmark_tip').hide();
						return true;
					}
					else if (element.find('div.bookmark_tip:visible').length == 0)
					{
						element.find('div.bookmark_tip').show();
					}
				});
				if(element.hasClass('.ui-droppable')) element.droppable('destroy');
					element.droppable({accept: '.encoder', drop: function(event, ui){
						if($(':naxx-vision').vision('option', 'mode') == 'liveview')
						{
							$channel = Number(ui.draggable.attr('channel'));
							$viewcellid = Number(element.attr('vid'));
							if( $viewcellid >= $.naxx.capability.encoder )
							{
								$.pnotify({
									pnotify_title: '<span symbol="text:not_available_operation">Not available operation.</span>',
									pnotify_type: 'error',
									pnotify_text: '<span symbol="text:the_viewcell_is_here_for_page_integrity_please_select_previous_other_viewcell_to_add_camera">The viewcell here is for page integrity. Please select previous other viewcell to add camera.</span>',
									pnotify_addclass: 'stack-bottomright',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
								});
								return;
							}
							if( $(':naxx-vision').length > 0 && $(':naxx-vision').vision('option', 'bRotate') == true )
							{
								$.naxx.loader = $.pnotify({
									pnotify_title: '<span symbol="text:not_available_operation">Not available operation.</span>',
									pnotify_type: 'error',
									pnotify_text: '<span symbol="text:you_cannot_add_camera_to_viewcell_while_rotating_stop_rotating_first">You cannot add camera to viewcell while rotating. Stop rotating first.</span>',
									pnotify_addclass: 'stack-bottomright',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
								});
								return;
							}

							self.remove();
							self.options.content = $channel;
							self.options.type = 'liveview';
							self._createPlugin();
							self.createControl();
							if(element.hasClass('active')) element.find(':naxx-vivobutton.pipout').show();
							$(':naxx-panel').panel('editmode');
							if($.naxx.loader != null) $.pnotify_remove_all();
						}
					}});
			}
		},

		UpdateBookmark: function(){
			var self = this, element = $(this.element);
						$.naxx.teleport.Exec($.naxx.path.mercury, 'exec_update_bookmark', 'channel='+self.options.content+'&start=0.0&content='+htmlEncode($('div.bookmark_tip input', element).val()), function(res){
							if(res)
							{
								element.find('div.bookmark_tip input').val('');
								$.pnotify({
									pnotify_title: '<span style="color: green;" symbol="text:apply_complete">Apply complete!</span>',
									pnotify_addclass: 'stack-bottomright',
									pnotify_text: '<span>'+$.naxx.stranslate('channel')+((parseInt(res.channel, 10))+1)+'</span><br/><span>'+res.date+'</span><br/><span class="bookmark_content">'+htmlEncode(res.content)+'</span>',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
							//		pnotify_stack: {nextpos: 15}
								});
							}
							else
							{
								$.pnotify({
									pnotify_title: '<span symbol="text:operation_fail">Operation fail</span>',
									pnotify_addclass: 'stack-bottomright',
									pnotify_type: 'error',
									pnotify_text: '<span symbol="text:storage_device_is_not_ready_configure_disks_firt">Storage device is not ready. Configure disks first.</span>',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
								});
							}
						},
						function(res)
						{
								$.pnotify({
									pnotify_title: '<span symbol="text:operation_fail">Operation fail</span>',
									pnotify_addclass: 'stack-bottomright',
									pnotify_type: 'error',
									pnotify_text: '<span symbol="text:storage_device_is_not_ready_configure_disks_firt">Storage device is not ready. Configure disks first.</span>',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
								});
						}
						);
		},

		/********************
		 *plugin相關callback*
		 ********************/
		_addPluginEvent : function(evt, func){
			var self = this;
			if ($.browser.mozilla)
			{
				this.VivoPlugin = $(self.element).find("object").get(0);
				if (this.VivoPlugin) 
				{
					this.VivoPlugin.addEventListener(evt,func,false);
				}
			}
			else if ($.browser.msie)
			{
				this.VivoPlugin = $(self.element).find("object").get(0);
				if (this.VivoPlugin) 
				{
					this.VivoPlugin.attachEvent('on'+evt,func);
				}
			}
		},

		_removePluginEvent: function(evt, func) {
			var self = this;
			if ($.browser.mozilla) 
			{
				this.VivoPlugin = $(self.element).find("object").get(0);
				if (this.VivoPlugin) 
				{
					this.VivoPlugin.removeEventListener(evt, func, false);
				}
			}
			else if ($.browser.msie) 
			{
				this.VivoPlugin = $(self.element).find("object").get(0);
				if (this.VivoPlugin) 
				{
					this.VivoPlugin.detachEvent('on'+evt, func);
				}
			}
		},

		_initWinLessPluginCallbackFn : function()
		{	
			var self = this, element = $(this.element);

			if(element.find('object').length > 0 && typeof(element.find('object')[0].PluginBeCreated) == 'undefined' && typeof(element.find('object')[0].PluginCtrlID) == 'undefined' && element.find('object')[0].PluginBeCreated == false)
			{
				setTimeout(function(){
						self._initWinLessPluginCallbackFn();
				}, 500);
				return false;
			}


			this._addPluginEvent("VNDPWrapperReady", function(id, param1, param2){
				self._ready(param1, param2);
			});
/*
			this._addPluginEvent("TalkStatus", function(id, param1, param2){
				self._UpdateTalkStatus(param1, param2);
			});*/
			

			if(self.options.type != 'playback' && self.options.type != 'instantplayback')
			{
				this._addPluginEvent("ConnectionStatus", function(id, param1, param2){
					if(console) console.log('plugin callback of connection status: '+param1+','+param2+' from channel#'+self.options.content);
					self._UpdateConnectionStatus(param1, param2);
				});	
			}
			else
			{
				this._addPluginEvent("ConnectionOK", function(id, param1, param2){
					self.connectionOK();
				});	
				this._addPluginEvent("ConnectionBroken", function(id, param1, param2){
					self.connectionBroken();
				});	
			}
			/*
			this._addPluginEvent("ProtocolStatus", function(id, param1, param2){
				self._UpdateProtocolStatus(param1, param2);
			});	*/
			
			this._addPluginEvent("TimeStamp", function(id, param1, param2){
				if(param1 <= 86400) return;
				self._UpdateTimeStamp(param1);
			});	
		
			this._addPluginEvent("RtspStatus", function(id, param1, param2){
				self._UpdateRtspStatus(param1);
				if(console) console.log('plugin callback of rtspstatus: '+param1+' from channel#'+self.options.content);
			});
			

			/*2011/11/17 add to avoid ie click problem*/
			this._addPluginEvent("Click", function(id, param1, param2){
				self.setFocus();
			});
		},

		_endWinLessPluginCallbackFn : function()
		{
			var self = this, element = $(this.element);
			if (this.options.type == 'playback' || this.options.type == 'instant_playback') 
			{
				this._removePluginEvent("ConnectionOK", function(){});
				this._removePluginEvent("ConnectionBroken", function(){});
			}
			else
			{
				this._removePluginEvent("ConnectionStatus", function(){});
			}
			this._removePluginEvent("TimeStamp", function(){});
			this._removePluginEvent("RtspStatus", function(){});
			this._removePluginEvent("Click", function(){});
			this._removePluginEvent("VNDPWrapperReady", function(){});
		},

		connectionOK: function(){
			var self = this, element = $(this.element);
			self.describeSpeedStatus();
			//$('span.camera.status', element).show().removeClass('usual').addClass('offline');
			self.normalCell();
			$(':naxx-vivobutton:hidden', element.find('.leftside')).css('display', 'inline-block');
		},
		connectionBroken: function(){
			var self = this, element = $(this.element);
			self.describeSpeedStatus();
			//this.options.play_speed = 1;
			//$('span.camera.status', element).show().removeClass('usual').addClass('offline');
			self.normalCell();
			$(':naxx-vivobutton.pause:visible', element.find('.leftside')).hide();
			$(':naxx-vivobutton.export:visible', element.find('.leftside')).hide();
		},

		install_ffplugin_playback: function(){
			var self = this, element = $(this.element);
			if($('#InstallerArea2').length > 0) return true;
			$.Installer = {
				plugins: {
					mime: "application/x-vivotek-playback-installermgt"
					, description: "Installer Management v1.0.0.17"
					, xpi: { "Installer Management v1.0.0.17" : "npVivotekPlaybackInstallerMgt.xpi" }
				}
			};
			
			$('#InstallerArea2').hide().appendTo('body');
			var xpi = undefined;
			var version = function(name) {
				var pos = name.search(" v");
				if(pos == -1) {
					return [];
				}
				return name.substr(pos + 2).split(".");
			};

			var compare = function(cur, src) {
				var cur = version(cur);
				var src = version(src);
				for(var i = 0; i < 4; ++i) {
					if(src[i] > cur[i]) {
						return true;
					} else if(src[i] < cur[i]) {
						return false;
					}
				}
			};

			var plugin = $.Installer.plugins;
			var type = window.navigator.mimeTypes[plugin.mime];

			if(!type || compare(type.description, plugin.description)) {
				xpi = plugin.xpi;
			}

			if(xpi) {
				window.InstallTrigger.install(xpi);
			}
			else if ($.browser.chrome)
			{
				var crx = undefined;
				var plugin = $.Installer.plugins;
				var type = window.navigator.mimeTypes[plugin.mime];

				if(!type || compare(type.description, plugin.description)) {
					$("#InstallerArea2").append('<iframe width="1" height="1" frameborder="0" src="../npVivotekPlaybackInstallerMgt.crx"></iframe>');
				}																					   //
			}

			if ($.browser.mozilla || $.browser.chrome)
			{
				$('#InstallerArea2').html('<object id="Installer" type="application/x-vivotek-playback-installermgt"><param name="InstallerPath" value="http://'+window.location.hostname+'/VVTK_Playback_Plugin_Installer.exe" /></object>');
			}
		},

		install_ffplugin: function(){
			var self = this, element = $(this.element);
			if($('#InstallerArea').length > 0) return true;
			$.Installer = {
				plugins: {
					mime: "application/x-installermgt"
					, description: "Installer Management v1.0.0.64"
					, xpi: { "Installer Management v1.0.0.64" : "npVivotekInstallerMgt.xpi" }
				}
			};
			
			$('#InstallerArea').hide().appendTo('body');
			var xpi = undefined;
			var version = function(name) {
				var pos = name.search(" v");
				if(pos == -1) {
					return [];
				}
				return name.substr(pos + 2).split(".");
			};

			var compare = function(cur, src) {
				var cur = version(cur);
				var src = version(src);
				for(var i = 0; i < 4; ++i) {
					if(src[i] > cur[i]) {
						return true;
					} else if(src[i] < cur[i]) {
						return false;
					}
				}
			};

			var plugin = $.Installer.plugins;
			var type = window.navigator.mimeTypes[plugin.mime];

			if(!type || compare(type.description, plugin.description)) {
				xpi = plugin.xpi;
			}

			if(xpi) {
				window.InstallTrigger.install(xpi);
			}
			else if ($.browser.chrome)
			{
				var crx = undefined;
				var plugin = $.Installer.plugins;
				var type = window.navigator.mimeTypes[plugin.mime];

				if(!type || compare(type.description, plugin.description)) {
					$("#InstallerArea").append('<iframe width="1" height="1" frameborder="0" src="../npVivotekInstallerMgt.crx"></iframe>');
				}																					   //
			}

			if ($.browser.mozilla || $.browser.chrome)
			{
				$('#InstallerArea').html('<object id="Installer" type="application/x-installermgt"><param name="InstallerPath" value="http://'+window.location.hostname+'/VVTK_Plugin_Installer.exe" /></object>');
			}
		},

		_ready : function(param1, param2)
		{
			var self = this;
			var element = $(this.element);
			//element.parent('.view').children('.plugin.occupied').view('setPip', this.VivoPlugin);
		},

		_pipready : function(param1, param2){
			this.setPip();
		},
		
		_UpdateTalkStatus : function(param1, param2)
		{
			var element = $(this.element);
			// 1:talking, 4:stopping, 5:error
			switch (param1)
			{
				case 1:
				switch (param2)
				{
				}
				break;
			}
		},
		
		_UpdateRtspStatus : function(param1, param2)
		{
			var self = this;
			var element = $(this.element);

			switch (param1)
			{
				case 0:
				case 1:
				case 3:
					self.pausingCell();
					$(':naxx-vivobutton.play', element).css('display', 'inline-block');
					$(':naxx-vivobutton.pause', element).hide();
				break;
				case 2:
					if(this.VivoPlugin && this.VivoPlugin.StreamStatus != 0)
					{
						self.normalCell();
						self.object.$volume.show();
						$(':naxx-vivobutton.pause', element).css('display', 'inline-block');
						$(':naxx-vivobutton.play', element).hide();
						$(':naxx-vivobutton.streaming_status', element).vivobutton('enable');
						$(':naxx-vivobutton.pipin', element).vivobutton('enable');
					}
				break;
			}
		},

		pausingCell: function(){
			var self = this, element = $(this.element);
			//element.find('.cover table img').attr('src', 'images/viewcell-paused.png');
			//element.find('.cover table').show();
			self.normalCell();
		},
		connectingCell: function(){
			var self = this, element = $(this.element);
			element.find('.cover').addClass('loading');
			//element.find('.cover table').show();
		},
		normalCell: function(){
			var self = this, element = $(this.element);
			element.find('.cover').removeClass('loading');
			//element.find('.cover table').hide();
		},



		_UpdateConnectionStatus : function(param1, param2)
		{
			var self = this;
			var element = $(this.element);

			switch (param1)
			{
				case 1:
						self.normalCell();
						$('div.volume', element).css({'display': 'inline-block'});
						$(':naxx-vivobutton:hidden', element.find('.leftside')).css('display', 'inline-block');
						$(':naxx-vivobutton.play', element).hide();
						$(':naxx-vivobutton.streaming_status', element).vivobutton('enable');
						$(':naxx-vivobutton.pipin', element).vivobutton('enable');
				break;
				case 2:
						self.object.$volume.hide();
						$('.cover>.pip', element).hide();
						$(':naxx-vivobutton.streaming_status', element).vivobutton('disable');
						$(':naxx-vivobutton:visible', element.find('.leftside')).hide();
						$(':naxx-vivobutton.play', element).css('display', 'inline-block');
						$(':naxx-vivobutton.offline', element).css('display', 'inline-block');
						self.hidePip();
						$(':naxx-vivobutton.pipin', element).vivobutton('disable');
						//element.siblings('.controlbtn').plugin_control('toggler', 'disable');
				break;
				case 3:
						self.object.$volume.hide();
						$('.cover>.pip', element).hide();
						$(':naxx-vivobutton:visible', element.find('.leftside')).hide();
						$(':naxx-vivobutton.play', element).css('display', 'inline-block');
						$(':naxx-vivobutton.offline', element).css('display', 'inline-block');
						$(':naxx-vivobutton.streaming_status', element).vivobutton('disable');
						self.hidePip();
						$(':naxx-vivobutton.pipin', element).vivobutton('disable');
						//element.siblings('.controlbtn').plugin_control('toggler', 'disable');
				break;
				case 4:
						self.object.$volume.hide();
						$('.cover>.pip', element).hide();
						$(':naxx-vivobutton:visible', element.find('.leftside')).hide();
						$(':naxx-vivobutton.play', element).css('display', 'inline-block');
						$(':naxx-vivobutton.offline', element).css('display', 'inline-block');
						$(':naxx-vivobutton.streaming_status', element).vivobutton('disable');
						self.hidePip();
						$(':naxx-vivobutton.pipin', element).vivobutton('disable');
						//element.siblings('.controlbtn').plugin_control('toggler', 'disable');
				break;
			}
		},

		_UpdateProtocolStatus : function(param1, param2)
		{
			var element = $(this.element);
			switch (param1)
			{
				case 1:
				break;
			}
		},

		/*********************
		 *Plugin Callback End*
		 *********************/

		connect : function(){
			var self = this, element = $(this.element);
			self.connectingCell();
			if (this.VivoPlugin != null)
				this.VivoPlugin.Connect();
		},
		
		disconnect : function(){
			if (this.VivoPlugin != null)
				this.VivoPlugin.Disconnect();
			this.normalCell();
		},
		
		reStream : function(stream){
			if (this.VivoPlugin != null && stream != this.options.ViewStream)
			{
				this.VivoPlugin.ViewStream = stream;
				this.options.ViewStream = stream;
			}
		},
		
		stop : function(){
			var self = this, element = $(this.element);
			self.normalCell();
			if (this.VivoPlugin != null)
				this.VivoPlugin.RtspStop();
		},

		controlplayback: function(status){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				this.VivoPlugin.ControlPlayback(status);
				self.describeSpeedStatus();
			}
		},

		syncplay: function(start){
			var self = this, element = $(this.element);
			$(':naxx-view').view({sync: true, stime: start});
		},

		sync: function(start){
			var self = this, element = $(this.element);
			var channel = this.options.content;
		},
		
		play : function(){
			var self = this, element = $(this.element);
			self.connectingCell();
			if (this.VivoPlugin != null)
				this.VivoPlugin.RtspPlay();
		},
		
		pause : function(){
			var self = this, element = $(this.element);
			self.pausingCell();
			if (this.VivoPlugin != null)
				this.VivoPlugin.RtspPause();
		},

		describeSpeedStatus: function(){
			var self = this, element = $(this.element);
			if(this.VivoPlugin != null)
			{
				if(this.VivoPlugin.StreamStatus == 0)
					var status = '<span>'+$.naxx.stranslate('pause')+'</span>';
				else
					var status = '<span>'+$.naxx.stranslate('playing')+'</span>';
			}
			if( self.options.play_speed < 0)
				$('.PlaybackBtn.speed').html('<div class="status">'+status+'</div><div class="speed">1/'+1<<(-self.options.play_speed)+'X</div>');
			else
				$('.PlaybackBtn.speed').html('<div class="status">'+status+'</div><div class="speed">'+1<<self.options.play_speed+'X</div>');
		},
		
		speedup : function(){
			var self = this;
			if (this.VivoPlugin != null)
			{
				self.options.play_speed += 1;
				if(self.options.play_speed <= 0) self.options.play_speed = 1;
				if(self.options.play_speed > 5) self.options.play_speed = 5;
				this.VivoPlugin.SetPlaybackSpeed(self.options.play_speed/Math.abs(self.options.play_speed)*1<<Math.abs(self.options.play_speed));
				self.describeSpeedStatus();
			}
		},
		
		speeddown : function(){
			var self = this;
			if (this.VivoPlugin != null)
			{
				self.options.play_speed -= 1;
				if(self.options.play_speed == 0) self.options.play_speed = -2;
				if(self.options.play_speed == -1) self.options.play_speed = -2;
				this.VivoPlugin.SetPlaybackSpeed(self.options.play_speed);
				self.describeSpeedStatus();
			}
		},
		
		screenshot : function(){
			if (this.VivoPlugin != null)
			{
				window.open(this.VivoPlugin.SnapshotUrl, "", "width=800, height=600, scrollbars=yes, resizable=yes, status=yes");
				return this.VivoPlugin.SnapshotUrl;
			}
		},
		
		record : function(){
			if (this.VivoPlugin != null)
				this.VivoPlugin.StartMp4Conversion();
		},

		stopRecord : function(){
			if (this.VivoPlugin != null)
				this.VivoPlugin.StopMp4Conversion();
		},
		
		rewind : function(){
		},
		
		setVolume : function(volume){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				this.VivoPlugin.PlayVolume = this.options.PlayVolume = volume;
				self.plugin_options.PlayVolume = volume;
				$('div.volume', element).children('a').attr('title', volume);
				$('div.volume', element).slider('value', volume);
			}
		},

		unmute: function(){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				self.VivoPlugin.PlayMute = false;
				self.object.$volume.slider('value', self.plugin_options.PlayVolume);
			}
		},
		
		
		toggleVolume : function(enable){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				if(self.VivoPlugin.PlayMute == true)
				{
					self.VivoPlugin.PlayMute = false;
					$('div.volume', element).slider('value', self.plugin_options.PlayVolume);
					return true;
				}
				else
				{
					self.VivoPlugin.PlayMute = true;
					$('div.volume', element).slider('value', 0);
					return false;
				}
			}
		},
		
		mute : function(enable){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				self.VivoPlugin.PlayMute = enable;
			}
		},

		
		gomute : function(){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null)
			{
				if($('div.volume:animated', element).length == 0 && $('div.volume:visible', element).length == 0)
				{
					self.object.$volume.show();
				}
				self.VivoPlugin.PlayMute = true;
				self.object.$volume.slider({ value: 0 });
			}
		},
		
		setMicVolume : function(volume){
			if (this.VivoPlugin != null)
				this.VivoPlugin.MicVolume = this.options.MicVolume = volume;
		},
		
		micMute : function(){
			if (this.VivoPlugin != null)
				this.VivoPlugin.EnableMuteWhenTalk = this.options.EnableMuteWhenTalk = enable;
		},
		
		fullscreen : function(){
			if (this.VivoPlugin != null)
				this.VivoPlugin.SetFullScreen(true);
		},
		
		getPluginObj : function(){
			return this.VivoPlugin;
		},

		setPip : function(){
			var self = this;
			var element = $(this.element);

			if (this.VivoPlugin != null && this.PipPlugin != null)
			{
					if( $.browser.msie )
						this.VivoPlugin.SetDigitalZoomDisplayWindowInfo(this.PipPlugin.DigitalZoomDrawFrameInfo, this.PipPlugin.DigitalZoomDisplayPlugin, this.PipPlugin.DigitalZoomPluginInst);
					else if ( $.browser.mozilla )
						this.VivoPlugin.SetDigitalZoomDisplayWindowInfo(this.PipPlugin.DigitalZoomDrawFrameInfo, this.PipPlugin.DigitalZoomDisplayPlugin, this.PipPlugin.NPPInstance);

					this.VivoPlugin.SetDigitalZoomEditWindowPos(0, 0, 160, 120); //initial
					this.VivoPlugin.DigitalZoomEnabled = true;
			}
			else
				this.VivoPlugin.SetDigitalZoomDisplayWindowInfo(0, 0, 0);

		},

		resetPip: function(){
			var self = this, element = $(this.element);
			if( self.PipPlugin != null && self.VivoPlugin != null){
				this.VivoPlugin.SetDigitalZoomDisplayWindowInfo(0, 0, 0);
				element.find('.cover .pip object,.cover .pip div').unbind().remove();
				self.PipPlugin = null;
				self.pipinfo = {top: 0, left: 0, width: 160, height: 120};
				self.hidePip();
			}
		},

		setPipInfo : function(pipinfo){
			var self = this, element = $(this.element);
			if (this.VivoPlugin != null && this.PipPlugin != null)
			{
				//range check
				if (self.pipinfo.left < 0) self.pipinfo.left = 0;
				if (self.pipinfo.top < 0) self.pipinfo.top = 0;
				if (self.pipinfo.width > 160) self.pipinfo.width = 160;
				if (self.pipinfo.height > 120) self.pipinfo.height = 120;
				if (self.pipinfo.width + self.pipinfo.left > 160) self.pipinfo.width = 160 - self.pipinfo.left;
				if (self.pipinfo.height + self.pipinfo.top > 120) self.pipinfo.height = 120 - self.pipinfo.top;

				this.VivoPlugin.SetDigitalZoomEditWindowPos(self.pipinfo.left, self.pipinfo.top, self.pipinfo.width, self.pipinfo.height);
			}
		},

		_UpdateTimeStamp : function(seconds){
			var self = this;
			self.options.timestamp = seconds;
			var self = this, element = $(this.element);
			if($('.timestamp:hidden', element).length > 0 && $('.timestamp:animated', element).length == 0) $('.timestamp', element).slideLeftShow();
			$('.timestamp', element).html(new Date(seconds*1000).formatDate('yyyy/MM/dd HH:mm:ss'));
			//if ( element.find('.controlbtn .leftside:visible').length <=1 && self.options.type != 'playback' )

			if ( self.options.type == 'playback' && element.hasClass('active') )
			{
				$(':naxx-play_control').play_control('updateTimestamp', seconds*1000);
			}
		},

		play_at : function(time){
			var self = this, element = $(this.element);
			if(this.options.stime == time) return;
			if(this.VivoPlugin)
			{
				this.VivoPlugin.Disconnect();
				if(this.options.etime != '')
					this.VivoPlugin.Url = this.options.Url+'/mod?ch='+this.options.content+'&start='+time+'&end='+this.options.etime;
				else
					this.VivoPlugin.Url = this.options.Url+'/mod?ch='+this.options.content+'&start='+time;
				this.VivoPlugin.Connect();
			}
		},
		
		setParam : function(option, value){
			if (this.VivoPlugin != null)
			{
				//FireFox hack
				if ($.browser.morzilla)
				{
					if (value == true) value = 1;
					else if (value == false) value = 0;
				}
				
				eval('this.VivoPlugin.'+option+' = value;');
				eval('this.options.'+option+' = value;');
			}
		},
		
		setName : function(){
			var self = this;
			var element = $(this.element);

			//if (self.options.content < 0) return; //no name sure
			//if ($.naxx.encoder[self.options.content] == null) return;
			//else self.options.name = $.naxx.encoder[self.options.content].name;
			//

			if (self.options.type == 'liveview' && $('span.streaming_status', element).length == 0)
			{
				$('<span class="streaming_status"></span>').appendTo(element);
				$('.streaming_status', element).vivobutton({
					animate: true,
					name: 'live',
					type: 'status',
					initState: 'disable',
					attr: {
						channel : self.options.content
					},
					symbols: {
						normal_symbol: 'title:live_streaming',
						disable_symbol: 'title:no_streaming'
					},
					callback: function(self, element){
						if(element.hasClass('recording'))
						{
							//must success
							element.removeClass('recording').addClass('live').attr('title', $.naxx.stranslate('live_streaming'));
							$.naxx.teleport.Exec($.naxx.path.rec+'/'+element.attr('channel'), 'rec_stop', '', function(){
								element.removeClass('recording').addClass('live').attr('title', $.naxx.stranslate('live_streaming'));
							});
						}
						else
						{
							element.removeClass('live').addClass('recording').attr('title', $.naxx.stranslate('recording'));
							$.naxx.teleport.Exec($.naxx.path.rec+'/'+element.attr('channel'), 'rec_start', '', function(){
							});
						}
						return false;
					}
				});
			}

			if ( $('.encoder_name', element).length == 0 ) {
				element.append('<div class="encoder_name ui-corner-all"></div>');
				$('.encoder_name', element).append('<span class="channel_id" title="channel_id" symbol="title:channel_id">'+(Number(self.options.content)+1)+'</span><span class="timestamp" symbol="title:camera_time" title="camera_time">...</span>');
				$('.timestamp', element).hide();
			}
		},
		
		updateTime : function(time){
			var self = this, element = $(this.element);
			this.options.STIME = time;
			element.find('object').Url = this.options.Url+'/mod?ch='+this.options.ViewChannel+'&start='+this.options.STIME+'&end='+this.options.ETIME;
			
		},

		reposPlugin : function(){
			var self = this, element = $(this.element);
			if(self.options.type != 'emap')
				element.find('.plugin').width(1.1*self.options.width).height(1.1*self.options.height).show();
			else
				element.find('.plugin').width(element.width()).height(element.height()).show();

		},


		showPip: function(){
			var self = this, element = $(this.element);
			if(this.VivoPlugin == null) return;
			element.find('.cover .pip').animate({width: 160, height: 120}).addClass('actived');
			if(this.PipPlugin == null) self.createPip();
			this.VivoPlugin.DigitalZoomEnabled = true;
		},

		hidePip: function(){
			var self = this, element = $(this.element);
			if(this.VivoPlugin == null) return;
			this.VivoPlugin.DigitalZoomEnabled = false;

			element.find('.cover .pip').removeClass('actived').animate({width: 20, height: 20}, function(){
				if(!element.hasClass('active'))
				{
					element.find('.pip').hide();
				}
			});

		},

		showBookmark: function(){
			var self = this, element = $(this.element);
			$('div.bookmark_tip', element).show().find('input').focus();
		},

		hideBookmark: function(){
			var self = this, element = $(this.element);
			$('div.bookmark_tip', element).hide().find('input').val('');
		},
		
		toggleBookmark: function(){
			var self = this, element = $(this.element);
			if($('div.bookmark_tip:visible', element).length > 0)
				$('div.bookmark_tip', element).hide();
			else
				$('div.bookmark_tip', element).show().find('input').focus();
		},


		createPip: function(){
			var self = this, element = $(this.element);
			if(this.VivoPlugin == null) return;
			var str_innerHTML = '<object class="pipplugin"';
			if ($.browser.msie)
			{
				str_innerHTML += ' classid="CLSID:64865E5A-E8D7-44C1-89E1-99A84F6E56D0">';
				str_innerHTML += "<param name=\"AutoStartConnection\" value=\"false\">";
				str_innerHTML += "<param name=\"IgnoreCaption\" value=\"true\">";
				str_innerHTML += "<param name=\"IgnoreBorder\" value=\"true\">";
				str_innerHTML += "<param name=\"Stretch\" value=\"true\">";
			}
			else if ($.browser.mozilla)
			{
				str_innerHTML += ' type="application/x-vivotek-rtspctrl">';
				str_innerHTML += "<param name=\"AutoStartConnection\" value=\"0\">";
				str_innerHTML += "<param name=\"IgnoreCaption\" value=\"1\">";
				str_innerHTML += "<param name=\"IgnoreBorder\" value=\"1\">"; 
				str_innerHTML += "<param name=\"Stretch\" value=\"1\">";
			}

			str_innerHTML += '</object>';
			str_innerHTML += '<div class="pipmask"></div>';
			str_innerHTML += '<div class="drag-window trans75"></div>';
			$('.cover div.pip', element).append(str_innerHTML)
				.find('.drag-window').draggable({
					containment: 'parent',
					scroll: false,
					drag:function()
					{
						self.pipinfo.left = $(this).position().left;
						self.pipinfo.top = $(this).position().top;
						self.setPipInfo();
					}
					}).resizable({
						containment: 'parent', 
						handles:'n, e, s, w, ne, se, sw, nw, all',
						resize: function(event, ui) 
						{
							self.pipinfo.left = $(this).position().left;
							self.pipinfo.top = $(this).position().top;
							self.pipinfo.width = $(this).width();
							self.pipinfo.height = $(this).height();

							self.setPipInfo();
						}
					})
					.siblings('.pipmask').addClass('trans0').mousedown(function(event){
						self.pipinfo.left = ($.browser.msie?event.offsetX : event.layerX) - self.pipinfo.width/2;
						self.pipinfo.top = ($.browser.msie?event.offsetY : event.layerY) - self.pipinfo.height/2;
						if (self.pipinfo.left > 160 - self.pipinfo.width) self.pipinfo.left = 160 - self.pipinfo.width;
						if (self.pipinfo.top > 120 - self.pipinfo.height) self.pipinfo.top = 120 - self.pipinfo.height;
						if (self.pipinfo.left < 0) self.pipinfo.left = 0;
						if (self.pipinfo.top < 0) self.pipinfo.top = 0;

						$(this).siblings('.drag-window').css({left: self.pipinfo.left, top: self.pipinfo.top});
						self.setPipInfo();
						return false;
					});
				element.find('.drag-window').css({top: 30, left: 40}).width(80).height(60);
				self.pipinfo = {left: 40, top: 30, width: 80, height: 60};
			self.PipPlugin = element.find('.cover .pip object')[0];
			this._addPluginEvent("VNDPWrapperReady", function(id, param1, param2){
				self._pipready(param1, param2);
				self.setPipInfo();
			});
		},
		
		createControl: function(){
			var self = this, element = $(this.element);
			$('.controlbtn', element).html('<div class="leftside"><div /></div><div class="rightside"></div>');
			if(element.find('.top_rightside').length==0) $('<div class="top_rightside fisheye_controller"></div>').appendTo(element);
			/*Generate the control buttons to control the VivoPlugin*/
			/*Insert type-related buttons*/
			var buttons = {
				'liveview': [
				{
					name: 'play',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:play'
					},
					callback: function(self){
						self.options.control.view('play');
						return false;
					}
				},
				{
					name: 'pause',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:pause'
					},
					callback: function(self){
						self.options.control.view('pause');
						return false;
					}
				},
				{
					name: 'instantplayback',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:instant_playback'
					},
					callback: function(self){
						$(':naxx-view.active').view('instantPlayback');
					}
				},
				{
					name: 'bookmark',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:bookmark'
					},
					callback : function(self){
						self.options.control.view('toggleBookmark');
						return false;
					}
				},
				{
					name: 'snapshot',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:snapshot'
					},
					callback: function(self){
						self.options.control.view('screenshot');
						return false;
					}
				},
				{
					name: 'offline',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:remove'
					},
					callback: function(self){
						self.options.control.view('remove');
						//self.disable();
						$(':naxx-panel').panel('editmode');
						$(':naxx-rptz').rptz('disable');
					}
				},
				{
					name: 'volume',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:mute'
					},
					symbols: {
						mute_symbol: 'title:mute',
						unmute_symbol: 'title:unmute'
					},
					callback: function(self){
						var r = self.options.control.view('toggleVolume');
						if(r == true)
						{
							$(self.element).removeClass('mute').addClass('volume').attr('title', self.options.symbols.mute_symbol.split(':')[1]);
						}
						else
						{
							$(self.element).removeClass('volume').addClass('mute').attr('title', self.options.symbols.unmute_symbol.split(':')[1]);
						}
						return false;
					}
				}
				],
				'instantplayback': [
				{
					name: 'returnliveview',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:back_to_liveview'
					},
					callback: function(self, element){
						$(':naxx-view.active').view('backtoLiveView');
					}
				},
				{
					name: 'play',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:play'
					},
					callback: function(self){
						self.options.control.view('controlplayback', 1);
						return false;
					}
				},
				{
					name: 'pause',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:pause'
					},
					callback: function(self){
						self.options.control.view('controlplayback', 2);
						self.options.control.view('pause');
						return false;
					}
				},
				{
					name: 'offline',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:remove'
					},
					callback: function(self){
						self.options.control.view('remove');
						//self.disable();
						$(':naxx-panel').panel('editmode');
						$(':naxx-rptz').rptz('disable');
					}
				},
				],
				'playback': [
				{
					name: 'export',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:export'
					},
					callback: function(self){
						$.NonAjaxPost($.naxx.command.Media, {end: self.options.timestamp, start: self.options.timestamp-300});
					}
				},
				{
					name: 'offline',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:remove'
					},
					callback: function(self){
						self.options.control.view('remove');
					}
				},
				{
					name: 'volume',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:mute'
					},
					symbols: {
						mute_symbol: 'title:mute',
						unmute_symbol: 'title:unmute'
					},
					callback: function(self){
						var r = self.options.control.view('toggleVolume');
						if(r == true)
						{
							$(self.element).removeClass('mute').addClass('volume').attr('title', self.options.symbols.mute_symbol.split(':')[1]);
						}
						else
						{
							$(self.element).removeClass('volume').addClass('mute').attr('title', self.options.symbols.unmute_symbol.split(':')[1]);
						}
						return false;
					}
				}
				],
				'emap': [
				{
					name: 'play',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:play'
					},
					callback: function(self){
						self.options.control.view('play');
						return false;
					}
				},
				{
					name: 'pause',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:pause'
					},
					callback: function(self){
						self.options.control.view('pause');
						return false;
					}
				},
				{
					name: 'offline',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:remove'
					},
					callback: function(self){
						//self.disable();
						$(':naxx-rptz').rptz('disable');
						$(':naxx-emap').emap('removeView', self.options.control.view('option', 'content'));
					}
				}
				],
				'Window': [
				{
					name: 'back',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:viewcell_resize'
					},
					callback: function(self, element){
						self.options.control.view('recover');
						return false;
					}
				},
				{
					name: 'full',
					type: 'viewcellBtn',
					control: element,
					attr: {
						symbol: 'title:viewcell_fullview'
					},
					callback: function(self, element){
						self.options.control.view('max');
						return false;
					}
				}
				]
			};
			for (var i = 0; i < buttons.Window.length; i++)
			{
				$('<span></span>').vivobutton(buttons.Window[i]).appendTo($('.rightside', element));
			} 
			if (self.options.content >= 0)
			{
				$.each(buttons[self.options.type], function(index, value){
					$('<span></span>').vivobutton(value).appendTo($('.leftside div', element));
				});

				switch(self.options.type)
				{
					case 'liveview':
						$(':naxx-vivobutton', element.find('.leftside')).hide();
						$(':naxx-vivobutton.play', element.find('.leftside')).show();
						$(':naxx-vivobutton.offline', element.find('.leftside')).show();
						/*only in liveview*/
						$('<div class="pip min"></div>').hide().appendTo(element.find('.cover'));
						$('<span></span>').vivobutton({
								name: 'pipin', 
								type: 'viewcellBtn', 
								control: element, 
								attr: {
									symbol: 'title:enable_pip'
								},
								callback: function(self){
									$(':naxx-vivobutton.pipout', self.options.control).css('display', 'inline-block');
									$(':naxx-vivobutton.pipin', self.options.control).hide();
									self.options.control.view('showPip');
									return false;
								}}).appendTo(element.find('div.cover div.pip'));
						$('<span></span>').vivobutton({
								name: 'pipout', 
								type: 'viewcellBtn',
								control: element,
								attr: {
									symbol: 'title:disable_pip'
								},
								callback: function(self){
									$(':naxx-vivobutton.pipin', self.options.control).css('display', 'inline-block');
									$(':naxx-vivobutton.pipout', self.options.control).hide();
									self.options.control.view('hidePip');
									return false;
								}}).hide().appendTo(element.find('div.cover div.pip'));
							$('div.pip', element).hide();
						break;
					case 'emap':
						element.find(':naxx-vivobutton.back').hide();
						$('div.emapcamera span.camimg', element).vivobutton({name: 'usual', type: 'emap_camera'}).mousedown(function(){
							element.data('dragging', false);
						}).mouseup(function(){
							if(element.data('dragging') == true) return;
								self.setFocus();
						});
						break;
					case 'playback':
						element.find(':naxx-vivobutton.back').hide();
						break;
					case 'instantplayback':
						element.find(':naxx-vivobutton.pause').hide();
						/*create timeline*/
							$('<div class="timeline_back"><div class="timeline"></div></div>').appendTo(element.find('.controlbtn'));
							element.find('.timeline').slider({
								min: 0,
								max: self.options.interval,
								value: 0,
								orientation: "horizontal",
								range: "min",
								animate: true
							});
							self.object.$timeline = element.find('.timeline');
							element.find('.timeline .ui-slider-range').addClass('trans50');
							$('<span class="start_time_indicator></span>').appendTo(element.find('.leftside div:eq(0)'));
							$('<span class="time_indicator">10min<span class="ui-icon ui-icon-triangle-1-n"></span></span>').appendTo(element.find('.rightside'));
							$('<span class="end_time_indicator"></span>').tooltip({
								cancelDefault: false,
								events : {
									def: 'mouseenter,mouseleave',
									tooltip: 'mouseenter,mouseleave'
								},
								tip: '#playqueue_tip',
								position : 'top right',
								offset: [0, -25],
								predelay:200, 
								delay:200,
								onBeforeShow: function(){
									var tip = this.getTip();
									var interval = this.getTrigger();
									tip.children().remove();
									for(var i = 0; i < self.intervals; i++)
									{
										$('<div class="interval_option" symbol="'+self.intervals[i].symbol+'" value="'+self.intervals[i].value+'">'+self.intervals[i].option+'</div>').click(function(){
												tip.hide();
												interval.text($(this).text());
												self.options.interval = Number($(this).attr('value'));
												self.QueryTime();
											}).appendTo(tip);
									}
									$.naxx.translate($.naxx.acl.language, tip);
								}
							}).prependTo(element.find('.rightside'));
						break;
				}

				/* Create Volume -- all types */
				self.object.$volume = $('<div class="volume"></div>').slider({
					min: 0,
					max: 100,
					value: self.plugin_options.PlayVolume,
					orientation: "horizontal",
					range: "min",
					animate: true,
					slide: function(e, ui){
						self.setVolume(ui.value);
					}
				}).css({display: 'inline-block', 'float': 'left', 'vertical-align':'middle'}).hide().insertAfter($('.leftside div', element));
				$('<img class="left" src="images/widget/viewcell/half_blue.png" />').insertBefore(self.object.$volume.children('div'));
				$('<img class="right" src="images/widget/viewcell/half_white.png" />').insertAfter(self.object.$volume.children('div'));
				$('div.volume').hide();
				var validation = '';
				$('<div class="bookmark_tip"><input type="text" value="" maxlength="120" /><button class="add_bookmark block" /></div>').hide().appendTo($('div.leftside', element));
				$('button.add_bookmark', element).button({icons: {primary: 'ui-icon-plus'}, text: false}).click(function(){
						self.UpdateBookmark();
				});
				self.tie2Encoder();
			}

			
		}
	});
})(jQuery);
