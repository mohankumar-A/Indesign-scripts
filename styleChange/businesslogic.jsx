#include "Util.jsx"

var type = {"charr":1,"para":2 };
var defaultStyleAttrb = {"charr": "aid:cstyle", "para": "aid:pstyle"};

var getAssociateParaXMlElement = function(cPara){
    var myCurrentXMLElem = null;
    cPara.select();
    var index = cPara.index;
    var myCurrentXMLElem = {};
    var rootElem = "";
    var currentElem = "";
    
    if(app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[1] != undefined){
        rootElem = app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[0];
        app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[1].xmlContent.select();
        var currentIdx = app.activeDocument.selection[0].index;
        if(index == currentIdx || index == (currentIdx-1)){
            currentElem = app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[1];
        } else {
            currentElem=null;
        }
        myCurrentXMLElem.rootElem = rootElem;
        myCurrentXMLElem.currentElem = currentElem;
        return myCurrentXMLElem;
    } else {
            var xmlElements = app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[0].xmlElements;
            var xmlElementsArrLen = xmlElements.length;
            if(xmlElementsArrLen > 0){
                if(xmlElementsArrLen == 1){
                       rootElem = app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[0];
                       xmlElements.lastItem().xmlContent.select();
                       var currentIdx = app.activeDocument.selection[0].index;
                       if(index == currentIdx || index == (currentIdx-1)){
                            currentElem=xmlElements.lastItem();
                       } else {
                            currentElem=null;
                       }
                       myCurrentXMLElem.rootElem = rootElem;
                       myCurrentXMLElem.currentElem = currentElem;
                       return myCurrentXMLElem;
                }
                
                for(var j=0; j<xmlElementsArrLen; j++){

                        if(index == xmlElements[j].paragraphs[0].index || index == (xmlElements[j].paragraphs[0].index+1)){
                               xmlElements[j].xmlContent.select();
                               var currentIdx = app.activeDocument.selection[0].index;
                               if(index == currentIdx || index == (currentIdx-1)){
                                    currentElem=xmlElements[j];
                                } else {
                                    currentElem=null;
                                }
                            rootElem = app.activeDocument.selection[0].paragraphs[0].associatedXMLElements[0];
                            myCurrentXMLElem.rootElem = rootElem;
                            myCurrentXMLElem.currentElem = currentElem;
                            return myCurrentXMLElem;
                        }
                }
         }
    }
    
    rootElem = app.activeDocument.selection[0].associatedXMLElements[0];
    myCurrentXMLElem.rootElem = rootElem;
    myCurrentXMLElem.currentElem = null;
  
 return myCurrentXMLElem;
}

var getElemAttrib = function(arrElem, elemObj){
    var obj = {};
    var isAttribMatch = false;
    var hasRootAttrib = true;
    var hasXMLRootAttrib = true;
    var matchIdxArr = [];
           if(arrElem.indexOf("[") == -1){
                obj.isAttribMatch = isAttribMatch;
                obj.hasRootAttrib = elemObj.hasContainsAttrib;
                obj.hasXMLRootAttrib = false;
                obj.isAttribMatch = false;
                obj.matchIdxArr = [];
                return obj;
           }
          arrElem = arrElem.match(/\[([^)]+)\]/)[1];
          arrElem = arrElem.split("@");
    var arrLen = arrElem.length;
    
    if(arrLen == 0){hasXMLRootAttrib = false;}
    var hasAttrib = elemObj.hasContainsAttrib;
    if(!hasAttrib){hasRootAttrib = false;}
    var attribArr = elemObj.attrbList;
    var attrLen = attribArr.length;
    var tCount =0;
    
    for(var i=0; i<attrLen; i++){
        var lArr = attribArr[i];
        for(var j=0; j<arrLen; j++){
            var lCheckAttr = arrElem[j];
                   lCheckAttr = lCheckAttr.split("="); //length will be two
                   if(lCheckAttr.length != 2){alert("check xml file, attribute missing for "+arrElem[j]); return null;}
                   if(lArr.value == " "){lCheckAttr[1] = " "}
                    if(lArr.name == lCheckAttr[0] && lArr.value == lCheckAttr[1]){
                        matchIdxArr.push(i+","+j);
                        tCount++;
                    }
        }
    }

    var matchIdxArrLen = matchIdxArr.length;
    if(matchIdxArrLen == arrLen){
        isAttribMatch = true;
    }
    
    obj.isAttribMatch = isAttribMatch;
    obj.hasRootAttrib = hasRootAttrib;
    obj.hasXMLRootAttrib = hasXMLRootAttrib;
    obj.isAttribMatch = isAttribMatch;
    obj.matchIdxArr = matchIdxArr;
    return obj;
}

