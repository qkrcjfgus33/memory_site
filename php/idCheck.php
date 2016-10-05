<?
require_once('../phpInfo/infoDB.php');
$check_id = $_GET['check_id'];

$query = "SELECT `id` FROM memory_user WHERE `id`='".$check_id."'";
$result = $db->query($query);
//echo $query ;

if(mysqli_num_rows($result)==0){
	echo(true);
}
else{
	echo(false);
}
?>