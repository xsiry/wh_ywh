(function($) {
  var _qsource = "boot_task";
  var _qsource_detail = "group_task";

  var _ModeId = "boot_task_Page_ModelId";

  var $root = $(".boot_taskpage_clsf");

  var dataparam = {};
  var setDataParam = function() {
    delete dataparam["sysusid"];
    dataparam.sysusid = userAccInfo.sysusid;
    pageListGrid.init();
  }

  var addNewWindowsForm = function() {
    $sHelper.NewWindowsForm(_ModeId);
  }

  var pageBindingAction = function() {
    $root.on("click", '.boot_task_yydzm', function(actionobj) {
      var rowobj = $(this);
      var _JsonArr = [];
      var _groupidsStr = $("#btTaskComboBoxId").ligerGetComboBoxManager().getValue();
      var _groupidsText = $("#btTaskComboBoxId").ligerGetComboBoxManager().getText();

      if (!_groupidsStr) {
        $.ligerDialog.error('请选择需要添加任务的分组！');
        return;
      }

      var _groupids = _groupidsStr.split(';');
      var row = pageListGrid.grid.getSelectedRows();
      if (row.length == 0) {
        $.ligerDialog.error('请选择要添加的任务！');
        return;
      }
      $.each(row, function(index, data) {
        $.each(_groupids, function(index, groupid) {
          _JsonArr.push({ "groupid": groupid, "btid": data.btid });
        })
      });
      var actionparam = { actionname: _qsource_detail }
      actionparam.datajson = JSON.stringify(_JsonArr);
      actionparam.operjson = JSON.stringify({ opertype: ["updateGroupBootTask"] });
      $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, pageListGrid, function() {

      });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.boot_task_querybtn', function(actionobj) {
      var rowobj = $(this);
      var _name = $("#boot_task_name").val();
      var task_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (_name) {
        task_info.qjson.push({ "btname": _name });
        task_info.qjsonkeytype.push({ "btname": "LIKE_ALL" });
      }
      reloadGridParam(task_info);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.boot_task_createbtn', function(actionobj) {
      var rowobj = $(this);
      isUploadStart = true;
      Add_Page_Model(0);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="boot_task_psedit"]', function(actionobj) {
      var rowobj = $(this);
      var btid = rowobj.data("btid");
      isUploadStart = false;
      Add_Page_Model(btid);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="boot_task_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var btid = rowobj.data("btid");
      var delParam = {};
      delParam.tid = btid;
      delParam.tname = _qsource;
      //是否删除
      $sHelper.deleteData("ywh_delAction/", delParam, pageListGrid, function(message) {
        if (message.success)
          $.ligerDialog.success(message.msg);
        else
          $.ligerDialog.error(message.msg);
      }, "是否确认删除所任务信息？");
      actionobj.preventDefault();
      rowobj = null;
    });

    addNewWindowsForm();
    createPageFunction();
    setDataParam();
  }

  var createPageFunction = function() {
    $("#btTaskComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_group&qtype=select@online',
      valueField: 'groupid',
      textField: 'groupname',
      isShowCheckBox: true,
      isMultiSelect: true,
      onBeforeSelect: function(value, text) {
        if (value) {
          if (pageListGrid.grid.getSelectedRows().length == 0) {
            $.ligerDialog.error('请先选择要添加的任务！');
            return false;
          }
        }
        return true;
      }
    });
  }

  var reloadGridParam = function(parmJsonArr) {
    pageListGrid.grid.set('parms', { qhstr: JSON.stringify(parmJsonArr) });
    pageListGrid.grid.changePage("first");
    pageListGrid.reload();
  }

  var pageListGrid = {
    main: "#boot_task_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '任务名称', name: 'btname', width: '10%', align: 'left' }, {
            display: '任务类型',
            align: 'left',
            name: 'btype',
            width: '10%',
            isSort: false,
            render: function(rowdata, rowindex, value) {
              return '<span>云端下发</span>';
            }
          },
          { display: '上传文件', name: 'btupfile', width: '15%', align: 'left' },
          { display: '执行程序', name: 'btexec', width: '15%', align: 'left' },
          { display: '参数', name: 'btparam', width: '10%', isSort: false, align: 'left' },
          { display: '延时', name: 'bttimeout', width: '15%', align: 'left' },
          { display: '执行系统', name: 'btsystem', width: '10%', isSort: false, align: 'left' }, {
            display: '操作',
            width: '15%',
            align: 'left',
            render: function(rowdata, rowindex, value) {
              var h = "";
              h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="boot_task_psedit" data-btid="' + rowdata.btid + '">修改</a>';
              h += '<a href="javascript:void(0);" class=" mg-5"  data-action="boot_task_pgdel" data-btid="' + rowdata.btid + '">删除</a>';
              return h;
            }
          }
        ],
        parms: { qhstr: JSON.stringify({ qjson: [dataparam] }) },
        fixedCellHeight: false,
        headerRowHeight: 40,
        isScroll: true,
        frozen: false,
        type: "get",
        dataAction: 'server',
        checkbox: true,
        allowUnSelectRow: true,
        pageSize: 20,
        usePager: true,
        selectRowButtonOnly: true,
        showTitle: false,
        pageSizeOptions: [20, 30, 50],
        sortName: 'btid',
        sortOrder: 'DESC',
        enabledSort: true,
        url: _hostaddr + 'ywh_queryTableList/?source=' + _qsource,
        alternatingRow: false,
        width: '98%',
        height: '98%',
        onAfterShowData: function(currentData) {

        },
        onSuccess: function(data, grid) {

        },
        detail: { onShowDetail: f_showGroups }
      });
    },
    reload: function() {
      this.grid.loadData();
    }
  };

  f_showGroups = function(row, detailPanel, callback) {
    var grid = document.createElement('div');            
    $(detailPanel).append(grid);            
    var girdObj = $(grid).css('margin', 10).addClass('detailGrid').ligerGrid({                
      columns: [
        { display: '已应用分组', name: 'groupname', width: 200, align: 'left' }, {
          display: '操作',
          width: 100,
          align: 'left',
          render: function(rowdata, rowindex, value) {
            var h = "";
            h += '<a href="javascript:void(0);" class="btn btn-labeled btn-danger" style="margin-top: -8px;" ';
            h += 'data-action="security_policy_detail_pgdel" data-gtid="' + rowdata.gtid + '" data-groupid="' + rowdata.groupid + '"> ';
            h += '<i class="glyphicon glyphicon-trash"></i></a>';
            return h;
          }
        }                         
      ],
      isScroll: false,
      showToggleColBtn: false,
      width: '35%',
      usePager: false,
      showTitle: false,
      rowSelectable: false,
      onAfterShowData: callback,
      frozen: false,
      url: _hostaddr + 'ywh_queryTableList',
      type: "get",
      dataAction: 'server',
      parms: {
        source: 'group_task',
        qhstr: JSON.stringify({ 'qjson': [{ 'btid': row.btid }] })
      },
      reload: function() {
        this.grid.loadData();
      }      
    });

    $(grid).on("click", '[data-action="security_policy_detail_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var detailGrid = $('div.detailGrid');
      var gtid = rowobj.data("gtid");
      var groupid = rowobj.data("groupid");
      var delParam = {};
      delParam.tid = gtid;
      delParam.tname = _qsource_detail;
      //是否删除
      $sHelper.deleteData(_hostaddr + "ywh_delAction/", delParam, girdObj, function(message) {
        if (message.success) {
          $.ligerDialog.success(message.msg);
        } else
          $.ligerDialog.error(message.msg);
      }, "是否确认删除该分组？");
      actionobj.preventDefault();
      rowobj = null;
    });
  };

  var modelDialog;

  var Add_Page_Model = function(btid) {
    console.log("btid:=" + btid);
    var modelForm = $('#' + _ModeId).ligerForm({
      inputWidth: 160,
      labelWidth: 90,
      space: 20,
      validate: true,
      labelAlign: "right",
      width: "100%",
      fields: [
        { name: "btid", type: "hidden" },
        { name: "btupfile", attr: { id: "btupfile_id" }, type: "hidden" },
        { name: "btdownfile", attr: { id: "btdownfile_id" }, type: "hidden" },
        { name: "filemd5", attr: { id: "filemd5_id" }, type: "hidden" },
        { display: "任务名称", name: "btname", validate: { required: true }, newline: true, type: "text" },
        { display: "延时", name: "bttimeout", validate: { required: false, isInteger: true }, value: 0, newline: true, type: "int", afterContent: "秒）" }, {
          label: "执行系统",
          name: "btsystem",
          newline: true,
          validate: { required: true },
          type: "checkboxlist",
          comboboxName: "btsystem",
          options: {
            rowSize: 5,
            data: [{ text: 'WinXp', id: 'wxp' }, { text: 'Win7', id: 'w7' }, { text: 'Win10', id: 'w10' }],
            width: 90
          },
          width: 200
        },
        { htmltx: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请将需要执行的文件打包后上传（限<span style="color: red;">ZIP</span>文件，10M以下）' },
        { htmltx: '<div   class="custom_btupfile"><div style="text-align: right;  width: 90px;float:left;margin-top:10px;">上传文件：</div><input id="btupfile_ftp"  type="file" multiple class="file-loading" data-max-file-count="1" data-min-file-count="1"> </div>' },
        { display: "执行程序", name: "btexec", validate: { required: true }, newline: false, type: "text" },
        { display: "执行参数", name: "btparam", validate: { required: false }, newline: false, type: "text" }
      ],
      onAfterSetFields: function() {
        createFileUpload();
        $("#btupfile_ftp").fileinput('refresh', {
          showPreview: false,
          initialPreview: []
        });
      }
    });
    if (btid > 0) {
      $("#btid").val(btid);
      $.getJSON('ywh_queryTableList/?source=' + _qsource, { "sourceid": btid },
        function(json) {
          modelForm.setData(json);
          /*
           * 更新上传控件
           */
          $(".custom_btupfile .file-caption-name").append(json.btupfile);
        }
      );

    }
    modelDialog = $.ligerDialog.open({
      title: "开机任务管理",
      target: $('#mydialogdiv'),
      height: 350,
      width: 600,
      allowClose: false,
      isHidden: false,
      buttons: [{
        text: '保存任务',
        onclick: function(item, dialog) {
          if (modelForm.valid()) {
            if (isUploadStart == true) {
              $("#btupfile_ftp").fileinput('upload');
            } else {
              saveFormData();
            }
          }
        }
      }, {
        text: '关闭',
        onclick: function(item, dialog) {
          dialog.close();
          addNewWindowsForm();
        }
      }]
    });
  };

  var isUploadStart = false;
  var createFileUpload = function() {
    $("#btupfile_ftp").fileinput({
      uploadUrl: "fileUpload", // server upload action
      uploadAsync: true,
      showPreview: false,
      showUpload: false,
      maxFileCount: 1,
      maxFileSize: 10240,
      allowedFileExtensions: ['zip'],
      browseClass: "btn btn-primary", //按钮样式
      previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
      uploadExtraData: function() { //上传时额外参数
        return { "upusid": userAccInfo.sysusid, "ywhUpload": "true" };
      },
      slugCallback: function(filename) { //选择文件后改名
        debugPrint("filename := " + filename);
        $("#btupfile_id").val(filename);
        isUploadStart = true;
        return filename;
      }
    }).on('fileuploaded', function(event, data, previewId, index) {
      /*
       * {"auth":0,"msg":"uploadfile/1474444361754-迅雷游戏盒子.ico","result":"1","success":true,"successno":0}
       */
      $.ligerDialog.closeWaitting();
      var successResult = data.response;
      if (successResult.success) {
        var httpurl = window.location.host;
        httpurl = "http://" + httpurl + '/ywh/' + successResult.msg;
        $("#btdownfile_id").val(httpurl);
        $("#filemd5_id").val(successResult.result);
        saveFormData();
      } else {
        $.ligerDialog.error('---上传失败----' + successResult.msg);
      }
    }).on("filecustomerror", function(event, params) {
      $.ligerDialog.closeWaitting();
      debugPrint("-filecustomerror-");
    }).on("fileuploaderror", function(event, data, previewId, index) {
      $.ligerDialog.closeWaitting();
      debugPrint("-fileuploaderror-");
    }).on('fileerror', function(event, data) {
      $.ligerDialog.closeWaitting();
      debugPrint("--fileerror--");
    }).on('filebatchuploadcomplete', function(event, files, extra) {
      debugPrint("--filebatchuploadcomplete--");
    });
  };

  var saveFormData = function() {
    $.ligerDialog.closeWaitting();
    var savaparm = form2js(document.getElementById(_ModeId));
    savaparm.sysusid = userAccInfo.sysusid;
    debugPrint("savaparm:=" + JSON.stringify(savaparm));
    $sHelper.AjaxSendData("ywh_saveAction/?actionname=" + _qsource, { datajson: JSON.stringify(savaparm) }, pageListGrid, function(message) {
      if (message.success)
        $.ligerDialog.success(message.msg);
      else
        $.ligerDialog.error(message.msg);
      addNewWindowsForm();
      modelDialog.close();
    });
  };

  boot_task_action = function() {
    pageBindingAction();
    pageSetUp();
  }



}(jQuery));
