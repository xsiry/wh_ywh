(function($) {
  var _qsource = "sys_user";

  var _ModeId = "sys_User_Page_ModelId";

  var $root = $(".sys_userpage_clsf");

  var dataparam = {};

  var setDataParam = function() {
    delete dataparam["parentid"];
    dataparam.parentid = userAccInfo.parentid;
    pageListGrid.init();
  }

  var addNewWindowsForm = function() {
    $sHelper.NewWindowsForm(_ModeId);
  }

  var pageBindingAction = function() {

    $root.on("click", '.sys_user_querybtn', function(actionobj) {
      var rowobj = $(this);
      var sysname = $("#sys_user_sysname").val();
      var sysname_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (sysname) {
        sysname_info.qjson.push({ "sysname": sysname });
        sysname_info.qjsonkeytype.push({ "sysname": "LIKE_ALL" });
      }
      reloadGridParam(sysname_info);
      actionobj.preventDefault();
      rowobj = null;
    });
    //创建
    $root.on("click", '.sys_user_createbtn', function(actionobj) {
      var rowobj = $(this);
      Add_Page_Model(0, 'all');
      actionobj.preventDefault();
      rowobj = null;
    });
    //修改
    $root.on("click", '[data-action="sys_user_pgedit"]', function(actionobj) {
      var rowobj = $(this);
      var sysusid = rowobj.data("sysusid");
      Add_Page_Model(sysusid, 'user');
      actionobj.preventDefault();
      rowobj = null;
    });
    $root.on("click", '[data-action="sys_user_psedit"]', function(actionobj) {
      var rowobj = $(this);
      var sysusid = rowobj.data("sysusid");
      Add_Page_Model(sysusid, 'pwd');
      actionobj.preventDefault();
      rowobj = null;
    });

    //删除
    $root.on("click", '[data-action="sys_user_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var sysusid = rowobj.data("sysusid");
      var delParam = {};
      delParam.tid = sysusid;
      delParam.tname = _qsource;
      //是否删除
      $sHelper.deleteData("ywh_delAction/", delParam, pageListGrid, function(message) {
        if (message.success)
          $.ligerDialog.success(message.msg);
        else
          $.ligerDialog.error(message.msg);
      }, "是否确认删除所用户信息？");
      rowobj = null;
    });
    /**
     *停用
     */
    $root.on("click", '[data-action="sys_user_pgstop"]', function(actionobj) {
      var rowobj = $(this);
      var sysusid = rowobj.data("sysusid");
      var ustate = rowobj.data("ustate");
      console.log("ustate:=" + ustate);
      var actionparam = { "actionname": _qsource };
      var savaparm = {};
      savaparm.sysusid = sysusid;
      savaparm.ustate = ustate;
      actionparam.datajson = JSON.stringify(savaparm);
      var msg = "是否确定【启用】此用户？";
      if (ustate == "2") {
        msg = "是否确定【停用】此用户，停用后用户就不能登录？";
      }
      //是否删除
      $sHelper.deleteData("ywh_saveAction/", actionparam, pageListGrid, function(message) {
        if (!message.success)
          $.ligerDialog.error(message.msg);
      }, msg);
      rowobj = null;
    });
    addNewWindowsForm();
    setDataParam();
  }

  var reloadGridParam = function(parmJsonArr) {
    pageListGrid.grid.set('parms', { qhstr: JSON.stringify(parmJsonArr) });
    pageListGrid.grid.changePage("first");
    pageListGrid.reload();
  }

  var pageListGrid = {
    main: "#sys_user_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '用户姓名', name: 'sysname', width: 160, align: 'left' },
          { display: '账户', name: 'username', width: 160, align: 'left' },
          { display: '可见分组', name: 'sysusergroupnames', align: 'left', isSort: false }, {
            display: '权限',
            name: 'authority',
            align: 'left',
            isSort: false,
            render: function(rowdata, rowindex, value) {
              if (value) {
                var newAuthority = value.replace(/Remote_Netbar/g, "远程网吧");
                newAuthority = newAuthority.replace(/Download_Game/g, "下载游戏");
                newAuthority = newAuthority.replace(/Details_View/g, "详情查看");
                newAuthority = newAuthority.replace(/Boot_Task/g, "开机任务");
                newAuthority = newAuthority.replace(/Security_Policy/g, "安全策略");
                newAuthority = newAuthority.replace(/Information_Delivery/g, "信息发布");
                return newAuthority;
              } else return '';
            }
          }, {
            display: '用户状态',
            name: 'ustate',
            align: 'left',
            width: 100,
            render: function(rowdata, rowindex, value) {
              if (value == '1')
                return '<span class="badge bg-color-greenLight">正常</span>';
              else
                return '<span class="badge bg-color-red">停用</span>';
            }
          }, {
            display: '操作',
            width: 300,
            align: 'left',
            render: function(rowdata, rowindex, value) {
              var h = "";
              if (rowdata.ustate == "1")
                h += '<a href="javascript:void(0);" class="mg-5" data-ustate="2"  data-action="sys_user_pgstop" data-sysusid="' + rowdata.sysusid + '">停用</a>';
              else
                h += '<a href="javascript:void(0);" class="mg-5" data-ustate="1"   data-action="sys_user_pgstop" data-sysusid="' + rowdata.sysusid + '">启用</a>';
              h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="sys_user_pgedit" data-sysusid="' + rowdata.sysusid + '">修改用户资料</a>';
              h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="sys_user_psedit" data-sysusid="' + rowdata.sysusid + '">修改密码</a>';
              h += '<a href="javascript:void(0);" class=" mg-5"  data-action="sys_user_pgdel" data-sysusid="' + rowdata.sysusid + '">删除</a>';
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
        checkbox: false,
        allowUnSelectRow: true,
        pageSize: 20,
        usePager: true,
        selectRowButtonOnly: false,
        showTitle: false,
        pageSizeOptions: [20, 30, 50],
        sortName: 'sysusid',
        sortOrder: 'ASC',
        enabledSort: true,
        url: 'ywh_queryTableList/?source=' + _qsource,
        alternatingRow: false,
        width: '98%',
        height: '98%', // heightDiff:70,
        onAfterShowData: function(currentData) {

        },
        onSuccess: function(data, grid) {

        }
      });
    },
    reload: function() {
      this.grid.loadData();
    }
  };


  var Add_Page_Model = function(sysusid, showtype) {
    console.log("sysusid:=" + sysusid);
    var modelForm = $('#' + _ModeId).ligerForm({
      inputWidth: 120,
      labelWidth: 90,
      space: 20,
      validate: true,
      labelAlign: "right",
      width: "100%",
      fields: getPassRow(showtype),
      onAfterSetFields: function() {}
    });
    if (sysusid > 0) {
      $("#sysusid").val(sysusid);
      if (showtype != 'pwd') {
        $.getJSON('ywh_queryTableList/?source=' + _qsource, { "sourceid": sysusid },
          function(json) {
            json.qrpswd = json.pswd;
            modelForm.setData(json);
          }
        );
      }
    }
    var modelDialog = $.ligerDialog.open({
      title: "员工账号管理",
      target: $('#mydialogdiv'),
      height: 350,
      width: 600,
      allowClose: false,
      isHidden: false,
      buttons: [{
        text: '保存',
        onclick: function(item, dialog) {
          if (modelForm.valid()) {
            var savaparm = form2js(document.getElementById(_ModeId));
            savaparm.parentid = userAccInfo.sysusid; //默认添加账号只能自己看见
            debugPrint("savaparm:=" + JSON.stringify(savaparm));
            var actionparam = { "actionname": _qsource }
            actionparam.datajson = JSON.stringify(savaparm);
            if (showtype == 'pwd') {
              actionparam.operjson = JSON.stringify({ opertype: ["updatePwd"] });
            } else if (showtype == 'user') {
              actionparam.operjson = JSON.stringify({ opertype: ["updateInfo"] });
            }
            $sHelper.AjaxSendData("ywh_saveAction", actionparam, pageListGrid, function(message) {
              if (message.success)
                $.ligerDialog.success(message.msg);
              else
                $.ligerDialog.error(message.msg);
              addNewWindowsForm();
              dialog.close();
            });
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

  var getPassRow = function(showtype) {
    if (showtype == 'all') {
      return [
        { name: "sysusid", type: "hidden" },
        { display: "用户姓名", name: "sysname", validate: { required: true }, newline: true, type: "text" },
        { display: "登录账户", name: "username", validate: { required: true }, newline: true, type: "text" },
        { display: "登录密码", name: "pswd", validate: { required: true }, newline: true, type: "password" },
        { display: "确认密码", name: "qrpswd", validate: { required: true }, newline: false, type: "password" },
        { display: "可见分组", name: "sysusergroups", newline: true, validate: { required: false }, type: "checkboxlist", comboboxName: "sysusergroups", options: { rowSize: 4, valueField: 'groupid', textField: 'groupname', url: 'ywh_queryTableList/?source=sys_group&qtype=select@online', width: 90 }, width: 450 }, {
          display: "员工权限",
          name: "authority",
          newline: true,
          validate: { required: false },
          type: "checkboxlist",
          comboboxName: "authority",
          options: {
            rowSize: 4,
            data: [{ text: '远程网吧', id: 'Remote_Netbar' }, { text: '下载游戏', id: 'Download_Game' }, { text: '详情查看', id: 'Details_View' }, { text: '开机任务', id: 'Boot_Task' }, { text: '安全策略', id: 'Security_Policy' }, { text: '信息发布', id: 'Information_Delivery' }],
            width: 120
          },
          width: 450
        }

      ]
    } else if (showtype == 'user') {
      return [
        { name: "sysusid", type: "hidden" },
        { display: "用户姓名", name: "sysname", validate: { required: true }, newline: true, type: "text" },
        { display: "登录账户", name: "username", validate: { required: true }, newline: true, type: "text" },
        { display: "可见分组", name: "sysusergroups", newline: true, validate: { required: false }, type: "checkboxlist", comboboxName: "sysusergroups", options: { rowSize: 4, valueField: 'groupid', textField: 'groupname', url: 'ywh_queryTableList/?source=sys_group&qtype=select@online', width: 90 }, width: 450 }, {
          display: "员工权限",
          name: "authority",
          newline: true,
          validate: { required: false },
          type: "checkboxlist",
          comboboxName: "authority",
          options: {
            rowSize: 4,
            data: [{ text: '远程网吧', id: 'Remote_Netbar' }, { text: '下载游戏', id: 'Download_Game' }, { text: '详情查看', id: 'Details_View' }, { text: '开机任务', id: 'Boot_Task' }, { text: '安全策略', id: 'Security_Policy' }, { text: '信息发布', id: 'Information_Delivery' }],
            width: 120
          },
          width: 450
        }

      ]
    } else if (showtype == 'pwd') {
      return [
        { name: "sysusid", type: "hidden" },
        { display: "登录密码", name: "pswd", validate: { required: true }, newline: true, type: "password" },
        { display: "确认密码", name: "qrpswd", validate: { required: true }, newline: false, type: "password" }
      ]
    } else return [];
  }

  sys_user_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
