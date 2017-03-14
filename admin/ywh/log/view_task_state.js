(function($){
	var _qsource = "viewtaskstate";
	
	var $root = $(".view_task_statepage_clsf");  
	
	var dataparam = {};
	var setDataParam = function(){
    	delete dataparam["sysusid"] ;  
    	dataparam.sysusid=userAccInfo.sysusid  ;   
    	pageListGrid.init();  
    }
	
	var pageBindingAction = function(){
	    $root.on("click", '.query_bt', function(actionobj) {
            var rowobj = $(this);  
	        var qhkeyjson = {qjson:[dataparam],qjsonkeytype:[]} ;  
	        var param =form2js(document.getElementById('view_task_query_frm_a'));
	        qhkeyjson.qjson.push(param);
 			debugPrint("param：="+JSON.stringify(param)); 
 			for(var value in param){   
			   if (param.netbarname) {
			   	 qhkeyjson.qjson.push({"netbarname":param.netbarname}); 
			   	 qhkeyjson.qjsonkeytype.push({"netbarname":"LIKE_ALL"});   
			   } 
			   break ;
			}  
			reloadGridParam(qhkeyjson);  
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	    
	    //清除查询
	    $root.on("click", '.query_clearbt', function(actionobj) {
		 	var rowobj = $(this);   
		 	$("#tasktype").val("");
		 	$("#state").val("");
			$('#view_task_query_frm_a')[0].reset() ;
			var qhkeyjson = {qjson:[dataparam],qjsonkeytype:[]} ;  
			reloadGridParam(qhkeyjson);  
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;
	 
	   setDataParam();
	   createQueryFrom();
	}
	
	 var reloadGridParam = function(parmJsonArr){
    	pageListGrid.grid.set('parms',{qhstr:JSON.stringify(parmJsonArr)}); 
	    pageListGrid.grid.changePage("first") ; 
        pageListGrid.reload();   
    }
    
    var pageListGrid = {
    	main : "#view_task_state_grid_a", 
		init : function() {
	    var self = this;
		this.grid = $(self.main).ligerGrid({ 
         	columns: [   
         	        { display: '网吧ID', name: 'ucid' },
         	        { display: '网吧名称', name: 'netbarname' },
         	        { display: '任务类型', name: 'tasktype' ,width:200  },  
         	        { display: '详情', name:'details', width:260 }, 
         	        { display: '任务状态', name:'state', width:120 , render: function (rowdata, rowindex, value){
         	        	if ('游戏下载'==rowdata.tasktype){
         	        		if (value==1)
         	        	      return '<span class="badge bg-color-orange">执行中</span>';
         	        	   else return '<span>已下发</span>';
         	        	} else   return '<span>已下发</span>';
         	        	 
					  }    
         	       }
			   ],  
			   parms:{qhstr:JSON.stringify({qjson:[dataparam]})},
	   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
	 		   type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
	 		   pageSize: 20,usePager:true, selectRowButtonOnly: false, showTitle: false, 
	           pageSizeOptions:[20,30,50],  enabledSort:true, 
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
    }
    
    var queryform ;
     //创建表单
    var createQueryFrom =function(){ 		   
        queryform = $('#view_task_query_frm_a').ligerForm({
			inputWidth: 120, labelWidth: 65, space:10,
		    validate : true,labelAlign: "right", width :"99%",
			fields:[   
				 {label:'网吧名称',name:"netbarname",newline:false,type:"text",attr:{placeholder:"支持模糊查询"}} ,   
			     {label:"日志类型",name:"tasktype",newline:false,type:"select",attr:{id:"tasktype_id"},comboboxName: "tasktype",options:{data:[{text:'游戏下载',id:'游戏下载'},{ text: '开机任务', id: '开机任务'},{ text: '安全策略', id: '安全策略'}] ,width:100 }},
			     {label:"任务状态",name:"state",newline:false,type:"select",attr:{id:"state_id"} ,comboboxName: "state",options:{data:[{text:'执行中',id:'1'},{ text: '已下发', id: '2'}] ,width:100 }} 
			],
			onAfterSetFields : function(){   
			}
		 }); 
	} ; 
	
	view_task_state_action = function(){    
		pageBindingAction(); 
		pageSetUp();   
	} 

}(jQuery));