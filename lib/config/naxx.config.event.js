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
 * Date: 2011-03-22 13:15:51
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.video: event configuration
 *
 */

;(function($) {
	$.widget('naxx.config_event', $.naxx.config, {
		_schedule: [],
		_triggerObj: {},
		_triggerA: [],
		object: {
			$trigger: null,
			$action: null,
			$schedule: null
		},
		symbols: {
			'email': { symbol: 'text:email' },
			'ftp': { symbol: 'text:ftp' },
			'do': { symbol: 'text:do' },
			'buzzer': { symbol: 'text:buzzer' },
			'http': { symbol: 'text:http' },
			'recording': { symbol: 'text:recording' },
			'camera_control': { symbol: 'text:camera_control' },
			'di': { symbol: 'text:di' },
			'do': { symbol: 'text:do' },
			'motion': { symbol: 'text:motion' },
			'pir': { symbol: 'text:pir' }
		},
		buttons:[
			{
				type: 'settingBtn',
				text: 'Apply',
				attr: {
					symbol: 'text:save',
					id: 'save_alarm'
				},
				callback: function(self, element){
					$(':naxx-config_event').config_event('apply', false);
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Create',
				attr: {
					symbol: 'text:create_alarm',
					id: 'create_alarm'
				},
				callback: function(self, element){
					$(':naxx-config_event').config_event('newAlarm', false);
					return false;
				}
			},
			{
				type: 'settingBtn',
				text: 'Remove',
				attr: {
					symbol: 'text:remove_alarm',
					id: 'remove_alarm'
				},
				callback: function(self, element){
					$(':naxx-config_event').config_event('delAlarm', false);
					return false;
				}
			}
		],

		delAlarm: function(){
			var self = this, element = $(this.element);
			if( self.object.$grid.getGridParam('selrow') <= 0 )
			{
				$.naxx.blockWarn('<div><span symbol="text:please_select_an_alarm_first" /></div>');
				$.naxx.translate();
				setTimeout(function(){
					$.unblockUI();
				}, 2000);
				return;
			}
			$('#create_alarm').button('enable');
			$.naxx.translate($.naxx.acl.language, $('button'));
			$.each($.naxx.alarm[self.options.index].action, function(index, value){
				$.naxx.alarm[self.options.index].action[index].type = '';
			});
			self._schedule = [];
			self._triggerA = [];
			self.rfcEncoder();
			self.triggerEncoder();
			$('#'+(self.options.index+1)).hide();
			if($('.jqgrow:visible', element).length>0)
			{
				self.object.$grid.setSelection($('.jqgrow:visible:first').attr('id'));
			}
			else
			{
				self.options.index = -1;
				self.describeAlarm();
			}
			if( self.object.$grid.find('.jqgrow:visible').length == 0 )
			{
				$('#remove_alarm').button('disable');
			}
			$.naxx.translate();
		},

		newAlarm: function(){
			var self = this, element = $(this.element);
			if( self.object.$grid.find('.jqgrow:visible').length >= $.naxx.capability.encoder )
			{
				$.blockUI({message: '<div><span symbol="text:maximum_alarm_exceed" /></div>', timeout: 2000});
				$.naxx.translate($.naxx.acl.language, '.blockUI');
				return;
			}
			$('#remove_alarm').button('enable');
			$.naxx.translate($.naxx.acl.language, $('button'));
			first = self.object.$grid.find('.jqgrow:hidden').eq(0);
			first.show();
			self.object.$grid.resetSelection();
			self.object.$grid.setSelection(first.attr('id'));
			self.options.index = Number(first.attr('id')) - 1;
			self.create();
			if( self.object.$grid.find('.jqgrow:visible').length >= $.naxx.capability.encoder )
			{
				$('#create_alarm').button('disable');
			}
		},

		describeAlarm: function(){
			var self = this, element = $(this.element);
			$('#alarmdes div', element).remove();
			$('<div class="trigger rowElem"><label symbol="text:trigger">Trigger</label></div>').click(function(){
			}).appendTo($('#alarmdes'));
			$('<div class="action rowElem"><label symbol="text:assigned_actions">Action</label></div>').click(function(){
			}).appendTo($('#alarmdes'));
			$('<div class="schedule rowElem"><label symbol="text:event_schedule">Schedule</label></div>').click(function(){
			}).appendTo($('#alarmdes'));
			$('<a href="#"><u style="color:grey"><span symbol="text:add_a_new_trigger"></span></u></a><span class="warning ui-corner-all" symbol="text:no_trigger_please_create"></span>"').click(function(){
				self.create(0);
			}).insertAfter($('#alarmdes div.trigger label'));
			$('<span></span>').vivobutton({
					name:'add',
					type:'playq',
					callback:function(){$(':naxx-config_event').config_event('create');}
			}).insertAfter($('div.trigger label'));
		$('<a href="#"><u style="color:grey"><span symbol="text:assign_a_new_action"></span></u></a><span class="warning ui-corner-all" symbol="text:no_action_assigned_please_assign"></span>').click(function(){
				self.create(1);
			}).insertAfter($('#alarmdes div.action label'));
		$('<span></span>').vivobutton({name:'add', type:'playq', callback:function(){$(':naxx-config_event').config_event('create', 1);}}).insertAfter($('div.action label'));
			$('<a href="#"><u style="color:grey"><span symbol="text:define_a_new_schedule"></span></u><span class="infomation ui-corner-all" symbol="text:no_schedule_default_is_all_the_day"></span>').click(function(){
				self.create();
				$('#alarmEditor').tabs('select', 2);
			}).insertAfter($('#alarmdes div.schedule label'));
		$('<span></span>').vivobutton({name:'add', type:'playq', callback:function(){$(':naxx-config_event').config_event('create', 2);}}).insertAfter($('div.schedule label'));
			$.each(self._triggerA, function(index, value){
				$('#alarmdes div.trigger span.warning').hide();
				var channel = value[0];
				var trigger = value[1];
				if (channel == 's') channel = "<span symbol='text:server'>NVR Server</span>";
				else channel = '<span symbol="text:channel">Channel</span><span> '+(Number(channel)+1)+'</span>';
				$('<span></span>').vivobutton({name: 'remove', type: 'playq'}).click(function(){
					self._triggerA.splice(index, 1);
					self.triggerEncoder();
					self.describeAlarm();
					//$(this).next().remove();
					//$(this).remove();
					return false;
				}).appendTo($('#alarmdes div.trigger'));
				$('<a href="#"><u>'+(channel)+'<span>-</span><span symbol="'+self.symbols[self.trigger_type[value[1]]].symbol+'"></span><span>'+self.trigger_subindex[value[1]]+'</span></u></a>').click(function(e){
					self.create();
					$('#alarmEditor').tabs('select', 0);
					self.object.$trigger.setSelection(Number(index)+1);
				}).appendTo($('#alarmdes div.trigger'));
			});
			if(self.options.index < 0) return;
			$.each($.naxx.alarm[self.options.index].action, function(key, value){
				if (value.type)
				{
					$('#alarmdes div.action span.warning').hide();
					var more = '';
					switch(value.type)
					{
					case 'recording':
						var chs = value['recording'].channel.split(',');
						$.each(chs, function(index, value){chs[index] = Number(value)+1;})
						more = '<span> (</span><span symbol="text:channel">Channel</span><span> '+chs.toString()+')</span>';
						break;
					case 'do':
						more = '<span> (</span>'+(isNaN(Number(value['do'].channel)) ? '<span symbol="text:server"></span>':'<span symbol="text:channel">Channel</span><span> '+(Number(value['do'].channel)+1))+')</span>';
						break;
					case 'ftp':
						more = '<span> (ftp://'+value['ftp'].address+')</span>';
						break;
					case 'email':
						more = '<span> (</span><span symbol="text:recipient_email_address">to</span><span> '+value['email'].re+')</span>';
						break;
					case 'http':
						more = '<span> (</span>'+value['http'].address+'<span>)</span>';
						break;
					case 'camctrl':
						more = '<span> ('+(Number(value['camctrl'].channel)+1)+',\'s '+value['camctrl'].goto+')</span>';
						break;
					case 'buzzer':
						more = '';
						break;
					}
					$('<span></span>').vivobutton({type: 'playq', name: 'remove'}).click(function(){
						$.naxx.alarm[self.options.index].action[key].type = '';
						self.describeAlarm();
						return false;
					}).appendTo($('#alarmdes div.action'));
					$('<a href="#"><u><span symbol="'+self.symbols[value.type].symbol+'"></span>'+more+'</u></a>').click(function(){
						self.create();
						$('#alarmEditor').tabs('select', 1);
						self.object.$action.setSelection(Number(key)+1);
					}).appendTo($('#alarmdes div.action'));
				}
			});
			$.each(self._schedule, function(key, value){
				if (value.freq && value.byday)
				{
					$('#alarmdes div.schedule span.infomation').hide();
					var temp = new Array();
					$.each(value.byday.split(','), function(index, value){
						if (value=='MO') temp.push('<span symbol="text:mon"></span>');
						else if (value=='TU') temp.push('<span symbol="text:tue"></span>');
						else if (value=='WE') temp.push('<span symbol="text:wed"></span>');
						else if (value=='TH') temp.push('<span symbol="text:thu"></span>');
						else if (value=='FR') temp.push('<span symbol="text:fri"></span>');
						else if (value=='SA') temp.push('<span symbol="text:sat"></span>');
						else if (value=='SU') temp.push('<span symbol="text:sun"></span>');
					});

					var daylong = '<span> (</span>';
					if(value.start != '00:00' || value.end != '24:00'){
						daylong += '<span symbol="text:from">from</span><span> '+value.start+' </span><span symbol="text:to">to</span><span> '+value.end+')</span>';
					}
					else{
						daylong += '<span symbol="text:all_day">all day</span><span>)</span>';
					}
					$('<span></span>').vivobutton({type: 'playq', name: 'remove'}).click(function(){
						self._schedule[key].freq = '';
						self.rfcEncoder();
						self.describeAlarm();
						return false;
					}).appendTo($('#alarmdes div.schedule'));
					$('<a href="#"><u>'+temp.toString().replace(new RegExp(',', 'gm'), '<span>,</span>')+daylong+'</u></a>').click(function(){
						self.create();
						$('#alarmEditor').tabs('select', 2);
						self.object.$schedule.setSelection(Number(key)+1);
					}).appendTo($('#alarmdes div.schedule'));
				}
			});
			$.naxx.translate($.naxx.acl.language, element.find('form'));

		},
		copy2all: function(){
			var self = this, element = $(this.element);
			for (var i = 0; i < $.naxx.capability.alarm; i++)
			{
				$.naxx.alarm[i] = $.naxx.alarm[self.options.index];
			}
		},
		options: { index: 0 },
		rfcDecoder: function(){
			var self = this, element = $(this.element);
			self._schedule = {};
			$.each($.naxx.alarm[self.options.index].schedule, function(key, policy){
				var obj = $.naxx.rfcParser(policy);
				var start = $.naxx.checkDate(obj.dtstart);
				if(obj.dtend) var end = $.naxx.checkDate(obj.dtend);
				else var end = start;
				if(start != '')
				{
					var end_hour = end.formatDate('HH:mm');
					if (end_hour== '00:00') end_hour = '24:00';
					$.extend(obj, {start:start.formatDate('HH:mm'), end:end_hour});
				}
				else
				{
					$.extend(obj, {start:'00:00', end:'24:00'});
				}
				self._schedule[key] = obj;
			});
		},
		rfcEncoder: function(){
			var self = this, element = $(this.element);
			$.naxx.alarm[self.options.index]['schedule'] = {};
			$.each(self._schedule, function(key, obj){
				var rfc_string = '';
				switch(obj.freq){
				default:
						rfc_string = 'BEGIN:VEVENT\n';
						break;
				case 'WEEKLY':
					var today = new Date();
					var today2 = new Date();
					var tomorrow = new Date();
					var shr = Number(obj.start.split(':')[0]);
					var smin = Number(obj.start.split(':')[1]);
					var ehr = Number(obj.end.split(':')[0]);
					var emin = Number(obj.end.split(':')[1]);
					if(obj.start == '00:00' && (obj.end == '00:00' || obj.end == '24:00'))
					{
						rfc_string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('yyyyMMdd')+'\nRRULE:FREQ=WEEKLY;BYDAY='+obj.byday+'\n';
					}
					else
					{
						today.setHours(shr, smin);
						today2.setHours(ehr, emin);
						if(obj.start != '00:00' && obj.end != '24:00')
							rfc_string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('yyyyMMddTHHmm00')+'\nDTEND:'+today2.formatDate('yyyyMMddTHHmm00')+'\nRRULE:FREQ=WEEKLY;BYDAY='+obj.byday+'\n';
						else
							rfc_string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('yyyyMMddTHHmm00')+'\nDTEND:'+tomorrow.formatDate('yyyyMMddTHHmm00')+'\nRRULE:FREQ=WEEKLY;BYDAY='+obj.byday+'\n';
					}
					break;
				}
				rfc_string += 'END:VEVENT\n';
				$.naxx.alarm[self.options.index]['schedule'][key] = rfc_string;
			});
		},
		trigger_index: ['di1', 'di2', 'di3', 'di4', 'di5', 'di6', 'di7', 'di8', 'do1', 'do2', 'do3', 'do4', 'do5', 'do6', 'do7', 'do8', 'motion', 'motion', 'motion', 'motion', 'motion', 'pir'],
		trigger_type: ['di', 'di', 'di', 'di', 'di', 'di', 'di', 'di', 'do', 'do', 'do', 'do', 'do', 'do', 'do', 'do', 'motion', 'motion', 'motion', 'motion', 'motion', 'pir'],
		trigger_subindex: ['1', '2', '3', '4', '5', '6', '7', '8', '1', '2', '3', '4', '5', '6', '7', '8', '', '', '', '', '', ''],
		triggerDecoder: function(){
			var self = this, element = $(this.element);
			self._triggerObj = {};
			self._triggerA = new Array();
			$.each($.naxx.alarm[self.options.index].trigger, function(key, value)
			{
				var binary_trigger = '';
				if (value == '' || value == '0' || value == -1) {
					value = '';
					value = value.padR(16, '0');
				}
				var trigger = value.split('');
				for (var i = 0; i < trigger.length; i++)
				{
					var num = parseInt(trigger[i], 16);
					binary_trigger += num.toString(2).padL(4, '0');
				}
				var binary_trigger = binary_trigger.padR(64, '0'); //右邊補0
				var binary_trigger = binary_trigger.split('');
				self._triggerObj[key] = binary_trigger;
				for (var i = 0; i < self.trigger_index.length; i++)
				{
					if (binary_trigger[i] == '1')
					{
						if (i >= 16 && i <= 20) //motion
						{
							self._triggerA.push([key, i]); //2維陣列
							i = 20; //skip remaining motion; motion->motion0
						}
						else
						{
							self._triggerA.push([key, i]); //2維陣列
						}
					}
				}
			});
		},
		triggerEncoder: function()
		{
			var self = this, element = $(this.element);
			var binary_trigger = '';
			binary_trigger = binary_trigger.padR(64, '0'); //右邊補0
			$.each(self._triggerObj, function(key, value){
				self._triggerObj[key] = binary_trigger.split(''); //clear to 0,0,0,0,0,0,0,0,0...
			});
			$.each(self._triggerA, function(index, value){
				self._triggerObj[value[0]][value[1]] = '1';
				if (value[1] >= 16 && value[1] <= 20) //motion all 1
				{
					for(var i = 16; i <=20; i++)
						self._triggerObj[value[0]][i] = '1';
				}
			});
			$.naxx.alarm[self.options.index].trigger = {};
			$.each(self._triggerObj, function(key, value){
				$.naxx.alarm[self.options.index].trigger[key] = '';
				for (var i = 0; i < value.length/4; i++)
				{
					var temp = (value[i*4]+value[i*4+1]+value[i*4+2]+value[i*4+3]).padR(4, '0');
					var hex = (parseInt(temp, 2)).toString(16);
					$.naxx.alarm[self.options.index].trigger[key] += hex;
				}
			});
		},
		initTable: function(){
			var self = this, element = $(this.element);
			element.find('.tablePanel').watch('height,width',function(){
				//20110314 Alive: hdiv must be considered.
				self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height());
				self.object.$grid.setGridWidth($(this).width());
			});

			self.object.$grid = element.find('table.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				loadui: 'block',
				//rownumbers: true,
				colNames : ['*' ,'x' ,'Name', 'Enable', 'Trigger interval'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'reset', width : 10, align: 'left', sortable: false, hidden: true},
					{ name : 'name', width : 50, align: 'left', sortable: false, editable: true},
					{ name : 'enable', width : 100, align: 'left', sortable: false, hidden: true, edittype: 'checkbox'},
					{ name : 'interval', width : 50, align: 'left', sortable: false, sorttype: 'int'}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.index = id - 1 ;
					self.rebuildForm();
					self.rfcDecoder();
					self.triggerDecoder();
					self.describeAlarm();
				}
			}).show();


			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},
		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			$.naxx.teleport.Export($.naxx.path.encoder, function(res){
				$.extend($.naxx.encoder, res);
				$.naxx.teleport.Export($.naxx.path.alarm, function(res){
					$.extend($.naxx.alarm, res);
					for (var i = 0; i < $.naxx.capability.alarm; i++)
					{
						if ($.naxx.alarm[i].name == '')
							$.naxx.alarm[i].name = $.naxx.stranslate('alarm')+(i+1);
						var rec = self.object.$grid.getGridParam('records');
						self.object.$grid.addRowData(i+1, $.naxx.alarm[i]);
						if($.naxx.alarm[i].trigger['s'] == '' && $.naxx.alarm[i].action[0].type == '') //empty alarm, ignore
							$('#'+(i+1)).hide();
					}

					if(element.find('.tablePanel .jqgrow:visible').length > 0) self.object.$grid.setSelection(element.find('.tablePanel .jqgrow:visible').eq(0).attr('id'));
				});
			});
		},
		
		initOther: function(){
			var self = this, element = $(this.element);
			//if(!$.browser.msie) $(':checkbox', element).iButton();
		},
		
		create : function(tabs){
			var self = this, element = $(this.element);
			if(tabs == null) tabs = 0;
			self.createEditor();

			$('#alarmEditor').tabs('select', 0);
			$('#source').val('-');
			$('#trigger_type').val('-');
			$('#start').val('00:00');
			$('#end').val('24:00');
			self.object.$action.jqGrid('clearGridData');
			self.object.$schedule.jqGrid('clearGridData');
			self.object.$trigger.jqGrid('clearGridData');

			$.naxx.block('#alarmEditor');
			self.object.$trigger.setGridWidth($('div#alarmEditor').find('form').width());
			self.object.$action.setGridWidth($('div#alarmEditor').find('form').width());
			self.object.$schedule.setGridWidth($('div#alarmEditor').find('form').width());
			$('#finish').button('disable');
			$.each(self._triggerA, function(key, value){
				var source = value[0];
				if (source == 's') source = '<span symbol="text:server">server</span>';
				else source = '<span symbol="text:channel">Channel</span> '+(Number(source)+1);
				var type = '<span symbol="'+self.symbols[self.trigger_type[value[1]]].symbol+'"></span>'+self.trigger_subindex[value[1]];
				self.object.$trigger.addRowData(Number(key)+1, {value: value, trigger_type: type, source: source, '_remove': '<span class="remove">&nbsp;</span>'});
			});
			$.each(self.object.$trigger.getRowData(), function(index, value){
				$('#gbox_triggerGrid').find('.jqgrow').eq(index).find('.remove').button({icons:{primary:'ui-icon-trash'}, text: false}).click(function(){
					index = $(this).parent().parent().attr('id');
					self.object.$trigger.delRowData(index);
					if (self.object.$trigger.getGridParam('records') == 0 || self.object.$action.getGridParam('records') == 0)
					{
						$('#finish').button('disable');
					}
				});
			});
			$.each($.naxx.alarm[self.options.index].action, function(key, value){
				if(value.type != '')
				{
					value['symbol_type'] = '<span symbol="'+self.symbols[value.type].symbol+'"></span>';
					self.object.$action.addRowData(Number(key)+1, value);
					self.object.$action.setRowData(Number(key)+1, {'_remove': '<span class="remove">&nbsp;</span>'});
				}
			});
			$.each(self.object.$action.getRowData(), function(index, value){
				$('#gbox_actionGrid').find('.jqgrow').eq(index).find('.remove').button({icons:{primary:'ui-icon-trash'}, text: false}).click(function(){
					index = $(this).parent().parent().attr('id');
					self.object.$action.delRowData(index);
					if (self.object.$trigger.getGridParam('records') == 0 || self.object.$action.getGridParam('records') == 0)
					{
						$('#finish').button('disable');
					}
				});
			});
			$.each(self._schedule, function(key, value){
				if(value.freq != '')
				{
					self.object.$schedule.addRowData(Number(key)+1, value);
					self.object.$schedule.setRowData(Number(key)+1, {'_remove': '<span class="remove">&nbsp;</span>'});
//					$.each(value.byday.split(','), function(i, v){
//
//						$('<div class="timer_range"></div>').css();
//					});
				}
				
			});
			self.redrawTimeSlider();
			$.each(self.object.$schedule.getRowData(), function(index, value){
				$('#gbox_scheduleGrid').find('.jqgrow').eq(index).find('.remove').button({icons:{primary: 'ui-icon-trash'}, text: false}).click(function(){
					index = $(this).parent().parent().attr('id');
					self.object.$schedule.delRowData(index);
					self.redrawTimeSlider();
				});
			});
			if (self.object.$trigger.getGridParam('records') > 0 && self.object.$action.getGridParam('records') > 0)
			{
				$('#finish').button('enable');
				$.naxx.translate($.naxx.acl.language, $('button'));
			}
			$('#alarmEditor').tabs('select', tabs);
			$.naxx.translate();
		},

		redrawTimeSlider: function(){
			var self = this, element = $(this.element);
			$('div.range_slider div.weekday').empty();
			$.each(self.object.$schedule.getRowData(), function(key, value){
				if(value.freq != '')
				{
					$.each(value.byday.split(','), function(i, v){
						var div_start = Number(value.start.split(':')[0])*60+Number(value.start.split(':')[1]);
						var div_end = Number(value.end.split(':')[0])*60+Number(value.end.split(':')[1]);
						$('<div class="timer_range"></div>').css({left: 100*div_start/1440+'%', width: 100*(div_end-div_start)/1440+'%'}).appendTo($('div.weekday:eq('+self.weekday_index[v]+')'));
					});
				}
			});
		},

		createEditor: function(){
			var self = this, element = $(this.element);
			if($('#alarmEditor').length>0) {
				//self.replaceOptions();
				return;
			}
			$('<div class="blockform" id="alarmEditor"><ul><li><a href="#triggerSetter"><span class="stepDesc" symbol="text:trigger">Trigger</span></a></li><li><a href="#actionSetter"><span class="stepDesc" symbol="text:action">Action</span></a></li><li><a href="#scheduleSetter"><span class="stepDesc" symbol="text:schedule">Schedule</span><span>(</span><span symbol="text:optional"></span><span>)</span></a></li></ul><div id="triggerSetter"></div><div id="actionSetter"></div><div id="scheduleSetter"></div></div>').appendTo(element);

			$('#alarmEditor').tabs({show: function(event, ui){
				switch(ui.index)
				{
					case 0: //trigger
						self.transform($('#alarmEditor #triggerForm'));
						break;
					case 1:
						self.transform($('#alarmEditor #actionForm'));
						break;
					case 2:
						self.transform($('#alarmEditor #scheduleForm'));
						break;
				}
			}});

		$('<h5 symbol="text:trigger_editor"></h5><div id="triggerWrapper"><form id="triggerForm" onsubmit="return false;"><div id="sourceRow"><label for="source" symbol="text:source"></label><select name="source" id="source"><option value="-">---</option></select></div><div><label for="trigger_type" symbol="text:trigger_type"></label><select name="trigger_type" id="trigger_type"><option value="-">---</option></select></div></div><div class="buttonRow"></div><form class="gridForm" onsubmit="return false;"><table class="gird" id="triggerGrid"></table></form>').appendTo($('#triggerSetter'));

		$('<form id="actionForm" onsubmit="return false;"><div><label symbol="text:action_type" for="type">Action type</label><select id="type" name="type"><option value="recording" symbol="text:recording">Recording</option><option value="email" symbol="text:email">E-Mail</option><option value="ftp" symbol="text:ftp">FTP</option><option value="buzzer" symbol="text:buzzer">Buzzer</option><option value="camctrl" symbol="text:camera_control">Camera control</option><option value="http" symbol="text:http">HTTP</option><option value="do" symbol="text:do">alarm out</option></select></div><div><label symbol="text:enabled">Enable</label><input type="checkbox" name="enable" checked=true/></div><div action="ftp"><label symbol="text:ftp_server">Address</label><input name="ftp.address" /></div><div action="ftp"><label symbol="text:username">Username</label><input value="" name="ftp.username" /></div><div action="ftp"><label symbol="text:password">password</label><input value="" name="ftp.password" type="password"/></div><div action="ftp"><label symbol="text:port">Port</label><input value="21" name="ftp.port" /></div><div action="email"><label symbol="text:smtp_enabled">smtp</label><input name="email.smtp" /></div><div action="email"><label symbol="text:smtp_authority_enabled">Enable smtp auth</label><input type="checkbox" name="email.auth" /></div><div action="email"><label symbol="text:smtp_port">smtp port</label><input name="email.port" /></div><div action="email"><label symbol="text:username">Username</label><input name="email.username" /></div><div action="email"><label symbol="text:password">Password</label><input name="email.password" type="password" /></div><div action="email"><label symbol="text:sender_email_address">sender</label><input name="email.sender" /></div><div action="email"><label symbol="text:recipient_email_address">re</label><input value="" name="email.re" /></div><div action="email"><label symbol="text:email_subject">subject</label><input value="" name="email.subject" /></div><div action="do"><label symbol="text:channel">Channel</label><select name="do.channel"><option value="-">---</option></select><br/><label symbol="text:do" /><select id="index" name="do.index"></select></div><div action="camctrl"><label symbol="text:channel">Channel</label><select name="camctrl.channel"><option value="-">---</option></select></div><div action="camctrl"><label symbol="text:goto">Goto</label><select name="camctrl.goto"><option value="-">---</option></select></div><div action="http"><label symbol="text:network_address">Address</label><input name="http.address" /></div><div action="http"><label symbol="text:url">URL</label><input name="http.url" /></div><div action="http"><label symbol="text:username">Username</label><input name="http.username" /></div><div action="http"><label symbol="text:password">Password</label><input name="http.password" type="password" /></div><div action="http"><label symbol="text:port">Port</label><input name="http.port" /></div><div action="recording"><span id="channels"></span></div></form><form class="tablegrid" onsubmit="return false;"><table class="grid" id="actionGrid"></table><div id="actionBar" /></form>').appendTo($('#actionSetter'));
			
		$('<form id="scheduleForm" onsubmit="return false;"><div id="bywdayRow"><fieldset><h1 symbol="text:select_week_day">Select week day</h1>'+
				'<div><input id="MO" name="byweekday" value="MO" type="checkbox" /><label class="weekday" for="MO" symbol="text:mon">1</label></div>'+
				'<div><input id="TU" name="byweekday" value="TU" type="checkbox" /><label class="weekday" for="TU" symbol="text:tue">2</label></div>'+
				'<div><input id="WE" name="byweekday" value="WE" type="checkbox" /><label class="weekday" for="WE" symbol="text:wed">3</label></div>'+
				'<div><input id="TH" name="byweekday" value="TH" type="checkbox" /><label class="weekday" for="TH" symbol="text:thu">4</label></div>'+
				'<div><input id="FR" name="byweekday" value="FR" type="checkbox" /><label class="weekday" for="FR" symbol="text:fri">5</label></div>'+
				'<div><input id="SA" name="byweekday" value="SA" type="checkbox" /><label class="weekday" for="SA" symbol="text:sat">6</label></div>'+
				'<div><input id="SU" name="byweekday" value="SU" type="checkbox" /><label class="weekday" for="SU" symbol="text:sun">7</label></div>'+
				'</div></fieldset><fieldset id="time"><select id="start" name="start" class="hidden jqTransformHidden" /><select id="end" name="end" class="hidden jqTransformHidden" /></fieldset></form><form class="tablegrid" onsubmit="return false;"><table class="grid" id="scheduleGrid"></table></form>').appendTo($('#scheduleSetter'));
			
			

			for(var i = 0; i < 7; i++)
			{
				$('<div class="weekday_text"><span symbol="'+self.weekday_symbol[i].symbol+'" /></div><div class="weekday" weekday='+i+' /><br />').appendTo($('div.range_slider'));
			}

			for(var i = 0; i <= 24; i++)
			{
				$('<option value="'+(i).toString().padL(2, "0")+':00">'+(i).toString().padL(2, "0")+':00</option>').appendTo($('#start'));
				$('<option value="'+(i).toString().padL(2, "0")+':00">'+(i).toString().padL(2, "0")+':00</option>').appendTo($('#end'));
			}

			$('#time select:eq(0)').val('00:00');
			$('#time select:eq(1)').val('24:00');

			$('#time select').selectToUISlider({labels: 8});

			self.object.$action = $('#actionGrid').jqGrid({
				altRows: true,
				scrollrows: true,
				//autowidth: true,
				height: 100,
				datatype: 'local',
				rownumbers: true,
				colNames : ['Type' ,'Name', 'Enable', 'Remove','', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
				colModel : [
					{ name : 'type', width : 100, align: 'left', sortable: false},
					{ name : 'name', width : 100, align: 'left', sortable: false},
					{ name : 'enable', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : '_remove', width : 100, align: 'left', sortable: false},
					{ name : 'ftp.address', width : 50, align: 'left', sortable: false, hidden:true},
					{ name : 'ftp.port', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'},
					{ name : 'ftp.username', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'ftp.password', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'ftp.protocol', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.username', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.password', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.smtp', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.auth', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.port', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.sender', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.re', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.subject', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.content', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'email.interval', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'},
					{ name : 'http.address', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'http.username', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'http.password', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'http.port', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'},
					{ name : 'http.url', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'camctrl.channel', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'},
					{ name : 'camctrl.goto', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'buzzer.type', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'buzzer.interval', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'recording.channel', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'do.channel', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'},
					{ name : 'do.interval', width : 50, align: 'left', sortable: false, hidden: true, sorttype: 'int'}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.object.$action.jqGrid('GridToForm', id, 'form#actionForm');
					$('#add2trigger').attr('symbol', 'text:modify_done');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
					$('#type').trigger('change');
					var obj = self.object.$action.getRowData(id);
					$('input[name=recording][channel]').attr('checked', false);
					$.each(obj['recording.channel'].split(','), function(index, value){
						$('input[name=recording][channel='+value+']').attr('checked', true);
					});
				}
			}).show();

			self.object.$schedule = $('#scheduleGrid').jqGrid({
				altRows: true,
				scrollrows: true,
				//autowidth: true,
				height: 100,
				datatype: 'local',
				rownumbers: true,
				colNames : ['Recr', 'Weekday', 'start', 'end', 'Remove'],
				colModel : [
					{ name : 'freq', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'byday', width : 50, align: 'left', sortable: false},
					{ name : 'start', width : 50, align: 'left', sortable: false},
					{ name : 'end', width : 50, align: 'left', sortable: false},
					{ name : '_remove', width : 100, align: 'left', sortable: false}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.object.$schedule.jqGrid('GridToForm', id, 'form#scheduleForm');
					var obj = self.object.$schedule.getRowData(id);
					$('#add2schedule').attr('symbol', 'text:modify_done');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
					$('#start,#end').trigger('change');
					$('input[name=byweekday]').attr('checked', false);
					$.each(obj['byday'].split(','), function(index, value){
						$('input[name=byweekday][value='+value+']').attr('checked', true);
					});
				}
			}).show();

			self.object.$trigger = $('#triggerGrid').jqGrid({
				altRows: true,
				scrollrows: true,
				//autowidth: true,
				height: 100,
				datatype: 'local',
				rownumbers: true,
				colNames : ['Source', 'Type', 'Remove', ''],
				colModel : [
					{ name : 'source', width : 100, align: 'left', sortable: false},
					{ name : 'trigger_type', width : 100, align: 'left', sortable: false},
					{ name : '_remove', width : 100, align: 'left', sortable: false},
					{ name : 'value', width : 50, align: 'left', sortable: false, hidden: true}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					//self.object.$trigger.jqGrid('GridToForm', id, 'form#scheduleForm');
					var value = self.object.$trigger.getRowData(id).value;
					var source = value.split(',')[0];
					var trigger_type = value.split(',')[1];
					if(source.isNumber()) $('#source').val(source);
					else $('#source').val('server');
					$('#source').trigger('change');
					$('#trigger_type option[val='+value.toString()+']').attr('selected', true);
					$('#add2trigger').attr('symbol', 'text:modify_done');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
				}
			}).show();

			$('input[name=byweekday]').attr('checked', true);

			$('<button symbol="text:add_to_schedule_list" id="add2schedule">Add to trigger list</button>').button().click(function(){
				var weekday = new Array();
				$('input[name=byweekday]:checked').each(function(){
						weekday.push($(this).val());
				});
				if(self.object.$schedule.getGridParam('selrow') > 0)
				{
					self.object.$schedule.FormToGrid(self.object.$schedule.getGridParam('selrow'), '#scheduleForm');
					self.object.$schedule.setRowData(self.object.$schedule.getGridParam('selrow'), {freq: 'WEEKLY', byday: weekday.toString()});
					self.object.$schedule.resetSelection();
					$('#add2trigger').attr('symbol', 'text:add_to_schedule_list');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
				}
				else
				{
					self.object.$schedule.addRowData(self.object.$schedule.getGridParam('records'), $('#scheduleForm').serializeObject());
					self.object.$schedule.setRowData(self.object.$schedule.getGridParam('records')-1, {freq: 'WEEKLY', byday: weekday.toString(), '_remove': '<span class="remove">&nbsp;</span>'});
					$('#gbox_scheduleGrid').find('.jqgrow').eq(self.object.$schedule.getGridParam('records')-1).find('.remove').button({icons:{primary: 'ui-icon-trash'}, text: false}).click(function(){
							index = $(this).parent().parent().attr('id');
							self.object.$schedule.delRowData(index);
						self.redrawTimeSlider();
					});
				}
				self.redrawTimeSlider();
			}).insertAfter($('#scheduleForm'));
			$('<button symbol="text:add_to_action_list" id="add2action">Add to action list</button>').button().click(function(){
				var chs = [];
				$('input[name=recording]:checked').each(function(){
						chs.push($(this).attr('channel'));
				});
				if(self.object.$action.getGridParam('selrow') > 0)
				{
					self.object.$action.addRowData(self.object.$action.getGridParam('selrow'), $('#actionForm').serializeObj());
					self.object.$action.setRowData(self.object.$action.getGridParam('selrow'), {'recording.channel': chs.toString()});
					self.object.$action.resetSelection();
					$('#add2trigger').attr('symbol', 'text:add_to_action_list');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
				}
				else
				{
					self.object.$action.addRowData(self.object.$action.getGridParam('records'), $('#actionForm').serializeObj());
					self.object.$action.setRowData(self.object.$action.getGridParam('records')-1, {'recording.channel': chs.toString(), '_remove': '<span class="remove">&nbsp;</span>'});
					$('#gbox_actionGrid').find('.jqgrow').eq(self.object.$action.getGridParam('records')-1).find('.remove').button({icons:{primary:'ui-icon-trash'}, text: false}).click(function(){
						index = $(this).parent().parent().attr('id');
						self.object.$action.delRowData(index);
						if (self.object.$trigger.getGridParam('records') == 0 || self.object.$action.getGridParam('records') == 0)
						{
							$('#finish').button('disable');
						}
					});
				}
				if (self.object.$trigger.getGridParam('records') > 0 && self.object.$action.getGridParam('records') > 0)
				{
					$('#finish').button('enable');
				}
			}).insertAfter($('#actionForm'));

			$('<button class="block" symbol="text:add_to_trigger_list" id="add2trigger"></button>').button().click(function(){
				if(self.object.$trigger.getGridParam('selrow') > 0)
				{
					var source = $('#source option:selected').attr('channel');
					if (!source.isNumber()) source = $.naxx.stranslate('server');
					else source = $.naxx.stranslate('channel')+' '+Number(source);
					var type_index = $('#trigger_type option:selected').attr('val').split(',')[1];
					var type = $.naxx.stranslate(self.trigger_type[Number(type_index)])+self.trigger_subindex[Number(type_index)];
					self.object.$trigger.setRowData(self.object.$trigger.getGridParam('selrow'), {value: $('#trigger_type option:selected').attr('val'), source: source, trigger_type: type});
					self.object.$trigger.resetSelection();
					$('#add2trigger').attr('symbol', 'text:add_to_trigger_list');
					$.naxx.translate($.naxx.acl.language, $('.blockUI'));
				}
				else
				{
					var source = $('#source option:selected').attr('channel');
					if (!source.isNumber()) source = $.naxx.stranslate('server');
					else source = $.naxx.stranslate('channel')+' '+Number(source);
					var type_index = $('#trigger_type option:selected').attr('val').split(',')[1];
					var type = $.naxx.stranslate(self.trigger_type[Number(type_index)])+self.trigger_subindex[Number(type_index)];
					self.object.$trigger.addRowData(self.object.$trigger.getGridParam('records'), $('#triggerForm').serializeObject());
					self.object.$trigger.setRowData(self.object.$trigger.getGridParam('records')-1, {value: $('#trigger_type option:selected').attr('val'), source: source, trigger_type: type, '_remove': '<span class="remove">&nbsp;</span>'});
					$('#gbox_triggerGrid').find('.jqgrow').eq(self.object.$trigger.getGridParam('records')-1).find('.remove').button({icons:{primary:'ui-icon-trash'}, text: false}).click(function(){
						index = $(this).parent().parent().attr('id');
						self.object.$trigger.delRowData(index);
						if ( self.object.$trigger.getGridParam('records') == 0 || self.object.$action.getGridParam('records') == 0 )
						{
							$('#finish').button('disable');
						}
					});
				}
				if (self.object.$trigger.getGridParam('records') > 0 && self.object.$action.getGridParam('records') > 0)
				{
					$('#finish').button('enable');
					$.naxx.translate($.naxx.acl.language, $('button'));
				}
			}).appendTo($('div.buttonRow'));


			$('select[name$=channel]').change(function(){
				$('select[name*=goto]').val('-');
				$('select[name*=index]').val('-');
				if($(this).val() == '-')
				{
					$('select[name*=goto] option').hide();
					$('select[name*=index] option').hide();
				}
				else
				{
					$('select option[channel]').hide();
					$('select option[channel='+$(this).val()+']').show();
				}
			});
							

			$('select#type').change(function(){
				var action = $(this).val();
				$('#actionForm>div[action]').hide();
				$('#actionForm>div[action='+action+']').show();
			}).trigger("change");

			
					
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				if($.naxx.encoder[i].status == "CAM_ACTIVE")
				{
					$('<div><input type=checkbox value='+i+' name="recording" channel='+i+' checked=true/><label><span symbol="text:channel">Channel</span><span> '+(i+1)+'</span></label></div>').appendTo($('#channels'));
					for ( var j = 0; j < $.naxx.encoder[i].do_count; j++ )
					{
						$('<option value='+j+' channel='+i+'>'+(j+1)+'</option>').appendTo($('select[name*=index]'));
					}
					if ($.naxx.encoder[i].preset_location != '' && $.naxx.encoder[i].preset_location.mechanical)
					{
						$.each($.naxx.encoder[i].preset_location.mechanical, function(key, value)
						{
							if (value.name)
							{
								$('<option value='+value.name+' channel='+i+'>'+value.name+'</option>').appendTo($('select[name*=goto]'));
								if($('select[name="camctrl\.channel"]').find('option[value='+i+']').length == 0)
									$('<option value='+i+'>'+(i+1)+'</option>').appendTo($('select[name="camctrl\.channel"]'));
							}
						});
					}
				}
			}

			$('#source').change(function(){
				self.generateTrigger();
			});

			$('<button id="cancel" symbol="text:cancel" class="block">Cancel</button>').button().click(function(){
				$.unblockUI();
			}).appendTo($('#alarmEditor'));
			$('<button id="finish" symbol="text:finish" class="block">Finish</button>').button().click(function(){
				$.naxx.alarm[self.options.index].action = {};
				$.each(self.object.$action.getRowData(), function(index, raw)
				{
					delete raw['_remove'];
					$.naxx.alarm[self.options.index].action[index] = {};
					$.each(raw, function(key, value)
					{
						var obj = key.split('.');
						if(obj.length == 1)
							$.naxx.alarm[self.options.index].action[index][key] = value;
						else
						{
							if(!$.naxx.alarm[self.options.index].action[index][obj[0]])
								$.naxx.alarm[self.options.index].action[index][obj[0]] = {};
							$.naxx.alarm[self.options.index].action[index][obj[0]][obj[1]] = value;
						}
					});
				});
				self._schedule = {};
				$.each(self.object.$schedule.getRowData(), function(index, raw)
				{
					self._schedule[index] = {};
					delete raw['_remove'];
					$.extend(self._schedule[index], raw);
				});
				self._triggerA = new Array();
				$.each(self.object.$trigger.getRowData(), function(index, raw)
				{
					delete raw['_remove'];
					self._triggerA.push(raw.value.split(','));
				});
				self.triggerEncoder();
				self.rfcEncoder();
				$.unblockUI();
				self.describeAlarm();
				self.object.$grid.jqGrid('FormToGrid', self.options.index+1, 'form');
				self.RowState(self.options.index, 'MODIFIED');
			}).appendTo($('#alarmEditor'));

			$('#actionForm').change(function(){
					self.object.$action.FormToGrid(self.object.$action.jqGrid('getGridParam','selrow'), '#actionForm');
			});

			self.replaceOptions();
			self.object.triggerHTML = $('#triggerWrapper').html();
		},

		generateTrigger: function(){
			var self = this, element = $(this.element);
			var source = $('#source').val();
			$('#triggerWrapper').html(self.object.triggerHTML);

			if(source.isNumber())
			{
				var trigger_bit = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
				$.each(self.object.$trigger.getRowData(), function(index, value){
					if (index != Number(self.object.$trigger.getGridParam('selrow'))-1)
					{
						if(value['value'].split(',')[0] == source) //number
						{
							var type_index = value['value'].split(',')[1];
							trigger_bit[Number(type_index)] = false;
						}
					}
				});

				var i = Number(source);
				var channel = $.naxx.stranslate('channel');
				var index = 0;
				$('#trigger_type').html('<option value="-">---</option>');
				var opt_html = '<optgroup source='+i+' label="Channel '+(i+1)+'">';
				for (var j = 0; j < $.naxx.encoder[i].di_count; j++)
				{
					if (trigger_bit[index])
						opt_html += '<option value="di'+(j+1)+'" val="'+i+','+(index+j)+'" source='+i+'>DI '+(j+1)+'</option>';
				}
				index = 8;
				for (var j = 0; j < $.naxx.encoder[i].do_count; j++)
				{
					if (trigger_bit[index])
						opt_html += '<option value="do'+(j+1)+'" val="'+i+','+(index+j)+'" source='+i+'>DO '+(j+1)+'</option>';
				}
				index = 16;
				for (var j = 0; j < $.naxx.encoder[i].motion_count; j++)
				{
					if (trigger_bit[index])
						opt_html += '<option value="motion" val="'+i+','+(index+j)+'" source='+i+'>'+$.naxx.stranslate('motion')+'</option>';
					break;
				}
				index = 21;
				for (var j = 0; j < $.naxx.encoder[i].pir_count; j++)
				{
					if (trigger_bit[index])
						opt_html += '<option value="pir" val="'+i+','+(index+j)+'" source='+i+'>PIR</option>';
				}
				opt_html += '</optgroup>';
				$('#trigger_type').append(opt_html);
			}
			else if (source == 'server')
			{
				var trigger_bit = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
				$.each(self.object.$trigger.getRowData(), function(index, value){
					if (index != Number(self.object.$trigger.getGridParam('selrow'))-1)
					{
						if(value['value'].split(',')[0] == 's') //number
						{
							var type_index = value['value'].split(',')[1];
							trigger_bit[Number(type_index)] = false;
						}
					}
				});
				$('#trigger_type').html('<option value="-">---</option>');
				//channel = $.naxx.stranslate('server');
				var opt_html = '<optgroup source="server" label="NVR Server" symbol="label:nvr_server">';
				if(trigger_bit[0]) opt_html+='<option value="di1" val="s,0" source="server">DO 1</option>';
				if(trigger_bit[1]) opt_html+='<option value="di2" val="s,1" source="server">DI 1</option>';
				if(trigger_bit[2]) opt_html+='<option value="di3" val="s,2" source="server">DI 2</option>';
				if(trigger_bit[8]) opt_html+='<option value="do1" val="s,08" source="server">DI 3</option>';
				opt_html+='</optgroup>';
				$('#trigger_type').append(opt_html);
				$('#trigger_type optgroup:empty').remove();
			}
			else
			{
				$('#trigger_type').html('<option value="-">---</option>');
			}
			$('#trigger_type').change(function(){
				if($(this).val() != '-')
				{
					$('#add2trigger').button('enable');
					$('#source').val($(this).find('option:selected').attr('source'));
				}
				else
				{
					$('#add2trigger').button('disable');
				}
				$.naxx.translate($.naxx.acl.language, $('#triggerSetter'));
			}).trigger('change');
			$('#source').val(source);
			$('#source').change(function(){
				self.generateTrigger();
			});
			$('#triggerWrapper form').jqTransform();
			$("#alarmEditor div.jqTransformSelectWrapper ul li a").click(function(){
				$(this).parent().parent().siblings('select').trigger('change');
				return false; //prevent default browser action
			});
		},

		replaceOptions: function(){
			var self = this, element = $(this.element);
			var channel = $.naxx.stranslate('channel');
			$('#source option').remove();
			$('<option value="server" channel="NVR Server" symbol="text:server">NVR Server</option>').appendTo($('select#source', element));
			$('<option value="server" channel="NVR Server" symbol="text:server">NVR Server</option>').appendTo($('select[name="do\.channel"]', element));
			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				if($.naxx.encoder[i].status == "CAM_ACTIVE")
				{
					$('<option value='+i+'>'+channel+' '+(i+1)+'</option>').appendTo($('select[name="do\.channel"]', element));
					$('<option value='+i+' channel="'+(i+1)+'">'+(i+1)+'.'+$.naxx.encoder[i].name+'</option>').appendTo($('select#source', element));
				
				}
			}
		},

		parseSchedule: function(){
			var self = $(this), element = $(this.element);
		},

		/*按鈕按下後套用*/
		apply : function(bSingle)
		{
			var self = this, element = $(this.element);

				$.each(self.object.$grid.getRowData(), function(index, value){
					delete value['modified'];
					delete value['reset'];
					delete value['reset'];
					$.extend($.naxx.alarm[index], value);
				});
				$.naxx.teleport.Import(
					$.naxx.path.alarm, 
					$.naxx.alarm,
					function(res)
					{
						if(self.object.$loader!=null) 
						self.object.$loader.pnotify_remove();

						$.pnotify({
							pnotify_title: '<span style="color: green;">Apply Complete!</span>',
							pnotify_text: 'Config of all cameras is saved to NVR.',
							//pnotify_nonblock: true,
							pnotify_addclass: 'stack-bottomright',
							pnotify_history: false,
							pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
						});
						self.RowState(0, 'CLEANALL');
					}
				);
		}
	});
})(jQuery);