var getElementAttribObj = function(aXMLElems){
    var obj = {};
    var hasContainsAttrib = false;
    var elemName = "";
    var attrbListArr = [];
    var attribLength = 0;
    var thisStr = aXMLElems.toString();
    if(thisStr != "[object XMLElement]" || typeof aXMLElems != "object"){ alert("not valid type of xml element passed"); return null; }
           elemName = aXMLElems.markupTag.name;
    var attrbList = aXMLElems.xmlAttributes;
    var attrbListLen = attrbList.length;
    if(attrbListLen > 0){
        hasContainsAttrib = true;
        attribLength = attrbListLen;
        for(var i=0; i<attrbListLen; i++){
            var tempList = {};
            tempList.name = attrbList[i].name;
            tempList.value = attrbList[i].value;
            if(tempList.value == ""){tempList.value = " "}
            attrbListArr[i] = tempList;
        }
    }
    //add to obj
    obj.name = elemName;
    obj.hasContainsAttrib = hasContainsAttrib;
    obj.attrbList = attrbListArr;
    obj.attribLength = attribLength;
    obj.parent = aXMLElems.parent;
    obj.thisXMLElem = aXMLElems;
    return obj;
}

var checkAssociateXMLRoot = function(curXml, rootArr, type){
    var curSelXml = curXml;
    var roots = rootArr;
        
    //check root element
    var rootElemsArr = roots.split("|");
    var xmlObj = checkRootElement(rootElemsArr, curXml, type);
    return xmlObj;
}


var checkRootElement = function(arr, elemObj, elemType){
        
        if(typeof arr != "object"){
            return false;
        }
    
        var arrO = arr;        
        var len = arr.length;

        var checkObj = {};
        var checkHier = false;
        var matchRootIdx = "";
        var hierObj = {};
        var getHier = "";
        
        for(var i=0; i<len; i++){
             var tempStr = arrO[i];
                    getHier = checkHierachy(tempStr, elemObj);
                    hierObj = getHier;
                    if(getHier.isValidHierchy && getHier.isValidHierchyAttrib){
                         matchRootIdx = i;
                         checkObj.checkHier = true;
                         checkObj.matchRootIdx = matchRootIdx;
                         checkObj.hierObj = getHier;
                         return checkObj;
                    }
        }
    
    checkObj.checkHier = checkHier;
    checkObj.matchRootIdx = matchRootIdx;
    checkObj.hierObj = hierObj;
    return checkObj;
}

var inArray = function(needle, haystack) {
    var length = haystack.length;
    var o ={};
    var isExist = false;
    var matchIdx = "";
    var newArray = [];
    for(var i = 0; i < length; i++) {
        newArray.push(haystack[i]);        
        if(haystack[i] == needle){
            isExist = true;
            matchIdx = i;
            o.isExist = isExist;
            o.matchIdx = matchIdx;
            o.newArray = newArray;
            return o;
        }
    }
    o.isExist = isExist;
    o.matchIdx = matchIdx;
    o.newArray = newArray;
    return o;
}

