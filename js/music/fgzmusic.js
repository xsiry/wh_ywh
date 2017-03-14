/*显示歌词部分*/
var scrollt=0; var tflag=0;//存放时间和歌词的数组的下标
var lytext=new Array();//放存汉字的歌词 
var lytime=new Array();//存放时间
var delay=10; var line=0; var scrollh=0; 
var songIndex=1;
var _timelineWidth = 462; 
//var agentUrl = "http://localhost:8080/FgzWeb"; 
//var playUrl = "http://localhost:8080/";
//歌曲代理定义
var agentUrl = "http://115.238.227.158:8080/fgzweb"; 
var playUrl = "http://115.238.227.158:8080";

var playObj = null ;
var _fll_control = false ; 

function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串 
    var theRequest = new Object(); 
	  if (url.indexOf("?") != -1) { 
		 var str = url.substr(1); 
		 strs = str.split("&"); 
		 for(var i = 0; i < strs.length; i ++) { 
			 theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
	   } 
	} 
	return theRequest; 
} ;

function  startAllEvent() { 
	  $("#lyr").rollbar({zIndex:100});   
	  console.log("--start---");  
	  $(".start em").click(function(){
			console.log("---start---") ; 
			songIndex=$(this).attr("sonN"); 
			var songid=$(this).data("songid");
			var imgurl = $(this).data("imgurl");  
			$(".start em").css({
				"background":"",
				"color":""
			});
			$(".manyou").remove();
			$(".songList").css("background-color","#f5f5f5");
			$(this).css({
				"background":'url("../../images/T1X4JEFq8qXXXaYEA_-11-12.gif") no-repeat',
				"color":"transparent"
			}); 
			$(".music_white").removeClass("music_white");
			$(this).parent().parent().parent().css("background-color","#f0f0f0"); 
			 $(this).parent().parent().addClass().addClass("music_white");  
			/*底部显示歌曲信息*/
			var songName=$(this).parent().parent().find(".colsn").html();
			var singerName =$(this).parent().parent().find(".colcn").html();
			$(".songName").html(songName);
			$(".songPlayer").html(singerName); 
			/*换右侧图片*/ 
			if ((imgurl) && (imgurl.indexOf("hiphotos")==-1)) { //解决百度图片盗用问题
				$("#AlbumImg").attr("src",imgurl);
				$("#AlbumImg").load(function(){
					loadBG(imgurl);
				});
			} else {
				$("#AlbumImg").attr("src","../../images/nofind.jpg");
			} 
			$(".blur").css("opacity","0");
			$(".blur").animate({opacity:"1"},1000); 
	        $.getJSON(agentUrl+'/mp3AgentServer/',{'song_id' : songid},  
			   function (json) {  
			   	    console.log("--getJSON music--");
			        showLrcInfo(json.song_lrc_info);//准备播放 lrcurl:歌词的URL地址  
			        _fll_control = false ;
	   			    /*
	   			     * 修改按钮为播放
	   			     */
			        $(".iplay").css("background",'url("../../images/T1oHFEFwGeXXXYdLba-18-18.gif") 0 0');
					$(".playBtn").css("background-position","0 -30px");
					$(".playBtn").attr("isplay","1"); 
					stop(); //每次切歌前先停止
                    play(playUrl+json.mp3path) ; 
			   }   
			);  
	   });
	
	/*-切换 -*/
		$(".pinBtn").click(function(){
			$(this).toggleClass("pinBtn-no");
			$(this).toggleClass("pinBtn-yes"); 
		}) ;
		/*双击播放*/
		$(".songList").dblclick(function(){
			var sid = $(this).find(".start em").html();
			$(".start em[sonN="+sid+"]").click();
		});
		/*底部进度条控制*/
		$( ".dian" ).draggable({ 
			containment:".pro2",
			drag: function() {
				$( ".dian" ).css({"top":"0px;"});
				if ($(".playBtn").attr("isplay")=="0"){
				 	return ;
				 } 
				var l=$(".dian").css("left");
				var le = parseInt(l);		
				console.log("le:="+le); 
			    var _duration = Math.floor(myListener.duration/1000) ;	
				console.log("_duration:="+_duration);
				var apos =  _duration*(le/_timelineWidth)  
				console.log("apos:="+apos);
//				 if (apos>=(_duration-10)){
//				 	ended(); 
//				 } else {
				 	setPosition(apos*1000) ;
//				 }  
				 console.log("--------------------------------");
	      	}
		});
		/*音量控制*/
		$( ".dian2" ).draggable({ 
			containment:".volControl",
			drag: function() {
				var l=$(".dian2").css("left");
				var le = parseInt(l);
			    setVolume(le);
	      }
		});
		/*底部播放按钮*/
		$(".playBtn").click(function(){	
			var obj = $(this);   
			var p = obj.attr("isplay");		
			if (p==0) {
				obj.css("background-position","0 -30px");
				obj.attr("isplay","1");
				play(); 
			}
		    if (p==1) {
				obj.css("background-position","");
				obj.attr("isplay","0");
				pause() ; 
			};  
		});

		/*切歌*/
		$(".prevBtn").click(function(){ 
			var sid = parseInt(songIndex)-1; 
			$(".start em[sonN="+sid+"]").click();
			
		});
		$(".nextBtn").click(function(){ 
			var sid = parseInt(songIndex)+1; 
			$(".start em[sonN="+sid+"]").click(); 
		});    
    fPlay();
	loadBG();
};

