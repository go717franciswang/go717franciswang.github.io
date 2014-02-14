---
layout: post
title:  "Coursera, The Journey of Mathematics: Chaos Game"
date:   2014-01-29 22:34:11
categories: 
- Mathematics
- Clojure
---

Rules of this game:
-------------------
1. move toward SE by 2 cm
2. move toward the center by 25%

Randomize between rule 1 and 2 and plot it on HTML canvas. (The following JS implementation took rules from wikipedia instead of the lecture.)

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="/javascripts/chaos-game.js"></script>

<div>
  <table>
    <tbody><tr>
      <th><i>w</i></th>
      <th>a</th>
      <th>b</th>
      <th>c</th>
      <th>d</th>
      <th>e</th>
      <th>f</th>
      <th>p</th>
    </tr>
    <tr>
      <td><i>f</i><sub>1</sub></td>
      <td><input type="text" id="a0" value="0" size="2"></td>
      <td><input type="text" id="b0" value="0" size="2"></td>
      <td><input type="text" id="c0" value="0" size="2"></td>
      <td><input type="text" id="d0" value="0.16" size="2"></td>
      <td><input type="text" id="e0" value="0" size="2"></td>
      <td><input type="text" id="f0" value="0" size="2"></td>
      <td><input type="text" id="p0" value="0.01" size="2"></td>
    </tr>
    <tr>
      <td><i>f</i><sub>2</sub></td>
      <td><input type="text" id="a1" value="0.85" size="2"></td>
      <td><input type="text" id="b1" value="0.04" size="2"></td>
      <td><input type="text" id="c1" value="-0.04" size="2"></td>
      <td><input type="text" id="d1" value="0.85" size="2"></td>
      <td><input type="text" id="e1" value="0" size="2"></td>
      <td><input type="text" id="f1" value="1.6" size="2"></td>
      <td><input type="text" id="p1" value="0.85" size="2"></td>
    </tr>
    <tr>
      <td><i>f</i><sub>3</sub></td>
      <td><input type="text" id="a2" value="0.2" size="2"></td>
      <td><input type="text" id="b2" value="-0.26" size="2"></td>
      <td><input type="text" id="c2" value="0.23" size="2"></td>
      <td><input type="text" id="d2" value="0.22" size="2"></td>
      <td><input type="text" id="e2" value="0" size="2"></td>
      <td><input type="text" id="f2" value="1.6" size="2"></td>
      <td><input type="text" id="p2" value="0.07" size="2"></td>
    </tr>
    <tr>
      <td><i>f</i><sub>4</sub></td>
      <td><input type="text" id="a3" value="-0.15" size="2"></td>
      <td><input type="text" id="b3" value="0.28" size="2"></td>
      <td><input type="text" id="c3" value="0.26" size="2"></td>
      <td><input type="text" id="d3" value="0.24" size="2"></td>
      <td><input type="text" id="e3" value="0" size="2"></td>
      <td><input type="text" id="f3" value="0.44" size="2"></td>
      <td><input type="text" id="p3" value="0.07" size="2"></td>
    </tr>
  </tbody></table>
</div>
<div>
  <button id="start">Start</button>
  Iterations count: <span id="iterations">0</span>
  <button id="clear">Clear</button>
</div>

<canvas id="canvas" width="550" height="800">
</canvas>

References:
-----------------
* Coursera [lecture]
* Wikipedia on [Barnsley fern]
* Clojurescript [implementation]

[lecture]: https://class.coursera.org/sjtuma153-001/lecture/89
[Barnsley fern]: http://en.wikipedia.org/wiki/Barnsley_fern
[implementation]: https://github.com/go717franciswang/shiny-bear/blob/master/src-cljs/game_of_chaos/core.cljs
