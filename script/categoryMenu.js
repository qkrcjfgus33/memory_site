jQuery(function(){

	var fadeToggle = new Array();

	$.getJSON("./php/categoryMenuGet.php",'',function(data,status) {//divisionMenu를 ajax로 데이터를 불어와 만드는 함수
		if(status != "success"){
			miniPopup("html","서버와의 상태가 좋지 않습니다.","head_alarm",3000,$("#cancel").offset().top,parseInt($("#cancel").offset().left)+100);
			return 0;
		} else {
			//카테고리 목록을 html에.
			var _ele,
				data_length = data.length;
			for(var i = 0  ; i < data_length ; i++){
				_ele = data[i];
				$('<a>'+_ele.name+'</a>').
					data("category_index",_ele.index).
					appendTo("#category_menu");
			}
			
			//#category_menu a의 click이벤트 함수를 위한 현제위치저장 부분.
			$("#category_menu").find("a").each(function(){
				var $this = $(this);
				$.data(this,{
					"offset":$this.offset(),
					"marginTop":$this.css("marginTop")
				});
			}).each(function(){
				//#category_menu a의 click이벤트 함수를 위한 위치fixed화 부분.
				var $this = $(this);
				$(this).css({
					position:"fixed",
					top:$.data(this,"offset").top,
					left:$.data(this,"offset").left,
					marginTop:0,
					marginBottom:0
				});
			});
			//첫번째 메뉴의 위치를 저장.(이후 카테고리 메뉴 클릭시 이 위치로 클릭된 카테고리가 이동해야 하기 때문.)
			first_offset = $("#category_menu a:first-child").offset();
		}
	});
	var first_offset;
	

	$("#category_menu").on("click","a",function(e){
		
		var $category_menu = $("#category_menu"),
			$category_menu_find_a = $category_menu.find("a")

		//이미 다른 카테고리가 애니메이션중(클릭)이라면 종료
		if($category_menu.data("animationing")=="ture"){
			return
		}
		//애니메이션 중지.
		$category_menu.data("animationing","ture").
			clearQueue().stop().
			find("a").clearQueue().stop();
		fadeToggle=undefined;

		console.log("categoryClick");
		e.stopPropagation();
		

		
		//이전에 존재하는 게시물들을 비운다.
		$("#post_add").nextAll(".post_head").detach();
		//이미 열려있는 메뉴가 있으면 삭제하는 애니메이션
		var menu_hide_delay = 0;
		$(".division_menu").each(function(){
			$(this).clearQueue().stop().delay(menu_hide_delay).animate({left:"-120%"},500,"easeOutQuint",function(){
				$(this).detach();
			});
			menu_hide_delay+=100;
		});

		var target = e.target,
			$target = $(target);
			
		//클릭된 카테고리가 이미 열러져 있을시 카테고리를 복구하고 종료.
		if($.data(target,"category_index") == CATEGORY_CHOSE){
			//처음 로딩됬을때 저장된 위치로.
			var _temp_offset = $.data(target,"offset");
			$target.animate({
				top:_temp_offset.top,
				left:_temp_offset.left
			},900,"easeOutQuint",function(){$category_menu.data("animationing","false")});
			//나머지 숨겨져있던 카테고리 복귀.
			var category_show_delay=0;
			$category_menu_find_a.not($target).each(function(){
				var $this = $(this),
					this_offset = $.data(this,"offset");
				$this.delay(category_show_delay).animate({
					top:this_offset.top,
					left:this_offset.left
				},900,"easeOutQuint");
				category_show_delay+=100;
			})
			CATEGORY_CHOSE=null;
			fadeToggle=new Array();
			return;//함수종료
		}

		//열려진(클릭된) 카테고리 인덱스 저장.
		CATEGORY_CHOSE = $.data(target,"category_index");

		//클릭된 카테고리 위로 이동 및 나머지 카테고리 사라짐.
		$target.animate({opacity: 1,top:first_offset.top,left:first_offset.left},700,"easeOutQuint",function(){$("#category_menu").data("animationing","false")});
		var category_hide_delay=0;
		$category_menu_find_a.not($target).reverse().each(function(){
			var $this = $(this),
				this_width_border = $this.width();//+parseFloat($this.css("borderWidth"),10)*2;
			$this.delay(category_hide_delay).animate({
				'left':this_width_border*(-1)-20
			},500,"easeOutQuint");
			category_hide_delay+=100;
		});
		/*이 부분까지 data("animationing")값은 초기화 완료*/
		var category_show_delay=0;
		//저장된 메뉴 데이터가 존재할시.
		if($.hasData($target,"division_menu")){
			//html에 추가.
			category_show_delay=0;
			$("#division_menu_area").prepend($.data(target,"division_menu")).
				children(".division_menu").reverse().each(function(){//애니메이션 처리로 메뉴가 보이도록.
				$(this).delay(category_show_delay).animate({left:"-30%"},500,"easeOutQuint");
				category_show_delay+=100;
			}).find(".chose").each(function(){DivisionMenuClickFn(this)});//클릭되있는 메뉴의 게시물목록을 다시 불러온다.
		}else{
			$.data(target,"division_menu","")
		}

		$.getJSON("./php/divisionMenuGet.php",{"part_index":CATEGORY_CHOSE},function(data,status) {//divisionMenu를 ajax로 데이터를 불어와 만드는 함수
			if(status != "success"){
				miniPopup("html","서버와의 상태가 좋지 않습니다.","head_alarm",3000,$("#cancel").offset().top,parseInt($("#cancel").offset().left)+100);
				$category_menu.data("animationing","false");
				fadeToggle=new Array();
				return 0;
			} else {
				var division_menu_html = "", //메뉴목록으로 삽입될 html
					ele, //for문에서 사용되는 변수
					data_length = data.length;

				//변경된 사항이 있는지 체크용 변수.
				var change = false;
				//서버에서 가져온 data를 순환하며 변경사항이 있는지 검사 및 변경한다.
				for(var i=0 ; i<data_length ; i++){
					ele = data[i];
					//이미 존재하는 데이터시 continue
					if($($(e.target).data("division_menu")).find("a").is("a[name="+ele.index+"]")) continue;
					
					//메뉴 jQueryDOM 생성.
					var menu_dom = $(DIVISION_MENU_JQUERY).clone().find("a").
						data("menu_index",ele.index).
						attr("name",ele.index).
						text(ele.name).
						end().detach();
					
					if(MODESTATE=="post_add")
						$(menu_dom).find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5));

					//데이터에 새로운 메뉴값 추가.
					$(e.target).data("division_menu",$($(e.target).data("division_menu")).add(menu_dom));
					
					change=true;
				}
				if(!(change)){
					fadeToggle=new Array();
					return;//변경된 사항이 없을시 함수 종료.
				}
				// html에 추가 및 기존 dom이 이동
				$($(e.target).data("division_menu")).appendTo("#division_menu_area");
				
				//애니메이션 처리로 메뉴가 보이도록.
				category_show_delay=0;
				$("#division_menu_area").children(".division_menu").
					reverse().each(function(){
					$(this).delay(category_show_delay).animate({left:"-30%"},500,"easeOutQuint");
					category_show_delay+=100;
				});
			}
		});
		fadeToggle=new Array();
		return;
	}).on("mouseenter","a",function(e){//fadeToggle 함수를 담고있는 이 배열이 핵심이다. 이 배열을 mouselevae이벤트에서 초기화 시킴으로써 mouseenter이벤트에서 선언된 무한재귀함수가 종료되는 조건이 된다.
		if(jQuery.fx.off || fadeToggle==undefined)
			return;
		e.stopPropagation();
		var n = $(e.target).attr("name");

		fadeToggle=new Array();
		if($("#category_menu").data("animationing")=="true")
			return;
		fadeToggle[n] = function(){
			$(e.target).animate({opacity: 1},'slow','easeInOutQuad').
			animate({opacity: 0.8},'slow','easeInOutQuad',function(){
				try{fadeToggle[n]()}catch (e){console.log(e.message)}
			});
		}
		try{fadeToggle[n]()}catch (e){console.log(e.message)}
	}).on("mouseleave","a",function(e){
		if(jQuery.fx.off || fadeToggle==undefined)
			return;
		e.stopPropagation();

		fadeToggle=new Array();
		if($("#category_menu").data("animationing")=="true")
			return;
		if(CATEGORY_CHOSE !=null && $(e.target).data("category_index") == CATEGORY_CHOSE)
			$(e.target).animate({opacity: 1},'fast','easeInOutQuad');
		else
			$(e.target).animate({opacity: 0.6},'fast','easeInOutQuad');
	}).data("animationing","false");
	
});