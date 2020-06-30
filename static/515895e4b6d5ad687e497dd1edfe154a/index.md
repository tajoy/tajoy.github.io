+++
date = "2020-06-13T14:17:12+08:00"
category = "软件技巧"
tags = ["CLIP STUDIO PAINT", "绘画工具", "软件问题"]
title = "CSP的锁区问题"
description = ""
keywords = [
    "CSP",
    "CLIP STUDIO PAINT",
    "Mac",
    "锁区",
    "语言环境",
    "地区",
    "简体版",
    "繁体版",
    "Catalina10.15",
    "语言",
    "软件",
    "clipstudiopaint",
    "clipstudiopaint mac",
    "clipstudiopaint中文破解",
    "clipstudiopaint中文",
    "clipstudiopaint个人版",
    "clipstudiopaint使用",
    "clipstudiopaint破解",
    "clipstudiopaint改为中文版",
    "clip studio paint",
    "clip studio paint mac",
    "clip studio paint中文破解",
    "clip studio paint中文",
    "clip studio paint个人版",
    "clip studio paint使用",
    "clip studio paint破解",
    "clip studio paint改为中文版",
]
+++


## 引子

由于 CLIP STUDIO PAINT 的销售策略, 每个国家/地区的软件授权不通用, 软件有一些限制.

![CSP锁区限制](./Snipaste_2020-06-13_14-47-59.jpg)

而繁体版的比简体版的更便宜, 于是...

<!-- more -->

## CSP <= 1.9.1

16进制修改方法

Mac 下打开 CLIP STUDIO PAINT.app\Contents\MacOS\CLIP STUDIO PAINT
用16进制工具搜索 84C0751B488B35 ，替换为 84C0EB47488B35 。

>Mac下一款二进制编辑软件:
>
>[010 Editor](https://www.sweetscape.com/download/010editor/)


也可以使用下面的脚本试一下:

> :exclamation: **脚本未经测试** :exclamation:
>
> 我没有老版本, 所以该代码没有经过测试, 欢迎反馈

``` bash
temp=$(mktemp)
if [ ! -f '/Applications/CLIP STUDIO 1.5/App/CLIP STUDIO PAINT.app/Contents/MacOS/CLIP STUDIO PAINT.bak' ]; then
    cp '/Applications/CLIP STUDIO 1.5/App/CLIP STUDIO PAINT.app/Contents/MacOS/CLIP STUDIO PAINT' '/Applications/CLIP STUDIO 1.5/App/CLIP STUDIO PAINT.app/Contents/MacOS/CLIP STUDIO PAINT.bak'
fi;
cp '/Applications/CLIP STUDIO 1.5/App/CLIP STUDIO PAINT.app/Contents/MacOS/CLIP STUDIO PAINT' "$temp/bin"
xxd -p "$temp/bin" > "$temp/hex"
sed -i 's/84C0751B488B35/84C0EB47488B35/g' "$temp/hex"
xxd -p -r "$temp/hex" > '/Applications/CLIP STUDIO 1.5/App/CLIP STUDIO PAINT.app/Contents/MacOS/CLIP STUDIO PAINT'
```

## CSP >= 1.9.1, Mac OS < Catalina 10.15

可以通过 open 命令改变语言环境

``` bash
open -a /Applications/CLIP\ STUDIO\ 1.5/App/CLIP\ STUDIO\ PAINT.app --args -AppleLanguages '(zh-tw)'
```


## CSP >= 1.9.1, Mac OS >= Catalina 10.15

可以针对 App 设置语言环境

![针对App选择语言](./Snipaste_2020-06-13_14-11-12.jpg)
