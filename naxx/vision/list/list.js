steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/vision.ejs', 
       function($){

/**
 * @class Naxx.Vision.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists visions and lets you destroy them.
 */
$.Controller('Naxx.Vision.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Vision.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.vision').model().destroy();
		}
	},
	"{Naxx.Models.Vision} destroyed" : function(Vision, ev, vision) {
		vision.elements(this.element).remove();
	},
	"{Naxx.Models.Vision} created" : function(Vision, ev, vision){
		this.element.append(this.view('init', [vision]))
	},
	"{Naxx.Models.Vision} updated" : function(Vision, ev, vision){
		vision.elements(this.element)
		      .html(this.view('vision', vision) );
	}
});

});