var checkHierachy = function(rootArr, assoXML){
    
    var xmlObj = {};
    var curSelXml = assoXML;
    var isValidHierchy = true;
    var isValidHierchyAttrib = true;
    var hierParentsObj = [];
    var hierParentsAttribObj = [];
    var mismtchAttribIdx = [];
    var matchIdx = [];
    var sibArr =[];
    
    var roots = rootArr;
    var rootsArr = roots.split("/");
    var markupTagNm = assoXML.markupTag.name
    var tempHierchy = curSelXml;
    var arrLen = rootsArr.length;
    var arrayContainsRoot = inArray(markupTagNm, rootsArr);
    
    //check for root existance
    if(arrayContainsRoot.isExist){
        var idx = arrayContainsRoot.matchIdx;
        matchIdx = idx;
        rootsArr = arrayContainsRoot.newArray;
        sibArr = rootsArr;
        arrLen = rootsArr.length;
    }
        
    for(var i=arrLen-1; i>=0; i--){
         var tempHierchyName = "";
         var elemName = rootsArr[i].replace(/\s*\[.*?\]\s*/g, ""); // removeAttrib
         var elemAttribName = rootsArr[i];
         var getParentXML = "";
         
            if(i == arrLen-1){
                tempHierchy = tempHierchy
            } else {
                tempHierchy = tempHierchy.parent;
            }
            
            var tempHierchyName = tempHierchy.markupTag.name;
            if(tempHierchyName != elemName){
                    isValidHierchy = false;
                    getParentXML = getElementAttribObj(tempHierchy);
            } else { //check for attrib
                getParentXML = getElementAttribObj(tempHierchy);
                var getAttribO = getElemAttrib(elemAttribName, getParentXML);
                if(!getAttribO.isAttribMatch && getAttribO.hasXMLRootAttrib){isValidHierchyAttrib = false; mismtchAttribIdx.push(i) }
                hierParentsAttribObj[i] = getAttribO;
            }
        
        hierParentsObj[i] = getParentXML;
    }

    if(!isValidHierchy) {isValidHierchyAttrib = false;}
    
    xmlObj.hierParentsObj = hierParentsObj;
    xmlObj.isValidHierchy = isValidHierchy;
    xmlObj.hierParentsAttribObj = hierParentsAttribObj;
    xmlObj.isValidHierchyAttrib = isValidHierchyAttrib;
    xmlObj.mismtchAttribIdx = mismtchAttribIdx;
    xmlObj.matchIdx = matchIdx;
    xmlObj.sibblingsArray = sibArr;
    return xmlObj;
}

var getInsertionPointRange = function(selection){
    
    if(typeof selection != "object"){
        alert("invalid object"); 
        return;
    } else {
        var selStr = selection.toString();
        var insertionRange = {};
        var startIndex = selection.index;
        var selectionLength = selection.characters.length;
        var endIndex = (selectionLength == 0) ? startIndex : (startIndex+selectionLength);
        insertionRange.startIndex = startIndex;
        insertionRange.endIndex = endIndex;
        return insertionRange;
      }
}

var untagParentElement = function(xmlElement){
    xmlElement.texts[0].select();
    app.menuActions.itemByID(78612).invoke();
}


var getParaAssociateChildElements = function(){
    var selectPara = app.activeDocument.selection[0].paragraphs[0];
    var assoXMLElem = getAssociateParaXMlElement(selectPara);
    var sibblingArray = [];
    var xmlElements = "";
    
    if(assoXMLElem.currentElem == null){
        return sibblingArray;
    } else {
        xmlElements = assoXMLElem.currentElem.xmlElements;
        sibblingArray = getAssociateChildElements(xmlElements);
    }
    childSibblingArray = [];
    return sibblingArray;
}

var childSibblingArray = [];

var getAssociateChildElements = function(xmlElems){
    var xmlElementsLength = xmlElems.length;
    var xmlElement = "";
    var xmlChildElements = "";
        
    for(var i=0; i<xmlElementsLength; i++){
        xmlElement = xmlElems[i];
        xmlChildElements = xmlElement.xmlElements;
        childSibblingArray.push(xmlElement);
        if(xmlChildElements.length != 0){
                getAssociateChildElements(xmlChildElements)
        }
    }
    return childSibblingArray;
}


