<?
require_once('../phpInfo/infoDB.php');

$post_index = $_POST["post_index"];

$query = "SELECT `content` FROM `memory_content` WHERE `index`= ".$post_index;

$result = $db->query($query);

if(mysqli_num_rows($result)==0){
	echo "";
	exit();
}else{
	$result_arr = $result->fetch_assoc();
	echo preg_replace("/\&\#047;\&\#047;/","//",preg_replace("/\&\#039;/","'" ,preg_replace("/\&\#034;/", '"',$result_arr['content'])));
	exit();
}
?>