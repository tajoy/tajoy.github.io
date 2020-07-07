+++
date = "2020-07-07T13:41:45+08:00"
category = "技术磨练"
tags = ["C", "宏", "macro"]
series = "C语言的一些小技巧"
title = "C语言中宏相关的技巧 - C语言的一些小技巧(2)"
description = "C语言的一些小技巧 C语言中 Macro (宏定义)相关的技巧"
keywords = [
    "c语言",
    "函数式编程",
    "lambda",
    "c语言函数",
    "c语言指针",
    "c语言static",
    "c语言吧",
    "c语言从入门到放弃",
    "c语言macro",
    "c语言宏",
    "c语言宏定义",
    "c语言宏替换",
    "c语言宏技巧",
]
+++

## 引子

整理一下关于C语言的各种技巧, 免得自己遗忘了. 
C语言的代码持有量一直稳居第一啊, [TIOBE 的 C 语言排行榜](https://www.tiobe.com/tiobe-index/c/)一直坚挺如初.

这篇文章通过一个个例子, 介绍一下关于 Macro 的各种奇淫巧技, 以此抛砖引玉.

包含多行, 括号有无, 特殊宏, 等等.

欢迎大家指正、讨论.

<!-- more -->


## 例1: 多行, 括号, 字符串连接

废话不多, 代码下锅.

<!--
```c
#include <stdio.h>
#include <stdlib.h>

#define ASSERT(cond, msg) if (!(cond)) { \
    printf("ASSERT FAIL: %s\n", "" # msg); \
    exit(-1); \
}

// 这里和下面的宏定义根据引用时是否使用括号有不同含义
#define FAILED(msg) printf("FAILED: %s\n", "" # msg)

static char * FAILED = "nothing";

int main(int argc, char const *argv[])
{
    FAILED; // 引用的静态变量, 常量语句, 无任何效果, 这里将不会打印.
    FAILED(something error);
    ASSERT(1 + 1 == 2, 1 + 1 must equal 2);
    ASSERT(1 + 2 == 2, 1 + 2 must not equal 2);
    return 0;
}
```
-->

<iframe src="https://tool.lu/coderunner/embed/9gG.html" width="650" height="550" frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>


这里 `ASSERT` 被定义为一个断言函数, 实现了判断某些条件必须为真, 否则就报出指定的错误并退出程序.

### 宏替换与宏函数

可以看到 `FAILED` 因引用的方式不一致(*是否添加括号*), 导致结果的不同.

所以, 如果是被定义为宏函数(*宏名后添加括号*)的宏的话, 必须添加括号的方式来引用. **哪怕没有宏参数的定义也是一样的.**

### 多行宏定义

宏定义的每一行末接 `\` 的话, 下一行开头也为该宏的定义.

### 宏名后的括号与参数

宏定义带括号又叫宏函数, 顾名思义是函数的一种, 所以有参数.

但是宏的参数, 只是简单的替换, 所以有时需要加上括号规避一些优先级问题. 

### 字符串连接

宏定义的被替换部分可以用宏的参数接上其他字面量字符串(使用 `#` 符号连接), 这样就会把参数的原始指作为字符串连接上去.

例如:

<!-- 
```c
#include <stdio.h>

// 定义如下
#define M1(t) ("MMM" # t)
#define M2(t) ("" # t  "MMM")
#define M3(t) ("MMM" # t  "MMM")

int main(int argc, char const *argv[])
{
    printf("%s\n", M1(XXX));
    // 输出: MMMXXX

    printf("%s\n", M2(XXX));
    // 输出: XXXMMM

    printf("%s\n", M3(XXX));
    // 输出: MMMXXXMMM

    printf("%s\n", M3("XXX"));
    // 输出: MMM"XXX"MMM
    return 0;
}

```
-->
<iframe src="https://tool.lu/coderunner/embed/9gH.html" width="650" height="550" frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>

注意: 这段代码里, 用了两个字面量字符串相连的技巧. 另外就是 `#` 之后必须是宏参数, 而不能是其他.

## 例2: 常用写法, 特殊内置宏

<!-- 
```c
#include <stdio.h>
#include <stdlib.h>

// 如果需要宏定义中执行多条语句, 可以这样写
#define MULTI_CODE do { \
    printf("%s", "line 1\n"); \
    printf("%s", "line 2\n"); \
    printf("%s", "line 3\n"); \
    printf("%s", "line 4\n"); \
} while(0)

// 这里引用预定义的内置宏获取更多信息
#define LOG(msg) do { \
    printf("INFO %s:%s():%d \n>\t%s\n", __FILE__, __func__, __LINE__, (msg)); \
} while(0)

void some_func() {
    LOG("did something");
}

int main(int argc, char const *argv[])
{
    MULTI_CODE; // do while 语句需要分号";", 所以这里加入分号, 这样看起来更像一条普通语句
    LOG("started");
    some_func();
    return 0;
}
```
 -->
<iframe src="https://tool.lu/coderunner/embed/9gI.html" width="650" height="550" frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>

`__FILE__`, `__func__`, `__LINE__` 都是编译器内置预定义的宏, 分别被替换为当前语句的源文件名, 执行中的函数名和文件行数.

更多的内置宏定义可以参考: [Predefined-Macros](https://gcc.gnu.org/onlinedocs/cpp/Predefined-Macros.html)

## 可变参数的宏函数

<!-- 
```c
#include <stdio.h>
#include <stdlib.h>


// 这里引用预定义的内置宏获取更多信息
#define DEBUG(...) do { \
    printf("DEBUG %s:%s():%d \n>\t", __FILE__, __func__, __LINE__); \
    printf(__VA_ARGS__); \
    printf("\n"); \
} while(0)

static int count = 0;
void count_it() {
    count++;
    DEBUG("count: %d", count);
}

int main(int argc, char const *argv[])
{
    DEBUG("started");
    count_it();
    count_it();
    count_it();
    count_it();
    DEBUG("end");
    return 0;
}
```
 -->
<iframe src="https://tool.lu/coderunner/embed/9gJ.html" width="650" height="550" frameborder="0" mozallowfullscreen webkitallowfullscreen allowfullscreen></iframe>

## 常用的关于宏的编译器参数

### gcc

- 定义宏: `-D <macro>=<value>`, 如果 `value` 被忽略的话, 将被定义为1
- 宏展开: `-E`, 例如: `gcc -E foo.c`, 这将打印出文件被展开所有宏之后的内容, 方便调试复杂的宏是怎么暂开的


### msvc cl

- 定义宏: `/D<macro> <value>` 或 `/D <macro>=<value>`, 例如: `CL /DDEBUG TEST.C` 或 `CL /D __far= TEST.C`
- 宏展开: `/P`, 例如: `CL /P /C ADD.C`

