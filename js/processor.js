(function (root) {
    'use strict';

    var frameId,
        curDuration,
        $scope = $(document.body),
        startTime,
        lastPercentage = 0;

    // 格式化 时间
    function formatTime(during) {
        var minute = Math.floor(during / 60),
            second = during - minute * 60;

        // 确保是两位
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }

        return minute + ':' + second;
    }

    function getTranslOffset(percentage) {
        var val = (percentage - 1) * 100;

        return val + '%';
    }

    // 设置进度条translate
    function setProcess(percentage) {
        var transOffset = getTranslOffset(percentage);

        $scope.find('.pro-top').css({
            transform: 'translateX(' + transOffset + ')',
            '-webkit-transform': 'translateX(' + transOffset + ')'
        });
    }

    // 根据百分比设置当前时间
    function setCurTime(percentage) {
        var curTime = percentage * curDuration,
            timeFormated = formatTime(Math.round(curTime));

        $scope.find('.cur-time').text(timeFormated);
    }

    // 设置播放时进度条
    function startProcess() {
        startTime = new Date().getTime();
        cancelAnimationFrame(frameId);

        var frame = function () {
            var curTime = new Date().getTime(),
                passed = (curTime - startTime) / (curDuration * 1000),
                percentage = lastPercentage + passed;

            if (percentage <= 1 || percentage >= 0) {
                update(percentage);
                frameId = requestAnimationFrame(frame);
            } else {
                update(1);
                cancelAnimationFrame(frameId);
            }
        };
        frame();
    }

    function update(percentage) {
        setProcess(percentage);
        setCurTime(percentage);
    }

    function stop() {
        var time = new Date().getTime();

        lastPercentage += (time - startTime) / (curDuration * 1000);
        cancelAnimationFrame(frameId);
    }

    root.processor = {
        render: function (duration) {
            curDuration = duration;
            lastPercentage = 0;
            update(0);
            // 渲染总时间
            // startProcess();
            $scope.find('.all-time').text(formatTime(Math.round(curDuration)));
        },
        start: function (percentage) {
            lastPercentage = percentage ? percentage : lastPercentage;
            startProcess();
        },
        update: update,
        stop: stop
    };

})(window.player || (window.player = {}));