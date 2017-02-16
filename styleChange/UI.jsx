#include "Util.jsx"
#include "businesslogic.jsx"

var winRes = "palette {text: 'xxx', alignChildren:  ['left', 'top'], size: [400,200], \
    g0: Group {margins: [0, 0, 0, 0], size: [400, 40], orientation: 'row', alignChildren: ['left', 'center'], \
        imglogo: Image {}, \
        lblVer: StaticText {text: 'Version',size: [250,25], justify:'right'}}, \
    winGroup: Group {margins:[0, 0, 0, 0], orientation: 'column', alignChildren: ['left','top'], \
         g1: Group{margins: [0,0,0,0], size: [400,50], orientation: 'row', alignChildren: ['left', 'center'],\
            lblType: StaticText {text: 'Character Styles', size:[100,25]}, \
            ddList: DropDownList {preferredSize: [250,25]}}, \
         g2: Group {margins:[0, 0, 0, 0], preferredSize: [350, 25], orientation: 'row', alignChildren: ['right','center'], \
            btnOk: Button {text:'Ok',preferredSize:[70,25],properties:{name:'Ok'}, helpTip:'Click here to apply'}, \
            btnClose: Button {text:'Close',preferredSize:[70,25],properties:{name:'Close'}, helpTip:'Close'}}},\
    g99: Group {margins:[0, 10, 10, 10], orientation: 'row', alignChildren: ['left','center'], \
        lblCopy: StaticText {text:'',size: [500,25]}}}";
        
var xmlFileName = "TandF.xml";
 
(function(){
    SELECTTYPE = {
           'para': 1,
           'charr': 2,
           'obj': 3,
        };
})();

var checkObject = function(o){
    //validate object o
    var check = true;
    if(typeof o != "object" || o == null){
        alert("not an valid object, please check");
        check = false;
        return check;
    } else if(!o.hasOwnProperty("name") || !o.hasOwnProperty("txelm") || !o.hasOwnProperty("roots")) {
        alert("attribute missing for this type of style in xml file, please check");
        check = false;
        return check;
    }
    var myCtag = o.txelm;
    if(myCtag == "")
    { 
        alert("element name missing for this type of style in xml file, please check"); 
        check = false; 
        return check;
    }
    return check;
}

var pubCheckArr = "";

var applyCharacterStyle = function(o){

    var chkO = checkObject(o);
    if(!chkO){return};
    
     var appCurrSelection = app.activeDocument.selection[0];
     
     //apply xml tag style
     var styleName = o.name;
     var rootXmlStr = o.roots;
     var xmlElemStr = o.txelm;
     var xmlStrArr = xmlElemStr.split("/");
     var xmlStrArrLen = xmlStrArr.length;
     
     //check for global
     if(rootXmlStr == "*"){
         
         //untag selected text if this element already in selection
         for(var i=0; i<xmlStrArrLen; i++){
                  var xmlStrArrElem = xmlStrArr[i];
                        selectionUntag(appCurrSelection, xmlStrArrElem);
         }

       //select text
        appCurrSelection.select();
        applyNewCharXMLStyle(appCurrSelection.associatedXMLElements[0], xmlElemStr, styleName);
         //apply character style indesign
         appCurrSelection.associatedXMLElements[0].applyCharacterStyle(o.name);
         autoCorrectStyle();
       return;
     }
     
     
    //check root element for character style
    var chkRootElem = checkAssociateXMLRoot(appCurrSelection.associatedXMLElements[0], o.roots, type.charr);
    pubCheckArr = chkRootElem;
    
    if(!chkRootElem.checkHier){ //dont do anything dont have root element
        alert("root xml mismatch");
        return;
    }

      if(xmlElemStr != ""){
          var parentObj = chkRootElem.hierObj.hierParentsObj;
          var tempTextXMlStr = "";
          
           //untag selected text if this element already in selection
           for(var i=0; i<xmlStrArrLen; i++){
                  var xmlStrArrElem = xmlStrArr[i];
                        selectionUntag(appCurrSelection, xmlStrArrElem);
           }
        //select text
        appCurrSelection.select();
        applyNewCharXMLStyle(appCurrSelection.associatedXMLElements[0], xmlElemStr, styleName);
        appCurrSelection.associatedXMLElements[0].applyCharacterStyle(o.name);
            
    }

    autoCorrectStyle();

};

