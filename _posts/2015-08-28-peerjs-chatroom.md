---
layout: post
title:  "PeerJS Chatroom"
categories: js
date: 2015-08-28 17:37:00
permalink: /chatroom/
---

This chatroom uses [PeerJS] to establish WebRTC connection between users. All members of a room form a [star topology] around the room creator (first person that joins the room), who handles all communication between members. When the creator leaves the room, others try to recreate the room. Whoever successfully recreates the room becomes the new hub.

See [source].

<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="/javascripts/peer.min.js"></script>

<div>
  <input type="text" id="roomName"/><button id="createRoomButton">Join Room</button>
</div>
<div>
  Your Name: <input type="text" id="myname"/>
</div>
<table>
  <tr>
    <th>
      Members
    </th>
    <th>
      Message Log
    </th>
  </tr>
  <tr>
    <td style="vertical-align: top">
      <div id="members">
      </div>
    </td>
    <td>
      <div id="log"></div>
    </td>
  </tr>
</table>
<div>
  <input type="text" id="message"/><button id="sendButton" disabled>Send</button>
</div>

<script src="/javascripts/chatroom.js"></script>

[PeerJS]: https://github.com/peers/peerjs
[star topology]: https://en.wikipedia.org/wiki/Star_network
[source]: https://github.com/go717franciswang/peerjs-chatroom
