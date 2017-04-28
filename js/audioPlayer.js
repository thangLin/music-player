(function (root) {
    
    'use strict';

    var $scope = $(document.body);

    var AudioPlayer = function () {
        // audio对象
        this.audio = new Audio();
        // autoplay
        this.status = 'pause';
        this.bindAudioEvent();
    };

    AudioPlayer.prototype = {
        // audio 对象的各种事件
        bindAudioEvent: function () {
            var _this = this;

            $(this.audio).on('ended', function () {
                $scope.trigger('player:end');
            }).on('canplaythrough', function () {
                $scope.trigger('audioLoaded');
                if (_this.status === 'play') {
                    _this.play();
                } else if (_this.status === 'pause') {
                    _this.pause();
                } else {
                    throw Error('AudioPlayer status is not right !');
                }
            });
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        play: function () {
            this.audio.play();
            this.status = 'play';
            $('.song-img .img-wrap').addClass('movepic');
            $('.song-img .img-wrap').css('animation-play-state','running');
        },
        // 设置 Audio
        setAudioSource: function (src) {
            var audio = this.audio;

            audio.src = src;
            audio.load();
        },
        // 跳转播放
        jumpToPlay: function (time) {
            this.audio.currentTime = time;
            // this.audio.currentTime = percent * this.audio.duration;
            // 避免在暂停状态下拖拽导致不播放
            this.play();
        },
        toggle: function () {
            if (this.status === 'play') {
                this.pause();
            } else {
                this.play();
            }
        },
        // 获取当前播放状态
        getPlayerStatus: function () {
            return this.status;
        },
        init: function (src) {
            this.setAudioSource(src);
            this.bindAudioEvent();
        }
    };

    root.AudioPlayer = AudioPlayer;

})(window.player || (window.player = {}));