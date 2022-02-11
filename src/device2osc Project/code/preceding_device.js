autowatch = 1;

inlets = 1;
outlets = 1;


function bang() {
	var _api = new LiveAPI('this_device');
    var path = _api.unquotedpath.split(' ');
    var prev_device_pos = parseInt(path[path.length-1]) - 1;
    path[path.length-1] = prev_device_pos.toString();
    var device_path = path.join(" ");
    outlet(0, device_path);
}
