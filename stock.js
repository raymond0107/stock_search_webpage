//var valuePresentInSearchList = false;
$(document).ready(function() {    
    createFavoriteTable();
    $("#entryName").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "hw8.php",
                dataType: "json",
                type: "GET",
                data: {
                    url: "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input="+request.term
                },
                success: function(data) {
                    response($.map(data,function(item) {
                        return {
                            label: item.Symbol + "-" + item.Name + " (" + item.Exchange + ")",
                            value: item.Symbol
                        };
                    }));
                }
            })
        },
        select: function(event, ui) {
            //alert(ui.content);
        },
        /*response: function( event, ui ) {
            jQuery.each( ui.content, function( key, value ) {
                for( k in value ) {
                    // alert( "key is " + [ k ] + ", value is " + value[ k ] );
                    // CHECK HERE IF INPUT VALUE IS EXACTLTY MATCH
                    // YOU CAN ALSO DO PATTERN MATCH HERE
                    if( value[ k ] ==$("#tags").val()) {
                        valuePresentInSearchList = true;
                    }
                }
            });
            //alert(valuePresentInSearchList);
        }*/
    });
}); 

$("#clear").click(function(){
  $('#entryName').val('');
  $('#goahead').addClass('disabled');
  $("#validation_info").text('');
});

function check(input) { 
    //alert("Sd");  
    //event.preventDefault();
    var s = "";
    if (input === "") {
        //alert("Sd");
        s = document.getElementById("entryName").value;
    }
    else {
        s = input;
        //alert("this is input " + s);
    }

    var hasMatch = false;
    $.ajax({
        url: "hw8.php",
        dataType: "json",
        type: "GET",
        data: {
            url: "http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input="+s
        },
        success: function(data) {
            for (i = 0; i < data.length; i++) {
                if ((data[i]['Symbol'] === s)) {
                    hasMatch = true;
                    $("#validation_info").text("");
                    getStockInfo(s);
                    getStockChart(s);
                    getStockNews(s);
                    if(localStorage.getItem(s)) {
                      $('.glyphicon-star').addClass("favorite");
                      $('.glyphicon-star').css("color", "yellow");
                    } 
                    else {
                      $('.glyphicon-star').removeClass("favorite");
                      $('.glyphicon-star').css("color", "");
                    }
                    break;
                }
            }
            if (!hasMatch) {
                $("#validation_info").text("Select a valid entry");
            }
            else {
                $('#myCarousel').carousel('next');
                $("#goahead").removeClass("disabled");
            }

        }
    });
    return false;
}

function getStockInfo(s) {
    $.ajax({
        url: "hw8.php",
        dataType: "json",
        type: "GET",
        data: {
            url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol="+s
        },
        success: function(data) {
            //alert(data['Status']);
            if (data['Status'] == "SUCCESS") {

                $("#p2_3_1_1").empty();
                $("#p2_3_1_image").empty();
                var date = moment(data['Timestamp']).format('D MMMM YYYY, h:mm:ss a');
                var url_change = "";
                var url_changeytd = "";
                if (data["Change"] > 0) {
                    url_change = "http://cs-server.usc.edu:45678/hw/hw8/images/up.png";
                }
                else {
                    url_change = "http://cs-server.usc.edu:45678/hw/hw8/images/down.png";
                }
                if (data["ChangePercentYTD"] > 0) {
                    url_changeytd = "http://cs-server.usc.edu:45678/hw/hw8/images/up.png";
                } 
                else {
                    url_changeytd = "http://cs-server.usc.edu:45678/hw/hw8/images/down.png";
                }
                var color = data['changePercent'] > 0? 'green':'red';
                var content = "<tr><td>Name</td><td id='name'>"+data["Name"]+"</td></tr>"
                                +"<tr><td>Symbol</td><td  id ='symbol'>"+data["Symbol"]+"</td></tr>"
                                +"<tr><td>Last Price</td><td id='price'>"+"$ "+Number(data["LastPrice"]).toFixed(2)+"</td></tr>"
                                +"<tr><td>Change(Change Percent)</td><td id='change' style='color:"+color+"'>"+Number(data["Change"]).toFixed(2)+" ( "+Number(data["Change"]).toFixed(2)+"% )"+"<img src="+url_change+">"+"</td></tr>"
                                +"<tr><td>Time and Date</td><td>"+date+"</td></tr>"
                                +"<tr><td>Market Cap</td><td>"+(Number(data["MarketCap"]) / 1000000000).toFixed(2)+" Billion"+"</td></tr>"
                                +"<tr><td>Volume</td><td>"+data["Volume"]+"</td></tr>"
                                +"<tr><td>Change YTD (Change Percent YTD)</td><td style='color:"+color+"'>"+Number(data["ChangeYTD"]).toFixed(2)+" ( "+data["ChangePercentYTD"].toFixed(2)+"% )"+"<img src="+url_changeytd+">"+"</td></tr>"
                                +"<tr><td>High Price</td><td>"+"$ "+Number(data["High"]).toFixed(2)+"</td></tr>"
                                +"<tr><td>Low Price</td><td>"+"$ "+Number(data["Low"]).toFixed(2)+"</td></tr>"
                                +"<tr><td>Opening Price</td><td>"+"$ "+Number(data["Open"]).toFixed(2)+"</td></tr>";
                var url_image = "http://chart.finance.yahoo.com/t?s="+s+"&lang=en-US&width=400&height=300";
                var image = "<img src="+url_image+">";

                $("#p2_3_1_1").append(content);
                $("#p2_3_1_image").append(image);
                //makeFavorite(data);
            }
        }
    });
    $( "#goahead" ).trigger("click");
}

