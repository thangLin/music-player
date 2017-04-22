(function (root) {
    'use strict';

    var $scope = $(document.body),
        curData;

    // 渲染歌曲信息
    function renderInfo(info) {
        var html = '<h1 class="song-name">' + info.song + '</h1>' +
            '<h3 class="singer-name">' + info.singer + '</h3>' +
            '<h3 class="album-name">' + info.album + '</h3>';

        $scope.find('.song-info').html(html);
    }

    function renderPage(data) {
        curData = data;
        // 设置图片
        setImageBg(curData.image);
        // 设置歌曲信息
        renderInfo(curData);
        // 设置专辑图片和背景模糊图
        // 渲染like按钮
        setLikeBtn(curData.isLike);
    }

    // 设置背景模糊图
    function setImageBg(src) {
        var image = new Image();

        image.onload = function () {
            // 设计专辑图片
            $scope.find('.song-img img').attr('src', src);
            // 设置模糊背景
            root.blurImg(this, $scope.find('.content-wrap'));
        };

        image.src = src;
    }

    function setLikeBtn(status) {
        if (status) {
            $scope.find('.like-btn').addClass('liked');
        } else {
            $scope.find('.like-btn').removeClass('liked');
        }
    }

    root.render = renderPage;

})(window.player || (window.player = {}));