jQuery(function(){
	var $header = $("header");
	$("#logo").click(function(){
		location.replace("");
	});
/* 성능개선을 위해 모든 window이벤트는 windowEvent.js로.
	$(window).on("scroll",function(){
		 if( $(window).scrollTop() == 0){
			 $header.clearQueue().stop().animate({top: "0px"},500);
		 } else {
			 $header.clearQueue().stop().animate({top: "-30px"},500);
		 }
	});
	*/
	$header.mouseenter(function(){
		$header.clearQueue().stop().animate({top: "0px"},500);
	}).find("#alarm_field #switch").on("click",function(){
		$("#alarm").slideToggle(500);
	}).end().find("#header_nav #logo").
		hover(function(e){
		e.stopPropagation()
		$(e.target).attr("src","logo_hover.png");
	},function(e){
		e.stopPropagation()
		$(e.target).attr("src","logo.png");
	}).mousedown(function(e){
		e.stopPropagation()
		$(e.target).attr("src","logo_down.png");
	});

	var $profile = $("#profile");
	$profile.on("click",function(){
	}).find("meter").
		on("mouseenter",function(e){
		$(e.target).next("span").clearQueue().stop().fadeTo(300,1);
	}).on("mouseleave",function(e){
		$(e.target).next("span").clearQueue().stop().fadeTo(300,0);
	})

});
