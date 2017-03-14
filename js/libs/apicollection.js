
/*
 * hashMap.Set("name","John Smith");   
hashMap.Set("age",24);   
hashMap.Get("name");//John Smith   
hashMap.Contains("title");//false   
hashMap.Contains("name");//true   
hashMap.Remove("age"); 
 */
var hashMap = {  
    Set : function(key,value){this[key] = value},  
    Get : function(key){return this[key]},  
    Contains : function(key){return this.Get(key) == null?false:true},  
    Remove : function(key){delete this[key]}  
} 

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

//debugState &&
function debugPrint(msg) {
	 console.log(msg);
}
 
/**
 * 选择框打钩
 */
function checkboxliselAction($thislabel){
    var labeltx = $thislabel.text();
  	var $ulparent = $thislabel.parent().parent(); 
  	var $li =$ulparent.find("li"); 
	$li.each(function(){
		 if ($("div",$(this)).hasClass("checked"))
		    $(this).addClass("selected");
		 else
		   $(this).removeClass("selected");
	 }) ; 
}
/**
 * 添加课程 ，DIV 显示 课程查询使用
 */

function AddDivCurriculum($seldiv,seljson) { 
	$seldiv.empty();
	var htmltx = "";
	$.each(seljson.curclmarr, function(index,data) {
	    if (data.dict_teachmd_id==1)
	      htmltx = htmltx +  '<i class="zxico zxico-vip fl mg-lf-10">'+data.dict_curriculum+'</i>';
		else if (data.dict_teachmd_id==2)
	      htmltx = htmltx +  '<i class="zxico zxico-classes fl mg-lf-10">'+data.dict_curriculum+'</i>';
		else  htmltx = htmltx + data.dict_curriculum+";";
	});
	$seldiv.html(htmltx) ; 
}

function validatorParent(a) {
	a.parent().removeClass("state-success");
	a.parent().addClass("state-error")
}
String.prototype.replaceAll = function(b, a) {
	return this.replace(new RegExp(b, "gm"), a)
};

/* 
* formatMoney(s,type) 
* 功能：金额按千位逗号分割 
* 参数：s，需要格式化的金额数值. 
* 参数：type,判断格式化后的金额是否需要小数位. type :true带 ，false:不带
* 返回：返回格式化后的数值字符串. 
*/ 
function formatMoney(s, type) { 
	//先判断是否小于0,
	var _minZero = (getFloat(s)<0) ; 
	s = Math.abs(s) 
	if (/[^0-9\.]/.test(s)) {
		debugPrint(" is not number ") ;
		return "0"; 
	} 
	if (s == null || s == "") {
		debugPrint(" null  or empty ") ;
		return "0"; 
	}
		
	s = s.toString().replace(/^(\d*)$/, "$1."); 
	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1"); 
	s = s.replace(".", ","); 
	var re = /(\d)(\d{3},)/; 
	while (re.test(s)) 
		s = s.replace(re, "$1,$2"); 
	s = s.replace(/,(\d\d)$/, ".$1"); 
	if (type ==false) {// 不带小数位(默认是有小数位) 
		var a = s.split("."); 
		if (a[1] == "00") { 
			s = a[0]; 
		} 
	} 
	if (_minZero)
	   return "-"+s;
	else 
	    return s; 
} 

/* 
* 通用DateAdd(interval,number,date) 功能:实现javascript的日期相加功能. 
* 参数:interval,字符串表达式，表示要添加的时间间隔. 参数:number,数值表达式，表示要添加的时间间隔的个数. 参数:date,时间对象. 
* 返回:新的时间对象. var now = new Date(); var newDate = DateAdd("day",5,now); 
* author:devinhua(从○开始) update:2010-5-5 20:35 
*/ 
function DateAdd(interval, number, date) { 
	if (date == null) 
		return ""; 
	switch (interval) { 
		case "day": 
		date = new Date(date); 
		date = date.valueOf(); 
		date += number * 24 * 60 * 60 * 1000; 
		date = new Date(date); 
		return date; 
		break; 
		default: 
		return ""; 
		break; 
	} 
} 

