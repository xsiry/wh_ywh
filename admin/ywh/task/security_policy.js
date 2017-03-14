(function($){
	
    var _qsource = "security_policy";	
	var _ModeId = "security_policy_Page_ModelId" ; 
	var $root = $(".security_policypage_clsf");   
	var dataparam = {};
	var setDataParam = function(){
    	delete dataparam["sysusid"] ;  
    	dataparam.sysusid=userAccInfo.sysusid  ;   
    	pageListGrid.init();  
    }
     
    
    var pageBindingAction = function(){
    	
    	$root.on("click", '.security_policy_yydzm', function(actionobj) {
	          var rowobj = $(this);   
	          var _JsonArr = [];
	          var _groupid =  $("#btSecurityComboBoxId").ligerGetComboBoxManager().getValue(); 
	          if (!_groupid){
	          	 $.ligerDialog.error('请选择分组！');
	          	 return ;
	          }
	          $.each(pageListGrid.grid.getSelectedRows(), function(index,data) {
	             _JsonArr.push({"groupid":_groupid,"spid":data.spid});	 
	          });  
	          var actionparam = {"actionname":_qsource}
	          actionparam.datajson = JSON.stringify(_JsonArr) ;
	          actionparam.operjson = JSON.stringify({opertype:["updateGroupSecurityPolicy"]}) ; 			
			  $sHelper.AjaxSendData("ywh_saveAction",actionparam,pageListGrid,function(){
			  	
			  });  
			  actionobj.preventDefault();
			  rowobj = null ; 
	    }) ; 
    	
    	$root.on("click", '.security_policy_querybtn', function(actionobj) {
           var rowobj = $(this);   
	        var _name = $("#security_policy_name").val(); 
	        var security_info = {qjson:[dataparam],qjsonkeytype:[]} ; 
	        if (_name){ 
	           security_info.qjson.push({"spname":_name});
			   security_info.qjsonkeytype.push({"spname":"LIKE_ALL"}) ;    		
	        } 			    
			reloadGridParam(security_info);  
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;  
	    
	    $root.on("click", '.security_policy_createbtn', function(actionobj) {
            var rowobj = $(this);  
            $ssoftDialog.openSsoftSaveDialog("安全策略管理","保存为模板",true,"admin/ywh/task/security_policy_add.html?6",
	        850,600,500,function(message){
	        	if (message.success){
	        		pageListGrid.reload(); 
	        	}
	        },{"spid":""});
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;  
	    
	    $root.on("click", '[data-action="security_policy_copy"]', function(actionobj) {
            var rowobj = $(this);  
            var spid = rowobj.data("spid") ;  
            var spname = decodeURIComponent(rowobj.data("spname")); 
            $.ligerDialog.confirm('确认要复制['+spname+']吗？', function (yes) { 
            	if (yes){
            		var actionparam = {"actionname":_qsource} ; 
	                actionparam.datajson = JSON.stringify({"spid":spid}) ;
	            	actionparam.operjson = JSON.stringify({opertype:["securityPolicyCopy"]}) ; 		
	            	$sHelper.AjaxSendData("ywh_saveAction",actionparam,pageListGrid,function(message){ 
				    });
            	} 
            }); 
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;
	    
	    $root.on("click", '[data-action="security_policy_psedit"]', function(actionobj) {
            var rowobj = $(this);  
            var spid = rowobj.data("spid") ;   
            var spname = rowobj.data("spname") ;   
            $ssoftDialog.openSsoftSaveDialog("安全策略管理","保存为模板",true,"admin/ywh/task/security_policy_add.html",
	        850,600,500,function(message){ 
	        	if (message.success){
	        		pageListGrid.reload();
	        	}
	        },{"spid":spid,"spname":spname});
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;
	    
	    $root.on("click", '[data-action="security_policy_pgdel"]', function(actionobj) {
            var rowobj = $(this);  
            var spid = rowobj.data("spid") ;   
            var delParam={};
			delParam.tid = spid ;
		 	delParam.tname=_qsource ;
		 	//是否删除
		 	$sHelper.deleteData("ywh_delAction/",delParam,pageListGrid,function(message){ 
		 		if (message.success) 
		 			$.ligerDialog.success(message.msg);
		 		else 
		 		 	$.ligerDialog.error(message.msg);
		 	},"是否确认删除所选安全策略？") ;
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	     
    	createPageFunction();
    	setDataParam();
    }
    
    var createPageFunction = function(){  
	     $("#btSecurityComboBoxId").ligerComboBox({
                width : 200,
                url: 'ywh_queryTableList/?source=sys_group&qtype=select@online',   
                valueField : 'groupid', 
                textField: 'groupname',  
                emptyText:'应用到分组',
                onBeforeSelect:function(value,text) {
                	if (value){
                		if (pageListGrid.grid.getSelectedRows().length==0){
	                		$.ligerDialog.error('请先选择要分组的任务！');
	                		return false ;
	                	} 
                	} 
                	return true ;
                }  
            });
    } 
    
    var reloadGridParam = function(parmJsonArr){
    	pageListGrid.grid.set('parms',{qhstr:JSON.stringify(parmJsonArr)}); 
	    pageListGrid.grid.changePage("first") ; 
        pageListGrid.reload();   
    }
    
    var pageListGrid = {
		main : "#security_policy_grid_a", 
		init : function() {
	    var self = this;
		this.grid = $(self.main).ligerGrid({ 
         	columns: [     
         	        { display: '策略名称', name: 'spname' },
         	        { display: '所属分组', name: 'groupname' ,width:100 ,isSort:false},  
         	        { display: '进程查杀', name:'prockil', width:120 ,isSort:false }, 
         	        { display: '可疑驱动拦截', name:'drvip', width:120 ,isSort:false }, 
         	        { display: '窗口查杀', name:'killwds', width:120 ,isSort:false }, 
         	        { display: '进程守护', name:'prgd', width:120,isSort:false  }, 
	                { display: '操作',width:120, render: function (rowdata, rowindex, value){
						var h = "";  
						h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="security_policy_copy" data-spid="'+rowdata.spid+'" data-spname="'+encodeURIComponent(rowdata.spname)+'">复制</a>';
						h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="security_policy_psedit" data-spid="'+rowdata.spid+'" data-spname="'+encodeURIComponent(rowdata.spname)+'">修改</a>'; 
                        h += '<a href="javascript:void(0);" class="mg-5"  data-action="security_policy_pgdel" data-spid="'+rowdata.spid+'">删除</a>' ;	 
						return h;
					  } 							    
	                }
			   ],  
			   parms:{qhstr:JSON.stringify({qjson:[dataparam]})},
	   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
	 		   type:"get", dataAction: 'server',checkbox:true,allowUnSelectRow:true, 
	 		   pageSize: 20,usePager:true, selectRowButtonOnly: false, showTitle: false, 
	           pageSizeOptions:[20,30,50], sortName: 'spid',sortOrder:'DESC',  enabledSort:true, 
	           url:  'ywh_queryTableList/?source='+_qsource,  
	           width: '98%', height: '98%',rownumbers:true  , // heightDiff:70, 	          
	           onAfterShowData : function(currentData) {
	           	  
			   }, onSuccess : function(data, grid) {  
			   	
			   } 
	      });			      
		},				
		reload : function() { 
			this.grid.loadData();
		}  
	} ; 

    security_policy_action = function(){    
		pageBindingAction(); 
		pageSetUp();   
	}
}(jQuery));