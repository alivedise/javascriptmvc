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
 * Date: 2011-03-22 09:44:06
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.video: video setting management
 *
 */

;(function($) {
	$.widget('naxx.config_video', $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_video').config_video('apply', false);
					return false;
				}
			}
		],
		empty_profile: {
			resolution: '-',
			resolutionText: '-',
			encode_type: '-',
			frame_rate: '-',
			quality: '-'
		},
		options: {
			ticket: -1,
			polling_start: -1
		},
		object: {
			$recording: null
		},
		Normalize: function(num, multiple)
		{                                                                            
		    return parseInt(num/multiple)*multiple;
		},    
		getAdjustedResolution : function(encoder, profile, resolution) 
		{                        
			if(typeof(resolution) == 'undefined') resolution = profile.resolution;
			if(typeof(encoder.videomode) == 'undefined' || typeof(profile.ratiocorrect) == 'undefined' || profile.ratiocorrect == 0) return resolution;
			else
			{
				switch(resolution)
				{                                                                                                                      
				case "D1":                                                                                                             
				case "4CIF":                                                                   
				        return resolution+' -> '+((encoder.videomode == "pal")? "768x576":"640x480");                                     
				        break;                                                                                                         
				case "CIF":                                                                                                                                          
				        return resolution+' -> '+((encoder.videomode == "pal")? "384x288":"320x240");                                            
				        break;                                                                                                         
				case "QCIF":
						return resolution+' -> '+((encoder.videomode == "pal")? "176x144":"176x120");                                       
				        break;                                                                                                         
				default:                                                                                                               
				        return resolution;                                                                                                    
				        break;                                                                                                       
				}                                                                                                                      
			}
		},                                                                                                                                        
		polling: function(){
			var self = this, element = $(this.element);
			var cont = false;
			var error = false;
			if(self.options.ticket < 0) return false;
			if(self.options.ticket == 0)
			{
				$.pnotify({
						pnotify_title: '<span symbol="text:service_busy">Service busy</span>',
						pnotify_addclass: 'stack-bottomright',
						pnotify_type: 'error',
						pnotify_text: '<span symbol="text:system_is_busy_now_please_try_after_10_sec" />',
						pnotify_history: false,
						pnotify_stack: stack_bottomright
				});
				return false;
			}
			$.naxx.teleport.Export($.naxx.path.meteor+'/ticket/'+self.options.ticket, function(res){
				$.each(res, function(index, value){
						$.each(value, function(stream, ticket){
								$.each(ticket, function(k, v){
										switch(v)
										{
										case 1:
											//self.object.$grid.setRowData(index+1, {('1.'+k).toString(): $.naxx.profile[index][1][k]+'<span class="ui-icon ui-icon-check" />'});
											self.RowState(Number(index), 'SUCCESS');
											break;
										case 0:
											self.RowState(Number(index), 'PROCESSING');
											//self.object.$grid.setRowData(index+1, {('1.'+k).toString(): $.naxx.profile[index][1][k]+'<img src="images/gif/pnotify-loader.gif"></img>'});
											cont = true;
											break;
										case -1:
											self.RowState(Number(index), 'FAILED');
											//self.object.$grid.setRowData(index+1, {('1.'+k).toString(): $.naxx.profile[index][1][k]+'<span class="ui-icon ui-icon-circle-close" />'});
											error = true;
											break;
										case -2:
											//self.object.$grid.setRowData(index+1, {('1.'+k).toString(): $.naxx.profile[index][1][k]+'<span class="ui-icon ui-icon-circle-minus" />'});
											self.RowState(Number(index), 'TIMEOUT');
											error = true;
											break;
										}
								});
						});
				});
				if(cont || new Date().getTime() - self.options.polling_start >= 20000 )
				{
					setTimeout(function(){self.polling();}, 3000);
				}
				else //stop to summary
				{
					if(error)
					{
						$.pnotify({
							pnotify_title: '<span symbol="text:saving_error">Saving error!</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_type: 'error',
							pnotify_text: '<span symbol="text:some_attribute_setting_was_failed_please_check_them_in_the_table" />',
							pnotify_history: false,
							pnotify_stack: stack_bottomright
						});
					}
					else
					{
						$.pnotify({
							pnotify_title: '<span style="color: green;" symbol="text:apply_complete">Apply complete!</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_text: '',
							pnotify_history: false,
							pnotify_stack: stack_bottomright
						});
					}
				}
			},
			function(res){ //polling fail...stop polling
					self.options.ticket = -1;
						$.pnotify({
							pnotify_title: '<span symbol="text:saving_error">Polling error!</span>',
							pnotify_addclass: 'stack-bottomright',
							pnotify_type: 'error',
							pnotify_text: 'polling ticket failed. stop.',
							pnotify_history: false,
							pnotify_stack: stack_bottomright
						});
			});
			$.naxx.translate($.naxx.acl.language, $('.pnotify'));
		},
		initTable: function(){
			var self = this, element = $(this.element);
			element.find('.tablePanel').watch('height,width',function(){
				//20110314 Alive: hdiv must be considered.
				self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height());
				self.object.$grid.setGridWidth($(this).width());
			});

			self.object.$grid = element.find('table.camera.grid.view').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'x' ,'name', 'video_compression_liveview', '', 'video_resolution', 'frame_rate', 'quality', 'video_compression_recording', '', 'video_resolution', 'frame_rate', 'quality', '', ''],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'reset', width : 10, align: 'left', sortable: false, hidden: true},
					{ name : 'name', width : 50, align: 'left', sortable: false, editable: true},
					{ name : '1.encode_type', width : 100, align: 'left', sortable: false},
					{ name : '1.resolution', width : 100, align: 'left', sortable: false, hidden: true},
					{ name : '1.resolutionText', width : 100, align: 'left', sortable: false},
					{ name : '1.frame_rate', width : 50, align: 'left', sortable: false},
					{ name : '1.quality', width : 30, align: 'left'},
					{ name : '0.encode_type', width : 100, align: 'left', sortable: false},
					{ name : '0.resolution', width : 100, align: 'left', sortable: false, hidden: true},
					{ name : '0.resolutionText', width : 100, align: 'left', sortable: false},
					{ name : '0.frame_rate', width : 50, align: 'left', sortable: false},
					{ name : '0.quality', width : 30, align: 'left'},
					{ name : 'enable_audio_recording', width : 30, align: 'left', edittype:'checkbox', editable: true, hidden: true},
					{ name : 'enable_manual_recording', width : 30, align: 'left',edittype:'checkbox', editable: true, hidden: true}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.channel = id - 1 ;
					self.switchChannel(self.options.channel);
				}
			}).show();


		    self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
		    self.object.$grid.setGridWidth(element.find('.tablePanel').width());
			element.find('.statusPanel').height(element.height()-element.find('.tablePanel').height()-element.find('.widget-head').height());

			/*element.find('input').change(function() {
				 self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				 self.object.$grid.jqGrid('setRowData', self.options.channel+1, {modified: '*'}, 'ui-jqgrid-new');
			});*/
		},
		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			$.naxx.teleport.Export($.naxx.path.profile, function(res){
				$.extend($.naxx.profile, res);
				$.naxx.teleport.Export($.naxx.path.encoder, function(res){
					$.extend($.naxx.encoder, res);
					for (var i = 0; i < $.naxx.capability.encoder; i++)
					{
						$.each($.naxx.profile[i], function(stream, profile){
							if(profile.enable)
							{
								$.naxx.profile[i][stream]['resolutionText'] = self.getAdjustedResolution($.naxx.encoder[i], profile);
							}
							else
							{
								$.naxx.profile[i][stream] = self.empty_profile;
							}
						});
						self.object.$grid.jqGrid('addRowData', i+1, $.naxx.profile[i]);
						self.object.$grid.jqGrid('setRowData', i+1, $.naxx.encoder[i]);
						//hide row when empty encoder
						if($.naxx.encoder[i].status != 'CAM_ACTIVE')
							$('#'+(i+1), element).hide();
					}
					if($('.jqgrow:visible').length>0){
						try{
							self.object.$grid.setSelection($('.jqgrow:visible:first').attr('id'));
						}
						catch(e)
						{
						}
					}
//					$('#mode').trigger('change');
				});
			});
		},

		/*按鈕按下後套用*/
		apply : function(bSingle)
		{
			var self = this, element = $(this.element);

			var enable_json = {};
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				var targetObj = self.object.$grid.getRowData(i+1);
				if (targetObj.enable_audio_recording == 'true')
					targetObj.enable_audio_recording = true;
				else
					targetObj.enable_audio_recording = false;

				if (targetObj.enable_manual_recording == 'true')
					targetObj.enable_manual_recording = true;
				else
					targetObj.enable_manual_recording = false;

				enable_json[i] = {
					enable_audio_recording: targetObj.enable_audio_recording,
					enable_manual_recording: targetObj.enable_manual_recording
				};
				$.each(targetObj, function(key, value){
						var stream = key.split('.');
						if(stream.length == 2)
						{
							if (!$.naxx.profile[i][0])
								return true;
							$.naxx.profile[i][Number(stream[0])][stream[1]] = value;
						}
					});
			}

			$.naxx.teleport.Import($.naxx.path.encoder, enable_json,
				function(res)
				{
				}
			);
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
			}
			$.naxx.teleport.Import($.naxx.path.profile, $.naxx.profile,
				function(res)
				{
					if (Number(res) >= 0)
					{
						self.options.polling_start = new Date().getTime();
						self.options.ticket = Number(res);
						self.polling();
					}
					else
					{
						$.pnotify({
								pnotify_title: '<span symbol="text:saving_error">Saving error!</span>',
								pnotify_addclass: 'stack-bottomright',
									pnotify_type: 'error',
									pnotify_text: '<span symbol="text:system_is_busy">Busy</span>',
									pnotify_history: false,
									pnotify_stack: stack_bottomright
							});
						}
							//self.object.$grid.setRowData( i+1, {modified: ''});
					}
				);
		},

		initOther: function(){
			var self = this, element = $(this.element);
			this.defaultOptions();
			for(var i = 0; i < $.naxx.capability.encoder; i++)
			{
				$.naxx.profile[i] = {
					0: {},
					1: {}
				};
				$.naxx.profile[i][0] = self.empty_profile;
				$.naxx.profile[i][1] = self.empty_profile;
			}

			$('div.statusPanel').tabs();
			
			$('form').bind('grid', function(){
				$.naxx.encoder[self.options.channel].enable_audio_recording = $('#enable_audio_recording').val();
				$.naxx.encoder[self.options.channel].enable_manual_recording = $('#enable_manual_recording').val();
				if(self.object.$grid != null)
				{
					self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
					self.RowState(self.options.channel, 'MODIFIED');
				}
			});
		},

		defaultOptions : function(){
			var self = this, element = $(this.element);

			var encode_type = ['jpeg', 'MPEG-4'];
			var resolution = ['176x144', '320x240', '640x480', '800x600'];
			var framerate = [ 1, 2, 3, 5, 8, 10, 15, 20, 25, 30 ];
			var quality = ['Medium', 'Standard', 'Good', 'Detailed', 'Excellent'];
			var quality_symbol = [{symbol:'text:medium'}, {symbol:'text:standard'}, {symbol:'text:good'}, {symbol:'text:detailed'}, {symbol:'text:excellent'}];
			var quality_value = ['1', '2', '3', '4', '5'];

			var options = '';
			for (var i = 0; i < encode_type.length; i++)
				options += '<option value='+encode_type[i]+'>'+encode_type[i]+'</option>'
			$('[name="1.encode_type"]').html(options);
			$('[name="0.encode_type"]').html(options);

			var options = '';
			for (var i = 0; i < resolution.length; i++)
				options += '<option value='+resolution[i]+'>'+resolution[i]+'</option>'
			$('[name="1.resolution"]').html(options);
			$('[name="0.resolution"]').html(options);

			var options = '';
			for (var i = 0; i < framerate.length; i++)
				options += '<option value='+framerate[i]+'>'+framerate[i]+'</option>'
			$('[name="1.frame_rate"]').html(options);
			$('[name="0.frame_rate"]').html(options);

			var options = '';
			for (var i = 0; i < quality.length; i++)
				options += '<option value='+quality_value[i]+' symbol="'+quality_symbol[i].symbol+'">'+quality[i]+'</option>'
			$('[name="1.quality"]').html(options);
			$('[name="0.quality"]').html(options);
		},

		/*用select切換頻道*/
		switchChannel : function(index)
		{
			var self = this, element = $(this.element);
			if (index < 0 || index >= $.naxx.capability.encoder) return;

			this.options.channel = Number(index);

			var current = $('div.statusPanel').tabs('option', 'selected');
			$('div.statusPanel', element).tabs('destroy').html(self.object.formHtml);
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');

			this.defaultOptions();

			var res = $.naxx.encoder[this.options.channel];
			
			var newOption = '';
			var encode_type = res.encode_type_list.split(',');
			for (var i = 0; i < encode_type.length; i++)
			{
				if (encode_type[i] == '') continue;
				newOption += '<option value='+encode_type[i]+'>'+encode_type[i]+'</option>'
			}
			if (newOption != ''){ 
				$('[name="1.encode_type"]').html(newOption).val($.naxx.profile[self.options.channel][1]['encode_type']);
				$('[name="0.encode_type"]').html(newOption).val($.naxx.profile[self.options.channel][0]['encode_type']);
				//20111228 Alive: svn only apply to stream 0#
				$('[name="1.encode_type"] option[value=svc]').remove();
			}
			
			var resolution = new Array();
			var resolutionText = new Array();

			/* From now on, hacking to the Camera: /www/include/video.js=>GenerateFrameSize */
			var resolution_16x9 = res.resolution_list.split(',').reverse();
			var CAPTURE_WIDTH = 1920, CAPTURE_HEIGHT = 1080, DM365_MPEG4_HEIGHT_LIMIT = 984, MOBILE_WIDTH = 176, MOBILE_HEIGHT = 144; //hard code in Camera pages. dont know why not in cgi.
			
			$.each($.naxx.profile[self.options.channel], function(stream, profile){
				if(typeof(profile.roi_size) != 'undefined' && profile.roi_size != '' && profile.roi_size.split('x').length == 2)
				{
					var resolutionArray = new Array();
					resolutionArray.push(profile.roi_size);
	   				var width  = profile.roi_size.split("x")[0];                                                                
					var height = profile.roi_size.split("x")[1];
			
					if ((width * 9 == height * 16) || (width == CAPTURE_WIDTH && height == CAPTURE_HEIGHT)) 
					{
						$.each(resolution_16x9, function(i, obj){
							if( parseInt(obj.split('x')[0]) >= width ) return;
							resolutionArray.push(obj);
						});
					}
					else
					{ 
						var h = self.Normalize(height/2,  8);
						if (h >= DM365_MPEG4_HEIGHT_LIMIT) {
							var w = self.Normalize(width/2, 32);
						} else {
							var w = self.Normalize(width/2, 16);
						}
						while(w >= MOBILE_WIDTH && h >= MOBILE_HEIGHT)
						{
							resolutionArray.push(w+"x"+h);
							h = self.Normalize(h/2,  8); 
							if (h >= DM365_MPEG4_HEIGHT_LIMIT) { // this case won't happen when MAX_RESOLUTION (1600x1200), keep these part just in case.
								w = self.Normalize(w/2, 32);
							} else { 
								w = self.Normalize(w/2, 16);
							}
						}
					}
					resolution = resolutionArray;
					resolutionText = resolution;
				}
				else if(typeof(res.videomode) != 'undefined' && res.videomode != '') //VS
				{
					var tmpStr;                     
					var resolutionArray = new Array();                                                                             
					var resolution = res.resolution_list.split(',');
					var resolutionText = new Array();
						                                                                                                                   
					if (res.eptz == 0)                                                                           
					{                                                                                                                      
						    $.each (resolution, function(i, obj) 
						    {                                                                                                              
								resolutionText.push(self.getAdjustedResolution(res, profile, obj.replace(' ', '')));
						    });                                                                                                                   
					}                                                                                                                            
				}
				else
				{
					resolution = res.resolution_list.split(',');
					resolutionText = res.resolution_list.split(',');
				}
				
				var newOption = '';
				for (var i = 0; i < resolution.length; i++)
				{
					if (resolution[i] == '' || typeof(resolution[i]) == 'undefined') continue;
					newOption += '<option value='+resolution[i].replace(' ','')+'>'+resolutionText[i]+'</option>'
				}
				$('[name="'+stream+'.resolution"]').html(newOption).val(profile['resolution']);
			});

			
			var newOption = '';
			var framerate_max = res.framerate_list.split(',');
			if(framerate_max.length > 0 && framerate_max[0] != '')
			{
				max = framerate_max[resolution.indexOf($('#resolution').val())];
				var framerate_all = [ 1, 2, 3, 5, 8, 10, 15, 20, 25, 30 ];
				$.each(framerate_all, function(index, value){
					if (value <= max)
					{
						newOption += '<option value='+value+'>'+value+'</option>';
					}
				});
			}
			if (newOption != ''){
				$('[name="1.frame_rate"]').html(newOption).val($.naxx.profile[self.options.channel][1].framerate);
				$('[name="0.frame_rate"]').html(newOption).val($.naxx.profile[self.options.channel][0].framerate);
			}

			$('form>fieldset>div', element).addClass('rowElem');
			$.naxx.translate();
			self.transform();
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');
			$('form div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
			});
			$("form div.jqTransformSelectWrapper ul li a").click(function(){
				$(this).parent().parent().siblings('select').trigger('change');
				 self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				 self.RowState(self.options.channel, 'MODIFIED');
				 if ( $.naxx.encoder[self.options.channel].stream_count == 1) //VS8801
				 {
					 self.object.$grid.jqGrid('setRowData', self.options.channel+1, {'1.resolution': '-', '1.encode_type': '-', '1.frame_rate': '-', '1.quality': '-'});
				 }
				 if ($(this).parent().parent().siblings('select').attr('id').split('.')[1] == 'resolution')
				 {
					if ( typeof($.naxx.encoder[self.options.channel].videomode != 'undefined') && $.naxx.encoder[self.options.channel].videomode != '') //VS
					{
						var obj = {};
						obj[$(this).parent().parent().siblings('select').attr('id')+'Text'] = self.getAdjustedResolution($.naxx.encoder[self.options.channel], $.naxx.profile[self.options.channel][$(this).parent().parent().siblings('select').attr('id').split('.')[0]], $(this).parent().parent().siblings('select').val());
						self.object.$grid.jqGrid('setRowData', self.options.channel+1, obj);
					}
					self.switchChannel(self.options.channel);
				}
				return false; //prevent default browser action
			});
			
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');
			//if(!$.browser.msie) $(':checkbox', element).iButton('repaint');
			
			element.find('form input, form select').change(function() {
				 self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				 self.RowState(self.options.channel, 'MODIFIED');
			});
			if ( $.naxx.encoder[self.options.channel].stream_count == 1)
			{
				if(current == 1)
					$('div.statusPanel').tabs({selected: 2});
				else
					$('div.statusPanel').tabs({selected: current});
				$('div.statusPanel').tabs('disable', 1);
			}
			else
				$('div.statusPanel').tabs({selected: current});

		}
	});
})(jQuery);
