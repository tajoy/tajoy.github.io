+++
date = "2020-07-22T10:40:45+08:00"
category = "技术磨练"
tags = ["C", "static", "thread"]
series = "C语言的一些小技巧"
title = "C语言线程中的局部储存 - C语言的一些小技巧(3)"
description = "C语言的一些小技巧 线程中的局部储存"
keywords = [
    "c语言",
    "线程",
    "thread",
    "static",
    "c语言线程",
    "c语言thread",
    "c语言static",
    "c语言吧",
    "c语言从入门到放弃",
    "c语言macro",
]
+++

## 引子

整理一下关于C语言的各种技巧, 免得自己遗忘了. 
C语言的代码持有量一直稳居第一啊, [TIOBE 的 C 语言排行榜](https://www.tiobe.com/tiobe-index/c/)一直坚挺如初.

这篇文章通过一个个例子, 介绍一下关于C语言线程中的局部储存, 以此抛砖引玉.

欢迎大家指正、讨论.

<!-- more -->

## 例1: pthread 库提供的线程局部储存
```c

#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>


static pthread_rwlock_t lock;
static pthread_key_t key;
static pthread_t p1;
static pthread_t p2;


void SetThreadName(const char* name)
{
    if (0 != pthread_rwlock_wrlock(&lock)) {
        printf("pthread_rwlock_wrlock failed");
        exit(-1);
    }
    pthread_setspecific(key, name);
    if (0 != pthread_rwlock_unlock(&lock)) {
        printf("pthread_rwlock_unlock failed");
        exit(-1);
    }
}

void PrintThreadName()
{
    if (0 != pthread_rwlock_rdlock(&lock)) {
        printf("pthread_rwlock_rdlock failed");
        exit(-1);
    }
    printf("Thread[0x%XD] name: %s\n", (int)pthread_self(), (const char*)pthread_getspecific(key));
    if (0 != pthread_rwlock_unlock(&lock)) {
        printf("pthread_rwlock_unlock failed");
        exit(-1);
    }
}

void* ThreadMain(void* name)
{
    if (0 != pthread_key_create (&key, NULL)) {
        printf("pthread_key_create failed");
        exit(-1);
    }
    SetThreadName((const char*)name);
    PrintThreadName();
    return NULL;
}

int main(int argc, char const *argv[])
{
    pthread_rwlock_init(&lock, NULL);
    if (0 != pthread_create(&p1, NULL, &ThreadMain, "THREAD-1")) {
        printf("pthread_create failed");
        exit(-1);
    }
    if (0 != pthread_create(&p2, NULL, &ThreadMain, "THREAD-2")) {
        printf("pthread_create failed");
        exit(-1);
    }
    pthread_join(p1, NULL);
    pthread_join(p2, NULL);
    return 0;
}

```

`pthread_key_create`, `pthread_setspecific`, `pthread_getspecific` 提供了一个简单键值对储存功能, 值得注意的是需要进行锁保护.



## 例2: __thread 关键字

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <pthread.h>


static pthread_t p1;
static pthread_t p2;


static __thread char THREAD_NAME[128]  = {'\0'};
void SetThreadName(const char* name)
{
    strncpy(THREAD_NAME, name, sizeof THREAD_NAME);
}

void PrintThreadName()
{
    printf("Thread[0x%XD] name: %s\n", (int)pthread_self(), THREAD_NAME);
}

void* ThreadMain(void* name)
{
    SetThreadName((const char*)name);
    PrintThreadName();
    return NULL;
}

int main(int argc, char const *argv[])
{
    if (0 != pthread_create(&p1, NULL, &ThreadMain, "THREAD-1")) {
        printf("pthread_create failed");
        exit(-1);
    }
    if (0 != pthread_create(&p2, NULL, &ThreadMain, "THREAD-2")) {
        printf("pthread_create failed");
        exit(-1);
    }
    pthread_join(p1, NULL);
    pthread_join(p2, NULL);
    return 0;
}
```

`__thread`关键字是`GCC`提供的一个编译器功能, 相比较`pthread`提供的API, 运行更高效, 使用更便捷.

## 选择
如果编译器支持`__thread`关键字, 则使用之, 否则使用`pthread`提供的API.