//function mPlay()//开始播放
//{   
//	  this.duration
//	
// var nowpos = myListener.position ;	
// var m =  parseInt(nowpos);	
// if ((m==0) && _fll_control){ 
// 	 if ($(".playBtn").attr("isplay")=="1"){ 
// 	 	_fll_control = false ;
// 	   playObj.ended();	
// 	 } 
// } else { 
// 	  show(nowpos); 
//    window.setTimeout("mPlay()",100) 
//    updateProgress();
// }
//
//}
function fPlay(){
	$(".start em[sonN="+songIndex+"]").click();
} 
/*首尾模糊效果*/
function loadBG(imgurl){
	//alert();
	// stackBlurImage('canvas1', 'canvas', 60, false);
	var c=document.getElementById("canvas");
	var ctx=c.getContext("2d");
	var img=document.getElementById("AlbumImg");
//	ctx.drawImage(img,0,0,1300,550);
    ctx.drawImage(img,0,0,942,510);
	ctx = null;
	c = null ;     
	img = null ;
 
// $(".bottom").css({"background-image":"url('"+imgurl+"')"});
//  $(".bottom").css({"background-position":"0 -80"});
  
// 	background-image: url();
//	background-repeat: no-repeat;
//	background-size: 1300px;;
//	ctx.drawImage(img,45,45,139,115,0,0,1366,700);
//	stackBlurCanvasRGBA('canvas',0,0,1366,700,60); 
}

function calcTime(time){
	var hour;         	
	var minute;    	
	var second;
	hour = String ( parseInt ( time / 3600 , 10 ));
	if (hour.length ==1 )   hour='0'+hour;
	minute=String(parseInt((time%3600)/60,10));
	if(minute.length==1) minute='0'+minute;
	second=String(parseInt(time%60,10));
	if(second.length==1)second='0'+second;
	return minute+":"+second;
}
 

 
function show(t)//显示歌词 
{ 
	var div1=document.getElementById("lyr");//取得层
	document.getElementById("lyr").innerHTML=" ";//每次调用清空以前的一次 
	if(t<lytime[lytime.length-1])//先舍弃数组的最后一个
		{ 	
			for(var k=0;k<lytext.length;k++)
				{ 
	   			if(lytime[k]<=t&&t<lytime[k+1]) 
	   			{ scrollh=k*25;//让当前的滚动条的顶部改变一行的高度 
	   			div1.innerHTML+="<font color=#f60 style=font-weight:bold>"+lytext[k]+"</font><br>"; 
	   			} 
	   			else if(t<lytime[lytime.length-1])//数组的最后一个要舍弃
	   	 		div1.innerHTML+=lytext[k]+"<br>"; 
	 			} 
 		}
   else//加上数组的最后一个
      { 
         for(var j=0;j<lytext.length-1;j++) 
            div1.innerHTML+=lytext[j]+"<br>"; 
            div1.innerHTML+="<font color=red style=font-weight:bold>"+lytext[lytext.length-1]+"</font><br>"; 
      } 
} 
function scrollBar()//设置滚动条的滚动 
{ 
      if(document.getElementById("lyr").scrollTop<=scrollh) 
         document.getElementById("lyr").scrollTop+=1; 
      if(document.getElementById("lyr").scrollTop>=scrollh+50) 
         document.getElementById("lyr").scrollTop-=1; 
      window.setTimeout("scrollBar()",delay); 
} 

