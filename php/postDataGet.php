<?
require_once('../phpInfo/infoDB.php');
require_once('../phpJson/JSON.php');

$json = new Services_JSON();

//post값 가져오기
$post_indexs = $_POST["post_indexs"];

//데이터 검사
if(!(filter_var_array($post_indexs, FILTER_VALIDATE_INT))){
	echo $json->encode("1");
	echo "error";
	exit();
}

$query_post = join(" OR	`memory_post`.`index`=",$post_indexs);

$query = "SELECT `memory_post`.`index`,`memory_post`.`menu_index`, `memory_post`.`title`,  `memory_post`.`time`, `memory_post`.`type`, `memory_user`.`nickname` FROM memory_post INNER JOIN memory_user ON memory_post.writer = memory_user.index WHERE `memory_post`.`index`= ".$query_post;

$result = $db->query($query);
if(!($result)){
	echo $json->encode($query);
	echo "\nerror";
	exit();
}
$json_arr = array();

function numSetting($db,$menu_index){
	//echo $menu_index."\n";
	$reply_num=0;
	$query = "SELECT `memory_post`.`index` FROM `memory_post` WHERE `memory_post`.`menu_index` = ".$menu_index." AND `type` = 'reply'";//들어온 게시물에대한 덧글수.
	$result = $db->query($query);
	$reply_num += mysqli_num_rows($result);
	while($result_arr = $result->fetch_assoc()){
		$reply_num += numSetting($db,$result_arr['index']);
	}
	return $reply_num;
}


while($result_arr = $result->fetch_assoc()){

	$reply_num = numSetting($db,$result_arr['index']);
	
	$result_is_content = $db->query("SELECT `content` FROM `memory_content` WHERE `index` = ".$result_arr['index']);
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