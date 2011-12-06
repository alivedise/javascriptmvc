steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/encoder.ejs', 
       function($){

/**
 * @class Naxx.Encoder.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists encoders and lets you destroy them.
 */
$.Controller('Naxx.Encoder.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Encoder.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.encoder').model().destroy();
		}
	},
	"{Naxx.Models.Encoder} destroyed" : function(Encoder, ev, encoder) {
		encoder.elements(this.element).remove();
	},
	"{Naxx.Models.Encoder} created" : function(Encoder, ev, encoder){
		this.element.append(this.view('init', [encoder]))
	},
	"{Naxx.Models.Encoder} updated" : function(Encoder, ev, encoder){
		encoder.elements(this.element)
		      .html(this.view('encoder', encoder) );
	}
});

});