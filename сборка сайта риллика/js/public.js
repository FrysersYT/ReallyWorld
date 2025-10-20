var i =0; //moder
var app = {
    monitor_timeout: 10000,
    requests: 100,
    monitor: function () {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: 'server/statistic',
            dataType: 'json',
            type: 'GET',
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            data: {
            },
            error: function (data, textStatus, xhr) {
                if (typeof error != 'undefined') {
                    error(data, textStatus, xhr);
                } else {

                }
                $('#online, #slots').html('0');
                $('#progress').width('0');
                setTimeout(function () {
                    i++;
                    if(i < app.requests) {
                    app.monitor();
                    }
                }, app.monitor_timeout);
            },
            success: function (data) {
                var online = (!data.players) ? 0 : data.players;
                var slots = data.slots;
                $('#online').html(online);
                $('#slots').html(slots);
                var progress = (!slots) ? 0 : online / (slots / 100);
                $('#progress').width(progress.toFixed(4) + '%');
                setTimeout(function () {
                    i++;
                    if(i < app.requests) {
                        app.monitor();
                    }
                }, app.monitor_timeout);
            }
        });
    },

}
