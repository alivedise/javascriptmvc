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
 * Date: 2010-11-18 10:27:25
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.camera: camera setting management
 *
 */

;(function($) {
	$.widget('naxx.config_camera', $.naxx.config, {
		object: {
			$scan: null
		},
		options: {
			past: -1,
			drm_current: -1,
			timestamp: 0,
			keep_repeat: true
		},
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_camera').config_camera('apply', 'all');
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Remove',
				attr: {
					symbol: 'text:remove'
				},
				callback: function(self, element){
					$(':naxx-config_camera').config_camera('empty');
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Search',
				attr: {
					symbol: 'text:search_device'
				},
				callback: function(self, element){
					$(':naxx-config_camera').config_camera('search');
					return false;
				}
			/*},
			{
				type: 'settingBtn',
				text: 'Detect',
				attr: {
					symbol: 'text:detect'
				},
				callback: function(self, element){
					$(':naxx-config_camera').config_camera('detect');
					return false;
				}*/
			}
		],
		empty: function(index){
			var self = this, element = $(this.element);
			if(typeof(index)=='undefined') index = self.options.channel;
			self.object.$grid.setRowData(index+1, {username: '', password: '', address: '', enable: true, enable_recording: true, model: '', brand: '', port: 80, modified: '*', name: 'Camera'+(index+1), channel_count: 1, device_channel: 0}, 'ui-jqgrid-new');
			$('[role=row][id='+(index+1)+']', element).removeClass('ui-jqgrid-repeat');
			self.object.$grid.setSelection(self.options.channel+1);
		},
		initTable: function(){
			var self = this, element = $(this.element);
			self.object.$grid = element.find('table.camera.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'name', 'ip_address', 'enabled', 'port' , 'model', 'brand' ,'status' , '', '', '', '', 'device_channel', 'channel_count'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'name', width : 100, align: 'left', sortable: false},
					{ name : 'address', width : 50, align: 'left', sortable: false},
					{ name : 'enable', width : 30, align: 'left', sortable: false, hidden: true},
					{ name : 'port', width : 20, align: 'left', sortable: false, edittype:'number'},
					{ name : 'model', width : 50, align: 'left'},
					{ name : 'brand', width : 50, align: 'left'},
					{ name : 'status_icon', width : 20, align: 'left', hidden: true},
					{ name : 'status', width : 20, align: 'left', hidden: true},
					{ name : 'username', width : 0, align: 'left', hidden: true, sortable: false},
					{ name : 'password', width : 0, align: 'left', hidden: true, edittype: 'password', sortable: false},
					{ name : 'enable_recording', width : 0, align: 'left', hidden: true, sortable: false},
					{ name : 'device_channel', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'channel_count', width : 50, align: 'left', sortable: false, hidden: true}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					//if(!$.browser.msie) $(":checkbox", element).iButton("repaint");
					self.options.channel = id - 1 ;
					self.switchChannel();
				}
			}).show();


			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		initOther: function(){
			var self = this, element = $(this.element);
			//element.find('.statusPanel').height(element.height()-element.find('.tablePanel').height()-element.find('.widget-head').height());
			element.find('input,select').change(function() {
				 self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				 self.RowState(self.options.channel, 'MODIFIED');
			});

			$('.statusPanel', element).droppable({
				accept: ".jqgrow",
				drop: function( event, ui ) {
					var accept = $(ui.draggable).attr("id");
					var rowdata = ui.draggable.parent().parent().jqGrid('getRowData',accept);
					for(var i in rowdata) {
					// this is very slow on big table and form.
							$("[name="+i+"]",'form').val(rowdata[i]);
					}
					$('#modified').val('*');
					self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
					self.RowState(self.options.channel, 'MODIFIED');
				}
			});
			element.find('.tablePanel').bind('keydown', 'ctrl+c', function(){
					self.options.past = Number(self.object.$grid.getGridParam('selrow') - 1);
			}).bind('keydown', 'del', function(){
					self.empty(self.options.channel);
			}).bind('keydown', 'ctrl+del', function(){
				$.each(self.object.$grid.getRowData(), function(i, v){
					self.empty(i);
				});
			}).bind('keydown', 'ctrl+shift+v', function(event){
				if(self.options.past <  0)
				{
					var copy = self.object.$grid.getRowData(self.options.channel+1);
					self.options.past = self.options.channel+1;
				}
				else
					var copy = self.object.$grid.getRowData(self.options.past+1);
				delete copy['name'];

				for (var i = 1; i <= 16; i++)
				{
					if(i == self.options.past) continue;
					copy['name'] = 'Camera '+i;
					copy['address'] = self.generateValidIP(copy['address']);
					self.object.$grid.setRowData(i, copy);
					self.RowState(i, 'MODIFIED');
				}
				self.detect('GRID');
				self.switchChannel();
			}).bind('keydown', 'ctrl+v', function(event){
					if(self.options.past <  0) return true;
					var copy = self.object.$grid.getRowData(self.options.past+1);
					delete copy['name'];
					try
					{
						copy['name'] = 'Camera '+(self.options.channel+1);
						copy['address'] = self.generateValidIP(copy['address']);
					}
					catch(e)
					{
					}
					self.object.$grid.setRowData(self.options.channel+1, copy);
					self.RowState(self.options.channel, 'MODIFIED');
					self.detect('ROW');
					self.switchChannel();
			});
		},

		createPanel: function(){
			var self = this, element = $(this.element);
			if ($('#drm_panel').length == 0)
			{
				$('<div id="drm_panel" class="blockform"><span symbol="text:search_device"></span><img src="images/gif/comet_progress.gif" /><div class="top_right"><input type="checkbox" name="toggleRepeat" id="toggleRepeat"><label symbol="text:keep_repeat_camera_in_current_camera_list" for="toggleRepeat" /></div><table id="grid_drm"></table></div>').appendTo(element);
				$('#toggleRepeat').change(function(){
					if($(this).attr('checked'))
					{
						self.options.keep_repeat = true;
						self.object.$scan.find('.ui-jqgrid-repeat').show();
					}
					else
					{
						self.options.keep_repeat = false;
						self.object.$scan.find('.ui-jqgrid-repeat').hide();
					}
				});
				//$('<button id="refresh" symbol="text:refresh">Refresh</button>').button().click(function(){
					
				//$('<div class="block_description"><span symbol="text:choose_a_device_and_click_the_insert_button"></span></div>').appendTo($('#drm_panel'));
				//}).appendTo($('#drm_panel'));
				$('<button id="close" symbol="text:close" class="block">Close</button>').button().click(function(){
					window.clearInterval(self.object.$timer);
					$.unblockUI();
				}).appendTo($('#drm_panel'));
			}
			//$.naxx.translate();
		},

		generateValidIP: function(origin_ip){
			var self = this, element = $(this.element);
			var origin_ips = new Array();
			origin_ips = origin_ip.split('.');
			var valid_ip = origin_ip;
			if(origin_ips.length != 4) return origin_ip; //invalid origin ip
			$.each(self.object.$grid.getRowData(), function(index, value){
				if( value['address'] == valid_ip )
				{
					if( origin_ips[3] == '255' )
					{
						if( origin_ips[2] == '255' )
						{
							if( origin_ips[1] == '255' )
							{
								origin_ips[0] = (Number(origin_ips[0])+1)%255;
							}
							origin_ips[1] = (Number(origin_ips[1])+1)%255;
						}
						origin_ips[2] = (Number(origin_ips[2])+1)%255;
					}
					valid_ips = origin_ips[0] + '.' + origin_ips[1] +'.'+ origin_ips[2] + '.' + (Number(origin_ips[3])+1)%255 ;
				}
			});
			return valid_ips;
		},

		generateChannel : function(channel_count){
			var self = this, element = $(this.element);
			if($('#model').val()=='') return;
			else
			{
				var channel_count;
				$('#view_channel').empty();
				for(var i = 0; i < channel_count; i++)
				{
					$('#view_channel').append('<option value='+i+' selected="true">'+(i+1)+'</option>');
				}
			}
		},
		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			$.naxx.teleport.Export($.naxx.path.encoder, function(res){
				$.extend($.naxx.encoder, res);
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					self.object.$grid.jqGrid('addRowData', i+1, $.naxx.encoder[i]);
				}
				self.object.$grid.setSelection(1);
			});
		},
		/*按鈕按下後套用*/
		apply : function(type)
		{
			var self = this, element = $(this.element);
			var encoder = {};
			$.each(self.object.$grid.getRowData(), function(index, value)
			{
				if ($.naxx.encoder[index].status == 'CAM_FILTER') return true;

				if (value.enable == 'true')
					value.enable = true;
				else
					value.enable = false;

				if (value.enable_recording == 'true')
					value.enable_recording = true;
				else
					value.enable_recording = false;

				encoder[index] = 
				{
					name: value.name,
					address: value.address,
					port: Number(value.port),
					username: value.username,
					password: value.password,
					enable_recording: value.enable_recording,
					enable: value.enable,
					device_channel: Number(value.device_channel)
				};
			});
				
			$.naxx.teleport.Import(
				$.naxx.path.encoder, 
				encoder,
				function(res)
				{
					self.RowState(self.options.channel, 'CLEANALL');
				}
			);
		},
		copy2all: function()
		{
			var self = this, element = $(this.element);
			var sourceChannel = self.options.channel;
			var sourceData = self.object.$grid.getRowData(sourceChannel+1);
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				var targetChannel = i;
				if (sourceChannel == targetChannel) continue;
				var targetData = self.object.$grid.getRowData(targetChannel+1);
				$.extend(targetData,
				{
					name: targetData.name,
					brand: sourceData.brand,
					model: sourceData.model,
					address: targetData.address, //only this remaining
					port: Number(sourceData.port),
					username: sourceData.username,
					password: sourceData.password,
					enable: sourceData.enable,
					modified: '*'
				});
				self.object.$grid.jqGrid('FormToGrid', i+1, 'form');
				self.object.$grid.jqGrid('setRowData', i+1, targetData);
				self.RowState(i, 'MODIFIED');
			}
		},


		validate: function(){
			var self = this, element = $(this.element);
			$('#name').change(function(){
				if($(this).val() == '')	
					self.addAlertIcon($(this));
				else
					self.removeAlertIcon($(this));
			});

			$('#username').ainputblock({
				symbols: ['@', '$', '!', '~', '@', '^', '_', '-', '.', '%']
			});

			$('#address,#port,#username,#password').change(function(){
				if($('address').val() != self.object.$grid.getRowData(self.options.channel+1).address){
					//when ip changes, reset device channel
					self.object.$grid.setRowData(self.options.channel+1, {channel_count: 1, device_channel: 0});
				}
				if($('#address').val() != '')
				{
					self.detect('FORM');
				}
			});
		},

		/*用select切換頻道*/
		switchChannel : function()
		{
			var self = this, element = $(this.element);

			/*填值*/
			$('.statusPanel', element).html(self.object.formHtml);
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');
			res = self.object.$grid.getRowData(self.options.channel+1);
			if(res.channel_count.isNumber() && Number(res.channel_count) > 1)
			{
				var newOption = '';
				for (var i = 0; i < res.channel_count; i++)
					newOption += '<option value='+i+'>'+(i+1)+'</option>'
				$('label[for=device_channel]').parent().show();
				$('label[for=device_channel]').next().remove();
				$('<select id="device_channel" name="device_channel">'+newOption+'</select>').insertAfter($('label[for=device_channel]'));
				$('#device_channel').val(res.device_channel).change(function(){
						self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
						self.RowState(self.options.channel, 'MODIFIED');
					});
				$('from').jqTransform();
				$('form div.jqTransformSelectWrapper select').each(function(){
					$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
				});
			}
			else
			{
				$('label[for=device_channel]').parent().hide();
			}
			$('form>fieldset>div', element).addClass('rowElem');
			$.naxx.translate();
			self.transform();
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');
			$('form div.jqTransformSelectWrapper select').each(function(){
				$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
			});
			$('form .jqTransformCheckboxWrapper input').each(function(){
					$(this).trigger('change');
			});
			$("form div.jqTransformSelectWrapper ul li a").click(function(){
				$(this).parent().parent().siblings('select').trigger('change');
				self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				self.RowState(self.options.channel, 'MODIFIED');
				return false; //prevent default browser action
			});
			
			self.object.$grid.jqGrid('GridToForm', self.options.channel+1, 'form');
			//if(!$.browser.msie) $(':checkbox', element).iButton('repaint');
			
			element.find('form input').change(function() {
				self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				self.RowState(self.options.channel, 'MODIFIED');
			});

			$('<div id="snapshot"><img src="images/SNAP-'+self.options.channel+'-Latest.jpg"></img></div>').appendTo($('.statusPanel'));
			var img = new Image();
			//$('#snapshot').addClass('loading');
			$(img).load(function(){
			//	$('#snapshot').append(this).removeClass('loading');
			})
			.error(function (res) {
				$('div#snapshot').html('<span></span><img src="images/widget/viewcell/ViewCellLogo.png" class="empty" />');
			})
			.attr('src', 'images/SNAP-'+self.options.channel+'-Latest.jpg');

			$('input.ip', element).ipaddress({cidr: false});
			self.validate();

		},

		drm: function(){
			var self = this, element = $(this.element);
			self.object.$scan.clearGridData();
		},

		getCurrentList: function(){
			var self = this, element = $(this.element);
			var items = new Array();
			$.each(self.object.$grid.getRowData(), function(index, value)
			{
				items.push({
					title : (index+1)+' '+value.model,
					attr: {
						channel: index
					},
					action : {
						type : "fn",
						callback : "(function(data){ self.fromDrmToCamera(data.channel()); })"
					}
				});
			});
			return items;
		},

		fromDrmToCamera: function(channel){
			var self = this, element = $(this.element);
			var id = self.object.$scan.getGridParam('selrow');
			var result = self.object.$scan.jqGrid('getRowData', id);
			//check for repeated items in current camera list
			$.each(self.object.$grid.getRowData(), function(index, value){
					if (value['address'] == result['address'] && value['device_channel'] == result['device_channel'])
					{
						self.object.$grid.setRowData(index+1, {username: '', password: '', address: '', enable: true, enable_recording: true, model: '', brand: '', port: 80, modified: '*'}, 'ui-jqgrid-new');
					}
				});
			self.object.$grid.jqGrid('setRowData', channel+1, result);
			self.RowState(channel, 'MODIFIED');
			self.object.$grid.jqGrid('setSelection', channel+1);
			self.object.$scan.find('#'+id).addClass('ui-jqgrid-repeat');
			if(self.options.keep_repeat) self.object.$scan.find('#'+id).show();
			else self.object.$scan.find('#'+id).hide();
		},

		search : function()
		{
			var self = this, element = $(this.element);
			//self.object.$layout.open('east');
			self.createPanel();
			
			if(self.object.$scan!=null)
			{
				self.object.$scan.clearGridData();
			}
			else
			{
				var obj = {};
				$.each(self.object.$grid.getRowData(), function(k, v){
					var key = 'address'+k;
					obj[key] = function(){
						return self.object.$grid.getRowData(k+1).modified == '' ? '<span channel='+k+'>'+self.object.$grid.getRowData(k+1).address+'</span>' : '<span channel='+k+' style="color:green">'+self.object.$grid.getRowData(k+1).address+'</span>';
					}
				});
				self.object.$scan = element.find('table#grid_drm').jqGrid({
						altRows: true,
						//rownumbers: true,
						rowNum: 1000,
						height: 500,
						width: 750,
						viewrecords: true,
						pgbuttons: false, //不顯示翻頁按鈕
						pginput: false, //不顯示翻頁輸入框
						shrikToFit: true,
						sortable: true,
						datatype: 'local',
						colNames : ['mac_address', 'ip_address' , 'channel', '','','', 'brand' , 'model' , 'port'],
						colModel : [
							{ name : 'mac', index: 'mac', width : 110, align: 'left', sorttype: 'text' },
							{ name : 'address', index: 'address', width : 130, align: 'left', sorttype: function(cell){
									var array = cell.split('.');
									$.each(array, function(index, value){
										array[index] = value.padL(3, '0');
									});
									return array.join('.');
							}},
							{ name : 'current_channel', index: 'address', width : 20, align: 'left', sorttype: 'int'},
							{ name : 'device_channel', index: 'address', width : 130, align: 'left', sorttype: 'int', hidden: true},
							{ name : 'channel_count', index: 'address', width : 130, align: 'left', sorttype: 'int', hidden: true},
							{ name : 'insert', index: 'insert', width : 60, align: 'left', sortable: false},
							{ name : 'brand', index: 'brand', width : 100, align: 'left', edittype: 'select', editoptions: {value:"Vivotek:Vivotek;Onvif:Onvif"}, sorttype: 'text' },
							{ name : 'model', index: 'model', width : 70, align: 'left', edittype: 'select', sortable: true, sorttype: 'text' },
							{ name : 'port', index:'port', width : 50, align: 'left', sorttype: 'int' }
						],
						ondblClickRow: function(){
							self.object.$scan.jqGrid('GridToForm', self.object.$scan.jqGrid('getGridParam','selrow'), 'form');
							self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
							self.RowState(self.options.channel, 'MODIFIED');
						}
					});
							
					$('#grid_drm').on('mouseenter', '.jqgrow', function(){
						$(this).find('span.drminsert').css({display: 'inline-block'});
						if($(this).find('span.drminsert[forid]').length > 0) return true;
						$(this).find('span.drminsert').attr('forid', $(this).attr('id')).jjmenu(
							'both',
							[{'getByFunction': function(data){
										var items = new Array();
										for (var index = 0; index < $.naxx.capability.encoder; index++)
										{
											var value = $.naxx.encoder[index];
											items.push({
													title : '<span channel='+index+'>'+(Number(index)+1)+'.'+value.name+':</span>#address'+index+'#',
													attr: {
														channel: index
													},
													action : {
														type : "fn",
														callback : function(event){ 
															self.fromDrmToCamera(Number($(event.target).attr('channel')));
															$("div[id^=jjmenu]").remove(); 
														}
													}
												});
										}
										return items;
									}}],
							obj,
							{show:"fadeIn", xposition:"left", yposition:"auto", "orientation":"auto", offset: [0, -13]},
							function(event){
											self.object.$scan.setSelection($(event.target).attr('forid'));
											$('.drminsert:visible').each(function(){
												if(Number($(this).parent().parent().attr('id')) != self.object.$scan.getGridParam('selrow'))
													$(this).hide();
											});
										}

									);
							$(this).find('span.drminsert').not(':naxx-vivobutton').vivobutton({type: 'drminsert', name:''});
					}).on('mouseleave', '.jqgrow',function(){
							if(self.object.$scan.getGridParam('selrow') == Number($(this).attr('id'))) return true;
						$(this).find('span.drminsert').css({display: 'none'});
					});
			}


			var count = 0;
			var cur_value = 0;



			$.naxx.teleport.Exec($.naxx.path.galaxy, 'exec_scan', '', function(){});
				self.object.$timer = setInterval(
					function(){
						$.naxx.teleport.Exec($.naxx.path.galaxy, 'exec_get', 'start_at='+count, function(res){
							if(res == '[]' || res == [] || typeof(res)=='undefined') return;
							$.each(res, function(index, value){
								res[index]['insert'] = '<span class="drminsert"></span>';
								switch(res[index]['brand'].substring(0, 6))
								{
								case 'VS8801':
									var max = 8;
									break;
								case 'VS8401':
									var max = 4;
									break;
								default:
									var max = 1;
									break;
								}
								count++;
								for (var i = 0; i < max; i++)
								{
									cur_value++;
									res[index]['channel_count'] = max;
									res[index]['device_channel'] = i;
									res[index]['current_channel'] = i+1;
									var brepeat = false;
									$.each(self.object.$grid.getRowData(), function(cid, camera){
											if(camera['address'] == value['address'] && Number(camera['device_channel']) == i)
											{
												brepeat = true;
											}
									});
									if(!brepeat)
									{
										self.object.$scan.addRowData(cur_value, res[index]);
									}
									else
									{
										self.object.$scan.addRowData(cur_value, res[index]);
										self.object.$scan.setRowData(cur_value, {}, 'ui-jqgrid-repeat');
									}
								}
							});
						});
					} ,3000);
			
			$('#toggleRepeat').attr('checked', true);
			$.naxx.block('#drm_panel');
		
		},

		detect: function(source_type){
			var self = this;
			var element = $(this.element);
			switch(source_type)
			{
			case 'GRID':
				$.each(self.object.$grid.getRowData(),
					function(index, encoder){
						self.object.$grid.setRowData(index+1, {model: self.grid.PROCESSING, brand: self.grid.PROCESSING});
						self.RowState(index, 'MODIFIED');
						$.naxx.teleport.Exec($.naxx.path.meteor, 'exec_status', 'data='+JSON.stringify(encoder), function(res){
							if(res.Response == 200)
							{
								self.object.$grid.setRowData(index+1, $.extend(res, {name: 'Camera '+(index+1)+' - '+res.model}));
								self.RowState(index, 'MODIFIED');
								if(self.options.channel == index)
									self.object.$grid.setSelection(single+1);
							}
							else
							{
								if(self.object.$grid.getRowData(index+1).model.search('gif') < 0) return;
								self.object.$grid.setRowData(index+1, {model: '-', brand: '-'});
							}
					},
					function(timeout){
						if(self.object.$grid.getRowData(index+1).model.search('gif') < 0) return;
						self.object.$grid.setRowData(index+1, {model: '-', brand: '-'});
					});
				});
				break;
			case 'ROW':
				var single = self.options.channel;
				self.object.$grid.setRowData(self.options.channel+1, {model: self.grid.PROCESSING, brand: self.grid.PROCESSING});
				$.naxx.teleport.Exec($.naxx.path.meteor, 'exec_status', 'data='+JSON.stringify(self.object.$grid.getRowData(self.options.channel+1)), 
					function(res){
						if(res.Response == 200)
						{
							self.object.$grid.setRowData(single+1, res);
							self.RowState(single, 'MODIFIED');
							if(self.options.channel == single)
								self.object.$grid.setSelection(single+1);
						}
						else
						{
							if(self.object.$grid.getRowData(single+1).model.search('gif') < 0) return;
							self.object.$grid.setRowData(single+1, {model: '-', brand: '-'});
						}
					},
					function(timeout){
						if(self.object.$grid.getRowData(single+1).model.search('gif') < 0) return;
						self.object.$grid.setRowData(single+1, {model: '-', brand: '-'});
					}
				);
				break;
			case 'FORM':
				var single = self.options.channel;
				self.object.$grid.setRowData(self.options.channel+1, {model: self.grid.PROCESSING, brand: self.grid.PROCESSING});
				$.naxx.teleport.Exec($.naxx.path.meteor, 'exec_status', 'data='+JSON.stringify($('form', element).serializeObject()), 
					function(res){
						if(res.Response == 200)
						{
							self.object.$grid.setRowData(single+1, res);
							self.RowState(single, 'MODIFIED');
							if(self.options.channel == single)
								self.object.$grid.setSelection(single+1);
						}
						else
						{
							if(self.object.$grid.getRowData(single+1).model.search('gif') < 0) return;
							self.object.$grid.setRowData(single+1, {model: '-', brand: '-'});
						}
					},
					function(timeout){
						if(self.object.$grid.getRowData(single+1).model.search('gif') < 0) return;
						self.object.$grid.setRowData(single+1, {model: '-', brand: '-'});
					}
				);
				break;
			}
		}
	});
})(jQuery);
