const exec = require('child_process').exec;
exec('npm install', (error, stdout, stderr) => {

if (error) throw error;

var prompt = require('prompt');
var jsonfile = require('jsonfile')

var properties = [
{
    name: 'name', 
    validator: /^[0-9a-zA-Z\-]+$/,
    warning: 'Must be only figures, letters, or dashes. No spaces allowed.',
    required: true
},
{
    name: 'owner', 
    validator: /^[0-9a-zA-Z\s\-]+$/,
    warning: 'Must be only figures, letters, spaces, or dashes'
},
{
    name: 'description', 
    validator: /^[0-9a-zA-Z\s\-]+$/,
    warning: 'Must be only figures, letters, spaces, or dashes'
},
{
    name: 'port', 
    validator: /^[0-9]+$/,
    warning: 'Must be only figures'
}
];

prompt.start();

prompt.get(properties, function (err, result) {
    if (err) { return onErr(err); }
    var root = __dirname+'/'+result.name;
    exec('git clone https://github.com/guillaum3f/inode24.git '+root, (error, stdout, stderr) => {
        exec('cd '+root+' && npm install && cd static && bower install', (error, stdout, stderr) => {
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
