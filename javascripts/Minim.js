function Minim() {
    this.loadSample = function(src) {
        return new AudioSample(src);
    };
};

function AudioSample(src) {
    this.src = '/resources/audio/' + src;
    this.trigger = function() {
        (new Audio(this.src)).play();
    };
};
