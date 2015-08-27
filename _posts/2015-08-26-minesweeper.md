---
layout: post
title:  "Minesweeper"
categories: game
date: 2015-08-26 18:53:00
permalink: /minesweeper/
---

<meta name="google-signin-clientid" content="774995976932-0t5hbu1etidoukc57mmpvdiuidq4emb2.apps.googleusercontent.com" />
<meta name="google-signin-cookiepolicy" content="single_host_origin" />
<meta name="google-signin-callback" content="signinCallback" />
<meta name="google-signin-scope" content="https://www.googleapis.com/auth/games" />
<script src="/javascripts/minesweeper/signinCallback.js"></script>
<script src="https://apis.google.com/js/platform.js" async defer></script>
<script src="https://apis.google.com/js/client.js"></script>
<script src="/javascripts/minesweeper/jquery-2.1.4.min.js"></script>
<script src="/javascripts/minesweeper/jquery-gapi-game-leaderboard/jquery-gapi-game-leaderboard.js"></script>
<script src="/javascripts/minesweeper/phaser.min.js"></script>
<div id="googleSignIn">
Please sign in via Google+ to enable achievement and leaderboard function:<div id="signInButton" class="g-signin2" data-onsuccess="onSignIn"></div>
</div>
<div id="container" oncontextmenu="return false"></div>
<div id="leaderBoard"></div>
<script src="/javascripts/minesweeper/gapiEventManager.js"></script>
<script src="/javascripts/minesweeper/load.js"></script>
<script src="/javascripts/minesweeper/play.js"></script>
<script src="/javascripts/minesweeper/achievements.js"></script>
<script src="/javascripts/minesweeper/game.js"></script>

### Reference
* [Phaser] game framework
* [Google Play game service]
* [sourcecode]

[Phaser]: http://phaser.io/
[Google Play game service]: https://developers.google.com/games/services/web/api/
[sourcecode]: https://github.com/go717franciswang/phaser-ms
