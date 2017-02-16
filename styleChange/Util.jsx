var amnet = {
    scriptPath:function(){
            var scriptPath;
            var scriptFile;
            try{
                scriptFile=app.activeScript;
            }
            catch(error){
                scriptFile=File(error.fileName);
            }
            scriptPath=scriptFile.parent;
            return scriptPath;        
        }, 
    preventUserIntract : function(bool){
            if(bool)
            {
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
                app.scriptPreferences.measurementUnit = MeasurementUnits.INCHES;
            }
            else
            {
                app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
            }        
        },
        getXMLFile : function(filePath){
                    //read file
                    var readFile = new File(filePath);
                    var isFIleExist = readFile.exists; //check file path exists or not
                    
                    if(isFIleExist){
                            readFile.open("r");
                            if(readFile){
                                    var xmlFIleString = readFile.read();
                                    try{
                                            var xmlFile = new XML(xmlFIleString);
                                            readFile.close();
                                            return xmlFile;
                                    }catch(error){
                                        readFile.close();
                                        this.message = "invalid xml file";
                                        return false;
                                    }
                           }
                    } else {
                            this.message = "invalid file path, Please check";
                            return false;
                    }
        },
        convertXmlToJson : function (xml){
            try
            {
                    // Create the return object
                    var obj = {};
                    if (xml.nodeKind() == "element") {
                        if (xml.attributes().length() > 0) {
                            for (var j = 0; j < xml.attributes().length(); j++) {
                                var attributeName = xml.attributes()[j].name();
                                obj[attributeName] = String(xml.attributes()[j]);
                            }
                        }
                    } else if (xml.nodeKind() == "text") {
                        obj['text'] = xml.text();
                    }
                    if (xml.children()) {
                        for (var i = 0; i < xml.children().length(); i++) {
                            var item = xml.child(i);
                            if (xml.children()[i].nodeKind() == "text") {
                                obj['text'] = xml.children()[i].toString();
                            } else {
                                var nodeName = item.name();
                                if (typeof(obj[nodeName]) == "undefined") {
                                        var tempObj = this.convertXmlToJson(item);
                                        if (item.attributes().length() > 0) {
                                            obj[nodeName] = [tempObj];
                                        } else {
                                            obj[nodeName] = tempObj;
                                        }
                                } else {
                                    if (typeof(obj[nodeName].push) == "undefined") {
                                        var old = obj[nodeName];
                                        obj[nodeName] = [];
                                        obj[nodeName].push(old);
                                    }
                                    obj[nodeName].push(this.convertXmlToJson(item));
                                }
                            }
                        }
                    }
                    return obj;
              }catch(error){
                    this.message = "invalid xml file object, please check xml file";
                    return false;
               }
        },
        convertJsonToXml : function(json){
            try{
                  var xmlStringFile = "";
                   var checkObj = false;
                    if(json.length === undefined || typeof json === "object"){
                       for(var key in json){
                            var tempElemStr = "";
                            var tempElemObj = json[key];
                            //check json object has immediate array
                            checkObj = this.checkJsonArrayObj(json[key]);
                            
                            if(checkObj){
                                tempElemStr += ""; //first level element name
                             } else {
                                 tempElemStr += "<" + key + ">"; //first level element name
                             }

                            //find if element has attribute
                            if(tempElemObj.length != undefined){
                                    tempElemStr += this.getElemAtrribStrArray(tempElemObj, key);
                            } else if(typeof tempElemObj === "object"){
                                    tempElemStr += jsonToXml(tempElemObj);
                             }
                            
                            if(checkObj){
                                tempElemStr += ""; //first level element name
                             } else {
                                 tempElemStr += "</" + key + ">"; //first level element name
                             }
                            xmlStringFile += tempElemStr;
                        }
                    } else {
                        alert("invalid json object");
                    }
                  return xmlStringFile;
                  
            }catch(error){
                alert("invalid json");
             }
        },
        isDocumentOpen: function(){
            var checkDocumentOpen = false;    
            try{
                if(app.activeDocument != null){
                    checkDocumentOpen = true;
                    return checkDocumentOpen;
                }
            }catch(error){
                alert("Please open atleast one document");            
                return checkDocumentOpen;
            }
        },
        isStyleExist: function(styles, name){
            try{
                    var singleStyle = styles.item(name);
                    var styleName = singleStyle.name;
                    return  true;
                }catch(error){
                    if(error.number == 45)
                    {
                        return false;
                    }else{
                        throw error.message;
                     }
                }
            },
            getJsonKeyObj: function(json, keyVal){
                var obj = null;
                if(typeof json == "object" || keyVal != null){
                        var objLen = json.length;
                        for(var i =0; i<objLen; i++){
                              var tempObj = json[i];
                              for (var key in tempObj){
                                  var tempKeyVal = tempObj[key].toString();
                                    if(tempKeyVal === keyVal.toString()){
                                            obj = tempObj;
                                            return obj;
                                     }
                               }
                        }
                    }
            },
        getElemAtrribStrArray: function(arrObj, elemName){
            var tempElemObj = arrObj;
            var tempElemStr = "";
            for(var i=0; i < tempElemObj.length; i++){
                    var tempAttribObj = tempElemObj[i];
                        tempElemStr += "<" + elemName;
                    if(tempAttribObj.length == undefined){ //check whether its json object
                        for(var attrib in tempAttribObj){
                                tempElemStr += " " + attrib + "=" + '"' +tempAttribObj[attrib] + '"';
                        }
                        tempElemStr += " />";
                    }
               }
           return tempElemStr;
        },
        checkJsonArrayObj: function(obj){
                var check = false;
                if(typeof obj != "object") { 
                    //alert("invalid object");  
                    return false;
                 }
                if(obj.length != undefined){
                    check = true;
                }
                return check;
        },
        message:"",
        indexOf: function(hay, needle){
            var index = -1;
            for(var i=0; i< hay.length; i++){
                if(hay[i] == needle){
                    index = i;
                    return index;
                }
            }
            return index;
        }
};

