---
layout: post
title:  "Coursera, The Journey of Mathematics: Chaos Game"
date:   2014-01-29 22:34:11
categories: Mathematics
---

Rules of this game:
-------------------
1. move toward SE by 2 cm
2. move toward the center by 25%

Randomize between rule 1 and 2 and plot it on HTML canvas. (The following JS implementation took rules from wikipedia instead of the lecture.)

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="/javascripts/main.js"></script>
<div>
    <button id="start">Start</button>
    Iterations count: <span id="iterations">0</span>
</div>
<canvas id="c1" height="700" width="500">
</canvas>

References:
-----------------
* Coursera [lecture]
* Wikipedia on [Barnsley fern]
* Clojurescript [implementation]

[lecture]: https://class.coursera.org/sjtuma153-001/lecture/89
[Barnsley fern]: http://en.wikipedia.org/wiki/Barnsley_fern
[implementation]: https://github.com/go717franciswang/shiny-bear/blob/master/src-cljs/game_of_chaos/core.cljs