var selectionUntag = function(appCurrSelection, xmlStr){
    var selection = appCurrSelection;
    var range = getInsertionPointRange(selection);
    var associateChildElems = getParaAssociateChildElements();
    var childLength = associateChildElems.length;
    var xmlTextElemStr = xmlStr;
    var rootElem = xmlTextElemStr.replace(/\s*\[.*?\]\s*/g, ""); //remove any attribs
    var childElement = "";
    var childIndex = "";
    var xmlElemObj = "";
    var markupTag = "";
    var getAttribO = "";
    for(var i=0; i<childLength; i++){
        childElement = associateChildElems[i];
        childElement.texts[0].select();
        childIndex = app.activeDocument.selection[0].index;
        xmlElemObj = getElementAttribObj(childElement);
        markupTag = xmlElemObj.name;
        
        //check for range index, if exist in range delete
        if(childIndex >= range.startIndex && childIndex <= range.endIndex){
            
            //check for element and attribs match and then delete
            if(markupTag == rootElem){
                
                getAttribO = getElemAttrib(xmlTextElemStr, xmlElemObj);
                
                if((getAttribO.isAttribMatch && getAttribO.hasXMLRootAttrib) || (!getAttribO.hasXMLRootAttrib)){
                    untagParentElement(childElement);
                    associateChildElems = getParaAssociateChildElements();
                    childLength = associateChildElems.length;
                    i=-1;
                }

            }
        
        }
    
    }
}

var getXMLTextElement = function(currO, xmlStr){
    var name = currO.name;
    var hasAttrib = currO.hasContainsAttrib;
    var attrbList = currO.attrbList;
    var attrbListLen = attrbList.length;
    var rootElem = xmlStr.replace(/\s*\[.*?\]\s*/g, ""); //remove any attribs
    var rootAttribStr = "";
    var rootAttribArr = [];
    var rootAttribLen = "";
    var matchIdxArr = [];
    var isAttribMatch = false;
    var isElemMatch = false;
    var obj = {};
    
    if(xmlStr.indexOf("[") != -1){
            rootAttribStr = xmlStr.match(/\[([^)]+)\]/)[1];
            rootAttribArr = rootAttribStr.split("@");
            rootAttribLen = rootAttribArr.length;
    } else {
        isAttribMatch = true;
    }

    if(name == rootElem){
        isElemMatch = true;
        
        for(var i=0; i<attrbListLen; i++){
            
            var lArr = attrbList[i];
            
            for(var j=0; j<rootAttribLen; j++){
                var lCheckAttr = rootAttribArr[j];
                       lCheckAttr = lCheckAttr.split("="); //length will be two
                       if(lCheckAttr.length != 2){alert("check xml file, attribute missing for "+arrElem[j]); return null;}
                       if(lArr.value == " "){lCheckAttr[1] = " "}
                       if(lArr.name == lCheckAttr[0] && lArr.value == lCheckAttr[1]){
                            matchIdxArr.push(i+","+j);
                       }  
            }
        }

        var matchIdxArrLen = matchIdxArr.length;
        if(matchIdxArrLen == rootAttribLen){
            isAttribMatch = true;
        }
    }
    obj.isElemMatch = isElemMatch;
    obj.isAttribMatch = isAttribMatch;

    return obj;
}

//rename new xml elements to selection
var applyNewCharXMLStyle = function(appSel, elem, styleNm){
    var texElem = elem;
    var elemArr = texElem.split("/");
    var elemArrLen = elemArr.length;
    var defName = "";
    var defVal = styleNm;
    var indElem = "";
    var rootElem = "";
    var mySelElement = appSel;
    var appCurrSelection = appSel;
    var markupTag = appCurrSelection.markupTag.name;
    var mySelElementText = app.activeDocument.selection[0];
    
        
    for(var i=0; i<elemArrLen; i++){
        indElem = elemArr[i];
        rootElem = indElem.replace(/\s*\[.*?\]\s*/g, ""); //remove any attribs
        var rElem = app.activeDocument.xmlTags.item(rootElem).isValid ? app.activeDocument.xmlTags.item(rootElem) : app.activeDocument.xmlTags.add({name: rootElem});
        
        if(i == 0){
            mySelElementText = mySelElementText;
        } else {
                mySelElementText = (mySelElement.toString() == "[object XMLElement]") ? mySelElement.xmlContent : mySelElementText;
        }
        mySelElementTag = mySelElement.xmlElements.add(rElem, mySelElementText, undefined);
        mySelElement = mySelElementTag;
        
        var xmlAttribs = appCurrSelection.xmlAttributes;
        var tXmlAtt = ""
        
        //add default attribs
        defName = defaultStyleAttrb.charr;
        mySelElement.xmlAttributes.add(defName, defVal);
        
        //add more attribs if any
        if(indElem.indexOf("[") != -1){
                var attrbElem = indElem.match(/\[([^)]+)\]/)[1];//remove any root elem
                var myCAttArr = attrbElem.split("@");
                var myCAttArrLen = myCAttArr.length;
                if(myCAttArrLen > 0){
                    for(var j=0; j<myCAttArrLen; j++){
                            if(myCAttArr[j] != ""){
                                var attbVal = myCAttArr[j].split("=");
                                var attNm = attbVal[0];
                                var attVal = attbVal[1];
                                if(attbVal[1] == "undefined" || attbVal[1] == null) attVal = "";
                                mySelElement.xmlAttributes.add(attNm, attVal);
                            }
                    }
                }
        }
    }
     //alert("success");
}

