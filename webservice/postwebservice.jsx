/*##########################################
#
# web service check date : 16-11-2016
# developed by :Mohan Kumar. A
#
#########################################*/


/*############################################
# Params TYPE should be Array
# iniatilize service value
# MYWEBSERVICE.init([ProjId, Version])
###########################################*/

var arg1 = "yVWQoWyEQNsbuORYxVROzg==";
var arg2 = "HZTJNSbB3VQ=";

var argLen = (arg1 + arg2).length;
var reply = "";  
var conn = new Socket;

if(conn.open ("192.168.4.65:80"))  //your host
{  
var request = 'POST /php/check_server_indesign_javascript/webservice_php/webService.php?ProjId='+arg1+'&Version='+arg2+ ' HTTP/1.0\n\n';
$.writeln(request);
conn.write(request);
reply = conn.read();  
$.writeln(reply);
conn.close();  
}  else {
    $.writeln( 'Problem connecting to server' );
}