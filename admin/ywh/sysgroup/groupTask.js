(function($) {

  var $root = $(".groupTaskpage_clsf");

  var _qsource_detail = "group_task";

  var a_groupid = $sHelper.GetUrlParms("groupid");

  var pageBindingAction = function() {
    authorityManage('group_task');
    $root.on("click", '.grouptask_yydzm', function(actionobj) {
      var rowobj = $(this);
      var _groupid = $("#gt_GroupComboBoxId").ligerGetComboBoxManager().getValue();
      if (!_groupid) { _groupid = 0; };
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
    });

    $root.on("click", '.netbar_list_show', function(actionobj) {
      $('.netbar_detail').hide();
      $('.netbar_list').show();
      $('.netbar_list_btn').show();
      actionobj.preventDefault();
    });

    $root.on("click", '.netbar_list_hide', function(actionobj) {
      $('.netbar_list').hide();
      $('.netbar_list_btn').hide();
      $('.netbar_detail').show();
      actionobj.preventDefault();
    });

    $root.on("click", '.group_set_task', function(actionobj) {
      var rowobj = $(this);
      var btn = $('div a.group_set_task');
      if (btn.text() == '修改配置') {
        $('div.set_task_list').show();
        btn.text('确认设置');
      } else {
        var _JsonArr = [];
        var _btidsStr = $("#setTaskComboBoxId").ligerGetComboBoxManager().getValue();

        var _btids = _btidsStr.split(';');
        $.each(_btids, function(index, btid) {
          _JsonArr.push({ "groupid": a_groupid, "btid": btid });
        });

        $.ligerDialog.confirm('确认修改任务配置？', function(yes) {
          if (yes) {
            var actionparam = { "actionname": _qsource_detail }
            actionparam.datajson = JSON.stringify(_JsonArr);
            actionparam.operjson = JSON.stringify({ opertype: ["updateGroupBootTask"] });
            $sHelper.AjaxSendData(_hostaddr + "ywh_saveAction", actionparam, '', function() {
              showDbInfo();
              $('div.set_task_list').hide();
              btn.text('修改配置');
            });
          }
        });
      }

      actionobj.preventDefault();
      rowobj = null;
    });

    createPageFunction();
    showDbInfo();
  }

  var showDbInfo = function() {
    showTaskListBox();
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
                $("#gt_boot_task_lid").append("<li style='padding-right:50px;'>" + jsondata.btname + "</li>");
                $(".set_task_list input[value=" + jsondata.btid + "]").click();
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
      $('.netbar_list_show').text('查看列表');
    });
  }

  var showTaskListBox = function() {
    var queryParam = { "source": "boot_task", "qtype": "select@online" };
    var tasklistbox = liger.get("setTaskComboBoxId");
    if (tasklistbox.data) {
      tasklistbox.removeItems(tasklistbox.data);
    }
    $.getJSON(_hostaddr + 'ywh_queryTableList', queryParam, function(jsondata) {
      $.each(jsondata, function(index, data) {
        tasklistbox.addItems({ "btid": data.btid, "btname": data.btname });
      });
    });
  }

  var createPageFunction = function() {
    var qhkeyjson = { "qjson": [{ "groupid": a_groupid }], "qjsonkeytype": [{ "groupid": "NotEquery" }] };
    $("#gt_GroupComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=sys_user_group&qtype=select@online&qhstr=' + JSON.stringify(qhkeyjson),
      valueField: 'groupid',
      textField: 'groupname',
      emptyText: '未分组'
    });

    $("#gt_netbarlistid").ligerListBox({
      isShowCheckBox: true,
      isMultiSelect: true,
      width: '98%',
      height: 310,
      valueFieldID: 'gt_netbarlistval',
      valueField: "netbarid",
      textField: "netbarname"
    });
    $("#setSecurityComboBoxId").ligerComboBox({
      width: 200,
      url: _hostaddr + 'ywh_queryTableList/?source=security_policy&qtype=select@online',
      valueField: 'spid',
      textField: 'spname'
    });

    $("#setTaskComboBoxId").ligerListBox({
      isShowCheckBox: true,
      isMultiSelect: true,
      width: '98%',
      height: 170,
      valueFieldID: 'gt_netbarlistval',
      valueField: "btid",
      textField: "btname"
    });
  }

  groupTask_action = function() {
    pageBindingAction();
    pageSetUp();
  }
}(jQuery));
