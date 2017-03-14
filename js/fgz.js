

// \r\n 需要自己加回车
			
			$(".testhttppost").on("click",   function(actionobj) { 
	 		    var selbj = $(this); 	 
	 		    	$.ajax({
			             type: "POST",
			             cache:false ,
			             url: "http://139.196.189.88:82",
			             data: '{"cType":5001,"ucid":296400,"Area":"99000","cKey":"14-DD-A9-28-ED-FE,pc-007","cDateTime":"2016-08-05 13:59:25","PIP":"0.0.0.11","CusData1":"http://astro.sina.com.cn/vogue","CusData2":"","CusData3":"2016-08-05 13:59:26"}\r\n',
//			             contentType:"application/text;charset=UTF-8", 
                         contentType:"application/x-www-form-urlencoded; text/xml;charset=UTF-8",
//			             dataType: "text",
			             beforeSend :function(XMLHttpRequest){//Content-Length
			             	console.log("-----------beforeSend------------"); 
			             	console.log("getAllResponseHeaders:"+XMLHttpRequest.getAllResponseHeaders());
				            console.log("-----------beforeSend------------");
				         },
				         complete:function(XMLHttpRequest, textStatus){ 
				              console.log("complete 请求对象XMLHttpRequest: "+XMLHttpRequest.responseText+" ,错误类型textStatus: "+textStatus );
			                  console.log("-----------------------");
				         } ,
			             success: function(data,textStatus){
			                   console.log("success data:="+data);
			                   console.log("success textStatus:="+textStatus);
			                   console.log("-----------------------");
			            },
			            error: function(XMLHttpRequest, textStatus, errorThrown){
					          console.log("error textStatus:="+textStatus);
					          console.log("error 请求对象XMLHttpRequest: "+XMLHttpRequest.responseText+" ,错误类型textStatus: "+textStatus+",异常对象errorThrown: "+errorThrown);
			                  console.log("-----------------------");
					    }   
			         }); 
	 		    actionobj.preventDefault(); 
	 		    selbj = null;
			}) ; 