(function(i){var b=null;var j="../../images/game/4.jpg";var a="http://115.238.227.158:8080/fgzweb/video/oceans.mp4";var e=function(){i(".videoImgPlay").on("click",function(l){var k=i(this);j=k.data("img");a=k.data("video");console.log("imgpath:="+j);console.log("videopath:="+a);g();h(j,a,1);l.preventDefault();k=null});i(".ds_mvlist").on("click",".ds_video_click",function(l){var k=i(this);i(".ds_mvlist").find(".ds_video_click_sel").removeClass("ds_video_click_sel");k.toggleClass("ds_video_click_sel");l.preventDefault();k=null})};var c={skin:"../../video/skins/mySkin.swf",thumbnail:j,video:a,autoplay:0};var d={quality:"high",menu:"true",allowFullScreen:"true",scale:"scale",allowScriptAccess:"always",swLiveConnect:"true"};var f={id:"flasVideoPlayId"};var h=function(l,k,m){};var h=function(l,k,o){if(swfobject.hasFlashPlayerVersion("6")){var n=document.getElementById("myVieoPlay");if(!n){var m=document.createElement("div");m.setAttribute("id","myVieoPlay");document.getElementById("content-container").appendChild(m)}c.thumbnail=l;c.video=k;c.autoplay=o;swfobject.embedSWF("../../video/swf/player_video.swf","myVieoPlay","858","510","9.0.0",false,c,d,f,function(){b=document.getElementById("flasVideoPlayId")})}};function g(){swfobject.removeSWF("flasVideoPlayId")}i(function(){e();h(j,a,0)})}(jQuery));
