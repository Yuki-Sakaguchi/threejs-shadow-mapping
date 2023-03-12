import{G as p,S as v,P as h,W as g,O as y,B as P,a as x,M}from"./vendor.62cf0f4d.js";const S=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function w(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=w(e);fetch(e.href,t)}};S();var b=`void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;
}`,L=`uniform float uTick;

void main() {
  vec3 color = vec3((sin(uTick) + 1.0)/2.0, 0.0, (cos(uTick) + 1.0)/2.0);
  gl_FragColor = vec4(color, 1.0);
}`;let O=new p,r={scale:1};O.add(r,"scale",1,4).onChange(()=>{s.scale.set(r.scale,r.scale,r.scale)});const d={uTick:{type:"f",value:0}};let u=new v,i=new h(75,window.innerWidth/window.innerHeight,.1,1e3);i.position.z=5;let o=new g;o.setSize(window.innerWidth,window.innerHeight);document.body.appendChild(o.domElement);const k=new y(i,o.domElement);k.update();let z=new P(1,1,1);const C=new x({uniforms:d,vertexShader:b,fragmentShader:L});let s=new M(z,C);u.add(s);let m=()=>{requestAnimationFrame(m),d.uTick.value+=.01,s.rotation.x+=.01,s.rotation.y+=.01,o.render(u,i)};m();let f=()=>{const a=window.innerWidth,n=window.innerHeight;o.setPixelRatio(window.devicePixelRatio),o.setSize(a,n),i.aspect=a/n,i.updateProjectionMatrix()};window.addEventListener("resize",f);f();
