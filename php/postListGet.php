<?
require_once('../phpInfo/infoDB.php');
require_once('../phpJson/JSON.php');

$json = new Services_JSON();

//post값 가져오기
$menu_index = $_POST["menu_index"];
$type = $_POST["type"];
$sort_state = $_POST["sort_state"];

//데이터 검사
if(!(filter_var($menu_index, FILTER_VALIDATE_INT))){
	echo $json->encode("1");
	echo "error";
	exit();
}
if(!(preg_match("/^(time|title)$/",$sort_state))){
	echo $json->encode("1");
	echo "error";
	exit();
}
if(!(preg_match("/^(post|reply)$/",$type))){
	echo $json->encode("2");
	echo "error";
	exit();
}


$query = "SELECT `memory_post`.`index`, `memory_post`.`".$sort_state."` FROM memory_post WHERE `memory_post`.`menu_index`= ".$menu_index." AND `memory_post`.`type`='".$type."' ORDER by `memory_post`.`".$sort_state."` DESC";
$result = $db->query($query);

if(!($result)){
	echo $json->encode($query);
	echo "error";
	exit();
}

$json_arr = array();
while($result_arr = $result->fetch_assoc()){
	array_push($json_arr,array(
		"post_index"=>$result_arr['index'] ,
		"menu_index"=>$menu_index,
		$sort_state =>$result_arr[$sort_state]));
}
$result->free();
$db->close();

echo $json->encode($json_arr);

?>