var applyParagraphStyle = function(o){
    
      var chkO = checkObject(o);
      if(!chkO){return};
    
      var appCurrSelection = app.activeDocument.selection[0];
      var selectParaCount = appCurrSelection.paragraphs.length;
      
      if(selectParaCount > 0){
          for(var i=0; i<selectParaCount; i++){
            var curSelPara = appCurrSelection.paragraphs[i];
            var curElement = getAssociateParaXMlElement(curSelPara);
            var styleName = o.name;
            var rootXmlStr = o.roots;
            var xmlElemStr = o.txelm;
            var getAssoXmlElem = "";
            var defaultAtrrib = defaultStyleAttrb.para+ "=" +styleName;
            var xmlElemArr = xmlElemStr.split("/");
            var lastArray = xmlElemArr[xmlElemArr.length-1];
            
            if(lastArray.indexOf("[") != -1){
                lastArray = lastArray.replace("[","["+defaultAtrrib+"@");  
            } else {
                lastArray = lastArray + "["+defaultAtrrib + "]";  
            }
            xmlElemArr.pop();
            xmlElemArr.push(lastArray);
            var xmlElemArrLen = xmlElemArr.length;
            var totalRootStructStr = rootXmlStr +"/" +xmlElemStr;
            var totalRootArr = totalRootStructStr.split("/");
            var rootElem = curElement.rootElem;
            var currElem = curElement.currentElem;
            appCurrSelection.paragraphs[i].select();
            if(rootXmlStr == "*"){
                addRootXmlElement([xmlElemArr[0]], curSelPara); //root element
                if(xmlElemArr.length>1){
                     xmlElemArr = xmlElemArr.slice(1, xmlElemArr.length); //child elements if any
                     addChildXMLElement(xmlElemArr, curSelPara);
                 }
                 appCurrSelection.paragraphs[i].appliedParagraphStyle = o.name;
            } else {
                   getAssoXmlElem = checkAssociateXMLRoot(rootElem, rootXmlStr, type.para);
                   if(!getAssoXmlElem.checkHier){
                        var parent = rootElem;
                        var docRootElement = app.activeDocument.xmlElements[0].markupTag.name;
                        var currParaAssoElement = parent.markupTag.name;
                        if(docRootElement == currParaAssoElement){
                            addRootXmlElement([xmlElemArr[0]], curSelPara); //root element
                            if(xmlElemArr.length>1){
                                xmlElemArr = xmlElemArr.slice(1, xmlElemArr.length); //child elements if any
                                addChildXMLElement(xmlElemArr, curSelPara);
                            }
                            appCurrSelection.paragraphs[i].appliedParagraphStyle = o.name;
                        } else {
                            alert("root mismatch");
                        }
                    } else { //matches with root
                            addRootXmlElement([xmlElemArr[0]], curSelPara); //root element
                            if(xmlElemArr.length>1){
                                 xmlElemArr = xmlElemArr.slice(1, xmlElemArr.length); //child elements if any
                                 addChildXMLElement(xmlElemArr, curSelPara);
                             }
                             appCurrSelection.paragraphs[i].appliedParagraphStyle = o.name;
                    }
            }
          }
      }
};


var appyXmlStyle = function(){

};

var applyObjectStyle = function(o){
    
};

var addStylesDDList = function(ddlist, styles, cv){
        var objLen = cv.length;
        var duplicateArr = [];
        var styleArr = [];
        
        for(var i =0; i<objLen; i++){
              var tempObj = cv[i];
              for (var key in tempObj){
                    if(key == "name"){
                 
                        //check document styles
                        if(amnet.isStyleExist(styles , tempObj[key])){
                            var litem = ddlist.find(tempObj[key]);
                            if(litem == null)
                            {
                                ddlist.add('item', tempObj[key]);
                             }
                            else
                            {
                                duplicateArr.push(tempObj[key]);
                            }
                        }
                        else
                        {
                            styleArr.push(tempObj[key]);
                        }
                     }
               }
        }
    
    //give alert to user
    var duplicateArrLen = duplicateArr.length;
    var styleArrLen = styleArr.length;
    if(duplicateArrLen > 0){
        var join = duplicateArr.join();
        alert(join + " style is duplicated in indesign file, please check");
    }

    if(styleArrLen > 0){
        var join = styleArr.join();
        alert(join + " style is not available in indesign file, please check or create new");
    }
    
};

