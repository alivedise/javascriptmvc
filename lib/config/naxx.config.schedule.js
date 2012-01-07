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
 * Date: 2011-03-22 11:35:32
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.schedule: recording schedule management
 *
 */

;(function($) {
	$.widget('naxx.config_schedule', $.naxx.config, {
		options: {
			policy_index: -1
		},
		schedules: [],
		default_policy: 'BEGIN:VEVENT\nDTSTART:20111213T000000\nDTEND:20111214T000000\nRRULE:FREQ=DAILY\nX-REC-TYPE:CONTINUOUS\nEND:VEVENT\n',
		buttons: [
			{
				type: 'settingBtn',
				text: 'Save',
				attr: {
					symbol: 'text:save'
				},
				callback: function(self, element){
					$(':naxx-config_schedule').config_schedule('apply', false);
					return false;
				}
			}
		],
		initTable: function(){
			var self = this, element = $(this.element);
			element.find('.tablePanel').watch('height,width',function(){
				//20110314 Alive: hdiv must be considered.
				self.object.$grid.setGridHeight($(this).height() - $('.ui-jqgrid-hdiv', $(this)).height());
				self.object.$grid.setGridWidth($(this).width());
			});

			self.object.$grid = element.find('table.camera.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'x' ,'Name', 'Enable', 'Schedule Rules', 'reserve days'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'reset', width : 10, align: 'left', sortable: false, hidden: true},
					{ name : 'name', width : 50, align: 'left', sortable: false, editable: true},
					{ name : 'enable', width : 100, align: 'left', sortable: false, hidden: true},
					{ name : 'schedule_rules', width : 50, align: 'left', sortable: false, hidden: true},
					{ name : 'reserve_day', width : 50, align: 'left', sortable: false, sorttype: 'int'}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.object.$grid.jqGrid('GridToForm', id, 'form');
					$('form div.jqTransformSelectWrapper select', element).each(function(){
						$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
					});
					self.options.channel = id - 1 ;
					self.updateForm();
				}
			}).show();

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
			element.find('input,select').change(function() {
				 self.object.$grid.jqGrid('FormToGrid', self.options.channel+1, 'form');
				 self.RowState(self.options.channel, 'MODIFIED');
				 $.naxx.modified = true;
			});
		},

		updateForm: function(){
			var self = this, element = $(this.element);
			$('form fieldset:eq(0) div', element).remove();
			self.options.policy_index = -1;
			var count = 0;
			$('<div class="policy rowElem"><label><span symbol="text:add_entry" /></label></div>').click(function(){self.create()}).appendTo($('form fieldset:eq(0)'));
			$('<span></span>').vivobutton({type:'playq', name:'add', callback:function(){
				$(':naxx-config_schedule').config_schedule('create');
			}}).prependTo($('div.policy label'));
			$.each(self.schedules[self.options.channel], function(index, value){
					if(value != '')
					{
						$('<div class="policy rowElem" index='+index+'><label><span symbol="text:recording_policy">Policy</span>#'+(count+1)+'</label><u><a>'+self.describePolicy(value)+'</a></u></div>').click(function(){
								self.edit(index);
						}).appendTo($('form fieldset:eq(0)'));
					$('<span></span>').vivobutton({type:'playq', name:'remove', attr:{index: index}}).click(function(){
							self.schedules[self.options.channel][Number($(this).attr('index'))] = '';
							self.RowState(self.options.channel, 'MODIFIED');
							$.naxx.modified = true;
							self.updateForm();
							return false;
						}).css({'float': 'left'}).insertBefore($('div.policy label:last'));
						count = count + 1;
					}
				});

			$.naxx.translate();
		},

		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			$.naxx.teleport.Export($.naxx.path.saturn+'/encoder', function(res){
				$.extend($.naxx.saturn, res);
				for (var i = 0; i < $.naxx.capability.encoder; i++)
				{
					self.object.$grid.jqGrid('addRowData', i+1, $.naxx.saturn[i]);
				}
				$.naxx.teleport.Export($.naxx.path.encoder, function(res){
					$.extend($.naxx.encoder, res);
					$.naxx.teleport.Export($.naxx.path.schedule, function(res){
						$.extend($.naxx.schedule, res);
						for( var i = 0; i < $.naxx.capability.encoder; i++)
						{
							var content = $.naxx.schedule[i];
							var regExp = /BEGIN:VCALENDAR[\r]\n((.+)[\r]\n)+?END:VCALENDAR/igm;
							var execs;
							var policy_array = new Array();
							while((execs = regExp.exec(content)) != null)
							{
								self.schedules[i].push(execs[0]);
							}
							//if($.naxx.encoder[i].status != 'CAM_ACTIVE')
							if(self.schedules[i].length == 0)
							{
								$('#'+(i+1), element).hide();
							}
							/*else
							{
								if(self.schedules[i].length == 0)
									self.schedules[i].push(self.default_policy);
							}*/
							self.object.$grid.jqGrid('setRowData', i+1, $.naxx.encoder[i]);
						};
						if ($('.jqgrow:visible').length > 0)
						{
							self.options.channel = Number($('.jqgrow:visible').eq(0).attr('id')) - 1;
							self.switchChannel(self.options.channel);
						}
					});
					$('form div.jqTransformSelectWrapper select').each(function(){
						$(this).siblings('ul').find('a:eq('+ this.selectedIndex +')').click(); 
					});
				});
			});
		},

		initOther : function(){
			var self = this, element = $(this.element);
			self.schedules = new Array();
			for(var i = 0; i < $.naxx.capability.encoder; i++)
			{
				self.schedules.push(new Array());
			}
			$('#reserve_day').keydown(function(event){
				if(!isNumericKey(event)) return false;
			}).keyup(function(){
				if($(this).val() == '')
				{
					$(this).val(1).trigger('change').select();
				}
				if($(this).val()>365)
				{
					$(this).val(365).trigger('change').select();
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
					var copy = self.schedules[self.options.channel];
					self.options.past = self.options.channel+1;
				}
				else
					var copy = self.schedules[self.options.past];

				for (var i = 0; i < 16; i++)
				{
					if(i == self.options.past) continue;
					self.schedules[i] = copy;
					self.RowState(i, 'MODIFIED');
				}
				self.object.$grid.setSelection(self.options.channel+1);
			}).bind('keydown', 'ctrl+v', function(event){
					if(self.options.past <  0) return true;
					var copy = self.schedules[self.options.past]
					self.schedules[self.options.channel] = copy;
					self.RowState(self.options.channel, 'MODIFIED');
			});
		},

		scheduleEditor: function(){
			var self = this, element = $(this.element);
			if($('#createSchedule').length == 0 )
			{
				$('<div id="createSchedule" class="blockform">'+
						'<h3 symbol="text:create_new_schedule">Create new schedule</h3>'+
						'<form><fieldset class="recursive_column">'+
						'<legend symbol="text:recursive_type">Select type:</legend>'+
						'<div class="rowElem">'+
						'<div><input type="radio" name="freq" id="DAILY" value="DAILY" /><label for="#DAILY" symbol="text:by_day">By day</label></div>'+
						'<div><input type="radio" name="freq" id="WEEKLY" value="WEEKLY" /><label for="#WEEKLY" symbol="text:by_week">By week</label></div>'+
						'<div><input type="radio" name="freq" id="MONTHLY" value="MONTHLY" /><label for="#MONTHLY" symbol="text:by_month">By month</label></div>'+
						'<div><input type="radio" name="freq" id="YEARLY" value="YEARLY" /><label for="#YEARLY" symbol="text:by_year">By year</label></div>'+
						'</div></fieldset>'+
						'<img src="images/blocking_vertical_line.png" class="vl" />'+
						'<fieldset class="detail_column">'+
						'<div id="bymdayRow" class="rowElem"><input type="text" id="bymday" name="bymday" readonly="readonly"></input></div>'+
						'<div id="bywdayRow"><input id="MO" name="byweekday" value="MO" type="checkbox" /><label class="weekday" for="#MO" symbol="text:mon">1</label><input id="TU" name="byweekday" value="TU" type="checkbox" /><label class="weekday" for="#TU" symbol="text:tue">2</label><input id="WE" name="byweekday" value="WE" type="checkbox" /><label class="weekday" for="#WE" symbol="text:wed">3</label><input id="TH" name="byweekday" value="TH" type="checkbox" /><label class="weekday" for="#TH" symbol="text:thu">4</label><input id="FR" name="byweekday" value="FR" type="checkbox" /><label class="weekday" for="#FR" symbol="text:fri">5</label><input id="SA" name="byweekday" value="SA" type="checkbox" /><label class="weekday" for="#SA" symbol="text:sat">6</label><input id="SU" name="byweekday" value="SU" type="checkbox" /><label class="weekday" for="#SU" symbol="text:sun">7</label></div>'+
						'<div id="byhourRow" class="rowElem"><select id="start" name="start" class="jqTransformHidden" /><select id="end" name="end" class="jqTransformHidden" /></div>'+
					'</fieldset>'+
					'<fieldset class="normal event"><legend symbol="text:recording_type">Recording type</legend><div class="rowElem"><div><input type="radio" name="rec_type" id="CONTINUOUS" value="CONTINUOUS" /><label for="#COTINUOUS" class="weekday" symbol="text:continuous_recording">Continuos</label></div><div><input type="radio" name="rec_type" id="EVENT" value="EVENT" /><label for="#EVENT" class="weekday" symbol="text:event">Events</label>'+
					'<div id="eventRow"><label></label><div><input type="checkbox" name="event_type" id="DI" value="DI" /><label for="#DI" class="weekday" symbol="text:di">DI</label></div><div><input type="checkbox" id="MW" name="event_type" value="MW"/><label for="#MW" class="weekday" symbol="text:motion">Motion</label></div><div><input type="checkbox" id="PIR" name="event_type" value="PIR"/><label for="#PIR" class="weekday" symbol="text:pir">PIR</label></div></div></div>'+
					'</div></fieldset></form></div>').hide().appendTo(element);

				/* Create Hour Selector */

				for(var i = 0; i <= 24; i++)
				{
					$('<option value="'+(i).toString().padL(2, "0")+':00">'+(i).toString().padL(2, "0")+':00</option>').appendTo($('#start'));
					$('<option value="'+(i).toString().padL(2, "0")+':00">'+(i).toString().padL(2, "0")+':00</option>').appendTo($('#end'));
				}

				$('#start').val('00:00').hide();
				$('#end').val('24:00').hide();

				$('fieldset.detail_column select').selectToUISlider({labels: 8}).hide();

				/* Create Create Button */

				$('<button id="create" symbol="text:create" class="block">Create</button>').button().click(function(){
					var RRULE = self.buildPolicy();
					//$.log(RRULE);
					self.schedules[self.options.channel].push( RRULE );
					self.RowState(self.options.channel, 'MODIFIED');
					$.naxx.modified = true;
					self.updateForm();
					$.unblockUI();
				}).appendTo($('#createSchedule'));

				$('[name="rec_type"]').change(function(){
					if($('#EVENT').attr('checked'))
					{
						$('#eventRow').show();
					}
					else
					{
						$('#eventRow').hide();
					}
				});

				$('[name=event_type]').change(function(){
					if($('[name=event_type]:checked').length == 0)
					{
						$(this).attr('checked', true).trigger('change');
						return false;
					}
				});

				$('<button id="done" symbol="text:done" class="block">Done</button>').button().click(function(){
					var RRULE = self.buildPolicy();
					if(self.options.policy_index >=0 )
						self.schedules[self.options.channel][self.options.policy_index]=RRULE;
					self.RowState(self.options.channel, 'MODIFIED');
					$.naxx.modified = true;
					self.updateForm();
					$.unblockUI();
				}).appendTo($('#createSchedule'));
				
				$('<button id="cancel" symbol="text:cancel" class="block">Cancel</button>').button().click(function(){
					$.unblockUI();
				}).appendTo($('#createSchedule'));

				$('<button id="remove" symbol="text:remove" class="block">Remove(!)</button>').button().click(function(){
					self.schedules[self.options.channel][self.options.policy_index] = '';
					self.updateForm();
					$.unblockUI();
				}).appendTo($('#createSchedule'));

				$('#bymday').val(new Date().formatDate('yyyy/MM/dd')).DatePicker({
						format:'Y/m/d',
						date: $('#bymday').val(),
						starts: 1,
						position: 'right',
						onBeforeShow: function(){
							$('#bymday').DatePickerSetDate($('#bymday').val(), true);
						},
						onChange: function(formated, dates){
							$('#bymday').val(formated);
						}
				});
				$('#createSchedule input').change(function(){
					switch($('[name=freq]:checked').val())
					{
					case 'WEEKLY':
						$('div#byhourRow').show();
						$('div#bymdayRow').hide();
						$('div#bywdayRow').show();
						$('div#byweekdayRow').hide();
						break;
					case 'DAILY':
						$('div#byhourRow').show();
						$('div#bymdayRow').hide();
						$('div#bywdayRow').hide();
						$('div#byweekdayRow').hide();
						break;
					case 'WEEKDAILY':
						$('div#byhourRow').hide();
						$('div#bymdayRow').hide();
						$('div#bywdayRow').hide();
						$('div#byweekdayRow').show();
						break;
					case 'MONTHLY':
						$('div#byhourRow').show();
						$('div#bymdayRow').show();
						$('div#bywdayRow').hide();
						$('div#byweekdayRow').hide();
						break;
					case 'YEARLY':
						$('div#byhourRow').show();
						$('div#bymdayRow').show();
						$('div#bywdayRow').hide();
						$('div#byweekdayRow').hide();
						break;
					}
				});
				$('#createSchedule form').jqTransform();
			}
			$.naxx.translate();	
		},

		
		describeCombinedPolicy: function(){
			var self = this, element = $(this.element);
			var string = '';
			switch($('[name=freq]:checked').val())
			{
				case 'WEEKLY':
					var temp = new Array();
					$.each($('[name="byweekday"]:checked'), function(index, v){
						value = $(this).val();
						if (value=='MO') temp.push('<span symbol="text:mon"></span>');
						else if (value=='TU') temp.push('<span symbol="text:tue"></span>');
						else if (value=='WE') temp.push('<span symbol="text:wed"></span>');
						else if (value=='TH') temp.push('<span symbol="text:thu"></span>');
						else if (value=='FR') temp.push('<span symbol="text:fri"></span>');
						else if (value=='SA') temp.push('<span symbol="text:sat"></span>');
						else if (value=='SU') temp.push('<span symbol="text:sun"></span>');
					});
					temp = temp.toString().replace(new RegExp(',', 'gm'), '<span>,</span>');
					string += '<span symbol="text:weekly">Weekly</span><span>&nbsp;</span><span>'+temp+'&nbsp;</span>';
					break;
				case 'DAILY':
					string += '<span symbol="text:daily">Daily</span><span>&nbsp;</span>';
					break;
				case 'WEEKDAILY':
					string += '<span symbol="text:weekdaily">Weekdaily</span><span>&nbsp;</span>';
					break;
				case 'MONTHLY':
					string += '<span symbol="text:monthly">Monthly</span><span>&nbsp;</span><span>'+$('#bymday').val()+'&nbsp;</span>';
					break;
				case 'YEARLY':
					string += '<span symbol="text:yearly">Yearly</span><span>&nbsp;</span><span>'+$('#bymday').val()+'&nbsp;</span>';
					break;
			}	
	
			var time_string = '<span>(</span>';
			$('div.ui-boxer-appender.reserved:not([weekday])').each(function(index){
				var start = $(this).attr('start');
				var end = $(this).attr('end');
				if (start == '0' && end == '24')
				{
					time_string += '<span symbol="text:all_day">all day</span>';
				}
				else				 				
					time_string += '<span symbol="text:from">from</span><span>&nbsp;'+$(this).attr('start').toString().padL(2, '0')+':00'+' </span><span symbol="text:to">to</span><span>&nbsp;'+$(this).attr('end').toString().padL(2, '0')+':00'+'</span><span>;</span>';			
			});
			time_string += '<span>)</span>';
			if($('div.ui-boxer-appender.reserved').length == 0)
			{
				string+= '<span style="color:red">(<span symbol="text:select_time_range_first">Select time range first</span>)</span>';
				$('#create').button('disable');
			}
			else
			{
				string += time_string;
				$('#create').button('enable');
			}
			


			/*because \r*/
			if($('[name=rec_type]:checked').val()!='EVENT')
			{
				string += '<span>, </span><span symbol="text:continuous_recording">continuous recording</span>';
			}
			else
			{
				string += '<span>, </span><span symbol="text:event_recording">event_recording</span>';
			}

			$('#schedule_description').html('<b>'+string+'</b>').css({color: '#0186d1'});
			$.naxx.translate($.naxx.acl.language, $('#createSchedule'));
		},

		buildRecurrence: function(){
			var self = this, element = $(this.element);
			var day = '';
			$('[name=byweekday]:checked').each(function(){
				day = day + $(this).val()+',';
			});
			day = day.slice(0, day.length-1);
			switch($('[name=freq]:checked').val())
			{
			case 'DAILY':
				return 'RRULE:FREQ=DAILY';
			case 'WEEKLY':
				return 'RRULE:FREQ=WEEKLY;BYDAY='+day;
			case 'MONTHLY':
				return 'RRULE:FREQ=MONTHLY;BYMONTHDAY='+(new Date($('#bymday').val()).getDate());
			case 'YEARLY':
				return 'RRULE:FREQ=YEARLY;BYMONTH='+(new Date($('#bymday').val()).getMonth()+1)+';BYMONTHDAY='+(new Date($('#bymday').val()).getDate());
			}
		},

		buildPolicy: function(){
			var self = this, element = $(this.element);
			var today = new Date($('#bymday').val());
			var today2 = new Date($('#bymday').val());
			var tomorrow = new Date($('#bymday').val());
			var shr = Number($('#start').val().split(':')[0]);
			var smin = Number($('#start').val().split(':')[1]);
			var ehr = Number($('#end').val().split(':')[0]);
			var emin = Number($('#end').val().split(':')[1]);
			var string = '';
			tomorrow.setDate(tomorrow.getDate()+1)
			tomorrow.setHours(0, 0, 0);
			var day = '';
			$('[name=byweekday]').each(function(){
					if($(this).attr('checked')){
						day = day + $(this).val()+',';
					}
				});

			day = day.slice(0, day.length-1);

			if($('#start').val() == '00:00' && ($('#end').val() == '00:00' || $('#end').val() == '24:00'))
			{
				switch($('[name=freq]:checked').val())
				{
				case 'DAILY':
				case 'WEEKLY':
					//string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('19700101')+'\nDTEND:'+tomorrow.formatDate('19700101')+'\n'+self.buildRecurrence(day)+'\n';
					//break;
				case 'MONTHLY':
					//string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('197001dd')+'\nDTEND:'+tomorrow.formatDate('197001dd')+'\n'+self.buildRecurrence(day)+'\n';
					//break;
				case 'YEARLY':
					//string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('1970MMdd')+'\nDTEND:'+tomorrow.formatDate('1970MMdd')+'\n'+self.buildRecurrence(day)+'\n';
					string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('yyyyMMddTHHmm00')+'\nDTEND:'+tomorrow.formatDate('1970MMddTHHmm00')+'\n'+self.buildRecurrence(day)+'\n';
					break;
				}
			}
			else
			{
				today.setHours(shr, smin);
				today2.setHours(ehr, emin);
				if($('#end').val() != '00:00' && $('#end').val() != '24:00')
				{
					tomorrow = today2;
				}

				switch($('[name=freq]:checked').val())
				{
					case 'DAILY':
					case 'WEEKLY':
					//	string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('19700101THHmm00')+'\nDTEND:'+tomorrow.formatDate('19700101THHmm00')+'\n'+self.buildRecurrence(day)+'\n';
					//	break;
					case 'MONTHLY':
					//	string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('197001ddTHHmm00')+'\nDTEND:'+tomorrow.formatDate('197001ddTHHmm00')+'\n'+self.buildRecurrence(day)+'\n';
					//	break;
					case 'YEARLY':
					//	string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('1970MMddTHHmm00')+'\nDTEND:'+tomorrow.formatDate('1970MMddTHHmm00')+'\n'+self.buildRecurrence(day)+'\n';
						string = 'BEGIN:VEVENT\nDTSTART:'+today.formatDate('yyyyMMddTHHmm00')+'\nDTEND:'+tomorrow.formatDate('1970MMddTHHmm00')+'\n'+self.buildRecurrence(day)+'\n';
						break;
				}
			}
		
			if($('[name=rec_type]:checked').val() == 'EVENT')
			{
				var type = '';
				$('[name=event_type]').each(function(){
					if($(this).attr('checked')){
						type = type + $(this).val()+',';
					}
				});
				type = type.slice(0, type.length-1);
				string += 'X-REC-TYPE:EVENT\nX-INT-EVENTS:'+type+'\nEND:VEVENT\n';
			}
			else
			{
				string += 'X-REC-TYPE:CONTINUOUS\nEND:VEVENT\n';
			}
					
			return string;
		},

		/*按鈕按下後套用*/
		apply : function(bSingle)
		{
			var self = this, element = $(this.element);

			for (var i = 0; i < $.naxx.capability.encoder; i++)
			{
				var targetChannel = i;
				var targetObj = self.object.$grid.getRowData(targetChannel+1);
				$.extend($.naxx.saturn[targetChannel],
				{
					reserve_day: Number(targetObj.reserve_day)
				});
			}
				
			$.naxx.teleport.Import($.naxx.path.saturn+'/encoder', $.naxx.saturn, 
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
					//to be cont
				}
			);
				
			for ( var i = 0; i < $.naxx.capability.encoder; i++)
			{
				var string = '';
				$.each(self.schedules[i], function(vevent_index, vevent){
						if(vevent != '') {
							vevent = ReplaceAll(vevent, 'BEGIN:VCALENDAR\r\n', '');
							vevent = ReplaceAll(vevent, 'END:VCALENDAR\r\n', '');	
							string += 'BEGIN:VCALENDAR\n'+vevent+'END:VCALENDAR\r\n';
						}
				});
				if(string == '')
					string = 'BEGIN:VCALENDAR\nEND:VCALENDAR\n';
				$.naxx.schedule[i] = string;
			}

			$.naxx.teleport.Import($.naxx.path.schedule, $.naxx.schedule, 
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
		},

		create : function(){
			var self = this, element = $(this.element);
			self.scheduleEditor();
			$('div#bymdayRow').hide();
			$('div#bywdayRow').show();
			$('[name=freq][value=WEEKLY]').attr('checked', true);
			$('.schedule_divider').removeClass('occupied');
			$('.ui-boxer-appender').remove();
			$('#start').val('00:00').trigger('change');
			$('#end').val('24:00').trigger('change');
			$('#done').hide();
			$('#create').show();
			$('#remove').hide();
			$('#allday').attr('checked', true);
			$('#bymday').val(new Date().formatDate('yyyy/MM/dd'));
			$('[name=rec_type]').attr('checked', false);
			$('[name=event_type]').attr('checked', true);
			$('[name=byweekday]').attr('checked', true).trigger('change');
			$('[name=rec_type]#CONTINUOUS').attr('checked', true);
			$('[name=freq]').trigger('change');
			$('[name=rec_type]').trigger('change');
			$('[name=event_type]').trigger('change');

			$.naxx.block('#createSchedule');
		},

		edit : function(policy_index){
			var self = this, element = $(this.element);
			self.scheduleEditor();
			var policy_obj = $.naxx.rfcParser(self.schedules[self.options.channel][policy_index]);
			$('[name=rec_type]').attr('checked', false).trigger('change');
			$('#'+policy_obj.rec_type).attr('checked', true);
			var events = policy_obj.events.split(',');
			$('[name=event_type]').attr('checked', false);
			$.each(events, function(index, value){
				if(value == '') return;
				$('[value='+value+']').attr('checked', true);
			});

			$('[name=rec_type]').trigger('change');
			if(policy_obj.byday) var weekday = policy_obj.byday.split(',');
			else var weekday = new Array();
			$('[name=byweekday]').attr('checked', false).trigger('change');
			$.each(weekday, function(index, value){
				if(value == '') return;
				$('[value='+value+']').attr('checked', true);
			});
			var start = $.naxx.checkDate(policy_obj.dtstart);
			if(policy_obj.dtend) var end = $.naxx.checkDate(policy_obj.dtend);
			else end = start;
			$('#start').val(start.formatDate('HH:mm')).trigger('change');
			$('#end').val(end.formatDate('HH:mm')).trigger('change');
			if($('#end').val() == '00:00') $('#end').val('24:00').trigger('change');
			$('#done').show();
			$('#create').hide();
			$('#remove').show();
			
			//If 1970/01/01 XX:XX:XX, redirect to today
			$('#bymday').val(start.formatDate('yyyy/MM/dd'));

			self.options.policy_index = policy_index;

			$('[name=freq]').attr('checked', false).trigger('change');
			$('[name=freq][value='+policy_obj.freq+']').attr('checked', true).trigger('change');
			$.naxx.block('#createSchedule');
		},

		describePolicy : function(policy_string){
			var self = this, element = $(this.element);
			var obj = $.naxx.rfcParser(policy_string);
			var string = '';
			switch(obj.freq)
			{
			case 'WEEKLY':
				var temp = new Array();
				$.each(obj.byday.split(','), function(index, value){
					if (value=='MO') temp.push('<span symbol="text:mon"></span>');
					else if (value=='TU') temp.push('<span symbol="text:tue"></span>');
					else if (value=='WE') temp.push('<span symbol="text:wed"></span>');
					else if (value=='TH') temp.push('<span symbol="text:thu"></span>');
					else if (value=='FR') temp.push('<span symbol="text:fri"></span>');
					else if (value=='SA') temp.push('<span symbol="text:sat"></span>');
					else if (value=='SU') temp.push('<span symbol="text:sun"></span>');
				});

				temp = temp.toString().replace(new RegExp(',', 'gm'), '<span>,</span>');
				string += '<span symbol="text:weekly">Weekly</span><span> </span>'+temp+' ';
				break;
			case 'MONTHLY':
				string += '<span symbol="text:monthly">Monthly</span><span> </span>'+obj.bymonthday+' ';
				break;
			case 'YEARLY':
				string += '<span symbol="text:yearly">Yearly</span><span> </span>'+obj.bymonth+'/'+obj.bymonthday+' ';
				break;
			case 'DAILY':
				string += '<span symbol="text:daily">Daily</span><span> </span>';
				break;
			}

			
			var start = $.naxx.checkDate(obj.dtstart);
			if((obj.dtend && $.naxx.checkDate(obj.dtend).formatDate('HH:mm')!='00:00') || start.formatDate('HH:mm') != '00:00'){
				var end = $.naxx.checkDate(obj.dtend);
				if (end == '' || end == '00:00' || end.formatDate('HH:mm') == '00:00')
					string += '<span>(</span><span symbol="text:from">from</span><span> '+start.formatDate('HH:mm')+' </span><span symbol="text:to">to</span><span> 24:00 </span><span>)</span>';
				else
				{
					string += '<span>(</span><span symbol="text:from">from</span><span> '+start.formatDate('HH:mm')+' </span><span symbol="text:to">to</span><span> '+end.formatDate('HH:mm')+'</span><span>)</span>';
				}
			}
			else{
				end = start;
				string += '<span>(</span><span symbol="text:all_day">all day</span><span>)</span>';
			}


			/*because \r*/
			if(/CONTINUOUS/.exec(obj.rec_type) != null)
			{
				string += '<span>, </span><span symbol="text:continuous_recording">continuous recording</span>';
			}
			else if(/EVENT/.exec(obj.rec_type) != null)
			{
				string += '<span>, </span><span symbol="text:event_recording">event_recording</span>';
			}

			return string;
		},

		/*用select切換頻道*/
		switchChannel: function(index)
		{
			var self = this, element = $(this.element);
			if (index < 0 || index >= $.naxx.capability.encoder) return;
			self.object.$grid.jqGrid('setSelection', index+1);
			this.options.channel = Number(index);

		},



		/* Standardise a date to UTC.
		   @param  date  (Date) the date to standardise
		   @return  (Date) the equivalent UTC date */
		utcDate : function(date) {
			date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			return date;
		}

	});
})(jQuery);
