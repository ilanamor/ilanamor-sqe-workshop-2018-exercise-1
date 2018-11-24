import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {functionDeclaration} from './parser';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let table = functionDeclaration(parsedCode);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        clearTable();
        buildTable(table);
    });
});

function clearTable() {
    let tableHTML = document.getElementById('codeTable');
    while ( tableHTML.rows.length > 0 )
    {
        tableHTML.deleteRow(0);
    }
}

function addHeader(tableHTML,thead,headRow){
    ['Line','Type','Name','Condition','Value'].forEach(function(el) {
        let th=document.createElement('th');
        th.appendChild(document.createTextNode(el));
        headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    tableHTML.appendChild(thead);
}

function buildTable(codeTable) {
    let tableHTML = document.getElementById('codeTable');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let headRow = document.createElement('tr');
    addHeader(tableHTML,thead,headRow);
    codeTable.forEach(function(el) {
        let tr = document.createElement('tr');
        for (let o in el) {
            let td = document.createElement('td');
            td.appendChild(document.createTextNode(el[o]?el[o]:''));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
    tableHTML.appendChild(tbody);
}
