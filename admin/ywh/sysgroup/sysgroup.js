(function($) {
  var _qsource = "sys_group";

  var _ModeId = "sys_group_Page_ModelId";

  var $root = $(".sys_grouppage_clsf");

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
    //创建
    $root.on("click", '.sys_group_createbtn', function(actionobj) {
      var rowobj = $(this);
      pageListGrid.grid.addEditRow();
      actionobj.preventDefault();
      rowobj = null;
    });
    //修改 onAfterEdit() 提交修改
    $root.on("click", '[data-action="sys_group_pgedit"]', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      pageListGrid.grid.beginEdit(rowid);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '[data-action="sys_group_end_edit"]', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      pageListGrid.grid.endEdit(rowid);
      actionobj.preventDefault();
      rowobj = null;
    });


    $root.on("click", '[data-action="sys_group_cancel_edit"]', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      pageListGrid.grid.cancelEdit(rowid);
      pageListGrid.reload();
      actionobj.preventDefault();
      rowobj = null;
    });

    //删除
    $root.on("click", '[data-action="sys_group_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var groupid = rowobj.data("groupid");
      var delParam = {};
      delParam.tid = groupid;
      delParam.tname = _qsource;
      //是否删除
      $sHelper.deleteData(_hostaddr + "ywh_delAction/", delParam, pageListGrid, function(message) {
        if (message.success) {
          $("#user_sys_group_ul li a[href='ywh/sysgroup/groupTask?groupid=" + groupid + "']").remove();
          $.smallBox({
            title: "提示",
            content: message.msg,
            color: "#03a9f4",
            iconSmall: "fa fa-thumbs-up bounce animated",
            timeout: 3000
          });
        } else {
          $.smallBox({
            title: "提示",
            content: message.msg,
            color: "#f44336",
            iconSmall: "fa fa-thumbs-up bounce animated",
            timeout: 3000
          });
        }
      }, "是否确认删除分组信息？");
      rowobj = null;
    });
    addNewWindowsForm();
    setDataParam();
  }


  var pageListGrid = {
    main: "#sys_group_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [{
          display: '分组名称',
          name: 'groupname',
          width: '25%',
          align: 'left',
          editor: { type: 'text' }
        }, {
          display: '网吧总数',
          name: 'ucidCount',
          width: '15%',
          align: 'left'
        }, {
          display: '开机任务',
          name: 'bootTaskName',
          width: '30%',
          align: 'left',
          render: function(rowdata, rowindex, value) {
            var v = '';
            if (value) {
              v = value.substring(0, value.length - 1);
            }
            return v;
          }
        }, {
          display: '应用策略',
          name: 'SecurityPolicyName',
          width: '10%',
          align: 'left',
          render: function(rowdata, rowindex, value) {
            var v = '';
            if (value) {
              v = value.substring(0, value.length - 1);
            }
            return v;
          }
        }, {
          display: '操作',
          width: '20%',
          align: 'left',
          render: function(rowdata, rowindex, value) {
            var h = "";
            if (!rowdata._editing) {
              h += '<a href="javascript:void(0);" class="mg-5 " data-action="sys_group_pgedit" data-rowid="' + rowindex + '">修改</a>';
              h += '<a href="javascript:void(0);" class=" mg-5"  data-action="sys_group_pgdel" data-rowid="' + rowindex + '" data-groupid="' + rowdata.groupid + '">删除</a>';
            } else {
              h += '<a href="javascript:void(0);" class="mg-5" data-action="sys_group_end_edit" data-groupname="' + rowdata.groupname + '" data-rowid="' + rowindex + '" data-groupid="' + rowdata.groupid + '">提交</a>';
              h += '<a href="javascript:void(0);" class=" mg-5"  data-action="sys_group_cancel_edit" data-rowid="' + rowindex + '">取消</a>';
            }
            return h;
          }
        }],
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
        sortName: 'groupid',
        sortOrder: 'ASC',
        onSelectRow: function(rowdata, rowindex) {
          $("#txtrowindex").val(rowindex);
        },
        enabledEdit: true,
        clickToEdit: false,
        enabledSort: true,
        url: _hostaddr + 'ywh_queryTableList/?source=' + _qsource + '&qtype=allconfig',
        alternatingRow: false,
        width: '98%',
        height: '98%',
        onAfterEdit: function(e) {
          var sysusid = dataparam.sysusid;
          var groupid = e.record.groupid;
          var groupname = e.record.groupname;
          var savaparm = { "groupname": groupname };
          if (!groupname) {
            pageListGrid.reload();
            return false;
          }
          if (groupid) {
            savaparm.groupid = groupid;
          }
          savaparm.sysusid = sysusid; //默认添加账号只能自己看见
          debugPrint("savaparm:=" + JSON.stringify(savaparm));
          $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction/?actionname=" + _qsource, { datajson: JSON.stringify(savaparm) }, pageListGrid, function(message) {
            if (message.success) {
              if (groupid) {
                $("#user_sys_group_ul li a[href='ywh/sysgroup/groupTask?groupid=" + groupid + "']").text(groupname);
              } else {
                $.getJSON(_hostaddr + 'ywh_queryTableList', { "source": _qsource, "qtype": "select", "qhstr": JSON.stringify({ qjson: [{ "groupname": groupname }] }) },
                  function(jsondata) {
                    $("#user_sys_group_ul").append('<li><a href="ywh/sysgroup/groupTask?groupid=' + jsondata[0].groupid + '">' + jsondata[0].groupname + '</a></li>');
                  }
                )
              }
              $.smallBox({
                title: "提示",
                content: message.msg,
                color: "#03a9f4",
                iconSmall: "fa fa-thumbs-up bounce animated",
                timeout: 3000
              });
            } else {
              $.smallBox({
                title: "提示",
                content: message.msg,
                color: "#f44336",
                iconSmall: "fa fa-thumbs-down bounce animated",
                timeout: 3000
              });
            }
          });

        }
      });
    },
    reload: function() {
      this.grid.loadData();
    }
  };

  sys_group_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
