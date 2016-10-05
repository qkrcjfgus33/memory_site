jQuery(function(){
	var $window = $(window),
		$header = $("header");
	$.loadPopup("postView.htm");
	
    $window.on("beforeunload", function(){
        if(checkUnload("#post_add")) return "이 페이지를 벗어나면 작성중인 내용은 저장되지 않는당께.\n가지마랑께ㅠㅠ";
    }).on("scroll",function(){
		//headerAnimation.js
		 if( $window.scrollTop() == 0){
			 $header.clearQueue().stop().animate({top: "0px"},500);
		 } else {
			 $header.clearQueue().stop().animate({top: "-30px"},500);
		 }

		 //divisionMenu.js
		 setPostData();

		 //appArea.js
		 if($(this).scrollTop() == 0)
			$("#scroll_up_icon").prop("disabled",true);
		 else
			$("#scroll_up_icon").prop("disabled",false);
	});
});