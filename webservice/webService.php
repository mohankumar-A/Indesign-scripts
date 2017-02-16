<?php

function getIfSet(&$value, $default = null){
	return isset($value) ? $value : $default;
}

$ProjId = getIfSet($_REQUEST["ProjId"]);
$Version = getIfSet($_REQUEST["Version"]);
if($ProjId != null && $Version != null) {
	$url = 'http://services.amnet-systems.com/amext/AmExService.asmx?op=ProductCheck';
	$postString = '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ProductCheck xmlns="http://tempuri.org/"><ProjId>'.$ProjId.'</ProjId><Version>'.$Version.'</Version></ProductCheck></soap:Body></soap:Envelope>';

	$XML = str_replace('&', '&amp;', $postString);
	$XML = str_replace('<', '&lt;', $XML);

	$soap_do = curl_init();
	curl_setopt($soap_do, CURLOPT_URL,            $url );
	curl_setopt($soap_do, CURLOPT_CONNECTTIMEOUT, 10);
	curl_setopt($soap_do, CURLOPT_TIMEOUT,        10);
	curl_setopt($soap_do, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($soap_do, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($soap_do, CURLOPT_SSL_VERIFYHOST, false);
	curl_setopt($soap_do, CURLOPT_POST,           true);            
	curl_setopt($soap_do, CURLOPT_POSTFIELDS,     $postString); 
	curl_setopt($soap_do, CURLOPT_HTTPHEADER,     array('Content-Type: text/xml; charset=utf-8', 'Content-Length: '.strlen($postString) ));

	if(curl_exec($soap_do) === false)
	{                
	    $err = 'Curl error: ' . curl_error($soap_do);
	    curl_close($soap_do);
	    return "false";
	}
	else
	{
		$result = curl_exec($soap_do);
		if($result != "" || $result != null){
			echo $result;
		} else {
			return "false";
		}
	}
} else {
	return "false";
}
?>