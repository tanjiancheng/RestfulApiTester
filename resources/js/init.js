/**
 * init script
 */

window.$ = window.jQuery =
require('./resources/third-party/jquery/jquery.js');
require('./resources/third-party/semantic/semantic.js');
require('./resources/third-party/json-format/json-format.js');
require('./resources/third-party/jquery.rainbowJSON/js/jquery.rainbowJSON.js');

var fs = require('fs');
var configFile = __dirname + '/.config.json';

function global(key, value) {
    if (typeof this.data != 'object') {
        this.data = {};
    }

    if (typeof key == 'undefined' && typeof value == 'undefined') {
        this.data = {};
    } else if (typeof value == 'undefined') {
        return this.data[key];
    } else {
        this.data[key] = value;
    }
}

function loadTemplate(name) {
    $('#body').html($('#loading').html());
    $.get('resources/template/'+name+'.html', function(html) {
        $('#body').html(html);
    });
}

function ucfirst(str) {
    return str.substr(0, 1).toUpperCase()+str.substr(1);
}

function switchTab(name) {
    $('#menu a').removeClass('hover');
    $('#menu a[data-tab="'+name+'"]').addClass('hover');
    $('title').html(ucfirst(name));
    global();
    loadTemplate(name);
}

$.fn.getParams = function() {
    var params = {};
    $('[data-item="show"]').each(function() {
        var key = $.trim($('input[name="key"]', $(this)).val());
        var value = $('input[name="value"]', $(this)).val();
        if (key) {
            params[key] = value;
        }
    });

    return params;
};

$.fn.addParams = function(num) {
    var tplGroup = $('[data-item="hide"]');

    for (var i = 0; i < num; i++) {
        var newGroup = tplGroup.clone().attr('data-item', 'show').css('display', 'flex');
        $('[data-item="add"]', newGroup).data('curGroup', newGroup).data('tplGroup', tplGroup);
        $('[data-item="minus"]', newGroup).data('curGroup', newGroup).data('tplGroup', tplGroup);

        tplGroup.before(newGroup);
    }

    $('[data-item="minus"]', $('[data-item="show"]')[0]).remove();
    if (!$(this).data('init')) {
        $(this).data('init', true);
        $(this).on('click', '[data-item="add"]', function() {
            var curGroup = $(this).data('curGroup');
            var tplGroup = $(this).data('tplGroup');

            var newGroup = tplGroup.clone().attr('data-item', 'show').css('display', 'flex');
            $('[data-item="add"]', newGroup).data('curGroup', newGroup).data('tplGroup', tplGroup);
            $('[data-item="minus"]', newGroup).data('curGroup', newGroup).data('tplGroup', tplGroup);

            curGroup.after(newGroup);
        });

        $(this).on('click', '[data-item="minus"]', function() {
            var curGroup = $(this).data('curGroup');
            curGroup.remove();
        });
    }
};

$.fn.deleteAllParams = function() {
    $('[data-item="show"]', $(this)).remove();
};

$.fn.initParams = function(data) {
    if (typeof data != 'object') {
        return;
    }

    var groupNum = $('[data-item="show"]').size();

    var i = 0;
    for (var k in data) {
        if (i >= groupNum) {
            $(this).addParams(1);
        }

        var group = $('[data-item="show"]')[i];
        $('input[name="key"]', group).val(k);
        $('input[name="value"]', group).val(data[k]);

        i++;
    }
};

function isArray(val) {
    if (typeof val == 'object' && val instanceof Array) {
        return true;
    } else {
        return false;
    }
}

function addTest(data) {
    if (typeof data != 'object') {
        return [false, 'Invalid data'];
    }

    var _data = {};
    _data.group = (typeof data.group == 'undefined') ? '' : $.trim(data.group);
    _data.name = (typeof data.name == 'undefined') ? '' : $.trim(data.name);
    _data.desc = (typeof data.desc == 'undefined') ? '' : $.trim(data.desc);
    _data.method = (typeof data.method == 'undefined') ? '' : $.trim(data.method);
    _data.url = (typeof data.url == 'undefined') ? '' : $.trim(data.url);
    _data.params = (typeof data.params != 'object') ? {} : data.params;

    if (_data.group.length < 1) {
        return [false, 'Please enter the group name'];
    }

    if (!_data.group.match(/^\w+$/)) {
        return [false, 'The group name can only has these characters: a-zA-Z0-9_'];
    }

    if (_data.name.length < 1) {
        return [false, 'Please enter the test name'];
    }

    if (!_data.name.match(/^\w+$/)) {
        return [false, 'The test name can only has these characters: a-zA-Z0-9_'];
    }

    if (_data.desc.length < 1) {
        return [false, 'Please enter the test description'];
    }

    if (_data.method != 'GET' && data.method != 'POST') {
        return [false, 'The method must be GET or POST'];
    }

    if (_data.url.length < 1) {
        return [false, 'Please enter the test URL'];
    }

    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    if (!isArray(data.tests)) {
        data.tests = [];
    }

    for (var i = 0; i < data.tests.length; i++) {
        if (
            typeof data.tests[i] == 'object' &&
            data.tests[i].group == _data.group &&
            data.tests[i].name == _data.name
        ) {
            return [false, 'The same test exists'];
        }
    }

    data.tests.push(_data);

    try {
        fs.writeFileSync(configFile, JSONFormat(JSON.stringify(data)));
        return [true, 'Add test success'];
    } catch(err) {
        return [false, err.message];
    }
}

