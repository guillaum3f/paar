const exec = require('child_process').exec;
const validUrl = require('valid-url');
const path = require('path');
exec('npm install', (error, stdout, stderr) => {

if (error) throw error;

var prompt = require('prompt');
var jsonfile = require('jsonfile')

var properties = [
{
    name: 'name', 
    type: 'string',
    validator: /^[0-9a-zA-Z\-]+$/,
    warning: 'Must be only figures, letters, or dashes. No spaces allowed.',
    required: true
},
{
    name: 'owner', 
    type: 'string',
    validator: /^[0-9a-zA-Z\s\-]+$/,
    warning: 'Must be only figures, letters, spaces, or dashes'
},
{
    name: 'description', 
    type: 'string',
    validator: /^[0-9a-zA-Z\s\-]+$/,
    warning: 'Must be only figures, letters, spaces, or dashes'
},
{
    name: 'port', 
    type: 'string',
    validator: /^[0-9]+$/,
    warning: 'Must be only figures',
    required: true
},
{
    name: 'static-content-enabled', 
    type: 'boolean',
    validator: /^true|false$/,
    warning: 'Must be true or false',
    required: true
}
];

var static_app = [
{
    name: 'static app online url (i.e. on Github)', 
    type: 'string',
    validator: function(u) {
        if (validUrl.isUri(u)){
            return true;
        } else {
            return false;
        }

    },
    warning: 'Must be a url',
    required: false
}]

prompt.start();

prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    var root = __dirname+'/'+result.name;
    var static_root = root + '/static';
    var static_entry_point = 'index.html';
    var cmd = {};
    cmd.download = 'git clone https://github.com/guillaum3f/inode24.git '+root;
    if(result['static-content-enabled'] === true) {

        prompt.get(static_app, function (err, result) {
            if(err) throw(err);
            if(result['static app online url (i.e. on Github)']) {
                cmd.install = 'cd '+root+' && npm install && git clone '+result["static app online url (i.e. on Github)"]+' '+static_root;
            } else {
                cmd.install = 'cd '+root+' && npm install && mkdir '+static_root;
            }
            finish_process();
        });

    } else {
        cmd.install = 'cd '+root+' && npm install';
        finish_process();
    }

    function finish_process() {
        exec(cmd.download, (error, stdout, stderr) => {
            exec(cmd.install, (error, stdout, stderr) => {
                var file = root+'/config.json';
                var obj = result;
                if(obj['static-content-enabled']) {
                    obj['static-root'] = static_root;
                    obj['static-entry-point'] = static_entry_point;
                    var fflag=0;
                    var finder = require('findit')(obj['static-root']);
                    finder.on('file', function (file) {
                        if(path.basename(file) === obj['static-entry-point'] && fflag === 0) {
                            fflag=1;
                            obj['static-root'] = path.dirname(file);
                        } else if (path.basename(file) === 'bower.json') {
                            exec('cd '+path.dirname(file)+' && bower install', (error, stdout, stderr) => {
                                if(error) throw error;
                            });
                        }
                    });
                    finder.on('error', function (error) {
                        if(error) throw(error);
                    });
                    finder.on('end', function () {
                        jsonfile.writeFile(file, obj, {spaces: 2}, function (err) {
                            if(err) throw(err)
                        })
                    });
                } else {
                    jsonfile.writeFile(file, obj, {spaces: 2}, function (err) {
                        if(err) throw(err)
                    })
                }
            });
        });
    }
});

function onErr(err) {
    console.log(err);
    return 1;
}

});
