
//获取所有点的坐标
var points = [
    new BMap.Point(114.00100, 22.550000), new BMap.Point(124.00130, 22.550000),
    new BMap.Point(124.00160, 25.550000), new BMap.Point(114.00200, 22.550000),
    new BMap.Point(114.00300, 22.550500), new BMap.Point(134.00400, 22.550000),
    new BMap.Point(114.00500, 24.550000), new BMap.Point(114.00505, 22.549800),
    new BMap.Point(114.00510, 22.550000), new BMap.Point(144.00515, 22.550000),
    new BMap.Point(114.00525, 23.550400), new BMap.Point(114.00537, 22.549500)
];

var map;   //百度地图对象
var car;   //汽车图标
var label; //信息标签
var centerPoint;

var timer;     //定时器
var index = 0; //记录播放到第几个point

var followChk, playBtn, pauseBtn, resetBtn; //几个控制按钮

function init() {
    followChk = document.getElementById("follow");
    playBtn = document.getElementById("play");
    pauseBtn = document.getElementById("pause");
    resetBtn = document.getElementById("reset");

    //初始化地图,选取第一个点为起始点
    map = new BMap.Map("container");
    map.centerAndZoom(points[0], 15);
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl({isOpen: true}));

    //通过DrivingRoute获取一条路线的point
    var driving = new BMap.DrivingRoute(map);
    driving.search(new BMap.Point(114.00100, 22.550000), new BMap.Point(113.95100, 22.550000));
    driving.setSearchCompleteCallback(function() {
        //得到路线上的所有point
        points = driving.getResults().getPlan(0).getRoute(0).getPath();
        //画面移动到起点和终点的中间
        centerPoint = new BMap.Point((points[0].lng + points[points.length - 1].lng) / 2, (points[0].lat + points[points.length - 1].lat) / 2);
        map.panTo(centerPoint);
        //连接所有点
        map.addOverlay(new BMap.Polyline(points, {strokeColor: "black", strokeWeight: 5, strokeOpacity: 1}));

        //显示小车子
        label = new BMap.Label("", {offset: new BMap.Size(-20, -20)});
        car = new BMap.Marker(points[0]);
        car.setLabel(label);
        map.addOverlay(car);

        //点亮操作按钮
        playBtn.disabled = false;
        resetBtn.disabled = false;
    });
}

function play() {
    playBtn.disabled = true;
    pauseBtn.disabled = false;

    var point = points[index];
    if(index > 0) {
        map.addOverlay(new BMap.Polyline([points[index - 1], point], {strokeColor: "red", strokeWeight: 1, strokeOpacity: 1}));
    }
    label.setContent("经度: " + point.lng + "</br>纬度: " + point.lat);
    car.setPosition(point);
    index++;
    if(followChk.checked) {
        map.panTo(point);
    }
    if(index < points.length) {
        timer = window.setTimeout("play(" + index + ")", 200);
    } else {
        playBtn.disabled = true;
        pauseBtn.disabled = true;
        map.panTo(point);
    }
}

function pause() {
    playBtn.disabled = false;
    pauseBtn.disabled = true;

    if(timer) {
        window.clearTimeout(timer);
    }
}

function reset() {
    followChk.checked = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;

    if(timer) {
        window.clearTimeout(timer);
    }
    index = 0;
    car.setPosition(points[0]);
    map.panTo(centerPoint);
}