var addChildXMLElement = function (texElemArr, curSelPara){
    var curPara = getAssociateParaXMlElement(curSelPara);
    var arr = texElemArr;
    var sibblingArray = getParaAssociateChildElements();
    var arrLength = sibblingArray.length;
    var assoObj = getMissingArray(arr, sibblingArray);
    var missingObj = assoObj.matchXMLElemArr;
    var missingObjAttb = assoObj.matchXMLAttribArr;
    var mySelElement = curPara.currentElem;
    var mySelElementTag = "";
    var myXmlElements = "";
    var missingObjLen = missingObj.length;
    var rootElemAttrib = "";
    var rootElem = "";
    var mySelElementText = mySelElement;
       
    if(mySelElement == null){ //current element should not be null while adding child element
        return false;
    }
    
    for(var i=0; i<missingObjLen; i++){
        rootElemAttrib = arr[i];
        rootElem = rootElemAttrib.replace(/\s*\[.*?\]\s*/g, ""); //remove any attribs
        
        if(missingObj[i] == " "){
                var rElem = app.activeDocument.xmlTags.item(rootElem).isValid ? app.activeDocument.xmlTags.item(rootElem) : app.activeDocument.xmlTags.add({name: rootElem});
                mySelElementText = (mySelElement.toString() == "[object XMLElement]") ? mySelElement.xmlContent : mySelElementText;
                mySelElementTag = mySelElement.xmlElements.add(rElem, mySelElementText, undefined);   
                mySelElement = mySelElementTag;
                addXMLAttributes(arr[i], mySelElement); //add xml attributes;
        } else {
            if(typeof missingObj[i] == "object" && missingObj[i].toString() == "[object XMLElement]"){
                if(missingObj[i].isValid){
                    mySelElement = missingObj[i];
                    //check for attribs change
                    if(missingObjAttb[i] != " "){
                        removeAttribs(missingObjAttb[i]); //remove all attribs
                        addXMLAttributes(arr[i], missingObjAttb[i]);
                    }
                }
            }
        }
    }
}

var addXMLAttributes = function(xmlStr, xmlElment){
    var rootElemAttrib = xmlStr;
    var mySelElement = xmlElment;
    var rootAttribStr = "";
    var rootAttribArr = "";
    var rootAttribLen = "";
    
     if(rootElemAttrib.indexOf("[") != -1){
        rootAttribStr = rootElemAttrib.match(/\[([^)]+)\]/)[1];
        rootAttribArr = rootAttribStr.split("@");
        rootAttribLen = rootAttribArr.length;
    }

    //add attributes
     if(rootAttribLen > 0){
        for(var j=0; j<rootAttribLen; j++){
                if(rootAttribArr[j] != ""){
                    var attbVal = rootAttribArr[j].split("=");
                    var attNm = attbVal[0];
                    var attVal = ((attbVal[1] == undefined) || (attbVal[1] == null)) ? " " : attbVal[1];
                    xmlElment.xmlAttributes.add(attNm, attVal);
                }
        }
    }
}


var removeAttribs = function(xmlElment){
    var attributesArray = xmlElment.xmlAttributes;
    var len = attributesArray.length;
    while (len--) {
        attributesArray[len].remove();
    }
}

