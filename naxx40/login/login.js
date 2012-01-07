steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

/**
 * @class Naxx40.Login
 */
$.Controller('Naxx40.Login',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//naxx40/login/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});