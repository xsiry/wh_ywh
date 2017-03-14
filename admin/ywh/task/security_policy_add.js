(function($){
 
	
	var $root = $(".security_policy_add_clsf");   
    var addrow = 1 ;
    var _qsource = "security_policy";  
    var dialog_param  =  $ssoftDialog.dialog.getData("paramjson") ;
    var pageBindingAction = function(){ 
    	$ssoftDialog.setDialogAction(function(dialogRef,callback,paramjson){
    		var param =form2js(document.getElementById('security_policy_addrowdata'));
    		if (!param.spname){
    			$.ligerDialog.error('请输入策略名称!');
    			return false ;
    		}
    		param.spid = paramjson.spid ;
    		param.sysusid=userAccInfo.sysusid  ;   
    		console.log(JSON.stringify(param)); 
    		var actionparam = {"actionname":_qsource} ; 
            actionparam.datajson = JSON.stringify(param) ;
            actionparam.operjson = JSON.stringify({opertype:["saveSecurityPolicy"]}) ; 			
		    $sHelper.AjaxSendData("ywh_saveAction",actionparam,'',function(message){
		  	   dialogRef.close();
		  	   if (callback)
		  	       callback(message);
		    });
    	});
    	
    	 $root.on("change", '.ProcKilList_RowOne', function(actionobj) {
	        var rowobj = $(this);  
	        if (this.parentNode){
	        	if ($(this.parentNode.parentNode).next().length==0){
		        	addEmptyRow('ProcKilList_table','ProcKilList-tpl');
		        }
	        } 
	        actionobj.preventDefault();
			rowobj = null ; 
	    });
	    
	    $root.on("change", '.DrvipList_RowOne', function(actionobj) {
	        var rowobj = $(this);  
	        if (this.parentNode){
	        	if ($(this.parentNode.parentNode).next().length==0){
		        	addEmptyRow('DrvipList_table','DrvipList-tpl');
		        }
	        } 
	        actionobj.preventDefault();
			rowobj = null ; 
	    });
	    
	    $root.on("change", '.KillWdsList_RowOne', function(actionobj) { 
	        var rowobj = $(this);  
	        if (this.parentNode){
	        	if ($(this.parentNode.parentNode).next().length==0){
		        	addEmptyRow('KillWdsList_table','KillWdsList-tpl');
		        }
	        } 
	        actionobj.preventDefault();
			rowobj = null ; 
	    });
	    
	    $root.on("change", '.PrgdList_RowOne', function(actionobj) {
	        var rowobj = $(this);  
	        if (this.parentNode){
	        	if ($(this.parentNode.parentNode).next().length==0){
		        	addEmptyRow('PrgdList_table','PrgdList-tpl');
		        }
	        } 
	        actionobj.preventDefault();
			rowobj = null ; 
	    });
	    
    	showDbInfo();
    }
    
    var showDbInfo = function(){  
    	console.log("dialog_param.spname:="+dialog_param.spname);
    	if (dialog_param.spname!=undefined)
    	  $("#security_policy_name_add").val(decodeURIComponent(dialog_param.spname));
    	if (!dialog_param.spid) return false ;
    	$.getJSON('ywh_queryTableList',{"source" :"security_policy_prockil","qtype":"select","qhstr":JSON.stringify({qjson:[{"spid":dialog_param.spid}]})},
			 function (jsondata) {  
		 	 	 addTableNewRow(jsondata,'ProcKilList_table','ProcKilList-tpl');
			 }
		);  
		
		$.getJSON('ywh_queryTableList',{"source" :"security_policy_drvip","qtype":"select","qhstr":JSON.stringify({qjson:[{"spid":dialog_param.spid}]})},
			 function (jsondata) {  
		 	 	 addTableNewRow(jsondata,'DrvipList_table','DrvipList-tpl');
			 }
		);
		
		$.getJSON('ywh_queryTableList',{"source" :"security_policy_killwds","qtype":"select","qhstr":JSON.stringify({qjson:[{"spid":dialog_param.spid}]})},
			 function (jsondata) {  
		 	 	 addTableNewRow(jsondata,'KillWdsList_table','KillWdsList-tpl' );
			 }
		);
		
		$.getJSON('ywh_queryTableList',{"source" :"security_policy_prgd","qtype":"select","qhstr":JSON.stringify({qjson:[{"spid":dialog_param.spid}]})},
			 function (jsondata) { 
		 	 	 addTableNewRow(jsondata,'PrgdList_table','PrgdList-tpl' );
			 }
		);
    }
    
    var addTableNewRow = function(jsondata,tableid,tplid){ 
    	var tbodyele = $("#"+tableid+" > tbody");
	 	tbodyele.empty();
 	 	$.each(jsondata, function(index,data) {
 	 		addrow = addrow+1 ; 
 	 		var html=template(document.getElementById(tplid).innerHTML
			 	     , {start:0,startrow:addrow,list:[{a:"1"}],rowdata:data}); 
            tbodyele.append(html); 
 	 	});  
    	addEmptyRow(tableid,tplid);
    }
    
    var addEmptyRow = function(tableid,tplid){
    	addrow = addrow+1 ; 
    	var html=template(document.getElementById(tplid).innerHTML
					 	     , {start:0,startrow:addrow,list:[{a:"1"}],rowdata:{}}); 
		$("#"+tableid+" > tbody").append(html);
    }
    
    security_policy_add_action = function(){
    	pageBindingAction(); 
		pageSetUp();   
    }
    	
}(jQuery));