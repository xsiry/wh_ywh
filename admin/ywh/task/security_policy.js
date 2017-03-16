(function($) {

  var _qsource = "security_policy";
  var _qsource_detail = "group_task";
  var _ModeId = "security_policy_Page_ModelId";
  var $root = $(".security_policypage_clsf");
  var dataparam = {};
  var setDataParam = function() {
    delete dataparam["sysusid"];
    dataparam.sysusid = userAccInfo.sysusid;
    pageListGrid.init();
  }


  var pageBindingAction = function() {

    $root.on("click", '.security_policy_yydzm', function(actionobj) {
      var rowobj = $(this);
      var _JsonArr = [];
      var _groupidsStr = $("#btSecurityComboBoxId").ligerGetComboBoxManager().getValue();
      var _groupidsText = $("#btSecurityComboBoxId").ligerGetComboBoxManager().getText();

      if (!_groupidsStr) {
        $.ligerDialog.error('请选择需要设置的分组！');
        return;
      }
      var _groupids = _groupidsStr.split(';');
      var row = pageListGrid.grid.getSelectedRow();
      if (!row) {
        $.ligerDialog.error('请选择一个策略！');
        return;
      }

      $.each(_groupids, function(index, groupid) {
        _JsonArr.push({ "groupid": groupid, "spid": row.spid });
      });

      $.ligerDialog.confirm('确认要应用策略</br>[' + row.spname + ']</br>到分组</br>[' + _groupidsText + ']</br>吗？', function(yes) {
        if (yes) {
          var actionparam = { "actionname": _qsource_detail }
          actionparam.datajson = JSON.stringify(_JsonArr);
          actionparam.operjson = JSON.stringify({ opertype: ["updateGroupTask"] });
          $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, pageListGrid, function() {

          });
        }
      });

      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.security_policy_querybtn', function(actionobj) {
      var rowobj = $(this);
      var _name = $("#security_policy_name").val();
      var security_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (_name) {
        security_info.qjson.push({ "spname": _name });
        security_info.qjsonkeytype.push({ "spname": "LIKE_ALL" });
      }
      reloadGridParam(security_info);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.security_policy_createbtn', function(actionobj) {
      var rowobj = $(this);
      $ssoftDialog.openSsoftSaveDialog("安全策略管理", "保存为模板", true, "admin/ywh/task/security_policy_add.html?6",
        850, 600, 500,
        function(message) {
          if (message.success) {
            pageListGrid.reload();
          }
        }, { "spid": "" });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="security_policy_copy"]', function(actionobj) {
      var rowobj = $(this);
      var spid = rowobj.data("spid");
      var spname = decodeURIComponent(rowobj.data("spname"));
      $.ligerDialog.confirm('确认要复制[' + spname + ']吗？', function(yes) {
        if (yes) {
          var actionparam = { "actionname": _qsource };
          actionparam.datajson = JSON.stringify({ "spid": spid });
          actionparam.operjson = JSON.stringify({ opertype: ["securityPolicyCopy"] });
          $sHelper.AjaxSendData("ywh_saveAction", actionparam, pageListGrid, function(message) {});
        }
      });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="security_policy_psedit"]', function(actionobj) {
      var rowobj = $(this);
      var spid = rowobj.data("spid");
      var spname = rowobj.data("spname");
      $ssoftDialog.openSsoftSaveDialog("安全策略管理", "保存为模板", true, "admin/ywh/task/security_policy_add.html",
        850, 600, 500,
        function(message) {
          if (message.success) {
            pageListGrid.reload();
          }
        }, { "spid": spid, "spname": spname });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="security_policy_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var spid = rowobj.data("spid");
      var delParam = {};
      delParam.tid = spid;
      delParam.tname = _qsource;
      //是否删除
      $sHelper.deleteData(_hostaddr + "ywh_delAction/", delParam, pageListGrid, function(message) {
        if (message.success)
          $.ligerDialog.success(message.msg);
        else
          $.ligerDialog.error(message.msg);
      }, "是否确认删除所选安全策略？");
      actionobj.preventDefault();
      rowobj = null;
    });

    createPageFunction();
    setDataParam();
  }

  var createPageFunction = function() {
    $("#btSecurityComboBoxId").ligerComboBox({
      width: 300,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_group&qtype=select@online',
      valueField: 'groupid',
      textField: 'groupname',
      isShowCheckBox: true,
      isMultiSelect: true,
      onBeforeSelect: function(value, text) {
        if (value) {
          if (pageListGrid.grid.getSelectedRows().length == 0) {
            $.ligerDialog.error('请先选择一个策略！');
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
    main: "#security_policy_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '策略名称', name: 'spname', align: 'left' },
          { display: '进程查杀', name: 'prockil', width: 120, isSort: false, align: 'left' },
          { display: '可疑驱动拦截', name: 'drvip', width: 120, isSort: false, align: 'left' },
          { display: '窗口查杀', name: 'killwds', width: 120, isSort: false, align: 'left' },
          { display: '进程守护', name: 'prgd', width: 120, isSort: false, align: 'left' }, {
            display: '操作',
            width: 120,
            render: function(rowdata, rowindex, value) {
              var h = "";
              h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="security_policy_copy" data-spid="' + rowdata.spid + '" data-spname="' + encodeURIComponent(rowdata.spname) + '">复制</a>';
              h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="security_policy_psedit" data-spid="' + rowdata.spid + '" data-spname="' + encodeURIComponent(rowdata.spname) + '">修改</a>';
              h += '<a href="javascript:void(0);" class="mg-5"  data-action="security_policy_pgdel" data-spid="' + rowdata.spid + '">删除</a>';
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
        allowUnSelectRow: true,
        pageSize: 20,
        usePager: true,
        selectRowButtonOnly: false,
        showTitle: false,
        pageSizeOptions: [20, 30, 50],
        sortName: 'spid',
        sortOrder: 'DESC',
        enabledSort: true,
        url: _hostaddr + 'ywh_queryTableList/?source=' + _qsource,
        width: '98%',
        height: '98%',
        rownumbers: true, // heightDiff:70,
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
        { display: '分组名称', name: 'groupname', width: 200, align: 'left' }, {
          display: '操作',
          width: 100,
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
      width: '29%',
      rownumbers: true,
      showTitle: false,
      rowSelectable: false,
      usePager: false,
      frozen: false,
      url: _hostaddr + 'ywh_queryTableList',
      type: "get",
      dataAction: 'server',
      parms: {
        source: 'group_task',
        qhstr: JSON.stringify({ 'qjson': [{ 'spid': row.spid }] })
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

  security_policy_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
