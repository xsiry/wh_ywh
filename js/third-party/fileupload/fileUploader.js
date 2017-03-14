(function ()
{ 
    $.ligerDefaults.Form.editors['fileUploader'] = $.ligerDefaults.Grid.editors['fileUploader'] = {
        create: function (container, editParm,p)
        {
            var field = editParm.field || editParm.column, editor = field.editor || {}, form = this;
            var editorId = field.name + "_" + new Date().getTime();
            var defaultSrc = 'images/image.png';
            var juploader, jhide;
            if(editor.isInputMode == 1) editor.mode = "input";
            var isReadonly = p.readonly || field.readonly || (field.editor && field.editor.readonly);

            if (editor.mode == "input")
            {
                juploader = $('<div class="l-text fileInputWrap combobox-selector"><input type="text" class="l-text-field"><div class="l-trigger" title="浏览"><div class="l-trigger-icon" ></div></div></div>').appendTo(container);
                juploader.find(".l-trigger-icon").attr("id", editorId);

                jhide = $('<input type="hidden" class="filevalue"  />  ').appendTo(juploader);

                if (isReadonly)
                {
                    juploader.addClass("l-text-readonly");
                    juploader.find(".l-text-field").hide();
                    var jdown = $('<a class="downlink" href="javascript:void(0)"></a>').appendTo(juploader);
                    return {
                        readonly: true,
                        panel: juploader
                    };
                }
            } else
            {
                juploader = $('<div class="uploaderWrap"></div>').appendTo(container);
                jhide = $('<input type="hidden" class="filevalue"  />  ').appendTo(juploader);

                var juploadable = $('<a class="uploadable"></div>').appendTo(juploader);
                var jbtn_del = $('<div class="uploadbtn cancel">删除</div>').appendTo(juploadable);
                var jbtn_edit = $('<div class="uploadbtn edit"></div>').appendTo(juploadable).attr("id", editorId);
                var jpreview = $('<div class="filepreview"><div class="file-title"></div></div>').appendTo(juploader);
                var jimg = $('<img class="imgpreview" />').attr("src", defaultSrc).appendTo(juploader);
                var jpreviewImg = $('<img />').attr("src", defaultSrc).appendTo(jpreview);
             
                 
                var imgWidth = editor.imgWidth || 120;
                var imgHeight = editor.imgHeight || 130;

                jimg.add(juploadable).add(jpreview).width(imgWidth);
                jimg.add(jpreview).height(imgHeight);

                jpreviewImg.width(imgWidth == "auto" ? "auto" : (imgWidth - 14))
                    .height(imgHeight == "auto" ? "auto" : (imgHeight - 25));
            }
        
            /**
             *editor.url 
             *editor.extensions 
             */
            var uploader = WebUploader.create({
                pick: {
                    id: '#' + editorId,
                    label: '&nbsp;&nbsp;&nbsp;&nbsp;',
                    multiple: false
                }, 
                accept : {
                    title: '自定义',
                    extensions: editor.extensions || 'jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
//              formData:{"testtest":"11111111111111111111"},
                runtimeOrder :'flash',
//              sendAsBinary :true ,
                auto: false,
                server: editor.url || 'fileUpload'  ,
                swf: 'js/third-party/webuploader/Uploader.swf',
                fileSingleSizeLimit:1024*1024    
            });
            if (editor.mode != "input")
            {
                jbtn_del.click(function ()
                {
                	console.log("-------jjbtn_del.click--------");
                    jpreviewImg.attr("src", defaultSrc);
                    jpreview.removeClass("filepreview-hasfile");

                    if (fileUploaderAgent.selectedFile)
                    {
                        removeFile();
                    } else
                    {
                        jhide.val("");
                        jimg.attr("src", defaultSrc);
                    }
                });
                //下载旧的文件
                jpreviewImg.click(function ()
                {
                	console.log("-------jpreviewImg.click--------");
                    if (fileUploaderAgent.selectedFile)
                    {
                        return;
                    }
                    var oldsrc = jhide.val();
                    if (!oldsrc)
                    {
                        return;
                    }
                     
                });
            } else
            {

            }
            /**
             * 外部调用
             */
          fileUploaderAgent = {
                jwarp: juploader, 
                uploader: uploader,
                upload: function (jsonparam,callback)
                {
                	console.log("-------fileUploaderAgent upload--------");
                    if (callback)
                    {
                        var postResult = null;
                        uploader.on('uploadSuccess', function (file, e)
                        {
                        	console.log(file);
                        	console.log(e);
                            postResult = e;
                        });
                        // 完成上传完了，成功或者失败，先删除进度条。
                        uploader.on('uploadComplete', function (file)
                        {
                        	console.log(file); 
                        	callback(file, postResult); 
                        });
                        //上传失败
					    uploader.on('uploadError', function( file ) {
					         console.log("==uploadError==");
					         postResult = null;
					    });
                        uploader.on('error', function(handler) {
					       console.log("error:="+handler); 
			            });
			            
			            /**
			             * 文件上传开始
			             */
			            uploader.on('uploadStart', function( file ) { 
					       console.log("uploadStart:="+file.size);
					       if (file.size<200000) { 
					       	  uploader.stop(file); 
					          $.ligerDialog.error('提示：上传图片尺寸不能小于 1024*768');
					       } 
					         
					    });
					    /**
					     * 验证文件格式以及文件大小 
						    uploader.on("error",function (type){
						        if (type=="Q_TYPE_DENIED"){
						            dialogMsg("myModal","messageP","请上传JPG、PNG格式文件");
						        }else if(type=="F_EXCEED_SIZE"){
						            dialogMsg("myModal","messageP","文件大小不能超过8M");
						        }
						    });
					    */
                    }
                    uploader.options.formData = jsonparam;   
                    uploader.upload();
                    
                }
            };
            fileUploaderAgent.selectedFile = null; 
            
            uploader.on('fileQueued', function (file, e)
            {  
                removeFile(); 
                addFile(file);
            }); 
            uploader.on('fileDequeued', function (file)
            { 
                fileUploaderAgent.selectedFile = null;
            });
            function addFile(file)
            {   
                fileUploaderAgent.selectedFile = file;
                if (editor.mode != "input")
                {
                    if ('|png|jpg|jpeg|bmp|gif|'.indexOf('|' + file.ext.toLowerCase() + '|') == -1)
                    {
                        juploader.removeClass("uploaderImageWrap");

                        jpreview.addClass("filepreview-hasfile");
                        jpreviewImg.attr("src", "js/third-party/fileupload/fileTypeImages/file-icons-"+file.ext.toLowerCase()+".gif");
                        jpreview.find(".file-title").attr("title", file.name).html(file.name);

                    } else
                    {

                        juploader.addClass("uploaderImageWrap");
                        uploader.makeThumb(file, function (error, src)
                        {
                            if (error || !src)
                            {
                                 console.log("---error----");
                            } else
                            {
                                jimg.attr("src", src);
                            }
                        }, imgWidth, imgHeight);
                    }
                } else
                {
                    juploader.find(".l-text-field").val(file.name);
                }
            }

            function removeFile()
            { 
                if (!fileUploaderAgent.selectedFile) return;
                uploader.removeFile(fileUploaderAgent.selectedFile); 
                if (editor.mode != "input")
                {
                    juploader.removeClass("uploaderImageWrap");
                    jpreview.removeClass("filepreview-hasfile");
                    var oldsrc = jhide.val();
                    if (oldsrc)
                    {
                        jimg.attr('src', oldsrc);
                    } else
                    {
                        jimg.attr('src', defaultSrc);
                    }
                } else
                {
                    juploader.find(".l-text-field").val('');
                }
            } 
           
            return fileUploaderAgent;
        },
        getValue: function (o, editParm)
        {
        	console.log("-------getValue--------");
            var field = editParm.field || editParm.column, editor = field.editor || {}, form = this;
            if (editor.isInputMode == 1) editor.mode = "input";
            if (o.readonly && o.panel)
            {
                return o.panel.find(".filevalue").val();
            }
            if (o.selectedFile)
            {
                if(!o.savedFn)
                {
                    o.savedFn = function (postData, callback)
                    {
                        o.uploader.on('uploadSuccess', function (file, e)
                        {
                            postData[field.name] = e.url;
                        });
                        o.uploader.on('uploadComplete', function (file, e)
                        {
                            if (callback) callback();
                        });
                        o.uploader.upload();
                    };
                }
                var existSaveFn = false;
                if (!form.saveQueue) form.saveQueue = [];
                for (var i = 0; i < form.saveQueue.length; i++)
                {
                    if (form.saveQueue[i] == o.savedFn)
                    {
                        existSaveFn = true;
                        break;
                    }
                }
                if (!existSaveFn)
                {
                    form.saveQueue.push(o.savedFn);
                }
            }
            return o.jwarp.find(".filevalue").val();
        },
        setValue: function (o, value, editParm)
        {
        	console.log("-------setValue--------");
            var field = editParm.field || editParm.column, editor = field.editor || {}, form = this;
            if (o.readonly && o.panel)
            {
                if (value)
                {
                    var fName = getFileName(value);
                    o.panel.find(".filevalue").val(value);
                    o.panel.find(".downlink").html(fName).attr("href", "/" + value).attr("target", "_blank");
                }
                return;
            }
            if (editor.isInputMode == 1) editor.mode = "input";
            if (value)
            {
                var ext = value.replace(/.+\./, "");
               
                if (editor.mode != "input")
                {
                    if ('|png|jpg|jpeg|bmp|gif|'.indexOf('|' + ext.toLowerCase() + '|') == -1)
                    {
                        o.jwarp.find(".filepreview")
                            .addClass("filepreview-hasfile")
                            .find("img")
                            .attr("src", "js/third-party/fileupload/fileTypeImages/file-icons-"+ext.toLowerCase()+".gif");
                        o.jwarp.find(".file-title").attr("title", fName).html(fName);
                    } else
                    {
                        o.jwarp.addClass("uploaderImageWrap");
                        o.jwarp.find("img").attr("src",value);
                    }
                } else
                {
                    o.jwarp.find(".l-text-field").val(fName);
                }

                o.jwarp.find(".filevalue").val(value);

            }
        },
        resize: function (o, width, height, editParm)
        {
        	 
            var field = editParm.field || editParm.column, editor = field.editor || {}, form = this;
            if (o.readonly && o.panel)
            { 
                o.panel.width(width - 2);
                return;
            }
            if (editor.isInputMode == 1) editor.mode = "input";
            if (editor.mode == "input")
            {
                o.jwarp.width(width - 2);
                o.jwarp.find(".l-text-field").width(width - 20);
            }
        }
    };

    function downloadFile(e)
    {
    	console.log("-------downloadFile--------");
        var url = e.url || ""; 
        var jframe = $('iframe#downloadFile_iframe');
        if (jframe.length == 0)
        {
            jframe = $('<iframe />').attr('id', 'downloadFile_iframe').hide().appendTo('body');
        }
        jframe.attr("src", url);
    };

    function getFileName(o){
    	console.log("-------getFileName--------");
        var pos = o.lastIndexOf("\\");
        if (pos == -1) pos = o.lastIndexOf("/");
        return o.substring(pos+1);  
    }
    
})();