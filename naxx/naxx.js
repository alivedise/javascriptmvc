steal(
	'./naxx.css', 			// application CSS file
	'./models/models.js',		// steals all your models
	'./fixtures/fixtures.js',	// sets up fixtures for your models
	'naxx/encoder/create',
	'naxx/encoder/list',
	'naxx/volume/create',
	'naxx/volume/list',
	'naxx/disk/create',
	'naxx/disk/list',
	'naxx/user/create',
	'naxx/user/list',
	'naxx/tcpip/create',
	'naxx/tcpip/list',
	'naxx/protocol/create',
	'naxx/protocol/list',
	'naxx/iptable/create',
	'naxx/iptable/list',
	'naxx/ddn_service/create',
	'naxx/ddn_service/list',
	'naxx/profile/create',
	'naxx/profile/list',
	'naxx/schedule/create',
	'naxx/schedule/list',
	'naxx/alarm/create',
	'naxx/alarm/list',
	'naxx/alarm_data/create',
	'naxx/alarm_data/list',
	'naxx/bookmark/create',
	'naxx/bookmark/list',
	'naxx/recording/create',
	'naxx/recording/list',
	'naxx/log/create',
	'naxx/log/list',
	'naxx/system_log/create',
	'naxx/system_log/list',
	'naxx/camera_log/create',
	'naxx/camera_log/list',
	'naxx/user_log/create',
	'naxx/user_log/list',
	'naxx/vision/create',
	'naxx/vision/list',
	'naxx/emap/create',
	'naxx/emap/list',
	function(){					// configure your application
		
		$('#encoders').naxx_encoder_list();
		$('#create').naxx_encoder_create();
	$('#volumes').naxx_volume_list();
		$('#create').naxx_volume_create();
	$('#disks').naxx_disk_list();
		$('#create').naxx_disk_create();
	$('#users').naxx_user_list();
		$('#create').naxx_user_create();
	$('#tcpips').naxx_tcpip_list();
		$('#create').naxx_tcpip_create();
	$('#protocols').naxx_protocol_list();
		$('#create').naxx_protocol_create();
	$('#iptables').naxx_iptable_list();
		$('#create').naxx_iptable_create();
	$('#ddn_services').naxx_ddn_service_list();
		$('#create').naxx_ddn_service_create();
	$('#profiles').naxx_profile_list();
		$('#create').naxx_profile_create();
	$('#schedules').naxx_schedule_list();
		$('#create').naxx_schedule_create();
	$('#alarms').naxx_alarm_list();
		$('#create').naxx_alarm_create();
	$('#alarm_datas').naxx_alarm_data_list();
		$('#create').naxx_alarm_data_create();
	$('#bookmarks').naxx_bookmark_list();
		$('#create').naxx_bookmark_create();
	$('#recordings').naxx_recording_list();
		$('#create').naxx_recording_create();
	$('#logs').naxx_log_list();
		$('#create').naxx_log_create();
	$('#system_logs').naxx_system_log_list();
		$('#create').naxx_system_log_create();
	$('#camera_logs').naxx_camera_log_list();
		$('#create').naxx_camera_log_create();
	$('#user_logs').naxx_user_log_list();
		$('#create').naxx_user_log_create();
	$('#visions').naxx_vision_list();
		$('#create').naxx_vision_create();
	$('#emaps').naxx_emap_list();
		$('#create').naxx_emap_create();
})
