(function($) {

  var $root = $(".groupTaskpage_clsf");

  var _qsource_detail = "group_task";

  var a_groupid = $sHelper.GetUrlParms("groupid");

  var pageBindingAction = function() {
    $root.on("click", '.grouptask_yydzm', function(actionobj) {
      var rowobj = $(this);
      var _groupid = $("#gt_GroupComboBoxId").ligerGetComboBoxManager().getValue();
      if (!_groupid) {
        $.ligerDialog.error('请选择分组！');
        return;
      }
      var _JsonArr = [];
      var netbarlistbox = liger.get("gt_netbarlistid");
      var selecteds = netbarlistbox.getSelectedItems();
      if (!selecteds || !selecteds.length) {
        $.ligerDialog.error('请选择网吧！');
        return;
      }
      $.each(selecteds, function(index, data) {
        _JsonArr.push({ "groupid": _groupid, "netbarid": data.netbarid });
      });
      var actionparam = { actionname: "netbar_info" }
      actionparam.datajson = JSON.stringify(_JsonArr);
      actionparam.operjson = JSON.stringify({ opertype: ["updateGropup"] });
      $sHelper.AjaxSendData("ywh_saveAction", actionparam, '', function(message) {
        showNetbarListBox();
      });
      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.group_set_security_policy', function(actionobj) {
      var rowobj = $(this);
      var _spid = $("#setSecurityComboBoxId").ligerGetComboBoxManager().getValue();
      var _spText = $("#setSecurityComboBoxId").ligerGetComboBoxManager().getText();

      if (!_spid) {
        $.ligerDialog.error('请选择策略！');
        return;
      }

      $.ligerDialog.confirm('确认要应用策略</br>[' + _spText + ']</br>到分组吗？', function(yes) {
        if (yes) {
          var actionparam = { "actionname": _qsource_detail }
          actionparam.datajson = JSON.stringify([{ "groupid": a_groupid, "spid": _spid }]);
          actionparam.operjson = JSON.stringify({ opertype: ["updateGroupTask"] });
          $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, '', function() {
            showDbInfo();
          });
        }
      });

      actionobj.preventDefault();
      rowobj = null;
    });

    $root.on("click", '.group_set_task', function(actionobj) {
      var rowobj = $(this);
      var _JsonArr = [];
      var _btidsStr = $("#setTaskComboBoxId").ligerGetComboBoxManager().getValue();
      var _spText = $("#setTaskComboBoxId").ligerGetComboBoxManager().getText();

      if (!_btidsStr) {
        $.ligerDialog.error('请选择任务！');
        return;
      }

      var _btids = _btidsStr.split(';');
      $.each(_btids, function(index, btid) {
        _JsonArr.push({ "groupid": a_groupid, "btid": btid });
      });

      $.ligerDialog.confirm('确认要添加替换任务</br>[' + _spText + ']</br>到分组吗？', function(yes) {
        if (yes) {
          var actionparam = { "actionname": _qsource_detail }
          actionparam.datajson = JSON.stringify(_JsonArr);
          actionparam.operjson = JSON.stringify({ opertype: ["updateGroupBootTask"] });
          $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, '', function() {
            showDbInfo();
          });
        }
      });

      actionobj.preventDefault();
      rowobj = null;
    });

    createPageFunction();
    showDbInfo();
  }

  var showDbInfo = function() {
    var queryParam = { "source": _qsource_detail, "qtype": "select@online" };
    var qhkeyjson = { qjson: [{ "groupid": a_groupid }] };
    queryParam.qhstr = JSON.stringify(qhkeyjson);
    $("#gt_boot_task_lid").empty();
    $("#gt_security_policy_lid").empty();
    $.getJSON(_hostaddr + 'ywh_queryTableList', queryParam,
      function(jsondata) {
        $.each(jsondata, function(index, data) {
          if (data.btid) {
            $.getJSON(_hostaddr + 'ywh_queryTableList', { "source": 'boot_task', "qtype": "one", "sourceid": data.btid },
              function(jsondata) {
                $("#gt_boot_task_lid").append("<li>" + jsondata.btname + "</li>");
              });
          }
          if (data.spid) {
            $.getJSON(_hostaddr + 'ywh_queryTableList', { "source": 'security_policy', "qtype": "one", "sourceid": data.spid },
              function(jsondata) {
                $("#gt_security_policy_lid").append("<li>" + jsondata.spname + "</li>");
              });
          }
        });
      }
    );

    showNetbarListBox();

  }

  var showNetbarListBox = function() {
    var queryParam = { "source": "netbar_info", "qtype": "select@online" };
    var qhkeyjson = { qjson: [{ "groupid": a_groupid }] };
    queryParam.qhstr = JSON.stringify(qhkeyjson);
    var netbarlistbox = liger.get("gt_netbarlistid");
    if (netbarlistbox.data) {
      netbarlistbox.removeItems(netbarlistbox.data);
    }
    $.getJSON(_hostaddr + 'ywh_queryTableList', queryParam, function(jsondata) {
      $('span.number').text(jsondata.length);
      $.each(jsondata, function(index, data) {
        netbarlistbox.addItems({ "netbarid": data.netbarid, "netbarname": data.netbarname });
      });
    });
  }

  var createPageFunction = function() {
    $("#gt_GroupComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_user_group&qtype=select@online',
      valueField: 'groupid',
      textField: 'groupname',
      emptyText: '移动到分组'
    });
    $("#gt_netbarlistid").ligerListBox({
      isShowCheckBox: true,
      isMultiSelect: true,
      width: 800,
      height: 310,
      valueFieldID: 'gt_netbarlistval',
      valueField: "netbarid",
      textField: "netbarname"
    });
    $("#setSecurityComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=security_policy&qtype=select@online',
      valueField: 'spid',
      textField: 'spname',
      emptyText: '设置新策略'
    });
    $("#setTaskComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=boot_task&qtype=select@online',
      valueField: 'btid',
      textField: 'btname',
      isShowCheckBox: true,
      isMultiSelect: true
    });
  }

  groupTask_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