function getStockNews(s) {
    $.ajax({
        url: "hw8.php",
        dataType: "json",
        type: "GET",
        data: {
            url_news: "https://api.datamarket.azure.com/Bing/Search/v1/News?Query=%27"+s+"%27&$format=json"
        },
        success: function(data) {
            var length = data['d']['results'].length;
            /*for (var i = 0; i < length; i++) {
                $("#p2_3_3_content").text("content:  " + data['d']['results'][i]['title']);
            }*/
            /*if (length > 0) {
             $("#p2_3_3_1_content").text("content:  " + data['d']['results'][0]['content']);
             $("#p2_3_3_2_content").text("title:  " + data['d']['results'][0]['title']);
             $("#p2_3_3_3_content").text("Date:  " + data['d']['results'][0]['Date']);
             $("#p2_3_3_4_content").text("Publisher:  " + data['d']['results'][0]['Publisher']);
            }*/
              //$("#p2_3_3_content").text(length);
            //$("#p2_3_3content").text(length);
            var news = "";
            for (var i = 0; i < length; i++) {
                news += "<div class='well'>";
                news += "<a href='"+data['d']['results'][i]['Url']+"'target='_blank'>"+data['d']['results'][i]['Title'] +"</a>";
                news += "<br><br>" + data['d']['results'][i]['Description'];
                news += "<br><br><b>" + "Publisher: " + data['d']['results'][i]['Source'] + "</b>";
                news += "<br><br><b>" + "Date: " + moment(data['d']['results'][i]['Date']).format('D MMMM YYYY h:mm:ss') + "</b>";
                news += "</div>"
            }
            news += "</div>";
            $("#p2_3_3content").empty();
            $("#p2_3_3content").append(news);
        }
    });
}


function getStockChart(s) {
    //$("#chartDemoContainer").append(s);
    $('#chartDemoContainer').empty();
    $.ajax({
        url: "hw8.php",
        dataType: "json",
        type: "GET",
        data: {
            url: "http://dev.markitondemand.com/MODApis/Api/v2/InteractiveChart/json?parameters={'Normalized':false,'NumberOfDays':1095,'DataPeriod':'Day','Elements':[{'Symbol':'"+s+"','Type':'price','Params':['ohlc']}]}"
        },
        success: function(data) {
            //$("#chartDemoContainer").text("success");
            render(data,s);
        }
    });
}

function removeFavorRow(data){
  var id = ""+data.parentNode.parentNode.id;
  localStorage.removeItem(id);
  if($('#symbol').text() == id) {
    $('.glyphicon-star').removeClass("favorite");
    $('.glyphicon-star').css("color", "");
  }
  $("#"+id).remove();
}

