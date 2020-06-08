+++
date = "2016-08-05T15:40:45+08:00"
category = "技术磨练"
tags = ["C", "函数式编程", "lambda"]
series = "C语言的一些小技巧"
title = "C语言的lambda的探究 - C语言的一些小技巧(1)"
description = "C语言的一些小技巧 C语言环境下的lambda的探究"
+++

## 引子
最近在学习FP(函数式编程), 如 MapReduce, Rudex 等都是应用FP而来的.

FP对于分布式, 测试等等都有着天生的优势. 而我现在所在的公司的各种代码大部分都是由C写的.
而FP在实现上一般需要lambda的支持, 所以最近找了下C关于lambda方面的资料.

<!-- more -->

## C的lambda
网上找了以下, 第一搜索到这个:
[Lambda表达式（C语言）](http://www.cnblogs.com/Joke-Shi/p/5489293.html)

下面是该文章中提到的代码:
```c {4-5, 12}
#include <stdio.h>

/** 这里是我们定义的Lambda表达式的宏定义 */
#define cgs_lambda( return_type, function_body) \
       ({return_type cgs_lambda_func function_body cgs_lambda_func;})

/*************************** 测试Main **************************/

int main( int argc, const char **argv)
{
　　/* 我们做两个数相加的操作 */
　　printf( "Sum = %d\n", cgs_lambda( int, (int x, int y){ return x + y; })(3, 4) );
　　return 0;
}
```

然后我稍微优化了以下, 做了一些兼容.

值得一提的是, 这个宏只支持*gcc的编译器*, 或者是支持*c++11的c++编译器*, 也就是C++的11版.
```c++
#ifndef __LAMBDA__
#define __LAMBDA__

#ifdef __cplusplus
    // 定义lambda宏  
    #define lambda(return_type, func_parms, func_body)\
        ([&] -> return_type func_parms function_body)

#else

    #ifdef __GNUC__

        // 定义lambda宏  
        #define lambda(return_type, func_parms, func_body)\
        ({\  
                return_type $this func_parms func_body\
                $this;\  
        })

    #else
        #error "not support!"
    #endif //__GNUC__

#endif //__cplusplus

#define $ lambda

#endif // __LAMBDA__
```

下面是使用示例:
```c
#include <stdio.h>

#include "lambda.h"

typedef int (*Adder)(int, int);

int sum(int *arr, int length, Adder adder)
{
    int i = 0, sum = 0;
    for (i = 0; i < length; i++)
    {
        sum = adder(sum, arr[i]);
    }
    return sum;
}

int main(int argc, char const *argv[])
{
    int arr[] = { 1, 2, 3, 4, 5 };

    Adder adder = $(int, (int _a, int _b), {
        int c = _a + _b;
        return c;
    });

    int ret = sum(arr, sizeof(arr) / sizeof(int), adder);
    printf("sum of arr is %d\n", ret);
    return 0;
}
```

打印输出结果:

> sum of arr is 15


## 局限与注意事项

在lambda函数被其他地方调用的时候, 可以在lambda函数内捕获那些外部的变量

但是, 如果被捕获的外部变量如果超出作用域, 那将造成**程序崩溃**

所以, 更推荐只引用外部的静态/全局变量, 或者配合静态/全局变量 malloc/new 一个内存出来访问