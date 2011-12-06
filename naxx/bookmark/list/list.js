steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/bookmark.ejs', 
       function($){

/**
 * @class Naxx.Bookmark.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists bookmarks and lets you destroy them.
 */
$.Controller('Naxx.Bookmark.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Bookmark.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.bookmark').model().destroy();
		}
	},
	"{Naxx.Models.Bookmark} destroyed" : function(Bookmark, ev, bookmark) {
		bookmark.elements(this.element).remove();
	},
	"{Naxx.Models.Bookmark} created" : function(Bookmark, ev, bookmark){
		this.element.append(this.view('init', [bookmark]))
	},
	"{Naxx.Models.Bookmark} updated" : function(Bookmark, ev, bookmark){
		bookmark.elements(this.element)
		      .html(this.view('bookmark', bookmark) );
	}
});

});