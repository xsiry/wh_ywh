/*
 * .addClass('active')
 *  .find('> .dropdown-menu > .active')
 *   .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)
 *  var data  = $this.data('bs.tab')
 *
 * 提交按钮转动
 *  autospin: true,
                action: function(dialogRef){
                    dialogRef.enableButtons(false);
                    dialogRef.setClosable(false);

 */
(function($, $ssoftDialog){
  /**
   * 处理dialog皮肤
   * @param {Object} dialog
   * @param {Object} mialogwidth
   * @param {Object} mcontentminheight
   * @param {Object} mbodyheight
   */
   var setDialogSkin = function (dialog,mialogwidth,mcontentminheight,mbodyheight){
	    dialog.realize();
	    if (mbodyheight) {
	        dialog.getModalBody().attr("style","height:"+mbodyheight+"px;");
	        dialog.getModalBody().css({"overflow":"auto"});
	    } else if (mcontentminheight) {
	      	dialog.getModalContent().css({"min-height":mcontentminheight+"px;"}) ;
	    }

	//  dialog.getModalBody().css('background-color', '#0088cc');
	    dialog.getModalBody().css({"padding":0});
	    dialog.getModalContent().css({"border":"double 2px #3276b1"}) ;
	    dialog.getModalHeader().attr("style","padding:8px;background:linear-gradient(to bottom,rgb(30,140,235), rgb(29,140,232)) !important;border-top-left-radius:1px;");
//	    dialog.getModalDialog().css("style","width:"+mialogwidth+"px !important;");
        if (mialogwidth==1000) //宽度必须要有几个标准
           $(dialog.getModalDialog()).addClass("screen-wd1000");
        else if (mialogwidth==800) //宽度必须要有几个标准
           $(dialog.getModalDialog()).addClass("screen-wd800");
        else  if (mialogwidth==680) //宽度必须要有几个标准
           $(dialog.getModalDialog()).addClass("screen-wd680");
         else  if (mialogwidth==600) //宽度必须要有几个标准
           $(dialog.getModalDialog()).addClass("screen-wd600");
        else //没定义就按照传入的
           dialog.getModalDialog().attr("style","width:"+mialogwidth+"px !important;");

	    dialog.getModalFooter().css({"padding":"10px !important","background":"#F7F7F7"}) ;
	}

	/**
	 * 处理遮挡透明度
	 * @param {Object} dialog
	 */
	var setMdbackdrop = function (dialog) {
		 var mdbackdrop= $(dialog.getModal()).find(".modal-backdrop").eq(0);
	    if (mdbackdrop)
	      mdbackdrop.attr("style","opacity: 0.1 !important");
	}


  //更改当前的 dialog 对象
  var dialogOpen = function(nowdialog){
 	  nowdialog.open();
 	  setMdbackdrop(nowdialog);
 	  $ssoftDialog.dialog = nowdialog ; // 如果有多个弹出窗体，第二个窗体获取，可能会获取到上一个，已经取消了的
  }


  var dialogActionMap = {
	    Set : function(key,value){this[key] = value},
	    Get : function(key){return this[key]},
	    Contains : function(key){return this.Get(key) == null?false:true},
	    Remove : function(key){delete this[key]}
  }

  /**
   * 设置回调函数到MAP里，为了支持多个弹窗
   * 函数在关闭事件里清空
   * @param {Object} callback
   */
  $ssoftDialog.setDialogAction = function(callback) {
  	 dialogActionMap.Set($ssoftDialog.dialog.getId(),callback);

  }

  /**
   * 获取自己当前弹出窗体的 回调函数
   * @param {Object} diglogid
   */
  var getDialogAction = function(dialogRef){
	dialogExecAction = dialogActionMap.Get(dialogRef.getId()) ;
//	dialogActionMap.Remove(diglogid);
// debugPrint("---getDialogAction---"+dialogRef.getId()) ;
  }

  /**
   * 清除要闭关的窗体函数
   * @param {Object} diglogid
   */
  var delDialogAction = function(dialogRef){
	dialogActionMap.Remove(dialogRef.getId());
  }


  //底部追加说明
  var setDialogFooterInfo= function(nowdialog,info) {
  	  $(nowdialog.getModalFooter()).show();
      $(nowdialog.getModalFooter()).prepend("<div class='fl'>"+info+"</div>");
  }

   /**
    *  draggable: true 拖动
    * 通用弹出模板窗体: 调用此函数统一要求是没有，底部不放入按钮事件框
    * @param {Object} dtitle
    * @param {Object} htmlurl
    * @param {Object} mialogwidth
    * @param {Object} mcontentminheight
    * @param {Object} mbodyheight
    * @param {Object} callback
    * @param {Object} paramjson
    * eg : $ssoftDialog.openSsoftDialog("科目设置","page/sysmenu/dict/dict_course_dialog.html",550,450,480);
    */
   $ssoftDialog.openSsoftDialog=function(dtitle,footerhtml,htmlurl,mialogwidth,mcontentminheight,mbodyheight,callback,paramjson) {
      var dialog = new BootstrapDialog ({
                title :dtitle,
			    autodestroy : true,draggable: true,closable: true,closeByBackdrop: false,closeByKeyboard: false,
	            message: function(dialog) {
	                var $message = $('<div></div>');
	                var pageToLoad = dialog.getData('pageToLoad');
	                $message.load(pageToLoad);
	                return $message;
	            },
	            data: {
	                'pageToLoad': htmlurl ,
	                'callback'  : callback ,
	                'paramjson' : paramjson
	            }
	        });
          setDialogSkin(dialog,mialogwidth,mcontentminheight,mbodyheight);
          dialogOpen(dialog);
          if (footerhtml)
            setDialogFooterInfo(dialog,footerhtml);
        };

    /**
     * 通用弹出模板窗体:  可以底部放入按钮事件框
     * 调用网页列子参考：sys_account_list.html
     * @param {Object} dtitle
     * @param {Object} btntitle
     * @param {Object} isclose
     * @param {Object} htmlurl
     * @param {Object} mialogwidth
     * @param {Object} mcontentminheight
     * @param {Object} mbodyheight
     * @param {Object} callback
     * 第一个调用窗体执行的函数，由 $ssoftDialog.saveAction 方法触发
     * eg: callback 在保存数据成功后，触发
     * $sHelper.AjaxSendData('saveSysMenuAction',actionname:sysaccount",datajson:JSON.stringify(saveparam),null,function(msg){
        	 	 if (isclose) {
        	 	 	if (callback)  callback();
        	 	 	dialog.close();
        	 	 }
            },paramjson) ;
     * @param {Object} paramjson
     */
   $ssoftDialog.openSsoftSaveDialog=function(dtitle,btntitle,isclose,htmlurl,mialogwidth,mcontentminheight,mbodyheight,callback,paramjson) {
      var dialog = new BootstrapDialog ({
                title :dtitle,
			    autodestroy : true,draggable: true,closable: true,closeByBackdrop: false,closeByKeyboard: false,
	            message: function(dialog) {
	                var $message = $('<div></div>');
	                var pageToLoad = dialog.getData('pageToLoad');
	                $message.load(pageToLoad);
	                return $message;
	            },
	            onhidden: function(dialogRef){ //当窗体关闭时候，清空此窗体设置的事件
	                delDialogAction(dialogRef);
	            },
	            data: {
	                'pageToLoad': htmlurl,
	                'isclose' : isclose ,
	                'paramjson' : paramjson
	            },
	            buttons: [
	              {
	             	 label: btntitle,
	                 icon: 'glyphicon glyphicon-ok',
	                 cssClass: 'btn-primary',
	                 action: function(dialogRef){
	                 	/**
	                 	 * 兼容 $ssoftDialog.saveAction 处理步骤。
	                 	 * 先调用MAP查找，如果找到，不执行 $ssoftDialog.saveAction
	                 	 */
	                 	getDialogAction(dialogRef);
	                 	if (dialogExecAction) {
	                 		dialogExecAction(dialogRef,callback,paramjson);
	                 	} else if ($ssoftDialog.saveAction){ //MAP ACTION里找不到，执行 老版本方法
	                 		$ssoftDialog.saveAction(dialogRef,callback,paramjson);
	                 	}
	                 }
	              }
	              ,
	              {
	             	 label: '关闭',
	                 icon: 'glyphicon glyphicon-remove',
	                 cssClass: 'btn-primary',
	                 action: function(dialogRef){
	                    dialogRef.close();
                      $('div.note-link-popover').hide();
	                 }
	              }
	            ]

	        });
          setDialogSkin(dialog,mialogwidth,mcontentminheight,mbodyheight);
          dialogOpen(dialog);
    };

  /**
   *当前活动可以操作的 dialog 对象
   */
  $ssoftDialog.dialog = null ;

  /**
   * 此接口已经废除，为了兼容以前的，暂时留着
   *
   * 新的请调用 dialogExecAction
   */
  $ssoftDialog.saveAction = null ;

  /**
   * 以后都调用此方法 :setDialogAction
   */
  var dialogExecAction = null ;

}(jQuery, window.$ssoftDialog={} ));
