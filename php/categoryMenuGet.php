<?
require_once('../phpInfo/infoDB.php');
require_once('../phpJson/JSON.php');

$json = new Services_JSON();

$query = "SELECT * FROM `memory_menu_part` ORDER BY `memory_menu_part`.`index`ASC";
$result = $db->query($query);

$json_arr = array();
while($result_arr = $result->fetch_assoc()){
	array_push($json_arr,array("index"=>$result_arr['index'],"name"=>$result_arr['name']));
}
$result->free();
$db->close();

echo $json->encode($json_arr);
?>