var checkXMLJson = function(xmlJson){
        var json = xmlJson;
        
        this.hasProperty = function(obj, key){
            var hasProperty = (obj.hasOwnProperty (key)) ? true:false;
            return hasProperty;
        }
    
        this.checkObj = function(obj){
                var rootArr = ["character", "paragraph"];
                var rootArrLen = rootArr.length;
                var styleArr = ["cstyle", "pstyle"];
                var rootArrLen = rootArr.length;
                
                for(var i=0; i<rootArrLen; i++){
                    var hasProp = this.hasProperty(json, rootArr[i]);
                    if(hasProp){
                            hasProp = this.hasProperty(json[rootArr[i]], styleArr[i]);
                            //$.writeln(json[rootArr[i]][styleArr[i]]);
                            if(hasProp){
                                var chkRes = this.checkDuplicateObj (json[rootArr[i]][styleArr[i]]);
                                if(!chkRes){
                                    return false;
                                }
                                
                            } else {
                                amnet.message = styleArr[i] + " element is missing should be available under " + rootArr[i]+", please check in xml file";
                                return false;
                            }
                        
                    }else{
                            amnet.message = rootArr[i] + " element is missing, please check in xml file";
                            return false;
                    }
                }
                
                return true;
            
        }
    
        
        
        this.checkDuplicateObj = function(obj){
                var length = obj.length;
                var orgNameArr = [];
                var attrArr = ["name", "txelm", "roots"];
                var attrArrLen = attrArr.length;
                
                for(var i=0; i<length; i++){
                    var tempObj = obj[i];
                    
                    for(var j=0; j<attrArrLen; j++){
                        var hasProp = this.hasProperty (tempObj, attrArr[j]);
                        if(hasProp){
                                var val =  tempObj[attrArr[j]];
                                var isEmpty = this.isEmptyVal(val);
                                if(isEmpty){
                                   amnet.message = attrArr[j] + " attribute should not be empty, please check in xml file";
                                   return false; 
                                }
                            
                                if(attrArr[j] == attrArr[0]){
                                    var idx = amnet.indexOf(orgNameArr, val);
                                   //check duplicate
                                   if(idx == -1){
                                           orgNameArr.push(val);
                                           //check style name general validation
                                           //matches pattern like "style_name-para"
                                           var validation = val.match(/^(([a-zA-Z][a-zA-Z0-9]*)([-_]?)){1,}([a-zA-Z0-9]+)$/g);
                                           if(validation == null){ 
                                                amnet.message = val + " style name is seems to be invalid, please check in xml file";
                                                return false;
                                           }
                                   } else {
                                       amnet.message = val + " style name is duplicated, please check in xml file";
                                       return false;
                                   }
                                } else { //check texelem and roots
                                    if(attrArr[j] == "roots" && val == "*"){
                                        return true;
                                    }
                                
                                    //general validation
                                    //1. matches emphasis[type=bold@role=]/emphasis[type=italic@role=]|para|emphasis[type=bold@role=]/emphasis[type=italic@role=]
                                    var pattern = new RegExp(/^((?:(?:[\/\|])?[A-Za-z][0-9A-Za-z\_\-:.]*(?:\[(?:[A-Za-z][0-9A-Za-z\_\-:.]*=(?:[^@\[\]=]+)?)(?:@(?:[A-Za-z][0-9A-Za-z\_\-:.]*=(?:[^@\[\]=]+)?))*\])?)+)$/i);
                                    var testRegEx = pattern.test(val);
                                    if(!testRegEx){
                                       amnet.message = val + " format mismatch please check in xml file.";
                                        return false;
                                    }
                                }
                        } else {
                            amnet.message = attrArr[j] + " attribute is missing should be available, please check in xml file";
                            return false;
                        }
                    }
                }
                
                return true;
        }
    
        this.isEmptyVal = function(obj){
            var isEmpty = (obj=="")?true:false;
            return isEmpty;
        }
    
        var check = this.checkObj(json);
        
        return check;
                
}
