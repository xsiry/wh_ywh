(function($) {
  var _qsource = "info_delivery";

  var $root = $("#info_deliveryaddpage_clsfid");
  var _admin = $sHelper.GetUrlParms("admin"); //管理员发布

  var dataparam = {};
  var setDataParam = function() {
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

      var idcontent = $('.summernote').code();
      param.idcontent = idcontent;

      var type = param.idseltype;
      var bool = true;
      if (type == 1) {
        param.send_netbarlist = liger.get("send_netbar_lstid").data;
        bool = !param.send_netbarlist;
        if (_admin) {param.idselname = 1};
      } else if (type == 2) {
        param.idselname = $('select.route').val();
        bool = !param.idselname;
      } else if (type == 3) {
        param.idselname = $("input.city").ligerComboBox().getValue();
        bool = !param.idselname;
      }

      console.log(JSON.stringify(param));
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
        }
      });
    });
    $root.on("click", '.infodv_addnetbar', function(actionobj) {
      var rowobj = $(this);
      if ($("#q_add_netbarid").val() == '')
        return false;
      var netbarid = netbar_selectfm.getData().netbarid;
      var netbarname = $("#q_add_netbarid").val();
      var netbarlistbox = liger.get("send_netbar_lstid");
      var isexists = false;
      if (netbarlistbox.data) {
        $.each(netbarlistbox.data, function(index, boxdata) {
          if (boxdata.netbarid == netbarid) {
            isexists = true;
            return;
          }
        });
      }
      if (!isexists) {
        netbarlistbox.addItems({ "netbarid": netbarid, "netbarname": netbarname });
      }
      $('#infodv_netbar_selectfm')[0].reset();
    });

    $root.on("click", '.infodv_delnetbar', function(actionobj) {
      var rowobj = $(this);
      var netbarlistbox = liger.get("send_netbar_lstid");
      var selecteds = netbarlistbox.getSelectedItems();
      if (!selecteds || !selecteds.length) return;
      netbarlistbox.removeItems(selecteds);
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
    if (_admin) {
      $('div.idseltype_radios').show();
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
    $("#send_netbar_lstid").ligerListBox({
      isShowCheckBox: true,
      isMultiSelect: true,
      width: 500,
      height: 100,
      valueFieldID: 'send_netbar_list_selvalue',
      valueField: "netbarid",
      textField: "netbarname"
    });
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
          selectBoxWidth: 320,
          selectBoxHeight: 300,
          valueField: 'netbarid',
          textField: 'netbarname',
          condition: { fields: [{ name: 'q_combo_netbarname', label: '网吧名称', width: 80, type: 'text', attr: { placeholder: "支持模糊查询" } }] },
          grid: {
            columns: [
              { display: '网吧账号', name: 'netbaracc', width: 110 },
              { display: '网吧名称', name: 'netbarname', width: 130 }
            ],
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

        $('.summernote').code(param_data.idcontent);
        $('input[name="idseltype"]:checked').change();
        var type = param_data.idseltype;
        if (type == 1) {
          var netbarlistbox = liger.get("send_netbar_lstid");
          netbarlistbox.addItems(jsondata.send_netbar_list);
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

}(jQuery));