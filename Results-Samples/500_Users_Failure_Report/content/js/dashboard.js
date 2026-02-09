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

    var data = {"OkPercent": 23.3763893807509, "KoPercent": 76.62361061924909};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.21403111578532905, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1400617437944368, 500, 1500, "Transaction Controller (User Journey - Home to Tickets)"], "isController": true}, {"data": [0.23221919335852798, 500, 1500, "HTTP Request (Tickets Selection)"], "isController": false}, {"data": [0.2287614194270089, 500, 1500, "HTTP Request (Tickets Page)"], "isController": false}, {"data": [0.22611703122078894, 500, 1500, "HTTP Request (Checkout)"], "isController": false}, {"data": [0.23250609624347934, 500, 1500, "HTTP Request (Homepage)"], "isController": false}, {"data": [0.2241702606412901, 500, 1500, "HTTP Request (Birthday Booking Page)"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160953, 123328, 76.62361061924909, 787.898193882692, 77, 20968, 714.0, 1884.0, 3553.0, 5918.0, 134.25840194189334, 3524.314857702406, 29.455225192218666], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Transaction Controller (User Journey - Home to Tickets)", 32068, 24763, 77.22028190096046, 3935.3289260321812, 409, 26068, 4856.0, 9435.200000000012, 11545.900000000001, 16246.790000000034, 26.90105966753686, 3525.0060423612736, 29.498204301785044], "isController": true}, {"data": ["HTTP Request (Tickets Selection)", 32282, 24626, 76.28399727402268, 782.0682423641682, 78, 19896, 850.0, 1977.800000000003, 2765.9500000000007, 5626.790000000034, 27.00292764533668, 706.4558884554057, 5.928114217377666], "isController": false}, {"data": ["HTTP Request (Tickets Page)", 32182, 24663, 76.63600770617116, 788.2929277235727, 78, 20794, 849.0, 2017.800000000003, 2747.9000000000015, 5626.950000000008, 26.96608500743658, 707.758400683694, 5.914854764124264], "isController": false}, {"data": ["HTTP Request (Checkout)", 32094, 24694, 76.94273072848507, 786.5132111921257, 77, 20968, 853.0, 1999.9000000000015, 2718.0, 5589.890000000018, 26.940430371990146, 710.074145612023, 5.911965976363956], "isController": false}, {"data": ["HTTP Request (Homepage)", 32397, 24659, 76.11507238324536, 792.059851220791, 77, 20247, 862.0, 1971.0, 2703.9000000000015, 5897.920000000013, 27.023848252045745, 704.5907137388642, 5.7424690244863745], "isController": false}, {"data": ["HTTP Request (Birthday Booking Page)", 31998, 24686, 77.1485717857366, 790.5584724045259, 78, 18210, 853.0, 1968.9000000000015, 2741.9500000000007, 5635.920000000013, 26.90757175941109, 710.7722217680409, 6.08710178509261], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["403/Forbidden", 123095, 99.81107291126102, 76.47884786241947], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 233, 0.1889270887389725, 0.1447627568296335], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160953, 123328, "403/Forbidden", 123095, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 233, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HTTP Request (Tickets Selection)", 32282, 24626, "403/Forbidden", 24598, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 28, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Tickets Page)", 32182, 24663, "403/Forbidden", 24607, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 56, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Checkout)", 32094, 24694, "403/Forbidden", 24653, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 41, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Homepage)", 32397, 24659, "403/Forbidden", 24599, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 60, "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request (Birthday Booking Page)", 31998, 24686, "403/Forbidden", 24638, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 48, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
