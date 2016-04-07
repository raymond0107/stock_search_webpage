<?php
	header('Content-type: application/json');
	if (isset($_GET["url"])) {
		$url = $_GET["url"];
		$content = file_get_contents($url);
		echo $content;
	}
	if (isset($_GET["url_news"])) {
		$accountKey = 'vTkXaQXqInisK9TopUf/lEFGEm+ri9MvAQMfRSapyn0';
		$context = stream_context_create(array(
		    'http' => array(
		    	'request_fulluri' => true,
		        'header'  => "Authorization: Basic " . base64_encode($accountKey.":".$accountKey)
		    )
		));
		$url = $_GET["url_news"];
		$data = file_get_contents($url, 0, $context);
		echo $data;
	}
?>
