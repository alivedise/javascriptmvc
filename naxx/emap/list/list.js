steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/emap.ejs', 
       function($){

/**
 * @class Naxx.Emap.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists emaps and lets you destroy them.
 */
$.Controller('Naxx.Emap.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Emap.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.emap').model().destroy();
		}
	},
	"{Naxx.Models.Emap} destroyed" : function(Emap, ev, emap) {
		emap.elements(this.element).remove();
	},
	"{Naxx.Models.Emap} created" : function(Emap, ev, emap){
		this.element.append(this.view('init', [emap]))
	},
	"{Naxx.Models.Emap} updated" : function(Emap, ev, emap){
		emap.elements(this.element)
		      .html(this.view('emap', emap) );
	}
});

});