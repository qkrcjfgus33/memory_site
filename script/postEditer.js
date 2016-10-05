jQuery(function(){
	/* 이 안의 경우에 따라 이벤트 함수를 바꾸는것으로 처리하면 될것같다.
		//브라우져 지원여부 및 현재 이용 가능여부 확인
		var supported = true;
		try{
			supported = post_doc.queryCommandSupported(_css_val);
			supported = post_doc.queryCommandEnabled(_css_val);
		}
		catch(e){//지원, 이용 불가능할시
		}
		
		if(supported == false){//지원, 이용 불가능할시
		}
	*/

	var font_design_edit = new Array(),
		justify_edit = new Array(),
		font_name_edit = new Array();
	$("#post_add .font-design input").each(function(){
		font_design_edit.push($(this).attr("value"));
	});
	$("#post_add .justify option").each(function(){
		justify_edit.push($(this).attr("value"));
	});
	$("#post_add .FontName option").each(function(){
		font_name_edit.push($(this).attr("value"));
	});


	var _getSelect = function(content, _edit_post, selection){
		var content_range = $(content)[0].contentDocument.createRange(),
			change_ranges = new Array(),//태그에 따라 나눠진 선택 범위 모음(반환값)
			selection_range = selection.cloneRange();

		var clone_r,clone_s;
		$(_edit_post).find("*:not(br)").each(function(){
			clone_r = content_range.cloneRange();
			clone_r.selectNodeContents(this);
			//<시작점> ... <*> ... <끝점> ... </*>의 경우
			if( selection_range.compareBoundaryPoints(0, clone_r)==-1 && selection_range.compareBoundaryPoints(1, clone_r)==1 && selection_range.compareBoundaryPoints(2, clone_r)==-1){
				
				clone_s = selection_range.cloneRange();
				//최종목표 : clone_s = <시작점> ... <끝점><*>...</*>
				clone_s.setEndBefore(this);
				change_ranges.push(clone_s.cloneRange());
				
				clone_s = selection_range.cloneRange();
				//최종목표 : clone_s = <*><span>...</span>...</*>
				clone_s.setStart(this,0);
				change_ranges.push(clone_s.cloneRange());
			
			//<*> ... <시작점> ... </*> ... <끝점>의 경우
			}else if( selection_range.compareBoundaryPoints(0, clone_r)==1 && selection_range.compareBoundaryPoints(3, clone_r)==-1 && selection_range.compareBoundaryPoints(2, clone_r)==1){
				
				clone_s = selection_range.cloneRange();
				//<*> ... <시작점> ... </*> ... <끝점>
				//최종목표: clone_s = <*>...</*><시작점> ... <끝점>
				clone_s.setStartAfter(this);
				change_ranges.push(clone_s.cloneRange());
				
				clone_s = selection_range.cloneRange();
				//<*> ... <시작점> ... </*> ... <끝점>
				//최종 목표: <*> ... <시작점>...<끝점></*>
				clone_s = selection_range.cloneRange();
				/*끝점 맞추기*/
				//<*> ... <시작점> ... </*> ... <끝점>
				var _temp_span  = document.createElement("span");
				clone_s.insertNode(_temp_span);
				//<*> ...<시작점><span id="_temp_aoeDf_nos_sfeevcc"></span>... </*>... <끝점>
				clone_s.selectNodeContents(this);
				//<*><시작점> ...<span id="_temp_aoeDf_nos_sfeevcc"></span>... <끝점></*>...
				/*끝점 맞추기 끝. 시작점 맞추기*/
				clone_s.setStartAfter(_temp_span);
				//<*> ...<span id="_temp_aoeDf_nos_sfeevcc"></span><시작점>... <끝점></*>...
				/*시작점 맞추기 끝. 마무리*/
				$(_temp_span).remove();
				/*마무리 끝*/
				change_ranges.push(clone_s.cloneRange());
			//<시작점> ... <*> ...</*>...<끝점>의 경우 (복잡하게 얽힌경우를위해 안쪽 태그에 적용하는 스타일 태그를 넣어야한다.
			}else if(selection_range.compareBoundaryPoints(0, clone_r)==-1 && selection_range.compareBoundaryPoints(2, clone_r)==1){
				clone_s = selection_range.cloneRange();
				//<시작점> ... <*> ...</*>...<끝점>
				//최종목표 : clone_s = <시작점> ...<*><시작점> ... <끝점></*> ... <끝점>
				//<시작점> ... <*> ...</*>...<끝점>
				change_ranges.push(clone_s.cloneRange());

				clone_s.selectNodeContents(this);
				//...<*><시작점> ... <끝점></*> ...
				change_ranges.push(clone_s.cloneRange());
			}
		});
		if(change_ranges.length == 0 )
			change_ranges.push(selection_range.cloneRange());

		selection_range.detach();

		return change_ranges;
	}

	//change이벤트 실행 직전(mousedown이벤트에서) 선택영역을 저장하는 전역변수.
	//IE에서는 mousedown으로 에디터 기능을 선택하면 선택영역이 해제되기에 선택영역을 저장해야한다.
	var pre_selection_range;

	/*
		style값을 편집가능한 함수. 
		content = iframe의 DOM
		_css_type = css 타입
		_css_val = css 값
		tage_name = 선택값으로 기본값은 span이다.
	*/
	var style_change = function(content,_css_type,_css_val,tag_name){

		/*
			post_selection = Selection객체
			selection_range = 선택영역 범위(복사본)
			_edit_post = 글 작성 공간. DOM
			content_range = 글 작성공간안의 Range객체
			clone_r = 글 작성공간 안의 Range객체 (복사본)
			pre_edit = 바로 전에 이 함수에서 편집된 범위(._temp_edit_check) 바로 전에 편집된 범위와 같을시 새로운 노드를 생성할 필요없이 이곳의 style를 변경하면 된다.

		*/
		var post_selection = $(content)[0].contentWindow.getSelection(),
			selection_range = post_selection.getRangeAt(0).cloneRange(),
			_edit_post = $(content).contents().find("#post_content"),//
			content_range = $(content)[0].contentDocument.createRange(),
			clone_r = content_range.cloneRange(),
			pre_edit = $(_edit_post).find("._temp_edit_check");
		if( $(content).data("pre_range") !=undefined && pre_edit[0] !=undefined ){
			clone_r = $(content).data("pre_range");
			//바로 전 편집범위와 현제 편집범위가 같을시. 
			if( selection_range.compareBoundaryPoints(0, clone_r)==0 && selection_range.compareBoundaryPoints(2, clone_r)==0){
				//스타일을 수정하고 종료
				$(pre_edit).css(_css_type,_css_val);
				$(_edit_post)[0].normalize();
				return;
			}
			else//다를시 이전 편집범위가 기록된 _temp_edit_check클래스 삭제.
				$(pre_edit).removeClass("_temp_edit_check");
		}
		//이번 편집범위를 저장하여 이후 편집에 활용되도록 한다.
		$(content).data("pre_range",selection_range.cloneRange());

		//범위를 구한다.
		var change_ranges = _getSelect(content, _edit_post, selection_range);//스타일을 편집할 범위 모음

		//tag_name이 안정해져있을시 기본값인 span으로.
		if(tag_name==undefined)
			tag_name = "span";
		
		var _key;//범위를 돌아가며 tag_name의 값으로 태그로 둘러싼다.
		for(_key in change_ranges){
			var span_el = document.createElement(tag_name);//스타일 지정을 위한 span 엘리먼트

			//이후 편집을 위한 클래스 등록.
			span_el.setAttribute("class","_temp_edit_check");
			
			try{
				change_ranges[_key].surroundContents(span_el);//편집위치(엔터를 친 위치)에 스타일링된 span태그를 넣는다.
			}catch(e){
				continue;
			}finally{
				change_ranges[_key].detach();
			}

		}
		//스타일 편집.
		$(_edit_post).find("._temp_edit_check").css(_css_type,_css_val);
		//정리.
		$(_edit_post)[0].normalize();
	}
	$(".incode_html").on("click",function(e){
		if($(e.target).attr('type') != "checkbox")
			return;
		var content = $(e.target).closest(".post_head").children("ul").children(".post_body").children(".content"),
			_edit_post = $(content).contents().find("#post_content");
		if($(e.target).is(':checked')){
			$(".post_editer span *").attr("disabled",true);
			$(_edit_post).text($(_edit_post).html());
		}else{
			$(_edit_post).html($(_edit_post).text());
			$(".post_editer span *").attr("disabled",false);
		}
	});
	$(".post_editer *").on("change",function(e){
		console.log("change");
		e.stopPropagation();

		//선택된 텍스트 range
		var content = $(e.target).closest(".post_head").children("ul").children(".post_body").children(".content"),
			post_win = $(content)[0].contentWindow,
			post_doc = post_win.document,
			edit_selection = post_win.getSelection(),
			_css_type = $(e.target).closest("span").attr("class"),
			_css_val = $(e.target).val();

		//edit공간을 클릭전 선택된 텍스트 영역을 다시 선택한다. ie9에서는 iframe안의 텍스트를 선택후 다른곳을 선택시 그 선택이 없어지기 때문에 다시 선택할 필요가 있다.
		edit_selection.addRange(pre_selection_range);

		switch(_css_type){
			case "font-size"	:	style_change(content,_css_type,_css_val+"px");
									return;
									break;
			case "ForeColor"	:	tag_name = _css_val;
									break;
			case "font-design"	:	;
			case "justify"		:	_css_type = _css_val;
		}

		
		//선택영역이 없을시
		if( edit_selection.rangeCount == 0 ){
		}
		$(content).contents().find("#post_content").blur();
		
		post_doc.execCommand(_css_type,false,_css_val);
		$(content).contents().find("#post_content")[0].normalize();
		
		$(content).contents().find("#post_content").focus();
	}).on("mousedown",function(e){
		e.stopPropagation();
		//change이벤트가 실행되기전 선택된 영역을 전역변수에 저장한다.
		var content = $(e.target).closest(".post_head").children("ul").children(".post_body").children(".content"),
			post_selection = $(content)[0].contentWindow.getSelection();
		pre_selection_range = post_selection.getRangeAt(0).cloneRange();
		
		console.log("down");
	});
	/*
	$(".font-size").mouseover(function(e){
		$(e.target).focus();
	});
	*/
/*
	var enterSetBrtag = function(e){
		$
		if(e.which == 13 )
	}
*/
	
	/*
		shift+enter로 게시물 등록을 하는 단축키 함수.
		이 함수가 제대로 작동하려면 이 함수를 keydown 이벤트에
		또다른 함수
		if(e.which == 16){
			IsShift=false;
			return;
		}
		를 keyup이벤트에 등록해야한다.
	*/
	var IsShift = false;
	var shiftEnterSubmit = function(e){
		e.stopPropagation();
		if(e.which == 16){
			IsShift=true;
			return true;
		}else if(e.which == 13 && IsShift){
			e.preventDefault();
			$($("#post_add .post_submit")[0]).click();
			return true;
		}
	}
	
	//작성중인 게시물 본문 .content 의 높이를 자동 변경하는 이벤트 함수
	var autoHeightIframe = function(e){
		console.log("autoHeightIframe");
		var scroll_height = $(e.target).height(),
			change_height_dom = e.data.change_height_dom;
			//limt_height = window_height - offset_title.top + $(window).scrollTop()-10; 스크롤바에 자동으로 제한정도가 맞춰지는 기능인데 그냥 제한정도가 정해져있으면 좋겠다는 의견으로 주석처리.
		if($(change_height_dom.target).height()==$(e.target).height())
			return;
		$(change_height_dom.target).height(scroll_height);
	}
	var autoHeight = function(e){
		//console.log("autoHeight");
		var scroll_height = $(e.target).scrollHeight();
		//console.log("scroll_height: "+scroll_height);
			//limt_height = window_height - offset_title.top + $(window).scrollTop()-10; 스크롤바에 자동으로 제한정도가 맞춰지는 기능인데 그냥 제한정도가 정해져있으면 좋겠다는 의견으로 주석처리.
		if(scroll_height==$(e.target).height())
			return;
		$(e.target).height(scroll_height);
	}

	var postAddModeSet = function(e){
		//post_add모드 등록함수.
		if(!(checkUnload("#post_add")) && MODESTATE != "default"){
		//	$(e.target).off(".postAddModeSet").
		//		on("keyup.postAddModeSet",postAddModeSet);
			modeChange("default");//모드 원래대로.
		}else if(MODESTATE != "post_add"){
		//	$(e.target).off(".postAddModeSet").
		//		on("focusout.postAddModeSet",postAddModeSet);
			modeChange("post_add");//게시물 등록 모드
		}
	}


	//iframe의 로드가 끝나고 이벤트함수를 등록한다.
	$("#post_add .post_body .content").load(function(pre_e){
		console.log(".content load");

		/*
			선택영역의 상태를 검사하고 에디터값을 자동으로 바꿔주는 함수.
			post_edit = 에디터공간 DOM
			content = iframe DOM
			post_win = 편집공간 window객체
			post_doc = 편집공간 document객체
			edit_selection = 편집공간 Selection객체
			selection_range = 선택된 영역 Range객체
		*/
		$(this.contentDocument).on("mouseup",function(e){
			var post_head = $(pre_e.target).closest(".post_head"),
				post_edit = $(post_head).children("ul").children(".post_editer")
				content = $(post_head).children("ul").children(".post_body").children(".content"),
				post_win = $(content)[0].contentWindow,
				post_doc = post_win.document,
				edit_selection = post_win.getSelection(),
				selection_range = edit_selection.getRangeAt(0).cloneRange();
				

			if( edit_selection.rangeCount == 0 ){
			}

			//선택 시작부분에 <span></span>을 넣는다.(본래 주석처럼 시작부분에 넣어야 되지만.. 에러로 끝부분에 넣게됨.)
			var get_css = document.createElement("span");
			//selection_range.collapse(true); 이렇게 하면 이상하게 텍스트 선택영역이 끝에까지 늘어난다. 이렇게 안하면 선택영역의 끝부분을 탐지하지만 어쩔수 없으므로 나중에 고쳐보자. insertNode만 써도 마찬가지이다. 
			selection_range.collapse(false);
			selection_range.surroundContents(get_css);
			get_css.setAttribute("id","get_css");

			/*에디터값 수정 부분*/
			//글자크기값 변경
			var font_size = $(get_css).closest("span:not(#get_css)").css("fontSize");
			console.log(font_size);
			if(font_size == undefined)
				font_size = 16;
			console.log(font_size);
			$(post_edit).children(".font-size").children("input").val(parseInt(font_size,10));
			
			$(get_css).remove();
			
			//폰트디자인값 변경
			var _key
			for(_key in font_design_edit){
				if(post_doc.queryCommandState(font_design_edit[_key])){
					$(post_edit).children(".font-design").children("input[value='"+font_design_edit[_key]+"']").attr("checked", true);
				}else{
					$(post_edit).children(".font-design").children("input[value='"+font_design_edit[_key]+"']").attr("checked", false);
				}
			}

			//정렬값 변경
			for(_key in justify_edit){
				if(post_doc.queryCommandValue(justify_edit[_key]) == "true"){
					$(post_edit).children(".justify").children("select").val(justify_edit[_key]);
				}
			}
			
			//폰트값 변경
			if(post_doc.queryCommandValue("FontName") != null){
				var font_name = post_doc.queryCommandValue("FontName").replace(/\"/g,'').replace(/\'/g,'').replace(/\s/g,'');
				for(_key in font_name_edit){
					if(font_name == (font_name_edit[_key]).replace(/\"/g,'').replace(/\'/g,'').replace(/\s/g,'')){
						$(post_edit).children(".FontName").children("select").val(font_name_edit[_key]);
					}
				}
			}

			//글자색깔값 변경
			if(post_doc.queryCommandValue("ForeColor") != 0)
				$(post_edit).children(".ForeColor").children("input").val(rgb2hex(post_doc.queryCommandValue("ForeColor")));

			$(content).contents().find("#post_content")[0].normalize();
			$(content).contents().find("#post_content").focus();
		}).find("#post_content").on("keydown",{"change_height_dom":pre_e},autoHeightIframe).on("keyup.postAddModeSet",postAddModeSet);
	});
	$("#post_add textarea").on("keydown",autoHeight).
		on("keyup.postAddModeSet",postAddModeSet);
	
});