function addFavorRow(data) {
    var content = "<tr id='"+data['Symbol']+"'>";
    content += "<td id='"+data['Symbol']+"_old'><a href='#' onclick='check(this.text)'>"+data['Symbol']+"</a></td>";
    content += '<td>'+data["Name"]+'</td>';
    var price = Number(data['LastPrice']).toFixed(2);
    content += "<td id='"+data['LastPrice']+"'>$ " + price + "</td>";
    var change = Number(data["Change"]).toFixed(2);
    var changePercent = Number(data["ChangePercent"]).toFixed(2);
    var color = changePercent > 0? 'green':'red';
    var img = changePercent > 0? 'http://cs-server.usc.edu:45678/hw/hw8/images/up.png':'http://cs-server.usc.edu:45678/hw/hw8/images/down.png';
    content += '<td id="'+data['Symbol']+'_refresh" style="color:'+color+'"><span>'+change+' ( '+changePercent+'% )</span> '+'<img src="'+img+'">'+'</td>';

    var marketCapNum = data["MarketCap"];
    var marketCap ='';
    if(marketCapNum > 1000000000) {
        marketCapNum /= 1000000000;
        marketCap += Number(marketCapNum).toFixed(2) + ' Billion';
    }
    else if(marketCapNum > 1000000) {
        marketCapNum /= 1000000;
        marketCap += Number(marketCapNum).toFixed(2) + ' Million';
    } 
    else {
        marketCap += Number(marketCapNum).toFixed(2);
    }
    content += '<td>'+marketCap+'</td>';
    content += '<td><button onclick="removeFavorRow(this)" type="button" class="btn default"><span class="glyphicon glyphicon-trash"></span></button></td>';
    content += '</tr>';
    $('#favorite_content_table').append(content); 
}

function createFavoriteTable() {
    //alert("create");
    for(var i = 0;i < localStorage.length;i++) {     
        var s = localStorage.getItem(localStorage.key(i));
        //alert(s);
        $.ajax({
            url: "hw8.php",
            dataType: "json",
            type: "GET",
            data: {
                url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol="+s
            },
            success: function(data) {
                //alert(data['Symbol']);
                addFavorRow(data);
            }
        });
    }
}

/*function makeFavorite (data) {
    $("#favorite").empty();
    var b = "<button id='favor_button' type='button' class='btn btn-default' onclick='makeFavoriteList()'><span style='font-size:20px' class='glyphicon glyphicon-star'></span></button>";
    b += '<a href="javascript:fb_feeds()"><img src="fb.png" width="35" height="35"></a>';
    $("#favorite").append(b);
}*/

function makeFavoriteList() {
    var s = $('#symbol').text();
    $.ajax({
        url: "hw8.php",
        dataType: "json",
        type: "GET",
        data: {
            url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol="+s
        },
        success: function(data) {
            if($('.glyphicon-star').hasClass("favorite")) {
                //alert("removeing");
                $('.glyphicon-star').removeClass("favorite");
                $('.glyphicon-star').css("color", "");
                localStorage.removeItem(s);
                $('#'+s).remove();
            } 
            else {
                //$('#favorite_content').append("<table><tr><td>asda</td></tr></table>"); 
                $('.glyphicon-star').addClass("favorite");
                $('.glyphicon-star').css("color", "yellow");
                localStorage.setItem(s, s);
                //var length = data['d']['results'].length; 
                addFavorRow(data);
            }
        }
    });
}

$('#charts').on('shown.bs.tab', function(e) {
    $('#chartDemoContainer').highcharts().reflow();
});

function _fixDate(dateIn) {
    var dat = new Date(dateIn);
    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
}

function _getOHLC(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];
    if (elements[0]) {
        for (var i = 0;i< dates.length; i++) {
            var dat = _fixDate(dates[i]);
            var pointData = [
                dat,
                (elements[0].DataSeries['open'].values[i]),
                elements[0].DataSeries['high'].values[i],
                elements[0].DataSeries['low'].values[i],
                elements[0].DataSeries['close'].values[i],
            ];
            chartSeries.push(pointData);
        }
    }
    return chartSeries;
}

function _getVolume(json) {
    var dates = json.Dates || [];
    var elements = json.Elements || [];
    var chartSeries = [];
    if (elements[1]){
        for (var i = 0;i < dates.length; i++) {
            var dat = _fixDate( dates[i] );
            var pointData = [
                dat,
                elements[1].DataSeries['volume'].values[i]
            ];
            chartSeries.push( pointData );
        }
    }
    return chartSeries;
}

