 paceOptions = {
    elements: true
  };

(function($){
 function editUserPasswd(){
 	$sHelper.NewWindowsForm();
    var userpwdform = $('#formauto').ligerForm({
		inputWidth: 120, labelWidth: 80, space: 30,
	    validate : true,labelAlign: "right", width :"100%",
		fields:[
				{display:"旧密码",name:"olduspasswd",validate:{required:true},newline:true,type:"password"},
				{display:"新密码",name:"uspasswd",validate:{required:true},newline:true,type:"password"},
				{display:"确认密码",name:"okuspasswd",validate:{required:true},newline:true,type:"password"}
			]
	 });

   var userpwdDialog = $.ligerDialog.open( {
		title : '用户密码修改',
		target : $('#mydialogdiv'),
		height : 200,allowClose:false,
		isHidden : false,
		width : 330,
		buttons : [{
			text : '确定',
			onclick : function(item, dialog) {
			     if (userpwdform.valid()) {
			          var param = userpwdform.getData();
                      if (param.uspasswd!=param.okuspasswd) {
					     $.ligerDialog.error('新密码2次输入不一样！');
					     return ;
					  }
					  debugPrint("userAccInfo.sys_account_pwd:"+userAccInfo.sys_account_pwd) ;
					  debugPrint("userAccInfo.sys_account_pwd:"+param.olduspasswd+","+$.md5(param.olduspasswd)) ;
					  if (userAccInfo.sys_account_pwd!=$.md5(param.olduspasswd)){
					   	 $.ligerDialog.error("输入的旧密码不正确！");
					   	  return ;
					  }
                      $sHelper.AjaxSendData('saveSysMenuAction',{actionname:"sysaccount",datajson:JSON.stringify({sys_account_id:userAccInfo.sys_account_id,sys_account_pwd:$.md5(param.uspasswd)})},'',
                       function() {
                       	 userAccInfo.sys_account_pwd = $.md5(param.uspasswd) ;
                       	 $.ligerDialog.success('密码修改成功！',function(yes){
						   userpwdDialog.close();
					     }) ;
					 })	 ;
                   }
			}
		  }, {
			text : '关闭',
			onclick : function(item, dialog) {
		          userpwdDialog.close();
			}
		}  ]
	});
}



 /*
  * 设置首页的click
  */
 function IndexCilckBing(){
 	 $("#dropdown-school-txtul").on("click", '[data-action="sel-school-query"]', function(actionobj) {
	    var selbj = $(this);
	    $("#dropdown-school-txt").html(selbj.find('span').html()) ;
	    $("#dropdown-school-txtul .active").removeClass("active") ;
	    selbj.parent().addClass("active");
	    nowSchoolid = selbj.data("schid") ;
	    nowSchoolParantid = selbj.data("schprid") ;
	    //刷新当前 content 下的内容 dropdown-school-txtul
	    var urlhash = location.hash ;
	    if (urlhash.indexOf("schchage")==-1){
	        //判断是否带 ？
	        if (urlhash.indexOf("?")==-1){
	    	   location.href = urlhash+"?schchage="+$sHelper.uuid() ;
	    	 }
	    	else
	    	    location.href = urlhash+"&schchage="+$sHelper.uuid() ;
	    } else {
	       var newurlhash = urlhash.substr(0,urlhash.indexOf("schchage")) ;
	       location.href = newurlhash+"schchage="+$sHelper.uuid() ;
	    }
		actionobj.preventDefault(),
		selbj = null ;
	 }) ;
    $.root_.on("click", '[data-action="system-editUserInfo"]', function(actionobj) {
		var selbj = $(this);
		editUserInfo(),
		actionobj.preventDefault(),
		selbj = null ;
	}) ;
	$.root_.on("click", '[data-action="system-editUserPasswd"]', function(actionobj) {
		var selbj = $(this);
		editUserPasswd(),
		actionobj.preventDefault(),
		selbj = null ;
	}) ;
	$.root_.on("click", '[data-action="user-change"]', function(actionobj) {
		var selbj = $(this);
		var schid = selbj.data("schid");
		$("#dropdown-school-txtul >li.active").removeClass("active");
		selbj.parent().addClass("active");
		//切换左边菜单
		if (schid==1){
//			$("#report_sysmenu_ul").css('display','none');
//		    $("#info_sysmenu_ul").css('display','block') ;
           $("#report_sysmenu_ul").removeClass("show");
           $("#report_sysmenu_ul").addClass("hidden");
		   $("#info_sysmenu_ul").removeClass("hidden");
           $("#info_sysmenu_ul").addClass("show");
		} else {
		   $("#report_sysmenu_ul").removeClass("hidden");
           $("#report_sysmenu_ul").addClass("show");
		   $("#info_sysmenu_ul").removeClass("show");
           $("#info_sysmenu_ul").addClass("hidden");
		}
		actionobj.preventDefault(),
		selbj = null ;
	}) ;


 }
 //大部分使用到的JS库，隐藏在这里加载
 function loadMyscript(){
//	loadScript("lib/ligerUI/js/ligerui.all-min.js");
 	loadScript("js/bootpage/bootpage1-min.js");
	loadScript("js/bootpage/bootpage2-min.js");
//	loadScript("js/plugin/grumble/jquery.grumble.min.js?v=7");
	loadScript("lib/jquery-validation/validate-methods.js");
	loadScript("js/plugin/sssform/sssform.min.js");
	loadScript("js/ssofthelper.js"); //-min
//	loadScript("js/icheck/jquery.icheck.js");
	loadScript("js/libs/apicollection.js");
	loadScript("js/libs/ssoftd.js");
 }
 /**
  * 写入JS 保存，系统字典：年级，科目 等
  */
var  refreshQuerySearchJsonArray = function(){
//	 $.getJSON('adPublicArrayQueryList',{dicts : "dict_area"},
//		 function (json) {
//			  	 _querySearchJsonArray = json ;
//		 }
//	 );
}

var showUserAccinfo = function(){
	console.log("-------1111111---------");
	$.ajax({
        url:_hostaddr+'ywh_queryTableList/',
        type:'post',
        data:{ "Access-Control-Allow-Origin": '*',source:"sys_user",qtype:"online"} ,
        cache: false,
		dataType: 'json',
        success: function(json){
               userAccInfo = json ;
			   userAccInfo_authority =  (userAccInfo.authority)?userAccInfo.authority:'';
			   $("#show-shortcut").html(userAccInfo.sysname);
			  // var html=template(document.getElementById('user_authority_menu_tpl').innerHTML  , {userAuthority:userAccInfo_authority});
			   $("#user_authority_menu").append(userAccInfo.authorityHtml); //userAccInfo.authorityHtml);
			   $.each(userAccInfo.sys_user_group_ls, function(i, data) {
			   	     $("#user_sys_group_ul").append('<li><a href="ywh/sysgroup/groupTask?groupid='+data.groupid+'">'+data.groupname+'</a></li>') ;
			   });
			   $('#user_authority_menu').jarvismenu({
			        accordion : true,
			        speed : $.menu_speed,
			        closedSign : '<em class="fa fa-plus-square-o"></em>',
			        openedSign : '<em class="fa fa-minus-square-o"></em>'
		      });
        }
    });

//	 $.getJSON(_hostaddr+'ywh_queryTableList/?source=sys_user&qtype=online',
//		function (json) {
//		   userAccInfo = json ;
//		   userAccInfo_authority =  (userAccInfo.authority)?userAccInfo.authority:'';
//		   $("#show-shortcut").html(userAccInfo.sysname);
//		   var html=template(document.getElementById('user_authority_menu_tpl').innerHTML
//					 	     , {userAuthority:userAccInfo_authority});
//		   $("#user_authority_menu").append(html);
//		   $.each(userAccInfo.sys_user_group_ls, function(i, data) {
//		   	     $("#user_sys_group_ul").append('<li><a href="ywh/sysgroup/groupTask?groupid='+data.groupid+'">'+data.groupname+'</a></li>') ;
//		   });
//		   $('#user_authority_menu').jarvismenu({
//		        accordion : true,
//		        speed : $.menu_speed,
//		        closedSign : '<em class="fa fa-plus-square-o"></em>',
//		        openedSign : '<em class="fa fa-minus-square-o"></em>'
//	      });
//	    }
//  );
}

$(function(){
	 loadMyscript();
	 IndexCilckBing();
	 refreshQuerySearchJsonArray();
	 showUserAccinfo();
});
}(jQuery));

var  _querySearchJsonArray ; //全局字典查询，在系统登录时缓存，解决显示时候，反复查询的问题

var userAccInfo ;

var userAccInfo_authority ;

var intervalId =0;//AJAX设置首页信息

var _ap_id  ; //全局广告包ID

var sysAuthority = {
    Remote_Netbar:"Remote_Netbar",
    Download_Game:"Download_Game",
    Details_View:"Details_View",
    Boot_Task:"Boot_Task",
    Security_Policy:"Security_Policy",
    Information_Delivery:"Information_Delivery"
}


/**
 * 权限管理，控制是否显示
 */
function authorityManage(pagename){
	if (pagename=='netbar_info'){
		if (userAccInfo_authority=='ALL') {
			$("#authority_WbGroupComboBoxId").css('display','block');
		}
	}

	if (pagename=='group_task'){
		if (userAccInfo_authority=='ALL') {
			$(".authority_boot_task").css('display','block');
			$(".authority_security_policy").css('display','block');
			$(".authority_netbar_list").css('display','block');
		}
	}
}

