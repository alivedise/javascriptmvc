steal( 'jquery/controller','jquery/view/ejs','mxui/form/combobox' )
	.then( './views/init.ejs', function($){

/**
 * @class Naxx.Form.Combobox
 */
Mxui.Form.Combobox('Naxx.Form.Combobox',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//naxx/form/combobox/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});