var addRootXmlElement = function(textArr, selPara){
    untagparaRootPara(selPara); //untag all root para elements
    var arr = textArr;
    var rElem = "";
    var rootElemAttrib = arr[0];
    var rootElem = rootElemAttrib.replace(/\s*\[.*?\]\s*/g, ""); //remove any attribs
    var curElement = getAssociateParaXMlElement(selPara);
    var curPara = curElement.currentElem;
    
    if(curPara == null ){ //create all elements
        selPara = app.activeDocument.selection[0].paragraphs[0];        
        mySelElement = selPara.associatedXMLElements[0];
        rElem = app.activeDocument.xmlTags.item(rootElem).isValid ? app.activeDocument.xmlTags.item(rootElem) : app.activeDocument.xmlTags.add({name: rootElem});
        var adjus = 1;
        var content = selPara.contents;
        var test = content.match(/([\ufeff]+)(?:[\n\r]+)?$/gi);
        var test1 = content.match(/([\n\r]+)?$/gi);
        
        if(test != null){
            if(test.length > 0){
                adjus += test[0].length;
            }
        } else if(test1 != null){
            if(test1.length > 0){
                adjus += test1[0].length;
            }
        }
        
        selPara.characters.itemByRange(0, (selPara.characters.length-adjus)).select();
        mySelElementText = app.activeDocument.selection[0];
        mySelElementTag = mySelElement.xmlElements.add(rElem, mySelElementText, undefined);   
        addXMLAttributes(arr[0], mySelElementTag);
    } else {
        alert("no element is created");
    }
//~     } else {
//~             curPara.markupTag = rootElem;
//~             removeAttribs(curPara)
//~             addXMLAttributes(arr[0], curPara); //add xml attributes;
//~     }
}



var getMissingArray = function(elemArr, childArr){
    var elemArrLen = elemArr.length;
    var childArrLen = childArr.length;
    var tempTextXMlStr = "";
    var obj = {};
    var matchXMLElemArr = [];
    var matchXMLAttribArr = [];
    var count = 0;
    var elemAttribChild = "";
    for(var i=0; i<elemArrLen; i++){
        var child = childArr[count];
        count++;
         if(child != undefined && typeof child == "object" && child.toString() == "[object XMLElement]"){
             if(child.isValid){
                elemAttribChild = getElementAttribObj(child);
                tempTextXMlStr = getXMLTextElement(elemAttribChild, elemArr[i]);
                if(tempTextXMlStr.isElemMatch && tempTextXMlStr.isAttribMatch){
                    matchXMLElemArr.push(child);
                    matchXMLAttribArr.push(" ");
                }else if(tempTextXMlStr.isElemMatch && !tempTextXMlStr.isAttribMatch){
                    //rename attrib
                    matchXMLElemArr.push(child);
                    matchXMLAttribArr.push(child);
                }else {
                   count = count-1;
                   matchXMLElemArr.push(" ");
                   matchXMLAttribArr.push(" ");
                }
            }
         } else {
            matchXMLElemArr.push(" ");
            matchXMLAttribArr.push(" ");
        }
    }
    obj.matchXMLElemArr = matchXMLElemArr;
    obj.matchXMLAttribArr = matchXMLAttribArr;
    return obj;
}

var autoCorrectStyle = function(){
    var sibblingArray = getParaAssociateChildElements();
    var arrLength = sibblingArray.length;
    var doc = app.activeDocument;
    for(var i=0; i<arrLength; i++){
        var tempChild = sibblingArray[i];
        var attributesArr = tempChild.xmlAttributes;
        var defaultAttrib = defaultStyleAttrb.charr;
        var getAttribItem = attributesArr.itemByName(defaultAttrib);
        if(getAttribItem.isValid){
            var styleName = getAttribItem.value;
            var stylesList = doc.characterStyles;
            var checkStyleExist = amnet.isStyleExist(stylesList , styleName);
            if(checkStyleExist){
                tempChild.applyCharacterStyle(styleName);
            }
        }
    }    
}

var untagparaRootPara = function(curSelPara){
    var curElement = getAssociateParaXMlElement(curSelPara);
    var rootElem = curElement.rootElem;
    var currElem = curElement.currentElem;
    if(currElem != null){
        currElem.xmlContent.select();
        app.menuActions.itemByID(78612).invoke();
        untagparaRootPara(curSelPara);
    }
}



