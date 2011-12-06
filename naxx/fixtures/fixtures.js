// map fixtures for this application

steal("jquery/dom/fixture", function(){
	
	$.fixture.make("encoder", 5, function(i, encoder){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "encoder "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("volume", 5, function(i, volume){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "volume "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("disk", 5, function(i, disk){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "disk "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("user", 5, function(i, user){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "user "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("tcpip", 5, function(i, tcpip){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "tcpip "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("protocol", 5, function(i, protocol){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "protocol "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("iptable", 5, function(i, iptable){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "iptable "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("ddn_service", 5, function(i, ddn_service){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "ddn_service "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("profile", 5, function(i, profile){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "profile "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("schedule", 5, function(i, schedule){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "schedule "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("alarm", 5, function(i, alarm){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "alarm "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("alarm_data", 5, function(i, alarm_data){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "alarm_data "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("bookmark", 5, function(i, bookmark){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "bookmark "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("recording", 5, function(i, recording){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "recording "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("log", 5, function(i, log){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "log "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("log", 5, function(i, log){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "log "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("system_log", 5, function(i, system_log){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "system_log "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("camera_log", 5, function(i, camera_log){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "camera_log "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("user_log", 5, function(i, user_log){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "user_log "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("vision", 5, function(i, vision){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "vision "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
	$.fixture.make("emap", 5, function(i, emap){
		var descriptions = ["grill fish", "make ice", "cut onions"]
		return {
			name: "emap "+i,
			description: $.fixture.rand( descriptions , 1)[0]
		}
	})
})