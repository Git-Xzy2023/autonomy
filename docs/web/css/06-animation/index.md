---
title: 动画和过渡
---

# 动画和过渡

## Transition

```css
transition: all 0.3s ease;
transition: property duration timing-function delay;

transition-property: all;
transition-duration: 0.3s;
transition-timing-function: ease;
transition-timing-function: ease-in;
transition-timing-function: ease-out;
transition-timing-function: ease-in-out;
transition-timing-function: linear;
transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1);
transition-delay: 0s;
```

## Animation

```css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

animation: slideIn 0.5s ease;
animation: name duration timing-function delay iteration-count direction fill-mode play-state;

animation-name: slideIn;
animation-duration: 0.5s;
animation-timing-function: ease;
animation-delay: 0s;
animation-iteration-count: 1;
animation-iteration-count: infinite;
animation-direction: normal;
animation-direction: reverse;
animation-direction: alternate;
animation-direction: alternate-reverse;
animation-fill-mode: none;
animation-fill-mode: forwards;
animation-fill-mode: backwards;
animation-fill-mode: both;
animation-play-state: running;
animation-play-state: paused;
```

## Transform

```css
transform: translate(10px, 10px);
transform: translateX(10px);
transform: translateY(10px);

transform: rotate(45deg);
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);

transform: scale(1.5);
transform: scaleX(1.5);
transform: scaleY(1.5);

transform: skew(10deg, 10deg);
transform: skewX(10deg);
transform: skewY(10deg);

transform: matrix(1, 0, 0, 1, 0, 0);

transform-origin: center;
transform-origin: top left;
```
