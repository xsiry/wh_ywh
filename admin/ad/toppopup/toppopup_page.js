(function($){  
    
    var _modelTitle="更新位"; 
    
    var _subTableName = "toppopup_page"; 
    
    var _ModeId = "toppopup_Page_ModelId" ;
    
    var $root = $(".ab_toppopup_page_clsf");   
    
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
		 	var tp_id = rowobj.data("tp_id") ;  
		 	var apid =  rowobj.data("apid") ;  
		 	show_DetailModel(tp_id,apid); 
			actionobj.preventDefault();
			rowobj = null ; 
	    }) ; 
	     //删除
	    $root.on("click", '.bann_page_deletecls', function(actionobj) {
		 	var rowobj = $(this);   
		 	var tp_id = rowobj.data("tp_id") ;  
		 	var apid = rowobj.data("apid") ;  
		    var param_data ={} ; // $.extend(true,{},dateparam) ;	
		 	param_data.tid = tp_id ;
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
		 	var tp_id = rowobj.data("tp_id") ;  
		 	var apid =  rowobj.data("apid") ; 
		 	var actionparam = {}
            actionparam.datajson = JSON.stringify({"tp_id":tp_id}) ;
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
		 	var tp_id = rowobj.data("tp_id") ;  
		 	var apid =  rowobj.data("apid") ; 
		 	var actionparam = {}
            actionparam.datajson = JSON.stringify({"tp_id":tp_id}) ;
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
            $(detailPanel).append('<div class="btn-view"><a href="javascript:void(0);" data-apid="'+row.ap_id+'"  class="btn btn-default bann_page_detail_add"><i class="fa fa-gear"></i>&nbsp;&nbsp;创建新更新位</a><span style="  color: red; font-size: 15px; line-height: 20px;margin-left: 10px;">注意：所有广告的图片长宽规格为：高->220像素;宽->532像素; </span></div>');  
	        var detailGrid = $('<div class="btn-view-list" id="'+_subTableName+'_detail_'+row.ap_id+'"></div>') 
//	        document.createElement('div'); 
            $(detailPanel).append(detailGrid);
            $(detailGrid).ligerGrid({
                columns: [ 
//                          { display: '广告ID', name: 'tp_id'   },  
			                { display: '广告名称', width:150,name: 'tp_name'},
			                { display: '显示标题', width:150,name: 'tp_title'},
			                { display: '点击地址',  width:360, name: 'tp_url'},
			                { display: '图片', width:100, name: 'tp_img',render:function (rowdata, rowindex, value){
								 return ' <img class="ad_row_img" src="'+value+'"/>';
							  }     
			                },
			                { display: '运行', name: 'tp_run' ,width:50,  render:function (rowdata, rowindex, value){
			                	if (value=='on')  
			                	  return "是";
			                	else return "否";
			                  }
			                },
			                { display: '游戏编号',width:100, name:'ad_gameno'},  
			                { display: '操作管理', width:160, render: function (rowdata, rowindex, value){
								var h = "<div class='detail-view '>";  
								h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_eidtcls" data-tp_id="'+rowdata.tp_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-edit"></i>修改</a>';
		                        h += '<a href="javascript:void(0);" class="btn btn-danger btn-xs bann_page_deletecls" data-tp_id="'+rowdata.tp_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-trash-o"></i>删除</a>';	
		                        h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_upcls" data-tp_id="'+rowdata.tp_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-arrow-up"></i>上移</a>';
		                        h += '<a href="javascript:void(0);" class="btn btn-default btn-xs bann_page_downcls" data-tp_id="'+rowdata.tp_id+'" data-apid="'+rowdata.ap_id+'"><i class="fa fa-arrow-down"></i>下移</a> </div>'; 
								return h;
							  } 							    
			                }
                         ], 
                       parms:{qhstr:JSON.stringify({qjson:[{"ap_id":row.ap_id}]})},
			   	       fixedCellHeight:false,headerRowHeight:40,isScroll:true, frozen: false,
			 		   type:"get", dataAction: 'server',checkbox:false,allowUnSelectRow:true, 
			 		   pageSize: 30,usePager:false, selectRowButtonOnly: false, showTitle: false, 
			           pageSizeOptions:[ 30,50,100], sortName: 'tp_order',sortOrder:'ASC', 
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
    
    var show_DetailModel = function(tp_id,ap_id){
    	addNewWindowsForm();
    	console.log("tp_id:="+tp_id);
	    var modelForm = $('#'+_ModeId).ligerForm({
			inputWidth: 160, labelWidth: 100, space: 20,
		    validate : true,labelAlign: "right", width :"100%",
			fields:[ 
			        {name:"tp_id",type:"hidden"}, //主键 
			        {name:"ap_id",type:"hidden"} ,  //外键
		        	 //广告ID 
		        	sub_dict_name_rowParam ,  
		        	{display:"广告名称",name:"tp_name",validate:{required:true},newline:true,type:"text",attr:{id:"tp_name_cid"}}, 
		        	{display:"显示标题",name:"tp_title",validate:{required:true},newline:false,type:"text",attr:{id:"tp_title_cid"}},
		        	{display:"点击地址",name:"tp_url",validate:{required:true},width:420,newline:true,type:"text"}, 
                    {name:"tp_img",type:"hidden",attr:{id:"tp_img_id"}}, 
		        	{htmltx:'<div  style="height: 200px"><div style="text-align: right;     width: 100px;float:left;">图片：</div><input id="tp_img_ftp"  type="file" multiple class="file-loading" data-max-file-count="1" data-min-file-count="1"> </div>'},
		        	{display:"是否运行游戏",name:"tp_run",newline:true,width:100,type:"checkbox"},
		        	sub_dict_game_rowParam 
				]
			,onAfterSetFields:function(){ 
				setFtpAction();
				$("#tp_img_ftp").fileinput('refresh', { 
		                initialPreview: []
		        }); 
			}
		 });  
		 if (ap_id>0) $("#ap_id").val(ap_id);
		 if (tp_id>0)		 
		 {	  
		    $("#tp_id").val(tp_id);
		    $.getJSON('queryTableList/?source='+_subTableName,{"sourceid" : tp_id},  
			   function (json) {   
				   modelForm.setData(json);	 
				   $("#ad_id_frmid").val(json.ad_id);
				   $("#ad_gameno_frmid").val(json.ad_gameno); 
				   $("#tp_img_ftp").fileinput('refresh', {
//		                uploadExtraData: { id: id },
		                initialPreview: [ //预览图片的设置
		                    "<img src='" + json.tp_img + "' class='file-preview-image'>",
		                ]
		           }); 
			   }  
			); 
		 }
		 
	     detailModelDialog = $.ligerDialog.open( {
			title : _modelTitle+"-广告信息管理",
			target : $('#mydialogdiv'),
			height : 450,width : 580,allowClose:false,
			isHidden : false, 
			buttons : [{
				text : '确定',
				onclick : function(item, dialog) {
				    if (modelForm.valid()) {   
				    	if (_selectNewImg){
				    		$.ligerDialog.waitting('正在保存中,请稍候...');  
				            $("#tp_img_ftp").fileinput('upload');  
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
    $("#tp_img_ftp").fileinput({
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
	            	  $("#tp_img_id").val(successResult.msg); 
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
		   $("#tp_name_cid").val(rowdata.dict_name);
		   $("#tp_title_cid").val(rowdata.dict_name); 
		}  
    }
    
    ab_toppopup_page_c = function(){   
    	ab_page_Init("toppopup",_subTableName,_modelTitle,f_showdetail,setRowParam);  
		pageBindingAction(); 
		pageSetUp();   
	}

}(jQuery));