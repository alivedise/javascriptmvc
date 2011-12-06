steal('jquery/model', function(){

/**
 * @class Naxx.Models.Bookmark
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend bookmark services.  
 */
$.Model('Naxx.Models.Bookmark',
/* @Static */
{
	findAll: "/bookmarks.json",
  	findOne : "/bookmarks/{id}.json", 
  	create : "/bookmarks.json",
 	update : "/bookmarks/{id}.json",
  	destroy : "/bookmarks/{id}.json"
},
/* @Prototype */
{});

})