var showLrcInfo =function(result) {  
		$("#lry").html("");
		if (result=="") {
			$("#lry").html("本歌暂无歌词！");
		};
		var arrly=result.split("\n");//转化成数组 
	  	tflag=0;
	  	for( var i=0;i<lytext.length;i++)
		{
			lytext[i]="";
		}
		for( var i=0;i<lytime.length;i++)
		{
			lytime[i]="";
		} 
	  	document.getElementById("lyr").scrollTop=0;
		for(var i=0;i<arrly.length;i++) 
	  	    sToArray(arrly[i]); 
		sortAr(); 
		scrollBar();      
} ;

 
function sToArray(str)//解析如“[02:02][00:24]没想到是你”的字符串前放入数组
{  
	
   var left=0;//"["的个数
   var leftAr=new Array(); 
   for(var k=0;k<str.length;k++) 
   { 
      if(str.charAt(k)=="[") { leftAr[left]=k; left++; } 
   } 
   if(left!=0) 
   {
      for(var i=0;i<leftAr.length;i++) 
      {  
         lytext[tflag]=str.substring(str.lastIndexOf("]")+1);//放歌词 
         lytime[tflag]=conSeconds(str.substring(leftAr[i]+1,leftAr[i]+6));//放时间
         tflag++; 
      } 
   }  
} 
function sortAr()//按时间重新排序时间和歌词的数组 
{ 
	var temp = null;
	var temp1 = null;
	for(var k = 0; k < lytime.length; k++) {
		for(var j = 0; j < lytime.length - k; j++) {
			if(lytime[j] > lytime[j + 1]) {
				temp = lytime[j];
				temp1 = lytext[j];
				lytime[j] = lytime[j + 1];
				lytext[j] = lytext[j + 1];
				lytime[j + 1] = temp;
				lytext[j + 1] = temp1;
			}
		}
	}
}
function conSeconds(t)//把形如：01：25的时间转化成秒；
{	
   var m=t.substring(0,t.indexOf(":")); 
   var s=t.substring(t.indexOf(":")+1); 
   m=parseInt(m.replace(/0/,""));
   //if(isNaN(s)) s=0; 
   var totalt=parseInt(m)*60+parseInt(s); 
   //alert
   // (parseInt(s.replace(//b(0+)/gi,""))); 
   //if(isNaN(totalt))  return 0;  
	return totalt; 
} 
   
   var myListener = new Object();
    
    myListener.onInit = function()
    {
        this.position = 0;
        console.log("---myListener.onInit---"); 
    }; 
    myListener.onUpdate = function()
    {   
    	
    	//	
// var nowpos = myListener.position ;	
// var m =  parseInt(nowpos);	
// if ((m==0) && _fll_control){ 
// 	 if ($(".playBtn").attr("isplay")=="1"){ 
// 	 	_fll_control = false ;
// 	   playObj.ended();	
// 	 } 
// } else { 
// 	  show(nowpos); 
//    window.setTimeout("mPlay()",100) 
//    updateProgress();
// }    
       if ($(".playBtn").attr("isplay")=="0"){ 
	   	 return ;
	    }   
        if ((this.position==0) && _fll_control) {
	         if ($(".playBtn").attr("isplay")=="1"){ 
		   	 	_fll_control = false ;
		   	    ended();	
		   	 }  
	     } 
	     else
	     {
    	 	if (this.position>1) {
    	 		 _fll_control = true ;
    	 	} 
	        /*显示歌曲总长度*/ 
	        var _dur = this.duration/1000;
	        var _pos = this.position/1000; 
			var songTime = calcTime(Math.floor(_dur));  
			$(".duration").html(songTime);
			/*显示歌曲当前时间*/
			var curTime = calcTime(Math.floor(_pos));
			$(".position").html(curTime);
			/*进度条*/  
	        var sliderWidth = 10;
	        var sliderPositionMin = 10;
	        var sliderPositionMax = sliderPositionMin + _timelineWidth - sliderWidth;
	        var sliderPosition = sliderPositionMin + Math.round((_timelineWidth - sliderWidth) * _pos/ _dur);
	        if (sliderPosition < sliderPositionMin) {
	            sliderPosition = sliderPositionMin;
	        }
	        if (sliderPosition > sliderPositionMax) {
	            sliderPosition = sliderPositionMax;
	        } 
	        $(".dian").css("left",sliderPosition+"px");  
	         show(_pos); 
         }
        
    };  
    
    function getFlashObject()
    {
        return document.getElementById("myflashAudio");
    }
    function play(mp3file)
    {     	
    	console.log(" play:="+myListener.position);
        if (myListener.position == 0) { 
        	console.log("mp3file:="+mp3file);          
            getFlashObject().SetVariable("method:setUrl",mp3file);
        }
        getFlashObject().SetVariable("method:play", "");
        getFlashObject().SetVariable("enabled", "true");
    }
    function pause()
    {
        getFlashObject().SetVariable("method:pause", "");
    }
    function stop()
    {
        getFlashObject().SetVariable("method:stop", "");
        myListener.position = 0; 
    }
    function setPosition(pos)
    {
//                  var position = document.getElementById("inputPosition").value;
        getFlashObject().SetVariable("method:setPosition", pos);
//     myListener.position = pos;
    }
    function setVolume(volume)
    {
//                  var volume = 0;
        getFlashObject().SetVariable("method:setVolume", volume);
    } 
    function ended(){ 
      	 var sid = parseInt(songIndex)+1;
	     $(".start em[sonN="+sid+"]").click();
    }
                
                
