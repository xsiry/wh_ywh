(function($){  
    
    var _modelTitle="迷你版栏条"; 
    
    var _subTableName = "miniban_page";
    
    var _ModeId = "Miniban_Page_ModelId" ;
    
    var $root = $(".ab_miniban_page_clsf");   
    
    var _detailGrid;
    
    var _selectNewImg = false ;
    
    var pageBindingAction = function () {   
	     /**
	     *具体每个广告栏目新增加
	     */ 
	    $root.on("click", '.bann_page_detail_add', function(actionobj) {
	        var rowobj = $(this);  
	        var apid = rowobj.data("apid"); 
	        _detailGrid = getDetailGrid(apid); 
	        console.log(_detailGrid.getData());
            var _totalSubNum = _detailGrid.getData().length
            console.log("_totalSubNum:="+_totalSubNum);
            _selectNewImg = true ; 
//	        if (_totalSubNum<8){ 
	        show_DetailModel(0,apid);
//	        } else {
//	        	$.ligerDialog.error('每个版栏条下，只能创建8个广告位！') ;
//	        }	       
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;
	    
	    
	    //修改
	    $root.on("click", '.bann_page_eidtcls', function(actionobj) {
		 	var rowobj = $(this);   
		 	_selectNewImg = false ;
		 	var mban_id = rowobj.data("mban_id") ;  
		 	var apid =  rowobj.data("apid") ;  
		 	show_DetailModel(mban_id,apid); 
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	     //删除
	    $root.on("click", '.bann_page_deletecls', function(actionobj) {
		 	var rowobj = $(this);   
		 	var mban_id = rowobj.data("mban_id") ;  
		 	var apid = rowobj.data("apid") ;  
		    var param_data ={} ; // $.extend(true,{},dateparam) ;	
		 	param_data.tid = mban_id ;
		 	param_data.tname=_subTableName ;
		 	//是否删除
		 	$sHelper.deleteData("publicDelete/",param_data,null,function(){ 
		 	    _detailGrid = getDetailGrid(apid); 
		 		if (_detailGrid) _detailGrid.loadData();
		 	},"是否确认删除所选数据？") ;
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	    
	     //上移动
	    $root.on("click", '.bann_page_upcls', function(actionobj) {
		 	var rowobj = $(this);   
		 	var mban_id = rowobj.data("mban_id") ;  
		 	var apid =  rowobj.data("apid") ; 
		 	var actionparam = {}
            actionparam.datajson = JSON.stringify({"mban_id":mban_id}) ;
            actionparam.operjson = JSON.stringify({opertype:["upaction"]}) ; 
            $sHelper.AjaxSendData("saveAction/?actionname="+_subTableName,actionparam,null,function(){  
            	_detailGrid = getDetailGrid(apid); 
            	if (_detailGrid) _detailGrid.loadData(); 
            });
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	    
	    
	     //下移动
	    $root.on("click", '.bann_page_downcls', function(actionobj) {
		 	var rowobj = $(this);   
		 	var mban_id = rowobj.data("mban_id") ;  
		 	var apid =  rowobj.data("apid") ; 
		 	var actionparam = {}
            actionparam.datajson = JSON.stringify({"mban_id":mban_id}) ;
            actionparam.operjson = JSON.stringify({opertype:["downaction"]}) ; 	 
            $sHelper.AjaxSendData("saveAction/?actionname="+_subTableName,actionparam,null,function(){ 
            	 _detailGrid = getDetailGrid(apid); 
            	if (_detailGrid) _detailGrid.loadData(); 
            });
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ;  
	   
	   
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
    
   

	
	var f_showdetail= function (row, detailPanel,callback)
        { 
            $(detailPanel).append('<div class="btn-view"><a href="javascript:void(0);" data-apid="'+row.ap_id+'"  class="btn btn-default bann_page_detail_add"><i class="fa fa-gear"></i>&nbsp;&nbsp;创建新迷你版栏条</a><span style="  color: red; font-size: 15px; line-height: 20px;margin-left: 10px;">注意：所有广告的图片长宽规格为：高->200像素;宽->148像素; </span></div>');  
	        var detailGrid = $('<div class="btn-view-list" id="'+_subTableName+'_detail_'+row.ap_id+'"></div>') 
//	        document.createElement('div'); 
            $(detailPanel).append(detailGrid);
            $(detailGrid).ligerGrid({
                columns: [
//                          { display: '广告ID', name: 'mban_id'   },  
			                { display: '广告名称', width:150,name: 'mban_name'    },
			                { display: '显示标题', width:150,name: 'mban_title'   },
			                { display: '点击地址', width:300,name: 'mban_url'  },
			                { display: '图片', width:100, name: 'mban_img' ,render: function (rowdata, rowindex, value){
										  return ' <img class="ad_row_img" src="'+value+'"/>';
							  }     
			                },
			                { display: '运行', name: 'mban_run' ,width:50,  render: function (rowdata, rowindex, value){
			                	if (value=='on')  
			                	  return "是";
			                	else return "否";
			                  }
			                },
			                { display: '游戏编号',width:100,  name: 'ad_gameno'   }, 
			                { display: '热门', name: 'mban_hote' ,width:50,  render: function (rowdata, rowindex, value){
			                	if (value=='on')  
			                	 return ' <i class="site-icons-mark icon-ban-hot"></i>';
			                	else return "";
			                  }
			               }, 
			                { display: '操作管理', width:160, render: function (rowdata, rowindex, value){
								var h = "<div class='detail-view '>";  
								h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_eidtcls" data-mban_id="'+rowdata.mban_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-edit"></i>修改</a>';
		                        h += '<a href="javascript:void(0);" class="btn btn-danger btn-xs bann_page_deletecls" data-mban_id="'+rowdata.mban_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-trash-o"></i>删除</a>';	
		                        h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_upcls" data-mban_id="'+rowdata.mban_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-arrow-up"></i>上移</a>';
		                        h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_downcls" data-mban_id="'+rowdata.mban_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-arrow-down"></i>下移</a> </div>'; 
								return h;
							  } 							    
			                }
                         ], 
                       parms:{qhstr:JSON.stringify({qjson:[{"ap_id":row.ap_id}]})},
			   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
			 		   type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
			 		   pageSize: 30,usePager:false, selectRowButtonOnly: false, showTitle: false, 
			           pageSizeOptions:[ 30,50,100], sortName: 'mban_order',sortOrder:'ASC', 
			           enabledSort:true,  url:'queryTableList/?source='+_subTableName,  
			           width: '99%',columnWidth:60,rownumbers:true ,
			           onAfterShowData : function(currentData) {  
	           	          
			           } 
			           
            });  
       }
 
	
	
	 /**
     * DETAIL
     * ---------------------------------------------增加  Ban窗体具体广告信息------------------------------------------------
     * @param {Object} ap_id
     *参考：http://www.ligerui.com/demos/comboBox/comboBoxGridWitchCondition.htm 
     */
    var detailModelDialog  ;
    
    var show_DetailModel = function(mban_id,ap_id){ 
    	console.log("mban_id:="+mban_id);
	    var modelForm = $('#'+_ModeId).ligerForm({
			inputWidth: 160, labelWidth: 100, space: 20,
		    validate : true,labelAlign: "right", width :"100%",
			fields:[ 
			        {name:"mban_id",type:"hidden"}, //主键 
			        {name:"ap_id",type:"hidden"} ,  //外键
		        	 //广告ID 
		        	sub_dict_name_rowParam ,  
		        	{display:"广告名称",name:"mban_name",validate:{required:true},newline:true,type:"text",attr:{id:"mban_name_cid"}}, 
		        	{display:"显示标题",name:"mban_title",validate:{required:true},newline:false,type:"text",attr:{id:"mban_title_cid"}},
		        	{display:"点击地址",name:"mban_url",validate:{required:true},width:420,newline:true,type:"text"}, 
                    {name:"mban_img",type:"hidden",attr:{id:"mban_img_id"}}, 
		        	{htmltx:'<div  style="height: 200px"><div style="text-align: right;     width: 100px;float:left;">图片：</div><input id="mban_img_ftp"  type="file" multiple class="file-loading" data-max-file-count="1" data-min-file-count="1"> </div>'},
		        	{display:"是否运行游戏",name:"mban_run",newline:true,width:100,type:"checkbox"},
		        	sub_dict_game_rowParam,  
		        	{display:"是否热门",name:"mban_hote",newline:true,width:100,type:"checkbox"} 
//		        	{display:"排序",validate:{required:true},name:"ban_order",newline:true,type:"text"} 
				]
			,onAfterSetFields:function(){
//				js2form(document.getElementById('formauto'), userAccInfo.sysUser);  
				setFtpAction();
				$("#mban_img_ftp").fileinput('refresh', { 
		                initialPreview: []
		        }); 
			}
		 });  
		 if (ap_id>0) $("#ap_id").val(ap_id);
		 if (mban_id>0)		 
		 {	  
		    $("#mban_id").val(mban_id);
		    $.getJSON('queryTableList/?source='+_subTableName,{"sourceid" : mban_id},  
			   function (json) {   
				   modelForm.setData(json);	 
				   $("#ad_id_frmid").val(json.ad_id);
				   $("#ad_gameno_frmid").val(json.ad_gameno); 
				   $("#mban_img_ftp").fileinput('refresh', {
//		                uploadExtraData: { id: id },
		                initialPreview: [ //预览图片的设置
		                    "<img src='" + json.mban_img + "' class='file-preview-image'>",
		                ]
		           }); 
			   }  
			); 
		 }
		 
	     detailModelDialog = $.ligerDialog.open( {
			title : _modelTitle+"-广告信息管理",
			target : $('#mydialogdiv'),
			height : 550,width : 580,allowClose:false,
			isHidden : false, 
			buttons : [{
				text : '确定',
				onclick : function(item, dialog) {
				    if (modelForm.valid()) {   
				    	if (_selectNewImg){
				    		$.ligerDialog.waitting('正在保存中,请稍候...');  
				            $("#mban_img_ftp").fileinput('upload');  
				    	} else {
				    		saveFrmData();
				    	} 
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
	}	 
	 



var setFtpAction = function(){  
    $("#mban_img_ftp").fileinput({
		    uploadUrl: "fileUpload", // server upload action
		    uploadAsync: true, 
//          initialPreview:_initimg, //初始显示图片
            previewClass:"myDipreviewClass", 
		    showUpload:false,//是否显示上传按钮 
//          showCaption: false,//是否显示标题
		    maxFileCount: 1, 
		    allowedFileExtensions: ['jpg', 'png','jpge', 'bmp'],   
		    browseClass: "btn btn-primary", //按钮样式             
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>", 
		    uploadExtraData: function() { //上传时额外参数 ,指定保存的子目录
		    	 return {"fgzv6path":_subTableName};
			  }, 
		    slugCallback: function(filename) { //选择文件后改名
               debugPrint( "filename := "+filename) ; 
               _selectNewImg = true ;
               return filename ;
           }
		}).on('fileuploaded', function(event, data, previewId, index) { 
		   	  debugPrint("---previewId:="+previewId+"---index:="+index) ; 
		   	  /*
		   	   * {"auth":0,"msg":"images/fgzv6/bann_page/1476082472912-e0a3f26f-2e7a-4233-8c21-9317e1dac8f5.jpg","result"
:"1","success":true,"successno":0}
		   	   */  
		   	  $.ligerDialog.closeWaitting(); 
		   	  var successResult =  data.response  ;
		   	  if (successResult.success) {  
	            	 console.log("msg:="+successResult.msg);
	            	  $("#mban_img_id").val(successResult.msg); 
		              saveFrmData();
		   	  } else { 
		   	  	$.ligerDialog.error('---上传失败----'+successResult.msg) ;
		   	  }
 	    }).on("filecustomerror", function (event, params) {
 	          $.ligerDialog.closeWaitting(); 
	          debugPrint("-filecustomerror-") ; 
	     }).on("fileuploaderror", function(event, data, previewId, index){
	          $.ligerDialog.closeWaitting(); 
	       debugPrint("-fileuploaderror-") ; 
	    }).on('fileerror', function(event, data) {
	    	   $.ligerDialog.closeWaitting(); 
		       debugPrint("--fileerror--") ; 
	    }).on('filebatchuploadcomplete', function(event, files, extra) {  
               debugPrint("--filebatchuploadcomplete--") ; 
	    }); 	 
	 }

    var saveFrmData = function(){
    	 var savaparm = $.extend(true,form2js(document.getElementById(_ModeId)),{}) ; 
    	 console.log("savaparm:="+JSON.stringify(savaparm)); 
         $sHelper.AjaxSendData("saveAction/?actionname="+_subTableName,{datajson:JSON.stringify(savaparm)},null,function(message){ 
         	 if (message.success) {
         	 	var apid =  savaparm.ap_id ; 
         	 	 _detailGrid = getDetailGrid(apid); 
         	 	if (_detailGrid) _detailGrid.loadData();
                detailModelDialog.close();  
                addNewWindowsForm();
             }
         	 else   $.ligerDialog.error(message.msg) ;  
         });
    }
    
    var sub_dict_game_rowParam ,sub_dict_name_rowParam;
    
    /**
     * 广告ID和游戏编码 各表设置一致
     * @param {Object} dict_game_rowParam
     * @param {Object} dict_name_rowParam
     */
    var setRowParam = function(dict_game_rowParam ,dict_name_rowParam){
    	sub_dict_game_rowParam =dict_game_rowParam; 
    	sub_dict_name_rowParam =dict_name_rowParam;
    	//设置事件新方法
    	sub_dict_name_rowParam.options.grid.onSelectRow = function (rowdata, rowindex, rowobj)
		{ 
		   $("#mban_name_cid").val(rowdata.dict_name);
		   $("#mban_title_cid").val(rowdata.dict_name); 
		}  
    }
    
    ab_miniban_page_c = function(){   
    	ab_page_Init("miniban",_subTableName,_modelTitle,f_showdetail,setRowParam);  
		pageBindingAction(); 
		pageSetUp();   
	}

}(jQuery));