//check document is open are not
if(amnet.isDocumentOpen()){

        amnet.preventUserIntract(true);
        var doc = app.activeDocument;
            
        if(doc.selection[0] == undefined){
            alert("please select paragraph or text");
            exit();
        }
        
        //get xml file and read to JSON
        var xmlfileName = xmlFileName;
        var filePath = amnet.scriptPath();
               filePath = filePath + "/" + xmlfileName;

        var xmlDOMFile = amnet.getXMLFile(filePath);
        
        if(!xmlDOMFile){
            alert(amnet.message);
            exit();
        }
    
        var xmlToJSON = amnet.convertXmlToJson(xmlDOMFile);
        
        if(!xmlToJSON){
            alert(amnet.message);
            exit();
        }
            
        var validateJson = checkXMLJson(xmlToJSON);
        
        if(!validateJson){
             alert(amnet.message);
            exit();
        }
        
        var version = "1.0";
        var title = "Change Style";
        var png1 = new File(amnet.scriptPath() + "/officelogo.png");
        if(png1.exists)
        {
            
            var win = new Window (winRes);
            var xmlStyles = null;
            var docStyles = null;
            var selItem = null;
            var selStyleType = null;
            
            win.text = title;
            win.g0.lblVer.text += " " + version;
            win.g0.imglogo.image = File(png1.toString());
            win.g99.lblCopy.text += "2016 © Amnet System Pvt Ltd";
        
            win.winGroup.g2.btnClose.onClick = function(){
                    win.close();
               }
           
            win.winGroup.g2.btnOk.onClick = function(){
                    switch(selStyleType)
                    {
                        case SELECTTYPE.para:    
                                            applyParagraphStyle(selItem);
                                            break;
                        case SELECTTYPE.charr:
                                            applyCharacterStyle(selItem);
                                            break;
                        case SELECTTYPE.obj:
                                            alert("under construction");
                                            //applyObjectStyle(selItem);
                                            break;
                        default:
                                        $.writeln("error");
                    
                    }
                
                    win.close();
             }

            win.winGroup.g1.ddList.onChange  = function(){
                if(xmlStyles != null && docStyles != null)
                {
                    selItem= amnet.getJsonKeyObj(xmlStyles, win.winGroup.g1.ddList.selection);
                 }
            }
            
            var fnname = doc.selection[0].constructor.name;
            var winShow = true;
            switch(fnname)
            {
                case "Paragraph": case "InsertionPoint":
                        xmlStyles = xmlToJSON.paragraph.pstyle;
                        docStyles = doc.paragraphStyles;
                        addStylesDDList(win.winGroup.g1.ddList, docStyles, xmlStyles);
                        selStyleType = SELECTTYPE.para;
                        win.winGroup.g1.lblType.text = "Paragraph Styles";
                        break;
                        
                case "Word": case "Character": case "TextStyleRange":
                        xmlStyles = xmlToJSON.character.cstyle;
                        docStyles = doc.characterStyles;
                        addStylesDDList(win.winGroup.g1.ddList, docStyles, xmlStyles);
                        selStyleType = SELECTTYPE.charr;
                        win.winGroup.g1.lblType.text = "Character Styles";
                        break;
                        
                case "TextFrame": case "Group": case "Rectangle":
                        winShow = false;
                        alert ("object style is under construction");
                        
//~                         xmlStyles = xmlToJSON.object.ostyle;
//~                         docStyles = doc.objectStyles;
//~                         addStylesDDList(win.winGroup.g1.ddList, docStyles, xmlStyles);
//~                         selStyleType = SELECTTYPE.obj;
//~                         win.winGroup.g1.lblType.text = "Object Styles";
                        break;
                        
                 case "Text" :  //check multiple paragraphs or single para selection
                        var selectParaCount = doc.selection[0].paragraphs.length;
                        var selParaCharFullCnt = doc.selection[0].paragraphs[0].characters.length;
                               selParaCharFullCnt = selParaCharFullCnt - 2; //omit enter mark and para mark
                        var selParaCharCnt = doc.selection[0].characters.length;
                        
                        if(selectParaCount > 1 || selParaCharFullCnt == selParaCharCnt){//apply paragraph style
                            xmlStyles = xmlToJSON.paragraph.pstyle;
                            docStyles = doc.paragraphStyles;
                            addStylesDDList(win.winGroup.g1.ddList, docStyles, xmlStyles);
                            selStyleType = SELECTTYPE.para;
                            win.winGroup.g1.lblType.text = "Paragraph Styles";
                        } else {//apply characters style
                            xmlStyles = xmlToJSON.character.cstyle;
                            docStyles = doc.characterStyles;
                            addStylesDDList(win.winGroup.g1.ddList, docStyles, xmlStyles);
                            selStyleType = SELECTTYPE.charr;
                            win.winGroup.g1.lblType.text = "Character Styles";
                        }
                    
                        break;
                default:
                    $.writeln ("error");
            }
        
            if(winShow){
                win.show();
            }
        }
        else
        {
            alert("Missing support files");
        }
        amnet.preventUserIntract(false);
}