(function($){
	
	var $root = $(".groupTaskpage_clsf");  
	
	var a_groupid = $sHelper.GetUrlParms("groupid"); 
	
    var pageBindingAction = function(){
        $root.on("click", '.grouptask_yydzm', function(actionobj) {
	          var rowobj = $(this);   
	          var _groupid =  $("#gt_GroupComboBoxId").ligerGetComboBoxManager().getValue(); 
	          if (!_groupid){
	          	 $.ligerDialog.error('请选择分组！');
	          	 return ;
	          }
	          var _JsonArr = [];
	          var netbarlistbox = liger.get("gt_netbarlistid"); 
	          var selecteds = netbarlistbox.getSelectedItems();
              if (!selecteds || !selecteds.length) {
              	$.ligerDialog.error('请选择网吧！');
              	return;
              } 
        	  $.each(selecteds, function(index,data) {
	        	_JsonArr.push({"groupid":_groupid,"netbarid":data.netbarid});	 
	          }); 
	          var actionparam = {actionname:"netbar_info"}
              actionparam.datajson = JSON.stringify(_JsonArr) ;
              actionparam.operjson = JSON.stringify({opertype:["updateGropup"]}) ; 			
			  $sHelper.AjaxSendData("ywh_saveAction",actionparam,'',function(message){
			  	   showNetbarListBox();
			  }); 
			  actionobj.preventDefault();
			  rowobj = null ; 
	    }) ; 	    
        createPageFunction();
        showDbInfo();
    }
    
    var showDbInfo = function(){
    	var queryParam = {"source" : "boot_task","qtype":"select@online"} ;
    	var qhkeyjson = {qjson:[{"groupid":a_groupid}]} ;  
    	queryParam.qhstr=JSON.stringify(qhkeyjson) ;
    	$("#gt_boot_task_lid").empty();
    	$.getJSON('ywh_queryTableList',queryParam,  
			function (jsondata) { 
			 	$.each(jsondata, function(index,data) {
			 	 	$("#gt_boot_task_lid").append("<li>"+data.btname+"</li>");
			 	});	  
			}  
		); 
		queryParam.source = "security_policy"; 
    	$("#gt_security_policy_lid").empty();
    	$.getJSON('ywh_queryTableList',queryParam,  
			function (jsondata) { 
			 	$.each(jsondata, function(index,data) {
			 	 	$("#gt_security_policy_lid").append("<li>"+data.spname+"</li>");
			 	});	  
			}  
	    );  
	    
	    showNetbarListBox();
		 
    }
    
    var showNetbarListBox = function(){
    	var queryParam = {"source" : "netbar_info","qtype":"select@online"} ;
    	var qhkeyjson = {qjson:[{"groupid":a_groupid}]} ;  
    	queryParam.qhstr=JSON.stringify(qhkeyjson) ;
    	var netbarlistbox = liger.get("gt_netbarlistid"); 
    	if (netbarlistbox.data){
    		netbarlistbox.removeItems(netbarlistbox.data); 
    	}    		
    	$.getJSON('ywh_queryTableList',queryParam,function (jsondata) {  
			 	$.each(jsondata, function(index,data) {
			 	 		netbarlistbox.addItems({"netbarid":data.netbarid,"netbarname":data.netbarname});
			 	});	  
			}  
		);  
    }
    
    var createPageFunction = function(){  
	     $("#gt_GroupComboBoxId").ligerComboBox({
                width : 200,
                url: 'ywh_queryTableList/?source=sys_user_group&qtype=select@online',   
                valueField : 'groupid', 
                textField: 'groupname',  
                emptyText:'移动到分组' 
         });
         $("#gt_netbarlistid").ligerListBox({
            isShowCheckBox: true, isMultiSelect: true,
            width:800,height:310,  
            valueFieldID: 'gt_netbarlistval',
            valueField:"netbarid",textField:"netbarname" 
        });  
    } 

    groupTask_action = function(){    
		pageBindingAction(); 
		pageSetUp();   
	}
}(jQuery));