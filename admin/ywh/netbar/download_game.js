(function($) {
  var $root = $(".games_downpage_clsf");
  var _qsource = "games_down";
  var dataparam = {};
  var netbar_selectfm;
  var pageBindingAction = function() {

    $root.on("click", '.games_down_querybtn', function(actionobj) {
      var rowobj = $(this);
      var gamename = $("#games_down_name").val();
      var game_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (gamename) {
        game_info.qjson.push({ "gamename": gamename });
        game_info.qjsonkeytype.push({ "gamename": "LIKE_ALL" });
      }
      reloadGridParam(game_info);
      actionobj.preventDefault();
      rowobj = null;
    });

    /*
     * box1.data;
     *  box1.getSelectedItems();
     */
    $root.on("click", '.adddowngame_abtn', function(actionobj) {
      var rowobj = $(this);
      var gameid = rowobj.data("gameid");
      var gamename = rowobj.data("gamename");
      var gridData = pageSelectedListGrid.grid.getData();
      var isexists = false;
      if (gridData) {
        $.each(gridData, function(index, boxdata) {
          if (boxdata.gameid == gameid) {
            isexists = true;
            return;
          }
        });
      }
      if (!isexists) {
      	pageSelectedListGrid.grid.addRows({ "gameid": gameid, "gamename": gamename });
      }
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.dg_addnewnetbar', function(actionobj) {
      var rowobj = $(this);
      if ($("#q_add_netbarid").val() == '')
        return false;
      var netbarid = netbar_selectfm.getData().netbarid;
      var netbarname = $("#q_add_netbarid").val();
      var gridData = pageSelectedNetBarListGrid.grid.getData();
      var isexists = false;
      if (gridData) {
        $.each(gridData, function(index, boxdata) {
          if (boxdata.netbarid == netbarid) {
            isexists = true;
            return;
          }
        });
      }
      if (!isexists) {
      	pageSelectedNetBarListGrid.grid.addRows({ "netbarid": netbarid, "netbarname": netbarname });
      }
      $('#dg_netbar_selectfm')[0].reset();
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.del_selected_game_btn', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      pageSelectedListGrid.grid.deleteRow(rowid);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.del_selected_netbar_btn', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      pageSelectedNetBarListGrid.grid.deleteRow(rowid);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.execTaskDownload', function(actionobj) {
      var rowobj = $(this);
      var gamenamelist_data = pageSelectedListGrid.grid.getData();
      var netbarlist_data = pageSelectedNetBarListGrid.grid.getData();
      if (!gamenamelist_data || !gamenamelist_data.length) {
        $.ligerDialog.error('游戏下载任务内容为空，没有选择游戏！');
        return;
      }
      if (!netbarlist_data || !netbarlist_data.length) {
        $.ligerDialog.error('网吧信息内容为空，没有选择网吧！');
        return;
      }
      var actionparam = { "actionname": _qsource }
      actionparam.datajson = JSON.stringify({ "netbarlist": netbarlist_data, "gamenamelist": gamenamelist_data });
      actionparam.operjson = JSON.stringify({ opertype: ["TaskDownload"] });

      $sHelper.AjaxSendData("ywh_saveAction", actionparam, pageListGrid, function(message) {
        if (message.success) {
          liger.get("gamenamelistid").removeItems(gamenamelist_data);
          liger.get("netbarlistid").removeItems(netbarlist_data);
          $.ligerDialog.success('执行游戏下载任务成功！');
        } else
          $.ligerDialog.error(message.msg);
      });
      actionobj.preventDefault();
      rowobj = null;
    });
    setDataParam();
    showParamElement();
  }

  var setDataParam = function() {
    pageListGrid.init();
    pageSelectedListGrid.init();
    pageSelectedNetBarListGrid.init();

    netbar_selectfm = $('#dg_netbar_selectfm').ligerForm({
      inputWidth: 250,
      labelWidth: 0,
      space: 5,
      validate: true,
      labelAlign: "right",
      width: "99%",
      fields: [{
        name: "netbarid",
        width: 250,
        newline: false,
        slide: false,
        type: "select",
        attr: { id: "q_add_netbarid" },
        comboboxName: "netbarid",
        options: {
          split: ";",
          selectBoxWidth: 400,
          selectBoxHeight: 300,
          valueField: 'netbarid',
          textField: 'netbarname',
          condition: { fields: [{ name: 'q_combo_netbarname', label: '网吧名称', width: 150, type: 'text', attr: { placeholder: "支持模糊查询" } }] },
          grid: {
            columns: [
              { display: '网吧账号', name: 'netbaracc', width: '40%', align: 'left'},
              { display: '网吧名称', name: 'netbarname', width: '60%', align: 'left' }
            ],
            rownumbers: false,
            switchPageSizeApplyComboBox: false,
            url: _hostaddr + 'ywh_queryTableList/?source=netbar_info',
            pageSize: 20,
            checkbox: false
          },
          conditionSearchClick: function(e) {
            var q_combo_netbarname = "";
            if (e.rules[0])
              q_combo_netbarname = e.rules[0].value;
            if ($sHelper.trim(q_combo_netbarname) == '') {
              $.ligerDialog.warn('查询网吧名称不能为空！');
              return false;
            }
            var netbarname_qhkeyjson = { qjson: [] };
            netbarname_qhkeyjson.qjson.push({ "netbarname": q_combo_netbarname });
            netbarname_qhkeyjson.qjsonkeytype = [{ "netbarname": "LIKE_ALL" }];
            e.grid.set('parms', { qhstr: JSON.stringify(netbarname_qhkeyjson) });
            e.grid.reload();
          }
        }
      }]
    });
  }

  var showParamElement = function() {
    try {
      if ((_netbar_info_param) && (_netbar_info_param != "undefined") && (!$.isEmptyObject(_netbar_info_param))) {
        var netbarlist = liger.get("netbarlistid");
        netbarlist.addItems(_netbar_info_param);
      }
    } catch (e) {

    }
    console.log("------hahahaha--------");
  }

  var reloadGridParam = function(parmJsonArr) {
    pageListGrid.grid.set('parms', { qhstr: JSON.stringify(parmJsonArr) });
    pageListGrid.grid.changePage("first");
    pageListGrid.reload();
  }

  var pageListGrid = {
    main: "#games_down_grid_a",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '游戏名称', name: 'gamename', width: '18%', align: 'left' },
          { display: '游戏分类', name: 'classtype', width: '15%', align: 'left' },
          { display: '游戏大小', name: 'size', width: '14%', align: 'left' },
          { display: '热门值', name: 'hot', width: '13%', align: 'left' },
          { display: '更新时间', name: 'updatetime', width: '25%', align: 'left' }, {
            display: '添加下载',
            width: '15%',
            align: 'left',
            isSort: false,
            render: function(rowdata, rowindex, value) {
              return '<div class="mg-5"><a href="javascript:;" class="adddowngame_abtn" data-gamename="' + rowdata.gamename + '" data-gameid="' + rowdata.gameid + '">添加下载</a></div>';

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
        alternatingRow: false,
        pageSize: 30,
        usePager: true,
        selectRowButtonOnly: true,
        showTitle: false,
        pageSizeOptions: [30, 50, 100],
        sortName: 'updatetime',
        sortOrder: 'ASC',
        enabledSort: true,
        url: _hostaddr + 'ywh_queryTableList/?source=games',
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

  var pageSelectedListGrid = {
    main: "#gamenamelistid",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '游戏下载任务', name: 'gamename', width: '50%', align: 'left' },
          { display: '',
            width: '50%',
            isSort: false,
            render: function(rowdata, rowindex, value) {
              return '<div class="mg-5"><a href="javascript:;" class="del_selected_game_btn" data-rowid="' + rowindex + '">删除</a></div>';

            }
          }
        ],
        fixedCellHeight: false,
        headerRowHeight: 40,
        isScroll: true,
        frozen: false,
        checkbox: false,
        allowUnSelectRow: true,
        alternatingRow: false,
        usePager: false,
        selectRowButtonOnly: true,
        showTitle: false,
        enabledSort: true,
        width: '98%',
        height: '43%'
     });
    }
  };

  var pageSelectedNetBarListGrid = {
    main: "#netbarlistid",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '网吧名称', name: 'netbarname', width: '50%', align: 'left' },
          { display: '',
            width: '50%',
            isSort: false,
            render: function(rowdata, rowindex, value) {
              return '<div class="mg-5"><a href="javascript:;" class="del_selected_netbar_btn" data-rowid="' + rowindex + '">删除</a></div>';

            }
          }
        ],
        fixedCellHeight: false,
        headerRowHeight: 40,
        isScroll: true,
        frozen: false,
        checkbox: false,
        allowUnSelectRow: true,
        alternatingRow: false,
        usePager: false,
        selectRowButtonOnly: true,
        showTitle: false,
        enabledSort: true,
        width: '98%',
        height: '55%'
     });
    }
  };

  games_down_action = function() {
    pageBindingAction();
    pageSetUp();
  };
}(jQuery));
