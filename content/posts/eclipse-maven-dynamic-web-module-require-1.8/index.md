+++
date = "2016-08-11T14:56:25+08:00"
category = "技术磨练"
tags = ["eclipse", "maven", "web", "java"]
title = """如何解决"Dynamic Web Module 3.1 requires Java 1.7 or newer"的问题"""
description = """如何解决"Dynamic Web Module 3.1 requires Java 1.7 or newer"的问题"""
+++

每次修改java的版本, 更新maven后又还原了.

最后苦寻发现, 在pom.xml内加入如下内容, 之后 `Alt+F5` 更新即可.
<!-- more -->

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
            </configuration>
        </plugin>
    </plugins>
</build>
```
