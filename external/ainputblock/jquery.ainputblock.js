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
 * Date: 2011-11-30 14:43:37
 * Author: Alive Kuo (alive.kuo at vivotek.com)
 *
 * Changelog
 *  1.0.2: solve '~' '.' '-' '=' '`' in ff/ie bug
 *  1.0.1: add chinese options
 *  1.0.0: Commit to SVN.
 *
 */

jQuery.fn.ainputblock =
function(params)
{
	function regInput(obj, reg, inputStr)
	{
		return reg.test(inputStr);
	}

	var options = {
		version: '1.0.2',
		alphabet: true,
		numeric: true,
		chinese: false,
		symbols: [],
		a: [],
		'.': false
	}
	var op = jQuery.extend(options, params);
	var regString = (op.alphabet ? 'a-zA-Z' : '') + (op.numeric ? '0-9' : '') + (op.chinese ? '\u4E00-\u9FA5' : '');
	$.each(op.symbols, function(index, key){
		if (key == '.' || key == '\.') op['.'] = true;
		op.a.push(key.charCodeAt(0))
		regString += '\\'+key;
	});
    return this.each(function()
    {
		$(this).bind("paste", function(e)
		{
			if($.browser.msie) return regInput(this, new RegExp('^['+regString+']*$'), window.clipboardData.getData('Text'));
			else //Firefox... hacking dom
			{
				var $oldval = $(this).val();
				$input = $(this);
				setTimeout(function(){
					if (! regInput($input,new RegExp('^['+regString+']*$'),  $input.val())) 
						$input.val($oldval);
				}, 1);
			}
		});
		$(this).bind("drop", function(e)
		{
			return regInput(this, new RegExp('^['+regString+']*$'), $.browser.msie ? window.event.dataTransfer.getData('text') : e.originalEvent.dataTransfer.getData('text/plain'));
		});
		$(this).bind("keypress", function(e)
		{
            var key = e.charCode || e.keyCode || e.which || 0;
			if (key == 0) return true;
			return (
                key == 8 || //backspace 
                key == 9 || //tab 
                key == 46 || //delete
				op.a.indexOf(key) >= 0 ||
				(key == 190 && op['.']) ||
                //(key >= 37 && key <= 40) || //arrows
				regInput(this, new RegExp('^['+regString+']*$'), String.fromCharCode(key))
			);
		});
/*        $(this).bind("keydown", function(e)
        {
            var key = e.charCode || e.keyCode || e.which || 0;
            // allow backspace, tab, delete, arrows, letters, numbers and keypad numbers ONLY
            return (
                key == 8 || //backspace 
                key == 9 || //tab 
                key == 46 || //delete
                key == 16 || //shift
				op.a.indexOf(key) >= 0 ||
				(key == 190 && op['.']) ||
                (key >= 37 && key <= 40) || //arrows
				regInput(this, new RegExp('^['+regString+']*$'), String.fromCharCode(key))
			);
		});*/
	});
};
