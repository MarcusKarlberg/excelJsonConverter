'use strict';
const { remote } = require('electron');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const {dialog} = require('electron').remote;

function convertXlsToJson(path) {
    console.log('converting...' + path);
    return excelToJson({
        sourceFile: path,
        columnToKey: {
            '*': '{{columnHeader}}'
        }
    });
}

function setJsonFileName(fileName, filePath) {
    var jsonFileName;
    if(fileName.includes('.xls')) {
        jsonFileName = fileName.replace('.xls', '.json');
    } else if(fileName.includes('.xlsx')) {
        jsonFileName = fileName.replace('.xlsx', '.json');
    } else {
        return filePath.concat('undefined.json').trim();
    }
 return filePath.concat(jsonFileName).trim();
}

function writeToFile(fileName, filePath, jsonContent) {
    
    fs.writeFile(setJsonFileName(fileName, filePath), jsonContent, function (err) {
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
    var path = fileData.path.replace(fileData.name,'');
    const result = await convertXlsToJson(fileData.path);
    console.log('conversion DONE!');
    console.log('writing to file...');
    await writeToFile(fileData.name, path, JSON.stringify(result[Object.keys(result)[0]]));
    showResult(path);
}

document.querySelector('#convert').addEventListener('click', () => {
    convert();
});
