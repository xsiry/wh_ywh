(function($){	
    var $root = $(".netbar_remote_save_clsf");   
    var addrow = 1 ;
    var _qsource = "netbar_remote";  
    var dialog_param  =  $ssoftDialog.dialog.getData("paramjson") ;
    var pageBindingAction = function(){ 
    	$ssoftDialog.setDialogAction(function(dialogRef,callback,paramjson){
    		var param =form2js(document.getElementById('netbaryc-table-1'));
    		if (param.netbarRemoteLs) {
    			$.each(param.netbarRemoteLs, function(index,data) {
	    			data.netbarid = paramjson.netbarid;
	    		}); 
    		} else {
    			param.netbarRemoteLs = [{netbarid:paramjson.netbarid}];
    		} 
    		var netbarremarks = $("#netbarremarks").val();
    		var actionparam = {"actionname":_qsource} ;
            actionparam.datajson = JSON.stringify(param.netbarRemoteLs) ;
            actionparam.operjson = JSON.stringify({opertype:["batchRemoteUpate"]}) ; 			
		    $sHelper.AjaxSendData("ywh_saveAction",actionparam,'',function(message){
		  	   dialogRef.close();
		    });
		    
		    if (netbarremarks){
		    	actionparam = {"actionname":"netbar_info"} ;
                actionparam.datajson = JSON.stringify({"netbarid":paramjson.netbarid,"netbarremarks":netbarremarks}) ;
                $sHelper.AjaxSendData("ywh_saveAction",actionparam,'',function(message){
			  	     if (callback){
			  	     	callback(message);
			  	     }
			    });
		    } 
    	});
	    $root.on("change", '.table-td-rowone', function(actionobj) {
	        var rowobj = $(this);  
	        if (this.parentNode){
	        	if ($(this.parentNode.parentNode).next().length==0){
		        	addTableNewRow();
		        }
	        } 
	        actionobj.preventDefault();
			rowobj = null ; 
	    });
	    
	    showDbInfo();
    }
     
    var showDbInfo = function(){
    	if (decodeURIComponent(dialog_param.netbarremarks)!='undefined')
    	   $("#netbarremarks").val(decodeURIComponent(dialog_param.netbarremarks));    	 
    	$.getJSON('ywh_queryTableList',{"source" :_qsource,"qtype":"select","qhstr":JSON.stringify({qjson:[{"netbarid":dialog_param.netbarid}]})},
			 function (jsondata) { 
			 	$("#netbaryc-table-1 > tbody").empty();
		 	 	$.each(jsondata, function(index,data) {
		 	 		addrow = addrow+1 ; 
		 	 		var html=template(document.getElementById('netbarRemoteLs-tpl').innerHTML
					 	     , {start:0,startrow:addrow,list:[{a:"1"}],rowdata:data}); 
		            $("#netbaryc-table-1 > tbody").append(html); 
		 	 	}); 
		 	 	 addTableNewRow();
			  }  
		); 
	   
    }
    
    var addTableNewRow = function(){
    	addrow = addrow+1 ; 
    	var html=template(document.getElementById('netbarRemoteLs-tpl').innerHTML
					 	     , {start:0,startrow:addrow,list:[{a:"1"}],rowdata:{}}); 
		$("#netbaryc-table-1 > tbody").append(html);
    }
    
    netbar_remote_save_action = function(){    
		pageBindingAction(); 
		pageSetUp();   
	} 
}(jQuery));