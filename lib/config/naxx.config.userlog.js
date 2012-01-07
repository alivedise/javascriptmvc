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
	$.widget('naxx.config_userlog', $.naxx.config, {
		buttons: [
			{
				type: 'settingBtn',
				text: 'Export',
				attr: {
					symbol: 'text:export'
				},
				callback: function(self, element){
					//$(':naxx-config_systemlog').config_systemlog('export');
					return false;
				}
			}
		],

		initTable: function(){
			var self = this, element = $(this.element);
			self.object.$grid = element.find('table.grid').jqGrid({
				url: '/fcgi-bin/dbusproxy.exec_query_user_log',
				mtype: 'POST',
				dataType: 'json',
				altRows: true,
				scrollrows: true,
				autowidth: true,
				datatype: 'json',
				rownumbers: true,
				colNames : ['id' ,'username', 'date' ,'address' ,'content'],
				colModel : [
					{ name : 'id', width : 25, align: 'left', sortable: false, hidden: true},
					{ name : 'user_name', width : 30, align: 'left', sortable: false},
					{ name : 'datetime', width : 50, align: 'left', sortable: false},
					{ name : 'source', width : 40, align: 'left', sortable: false},
					{ name : 'content', width : 100, align: 'left', sortable: false}
				],
				postData: {
					path: '/system/software/mercury'
				},
				loadBeforeSend: function(xhr, settings){
					settings.data = ReplaceAll(settings.data, '%2F', '/');
				},
				shrikToFit: true,
				rowNum: 20, 
				rowList:[20, 50, 100, 200], 
				pager: '#pjmap', 
				sortname: 'id', 
				viewrecords: true, 
				sortorder: "desc", 
				jsonReader: { repeatitems : false, id: "0" } 
			}).show();

			self.object.$grid.navGrid('#pjmap',{edit:false,add:false,del:false,search:false,refresh:false});

			self.object.$grid.setGridHeight(element.find('.tablePanel').height() - $('.ui-jqgrid-hdiv', '.tablePanel').height() - $('#pjmap').height());
			self.object.$grid.setGridWidth(element.find('.tablePanel').width());
		},

		//重新填入所有攝影機資料
		reload : function()
		{
			var self = this, element = $(this.element);
			var reload = false;
		},

		'export': function(){
		}

	});
})(jQuery);
