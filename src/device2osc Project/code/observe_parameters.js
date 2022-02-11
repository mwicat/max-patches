// watch for changes from external editor
autowatch = 1;

inlets = 1;
outlets = 3;

var prefixString = null;
var prefixRE = null;

var params = [];
var callbacks = [];

/**
 * Observe device parameter
 * @param {string} pname Parameter name
 * @param {int} ppos Parameter position
 * @param {string} ppath LiveAPI path for given parameter
 */
function _observeParam(pname, ppos, ppath) {
	// post("Observe parameter name=" + pname + " pos=" + ppos + " path=" + ppath + "\n");
    var cb = function(prop) {
        if (prop[0] == 'value') {
            var value = prop[1];
            var paramPrefix = prefixString + '/param/' + ppos;
            outlet(0, [paramPrefix + '/name', pname]);
            outlet(0, [paramPrefix + '/value', value]);
            var p = new LiveAPI(ppath);
            var str = p.call('str_for_value', value);
            outlet(0, [paramPrefix + '/str', str]);
        }
    }
    callbacks.push(cb);
    var param = new LiveAPI(cb, ppath);
    params.push(param);
    param.property = 'value';
}
_observeParam.local = 1;

/**
 * Stop observing all parameters.
 */
function _removeObservers() {
    for (var i = 0; i < params.length; i++) {
        params[i].cb_private = null;
    }
    params = [];
}
_removeObservers.local = 1;

/**
 * Start observing parameters with given LiveAPI device path
 * @param {string} device_path 
 */
function attach(device_path) {
    _removeObservers();
    var device = new LiveAPI(device_path);
    var param_cnt = device.getcount('parameters');
    for (var i = 0; i < param_cnt; i++) {
        var param_path = device_path + ' parameters ' + i;
        var param = new LiveAPI(param_path);
        var param_name = param.get('name').toString();
        _observeParam(param_name, i, param_path);
    }
}

/**
 * Set value of parameter that matches given path.
 * @param {string} path 
 * @param {number} value 
 */
function setparam(path, value) {
    var matches = path.match(prefixRE);
    if (matches !== null && params !== null) {
        var param_pos = parseInt(matches[1]);
        var param = params[param_pos];
        if (param == undefined) {
            return;
        }
        param.set('value', value);
    }
}

/**
 * Set prefix so that every incoming parameter change has to have parameter
 * path starting with that prefix.
 * @param {string} p 
 */
function prefix(p) {
    prefixString = p;
    prefixRE = new RegExp('^' + p + '/param/(\\d+)/value$');
}
