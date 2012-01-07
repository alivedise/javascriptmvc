steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

/**
 *
 * @class Naxx.Translate
 *  
 * Copyright (c) 2011 Vivotek Inc. All rights reserved.
 *
 * Date: 2012-01-07 10:08:31
 * Author: Alive Kuo (alive.kuo at vivotek.com, alegnadise at gmail.com)
 *
 */
$.Controller('Naxx.Translate',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//naxx/translate/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});
