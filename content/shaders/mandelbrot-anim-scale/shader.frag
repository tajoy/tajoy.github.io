/***
title = "曼德博(mandelbrot) - 动态放大"
description = "这是一个动态放大中的曼德博(mandelbrot)图案, 这是被精度限制的有限放大, shader里不好实现BigFloat, 所以我暂时没法实现无限放大"
date = "2020-07-02T02:05:00+08:00"
***/
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
const int max_iterations=2048;
vec2 complex_square(vec2 v){
    return vec2(
        v.x*v.x-v.y*v.y,
        v.x*v.y*2.
    );
}
const float PI = 3.1415926;
void main()
{
    float duration=10.;
    float x=.5*PI*u_time/duration;
    float z=0.;
    for(int i=0;i<10;i++){ // 三角波函数
        z+=(1.+mod(float(i)*2.,2.)-mod(float(i)*2.,4.))*sin((2.*float(i)+1.)*x)/((2.*float(i)+1.)*(2.*float(i)+1.));
    }
    float t=duration*0.8+0.6*duration*z; // 调整三角波周期和振幅
    float zoom=pow(t,clamp(log2(t),2.,10.)); // 放大速率函数
    float scale=8./(50.*(pow(1.45,log(zoom*5.)))); // 像素颜色缩放
    float dZoom=min(u_resolution.x,u_resolution.y)*zoom/3.5;
    vec2 uv=(gl_FragCoord.xy-u_resolution.xy*.5)/dZoom+vec2(-1.40458,.00023); //放大的相对座标点
    vec2 c=uv;
    vec2 v=vec2(0.);
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