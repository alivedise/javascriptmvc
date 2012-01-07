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
 * Date: 2011-03-25 09:48:10
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * nvr.config.hac: Host Access Controll
 *
 */

;(function($) {
	$.widget('naxx.config_iptables', $.naxx.config, {
		options: {
			index: -1
		},
		object: {
			$allow: null,
			$deny: null
		},
		deny: [],
		allow: [],
		buttons:[
			{
				text: 'Save',
				type: 'settingBtn',
				attr: {
					symbol: 'text:save'
				},
				callback: function(){
					$(':naxx-config_iptables').config_iptables('apply');
					return false;
				}
			}/*,
			{
				text: 'Select policy',
				name: 'select_policy',
				type: 'settingBtn',
				attr: {
					symbol: 'text:select_policy',
					id: 'select_policy'
				}
			},
			{
				text: 'Create rule',
				name: 'create',
				type: 'settingBtn',
				attr: {
					symbol: 'text:create_rule',
					id: 'create_rule'
				},
				callback: function(){
					$(':naxx-config_iptables').config_iptables('create');
					return false;
				}
			},
			{
				text: 'Delete rule',
				name: 'delete',
				type: 'settingBtn',
				attr: {
					symbol: 'text:delete_rule',
					id: 'delete_rule'
				},
				callback: function(){
					$(':naxx-config_iptables').config_iptables('remove');
					return false;
				}
			}*/
		],
		initOther: function(){
			var self = this, element = $(this.element);
			$('div#iptableTabs').tabs({
				select: function(event, ui) {
					switch(ui.tab.hash)
					{
						case '#div_allow_all':
							$('#type').val('allowall');
							break;
						case '#div_allow_only':
							$('#type').val('allow');
							break;
						case '#div_deny_only':
							$('#type').val('deny');
							break;
					}
					$('#type').trigger('change');
				}
			});
			$('<label symbol="text:system_allow_all_connection_income_now"></label>').appendTo($('#div_allow_all'));
			$('<label symbol="text:system_only_allow_connection_from_the_list_below_now"></label>').appendTo($('#t_addressGrid_allow'));
			$('<label symbol="text:system_only_deny_connection_from_the_list_below_now"></label>').appendTo($('#t_addressGrid_deny'));
			$('<span class="ui-icon ui-icon-plus">&nbsp;</span><u><a href="#"><span symbol="text:add_a_rule" /></a></u>').click(
				function(){
					self.create('allow');
				}
			).appendTo($('#t_addressGrid_allow'), element);
			$('<span class="ui-icon ui-icon-plus">&nbsp;</span><u><a href="#"><span symbol="text:add_a_rule" /></a></u>').click(
				function(){
					self.create('deny');
				}
			).appendTo($('#t_addressGrid_deny'), element);
			$('<select class="hidden" id="type" name="type"><option symbol="text:allow_all" value="allow_all">allow_all</option><option symbol="text:allow_only" value="allow">allow only</option><option symbol="text:deny_only" value="deny">deny only</option></select>').appendTo(element);
			$('#type').change(function(){
				switch($(this).val())
				{
					case 'allowall':
						break;
					case 'allow':
						break;
					case 'deny':
						break;
				}
			});
		},
		create: function(mode){
			var self = this, element = $(this.element);
			self.iptableEditor();
			$('#remove').hide();
			$('#address').val('0:0:0:0/0');

			$.naxx.block('#iptableEditor');
		},
		edit: function(){
			var self = this, element = $(this.element);
			self.iptableEditor();
			$('#remove').show();
			$('#address').val(self.object.$grid.jqGrid('getRowData', self.options.index+1));
			$.naxx.block('#iptableEditor');
		},
		remove: function(){
			var self = this, element = $(this.element);
			if(self.options.index>=0)
			{
				self.object.$grid.jqGrid('delRowData', self.options.index+1);
				switch($('#type').val())
				{
				case 'allow':
					self.allow.splice(self.options.index, 1);
					break;
				case 'deny':
					self.deny.splice(self.options.index, 1);
					break;
				}
			}
		},
		iptableEditor: function(){
			var self = this, element = $(this.element);
			if($('#iptableEditor').length == 0)
			{
				$('<div id="iptableEditor" class="blockform"><h3>Create an new rule</h3><form><div id="type_description"></div><input class="ip" name="address" id="address" type="text" value="0.0.0.0/0" /></form></div>').hide().appendTo(element);
				$('input.ip', element).ipaddress({cidr: true});
				$('<button id="create" symbol="text:create" class="create">Create</button>').button().click(function(){
						switch($('#type').val())
						{
						case 'deny':
							if (self.object.$deny.getGridParam('records') >= $.naxx.capability.magic)
							{
								$.blockUI({message: '<span symbol="text:maximum_rules_exceed"></span>', timeout: 2000});
								$.naxx.translate();
								break;
							}
							self.object.$deny.jqGrid('addRowData', self.object.$deny.getGridParam('records'), {address: $('#address').val(), '_remove':'<span class="remove"></span>'});
							$('#gbox_addressGrid_deny').find('.jqgrow').eq(self.object.$deny.getGridParam('records')-1).find('.remove').button({icons:{primary: 'ui-icon-trash'}, text: false}).click(function(){
									index = $(this).parent().parent().attr('id');
									self.object.$deny.delRowData(index);
							});
							break;
						case 'allow':
							if (self.object.$grid.getGridParam('records') >= $.naxx.capability.magic)
							{
								$.blockUI({message: '<span symbol="text:maximum_rules_exceed"></span>', timeout: 2000});
								$.naxx.translate();
								break;
							}
							self.object.$grid.jqGrid('addRowData', self.object.$grid.getGridParam('records'), {address: $('#address').val(), '_remove':'<span class="remove"></span>'});
							$('#gbox_addressGrid_allow').find('.jqgrow').eq(self.object.$grid.getGridParam('records')-1).find('.remove').button({icons:{primary: 'ui-icon-trash'}, text: false}).click(function(){
									index = $(this).parent().parent().attr('id');
									self.object.$grid.delRowData(index);
							});
							break;
						case 'allowall':
							break;
						}
						$.unblockUI();
				}).appendTo($('#iptableEditor'));
				$('<button id="remove" symbol="text:remove" class="remove">Remove(!)</button>').button().hide().click(function(){
						$.unblockUI();
				}).appendTo($('#iptableEditor'));
			    $('<button id="cancel" symbol="text:cancel" class="block">Cancel</button>').button().click(
					function(){
						$.unblockUI();
					}
				).appendTo($('#iptableEditor'));
			}
			$.naxx.translate();
		},
		initTable: function(){
			var self = this, element = $(this.element);
			self.object.$grid = element.find('table.grid.allow').jqGrid({
				toolbar: [true, 'top'],
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'Address', 'remove'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'address', width : 200, align: 'left', sortable: false},
					{ name : '_remove', width : 200, align: 'left', sortable: false}

				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.index = id - 1 ;
				}
			}).show();
			self.object.$allow = self.object.$grid;
			
			self.object.$deny = element.find('table.grid.deny').jqGrid({
				toolbar: [true, 'top'],
				altRows: true,
				scrollrows: true,
				autowidth: true,
				height: 'auto',
				datatype: 'local',
				rownumbers: true,
				colNames : ['*' ,'Address','remove'],
				colModel : [
					{ name : 'modified', width : 10, align: 'left', sortable: false},
					{ name : 'address', width : 200, align: 'left', sortable: false},
					{ name : '_remove', width : 200, align: 'left', sortable: false}
				],
				shrikToFit: true,
				onSelectRow: function(id){
					self.options.index = id - 1 ;
				}
			}).show();

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		//重新填入所有攝影機資料
		reloadPrivate: function(data){
			var self = this, element = $(this.element);
			$.naxx.iptables = data;
			if(!data) return;
			if(self.object.$grid != null) self.object.$grid.jqGrid('clearGridData');
			if(self.object.$deny != null) self.object.$deny.jqGrid('clearGridData');
			$.each(data.deny, function(index, value){
				self.object.$deny.jqGrid('addRowData', index+1, {address: value, '_remove': '<span class="remove"></span>'}); 
			});
			$.each(data.allow, function(index, value){
				self.object.$grid.jqGrid('addRowData', index+1, {address: value, '_remove': '<span class="remove"></span>'}); 
			});
			$('#gbox_addressGrid_deny .jqgrow .remove').button({icons:{primary:'ui-icon-trash'}, text:false}).click(function(){
				var index = $(this).parent().parent().attr('id');
				self.object.$deny.delRowData(index);
			});
			$('#gbox_addressGrid_allow .jqgrow .remove').button({icons:{primary:'ui-icon-trash'}, text:false}).click(function(){
				var index = $(this).parent().parent().attr('id');
				self.object.$grid.delRowData(index);
			});
			switch(data.type)
			{
			case 'allowall':
				$('#iptableTabs').tabs('select', 0);
				break;
			case 'allow':
				$('#iptableTabs').tabs('select', 1);
				break;
			case 'deny':
				$('#iptableTabs').tabs('select', 2);
				break;
			}
		},

		apply: function(){
			var self = this, element = $(this.element);
			self.deny = [];
			self.allow = [];
			$.each(self.object.$deny.getRowData(), function(index, value){
				self.deny.push(value['address']);
			});
			$.each(self.object.$grid.getRowData(), function(index, value){
				self.allow.push(value['address']);
			});
			switch($('#iptableTabs').tabs('option', 'selected'))
			{
			case 0:
				$('#type').val('allowall');
				break;
			case 1:
				$('#type').val('allow');
				break;
			case 2:
				$('#type').val('deny');
				break;
			}

			$.naxx.teleport.Import(
				$.naxx.path.raphael+self.options.path , 
				{
					type: $('#type').val(),
					deny: self.deny,
					allow: self.allow
				},
				function(res)
				{
					$('[role=row]', element).removeClass('ui-jqgrid-new');
					$('#modified').val('');
					for (var i = 0; i < $.naxx.capability.encoder; i++)
						self.object.$grid.setRowData( i+1, {modified: ''});
				}
			);
		}
	});
})(jQuery);
