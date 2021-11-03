var graficas = {
    plot: function (data, ticks, selector, color, label, xlabel, ylabel) {
        $.plot($(selector), [{
                data: data,
                label: label
            }
        ], {
            series: {
                lines: {
                    show: true,
                    lineWidth: 1.5,
                    fill: 0.05
                },
                points: {
                    show: true
                },
                shadowSize: 0
            },
            grid: {
                labelMargin: 10,
                hoverable: true,
                clickable: true,
                borderWidth: 0
            },
            colors: [color],
            xaxis: {
                tickColor: "transparent",
                ticks: ticks,
                tickDecimals: 0,
                autoscaleMargin: 0,
                font: {
                    color: '#8c8c8c',
                    size: 12
                },
                label: xlabel
            },
            yaxis: {
                ticks: 4,
                tickDecimals: 0,
                tickColor: "#e3e4e6",
                font: {
                    color: '#8c8c8c',
                    size: 12
                },
                label: ylabel,
                tickFormatter: function (val, axis) {
                    if (val > 999) {
                        return (val / 1000) + "K";
                    } else {
                        return val;
                    }
                }
            },
            legend: {
                labelBoxBorderColor: 'transparent',
                container: $('.' + selector.replace('.', '').replace('#', '') + '-legend')
            }
        });
        $(selector).bind("plothover", function (event, pos, item) {
            graficas.item(item, xlabel);
        });
        $(selector).bind("plotclick", function (event, pos, item) {
            graficas.item(item, xlabel);
        });

        var xaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
                .text(xlabel)
                .appendTo($(selector));
        var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
                .text(ylabel)
                .appendTo($(selector));
    },
    item: function (item, xlabel)
    {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                graficas.showTooltip(item.pageX, item.pageY,
                        xlabel + "=" + item.series.xaxis.ticks[item.datapoint[0] - 1].label + ", Total= " + main.number_format(y, 0));
            }
        } else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    },
    showTooltip: function (x, y, contents) {
        $("<div id='tooltip'>" + contents + "</div>").css({
            position: "absolute",
            display: "none",
            top: y + 5,
            left: x + 5,
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
};
