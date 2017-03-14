(function($){
	var _qsource = "sys_group";
	
	var _ModeId = "sys_group_Page_ModelId" ;
	
	var $root = $(".sys_grouppage_clsf");  
	
	var dataparam = {};
    
    var setDataParam = function(){
    	delete dataparam["sysusid"] ;  
    	dataparam.sysusid=userAccInfo.sysusid  ;   
    	pageListGrid.init();  
    }
    
    var addNewWindowsForm= function(){  
       $sHelper.NewWindowsForm(_ModeId); 
    }  
    
    var pageBindingAction = function(){
    	//创建    	
    	$root.on("click", '.sys_group_createbtn', function(actionobj) {
		 	var rowobj = $(this);   
		 	Add_Page_Model(0);
			actionobj.preventDefault();
			rowobj = null ;
	    }) ;
    	  //修改
	    $root.on("click", '[data-action="sys_group_pgedit"]', function(actionobj) {
		 	var rowobj = $(this);  
		 	var groupid = rowobj.data("groupid") ;   
		 	Add_Page_Model(groupid);
			actionobj.preventDefault();
			rowobj = null ;
	    }) ; 
	    
	     //删除
	    $root.on("click", '[data-action="sys_group_pgdel"]', function(actionobj) {
		 	var rowobj = $(this);   
		 	var groupid = rowobj.data("groupid") ; 
		 	var delParam={};
			delParam.tid = groupid ;
		 	delParam.tname=_qsource ;
		 	//是否删除
		 	$sHelper.deleteData("ywh_delAction/",delParam,pageListGrid,function(message){ 
		 		if (message.success) 
		 			$.ligerDialog.success(message.msg);
		 		else 
		 		 	$.ligerDialog.error(message.msg);
		 	},"是否确认删除分组信息？") ;
			rowobj = null ;
	    }) ; 
	    addNewWindowsForm();
	    setDataParam();
    }
    
    
    var pageListGrid = {
		main : "#sys_group_grid_a", 
		init : function() {
	  var self = this;
		this.grid = $(self.main).ligerGrid({ 
         	columns: [      
         	        { display: '分组名称', name: 'groupname'  },  
	                { display: '操作',width:260, render: function (rowdata, rowindex, value){
						var h = "";   
						h += '<a href="javascript:void(0);" class="mg-5" data-action="sys_group_pgedit" data-groupid="'+rowdata.groupid+'">修改分组名称</a>'; 
                        h += '<a href="javascript:void(0);" class=" mg-5"  data-action="sys_group_pgdel" data-groupid="'+rowdata.groupid+'">删除</a>' ;	 
						return h;
					  } 							    
	                }
			   ],  
			   parms:{qhstr:JSON.stringify({qjson:[dataparam]})},
	   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
	 		   type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
	 		   pageSize: 20,usePager:true, selectRowButtonOnly: false, showTitle: false, 
	           pageSizeOptions:[20,30,50], sortName: 'groupid',sortOrder:'ASC',  enabledSort:true, 
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
	
	
	var Add_Page_Model = function(groupid,showtype){ 
    	console.log("groupid:="+groupid); 
	    var modelForm = $('#'+_ModeId).ligerForm({
			inputWidth: 180, labelWidth: 90, space: 20,
		    validate : true,labelAlign: "right", width :"100%",
			fields:[
	        	{name:"groupid",type:"hidden"},   
	        	{display:"分组名称",name:"groupname",validate:{required:true},newline:true,type:"text"} 
			],
			onAfterSetFields:function(){
			}
		});  
		if (groupid>0)		
		{	  
		    $("#groupid").val(groupid); 
	    	$.getJSON('ywh_queryTableList/?source='+_qsource,{"sourceid" : groupid},  
			   function (json) {  	 ;
				    modelForm.setData(json);	  
			   }  
		);  
		} 
	    var modelDialog = $.ligerDialog.open( {
			title : "员工账号管理", 
			target : $('#mydialogdiv'),
			height : 150,width : 360,allowClose:false,
			isHidden : false, 
			buttons : [{
				text : '保存',
				onclick : function(item, dialog) { 
				    if (modelForm.valid()) {   
				   	  	    var savaparm = form2js(document.getElementById(_ModeId)) ;  
				   	  	    savaparm.sysusid = userAccInfo.sysusid; //默认添加账号只能自己看见
				            debugPrint("savaparm:="+JSON.stringify(savaparm)); 
				            $sHelper.AjaxSendData("ywh_saveAction/?actionname="+_qsource,{datajson:JSON.stringify(savaparm)},pageListGrid,function(message){   
				             	    if (message.success) 
				             	    	 $.ligerDialog.success(message.msg) ;
				             	    else 
				             	       $.ligerDialog.error(message.msg) ; 
				             	    addNewWindowsForm();
				             	    dialog.close(); 
				            });  
	                }							   
				}
			  }, 
			  {
				text : '关闭',
				onclick : function(item, dialog) {
			          dialog.close(); 
			          addNewWindowsForm();
				}
			 }  
		   ]
		});
	} ; 
	
	sys_group_action = function(){    
		pageBindingAction(); 
		pageSetUp();   
	} 
}(jQuery));