// function mp3Play(swf) {
//	    this._swf = swf;
//	}
//	mp3Play.prototype = { 
//      play: function() {
//         this._swf.dewplay();
//		},
//      stop: function() {
//         this._swf.dewstop();
//		},
//      pause: function() {
//         this._swf.dewpause();
//		},
//      setMp3: function(mp3filepath) {
//          this._swf.dewset(mp3filepath);
//		},
//      setpos: function(ms) {
//         this._swf.dewsetpos(ms);
//		},
//      getpos: function() {
//         return this._swf.dewgetpos()/1000;
//		},
//      ended:function(){
//      	var sid = parseInt(songIndex)+1;
//	        $(".start em[sonN="+sid+"]").click();
//      }
//   } ;
		
  $(function(){
        console.log("--页面加载完成---"); 
		var flashvars = { 
			   interval: "500",
			   listener: "myListener"
		};
		var params = {
		  AllowScriptAccess: "always",
		  movie:"../../video/swf/player_mp3_js.swf"
		};
        var attributes = {
		  id: "myflashAudio"
		};
				
		console.log("--开始加载FLASH---");
		swfobject.embedSWF("../../video/swf/player_mp3_js.swf", "dewplayer_content", "1", "1", "9.0.0","../../video/swf/expressinstall.swf", flashvars, params, attributes,function(){
			console.log("--开始加载FLASH IS OK---");
		});
//		document.ondragstart = function() {
//		    return false;
//		};
		document.onselectstart=function() {
		    return false;
		};
				    
 }); 		
		 

 
	
 