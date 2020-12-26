'use strict';
const { remote } = require('electron');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const {dialog} = require('electron').remote;

function convertXlsToJson(path) {
    console.log('converting...' + path);
    return excelToJson({
        sourceFile: path
    });
}

function writeToFile(filePath, jsonContent) {
    fs.writeFile(filePath.concat('requirements.json'), jsonContent, function (err) {
        if (err) return console.log(err);
        console.log('writing DONE!');
    });
}

function showResult(path) {
    dialog.showOpenDialog({
        defaultPath: path,
        properties: ['openDirectory', 'multiSelections']
    }, function (files) {
        if (files !== undefined) {
           return;
        }
    });
}

async function convert() {
    var fileData = document.querySelector('#file_input').files[0];
    var pathOnly = fileData.path.replace(fileData.name,'');
    const result = await convertXlsToJson(fileData.path);
    console.log('conversion DONE!');
    console.log('writing to file...');
    await writeToFile(pathOnly, JSON.stringify(result['Sample-spreadsheet-file']));
    showResult(pathOnly);
}

document.querySelector('#convert').addEventListener('click', () => {
    convert();
});