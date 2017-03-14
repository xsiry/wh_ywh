(function($){ 
	
    var dateparam ={} ;// {"ap_type":"miniban"};   
    var _subTableName ; 
    var _modelTitle; 
    var showdetailFunc ; 
    ab_page_Init = function(p_ap_type,p_subTableName,p_modelTitle,p_showdetailFunc,paramCallBack){   
    	console.log("--ab_page_Init---,p_ap_type:="+p_ap_type+",p_subTableName:="+p_subTableName+",p_modelTitle:="+p_modelTitle);
    	dateparam.ap_type = p_ap_type ;
    	_subTableName = p_subTableName ;
    	_modelTitle = p_modelTitle ;
    	showdetailFunc = p_showdetailFunc ; 
    	if (paramCallBack){
    		paramCallBack(dict_game_rowParam,dict_name_rowParam);
    	}  
		createQueryFrom();  
		pageBindingAction(); 
		pageSetUp();   
	}
     
    var _tableName = "ad_page";  
    
    var _ModeId = "Ab_Page_ModelId" ;
    
    var $root = $(".ad_page_clsf"); 
    
    var _showDetailRow ; 
    //游戏选择
    var  dict_game_rowParam =  {display:"游戏编号",name:"ad_gameno",validate:{required:true},newline:false,type:"select",comboboxName: "ad_gameno",attr:{id:"ad_gameno_frmid"} ,options:{
					   slide: false,selectBoxWidth: 450,selectBoxHeight: 240,valueField: 'dict_gameid', textField: 'dict_game', grid: {
			                columns: [
			                { display: '游戏ID', name: 'dict_gameid',  width: 100  },
			                { display: '游戏名称', name: 'dict_game', width: 160 },
			                { display: '游戏分类', name: 'dict_type', width: 120 } 
			                ], switchPageSizeApplyComboBox: false,
			                type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
			 		        pageSize: 30, selectRowButtonOnly: false, showTitle: false, 
			                pageSizeOptions:[ 30,50,100],   
			                enabledSort:true,  url:'queryTableList/?source=dict_game_list' 
			           }, 
			           condition: { fields: [{ name: 'dict_game', label: '游戏名称', width:120,attr:{placeholder:"支持模糊查询"}}] } ,
			            customButton :  {
			           	  id:"dictAdGameSrcId",name:"同步游戏数据" ,width:120, callback:function(e){ 
							 	liger.get('dictAdGameSrcId').setDisabled(); 
							 	var actionparam = {} 
							 	actionparam.datajson = JSON.stringify({"ap_id":ap_id}) ;
					            $sHelper.AjaxSendData("saveAction/?actionname=dict_game_list",actionparam,null,function(){ 
					            	 liger.get('dictAdGameSrcId').set('disabled', false);
					            	 e.grid.reload();
					            },true);  
			           	  } 
			           },
			           conditionSearchClick: function (e)
		               {  
							var q_combo_dict_game = "";
		                	if (e.rules[0])
		                	   q_combo_dict_game = e.rules[0].value;
		                	if ($sHelper.trim(q_combo_dict_game)) {  
		                		var comb_qhkeyjson = {qjson:[]} ; 
		                        comb_qhkeyjson.qjson.push({"dict_game":q_combo_dict_game});
	   					        comb_qhkeyjson.qjsonkeytype = [{"dict_game":"LIKE_ALL"}] ;    					    
		                        e.grid.set('parms',{qhstr:JSON.stringify(comb_qhkeyjson)});
		                	} else {
		                		 e.grid.set('parms',"");
		                	}
		                    e.grid.reload();   
		               }
		        	  }  
	  } ;
	//广告选择  
	var dict_name_rowParam = {display:"广告ID",name:"ad_id",validate:{required:true},newline:true,type:"select",comboboxName: "ad_id",attr:{id:"ad_id_frmid"} 
        	,options:{
			   slide: false,selectBoxWidth: 350,selectBoxHeight: 240,valueField: 'dict_ad', textField: 'dict_name', grid: {
	                columns: [
	                { display: '广告ID', name: 'dict_ad',  width: 100  },
	                { display: '广告名称', name: 'dict_name', width: 160 }  
	                ], switchPageSizeApplyComboBox: false,
	                type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
	 		        pageSize: 30, selectRowButtonOnly: false, showTitle: false, 
	                pageSizeOptions:[ 30,50,100],   
	                enabledSort:true,  url:'queryTableList/?source=dict_ad_list' 
//	                , onSelectRow : function (rowdata, rowindex, rowobj)
//					{ 
//					   $("#ban_name_cid").val(rowdata.dict_name);
//					   $("#ban_title_cid").val(rowdata.dict_name);
//					}  
	           }, 
	           condition: { fields: [{ name: 'dict_name', label: '广告名称', width:120,attr:{placeholder:"支持模糊查询"}}
//			                                 ,{htmltx:'<div style="text-align: right;"><a class="btn btn-primary btn-xs all_synchronization_ad"  href="javascript:void(0);" data-apid="'+ap_id+'">同步广告数据</a></div>'}
	            ] } ,
	           customButton :  {
	           	  id:"dictAdListSrcId",name:"同步广告数据" ,width:120, callback:function(e){ 
	           	  	    liger.get('dictAdListSrcId').setDisabled(); 
					 	var actionparam = {} 
					 	actionparam.datajson = JSON.stringify({"ap_id":ap_id}) ;
			            $sHelper.AjaxSendData("saveAction/?actionname=dict_ad_list",actionparam,null,function(){ 
			            	 liger.get('dictAdListSrcId').set('disabled', false);
			            	 e.grid.reload();
			            },true); 
	           	  }
	           },
	           conditionSearchClick: function (e)
               {  
					var q_combo_dict_name = "";
                	if (e.rules[0])
                	   q_combo_dict_name = e.rules[0].value;
                	if ($sHelper.trim(q_combo_dict_name)) {  
                		var comb_qhkeyjson = {qjson:[]} ; 
                        comb_qhkeyjson.qjson.push({"dict_name":q_combo_dict_name});
				        comb_qhkeyjson.qjsonkeytype = [{"dict_name":"LIKE_ALL"}] ;    					    
                        e.grid.set('parms',{qhstr:JSON.stringify(comb_qhkeyjson)});
                	} else {
                		 e.grid.set('parms',"");
                	}
                    e.grid.reload();   
               }
        	  }  
            } ;
    
    var dictAreaColumns = [
        { header: '区域编号', name: 'da_no', width: 80 },
        { header: '区域名称', name: 'da_name', width: 120 } 
    ]; 
    
    var pageBindingAction = function () {  
	    pageGrid.init();  
	    /**
	     * 查询------start-------------
	     */
	    $root.on("click", '[data-action="ad_page_querybt"]', function(actionobj) {
	    	    if (!queryform.valid()) { 
	    	    	return false;
	    	    }
				var rowobj = $(this);    
				var qhkeyjson = {qjson:[],qjsonkeytype:[]} ;   
	 			var param =form2js(document.getElementById('ad_page_frm_a'));  
	 			debugPrint("param：="+JSON.stringify(param)); 
	 			for(var value in param){   
				   if (param.ap_name) {
				   	 qhkeyjson.qjson.push({"ap_name":param.ap_name}); 
				   	 qhkeyjson.qjsonkeytype.push({"ap_name":"LIKE_ALL"});   
				   }
				   if (param.ap_area) {
				   	 qhkeyjson.qjson.push({"ap_area":param.ap_area}); 
				   	 qhkeyjson.qjsonkeytype.push({"ap_area":"LIKE_ALL"});   
				   }  
				   break ;
				}
	 			 $(".ad_page_querybt").attr({"disabled":"disabled"}); 
	 			 qhkeyjson.qjson.push(dateparam);
				pageGrid.grid.set('parms',{qhstr:JSON.stringify(qhkeyjson)});
			    pageGrid.grid.changePage("first") ; 
		        pageGrid.reload();   
				actionobj.preventDefault();
				rowobj = null ; 
//				myad_position_pageChart.clear();
	    }) ;
	    //清除查询
	    $root.on("click", '[data-action="ad_page_clearbt"]', function(actionobj) {
		 	var rowobj = $(this);   
			$('#ad_page_frm_a')[0].reset() ;
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;
	    
	    
	    /**
	     * 版栏条管理 - 新增，修改，删除 ，发布
	     */
	    //新增
	    $root.on("click", '[data-action="ad_page_new"]', function(actionobj) {
		 	var rowobj = $(this);   
	        show_ad_page_Model(0);
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	               
	    //修改
	    $root.on("click", '[data-action="bann_page_edit"]', function(actionobj) {
		 	var rowobj = $(this);   
		 	var apid = rowobj.data("apid") ;  
		 	show_ad_page_Model(apid);
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;   
	    
	    //删除
	    $root.on("click", '[data-action="bann_page_del"]', function(actionobj) {
		 	var rowobj = $(this);   
		 	var apid = rowobj.data("apid") ; 
		 	var param_data = $.extend(true,{},dateparam) ;	
		 	param_data.tid = apid ;
		 	param_data.tname=_tableName ;
		    param_data.opertype=_subTableName ; //指定删除子类
		 	//是否删除
		 	$sHelper.deleteData("publicDelete/",param_data,pageGrid,null,"是否确认删除所选数据？") ; 
			rowobj = null ; 
	    }) ; 
	    
	    //发布版栏条
	     $root.on("click", '[data-action="ad_yybj"]', function(actionobj) {
		 	var rowobj = $(this);   
		 	var apid = rowobj.data("apid") ; 
		 	/**
		 	 * 发布广告到CDN
		 	 */
		 	$.ligerDialog.confirm('确认要发布'+_modelTitle+"吗？", function (yes) { 
		 		if (yes){
		 			    $.ligerDialog.waitting('正在发布更新中，请稍等...');  
					 	var actionparam = {}
			            actionparam.datajson = JSON.stringify({"ap_id":apid}) ;
			            actionparam.operjson = JSON.stringify({opertype:["templateRelease"]}) ; 
			            $sHelper.AjaxSendData("saveAction/?actionname="+_subTableName,actionparam,null,function(message){
			            	 $.ligerDialog.closeWaitting();
			            	 if (message.success){ 
			            		$.ligerDialog.success('发布成功！')
			            		pageGrid.reload();
			            	 } 
			            },true);  
		 		}
		 	  }
		 	); 
			rowobj = null ; 
	    }) ;  
	    
	    //效果预览
	    /*$('#button').attr('disabled',"true");添加disabled属性 
          $('#button').removeAttr("disabled"); 移除disabled属性 
	     * bann_page_preview 
	     */
	    $root.on("click", '.bann_page_preview', function(actionobj) {
	    	console.log("==bann_page_preview==");
		 	var rowobj = $(this);  
		 	/**
		 	 * 1：调用后台接口，生成预览文件
		 	 * 2：恢复发布按钮
		 	 */
		 	var ap_id = rowobj.data("apid") ;  
		 	var actionparam = {}
            actionparam.datajson = JSON.stringify({"ap_id":ap_id}) ;
            actionparam.operjson = JSON.stringify({opertype:["templatepreview"]}) ; 
            $sHelper.AjaxSendData("saveAction/?actionname="+_subTableName,actionparam,null,function(message){ 
            	if (message.success){ 
            		  window.open(message.msg+"?ran="+$sHelper.GetRandomNum(1,1000),"_blank");  
            	}
            	else {
                 	$.ligerDialog.error(message.msg) ;	
            	} 
            }); 
			rowobj = null ; 
	    }) ;     


       $root.on("click",".l-grid-row-cell-detailbtn",function(actionobj){
	       console.log(_showDetailRow); 
   	  	   if (_showDetailRow){
   	  	   	  if (!$(this).hasClass("l-open"))
   	  	       pageGrid.grid.collapseDetail(_showDetailRow) ;
   	  	   } 
   	    }); 
   	    
	    addNewWindowsForm();
	}
    
    var showAdSubMenu = function(apid){
    	
    }
    
    var addNewWindowsForm = function(){
    	$sHelper.NewWindowsForm(_ModeId); 
    }
    
    /**
     * if (_detailGrid) _detailGrid.loadData();
     * @param {Object} apid
     */
    var getDetailGrid = function(apid){
    	var newid = _subTableName+'_detail_'+apid
    	return liger.get(newid);
    } 
    
    /**--------------------------  显示GRID   START------------------------**/ 
    var pageGrid = {
		main : "#ad_page_grid_a", 
		init : function() {
	  	var self = this;
		this.grid = $(self.main).ligerGrid({ 
         	columns: [  
//	                { display: '广告栏ID', name: 'ap_id' ,width:60  },  
	                { display: '广告名称', name: 'ap_name'  ,isSort:false   ,render:function (rowdata, rowindex, value){
						   return '<div style="word-wrap:break-word" >'+value+'</div>' ; 
						   //<a href="javascript:void(0);" class="l-grid-row-cell-detailbtn" data-rowindex="'+rowindex+'" data-id="'+rowdata.__id+'"></a>
	                  }   
	                }, 
	                { display: '发布区域', name: 'ap_area' ,width:200 ,isSort:false,render:function (rowdata, rowindex, value){
						   return '<div style="word-wrap:break-word">'+value+'</div>' ; 
	                  }   
	                }, 
	                { display: '创建人', name: 'ad_user' ,width:60 ,isSort:false  },
	                { display: '创建时间', name: 'ap_createtime' ,width:140    }, 
	                { display: '最后发布时间', name: 'ap_edittime' ,width:140  },   
	                { display: '预览',width:100,isSort:false , render: function (rowdata, rowindex, value){
						var h = ""; 
						h += '<a href="javascript:void(0);" class="btn btn-primary mg-lr-5 bann_page_preview" data-apid="'+rowdata.ap_id+'" >效果预览</a> '; 
						return h;
					  } 							    
	                },
	                { display: '操作管理',isSort:false ,width:260, render: function (rowdata, rowindex, value){
						var h = ""; 
						h += '<a href="javascript:void(0);" class="btn btn-primary mg-lr-5" data-action="bann_page_edit" data-apid="'+rowdata.ap_id+'">修改</a> ';
                        h += '<a href="javascript:void(0);" class="btn btn-danger mg-lr-5"  data-action="bann_page_del" data-apid="'+rowdata.ap_id+'">删除</a>';															 
						h +=' <a href="javascript:void(0);"  class="btn btn-success mg-5  " data-action="ad_yybj" data-apid="'+rowdata.ap_id+'">发布'+_modelTitle+'</a>';
						return h;
					  } 							    
	               } 
			    ],  
               parms:{qhstr:JSON.stringify({qjson:[dateparam]})},
	   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
	 		   type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
	 		   pageSize: 30,usePager:true, selectRowButtonOnly: false, showTitle: false, 
	           pageSizeOptions:[ 30,50,100], sortName: 'ap_edittime',sortOrder:'DESC', 
	           enabledSort:true,  url:'queryTableList/?source='+_tableName,  
	           width: '98%', height: '100%',rownumbers:true , // heightDiff:70,  
	           detail: { onShowDetail: showdetailFunc,height:'auto' 
	             ,onExtend:function(row){ 
	             	_showDetailRow = row; 
	             	pageGrid.grid.select(row);
	             } 
	           },
	           onAfterShowData : function(currentData) { 
	           	
			   } , onSuccess : function(data, grid) { 
			   	  $(".ad_page_querybt").removeAttr("disabled"); 
			   } ,  onLoading:function(){ 
			   	
			   } ,onLoaded :function(grid) {
			   	 
			   } , onDblClickRow : function (data, rowindex, rowobj)
			   {
			      console.log('选择的是' + rowindex);
			   } 
			     
	      });			      
		},				
		reload : function() {
			debugPrint('---- reload------') ;
			this.grid.loadData();
		}
	} ;
	 
 
	var queryform ;
     //创建表单
    var createQueryFrom =function(){ 		   
        queryform = $('#ad_page_frm_a').ligerForm({
			inputWidth: 120, labelWidth: 65, space:10,
		    validate : true,labelAlign: "right", width :"99%",
			fields:[   
				 {display:'广告包名',name:"ap_name",newline:false,type:"text",attr:{placeholder:"支持模糊查询"}} ,  
			     {display:"发布区域",name:"ap_area",newline:false,type:"select",width:"300",comboboxName: "ap_area",options:{valueField : 'da_no',textField: 'da_no',isMultiSelect:true,data:_querySearchJsonArray.dict_area,columns:dictAreaColumns,selectBoxWidth: 300} 
			     }            
			],
			onAfterSetFields : function(){   
			}
		 }); 
	} ; 
	/**--------------------------  创建查询表达      end------------------------**/ 
 
    /**
     * 
     * 增加 发布BAN管理窗体
     * @param {Object} ap_id
     */
    var show_ad_page_Model = function(ap_id){ 
    	addNewWindowsForm();
    	console.log("ap_id:="+ap_id);
	    var modelForm = $('#'+_ModeId).ligerForm({
			inputWidth: 160, labelWidth: 90, space: 20,
		    validate : true,labelAlign: "right", width :"100%",
			fields:[ 
			        {name:"ap_id",type:"hidden"}, 
		        	{display:"广告包名",name:"ap_name",validate:{required:true},newline:true,type:"text"},  
		        	{display:"发布区域",name:"ap_area",attr:{id:"ap_area_wds_id"},validate:{required:true},newline:false,type:"select",width:"300",comboboxName: "ap_area",options:{valueField : 'da_no',textField: 'da_no',isMultiSelect:true,data:_querySearchJsonArray.dict_area,columns:dictAreaColumns,selectBoxWidth: 300} 
			     }
		        	
				]
			,onAfterSetFields:function(){
//				js2form(document.getElementById('formauto'), userAccInfo.sysUser); 
			    $("#"+_ModeId).on("click", '[data-action="sys-user-add-upimg"]', function(actionobj) {	   	   
				    var selbj = $(this);  
					actionobj.preventDefault(),  
					selbj = null ;
				}) ;
			}
		 }); 		 
		 if (ap_id>0)		
		 {	  
		    $("#ap_id").val(ap_id);
		    $.getJSON('queryTableList/?source='+_tableName,{"sourceid" : ap_id},  
			   function (json) {  	 
				   modelForm.setData(json);	
				   $("#ap_area_wds_id").ligerGetComboBoxManager().setValue(json.ap_area); 
			   }  
			); 
		 } 
	     var modelDialog = $.ligerDialog.open( {
			title : "广告包管理", 
			target : $('#mydialogdiv'),
			height : 220,width : 550,allowClose:false,
			isHidden : false, 
			buttons : [{
				text : '确定',
				onclick : function(item, dialog) {
				    if (modelForm.valid()) {  
	                     var savaparm = $.extend(true,form2js(document.getElementById(_ModeId)),dateparam) ;	
						 /*
	                     var actionparam = {actionname:"stustudent"}
	                     actionparam.datajson = JSON.stringify(param) ;
	                     actionparam.operjson = JSON.stringify({opertype:["myzxs_stu_close_focus"]}) ; 					
						 */
	                    $sHelper.AjaxSendData("saveAction/?actionname="+_tableName,{datajson:JSON.stringify(savaparm)},pageGrid,function(){ 
//	                     	var param_data = $.extend(true,userAccInfo.sysUser,savaparm) ; 
                            dialog.close(); 
	                     	$.ligerDialog.success('保存广告包信息成功！') ; 
	                     	 addNewWindowsForm();
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


}(jQuery));