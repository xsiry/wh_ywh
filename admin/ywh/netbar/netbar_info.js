/*
 *  removeByJsonKey(qParam.qjson,"star") ;
	qParam.qjson.push({"star":selvalue}) ;
 */
var _netbar_info_param = {};
(function($) {
  var $root = $(".netbar_infopage_clsf");
  var _groupid = $sHelper.GetUrlParms("groupid");
  var _qsource = "netbar_info";
  var dataparam = {};

  var pageBindingAction = function() {
    authorityManage('netbar_info');
    $root.on("click", '.netbar_info_sswbbtn', function(actionobj) {
      var rowobj = $(this);
      var wbname = $("#netbar_info_sswbvalue").val();
      var netbar_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (wbname) {
        netbar_info.qjson.push({ "netbarname": wbname });
        netbar_info.qjsonkeytype.push({ "netbarname": "LIKE_ALL" });
      }
      reloadGridParam(netbar_info);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.ycdesktopimg_abtn', function(actionobj) {
      var rowobj = $(this);
      var netbarid = rowobj.data("netbarid");
      $ssoftDialog.openSsoftDialog("远程信息", "如果点击没有反应,请确定安装了<a href='resources/FgzClentAuto.exe' target='_blank'>远程客户端工具</a>!如果安装了360卫士，请设置FgzClent.exe白名单！",
        "admin/ywh/netbar/netbar_remote_dialog.html",
        620, 160, 350,
        function() {}, { "netbarid": netbarid });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.grid_netbarremote_savebtn', function(actionobj) {
      var rowobj = $(this);
      var netbarid = rowobj.data("netbarid");
      var groupname = rowobj.data("groupname") == 'undefined' ? '' : rowobj.data("groupname");
      var netbaracc = rowobj.data("netbaracc");
      var netbarname = rowobj.data("netbarname");
      var netbarremarks = rowobj.data("netbarremarks");
      $ssoftDialog.openSsoftSaveDialog("网吧信息详情", "保存网吧信息", true, "admin/ywh/netbar/netbar_remote_save.html",
        850, 600, 500,
        function(message) {
          if (message.success) {
            pageListGrid.reload();
          }
        }, { "netbarid": netbarid, "groupname": groupname, "netbaracc": netbaracc, "netbarname": netbarname, "netbarremarks": netbarremarks });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.downloadgame_btn', function(actionobj) {
      var rowobj = $(this);
      var netbarid = rowobj.data("netbarid");
      var netbarname = rowobj.data("netbarname");
      _netbar_info_param = { "netbarid": netbarid, "netbarname": netbarname };
      window.location.href = '#ywh/netbar/download_game';
      actionobj.preventDefault();
      rowobj = null;
    });

    setDataParam();
    createPageFunction();
  }

  var setDataParam = function() {
    delete dataparam["groupid"];
    if (_groupid != 'all') {
      dataparam.groupid = _groupid;
    }
    pageListGrid.init();
  }

  var reloadGridParam = function(parmJsonArr) {
    pageListGrid.grid.set('parms', { qhstr: JSON.stringify(parmJsonArr) });
    pageListGrid.grid.changePage("first");
    pageListGrid.reload();
  }

  /*
   * [{"netbarid":1,"netbaracc":"yongjia267","groupid":0,"uid":3,"relname":"夏祥","mobilephone":"13690350625","netbarname":"官田2","netbaraddress":"龙江镇官田市场","netbarregip":"218.13.168.155","netbarcn":"广东省佛山市  电信","netbaractivationterminal":8,"__id":"r1001","__previd":-1,"__index":0,"__status":"nochanged","__nextid":"r1002"}]
   */

  var createPageFunction = function() {
    $("#WbGroupComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_group&qtype=select@online',
      valueField: 'groupid',
      textField: 'groupname',
      emptyText: '请选择分组',
      onBeforeSelect: function(value, text) {
        if (value) {
          if (pageListGrid.grid.getSelectedRows().length == 0) {
            $.ligerDialog.error('请先选择要分组的网吧！');
            return false;
          }
        }
        return true;
      },
      onSelected: function(value, text) {
        if (value) {
          var _JsonArr = [];
          $.each(pageListGrid.grid.getSelectedRows(), function(index, data) {
            _JsonArr.push({ "groupid": value, "netbarid": data.netbarid });
          });
          var actionparam = { actionname: "netbar_info" }
          actionparam.datajson = JSON.stringify(_JsonArr);
          actionparam.operjson = JSON.stringify({ opertype: ["updateGropup"] });
          $sHelper.AjaxSendData("ywh_saveAction", actionparam, pageListGrid, function() {

          });
        }
      }
    });
  }
  var remoteNetbar = function() {
    if ((userAccInfo_authority == 'ALL') ||
      (userAccInfo_authority.indexOf(sysAuthority.Remote_Netbar) > -1)) {
      return {
        display: '远程管理',
        width: 100,
        align: 'left' ,
        isSort: false,
        render: function(rowdata, rowindex, value) {
          return '	<div class="ycdesktopimg"><a href="javascript:;" class="ycdesktopimg_abtn"  data-netbarid="' + rowdata.netbarid + '"><i class="fa fa-lg fa-fw fa-desktop"></i></a></div>';
        }
      };
    }
  }

  var detailsView = function() {
    if ((userAccInfo_authority == 'ALL') ||
      (userAccInfo_authority.indexOf(sysAuthority.Details_View) > -1)) {
      return {
        display: '详情',
        name: 'ucid_total',
        width: 100,
        align: 'left',
        isSort: false,
        render: function(rowdata, rowindex, value) {
          return '<a href="javascript:;" class="grid_netbarremote_savebtn"  data-netbarid="' + rowdata.netbarid + '" data-groupname="' + rowdata.groupname + '" data-netbaracc="' + rowdata.netbaracc + '" data-netbarname="' + rowdata.netbarname + '" data-netbarremarks="' + encodeURIComponent(rowdata.netbarremarks) + '">详情</a>';
        }
      };
    }
  }
  var downloadGame = function() {
    if ((userAccInfo_authority == 'ALL') ||
      (userAccInfo_authority.indexOf(sysAuthority.Download_Game) > -1)) {
      return {
        display: '游戏下载',
        width: 100,
        align: 'left',
        isSort: false,
        render: function(rowdata, rowindex, value) {
          return '<a href="javascript:;" class="downloadgame_btn"  data-netbarid="' + rowdata.netbarid + '" data-netbarname="' + rowdata.netbarname + '">游戏下载</a>'

        }
      };
    }
  }

  var pageListGrid = {
    main: "#netbar_info_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '网吧账号', name: 'netbaracc', width: 160, align: 'left' },
          { display: '网吧名称', name: 'netbarname', align: 'left' },
          { display: '登录IP', name: 'netbarregip', width: 160, align: 'left' },
          { display: '机器台数', name: 'netbaractivationterminal', width: 100, align: 'left' },
          { display: '所属分组', name: 'groupname', width: 120, isSort: false, align: 'left' },
          remoteNetbar(),
          downloadGame(),
          detailsView()
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
        alternatingRow: false,
        pageSize: 30,
        usePager: true,
        selectRowButtonOnly: true,
        showTitle: false,
        pageSizeOptions: [30, 50, 100],
        sortName: 'netbarid',
        sortOrder: 'ASC',
        enabledSort: true,
        url: _hostaddr + 'ywh_queryTableList/?source=' + _qsource,
        alternatingRow: false,
        width: '98%',
        height: '98%',
        onAfterShowData: function(currentData) {

        },
        onSuccess: function(data, grid) {

        }
      });
    },
    reload: function() {
      debugPrint('---- reload------');
      this.grid.loadData();
    }
  };

  netbar_info_action = function() {
    pageBindingAction();
    pageSetUp();
  };
}(jQuery));
