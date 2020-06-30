+++
date = "2020-05-07T16:37:00+08:00"
category = "技术磨练"
tags = ["测试"]
title = "Markdown样式测试"
description = "Markdown样式测试"
showComments = false
tocMaxDepth = 2
+++

仅供测试
<!-- more -->

# h1 Heading h1 标题 :smile:
## h2 Heading h2 标题
### h3 Heading h3 标题
#### h4 Heading h4 标题
##### h5 Heading h5 标题
###### h6 Heading h6 标题


## Horizontal Rules

___

---

***


## Typographic replacements
Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

"智能标点,双引号" 和 '单引号'

## Emphasis 重点标注

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


**这是加粗的文字**

__这是加粗的文字__

*这是斜体文字*

_这是斜体文字_

~~这是带删除线的文字~~


## Blockquotes 引用段落


> Blockquotes can also be nested...
>
> 引用段落可以嵌套
>> ...by using additional greater-than signs right next to each other...
>>
>> ...通过使用更多的向右箭头来嵌套
> > > ...or with spaces between arrows.
> > >
> > > ...也可以在箭头之间加入空格



## Lists 列表

Unordered 无序列表

+ Create a list by starting a line with `+`, `-`, or `*`
+ 可以通过 `+`, `-`, 或 `*` 起行来创建列表
+ Sub-lists are made by indenting 2 spaces:
+ 子列表的话, 需要在前面缩进2个空格
  - Marker character change forces new list start:
  - 标记字符强制新的列表开始
    * Ac tristique libero volutpat at
    * 速度快两极分化的进口量佛手柑
    + Facilisis in pretium nisl aliquet
    + 士大夫供货商更换进口量
    - Nulla volutpat aliquam velit
    - 阿道夫高等师范供货商体育io
+ Very easy!
+ 非常简单

Ordered 有序列表

1. Lorem ipsum dolor sit amet
1. 士大夫更换士大夫如果
2. Consectetur adipiscing elit
2. 囖和巴拿马,编码, 塞尔特和你们, 和
3. Integer molestie lorem at massa
3. 富贵花愉快大法官是


1. You can use sequential numbers...
1. 你可以使用序列的字符
1. ...or keep all the numbers as `1.`
1. ...或者全部使用`1.`

Start numbering with offset:

通过位移起始数字开始:

57. foo
1. bar


## Code 代码

Inline `code`

内联代码 `code`

Indented code

缩进代码

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

```
Sample text here...
```

Syntax highlighting

``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Center aligned columns

| Option | Description |
|:------:|:-----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Profile](./profile.jpg)
![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"

## [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)


## [KaTeX](https://github.com/KaTeX/KaTeX) 数学公式


inline: $c = \pm\sqrt{a^2 + b^2}$

block:
$$
c = \pm\sqrt{a^2 + b^2}
$$


## [mermaid](https://mermaid-js.github.io/mermaid) 绘制图表

```mermaid
graph LR
install[安装插件]
install --> configure[配置插件]
configure --> draw[绘制超赞的图表]
```

## Footnotes

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.



## 第三方嵌入式链接


CodePen.io

https://codepen.io/tajoy/pen/OJyjJLy

Youtube

https://www.youtube.com/watch?v=IlETeUMBKQI

https://www.youtube.com/watch?v=Aog5J95m-vw

哔哩哔哩

https://www.bilibili.com/video/BV1QK411H7io/