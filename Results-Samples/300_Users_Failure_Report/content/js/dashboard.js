/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.03045685279187, "KoPercent": 1.9695431472081217};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9141576908941849, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5839773312725399, 500, 1500, "Transaction Controller (User Journey - Home to Tickets)"], "isController": true}, {"data": [0.9808079114984914, 500, 1500, "HTTP Request (Tickets Selection)"], "isController": false}, {"data": [0.9787648054145516, 500, 1500, "HTTP Request (Tickets Page)"], "isController": false}, {"data": [0.9777929620772121, 500, 1500, "HTTP Request (Checkout)"], "isController": false}, {"data": [0.9801824212271973, 500, 1500, "HTTP Request (Homepage)"], "isController": false}, {"data": [0.9784974093264248, 500, 1500, "HTTP Request (Birthday Booking Page)"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29550, 582, 1.9695431472081217, 126.60954314720782, 78, 2007, 103.0, 170.0, 296.0, 603.9700000000048, 98.70695558354016, 272.0249419825234, 21.68305980497443], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller (User Journey - Home to Tickets)", 5823, 151, 2.5931650352052205, 606.6002060793435, 412, 2978, 543.0, 776.6000000000004, 863.0, 1160.8800000000028, 19.947655816439088, 238.51567063094782, 21.889537002978617], "isController": true}, {"data": ["HTTP Request (Tickets Selection)", 5966, 109, 1.8270197787462286, 120.86758297016394, 78, 1908, 102.0, 140.0, 204.0, 483.9899999999998, 20.12033077473054, 54.635838843856654, 4.420971117494503], "isController": false}, {"data": ["HTTP Request (Tickets Page)", 5910, 116, 1.9627749576988156, 124.30423011844337, 79, 1600, 103.0, 151.0, 276.0, 512.5600000000013, 20.073364581210516, 55.36708029770396, 4.410651397238638], "isController": false}, {"data": ["HTTP Request (Checkout)", 5854, 123, 2.101127434233003, 129.51964468739342, 78, 1503, 103.0, 173.5, 293.0, 571.3999999999978, 20.024834352134693, 56.10670032573708, 4.399988016826471], "isController": false}, {"data": ["HTTP Request (Homepage)", 6030, 116, 1.923714759535655, 128.41227197346598, 78, 2007, 103.0, 174.0, 292.0, 489.0, 20.145057779232886, 54.873593312041265, 4.288693941282], "isController": false}, {"data": ["HTTP Request (Birthday Booking Page)", 5790, 118, 2.0379965457685665, 130.0594127806561, 78, 1603, 103.0, 177.90000000000055, 297.0, 525.0, 19.972059812697264, 55.561237194080825, 4.524919801314224], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 582, 100.0, 1.9695431472081217], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29550, 582, "403/Forbidden", 582, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HTTP Request (Tickets Selection)", 5966, 109, "403/Forbidden", 109, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Tickets Page)", 5910, 116, "403/Forbidden", 116, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Checkout)", 5854, 123, "403/Forbidden", 123, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Homepage)", 6030, 116, "403/Forbidden", 116, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Birthday Booking Page)", 5790, 118, "403/Forbidden", 118, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
