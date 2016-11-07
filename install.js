const exec = require('child_process').exec;
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

prompt.start();

prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    var root = __dirname+'/'+result.name;
    var cmd = {};
    if(result['static-content-enabled'] === true) {
        cmd.download = 'git clone https://github.com/guillaum3f/inode24.git '+root;
        cmd.install = 'cd '+root+' && npm install && cd static && bower install';
    } else {
        cmd.download = 'echo "no download required (static)"';
        cmd.install = 'cd '+root+' && npm install';
    }
    exec(cmd.download, (error, stdout, stderr) => {
        exec(cmd.install, (error, stdout, stderr) => {
            var file = root+'/config.json'
            var obj = result
            jsonfile.writeFile(file, obj, {spaces: 2}, function (err) {
            if(err) throw(err)
            })
        });
    });
});

function onErr(err) {
    console.log(err);
    return 1;
}

});
