(function($) {

  var _qsource = "info_delivery";

  var _ModeId = "info_delivery_Page_ModelId";

  var $root = $(".info_deliverypage_clsf");
  var _admin = $sHelper.GetUrlParms("admin"); //管理员发布

  var dataparam = [];
  var dataConditions = [];

  var setDataParam = function() {
    delete dataparam[0];
    dataparam.push({'sysusid': userAccInfo.sysusid});


    if (_admin) {
      dataparam.push({'idselname': "1"});
      dataConditions.push({"idselname":"MaxEqual"});
    }else {
      dataparam.push({'idselname': "-1"});
      // dataConditions.push({"idselname":"Min"});
    }
    pageListGrid.init();
  }

  var addNewWindowsForm = function() {
    $sHelper.NewWindowsForm(_ModeId);
  }

  var reloadGridParam = function(parmJsonArr) {
    pageListGrid.grid.set('parms', { qhstr: JSON.stringify(parmJsonArr) });
    pageListGrid.grid.changePage("first");
    pageListGrid.reload();
  }

  var pageBindingAction = function() {
    //新增
    $root.on("click", '.info_delivery_createbtn', function(actionobj) {
      var rowobj = $(this);
      $ssoftDialog.openSsoftSaveDialog("信息发布管理", "发布", true, "admin/ywh/task/info_delivery_add.html?6",
        980, 520, 480,
        function(message) {
          if (message.success) {
            pageListGrid.reload();
          }
        }, { "infoid": "" });
      actionobj.preventDefault();
      rowobj = null;
    });
    $root.on("click", '.info_delivery_querybtn', function(actionobj) {
      var rowobj = $(this);
      var ifname = $("#info_delivery_name").val();
      var infodv_info = { qjson: [dataparam], qjsonkeytype: [] };
      if (ifname) {
        infodv_info.qjson.push({ "idtitle": ifname });
        infodv_info.qjsonkeytype.push({ "idtitle": "LIKE_ALL" });
      }
      reloadGridParam(infodv_info);
      actionobj.preventDefault();
      rowobj = null;
    });

    //------修改
    $root.on("click", '[data-action="info_delivery_psedit"]', function(actionobj) {
      var rowobj = $(this);
      var infoid = rowobj.data("infoid");
      $ssoftDialog.openSsoftSaveDialog("安全策略管理", "保存为模板", true, "admin/ywh/task/info_delivery_add.html?6",
        980, 520, 480,
        function(message) {
          if (message.success) {
            pageListGrid.reload();
          }
        }, { "infoid": infoid });
      actionobj.preventDefault();
      rowobj = null;
    });
    //------删除
    $root.on("click", '[data-action="info_delivery_pgdel"]', function(actionobj) {
      var rowobj = $(this);
      var infoid = rowobj.data("infoid");
      var delParam = {};
      delParam.tid = infoid;
      delParam.tname = _qsource;
      //是否删除
      $sHelper.deleteData(_hostaddr + "ywh_delAction/", delParam, pageListGrid, function(message) {
        if (message.success)
          $.ligerDialog.success(message.msg);
        else
          $.ligerDialog.error(message.msg);
      }, "是否确认删除所选发布信息？");
      rowobj = null;
    });
    setDataParam();
  }

  var pageListGrid = {
    main: "#info_delivery_grid_a",
    init: function() {
      var self = this;

      var columns = [{ display: '公告名称', name: 'idtitle', align: 'left' }, {
          display: '发送至',
          name: 'idtype',
          width: 160,
          align: 'left',
          isSort: false,
          render: function(rowdata, rowindex, value) {
            var title = '';
            if (value.length == 2) {
              var v = value.substring(0, value.length-1);
              title = v == 1 ? '客户机' : '微信端';
            } else if (value.length == 4){
              title = '客户机、微信端';
            }
            return title;
          }
        },
        { display: '有效期', name: 'timevalidity',align: 'left', width: 200 },
        { display: '定时发送', name: 'idfixedtime',align: 'left', width: 200 }, {
          display: '操作',
          width: 230,
          align: 'left',
          render: function(rowdata, rowindex, value) {
            var h = "";
            h += '<a href="javascript:void(0);" class="mg-lr-5" data-action="info_delivery_psedit" data-infoid="' + rowdata.infoid + '">修改</a>';
            h += '<a href="javascript:void(0);" class=" mg-5"  data-action="info_delivery_pgdel" data-infoid="' + rowdata.infoid + '">删除</a>';
            return h;
          }
        }
      ]

      if (_admin) columns.splice(1, 0, {
        display: '投递类型',
        name: 'idseltype',
        width: 160,
        align: 'left',
        type: 'int',
        render: function(rowdata, rowindex, value) {
          var idseltypeName = { 1: '网吧', 2: '线路', 3: '区域' };
          return idseltypeName[value];
        }
      });

      this.grid = $(self.main).ligerGrid({
        columns: columns,
        parms: { qhstr: JSON.stringify({ qjson: dataparam,qjsonkeytype: dataConditions}) },
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
        sortName: 'infoid',
        sortOrder: 'DESC',
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
      this.grid.loadData();
    }
  };

  info_delivery_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
