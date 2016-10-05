jQuery(function () {
    var leftToggle = new Array(),
		$post_list = $("#post_list"),
		$division_menu_area = $("#division_menu_area"),
		$window = $(window),
		$post_list_box = $("#post_list_box");

    var setPostList = function ($post_list, add_posts) {
        view_posts = $post_list.children(".post_head:not(#post_add,#post_last)").toArray();
        saved_view_posts_arr = view_posts.concat(add_posts);

        //정렬.
        saved_view_posts_arr.sort(function (a, b) {
            if ($(b).data(SORT_STATE) == undefined || $(a).data(SORT_STATE) == undefined)
                return 0;
            return $(b).data(SORT_STATE) - $(a).data(SORT_STATE);
        });
        // html에 추가 및 기존 dom이 이동
        $post_list.append($(saved_view_posts_arr));
        setPostData();
    }
    setPostData = function () {
        var $this,
			scroll_top = $window.scrollTop(),
			scroll_height = $window.height() + scroll_top,
			load_this = new Array();
        $post_list.find(".not_load").each(function () {
            $this = $(this);
            if (scroll_top - 1000 < $this.offset().top && $this.offset().top < scroll_height + 1000)
                load_this.push($this);
        });
        if (load_this.length > 0) {
            //console.log(load_this);
            loadPosts($(load_this));
        }
    }
    var loadPosts = function ($posts) {
        //console.log("loadPosts");
        var new_posts_data_arr, new_posts_arr, check_selector, new_data, $click_menu, add_posts,
			send_data = { "post_indexs": new Array() },
			posts = $posts.toArray();
        $posts.each(function () {
            send_data.post_indexs.push($(this).data("post_index"));
        });
        //console.log(send_data);
        $.post("./php/postDataGet.php", send_data, function (data, status) {
            if (status != "success") {
                miniPopup("html", "서버와의 상태가 좋지 않습니다.", "head_alarm", 3000, $("#cancel").offset().top, parseInt($("#cancel").offset().left) + 100);
                return 0;
            } else {
                //새롭게 추가된 게시물들의 정보를 가진 정렬된 배열
                console.log(data);
                new_posts_data_arr = incodePostListData(data);
                new_posts_arr = postListGet($.map(new_posts_data_arr, function (value) {
                    return (value == undefined) ? null : value;
                }));

                for (var i = 0, len = posts.length, value, $value, check_index; i < len; i++) {
                    value = posts[i];
                    $value = $(value);
                    check_index = parseInt($value.data("post_index"));
                    check_selector = ".post_head[name='" + check_index + "']";

                    if (!($(new_posts_arr).is(check_selector))) {
                        $click_menu = $division_menu_area.children("a[name='" + $value.data("post_index") + "']");
                        add_posts = $click_menu.data("posts");
                        $click_menu.data("posts", removeArrValue(add_posts, value));
                        $value.remove();
                    } else {
                        new_data = new_posts_data_arr[check_index];
                        //과거의 데이터를 가진 게시물 수정.
                        $value.data(new_data).removeClass("not_load").
							children(".writer").find("a").text(new_data.writer).end().end().
							children(".title").find("a").html(new_data.title).end().end().
							children(".time").attr("title", new_data.time).text(new_data.date.day);

                        if (new_data.reply_num)
                            $value.children(".reply_num").text("[" + new_data.reply_num + "]");
                        else
                            $value.children(".reply_num").text("");

                        if (new_data.is_content == "true")
                            $value.addClass("is_content").removeClass("unopen");
                        else if (new_data.reply_num == 0)
                            $value.addClass("unopen").removeClass("is_content");
                        else
                            $value.removeClass("unopen");
                        //$click_menu.data("posts",$add_posts.not(check_selector).add($value));
                    }
                }
            }
        }, 'json');
    }
    //메뉴 클릭시.
    $division_menu_area.on("click", ".division_menu", function (e) {

        //메뉴의 흔들리는 애니메이션의 함수를 담는 배열을 비운다.(애니메이션 중지)
        //leftToggle = undefined;

        /*메뉴 클릭시 애니메이션 소스*/
        var $e_currentTarget = $(e.currentTarget);
        $e_currentTarget.clearQueue().stop();
        if ($.data(e.currentTarget, "chose")) {
            $e_currentTarget.removeClass("chose").data("chose", false).attr("style", "left:0%;").animate({ left: "-30%" }, 500);
        } else {
            $e_currentTarget.data("chose", true).animate({ left: "0%" }, 500, function () {
                $e_currentTarget.addClass("chose");
            });
        }
        /* 애니메이션 소스 끝*/

        var $click_menu = $e_currentTarget.children("a"), //클릭된 메뉴
			click_menu_index = $click_menu.data("menu_index"), //클릭된 메뉴 인덱스
        //현제 보이는 게시물 목록.
			view_posts = $post_list.children(".post_head:not(#post_add,#post_last)").toArray(),
			new_posts_arr, $new_posts_arr, saved_view_posts_arr, add_posts;

        //메뉴를 선택된건지 해제된건지에 따라.

        //메뉴가 선택된것일시.
        if ($e_currentTarget.data("chose")) {
            /*기존에 존재하는 데이터로 게시물리스트 만들기를 시도.*/
            if ($click_menu.hasData("posts")) {//기존 데이터가 있을시 		
                add_posts = $click_menu.data("posts");
                setPostList($post_list, add_posts);
            } else
                $click_menu.data("posts", new Array());

            /*send_data 설정*/
            if (SORT_STATE == "seconds")
                _send_sort_state = "time";
            else
                _send_sort_state = SORT_STATE;
            var send_data = { 'menu_index': click_menu_index, 'sort_state': _send_sort_state, 'type': "post" };
            /*send_data 설정완료*/

            //게시물을 가져오는 Ajax
            console.log("$division_menu_area click");
            console.log(send_data);
            $.post("./php/postListGet.php", send_data, function (data, status) {
                console.log("$division_menu_area ajax");
                console.log(status);
                console.log(data);
                if (status != "success") {
                    miniPopup("html", "서버와의 상태가 좋지 않습니다.", "head_alarm", 3000, $("#cancel").offset().top, parseInt($("#cancel").offset().left) + 100);
                    return 0;
                } else {
                    //새롭게 추가된 게시물들의 정보를 가진 정렬된 배열
                    var new_posts_data_arr = incodePostListData(data);
                    if (add_posts != undefined) {
                        for (var i = 0, len = add_posts.length, value, $value, check_index; i < len; i++) {
                            value = add_posts[i];
                            $value = $(value);
                            check_index = parseInt($value.data("post_index"));
                            if (new_posts_data_arr[check_index] == undefined) {
                                $value.remove();
                                value = undefined;
                                //add_posts = removeArrValue(add_posts,value);
                            } else {
                                $value.data(new_posts_data_arr.slice(check_index, check_index + 1));
                                new_posts_data_arr[check_index] = undefined;
                            }
                        }
                        add_posts = $.map(add_posts, function (value) {
                            return (value == undefined) ? null : value;
                        });
                        $click_menu.data("posts", add_posts);
                    } else
                        add_posts = new Array();
                    new_posts_data_arr = $.map(new_posts_data_arr, function (value) {
                        return (value == undefined) ? null : value;
                    });


                    //추가될게 하나도 없을시
                    if (new_posts_data_arr.length == 0)
                        return;


                    new_posts_arr = postListGet(new_posts_data_arr);

                    $.each(new_posts_arr, function () {
                        $(this).addClass("not_load");
                    })
                    add_posts = add_posts.concat(new_posts_arr);
                    $click_menu.data("posts", add_posts);

                    setPostList($post_list, add_posts);
                }
            }, 'json');
        } else {//메뉴가 해제될시

            //위에서 선언된 변수들 new_posts_arr,saved_view_posts_arr,add_posts;
            $($click_menu.data("posts")).detach();

        }
    }).on("mouseenter", ".division_menu", function (e) {
        if (jQuery.fx.off || $.data(e.currentTarget, "chose"))
            return;
        var $e_currentTarget = $(e.currentTarget),
			n = $e_currentTarget.find("a").data("post_index");

        leftToggle[n] = function () {
            if (jQuery.fx.off || $.data(e.currentTarget, "chose"))
                return;
            $e_currentTarget.animate({ left: "-20%" }, 'slow', 'easeInOutQuad').
				animate({ left: "-25%" }, 'slow', 'easeInOutQuad', function () {
				    try { leftToggle[n]() } catch (e) { console.log(e.message) }
				});
        }
        leftToggle[n]();
    }).on("mouseleave", ".division_menu", function (e) {
        if (jQuery.fx.off || $.data(e.currentTarget, "chose"))
            return;

        var $e_currentTarget = $(e.currentTarget),
			n = $e_currentTarget.find("a").data("post_index");

        leftToggle[n] = function () {
            if (jQuery.fx.off || $.data(e.currentTarget, "chose"))
                return;
            $e_currentTarget.animate({ left: "-30%" }, 'fast', 'easeInOutQuad');
        }
    });

    var post_addOpen = function () {
        $("#post_add").addClass("openPostAdd").
			children("ul").stop().slideDown(500, function () {
			    $(this).removeAttr("style")//stop함수로 인해 끝까지 못내려갈수가 있다.
			}).end().children(".post_aside").stop().fadeOut(500).
			end().find(".title textarea").poshytip("update", "제목공간 클릭시 본문공간이 닫힙니다.(본문내용은 유지됩니다)")
    }
    var post_addClose = function () {
        $("#post_add").removeClass("openPostAdd").
			children("ul").stop().slideUp(500).
			end().children(".post_aside").stop().fadeTo(500, 1, function () {
			    $(this).removeAttr("style")//stop()함수로 인해 원래 투명도를 0.x으로 인식해버려서 fadeIn을 사용시 투명도가 1을 못갈수 있다.
			}).end().find(".title textarea").poshytip("update", "두번 클릭 또는 Tab키를 누를시 본문작성 가능")
    }

    $("#post_add .title textarea").poshytip({
        className: 'tip-yellowsimple',
        showOn: 'mouseover',
        followCursor: true,
        alignTo: 'cusor',
        alignX: 'inner-left',
        offsetX: 0,
        offsetY: 5
    }).on("focusin", function (e) {
        e.stopPropagation();
        console.log("focusin");
        $("#post_add .title textarea").on("click.postAddOpen", function () {
            console.log("postAddOpen");
            if ($("#post_add").hasClass("openPostAdd")) {
                post_addClose();
            } else {
                post_addOpen();
            }
            return;
        });
    }).on("focusout", function () {
        $("#post_add .title textarea").off(".postAddOpen");
    }).on("keydown", function (e) {//단축키 tab. 본문공간을 펼친다.
        if (e.which == 9) {
            e.preventDefault();
            post_addOpen();
            $("#post_add").find(".post_body").children(".content").contents().find("#post_content").focus();
        }
    });
    $post_list_box.on("click", ".post_head:not(#post_add):not(.unopen):not(.not_load)", function (e) {
        e.stopPropagation();
        //e.stopImmediatePropagation();

        var $click_post = $(e.target).closest(".post_head");

        //열지 못하는 게시물일경우.
        if ($click_post.hasClass("unopen"))
            return;

        //성능개선(리플래쉬 적게)을 위한 잠시 화면에서 없앨 게시물 목록.
        var hide_group = new Array();
        $post_list_box.css("height", $post_list_box.height());
        $post_list.find(".post_head").each(function () {
            if ($(window).scrollTop() + $(window).height() + $click_post.height() < $(this).offset().top) {
                hide_group.push(this);
            }
        });

        //현제 펼쳐진 상태일시.
        if ($click_post.hasClass("open")) {
            if (MODESTATE == "post_add")
                $click_post.children(".icon_area").children(".new_posting_able_icon").removeAttr("style").fadeTo(0, 0.5);
            //선택구간이 li이가 아닌 그 안의 게시물,댓글일경우 함수종료.
            if ($(e.currentTarget).children("ul").find("*").is($(e.target)) || $(e.target).hasClass("post_body")) {
                return;
            }

            if ($("#all_post_open").data("opening"))
                clearInterval($("#all_post_open").data("opening", false).data("interval"));


            //게시물 닫기.
            $(hide_group).hide();
            $click_post.removeClass("open").children("ul").slideUp(500, function () {
                $(hide_group).show();
                $post_list_box.removeAttr("style");
            });

            //스크롤 보정.
            var correction_scroll = $click_post.offset().top
            if ($(window).scrollTop() > correction_scroll)
                $(window).scrollTop(correction_scroll);

            return; //함수종료
        }

        var _post_index = parseInt($click_post.data("post_index"), 10),
			$reply_list = $click_post.children("ul"),
			add_posts;

        //본래 이전 정보가 존재할경우 미리 이전정보를 연다. html자체가 있는경우와 data만 있는경우로 나뉜다.
        if ($click_post.children("ul").children(".post_body").html() != "") {
            $(hide_group).hide();
            $click_post.addClass("open").children("ul").slideDown(500, function () {
                $(hide_group).show();
                $post_list_box.removeAttr("style");
            });
        } else if ($click_post.hasData("content")) {
            $(hide_group).hide();
            $click_post.children("ul").children(".post_body").html($click_post.data("content")).
				end().end().addClass("open").children("ul").slideDown(500, function () {
				    $(hide_group).show();
				    $post_list_box.removeAttr("style");
				});
        }
        if ($click_post.hasData("posts"))
            add_posts = $click_post.data("posts");
        else
            $click_post.data("posts", new Array());
        if ($click_post.children("ul").children(".post_head")[0] == undefined) {
            if (add_posts != undefined) {
                add_posts = $click_post.data("posts");
                setPostList($reply_list, add_posts);
            } else {
                $click_post.children("ul").children(".post_head").remove();
            }
        }
        $.post("./php/postContentGet.php", { post_index: _post_index },
			function (content, status) {//divisionMenu를 ajax로 데이터를 불어와 만드는 함수
			    if (status != "success") {
			        miniPopup("html", "서버와의 상태가 좋지 않습니다.", "head_alarm", 3000, $("#cancel").offset().top, parseInt($("#cancel").offset().left) + 100);
			        return 0;
			    } else {

			        if ($click_post.data("content") != content) {//저장된 content가 없거나 다를시
			            var $post_body = $click_post.data("content", content).
						children("ul").children(".post_body");
			            $post_body.empty().html(content);
			            //글자크기 제한.
			            $post_body.find("*").each(function () {
			                if (parseInt($(this).css("fontSize")) > 200)
			                    $(this).css("fontSize", 200);
			            }).end().find("img").on("error", imageLoadingCheck);
			            $(hide_group).hide();
			            $click_post.addClass("open").children("ul").slideDown(500, function () {
			                $(hide_group).show();
			                $post_list_box.removeAttr("style");
			            });

			        }
			    }

			    /*send_data 설정*/
			    if (SORT_STATE == "seconds")
			        _send_sort_state = "time";
			    else
			        _send_sort_state = SORT_STATE;
			    var send_data = { 'menu_index': _post_index, 'sort_state': _send_sort_state, 'type': "reply" };
			    /*send_data 설정완료*/
			    $.post("./php/postListGet.php", send_data, function (data, status) {
			        if (status != "success") {
			            miniPopup("html", "서버와의 상태가 좋지 않습니다.", "head_alarm", 3000, $("#cancel").offset().top, parseInt($("#cancel").offset().left) + 100);
			            return 0;
			        } else {
			            //새롭게 추가된 게시물들의 정보를 가진 정렬된 배열
			            var new_posts_data_arr = incodePostListData(data);
			            if (add_posts != undefined) {
			                for (var i = 0, len = add_posts.length, value, $value, check_index; i < len; i++) {
			                    value = add_posts[i];
			                    $value = $(value);
			                    check_index = parseInt($value.data("post_index"));
			                    if (new_posts_data_arr[check_index] == undefined) {
			                        $value.remove();
			                        value = undefined;
			                        //add_posts = removeArrValue(add_posts,value);
			                    } else {
			                        $value.data(new_posts_data_arr.slice(check_index, check_index + 1));
			                        new_posts_data_arr[check_index] = undefined;
			                    }
			                }
			                add_posts = $.map(add_posts, function (value) {
			                    return (value == undefined) ? null : value;
			                });
			                $click_post.data("posts", add_posts);
			            } else
			                add_posts = new Array();
			            new_posts_data_arr = $.map(new_posts_data_arr, function (value) {
			                return (value == undefined) ? null : value;
			            });
			            //추가될게 하나도 없을시
			            if (new_posts_data_arr.length == 0)
			                return;

			            new_posts_arr = postListGet(new_posts_data_arr);
			            $.each(new_posts_arr, function () {
			                $(this).addClass("not_load");
			            });

			            add_posts = add_posts.concat(new_posts_arr);
			            $click_post.data("posts", add_posts);
			            //댓글순서 역순을 위해 임시적으로..-_-;
			            //setPostList($reply_list,add_posts);
			            /*임시*/
			            view_posts = $reply_list.children(".post_head:not(#post_add,#post_last)").toArray();
			            saved_view_posts_arr = view_posts.concat(add_posts);

			            //정렬.
			            saved_view_posts_arr.sort(function (a, b) {
			                if ($(b).data(SORT_STATE) == undefined || $(a).data(SORT_STATE) == undefined)
			                    return 0;
			                return $(a).data(SORT_STATE) - $(b).data(SORT_STATE);
			            });
			            // html에 추가 및 기존 dom이 이동
			            $reply_list.append($(saved_view_posts_arr));
			            setPostData();
			            /*임시 끝*/
			        }
			    }, 'json');
			});
    });

    //게시물이 어느 메뉴에 속해잇는지 나타내는 이벤트
    $post_list.on("mouseenter", ">.post_head", function (e) {
        //모든 표식 제거.
        $division_menu_area.find(".post_chose").removeClass("post_chose");
        //선택된 메뉴가 두개 이상이 아닐시 함수 종료.
        if ($division_menu_area.find(".chose")[1] == undefined)
            return;
        //게시물이 위치한 메뉴에 스타일클래스(표식) 적용.
        $division_menu_area.find(".division_menu a[name=" + $(e.currentTarget).data("menu_index") + "]").
			closest(".division_menu").addClass("post_chose");
    }).on("mouseleave", ">.post_head", function () {
        //모든 표식 제거.
        $division_menu_area.find(".post_chose").removeClass("post_chose");
    }).find(".time").poshytip({
        liveEvents: true,
        className: 'tip-yellowsimple',
        alignTo: 'target',
        alignX: 'right',
        alignY: 'center',
        offsetX: 5
    });

    var imageLoadingCheck = function (e) {
        var $target = $(e.target),
			reload_img_src = $target.attr("src"),
			$check_reload_iframe;
        if (!($target.hasData("load_error1"))) {//이미지 로드 실패시.
            $target.data("load_error1", true);
            /*이미지를 다시 로딩시도*/
            var reload_img = new Image();
            reload_img.src = reload_img_src;
            $target.attr("src", reload_img.src);

        } else if (!($target.hasData("load_error2"))) {//이미지 재로딩도 실패시
            $target.data("load_error2", true);
            var random_id = $.now() + "_image_cash_reload_" + parseInt(Math.random() * 1000, 10);
            $("body").append($("<iframe></iframe>").
				attr({
				    "id": random_id,
				    "src": reload_img_src//,
				    //"position":"fixed",
				    //"top":-100000
				}));
            $check_reload_iframe = $("#" + random_id);
            $target.data("check_iframe", $("#" + random_id));
            $check_reload_iframe.on("load." + random_id, function (e) {
                var reload_img = new Image();

                reload_img.src = reload_img_src;
                $target.attr("src", reload_img.src);
                $check_reload_iframe.remove();
                //$(e.target).remove();
            });
            //$target.off("error");
        } else {
            $target.off("error").poshytip({
                className: 'tip-yellowsimple',
                content: "이미지 로딩의 문제가 있음 ㅠㅠ<br> 우선 임시해결법으로 클릭시 해당 이미지 링크로 이동됨.",
                showOn: 'mouseover',
                alignTo: 'target',
                alignX: 'center',
                offsetX: 0,
                offsetY: 0,
                timeOnScreen: 5000
            }).poshytip('show').wrap("<a target='_blank' href='" + e.target.src + "'>");
        }
    }
    //성능개선을 위해 windowEvent.js로 이동.
    //$window.scroll(setPostData);
});