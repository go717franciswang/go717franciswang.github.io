var GapiEventManager = function(gapi, options) {
    this._gapi = gapi;
    this._intervalMS = options.intervalMS;
    this._eventNameToId = options.eventNameToId;
    this.resetEventData();
    var _this = this;
    setInterval(function() { _this.send() }, this._intervalMS);
};

GapiEventManager.prototype.resetEventData = function() {
    this._eventData = {};
    this._lastSentTimestamp = (new Date()).getTime();
    this._hasNewData = false;
    for (var k in this._eventNameToId) {
        this._eventData[k] = 0;
    }
};

GapiEventManager.prototype.increment = function(eventName) {
    this._eventData[eventName]++;
    this._hasNewData = true;
};

GapiEventManager.prototype.send = function() {
    if (!this._hasNewData) return;
    if (!this._gapi) return;

    var _this = this;
    var updates = [];

    for (var k in this._eventNameToId) {
        if (this._eventData[k] > 0) {
            updates.push({
                kind: "games#eventUpdateRequest",
                definitionId: this._eventNameToId[k],
                updateCount: this._eventData[k],
            });
        }
    }

    var payload = {
        kind: "games#eventRecordRequest",
        requestId: Math.round(Math.random()*1e10),
        currentTimeMillis: (new Date()).getTime(),
        timePeriods: [{
            kind: "games#eventPeriodUpdate",
            timePeriod: {
                kind: "games#eventPeriodRange",
                periodStartMillis: this._lastSentTimestamp,
                periodEndMillis: (new Date()).getTime()
            },
            updates: updates
        }]
    };
    var request = this._gapi.client.games.events.record(payload);

    request.execute(function(response) {
        console.log(response);
    });

    this.resetEventData();
};
