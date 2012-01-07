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
  * Date: 2011-06-15 15:13:41
  * Author: Alive Kuo (alive.kuo at vivotek.com)
  *
  * naxx.config.disk
  *
  *
  */

;(function($) {
	$.widget('naxx.config_disk', $.naxx.config, {
		options: {
			index: 0
		},
		object: {
			$tab: null,
			$smart: null,
			$smarttestresult_short: null,
			$smarttestresult_long: null,
			$progress: []
		},
		buttons: [
			{
				type: 'settingBtn',
				text: 'Scan disk',
				attr: {
					symbol: 'text:scan_disk'
				},
				callback: function(self, element){
					$(':naxx-config_disk').config_disk('badblock');
					return false;
				}
			}
		],
		resizePrivate: function(){
			var self = this, element = $(this.element);
			self.object.$smart.setGridHeight(element.find('.statusPanel').height() - $('.ui-tabs-nav', $(this)).height());
			//self.object.$smart.setGridWidth(element.find('.tablePanel').width());
		},
		initTable: function(){
			var self = this, element = $(this.element);
			self.object.$grid = element.find('table.grid').jqGrid({
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['Model', 'size', 'smart', 'state', 'checking'],
				colModel : [
					{ name : 'model', width : 100, align: 'left', sortable: false},
					{ name : 'size_GB', width : 50, align: 'left', sortable: false},
					{ name : 'smart_info_color', width : 30, align: 'left', sortable: false},
					{ name : 'state', width : 50, align: 'left', sortable: false},
					{ name : 'state_badblocks', width : 50, align: 'left', sortable: false}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					$('div.statusPanel span[name]').text('');
					$('span[name=disk_health]:eq(0)').html('<img src="images/gif/comet_progress.gif" >');
					self.options.index = id - 1 ;
					self.object.$tab.trigger('tabsselect');
				}
			}).show();
			
			self.object.$smart = element.find('table.smart').jqGrid({
				altRows: true,
				scrollrows: true,
				width: '100%',
				height: 210,
				datatype: 'local',
				colNames : ['id' ,'attribute name' ,'value', 'raw value', 'worst', 'threshold', 'status'],
				colModel : [
					{ name : 'id', width : 10, align: 'left', sortable: false},
					{ name : 'attribute', width : 200, align: 'left', sortable: false},
					{ name : 'value', width : 50, align: 'left', sortable: false},
					{ name : 'raw_value', width : 50, align: 'left', sortable: false},
					{ name : 'worst', width : 50, align: 'left', sortable: false},
					{ name : 'threshold', width : 50, align: 'left', sortable: false},
					{ name : 'status', width : 50, align: 'left', sortable: false}
				],
				shrikToFit: true,
				onSelectRow: function(id){
				}
			}).show();


			//self.object.$smart.setGridHeight($('#smartinfo').height()-$('smartinfo .ui-jqgrid-labels').height());

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		//重新填入所有攝影機資料
		reload : function(bRefreshTableOnly)
		{
			var self = this, element = $(this.element);
			var reload = false;
			if(bRefreshTableOnly == null) bRefreshTableOnly = false;
			self.object.$progress = [];
		
			clearTimeout(self.object.$timeout);
			if(self.object.$grid.getGridParam('records') > 0) bFirst = false;
			else bFirst = true;
			$.naxx.teleport.Exec($.naxx.path.disk, 'disk_query', '', function(res){
				if($(':naxx-config_disk').length == 0) return;
				//if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
				$.extend($.naxx.disk, res);
				self.parseDisk();
				for (var i = 0; i < $.naxx.capability.disk; i++)
				{
					if(!bFirst)
						self.object.$grid.setRowData(i+1, $.naxx.disk[i]);
					else
						self.object.$grid.addRowData(i+1, $.naxx.disk[i]);
					if($.naxx.disk[i].state == 'DISK_UNCONNECTED')
						$('#'+(i+1), element).hide();
					if($.naxx.disk[i].badblocks_progress>=0)
					{
						self.object.$progress.push('Disk '+(i+1)+' checking bad blocks: '+$.naxx.disk[i].badblocks_progress+'%');
						reload = true;
					}
				}
				if ($('.jqgrow:visible').length > 0 && !bRefreshTableOnly)
					self.object.$grid.setSelection($('.jqgrow:visible').eq(0).attr('id'));
				if (self.object.$progress.length>0 || reload)
					self.object.$timeout = setTimeout(function(){self.reload(true)}, 1500);
			});
		},

		updateForm: function(){
			var self = this, element = $(this.element);
			$('form fieldset:eq(0) div', element).remove();
			$.each(self.object.$progress, function(index, value){
					$('<div>'+value+'<img src="images/gif/comet_progress.gif" /></div>').appendTo($('form fieldset', element));
			});
		},

		parseDisk: function(){
			var self = this, element = $(this.element);
			for (var i = 0; i < $.naxx.capability.disk; i++)
			{
				$.naxx.disk[i]['size_GB'] = ($.naxx.disk[i]['size']/1024).toFixed(3)+' GB';
				$.naxx.disk[i]['state_badblocks'] = $.naxx.disk[i]['badblocks_progress'] >= 0 ? $.naxx.disk[i]['badblocks_progress']+'%<img src="images/gif/comet_progress.gif" />' : '';
				$.naxx.disk[i]['smart_info_color'] = $.naxx.disk[i]['smart_info'] == 'PASSED' ? '<span class="green">'+$.naxx.disk[i]['smart_info']+'</span>' : '<span class="red">'+$.naxx.disk[i]['smart_info']+'</span>';
			}
		},

		initOther: function(){
			var self = this, element = $(this.element);
			$('#long_test').button().click(function(){self.smarttest('long')});
			$('#short_test').button().click(function(){self.smarttest('short')});
			$('#shedule_setting').button().click(function(){self.smartschedule()});
			$('div#short_hour_list a').addClass('short');
			$('div#long_hour_list a').addClass('long');
			$('input#short_hour').menu({
					content: $('#short_hour_list').html(),
					width: 50,
					maxHeight: 100,
					bindings: {
						'ul a.short': function(){
							$('#short_hour').val($(this).text());
						}
					}
			});
			$('input#long_hour').menu({
					content: $('#long_hour_list').html(),
					width: 50,
					maxHeight: 100,
					bindings: {
						'ul a.long': function(){
							$('#long_hour').val($(this).text());
						}
					}
			});
			self.object.$tab = $('div.statusPanel').tabs({
					selected: 0,
					select: function(e, ui)
					{
						clearTimeout(self.object.$smarttestresult_long);
						clearTimeout(self.object.$smarttestresult_short);
						switch(ui.tab.hash)
						{
						case '#manual_test':
							$('[name=manual_test_result]').html('<img src="images/gif/comet_progress.gif" />');
							$('[name=manual_test_result_long]').html('<img src="images/gif/comet_progress.gif" />');
							self.getsmarttest('short');
							self.getsmarttest('long');
							break;
						case '#overview':
							self.disksummary();
							break;
						case '#diskinfo':
							self.diskinfo();
							break;
						case '#smartinfo':
							self.smartinfo();
							break;
						case '#schedule':
							break;
						}
					}
			});
			$("div.statusPanel").bind("tabsselect", function() {
					clearTimeout(self.object.$smarttestresult_long);
					clearTimeout(self.object.$smarttestresult_short);
					switch($('div.statusPanel').tabs('option', 'selected'))
					{
						case 3:
							$('[name=manual_test_result]').html('<img src="images/gif/comet_progress.gif" />');
							$('[name=manual_test_result_long]').html('<img src="images/gif/comet_progress.gif" />');
							self.getsmarttest('short');
							self.getsmarttest('long');
							break;
						case 0:
							self.disksummary();
							break;
						case 1:
							self.diskinfo();
							break;
						case 2:
							self.smartinfo();
							break;
						case '#schedule':
							break;
					}
			});
		},

		smartinfo: function(){
			var self = this, element = $(this.element);
			if(self.object.$smart != null) self.object.$smart.jqGrid('clearGridData');
			$.naxx.teleport.Exec($.naxx.path.disk, 'smart_info', 'target='+self.options.index, function(data){
				var id = 1;
				$.each(data, function(key, value){
					value['id'] = key;
					self.object.$smart.jqGrid('addRowData', id, value);
					id++;
				});
			});
		},

		diskinfo: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.disk, 'disk_info', 'target='+self.options.index, function(data){
				$.each(data, function(key, value){
					$('[name='+key+']').html(value);
				});
			});
		},
		
		disksummary: function(){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.disk, 'disk_summary', 'target='+self.options.index, function(data){
				$.each(data, function(key, value){
					$('[name='+key+']').html(value);
				});
			});
		},

		badblock: function(){
			var self = this, element = $(this.element);
			$.blockUI({message: '<div><span symbol="text:the_task_will_perform_a_several_hours_do_you_want_to_do_it"></span><button id="yes" symbol="text:yes"></button><button id="cancel" symbol="text:cancel"></span></div>'});
			$('#yes').button().click(function(){
				$.naxx.teleport.Exec($.naxx.path.disk, 'disk_bad_blocks', 'target='+self.options.index, function(){
					self.reload(true);
				});
			});
			$('#cancel').button().click(function(){$.unblockUI()});
			$.naxx.translate($.naxx.acl.language, $('.blockUI'));
		},

		getsmarttest: function(type){
			var self = this, element = $(this.element);
			if($(':naxx-config_disk').length == 0) return;
			$.naxx.teleport.Exec($.naxx.path.disk, 'smart_test_result', 'target='+self.options.index+'&test_type='+type, function(data){
					if (data.search('%') >= 0)
					{
						if(type == 'short')
						{
							$('[name=manual_test_result]').html(data+'<img src="images/gif/comet_progress.gif" />');
							self.object.$smarttesttimer_short = setTimeout(function(){
								self.getsmarttest('short');	
							}, 2000);
						}
						else
						{
							$('[name=manual_test_result_long]').html(data+'<img src="images/gif/comet_progress.gif" />');
							self.object.$smarttesttimer_long = setTimeout(function(){
								self.getsmarttest('long');	
							}, 2000);
						}
					}
					else
					{
						if (data == '')
							data = '<span symbol="text:no_test_recently"></span>'
						if(type == 'short')
							$('[name=manual_test_result]').html(data);
						else
							$('[name=manual_test_result_long]').html(data);
					}
					$.naxx.translate($.naxx.acl.language, $('div.statusPanel #manual_test'));
			});
		},

		smarttest: function(type){
			var self = this, element = $(this.element);
			$.naxx.teleport.Exec($.naxx.path.disk, 'smart_test', 'target='+self.options.index+'&test_type='+type, function(){
					self.getsmarttest(type);
			});
		},
		destroy : function(){
			$.Widget.prototype.destroy.apply(this, arguments);
			var self = this, element = $(this.element);
			clearInterval(self.object.$interval);
			clearTimeout(self.object.$timeout);
			clearTimeout(self.object.$smarttesttimer_short);
			clearTimeout(self.object.$smarttesttimer_long);
		}
	});
})(jQuery);