render = function(data,s) {
    var ohlc = this._getOHLC(data);
    $('#chartDemoContainer').highcharts('StockChart', {
        rangeSelector: {
            buttons : [{
                type : 'week',
                count : 1,
                text : '1w'
            }, {
                type : 'month',
                count : 1,
                text : '1m'
            }, {
                type : 'month',
                count : 3,
                text : '3m'
            }, {
                type : 'month',
                count : 6,
                text : '3m'
            }, {
                type : 'ytd',
                count : 1,
                text : 'YTD'
            }, {
                type : 'year',
                count : 1,
                text : '1y'
            }, {
                type : 'all',
                count : 1,
                text : 'All'
            }],
          selected: 0,
          // enabled: false
          inputEnabled : false
        },

        title: {
            text: s + ' Stock Value'
        },

        yAxis: [{
            title: {
                text: 'Stock Value'
            }
        }],
        series: [{
            type: 'area',
            name: s,
            data: ohlc,
            tooltip: {
                valueDecimals: 2
             },
            fillColor : {
                linearGradient : {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops : [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            threshold: null
        }],
    });
};








$('#goahead').click(function() {
  if (!$("#goahead").hasClass("disabled")) {
    $('#myCarousel').carousel('next');
  }
});

$('#goback').click(function() {
  $('#myCarousel').carousel('prev');
});
$('#myCarousel').carousel({ 
  interval: false,
  wrap: false
});
    
var time;
$('#toggle_refresh').change(function(){
    if($(this).prop('checked')) {
      time = setInterval(function(){ refresh() }, 5000);
    } 
    else {
      clearInterval(time);
    }
});

function refresh() {
    console.log("asdsa");
    for(var i = 0;i < localStorage.length;i++) {     
        var s = localStorage.getItem(localStorage.key(i));
        $.ajax({
            url: "hw8.php",
            dataType: "json",
            type: "GET",
            data: {
                url: "http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol="+s
            },
            success: function(data) {
                var price = Number(data['LastPrice']).toFixed(2);;
                var change = Number(data["Change"]).toFixed(2);
                var changePercent = Number(data["ChangePercent"]).toFixed(2);
                var color = changePercent > 0? 'green':'red';
                var img = changePercent > 0? 'http://cs-server.usc.edu:45678/hw/hw8/images/up.png':'http://cs-server.usc.edu:45678/hw/hw8/images/down.png';
                var Num = data["MarketCap"];
                var marketCap ='';
                if(Num > 1000000000) {
                    Num /= 1000000000;
                    marketCap += Number(Num).toFixed(2) + ' Billion';
                }
                else if(Num > 1000000) {
                    Num /= 1000000;
                    marketCap += Number(Num).toFixed(2) + ' Million';
                } 
                else {
                    marketCap += Number(Num).toFixed(2);
                }
                $('#'+data['Symbol'] +' td:nth-child(3)').text('$ '+price);
                $('#'+data['Symbol'] +' td:nth-child(4)').css('color', color);
                $('#'+data['Symbol'] +' td:nth-child(4) span').text(change+' ( '+changePercent+'% )');
                $('#'+data['Symbol'] +' td:nth-child(4) img').attr('src', img);
                $('#'+data['Symbol'] +' td:nth-child(5)').text('$ '+marketCap);
            }
        });
    }
}

$("#toggle").tooltip();
$("#refresh").tooltip();
$("#goback").tooltip();
$("#goahead").tooltip();

window.fbAsyncInit = function() {
    FB.init({
        appId      : '257647937906275',
        xfbml      : true,
        version    : 'v2.5'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function fb_feeds(obj) {
    FB.ui({
        method: 'feed',
        link: 'http://cs571hw8lz-env.us-west-2.elasticbeanstalk.com/',
        picture: 'http://chart.finance.yahoo.com/t?s='+$("#symbol").text()+'&lang=en-US&width=400&height=300',
        name: '“Current Stock Price of '+$("#name").text()+' is '+$("#price").text(),
        caption: 'Last Traded Price: '+$("#price").text()+',  CHANGE:'+$("#change").text(),
        description: 'Stock Information of '+$("#name").text()+' ('+$("#symbol").text()+')'
    }, function(response){
        if (response && !response.error_message) {
          ;
        } else {
          //alert('Did not finish post!');
        }
    });
}