/**
 * 整数相加
 */
function AddInt(){
    var rtn = 0;
    for(var i=0;i<arguments.length;i++){
        if(isNaN(arguments[i]))continue;
        rtn+=parseInt(arguments[i]);
    }
    return rtn;
 }
function getInt(value){
   if (isNaN(value) || value=="" || value==undefined)
      return 0 ;
   return parseInt(value) ;
}

function AddFloat(){
    var rtn = 0;
    for(var i=0;i<arguments.length;i++){
        if(isNaN(arguments[i])) continue;
        rtn+=getFloat(arguments[i]);
    }
    return rtn;
 } 
function getFloat(value){
   if (isNaN(value) || value=="" || value==undefined)
      return 0 ;
   return parseFloat(value);
}

/**
 * 字符串转数组
 * @param {Object} s
 */
 var toArray = function(s){
     try{
         return Array.prototype.slice.call(s);
     } catch(e){
             var arr = [];
             for(var i = 0,len = s.length; i < len; i++){
                 //arr.push(s[i]);
                   arr[i] = s[i];  //据说这样比push快
             }
              return arr;
     }
 }
 
 /**
  * 获取用户头像照片
  */
 
 var getSysUserImg = function(usid){
 	return $("#var_ssschool_userimg_cache").find('span[data-userid="'+usid+'"]').text(); 
 }
 
 
 function dateToDate(date) {
	  var sDate = new Date();
	  if (typeof date == 'object'
	    && typeof new Date().getMonth == "function"
	    ) {
	    sDate = date;
	  }
	  else if (typeof date == "string") {
	    var arr = date.split('-')
	    if (arr.length == 3) {
	      sDate = new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);
		        }
		      } 
		      return sDate;
 }
 
 
function addMonth(date, num) {
      num = parseInt(num);
      var sDate = dateToDate(date); 
      var sYear = sDate.getFullYear();
      var sMonth = sDate.getMonth() + 1;
      var sDay = sDate.getDate();
 
      var eYear = sYear;
      var eMonth = sMonth + num;
      var eDay = sDay;
      while (eMonth > 12) {
        eYear++;
        eMonth -= 12;
      } 
      var eDate = new Date(eYear, eMonth - 1, eDay); 
      while (eDate.getMonth() != eMonth - 1) {
        eDay--;
        eDate = new Date(eYear, eMonth - 1, eDay);
      } 
      return eDate;
}

function getPerDate(){
	var dayday = new Date()  ;
    dayday.setDate(dayday.getDate()-1) ;
    return dayday ;
}

function getPerDateNumber(perday){
	var dayday = new Date()  ;
    dayday.setDate(dayday.getDate()-perday) ;
    return dayday ;
}

function getPerMonth(){
	var nowdata = addMonth(new Date() ,-1);
	return nowdata;
}
 
 
/**
 * windows.open 解决参数传递过长，改为POST
 */
function openPostWindow(url,paramName ,data, name)  
	 {  
	 var tempForm = document.createElement("form");  
     tempForm.id="tempForm1";  
     tempForm.method="post";  
     tempForm.action=url;  
     tempForm.target=name;  
     
     var hideInput = document.createElement("input");  
     hideInput.type="hidden";  
     hideInput.name= paramName ;
     hideInput.value= data;
     tempForm.appendChild(hideInput);   
     if (typeof document.addEventListener != "undefined") {
	 	tempForm.addEventListener("submit",function(){ openWindow(name); });
	 } else {
	 	tempForm.attachEvent("onsubmit",function(){ openWindow(name); }); //只有ID才有
	 } 
     document.body.appendChild(tempForm);  
//	     tempForm.fireEvent("onsubmit");
     tempForm.submit();
     document.body.removeChild(tempForm);
}

function openWindow(name)  
{  
    window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');   
}

