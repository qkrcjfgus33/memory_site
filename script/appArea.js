jQuery(function(){
	$("#ainmation_state_change").click(function(){
		if(this.value=="Ain OFF"){
			jQuery.fx.off=true;
			this.value="Ain ON";
		}else{
			jQuery.fx.off=false;
			this.value="Ain OFF";
		}
	});
	$("#scroll_up_icon").click(function(){
		$body = $('body, html');
		if(this.value == "▲"){
			$body.animate({scrollTop:0}, $(window).scrollTop()/2,function(){
				$("#scroll_up_icon").val("▲");
			});
			this.value = "■";
		}else{
			$body.stop();
			this.value = "▲";
		}
    });

	/* 성능 개선을 위해 windowEvnet로 옮김.
	$(window).scroll(function(){
		if($(this).scrollTop() == 0)
			$("#scroll_up_icon").prop("disabled",true);
		else
			$("#scroll_up_icon").prop("disabled",false);
	});*/

	$("#all_post_open").click(function(){
		if($.data(this,"opening")){
			 clearInterval($(this).data("opening",false).poshytip('hide').data("interval"));
		}else{
			//arguments.callee을 이용하려 했지만 셀렉터의 값이 초기화 안되고 사용됨.
			var postOpenFn = function(){
				$("#post_list .post_head").not("#post_add").not(".open").not(".unopen").click();
				$("#all_post_open").transition({rotate:"+=90"},500).data("interval",setTimeout(postOpenFn,1000));
			}
			$(this).data("opening",true).poshytip({
				content:"게시물 자동 open 기능이 <br/>실행되었습니다.<br/><br/>기능의 특성상 약간의<br/> 렉이 발생할수 있습니다.",
				showOn: 'none',
				alignTo: 'target',
				alignX: 'right',
				alignY: 'center',
				offsetX: 20,
				timeOnScreen: 3000
			}).poshytip('show');
			postOpenFn();
		}
	}).data("opening",false);

	$("#all_post_close").click(function(){
		if($("#all_post_open").data("opening"))
			clearInterval($("#all_post_open").data("opening",false).data("interval"));
		$("#post_list .open:not(#post_head)").removeClass("open").children("ul").css("display","none");
	});
	/*
	var slidScroll = (function(){
		var pre_srcoll_top;
		return function(e){
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
			
			console.log("slidScroll");
			var temp = $(e.target).scrollTop();
			$(window).off(".slidScroll");
			$(e.target).scrollTop(pre_srcoll_top);//.
			$(window).on("scroll.slidScroll",slidScroll);
			//	animate({scrollTop:temp}, 500);
			pre_srcoll_top = temp;
			
		}
	})();

	$(window).on("scroll.slidScroll",slidScroll);*/

});