function setTest(data) {
    if (typeof data != 'object') {
        return [false, 'Invalid data'];
    }

    var _data = {};
    _data.group = (typeof data.group == 'undefined') ? '' : $.trim(data.group);
    _data.name = (typeof data.name == 'undefined') ? '' : $.trim(data.name);
    _data.desc = (typeof data.desc == 'undefined') ? '' : $.trim(data.desc);
    _data.method = (typeof data.method == 'undefined') ? '' : $.trim(data.method);
    _data.url = (typeof data.url == 'undefined') ? '' : $.trim(data.url);
    _data.params = (typeof data.params != 'object') ? {} : data.params;

    if (_data.group.length < 1) {
        return [false, 'Please enter the group name'];
    }

    if (!_data.group.match(/^\w+$/)) {
        return [false, 'The group name can only has these characters: a-zA-Z0-9_'];
    }

    if (_data.name.length < 1) {
        return [false, 'Please enter the test name'];
    }

    if (!_data.name.match(/^\w+$/)) {
        return [false, 'The test name can only has these characters: a-zA-Z0-9_'];
    }

    if (_data.desc.length < 1) {
        return [false, 'Please enter the test description'];
    }

    if (_data.method != 'GET' && data.method != 'POST') {
        return [false, 'The method must be GET or POST'];
    }

    if (_data.url.length < 1) {
        return [false, 'Please enter the test URL'];
    }

    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    if (!isArray(data.tests)) {
        data.tests = [];
    }

    var is_ok = false;
    for (var i = 0; i < data.tests.length; i++) {
        if (
            typeof data.tests[i] == 'object' &&
            data.tests[i].group == _data.group &&
            data.tests[i].name == _data.name
        ) {
            data.tests[i] = _data;
            is_ok = true;
        }
    }

    if (!is_ok) {
        return [false, 'Test not found'];
    }

    try {
        fs.writeFileSync(configFile, JSONFormat(JSON.stringify(data)));
        return [true, 'Set test success'];
    } catch(err) {
        return [false, err.message];
    }
}

function getTests() {
    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    if (!isArray(data.tests)) {
        data.tests = [];
    }

    for (var i = 0; i < data.tests.length; i++) {
        var test = data.tests[i];
        if (typeof test != 'object') {
            data.tests[i] = {};
        }

        if (typeof test.params != 'object') {
            test.params = {};
        }
    }

    data.tests.sort(function(a, b) {
        if (a.group > b.group) {
            return true;
        } else if (a.group < b.group) {
            return false;
        } else if (a.name > b.name) {
            return true;
        } else if (a.name < b.name) {
            return false;
        } else {
            return true;
        }
    });

    var _data = {};
    for (var i = 0; i < data.tests.length; i++) {
        var test = data.tests[i];
        if (!isArray(_data[test.group])) {
            _data[test.group] = [];
        }
        _data[test.group].push(test);
    }

    return _data;
}

function deleteTest(group, name) {
    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    if (!isArray(data.tests)) {
        data.tests = [];
    }

    var is_ok = false;
    for (var i = 0; i < data.tests.length; i++) {
        if (
            typeof data.tests[i] == 'object' &&
            data.tests[i].group == group &&
            data.tests[i].name == name
        ) {
            data.tests.splice(i, 1);
            is_ok = true;
            break;
        }
    }

    if (!is_ok) {
        return [false, 'Test not found'];
    }

    try {
        fs.writeFileSync(configFile, JSONFormat(JSON.stringify(data)));
        return [true, 'Delete test success'];
    } catch(err) {
        return [false, err.message];
    }
}

function getEnv() {
    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    if (typeof data.env != 'object') {
        data.env = {};
    }

    return data.env;
}

function setEnv(env) {
    if (typeof env != 'object') {
        return [false, 'Invalid data'];
    }

    try {
        var data = JSON.parse(fs.readFileSync(configFile));
    } catch(err) {
        var data = {};
    }

    data.env = env;
    try {
        fs.writeFileSync(configFile, JSONFormat(JSON.stringify(data)));
        return [true, 'Save envrionment success'];
    } catch(err) {
        return [false, err.message];
    }
}

