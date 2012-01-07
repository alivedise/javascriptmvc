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
 * Date: 2010-10-21 13:58:59
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 */


$(document).ready(function() {

	$.ajaxSetup({ cache: false, timeout: 20000 });  
/*	$('body').ajaxSend(function(evt, request, settings) { 
		$(this).addClass('waitingCGI');
		if(settings.url.search('fcgi-bin') >= 0 || (typeof(settings.dataType) != 'undefined' && settings.dataType == 'json'))
		{
			console.log('NAXX.Log> TIME('+new Date(evt.timeStamp)+')\n\tSending Request>>['+settings.url+']');
			if(typeof settings.data != 'undefined') console.log('\t'+settings.data);
		}
	});  
	$('body').ajaxComplete(function(evt, request, settings) { 
		$(this).removeClass('waitingCGI');
		console.log('NAXX.Log> TIME('+new Date(evt.timeStamp)+')\n\tRecieved Response<<['+settings.url+']');
		if(settings.url.search('fcgi-bin') >= 0 && settings.url.lastIndexOf("log") == 3)
		{
			console.log('\t status = '+request.status+', response = Server-side log found, pass.');
		}
		else if(settings.url.search('fcgi-bin') >= 0 || (typeof(settings.dataType) != 'undefined' && settings.dataType == 'json'))
			console.log('\t status = '+request.status+', response = '+request.responseText);
		});  */

	if (!$.naxx.xml)
	{
		$.ajax({
			url: 'translator.xml',
			dataType: 'xml',
			success: function(xml){
				$.naxx.xml = xml;
				initPage();
			}
		});
	}
});


function initPage(){
		$.naxx.auto();
		$.naxx.teleport.Login('', 
			function(ret){
				if(ret.username == '')
				{
					$.naxx.loginUI();
				}
				else
				{
					$.extend($.naxx.acl, ret);
					if($.cookie('mode'))
						$('body').alayout({mode: $.cookie('mode')});
					else
						$('body').alayout();
				}
			},
			function(xhr){
				$.naxx.loginUI();
			}
		);
}


