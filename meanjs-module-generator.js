var fs = require('fs-extra');
var exec = require('child_process').exec;
var replace = require('replace');

// get the real arguments
var args = process.argv.slice(2);
if (args.length != 2) {
    console.log('Usage: $ node mean-module-generator.js targetModuleName TargetModuleNameUpperCase')
    process.exit();
}

// name of the source module
var sourceModuleName = 'article';
var sourceModuleNameUpperCase = 'Article';

// name of the target module to generate
var targetModuleName = args[0];
var targetModuleNameUpperCase = args[1];

// base output directory to store all generated modules
var OUTPUT_BASE_DIR = 'output';

// target module directory
var targetModuleDir = OUTPUT_BASE_DIR + '/' + targetModuleName + 's';

// make a copy of the "article" module
fs.copySync(sourceModuleName + 's', targetModuleDir);
console.log('>>> copied "' + sourceModuleName + '" module to "' + targetModuleName + '" module.');

// rename files
console.log('>>> renaming files: ' + sourceModuleName + ' -> ' + targetModuleName);
var renameCmd = '"node_modules/.bin/renamer" -v --find "' + sourceModuleName + '" --replace "' + targetModuleName + '" ' + targetModuleDir + '/**/*';
exec(renameCmd, function (err, stdout, stderr) {
    if (err) {
        console.error(err);
        process.exit();
    }
    console.log(stdout);
    console.log(">>> renaming files completed.");

    // replace module names in files
    console.log(">>> replacing module names in file ...");
    console.log(sourceModuleName + ' -> ' + targetModuleName);
    replace({
        regex: sourceModuleName,
        replacement: targetModuleName,
        paths: [targetModuleDir],
        recursive: true,
        silent: true
    });

    console.log(sourceModuleNameUpperCase + ' -> ' + targetModuleNameUpperCase);
    replace({
        regex: sourceModuleNameUpperCase,
        replacement: targetModuleNameUpperCase,
        paths: [targetModuleDir],
        recursive: true,
        silent: true
    });
    console.log(">>> replacing module names in files completed.");
    console.log('>>> new module "' + targetModuleName + '" has been successfully generated. All done!');
});