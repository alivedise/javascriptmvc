steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/accesslist.ejs', 
       function($){

/**
 * @class Naxx.Accesslist.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists accesslists and lets you destroy them.
 */
$.Controller('Naxx.Accesslist.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Accesslist.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.accesslist').model().destroy();
		}
	},
	"{Naxx.Models.Accesslist} destroyed" : function(Accesslist, ev, accesslist) {
		accesslist.elements(this.element).remove();
	},
	"{Naxx.Models.Accesslist} created" : function(Accesslist, ev, accesslist){
		this.element.append(this.view('init', [accesslist]))
	},
	"{Naxx.Models.Accesslist} updated" : function(Accesslist, ev, accesslist){
		accesslist.elements(this.element)
		      .html(this.view('accesslist', accesslist) );
	}
});

});