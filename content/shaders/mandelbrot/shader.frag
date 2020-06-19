/***
title = "mandelbrot"
description = "这是一个mandelbrot图案"
date = "2020-06-17T05:39:00+08:00"
***/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
const int max_iterations=255;
vec2 complex_square(vec2 v){
    return vec2(
        v.x*v.x-v.y*v.y,
        v.x*v.y*2.
    );
}
void main()
{
    vec2 uv=gl_FragCoord.xy-vec2(u_resolution.x,u_resolution.y)*.5;
    uv*=2.5/min(u_resolution.x,u_resolution.y);
    vec2 c=uv;
    vec2 v=vec2(0.);
    float scale=.06;
    int count=max_iterations;
    for(int i=0;i<max_iterations;i++){
        v=c+complex_square(v);
        if(dot(v,v)>4.){
            count=i;
            break;
        }
    }
    gl_FragColor=vec4(float(count)*scale);
}