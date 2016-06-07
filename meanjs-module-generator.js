var fs = require('fs');
var replace = require('replace');
var ncp = require('ncp').ncp;
var exec = require('child_process').exec;

var output_dir = 'output/patients';

fs.access(output_dir, fs.F_OK, function(err) {
    if (!err) {
        console.error('output directory exists.');
        process.exit();
    }
});

// make a copy of the "article" module
ncp('articles', output_dir, function(err) {
    if (err) {
        console.error(err);
        process.exit();
    }
    console.log('copied "articles" module to "' + output_dir + '" module.');

    // rename file names
    var rename_cmd = '"node_modules/.bin/renamer" -v --find "article" --replace "patient" ' + output_dir + '/**/*';
    exec(rename_cmd, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
            process.exit();
        }
        console.log(stdout);
        console.log("renaming files completed.");

        // replace names in files
        replace({
            regex: "Article",
            replacement: "Patient",
            paths: [output_dir],
            recursive: true,
            silent: true,
        });

        replace({
            regex: "article",
            replacement: "patient",
            paths: [output_dir],
            recursive: true,
            silent: true,
        });
        console.log("replacing names in files completed.");
        console.log("All done!");
    });
});