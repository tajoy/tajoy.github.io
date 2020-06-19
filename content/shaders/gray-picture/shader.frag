/***
title = "灰度化"
description = "将一个图片灰度化后显示"
date = "2020-06-17T05:39:00+08:00"
***/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D pic;// ./profile.jpg

float p(float n1,float n2,float th){
    return n1+(n2-n1)*th;
}

vec4 slide(vec4 c1,vec4 c2,float th){
    return vec4(
        p(c1.r,c2.r,th),
        p(c1.g,c2.g,th),
        p(c1.b,c2.b,th),
        p(c1.a,c2.a,th)
    );
}

void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec4 c=texture2D(pic,st);
    vec4 avg=vec4((c.r+c.g+c.b+c.a)/3.5);
    gl_FragColor=slide(c,avg,abs(sin(u_time)));
}