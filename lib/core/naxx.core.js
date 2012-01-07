/* 
 * Copyright (c) 2012 Vivotek Inc. All rights reserved.
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
 * Date: 2011-01-25 10:14:19
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * naxx.core.js: Naxx Core Object
 *
 */

(function($){
	$.extend($.Widget.prototype, { // note that we could extend $.Widget.prototype to add these to all widgets, rather than ones descended from $.ui.widget
		enable: function() {
			var element = $(this.element);
			$.naxx.translate($.naxx.acl.language, element);
			return this._setOption( "disabled", false );
		},
		disable: function() {
			var element = $(this.element);
			$.naxx.translate($.naxx.acl.language, element);
			return this._setOption( "disabled", true );
		}
	});
    $.extend({
        NonAjaxGet: function(url, params) {
            document.location = url + '?' + $.param(params);
        },
        NonAjaxPost: function(url, params) {
            var $form = $("<form method='POST'>").attr("action", url);
            $.each(params, function(name, value) {
                $("<input type='hidden'>")
                    .attr("name", name)
                    .attr("value", value)
                    .appendTo($form);
            });
            $form.appendTo("body");
            $form.submit();
        }
    });
	$.extend({
		naxx : {
		ajax_queue: [],
		loader: null,
		modified: false,
		lastlogin: 0,
		discard : false,
		inited: false,
		blockUI: {
			height: 580,
			width: 750
		},
		dbus_timeout: 20000,
		anotify_timeout: 8000,
		debugconsole: function(){},
		version: '1.0.0',
		pnotify: false,//是否使用pnotify來作訊息通知
		unsaved: false,
		language: ['English', 'Deutsch', 'Español', 'Français', 'Italiano', '日本語', 'Português', '简体中文', '繁體中文'],
		xml: null,
		rec: {},
		stranslate: function(str){
			if (str == " ") return " ";
			if (typeof(str) == "undefined") return "";
			if (str.charAt(0) >= '0' && str.charAt(0) <= '9') return str; //ie xml parser error
			if($.naxx.xml && $($.naxx.xml).find(str).length > 0)
			{
				$.log('NAXX.Log> TIME('+new Date()+')\n\tSymbol Translated=['+str+']>>['+$($.naxx.xml).find('lang').eq(Number($.naxx.acl.language)).find(str).text()+']');
				return $($.naxx.xml).find('lang').eq(Number($.naxx.acl.language)).find(str).text();
			}
			else
			{
				$.log('NAXX.Log> TIME('+new Date()+')\n\tUNTRANSLATED Symbol>['+str+']');
				return ReplaceAll(str, '_', ' ');
				str = str.replace('_', ' ');
				str = str.replace(/\b\w+\b/g, function(word) {
						return word.substring(0,1).toUpperCase( ) + word.substring(1);
				});
			}
		},
		translate: function(language, element){
			var self = this;
			if (typeof(language) == 'undefined' && $.naxx.acl != null)
				language = $.naxx.acl.language;
			if (typeof(element) == 'undefined')
				element = $('html');
			$.naxx.currentlang = language;
			$.naxx.acl.language = language;
			$('#multilingual').val($.naxx.acl.language);
			function translate(elem){
				var str = elem.attr('symbol').split(':')[1];
				if(typeof(str) == 'undefined') return '';
				if (str == " ") return " ";
				if (str.charAt(0) >= '0' && str.charAt(0) <= '9') return str; //ie xml parser error
				if (str.charAt(0) < 'A' || (str.charAt(0) > 'Z' && str.charAt(0) < 'a') || str.charAt(0) > 'z') return str; //ie xml parser error
				try{
					if($.naxx.xml && $($.naxx.xml).find(str).length > 0)
					{
						$.log('NAXX.Log> TIME('+new Date()+')\n\tSymbol Translated=['+str+']>>['+$($.naxx.xml).find('lang').eq(Number($.naxx.acl.language)).find(str).text()+']');
						return $($.naxx.xml).find('lang').eq(Number(language)).find(str).text();
					}
					else
					{
						$.log('NAXX.Log> TIME('+new Date()+')\n\tUNTRANSLATED Symbol>['+str+']');
						return elem.text() == '' ? ReplaceAll(str, '_', ' ') : elem.text();
					}
				}
				catch(e)
				{
						$.log('NAXX.Log> TIME('+new Date()+')\n\tUNTRANSLATED Symbol>['+str+']');
						return ReplaceAll(str, '_', ' ');
				}
			}
			element.find('img[symbol],a[symbol],span[symbol],option[symbol],legend[symbol],h3[symbol],h1[symbol],label[symbol],div[symbol],area[symbol]').each(function(){
					var symbol = $(this).attr('symbol').split(':');
					var target = symbol[0];
					var text = symbol[1];
					if( target == 'title')
					{
						$(this).attr('title', translate($(this), language));
					}
					else if( target == 'alt')
					{
						$(this).attr('alt', translate($(this), language));
					}
					else
					{
						if ($(this).find('.vivotext').length>0)
						{
							$(this).find('.vivotext').text(translate($(this), language));
						}
						else if ($(this).find('.ui-button-text').length>0)
						{
							$(this).find('.ui-button-text').text(translate($(this), language));
						}
						else
						{
								$(this).text(translate($(this), language));
						}
					}
			});
			element.find('button[symbol]').each(function(){
					var symbol = $(this).attr('symbol').split(':');
					var target = symbol[0];
					var text = symbol[1];
					if($(this).find('.ui-button-text').length>0)
					{
						$(this).find('.ui-button-text').text(translate($(this), language));
					}
					else
					{
						$(this).text(translate($(this), language));
					}
			});
			element.find('input[symbol]').each(function(){
					var symbol = $(this).attr('symbol').split(':');
					var target = symbol[0];
					var text = symbol[1];

					if (target == 'value')
					{
						$(this).attr('value', translate($(this), language));
						$(this).val(translate($(this), language));
					}
			});
			element.find('div.jqTransformSelectWrapper ul li a').each(function(){
				if( !$(this).attr('symbol') )
				{
					var text = $(this).text().toLowerCase();
					if (text == '*') return true;
					function isNumber(val){
						var reg = /^[0-9]*$/;
						return reg.test(val);
					}
					if (isNumber(text)) return true;
					$(this).attr('symbol', 'text:'+text);
					$(this).text(translate($(this), language));
				}
				else
				{
					var symbol = $(this).attr('symbol').split(':');
					var target = symbol[0];
					var text = symbol[1];
					$(this).text(translate($(this), language));
				}
			});
			element.find('.ui-jqgrid div.ui-jqgrid-sortable,.ui-timepicker-title').each(function(){
				if( !$(this).attr('symbol') )
				{
					var text = $(this).text().toLowerCase();
					if (text == '*') return true;
					$(this).attr('symbol', 'text:'+text);
					$(this).html(translate($(this), language));
				}
				else
				{
					var symbol = $(this).attr('symbol').split(':');
					var target = symbol[0];
					var text = symbol[1];
					$(this).html(translate($(this), language));
				}
			});
		},
		command: {
			System: '/fcgi-bin/system.command',
			Snapshot: '/fcgi-bin/snapshot',
			Import: '/fcgi-bin/configd.update',
			Export: '/fcgi-bin/configd.query',
			Update: '/fcgi-bin/dbusproxy.gconf_update',
			Query: '/fcgi-bin/dbusproxy.gconf_query',
			Preload: '/fcgi-bin/configd.recent_preload',
			Method: '/fcgi-bin/dbusproxy.method_call',
			Listen: '/fcgi-bin/dbusproxy.listen_info',
			Pop: '/fcgi-bin/dbusproxy.pop_info',
			Exec: '/fcgi-bin/dbusproxy.',
			Login: '/fcgi-bin/system.login',
			Logout: '/fcgi-bin/system.logout',
			Media: '/fcgi-bin/media_export'
		},
		Snapshot: function(channel, timestamp, offset, target, animate){
			var img = new Image();
			var newContainer = $('<div class="screenshot loading"></div>').appendTo(target);
			$(img).load(function(){
					$(this).hide();
					newContainer.append(this).removeClass('loading');
					if(animate) $(this).fadeIn();
					else $(this).show();
				})
				.error(function (res) {
						newContainer.addClass('noimage').removeClass('loading');
					//newContainer.append('<img src="snapshot/2.jpg" />');
				})
				.attr('src', $.naxx.command.Snapshot+'?channel='+channel+'&timestamp='+timestamp+'&range=1000000');
		},
/*
				$.ajax({
					url: $.naxx.command.Snapshot,
					type: 'POST',
					global: true,
					//async: false,
					data: 'channel='+channel+'&timestamp='+timestamp+'&offset='+offset,
					dataType: 'html',
						//dataType: 'json',
					error: function(res){
						if(res.status == '200')
						{
							target.removeClass('loading');
							
							$(img).html(res.responseText).appendTo(target);
						}	
						else
							target.removeClass('loading').html('no images.');
						//target.removeClass('loading').append(img).append(html).show();
						//$(img).fadeIn();
					}
				});*/
		block: function(target, fixHeight){
			//width = $(window).width()/2 > 700 ? $(window).width()/2 : $(window).width()-100;
			width = $.naxx.blockUI.width;
			height = $.naxx.blockUI.height;
			//if(fixHeight == null) height = $(window).width()/2 > 500 ? $(window).height()/2+100 : $(window).height()-100;
			//else height = fixHeight; //for ui tabs
			$.blockUI({message: $(target), css: {top: ($(window).height()-height)/2, left: ($(window).width()-width)/2, border: 'none', 'text-align': 'left', color: 'white', width: width, height: height, cursor: 'default'}, focusInput: false});
			$.naxx.translate($.naxx.acl.language, $('.blockUI'));
			return [width, height];
		},
		blockWarn: function(message){
			$.blockUI({message: '<div class="blockWarn">'+message+'</div>', css: { 'text-align': 'left', background: '#2a2a2a', border:'solid 2px white', color: 'white', padding: '10px', width: 300, left: $(window).width()/2 - 150}});
			$('.blockUI button').addClass('block');
			$.naxx.translate($.naxx.acl.language, $('.blockUI'));
		},
		checkDate: function(value) {
			function makeDate(matches) {
				var date = new Date(matches[1], matches[2] - 1, matches[3],
				matches[4], matches[5], matches[6]);
				date._type = (matches[7] ? 'UTC' : 'float');
				//return self.utcDate(date);
				return date;
			};
			/* Pattern for folded lines: start with a whitespace character */
			var FOLDED = /^\s(.*)$/;
			/* Pattern for an individual entry: name:value */
			var ENTRY = /^([A-Za-z0-9-]+)((?:;[A-Za-z0-9-]+=(?:"[^"]+"|[^";:,]+)(?:,(?:"[^"]+"|[^";:,]+))*)*):(.*)$/;
			/* Pattern for an individual parameter: name=value[,value] */
			var PARAM = /;([A-Za-z0-9-]+)=((?:"[^"]+"|[^";:,]+)(?:,(?:"[^"]+"|[^";:,]+))*)/g;
			/* Pattern for an individual parameter value: value | "value" */
			var PARAM_VALUE = /,?("[^"]+"|[^";:,]+)/g;
			/* Pattern for a date only field: yyyymmdd */
			var DATEONLY = /^(\d{4})(\d\d)(\d\d)$/;
			/* Pattern for a date/time field: yyyymmddThhmmss[Z] */
			var DATETIME = /^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)$/;
			/* Pattern for a date/time range field: yyyymmddThhmmss[Z]/yyyymmddThhmmss[Z] */
			var DATETIME_RANGE = /^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)\/(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)(Z?)$/;
			/* Pattern for a timezone offset field: +hhmm */
			var TZ_OFFSET = /^([+-])(\d\d)(\d\d)$/;
			/* Pattern for a duration: [+-]PnnW or [+-]PnnDTnnHnnMnnS */
			var DURATION = /^([+-])?P(\d+W)?(\d+D)?(T)?(\d+H)?(\d+M)?(\d+S)?$/;
			var matches = /(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)/.exec(value);
			if (matches) {
				return makeDate(matches);
			}
			matches = DATETIME_RANGE.exec(value);
			if (matches) {
				return {start: makeDate(matches), end: makeDate(matches.slice(7))};
			}
			matches = DATEONLY.exec(value);
			if (matches) {
				return makeDate(matches.concat([0, 0, 0, '']));
			}
			return value;
		},
		rfcParser: function(rfc_string)
		{
			rfc_string = ReplaceAll(rfc_string, '\r', '');
			var matches = /FREQ=(DAILY|WEEKLY|MONTHLY|YEARLY|SECONDLY)/.exec(rfc_string);
			if(!matches)
				return {
					freq: '',
					bymonth: '',
					bymonthday: '',
					byday: '',
					dtstart: '',
					dtend: ''
				};
			var frequency = matches[1];

			rec_type = null;
			matches = /X\-REC\-TYPE:([^\n\r]+)/.exec(rfc_string);
			if (matches) {
				rec_type = matches[1];
			}

			events = '';
			if (rec_type == 'EVENT')
			{
				matches = /X\-INT\-EVENTS:([^\n]+)/.exec(rfc_string);
				if (matches) {
					events = matches[1];
				}
			}


			byday = null;
			matches = /BYDAY=([^;\n]+);?/.exec(rfc_string);
			if (matches) {
				byday = matches[1];
			}

			bymonthday = null;
			matches = /BYMONTHDAY=([^;\n]+);?/.exec(rfc_string);
			if (matches) {
				bymonthday = matches[1].split(",");
			}

			bymonth = null;
			matches = /BYMONTH=([^;\n]+);?/.exec(rfc_string);
			if (matches) {
				bymonth = matches[1].split(",");
			}

			bysetpos = null;
			matches = /BYSETPOS=([^;\n]+);?/.exec(rfc_string);
			if (matches) {
				bysetpos = matches[1];
    			}

			dtstart = null;
			matches = /DTSTART;VALUE=DATE:([^\r\n]+);?/.exec(rfc_string);
    			if (matches) {
        			dtstart = matches[1];
    			}
				else
				{
					matches = /DTSTART:([^\n]+);?/.exec(rfc_string);
					if (matches) {
						dtstart = matches[1];
					}

				}

			dtend = null;
			matches = /DTEND;VALUE=DATE:([^\r\n]+);?/.exec(rfc_string);
    			if (matches) {
        			dtend = matches[1];
    			}
				else
				{
					matches = /DTEND:([^\n]+);?/.exec(rfc_string);
					if (matches) {
						dtend = matches[1];
					}
				}

    			switch (frequency) {
    			case "DAILY":
        			return {
					freq: frequency,
					dtstart: dtstart,
					dtend: dtend,
					rec_type: rec_type,
					events: events
				};
    			case "WEEKLY":
        			return {
					freq: frequency,
					byday: byday,
					dtstart: dtstart,
					dtend: dtend,
					rec_type: rec_type,
					events: events
				};
    			case "MONTHLY":
        			return {
					freq: frequency,
					bymonthday: bymonthday,
					dtstart: dtstart,
					dtend: dtend,
					rec_type: rec_type,
					events: events
				};
    			case "YEARLY":
			       return {
					freq: frequency,
					bymonth: bymonth,
					bymonthday: bymonthday,
					dtstart: dtstart,
					dtend: dtend,
					rec_type: rec_type,
					events: events
				};
			}
		},
		teleport: {
			Login: function(encode, success_callback, error_callback){
				if (new Date().getTime() - $.naxx.lastlogin < 1000) return false;
				$.naxx.lastlogin = new Date().getTime();
				var self = this;
				if(encode != '')
				{
					$.pnotify_remove_all();
					$.naxx.loader =  $.pnotify({
						pnotify_title: '<img src="images/gif/pnotify-loader.gif" /><span symbol="text:processing">Processing...</span>',
						pnotify_notice_icon: '', //custom loader
						pnotify_addclass: 'stack-bottomright',
						pnotify_history: false,
						pnotify_delay: 30000,
						pnotify_stack: false,
						pnotify_after_close: function(){
							$.naxx.loader = null;
						}
					});
				}
				if ($('#alayout').length == 0)
				{
					if (!$.cookie('mode'))
						var mode = 'liveview';
					else
						var mode = $.cookie('mode');
				}
				else
					var mode = $('#alayout').val();
				$.ajax({
					url: '/fcgi-bin/system.login',
					//url: 'index.html',
					global: false,
					type: 'POST',
					data: 'encode='+encode+'&mode='+mode,
					error: function(res,a,b,c){
						console.log(a,b,c);
						error_callback(res);
					},
					'beforeSend': function(xhr) {
						xhr.setRequestHeader("Authorization", "Basic " + encode);
					},
					success: function(res){
						var jsondata = eval('('+res+')');
						success_callback(jsondata);
					}
				});
			},
			Logout: function(success_callback, error_callback){
				var self = this;
				$.ajax({
					url: '/fcgi-bin/system.logout',
					type: 'POST',
					success: function(res){
						var jsondata = eval('('+res+')');
						success_callback(jsondata);
					}
				});
			},
			Listen: function(app_path, member, data_callback){
				var self = this;
				var data = 'path='+app_path+'&member='+member;
				$.ajax({
					url: $.naxx.command.Listen,
					type: 'POST',
					data: data,
					error: function(res){
					},
					success: function(res){
						var jsondata = eval('('+res+')');
						data_callback(jsondata);
					}
				});
			},
			Exec: function(app_path, method, param, data_callback, fail_callback, complete_callback){
				var self = this;

				if (param == '') var data = 'path='+app_path;
				else var data = 'path='+app_path+'&'+param;

				$.ajax({
					url: $.naxx.command.Exec+method,
					type: 'POST',
					//global: true,
					//async: false,
					data: data,
					//dataType: 'json',
					error: function(res){
						if(typeof(fail_callback) == 'function')
						{
							fail_callback(res);
						}
						else
						{
						/*	$.naxx.loader = $.pnotify({
								pnotify_title: '<span symbol="text:operation_fail">Operation fail</span>',
								pnotify_type: 'error',
								pnotify_text: '<span>'+res.responseText+'</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});*/
						}
					},
					success: function(res){
						try{
							var jsondata = eval('('+res+')');
							data_callback(jsondata);
						}
						catch(e){
							data_callback(res);
						}
					},
					complete: function(){
						if(typeof(complete_callback) == 'function')
						{
							complete_callback(res);
						}
					}
				});
			},
			System: function(command, callback){
				$.ajax({  
					url: $.naxx.command.System,
					type: 'POST',
					dataType: 'json',
					data: '{ "command" : "'+command+'" }',
					success: function(data) {
						callback(data);
					},
					error: function(res){
						$.pnotify({
							pnotify_title: 'Ajax Error',
							pnotify_type: 'error',
						    pnotify_text: res,
							pnotify_addclass: 'stack-bottomright',
							pnotify_history: false,
							pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
						});
					}
				});
			},
			Import: function(data_path, data_save, callback, fail_callback){
				if (data_path.match($.naxx.path.naxx)) {
					//var data = JSON.stringify({path: data_path, data: data_save});
					var data = 'path='+data_path+'&data='+JSON.stringify(data_save);
					var url = $.naxx.command.Import;
				}
				else
				{ 
					var data = 'path='+data_path+'&data='+JSON.stringify(data_save);
					var url = $.naxx.command.Update;
				}
				if (typeof(fail_callback) != 'function')
				{
					var loader =  $.pnotify({
						pnotify_title: '<span symbol="text:processing">processing</span>',
						pnotify_icon: '',
						pnotify_addclass: 'stack-bottomright',
						pnotify_history: false,
						pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
					});
				}
				var ajax_call = $.ajax({
					url: url,
					type: 'POST',
					data: data.replace('\"true\"', 'true').replace('\"false\"', 'false'),
					error: function(res){
						if(typeof(loader)!='undefined')
							loader.pnotify({
								pnotify_title: '<span symbol="text:server_error">Server error!</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_type: 'error',
								pnotify_text: res.responseText,
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
						else
							$.pnotify({
								pnotify_title: '<span symbol="text:server_error">Server error!</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_type: 'error',
								pnotify_text: res.responseText,
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});

						if (typeof(fail_callback) == 'function')
							fail_callback(res)
						else
						{
						}
					},
					success: function(res){
						//if(res.length == 0) return;
						if(typeof(loader)!='undefined')
							loader.pnotify({
								pnotify_title: '<span style="color: green;" symbol="text:apply_complete">Apply complete!</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_text: '',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
						else
							$.pnotify({
								pnotify_title: '<span style="color: green;" symbol="text:apply_complete">Apply complete!</span>',
								pnotify_addclass: 'stack-bottomright',
								pnotify_text: '',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
						if(typeof(callback) == 'function')
						{
							callback(res);
						}
					},
					complete: function(){
						$.naxx.modified = false;
					}
				});
			},

			Export: function(data_path, callback, fail_callback){
				if (data_path.match($.naxx.path.naxx)) {
					//var data = JSON.stringify({path: data_path});
					var data = 'path='+data_path;
					var url = $.naxx.command.Export;
				}
				else
				{ 
					var data = 'path='+data_path;
					var url = $.naxx.command.Query;
				}
				var ajax_call = $.ajax({
					url: url,
					type: 'POST',
					data: data,
					//global: false,
					success: function(res){
						if(typeof(res) == 'undefined' || res.length == 0) return;
						var jsondata = eval('('+res+')');
						callback(jsondata);
					},
					error: function(res)
					{
						if(fail_callback)
						{
							fail_callback(res);
						}
						else
						{
							if(res.status < 500)
							{
								//console.log('statu');
								return; //abort
							}
							else
							{
								$.pnotify({
									pnotify_title: 'Error '+res.status+' :'+data_path,
									pnotify_type: 'error',
									pnotify_text: res.responseText,
									pnotify_addclass: 'stack-bottomright',
									pnotify_history: false,
									pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
								});
							}
						}
					}
				});
			$.naxx.ajax_queue.push(ajax_call);
			},
			
			Preload: function(data_path, callback){
					if($.isArray(data_path))
					{
						var data = [];
						for(var i = 0; i < data_path.length; i++)
						{
							data.push({path: data_path[i]});
						}
					}
					else
					{
						var data = {path: data_path};
					}

					$.ajax({                                                                                                   
						url: $.naxx.command.Preload,
						type: "POST",
						dataType: "json",
						data: JSON.stringify(data),
						error: function(res){
							$.pnotify({
								pnotify_title: 'Ajax Error',
								pnotify_type: 'error',
						        pnotify_text: res,
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
						},
						success: callback
					});
			},

			Pop: function(data_path, member, callback){
					timer = 1000;
					var data='path='+data_path+'&member='+member;

					$.ajax({                                                                                                   
						url: $.naxx.command.Pop,
						type: "POST",
						data: data,
						error: function(res){
							$.pnotify({
								pnotify_title: 'Ajax Error',
								pnotify_type: 'error',
						        pnotify_text: res,
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
							setTimeout(function(){$.naxx.teleport.Pop(data_path, member, callback);}, timer);
						},
						success: function(res)
						{
							callback(res);
							setTimeout(function(){$.naxx.teleport.Pop(data_path, member, callback);}, timer);
						}
					});
			},

			Method: function(app_path, method, param, data_callback){
				var method_object = {
					bus_name : app_path.replace(/\//gi, '.').replace(/^\./g, ''),
					object_path : app_path,
					interface : app_path.replace(/\//gi, '.').replace(/^\./g, ''),
					method : method,
					data : param
				};
				
				var repeat_count = 0;
				var loading = $.pnotify({
					pnotify_title: 'Doing ' + method + '..',
					pnotify_text: '<img src="images/gif/vivoload.gif" />',
					pnotify_hide: false,
					pnotify_addclass: 'stack-bottomright',
					pnotify_history: false,
					pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
				});

				var $repeat = setInterval(
					function(){
					$.ajax({
						url: $.naxx.command.Method,
						type: 'POST',
						dataType: 'json',
						async: false,
						data: JSON.stringify(method_object),
						error: function(res){
							loading.pnotify({
								pnotify_title: 'Ajax Error',
								pnotify_type: 'error',
						        pnotify_text: res,
								pnotify_addclass: 'stack-bottomright',
								pnotify_history: false,
								pnotify_stack: {"dir1": "up", "dir2": "left", "firstpos1": 15, "firstpos2": 15}
							});
							repeat_count++;
							if (repeat_count > 5) clearInterval($repeat);
						},
						success: function(res){
							if (res.reply != '')
							{
								setTimeout(function(){loading.pnotify_remove()}, 3000);
								clearInterval($repeat);
								//$.naxx.teleport.Pop(res, data_callback);
								data_callback(res.reply);
							}
							else
							{
								repeat_count++;
								if (repeat_count > 5) clearInterval($repeat);
							}
						}
					});
				}, 1000);
			}
		},

		path: {
			naxx: '/system/software/naxx',
			'encoder': '/system/software/meteor/encoder',
			disk: '/system/software/comet/disk',
			volume: '/system/software/comet/volume',
			profile: '/system/software/meteor/profile',
			vision: '/system/software/naxx/vision',
			emap: '/system/software/naxx/e-map',
			galaxy: '/system/software/galaxy',
			meteor: '/system/software/meteor',
			mercury: '/system/software/mercury',
			raphael: '/system/software/raphael',
			mars: '/system/software/mars-relay',
			rec: '/system/software/mars-rec/rec',
			comet: '/system/software/comet',
			saturn: '/system/software/saturn',
			schedule: '/system/software/mars-rec/schedule',
			rec_status: '/system/software/mars-rec/status',
			harute: '/system/software/harute',
			alarm: '/system/software/corona'
		},

		raphael: {},
		/*所有layout*/
		desktop: {
			vision: {},
			emap: {}
		},
		/*Camera List*/
		'encoder': {},
		'status': {},
		user: {},
		alarm: {
			0: {},
			1: {},
			2: {},
			3: {},
			4: {},
			5: {},
			6: {},
			7: {},
			8: {},
			9: {},
			10: {},
			11: {},
			12: {},
			13: {},
			14: {},
			15: {}
		},
		temp: {
			alarm: {
				'trigger': {
					's': '0',
					'0': '0',
					'1': '0',
					'2': '0',
					'3': '0',
					'4': '0',
					'5': '0',
					'6': '0',
					'7': '0',
					'8': '0',
					'9': '0',
					'10': '0',
					'11': '0',
					'12': '0',
					'13': '0',
					'14': '0',
					'15': '0'
				},
				'schedule': {
					0: 'BEGIN:VEVENT\nEND:VEVENT',
					1: 'BEGIN:VEVENT\nEND:VEVENT',
					2: 'BEGIN:VEVENT\nEND:VEVENT',
					3: 'BEGIN:VEVENT\nEND:VEVENT',
					4: 'BEGIN:VEVENT\nEND:VEVENT',
					5: 'BEGIN:VEVENT\nEND:VEVENT',
					6: 'BEGIN:VEVENT\nEND:VEVENT',
					7: 'BEGIN:VEVENT\nEND:VEVENT',
					8: 'BEGIN:VEVENT\nEND:VEVENT',
					9: 'BEGIN:VEVENT\nEND:VEVENT',
					10: 'BEGIN:VEVENT\nEND:VEVENT',
					11: 'BEGIN:VEVENT\nEND:VEVENT',
					12: 'BEGIN:VEVENT\nEND:VEVENT',
					13: 'BEGIN:VEVENT\nEND:VEVENT',
					14: 'BEGIN:VEVENT\nEND:VEVENT',
					15: 'BEGIN:VEVENT\nEND:VEVENT'
				},
				'action': {
					'0': {
						'type': '',
						'enable': false,
						'name': ''
					},
					'1': {
						'type': '',
						'enable': false,
						'name': ''
					},
					'2': {
						'type': '',
						'enable': false,
						'name': ''
					},
					'3': {
						'type': '',
						'enable': false,
						'name': ''
					}
				},
				name: 'alarm',
				interval: 3,
				enable: true
			}
		},
		schedule: {
		},
		disk: {},
		volume: {},
		profile: {},
		saturn: {},
		iptables: {},
		layout: {
			panel: 150,
			list: 300,
			queue: 150,
			green: '#5f8700'
		},
		query: [],
		acl: {},
		'static': {},
		'runtime': {},
		'scan': {},
		/*Max Values*/
		'capability': {
			magic: 16,
			layout: 4,
			user: 16,
			emap: 4,
			encoder: 16,
			alarm: 16,
			disk: 6,
			volume: 6,
			container: 25,
			preset: 16,
			utility: 8
		},
		currentlang : 0,
	    auto : function(){
			var lang = window.navigator.userLanguage || window.navigator.language ;
			var relang=lang.toLowerCase();
			switch (relang){
			case "en-us":
				$.naxx.translate(0);
				break;
			case "de":
			case "de-de":
			case "de-ch":
			case "de-li":
			case "de-at":
			case "de-lu":
				$.naxx.translate(1);
			break;
				case "es":
				case "es-ar":
				case "es-ve":
				case "es-uy":
				case "es-gt":
				case "es-hn":
				case "es-sv":
				case "es-es":
				case "es-do":
				case "es-cl":
				case "es-ni":
				case "es-pa":
				case "es-py":
				case "es-pr":
				case "es-us":
				case "es-mx":
				case "es-ec":
				case "es-cr":
				case "es-co":
				case "es-bo":
				case "es-pe":
				$.naxx.translate(2);
				break;
			case "fr":
			case "fr-ca":
			case "fr-ch":
			case "fr-be":
			case "fr-fr":
			case "fr-mc":
			case "fr-lu":
				$.naxx.translate(3);
				break;
			case "it":
			case "it-it":
			case "it-ch":
				$.naxx.translate(4);
				break;
			case "ja":
			case "ja-jp":
				$.naxx.translate(5);
				break;
			case "pt":
			case "pt-pt":
			case "pt-br":
				$.naxx.translate(6);
				break;
			case "zh-cn":
			case "zh-hans":
			case "zh-sg":
				$.naxx.translate(7);
				break;
			case "zh-tw":
			case "zh-hanf":
			case "zh-hk":
			case "zh-mo":
				$.naxx.translate(8);
				break;
			default:
				$.naxx.translate(0);
			}
		},
		loginUI: function(){
			if($('div.blockdiv').length>0) return;
			var trylogin = false;
			var container = $('body').layout({
				resizable: false,
				slidable: false,
				closable: false,
				south__size: 54,
				spacing_open: 0,//邊框的間隙 
				showOverflowOnHover: false,
				spacing_closed: 0 //關閉時邊框的間隙
			});

			$('div#inner').block({focusInput: false, message: '<img src="images/VIVOTEK_logo.png" alt="VIVOTEK" />'+
						'<div class="blockdiv">'+
						'<form onsubmit="return false;">'+
						'<div class="container">'+
						//'<div class="login"><span symbol="text:login" /></div>'+
						'<div class="input ui-corner-all" style="display: none;"><input tabindex=0 id="firtfocus" name="firstfocus" value="" size=64 maxlength=64 /></div>'+
						'<div class="input ui-corner-all"><span symbol="text:username" class="input" /><input type="text" tabindex=1 id="username" name="username" value="" size=64 maxlength=64 /><span class="ui-icon-alert ui-icon" /></div>'+
						'<div class="input ui-corner-all"><span symbol="text:password" class="input" /><input tabindex=2 id="password" name="password" type="password" value="" size=64 maxlength=64 /><span class="ui-icon-alert ui-icon" /></div>'+
						//'<div tabIndex=3 class="input ui-corner-all" id="language" class="hidden"><span class="input" /><span class="selector ui-icon ui-icon-triangle-1-s" /></div>'+
						'<div class="vinput"><span class="leftside"><input type="checkbox" id="rememberme" checked=true /><span symbol="text:remember_me">Remember me</span></span><span class="rightside"><button id="button" value="login" symbol="text:login" tabindex=3>Login</button><button id="entry" tabIndex=4 /></span></div>'+
						'<select id="alayout" class="hidden" tabIndex=-1>'+
							'<option value="liveview" symbol="text:live">Liveview</option>'+
							'<option value="playback" symbol="text:playback">Playback</option>'+
							'<option value="settings" symbol="text:settings">Settings</option>'+
						'</select>'+
						'</div>'+
					'</form></div>', overlayCSS: {'backgroundColor': '#010312', opacity:1, cursor: 'default'}, css: {'text-align': 'left', 'background': 'url("images/widget/login/loginbg.jpg")', border: 'none', overflow:'hidden', cursor:'default', width:512, height:365, top: 100, left: $(window).width()/2-498/2, 'padding-top': 70}});

					if($('div#entry_list').length == 0)
					{
						$('<div id="entry_list">'+
								'<div value="liveview" index=0><span class="playq live" /><span symbol="text:liveview">Liveview</span></div>'+
								'<div value="playback" index=1><span class="playq playback" /><span symbol="text:playback"></span></div>'+
								//'<div value="emap" index=2><span class="playq emap" /><span symbol="text:emap" /></div>'+
								'<div value="settings" index=3><span class="playq settings" /><span symbol="text:settings">Settings</span></div>'+
						'</div>').hide().appendTo($('body'));
					}
					$('#entry').button({icons: {primary: 'ui-icon-triangle-1-e'}, text: false});
					$('#entry').removeClass('ui-corner-all').addClass('ui-corner-right');
					$('#entry_list div').click(function(){
						$('#entry_list').hide();
						$('#alayout').val($(this).attr('value'));
						$('#button').trigger('click');
					}).mouseenter(function(){
						$(this).addClass('selected').siblings().removeClass('selected');
					})
					$('#entry_list').bind('mouseleave', function(){
						$('#entry').trigger('lol');
					});
					var loginmenu = $('#entry').tooltip({ 
						events : { def: 'focus,lol', tooltip: 'mouseenter,mouseleave'},
						position : 'center right',
						offset: [35, 0],
						tip: '#entry_list',
						effect: 'fade',
						onBeforeShow: function(){
							$('#entry_list[value='+$('#alayout').val()+']').addClass('selected').siblings().removeClass('selected');
						}
					});
					
					var lastevt = 0;
					$('form').bind('keydown', function(evt)
					{
						var key = evt.which || evt.keyCode;
						switch (key) {
							case 13:  
								if(evt.timeStamp - lastevt < 1000)
								{
									return true;
								}
								$.log(evt.timeStamp);
								$('#button').trigger('click');
								lastevt = evt.timeStamp;
								break;
						}
						return true;
					});

					$('div.input').click(function(){
						$(this).find('span.input').hide();
						$(this).find('input').focus();
					});

					$('#username,#password').focus(function(){
						$(this).siblings('.input').hide();
					}).blur(function(){
						if($(this).val() == '')
							$(this).siblings('.input').show();
					}).keyup(function(){
						if($(this).val() == '' && trylogin){
							$(this).parent().addClass('ui-state-error').focus();
							$(this).siblings('.ui-icon').show();
							$(this).focus();
							return true;
						}
						else if($(this).val() != '')
						{
							$(this).parent().removeClass('ui-state-error');
							$(this).siblings('.ui-icon').hide();
							$(this).focus();
						}
					});
					if($.cookie('username'))
					{
						$('#username').val($.cookie('username')).trigger('focus');
					}

					$('#button').button().unbind('click').click(function(event){
						/*trylogin = true;*/
						var validate_failed = false;
						$('#entry').button('refresh');
						$('#entry_list').hide();
						if($('#password').val() == ''){
							$('#password').parent().addClass('ui-state-error').focus();
							$('#password').siblings('.ui-icon').show();
							validate_failed = true;
						}
						else
						{
							$('#password').parent().removeClass('ui-state-error');
							$('#password').siblings('.ui-icon').hide();
						}

						if($('#username').val() == ''){
							$('#username').parent().addClass('ui-state-error').focus();
							$('#username').siblings('.ui-icon').show();
							validate_failed = true;
						}
						else
						{
							$('#username').parent().removeClass('ui-state-error');
							$('#username').siblings('.ui-icon').hide();
						}

						if(validate_failed) return;

						if(!$.cookie('mode'))
						{
							$.cookie('mode', $('#alayout').val(), {path: '/', expires: 2});
						}

						$.naxx.teleport.Login(Base64.encode($('#username').val()+':'+$('#password').val()),
						function(data){
								$.naxx.loader = $.naxx.loader.pnotify({
									pnotify_title: '<span symbol="text:login_successfully">Login successfully</span>',
									pnotify_notice_icon: 'ui-icon ui-icon-check',
									pnotify_addclass: 'stack-bottomright',
									pnotify_history: false,
									pnotify_stack: false,
									pnotify_delay: $.naxx.anotify_timeout,
									pnotify_after_close: function(){
										$.naxx.loader = null;
									}
								});
								if($('#rememberme').attr('checked'))
									$.cookie('username', $('#username').val(), {path: '/', expires: 2});
								else
									$.cookie('username', null);
								$.extend($.naxx.acl, data);
								$('div#inner').unblock();
								$('body').layout().destroy();
								$('body').alayout({mode:$('#alayout').val()});
							},
							function(res){
								if(res.status == '401')
								{
									$.naxx.loader = $.naxx.loader.pnotify({
										pnotify_title: '<span symbol="text:login_error">Login error</span>',
										pnotify_type: 'error',
										pnotify_text: '<span symbol="text:username_password_mismatch">Username/password incorrect.</span>',
										pnotify_addclass: 'stack-bottomright',
										pnotify_history: false,
										pnotify_stack: false,
										pnotify_delay: $.naxx.anotify_timeout,
										pnotify_after_close: function(){
											$.naxx.loader = null;
										}
									});
								}
								else if(res.status == '0')
								{
									$.naxx.loader = $.naxx.loader.pnotify({
										pnotify_title: '<span symbol="text:network_error">Network error</span>',
										pnotify_type: 'error',
										pnotify_text: '<span symbol="text:request_timeout">Request timeout.</span>',
										pnotify_addclass: 'stack-bottomright',
										pnotify_history: false,
										pnotify_stack: false,//bottom_right
										pnotify_delay: $.naxx.anotify_timeout,
										pnotify_after_close: function(){
											$.naxx.loader = null;
										}
									});
								}
								else 
								{
									$.naxx.loader = $.naxx.loader.pnotify({
										pnotify_title: '<span symbol="text:server_error">Server error</span>',
										pnotify_type: 'error',
										pnotify_text: '<span symbol="text:server_is_down_now">Internal server error.</span>',
										pnotify_addclass: 'stack-bottomright',
										pnotify_history: false,
										pnotify_stack: false,//bottom_right
										pnotify_delay: $.naxx.anotify_timeout,
										pnotify_after_close: function(){
											$.naxx.loader = null;
										}
									});
								}
							}
						);
					});

				$('#button').removeClass('ui-corner-all').addClass('ui-corner-left').focus(function(){
					$('#entry_list').hide();
					$(this).unbind('keydown').bind('keydown', function(evt){
						switch(evt.which)
						{
						case 39: //right
							$('#entry').focus();
							loginmenu.tooltip('show');
							break;
						}
						return true;
					});
				}).blur(function(){
				});
				$.naxx.auto();
				$('#firstfocus').focus();
				$('form').click(function(){$(this).focus();})

				$('#language_selector').vivobutton({text: $.naxx.language[$.naxx.currentlang], type: 'mlt', name: 'language'});
				//$('#language_selector').text('select').button();
				var items = new Array();
				for (var i = 0 ; i < $.naxx.language.length; i++)
				{
					items.push({
							title: $.naxx.language[i],
							customClass: 'jj_menu_language',
							attr: {
								index: i
							},
							action: {
								type: 'fn',
								callback: function(data){
									$.naxx.translate(Number($(data.target).attr('index')));
									$('#language_selector .vivotext').text($.naxx.language[Number($(data.target).attr('index'))]);
									$("div[id^=jjmenu]").remove(); 
								}
							}
						});
				}
				$('#language_selector').jjmenu(
					'both',
					items,
					{},
					{show:"fadeIn", xposition:"left", yposition:"top", "orientation":"auto", offset: [0, 0]}
				);
			}
		}
	});
}(jQuery));
