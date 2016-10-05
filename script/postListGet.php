<?
require_once('../phpInfo/infoDB.php');
require_once('../phpJson/JSON.php');

$json = new Services_JSON();

//post값 가져오기
$menu_index = $_POST["menu_index"];
$type = $_POST["type"];

//데이터 검사
if(!(filter_var($menu_index, FILTER_VALIDATE_INT))){
	echo $json->encode("1");
	echo "error";
	exit();
}

if(!($type=='post' || $type=='reply')){
	echo $json->encode("2");
	echo "error";
	exit();
}


$query = "SELECT `post`.`index`, `post`.`menu_index`, `post`.`title`,  `post`.`time`, `post`.`type`, `user`.`nickname` FROM post INNER JOIN user ON post.writer = user.index WHERE `post`.`menu_index`= ".$menu_index." AND `post`.`type`='".$type."' ORDER by `post`.`index` DESC";

$result = $db->query($query);
if(!($result)){
	echo "error";
	exit();
}
$json_arr = array();

function numSetting($db,$menu_index){
	//echo $menu_index."\n";
	$reply_num=0;
	$query = "SELECT `post`.`index` FROM `post` WHERE `post`.`menu_index` = ".$menu_index." AND `type` = 'reply'";//들어온 게시물에대한 덧글수.
	$result = $db->query($query);
	$reply_num += mysqli_num_rows($result);
	while($result_arr = $result->fetch_assoc()){
		$reply_num += numSetting($db,$result_arr['index']);
	}
	return $reply_num;
}


while($result_arr = $result->fetch_assoc()){

	$reply_num = numSetting($db,$result_arr['index']);
	
	$result_is_content = $db->query("SELECT `content` FROM `content` WHERE `index` = ".$result_arr['index']);
	//$result_arr3 = $result3->fetch_assoc();
	//echo $result_arr3['content']."\n";
	//echo mysqli_num_rows($result3)."\n";
	
	
	if(mysqli_num_rows($result_is_content)!=0){
		$is_content="true";
	}else{
		$is_content="false";
	}
	
	array_push($json_arr,array(
		"post_index"=>$result_arr['index'] ,
		"menu_index"=>$result_arr['menu_index'] ,
		"writer"=>$result_arr['nickname'] ,
		"title"=>$result_arr['title'] ,
		"type"=>$result_arr['type'] ,
		"time"=>$result_arr['time'] ,
		"reply_num"=>$reply_num ,
		"is_content"=>$is_content));

}
$result->free();
$db->close();

echo $json->encode($json_arr);

?>