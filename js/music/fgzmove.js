(function($){ 
	
	    var myPlayer = null ;  
	    /**
	     * 初始化默认
	     */
		var _nowimgpath = "../../images/game/4.jpg";
		var _nowvideopath="http://115.238.227.158:8080/fgzweb/video/oceans.mp4";
		var bingfunction= function(){
			$(".videoImgPlay").on("click",   function(actionobj) { 
	 		    var selbj = $(this); 	
	 		    _nowimgpath = selbj.data("img");
	 		    _nowvideopath = selbj.data("video"); 
	 		    console.log("imgpath:="+_nowimgpath);
	 		    console.log("videopath:="+_nowvideopath);
	 		    remove();
	 		    openFlashPlay(_nowimgpath,_nowvideopath,1); 
	 		    actionobj.preventDefault(); 
	 		    selbj = null;
			}) ; 
			
			$(".ds_mvlist").on("click", ".ds_video_click" ,function(actionobj) { 
	 		    var selbj = $(this); 	
	 		    $(".ds_mvlist").find(".ds_video_click_sel") .removeClass("ds_video_click_sel");
	 		    selbj.toggleClass("ds_video_click_sel");	 		    
	 		    actionobj.preventDefault(); 
	 		    selbj = null;
			}) ;  
			
		} 
		
		var flashvars = { 
			 skin:"../../video/skins/mySkin.swf", 
			 thumbnail:_nowimgpath,
			 video:_nowvideopath,
			 autoplay:0
		};
		var params = {
		   quality:"high",menu:"true",
		   allowFullScreen:"true",scale:"scale",
		   allowScriptAccess:"always",swLiveConnect:"true" 		
		};
		var attributes = {
		  id: "flasVideoPlayId"
		};
		
		/**
		 * @param {Object} imgpath
		 * @param {Object} movepath
		 * @param {Object} auto 1,自动播放
		 */ 
		var openFlashPlay = function(imgpath,movepath,auto){
//		  if (swfobject.hasFlashPlayerVersion('6')) { 
		    var c = document.getElementById('myVieoPlay');
		    if (!c) {
		      var d = document.createElement('div');
		      d.setAttribute('id', 'myVieoPlay');
		      document.getElementById('content-container').appendChild(d);
		    };
		    flashvars.thumbnail = imgpath ;
			flashvars.video = movepath ;
			flashvars.autoplay= auto;
			console.log("--开始加载FLASH---");
			swfobject.embedSWF("../../video/swf/player_video.swf", "myVieoPlay", "858", "510", "9.0.0", "../../video/swf/expressinstall.swf",
			    flashvars, params, attributes,function(){
				  myPlayer = document.getElementById("flasVideoPlayId"); 
				  console.log("--开始加载FLASH IS OK---");
			    }
			);
		    
		};
		
		function remove() {
		    swfobject.removeSWF('flasVideoPlayId');
		}; 
		
		$(function(){    
		    console.log("--页面加载完成---");
		    bingfunction();
		    openFlashPlay(_nowimgpath,_nowvideopath,0); 
		});  
		
	
}(jQuery));