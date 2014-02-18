---
layout: post
title:  "Explore C2"
categories: Clojure
---

Partial demo of basic functionalities of C2

## c2.util
### pretty-print
```clj
(pp {:a 150 :b 300})
;; {:a 150, :b [:c :d]}
```

### bind!
```clj
(bind! "#mydiv" [:div#mydiv "test"])
```
```html
<div id="mydiv"><div>test</div></div>
```

### bind! and unify
```clj
(bind! "#mydiv" [:div#mydiv (c2/unify ["test"] (fn [v] [:div v]))])
```
```html
<div id="mydiv"><div>test</div></div>
```

### bind! and unify an atom
```clj
(let [data (atom [0])
      random-update (fn []
                      (let [r (rand)]
                        (p (str r))
                        (swap! data assoc 0 r)))
      ]
  (bind! "#mydiv" [:div#mydiv (c2/unify @data (fn [v] [:div v]))])
  (interval 1000 (random-update)))
```

## c2.svg

### define a coordinate
```clj
(def coordinate
  {:x 100 :y 200})
;; {:x 100, :y 200}
```

### ->xy
```clj
(pp (svg/->xy coordinate))
;; [100 200]
(pp (svg/->xy [100 200]))
;; [100 200]
```

### translate
```clj
(pp (svg/translate coordinate))
;; "translate(100,200)"
```

### scale
```clj
(pp (svg/scale coordinate))
;; "scale(100,200)"
```

### rotate
```clj
(pp (svg/rotate coordinate))
;; "rotate({:x 100, :y 200},0,0)"
```

### get-bounds
```html
<svg id="s1"></svg>
```
```clj
(pp (svg/get-bounds (.getElementById js/document "s1")))
;; {:x 0, :y 0, :width 0, :height 0}
```

### circle
```clj
(pp (svg/circle [50 50] 10))
;; "M60,50A60,60 0 1,1-60,50A60,60 0 1,160,50"
```
<svg width="100" height="100">
<path d="M60,50A60,60 0 1,1-60,50A60,60 0 1,160,50" />
</svg>

### arc
```clj
(pp (svg/arc))
;; "M1,0A1,1 0 1,1 -1,1.2246063538223773e-16L0,0Z"
```
<svg width="100" height="100">
<path d="M1,0A1,1 0 1,1 -1,1.2246063538223773e-16L0,0Z" />
</svg>
