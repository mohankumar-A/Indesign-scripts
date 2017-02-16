#targetengine "session";
#target "InDesign";


app.doScript(File(scriptPath() + "/UI_blind.jsxbin"), ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT);

function scriptPath(){
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
}