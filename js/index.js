// 数据接口地址

var root = window.player;
var dataUrl = './mock/data.json'; 
// 作用域
var $scope = $(document.body);
// loading 浮层
// 这个浮层是因为在手机上查看的话文件夹在比较慢，所以先展示浮层提醒用户正在加载
// 样式和代码分别在index.html/index.css中有定义
// var $loadingLayer = $scope.find('.loading-layer');
var songListData,
    controller;

var audioPlayer = new root.AudioPlayer();

var render = root.render,
    processor = root.processor;

$scope.on('player:change', function (e, index) {
    var curData = songListData[index],
        status = audioPlayer.getPlayerStatus();

    render(curData);
    processor.render(curData.duration);
    audioPlayer.setAudioSource(curData.audio);

    if (status === 'play') {
        audioPlayer.play();
        processor.start(0);
    }
});

$scope.on('player:jump', function (e, percentage) {
    var index = controller.index;
    
    audioPlayer.jumpToPlay(songListData[index].duration * percentage);
    processor.start(percentage);
    $scope.find('.play-btn').addClass('playing');
});

$scope.on('player:end', function () {
    $scope.find('.next-btn').trigger('click');
});

// 绑定进度条touch事件
function addProcessEvent() {
    var $slidePoint = $scope.find('.slide-point'),
        offset = $scope.find('.pro-wrap').offset(),
        offsetX = offset.left,
        width = $scope.find('.pro-wrap').width();


    
    $slidePoint.on('touchstart', function () {
        // 在开始touch的时候取消掉设置进度条，将控制权交给 toouch 事件
        // cancelAnimationFrame(frameId);
        processor.stop();
    }).on('touchmove', function (e) {
        
        var x = e.changedTouches[0].clientX - offsetX,
            percentage = x / width;
     
        if (percentage > 1) {
            return false;
        }

        processor.update(percentage);
        return false;
    }).on('touchend', function (e) {
        var percentage = (e.changedTouches[0].clientX - offsetX) / width;

        $scope.trigger('player:jump', percentage);
    });
}

addProcessEvent();

function bindBtn() {
    $scope.on('click', '.play-btn', function () {
        audioPlayer.toggle();
        $(this).toggleClass('playing');
        if ($(this).hasClass('playing')) {
            processor.start();
        } else {
            processor.stop();
        }
    });
    $scope.on('click', '.prev-btn', function () {
        var index = controller.prev();
        $scope.trigger('player:change', index);
    });
    $scope.on('click', '.next-btn', function () {
        var index = controller.next();
        $scope.trigger('player:change', index);
    });
    // 播放列表先不做
    /*$scope.on('click', '.list-btn', function () {
        var index = controller.index;

        playList.show(index);
    });*/

    // 点赞按钮先不做
    /*$scope.on('click', '.like-btn', function () {
        var $this = $(this),
            index = controller.getIndex(),
            val = !$this.hasClass('liked');

        songListData[index].isLike = val;
        $this.toggleClass('liked');
    });*/
}

/***** 通过 ajax 取数据 *******/
var success = function (data) {
    songListData = data;

    // var initData = songListData[0];

    bindBtn();
    controller = new root.ControlManager(songListData.length);

    // 初始化页面
    $scope.trigger('player:change', 0)
    // render(initData);
    // processor.render(initData.duration);
    // 初始化播放列表
    // playList.init(songListData);
    // audioPlayer.init(initData.audio);
    // 初始化绑定事件

};

function getData(url, cb) {
    $.ajax({
        url: url,
        type: 'GET',
        success: cb,
        error: function () {
            alert('deal wrong');
        }
    });
}

getData(dataUrl, success);