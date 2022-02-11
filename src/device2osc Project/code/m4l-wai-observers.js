autowatch = 1;

var _selectedTrackObserver;
var _selectedSceneObserver;
var _selectedParamObserver;
var _selectedDeviceObserver;
var _selectedTrackId;
var _selectedSceneId;
var _selectedParamId;
var _selectedDeviceId;
var _api;

function deviceReady()
{
    _selectedTrackObserver = new LiveAPI(selectedTrackCallback, 'live_set view');
    _selectedTrackObserver.property = 'selected_track';

    _selectedSceneObserver = new LiveAPI(selectedSceneCallback, 'live_set view');
    _selectedSceneObserver.property = 'selected_scene';

    _selectedParamObserver = new LiveAPI(selectedParamCallback, 'live_set view');
    _selectedParamObserver.property = 'selected_parameter';

    _selectedDeviceObserver = new LiveAPI(selectedDeviceCallback, 'live_set tracks 0 view');
    _selectedDeviceObserver.property = 'selected_device';

    _api = new LiveAPI('this_device');
}

function selectedTrackCallback(args)
{
    if (args[0] !== 'selected_track') {
        return;
    }
    _selectedTrackId = args[2];
    _outletWrapper(args[0], args[2]);
}

function selectedSceneCallback(args)
{
    if (args[0] !== 'selected_scene') {
        return;
    }
    _selectedSceneId = args[2];
    _outletWrapper(args[0], args[2]);
}

function selectedParamCallback(args)
{
    if (args[0] !== 'selected_parameter') {
        return;
    }
    _selectedParamId = args[2];
    _outletWrapper(args[0], args[2]);
}

function selectedDeviceCallback(args)
{
    if (args[0] !== 'selected_device') {
        return;
    }
    _selectedDeviceId = args[2];
    _outletWrapper(args[0], args[2]);
}

function updateDeviceObserverPath(path)
{
    _selectedDeviceObserver.path = path;
}

_outletWrapper.local = 1;
function _outletWrapper(observed, id)
{
    if (0 == id) {
        outlet(0, observed, 'clearall');
        return;
    }

    _api.id = parseInt(id);

    outlet (0, observed, 'id', _api.id);
    outlet (0, observed, 'path', _api.path.split('\"').join(""));
    outlet (0, observed, 'name', _api.get('name'));
}

/**
 * Refresh all observers
 * - called after switching tab in device
 */
function refresh()
{
    _outletWrapper('selected_track', _selectedTrackId);
    _outletWrapper('selected_scene', _selectedSceneId);
    _outletWrapper('selected_parameter', _selectedParamId);
    _outletWrapper('selected_device', _selectedDeviceId);
}
