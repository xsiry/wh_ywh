(function($) {
  var _qsource = "info_delivery";

  var $root = $("#info_deliveryaddpage_clsfid");
  var _admin = $sHelper.GetUrlParms("admin"); //管理员发布

  var dataparam = {};
  var setDataParam = function() {
    sendNetbarListGrid.init();

    $("#group_combox").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_group&qtype=select@online',
      valueField: 'groupid',
      textField: 'groupname',
      emptyText: '所有网吧'
    });

    delete dataparam["sysusid"];
    dataparam.sysusid = userAccInfo.sysusid;
  }
  var dialog_param = $ssoftDialog.dialog.getData("paramjson");
  var pageBindingAction = function() {
    setDataParam();
    $ssoftDialog.setDialogAction(function(dialogRef, callback, paramjson) {
      var param = form2js(document.getElementById('info_deliveryaddpage_clsfid'));
      if (param.idtypes) {
        var _idtypes = param.idtypes.join(",");
        param.idtype = _idtypes;
      } else {
        $.ligerDialog.error('请选择发送至网吧或者微信端？');
        return false;
      };

      if ($('input.client_checkbox').prop('checked')) {
        if (!param.timevalidity) {
          $.ligerDialog.error('请选择客户端有效期！');
          return false;
        }
        if (param.timevalidity < param.idfixedtime) {
          $.ligerDialog.error('有效期必须大于定时发送时间！');
          return false;
        }
      }

      var idcontent = $('div.summernote').summernote('code');
      param.idcontent = idcontent;

      var type = param.idseltype;
      var bool = true;
      if (type == 1) {
        param.send_netbarlist = sendNetbarListGrid.grid.getData();
        bool = !param.send_netbarlist;
        if (_admin) { param.idselname = 1 };
      } else if (type == 2) {
        param.idselname = $('select.route').val();
        bool = !param.idselname;
      } else if (type == 3) {
        param.idselname = $("input.city").ligerComboBox().getValue();
        bool = !param.idselname;
      }

      if ((!param.idtitle) || (!param.idcontent) ||
        (!param.idfixedtime) || bool) {
        $.ligerDialog.error('所有添加不能有为空的项？');
        return false;
      }
      var param_data = $.extend(true, dataparam, param)
      console.log(JSON.stringify(param_data));
      var actionparam = { "actionname": _qsource };
      actionparam.datajson = JSON.stringify(param_data);

      $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, '', function(message) {
        dialogRef.close();
        if (callback) {
          callback(message);
          $('div.note-link-popover').hide();
        }
      });
    });
    $root.on("click", '.infodv_addnetbar', function(actionobj) {
      var rowobj = $(this);

      if ($('input[name="addType"]:checked').val() == 0) {
        if ($("#q_add_netbarid").val() == '')
          return false;
        var netbarid = netbar_selectfm.getData().netbarid;
        var netbarname = $("#q_add_netbarid").val();
        var gridData = sendNetbarListGrid.grid.getData();
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
          sendNetbarListGrid.grid.addRows({ "netbarid": netbarid, "netbarname": netbarname });
        }
      } else {
        var groupid = $('#group_combox').ligerGetComboBoxManager().getValue();
        var queryParam = { "source": "netbar_info", "qtype": "select" };
        var qjsonParam = { "groupid": groupid };
        if (groupid == '') qjsonParam = {};
        var qhkeyjson = { qjson: [qjsonParam] };
        var addRows = [];
        var gridData = sendNetbarListGrid.grid.getData();
        queryParam.qhstr = JSON.stringify(qhkeyjson);
        $.getJSON(_hostaddr + 'ywh_queryTableList', queryParam, function(jsondata) {
          $.each(jsondata, function(index, netbar) {
            addRows.push({ "netbarid": netbar.netbarid, "netbarname": netbar.netbarname });
          });
          sendNetbarListGrid.grid.loadData({Rows:addRows, Total:addRows.length});
        })
      }

      $('#infodv_netbar_selectfm')[0].reset();
    });

    $root.on("click", '.del_selected_netbar_btn', function(actionobj) {
      var rowobj = $(this);
      var rowid = rowobj.data("rowid");
      sendNetbarListGrid.grid.deleteRow(rowid);
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("change", 'input[name="idseltype"]', function(actionobj) {
      var val = actionobj.currentTarget.value;
      var divObjs = $('div.idseltype_div').children();
      $.each(divObjs, function(index, divObj) {
        (val - 1) == index ? $(divObj).show() : $(divObj).hide();
      })
    });

    $root.on("change", 'input[name="addType"]', function(actionobj) {
      var obj = $(this);
      if (obj.val() == 1) {
        $('.infodv_netbar_selectfm').hide();
        $('.group_combox').show();
      } else {
        $('.group_combox').hide();
        $('.infodv_netbar_selectfm').show();
      }
      actionobj.preventDefault();
      rowobj = null;
    });

    if (_admin) {
      $('div.idseltype_radios').show();
    } else {
      $('div.group_div').show();
    };
    createFormInput();
    showDbInfo();
    getProvince();
  }
  var netbar_selectfm;
  var createFormInput = function() {
    $('#f_timevalidity_id').datetimepicker({
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      showButtonPanel: true,
      showSecond: true,
      timeFormat: 'hh:mm',
      numberOfMonths: 1
    });
    $('#f_idfixedtime_id').datetimepicker({
      prevText: '<i class="fa fa-chevron-left"></i>',
      nextText: '<i class="fa fa-chevron-right"></i>',
      showButtonPanel: true,
      showSecond: true,
      timeFormat: 'hh:mm',
      numberOfMonths: 1
    });

    $('#f_idfixedtime_id').val(getNowTime());

    netbar_selectfm = $('#infodv_netbar_selectfm').ligerForm({
      inputWidth: 180,
      labelWidth: 0,
      space: 5,
      validate: true,
      labelAlign: "right",
      width: "99%",
      fields: [{
        name: "netbarid",
        width: 200,
        style: 'margin-left:10px',
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
          condition: { fields: [{ name: 'q_combo_netbarname', label: '网吧名称', width: 200, type: 'text', attr: { placeholder: "支持模糊查询" } }] },
          grid: {
            columns: [
              { display: '网吧账号', name: 'netbaracc', width: '50%', align: 'left' },
              { display: '网吧名称', name: 'netbarname', width: '50%', align: 'left' }
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

  var showDbInfo = function() {
    if (!dialog_param.infoid) return;
    $.getJSON(_hostaddr + 'ywh_queryTableList', { "source": _qsource, "qtype": "one", "sourceid": dialog_param.infoid },
      function(jsondata) {

        var _idtypes;
        var _idtypesStr = jsondata.idtype;
        if (_idtypesStr.indexOf(';') > 0) {
          _idtypes = _idtypesStr.split(";");
        } else {
          _idtypes = _idtypesStr.split(',');
        }

        var param_data = $.extend(true, { "idtypes": _idtypes }, jsondata);
        console.log(JSON.stringify(param_data));
        js2form(document.getElementById('info_deliveryaddpage_clsfid'), param_data);

        console.log("---begin----");
        $('div.summernote').summernote('code', param_data.idcontent);
        $('input[name="idseltype"]:checked').change();
        $('input[name="addType"]').get(0).click();
        var type = param_data.idseltype;
        if (type == 1) {
          sendNetbarListGrid.grid.addRows(jsondata.send_netbar_list);
        } else if (type == 2) {
          $('select.route').val(param_data.idselname);
        } else if (type == 3) {
          var options = {
            'source': 'dictcity',
            'qtype': 'select',
            'qhstr': JSON.stringify({ 'qjson': [{ 'dict_city_id': param_data.idselname }] })
          }
          $.getJSON(_hostaddr + 'ywh_queryTableList', options, function(jsondata) {
            $("input.province").ligerComboBox().selectValue(jsondata[0].dict_city_parentid);
          });
          $("input.city").ligerComboBox().selectValue(param_data.idselname);

        }
        console.log("---end----");


      }
    );
  }

  info_delivery_add_action = function() {
    pageBindingAction();
    pageSetUp();
  }

  pagefunction = function() {

    // summernote
    $('.summernote').summernote({
      height: 100,
      focus: false,
      tabsize: 2,
      lang: 'zh-CN',
      dialogsInBody: true,
      disableDragAndDrop: true,
      placeholder: '请输入..',
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'removeFormat', 'clear']],

        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['font', ['height']],
        ['table', ['table']],
        ['insert', ['hr', 'link']], //, 'video', 'picture'
        ['view', ['fullscreen', 'codeview']],
        ['fontname', ['fontname']]
      ]
    });
  };

  getProvince = function() {
    var cityOptions = {
      valueField: 'dict_city_id',
      textField: 'dict_city',
      emptyText: '选择城市..'
    }
    $("input.province").ligerComboBox({
      url: _hostaddr + 'ywh_queryTableList/?source=dictcity&qtype=select&qhstr={"qjson":[{"dict_city_type":3}]}',
      valueField: 'dict_city_id',
      textField: 'dict_city',
      emptyText: '选择省..',
      onSelected: function(value) {
        if (value != '') {
          cityOptions.url = _hostaddr + 'ywh_queryTableList/?source=dictcity&qtype=select&qhstr={qjson:[{dict_city_parentid:' + value + '}]}';
        }
        $("input.city").ligerComboBox(cityOptions).reload()

      }
    });
    $("input.city").ligerComboBox(cityOptions);
  }

  var sendNetbarListGrid = {
    main: "#send_netbar_lstid",
    init: function() {
      var self = this;
      this.grid = $(self.main).ligerGrid({
        columns: [
          { display: '网吧名称', name: 'netbarname', width: '50%', align: 'left' }, {
            display: '',
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
        width: 500,
        height: 200
      });
    }
  };

  getNowTime = function() {

    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();

    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

    var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
    return now;
  }

}(jQuery));
