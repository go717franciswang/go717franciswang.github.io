(function( $ ) {
    $.fn.gapiGameLeaderBoard = function(gapi, options) {
        var _this = this;
        var settings = $.extend({
            collection: 'SOCIAL',
            timeSpan: 'DAILY',
            maxResult: 10,
            leaderboardId: null
        }, options);

        this.css({
            'text-align': 'center',
        });

        var title = $('<div><a href="#">Leaderboard</a></div>');
        var leaderboards = null;
        var $leaderboardsUI;
        var $scoreboardUI;

        title.on('click', function(e) {
            if (!leaderboards) {
                $leaderboardsUI = $('<div></div>');
                $leaderboardsUI.appendTo(_this);

                // https://developers.google.com/games/services/web/api/leaderboards
                var req = gapi.client.games.leaderboards.list({
                    maxResults: 5
                });

                req.execute(function(response) {
                    leaderboards = response.items;
                    var leaderboardNames = [];
                    $.each(response.items, function(i, leaderboard) {
                        if (i == 0 && settings.leaderboardId === null) {
                            settings.leaderboardId = leaderboard.id;
                        }

                        leaderboardNames.push(createSelection(leaderboard.name, { leaderboardId: leaderboard.id }));
                    });
                    createSelectionGroup(leaderboardNames).appendTo($leaderboardsUI);

                    var collections = [
                        createSelection('Friends', { collection: 'SOCIAL' }),
                        createSelection('Public', { collection: 'PUBLIC' }),
                    ];
                    createSelectionGroup(collections).appendTo($leaderboardsUI);

                    var timeSpans = [
                        createSelection('Daily', { timeSpan: 'DAILY' }),
                        createSelection('Weekly', { timeSpan: 'WEEKLY' }),
                        createSelection('All Time', { timeSpan: 'ALL_TIME' }),
                    ];
                    createSelectionGroup(timeSpans).appendTo($leaderboardsUI);

                    $scoreboardUI = $('<div></div>');
                    $scoreboardUI.appendTo($leaderboardsUI);
                    updateScoreBoard();
                });
            } else {
                updateScoreBoard();
            }

            e.preventDefault();
        });

        title.appendTo(this);

        var createSelection = function(name, options) {
            var $span = $('<span>'+name+'</span>');
            $span.css({ cursor: 'hand' });
            $.each(options, function(k, v) {
                if (settings[k] == v) {
                    $span.css({ 'font-weight': 'bold' });
                }
            });

            $span.click(function() {
                settings = $.extend(settings, options);
                updateScoreBoard();
                $span.siblings().css({ 'font-weight': 'normal' });
                $span.css({ 'font-weight': 'bold' });
            });
            return $span;
        };

        var createSelectionGroup = function(selections) {
            $group = $('<div></div>');
            selections[0].appendTo($group);
            for (var i = 1; i < selections.length; i++) {
                $group.append(' | ');
                selections[i].appendTo($group);
            }

            return $group;
        };

        var updateScoreBoard = function() {
            // https://developers.google.com/games/services/web/api/scores/list
            var req = gapi.client.games.scores.list({
                collection: settings.collection,
                leaderboardId: settings.leaderboardId,
                timeSpan: settings.timeSpan,
                maxResults: settings.maxResults,
            });

            req.execute(function(response) {
                $scoreboardUI.empty();

                var table = $('<table><tr>'
                              +'<th>Rank</th>'
                              +'<th>Player</th>'
                              +'<th>Score</th>'
                              +'<th>Date</th>'
                              +'</tr></table>');
                table.css({
                    'margin-left': 'auto',
                    'margin-right': 'auto',
                });
                table.appendTo($scoreboardUI);

                var createScoreRow = function(score) {
                    var rank = score.formattedScoreRank ? score.formattedScoreRank : 'Unranked';
                    var $row = $('<tr>'
                                +'<td>'+rank+'</td>'
                                +'<td>'+score.player.name.givenName+'</td>'
                                +'<td>'+score.formattedScore+'</td>'
                                +'<td>'+new Date(parseInt(score.writeTimestampMillis)).toLocaleString()+'</td>'
                                +'</tr>');
                    return $row;
                };

                var playerExistsPage = false;
                if (response.items) {
                    $.each(response.items, function(i, score) {
                        $row = createScoreRow(score);

                        if (score.scoreRank == response.playerScore.scoreRank) {
                            playerExistsPage = true;
                            $row.css({ 'font-weight': 'bold' });
                        }
                        $row.appendTo(table);
                    });
                }

                if (!playerExistsPage && response.playerScore) {
                    createScoreRow(response.playerScore).appendTo(table);
                }
            });
        };

        return this;
    };
} ( jQuery ));
