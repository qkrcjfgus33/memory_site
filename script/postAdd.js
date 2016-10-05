jQuery(function(){
	var $post_add = $("#post_add"),
		$new_posting_icon = $("#new_posting_icon"),
		$post_list = $("#post_list");
	//애니메이션을 위한 초기값 저장.
	var hide_css = {
		"position":"fixed",
		"overflow":"hidden",
		"opacity":0,
		"padding":0,
		"height":0,
		"width":0,
		"left":$("#new_posting_icon").offset().left,
		"top":parseFloat($post_add.css("paddingTop"),10)+parseFloat($post_add.offset().top,10) + parseFloat($post_add.height(),10)/2
	};
	var show_css = {
		"opacity":1,
		"position":"fixed",
		"top":$new_posting_icon.offset().top+$new_posting_icon.height()/2,
		"left":"10%",
		"width":"70%",
		"height":$post_add.height(),
		"paddingTop":$post_add.css("paddingTop"),
		"paddingBottom":$post_add.css("paddingBottom"),
		"paddingLeft":$post_add.css("paddingLeft"),
		"paddingRight":0
	}
	
	//초기화
	$post_add.data("open",false).css(hide_css);//처음은 숨김상태로.

	var post_addHide = function(){
		$post_add.data("open",false)
		show_css.height = $post_add.height();
		$post_add.css(show_css).
			css({overflow:"hidden"}).
			animate({"height":0,"paddingTop":0,"paddingBottom":0},300).
			animate(hide_css,400,function(){$(this).hide()});
	}
	var post_addShow = function(){
		$post_add.data("open",true)
		var show_height = show_css.height,
			show_paddingTop = show_css.paddingTop,
			show_paddingBottom = show_css.paddingBottom;
		show_css.height=0;
		show_css.paddingTop=0;
		show_css.paddingBottom=0;
				
		$post_add.find(".title textarea").focus().end().
			css({"overflow":"auto"}).show().
			animate(show_css,200).
			animate({"height":show_height,"paddingTop":show_paddingTop,"paddingBottom":show_paddingBottom},500,"easeOutQuint",function(){	
			delete show_css.height;
			show_css.paddingTop = show_paddingTop;
			show_css.paddingBottom = show_paddingBottom;
			$post_add.removeAttr("style").
				css(show_css);
		});
	}
	$new_posting_icon.on("click",function(e){//게시물 등록공간이외를 클릭시 숨기기
		$new_posting_icon.transition({
			perspective: '100px',
			rotateY: '+=180deg'
		},200)
		if($post_add.data("open")){
			$post_list.off(".post_headHide");
			post_addHide();
			
		}else{
			post_addShow();
			$post_list.on("click.post_headHide",".post_head:not(#post_add)",function(e){
				if($(e.target).closest($post_add)[0] == undefined && (e.target == $post_add[0] || e.target == $new_posting_icon[0]))
					return;
				//e.stopPropagation();
				console.log("hide!!");
				$post_list.off(".post_headHide");
				$new_posting_icon.transition({
					perspective: '100px',
					rotateY: '+=180deg'
				},200)
				post_addHide();
			});
		}
	});

	$("#post_list_box,#division_menu_area").on("click",".new_posting_able_icon",function(e){		
		e.stopPropagation();
		console.log("click.new_posting_able_icon");
		//title값 설정.
		var _send_obj ={
			title:$post_add.children(".title").children("textarea").val()
		};
		var $this = $(this),
			target = e.target,
			$target = $(target);
		if(_send_obj.title.search(/\S/) == -1){
			$new_posting_icon.poshytip({
				className: 'tip-yellowsimple',
				content:"제목을 입력해주세요",
				showOn: 'none',
				alignTo: 'target',
				alignX: 'center',
				offsetX: 0,
				offsetY: 0,
				timeOnScreen: 3000
			}).poshytip('show');
			if(!($post_add.data("open")))
				$new_posting_icon.click();
			return 0;
		}

		//content값 설정.
		var $incode_html = $post_add.find(".incode_html").children("input"),
			$content_dom = $post_add.find(".post_body").children(".content").contents().find("#post_content");
		
		if($incode_html.is(':checked'))
			$incode_html.click();

		var font_size_check = false;
		$content_dom.each(function(){
			if(parseInt($(this).css("fontSize"))>200){
				font_size_check = true;
				$(this).css("fontSize",200);
			}
		});

		_send_obj.content = $content_dom.html();

		if(font_size_check)
			alert("글자크기가 200pt이상인 글자가 존재합니다.\n200pt이상인 글자는 200pt로 맞춰집니다.");
		
		//index, type값 설정.
		var $click_dom;
		if($("#division_menu_area *").is(target)){
			$click_dom = $target.closest(".division_menu").children("a");
			_send_obj.choes_index = $click_dom.data("menu_index");
			_send_obj.type = "post";
		}else{
			$click_dom = $target.closest(".post_head");
			_send_obj.choes_index = $click_dom.data("post_index");
			_send_obj.type = "reply";
		}

		//모드 초기화.
		modeChange(pre_mode);

		$.post("./php/newPosting.php",_send_obj,function(data,status){
			var $title = $post_add.children(".title").children("textarea"),
				$body =  $post_add.find(".content").contents().find("#post_content")
			
			if(status != "success"){
				$('#post_add').poshytip({
					className: 'tip-yellowsimple',
					content:"서버와의 상태가 좋지 않습니다.",
					showOn: 'none',
					alignTo: 'target',
					alignX: 'center',
					offsetX: 0,
					offsetY: 5,
					timeOnScreen: 2000
				}).poshytip('show');
				modeChange("post_add");
			}else if(data == "noLogin"){
				$("header").clearQueue().stop().animate({top: "0px"},500).
					find("#id").focus();
				$('#login').poshytip({
					content:"로그인이 필요합니다.",
					showOn: 'none',
					alignTo: 'target',
					alignX: 'inner-right',
					alignY: 'bottom',
					offsetX: 0,
					offsetY: 0,
					timeOnScreen: 2000
				}).poshytip('show');
				modeChange("post_add");
			}else if(data == "upload_false"){
				$('#post_add').poshytip({
					className: 'tip-yellowsimple',
					content:"일시적 오류 발생, 나중에 다시 시도해주세요.",
					showOn: 'none',
					alignTo: 'target',
					alignX: 'center',
					offsetX: 0,
					offsetY: 0,
					timeOnScreen: 2000
				}).poshytip('show');
				modeChange("post_add");
			}else if(data == "true"){
				$click_dom.poshytip({
					className: 'tip-yellowsimple',
					content:"게시물이 등록되었습니다.",
					showOn: 'none',
					alignTo: 'target',
					alignX: 'center',
					offsetX: 0,
					offsetY: 5,
					timeOnScreen: 2000
				}).poshytip('show');

				if($post_add.data("open"))
					$new_posting_icon.click();

				$title.val('').removeAttr("style");
				$post_add.children("ul").slideUp().find(".content").height(100);
				$body.html('');
				
				animationStopToggle();
				var temp_scroll_top = $(window).scrollTop();
			
				if(_send_obj.type=="post"){
					if($click_dom.closest(".division_menu").data("chose")){
						$click_dom.closest(".division_menu").click().click();
					}
				}else{
					
					if($click_dom.hasClass("open")){
						$click_dom.children(".title").click().click();
					}
	
					var $parent_post = $click_dom;
					while($parent_post.closest("ul").closest(".post_head")[0] !=undefined){
						$parent_post = $parent_post.closest("ul").closest(".post_head");
						$parent_post.addClass("not_load").click().click();
					}

					$click_dom.addClass("not_load");
					$("#division_menu_area .chose a[name="+$parent_post.data("menu_index")+"]").closest(".division_menu").click().click();
				}
				setTimeout(animationStopToggle, 1000);
				$(window).scrollTop(temp_scroll_top);
			}else{
				miniPopup("#post_add","원인을 알수없는 오류 발생. 철에게 문의 바랍니다.");
				modeChange("post_add");
			}
			$title.add($body).change();
		});

	}).on("mouseenter",".new_posting_able_icon",function(e){
		console.log("mouseenter");
		$(e.currentTarget).fadeTo(200,1);
	}).on("mouseleave",".new_posting_able_icon",function(e){
		$(e.currentTarget).fadeTo(200,0.5);
	});

});