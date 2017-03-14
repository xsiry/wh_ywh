(function($,$netbar_remote_dialog){

	var $root = $(".netbar_remote_dl gpage_clsf");
    var _qsource = "netbar_remote";
    var dialog_param  =  $ssoftDialog.dialog.getData("paramjson") ;
	var pageBindingAction = function(){
		$root.on("change", '.table-td-rowone', function(actionobj) {
	        var rowobj = $(this);

	        actionobj.preventDefault();
			rowobj = null ;
	    });
		showDbInfo();
	}

	var showDbInfo = function(){
		var sourceparam = {"source":_qsource,"qtype":"select@userRemoteShow"} ;
        sourceparam.qhstr = JSON.stringify({qjson:[{"netbarid":dialog_param.netbarid}]});
    	$.getJSON(_hostaddr +'ywh_queryTableList',sourceparam,
			function (jsondata) {
			 	$("#netbarRemoteSelectLs_div").empty();
		 	 	$.each(jsondata, function(index,data) {
		 	 		if (data.outip){
		 	 			var html=template(document.getElementById('netbarRemoteSelectLs-tpl').innerHTML
					 	     , {rowdata:data});
		 	 			console.log(html)
		                $("#netbarRemoteSelectLs_div").append(html);
		 	 		}
		 	 	});
			}
	    );
    }

	$netbar_remote_dialog.netbar_remote_dialogAction = function(){
		pageBindingAction();
		pageSetUp();
	}
}(jQuery,window.$netbar_remote_dialog={}));