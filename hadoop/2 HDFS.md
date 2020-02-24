# HDFS

## 简述

​	HDFS（Hadoop Distributed File System），作为Google File System（GFS）的实现，是Hadoop项目的核心子项目，是分布式计算中数据存储管理的基础，是基于流数据模式访问和处理超大文件的需求而开发的，可以运行于廉价的商用服务器上。它所具有的高容错、高可靠性、高可扩展性、高获得性、高吞吐率等特征为海量数据提供了不怕故障的存储，为超大数据集（Large Data Set）的应用处理带来了很多便利。

## 适用性

HDFS特点：

1. **适合一次写入，多次读出的场景，且不支持文件的修改**
2. 适合用来做数据分析
3. 高容错性、可构建在廉价机器上
4. 适合批处理
5. 适合大数据处理
6. 流式文件访问

HDFS局限：

1. 不支持低延迟访问
2. 不适合小文件存储
3. 不支持并发写入
4. 不支持修改
5. 不适合用来做网盘应用

## hfds特性

### 优点

1. 高容错性

   - 数据自动保存多个副本，它通过增加副本的形式，提高容错性

     ![](img/\副本1.png)

   - 某一个副本丢失以后，可以自动回复

     ![](img/\副本2.png)

2. 适合处理大数据

   - 数据规模：能处理数据规模达到GB、TB、甚至PB级别
   - 文件规模：能够处理百万规模以上的文件数量。

3. **可构建在廉价机器上**，通过多副本机制，提高可靠性。

### 缺点

1. **不适合低延时数据访问**，比如毫秒级的存储数据，是做不到的。
2. **无法高校的对大量小文件进行存储**
   - 存储大量小文件的化，会占用NameNode大量的内存来存储文件目录和块信息，不可取。
   - 小文件存储的寻址时间会超过读写时间，它违反了HDFS的设计目标。
3. 不支持并发写入、文件随机修改。
   - 一个文件只能有一个写，不允许多个线程同时写。
   - **仅支持数据append（追加）**，不支持文件的随机修改。

## HDFS架构

>参考：
>
>https://www.jianshu.com/p/f1e785fffd4d
>
>https://blog.csdn.net/xiangxizhishi/article/details/76100513

![](img/\hdfs架构1.png)

![](img/\hdfs架构2.png)

**Client：**就是客户端。

1. 提供一些命令来管理、访问 HDFS，比如启动或者关闭HDFS，对数剧的增删改查，对NameNode的格式haul等。

2. 与 DataNode 交互，读取或者写入数据；读取时，要与 NameNode 交互，获取文件的位置信息；写入 HDFS 的时候，Client 将文件切分成 一个一个的Block，然后进行存储。

**NameNode：**即Master，管理整个HDFS集群

1. 管理 HDFS 的名称空间（名称空间是指分布式文件系统中各个文件块之间的关系，文件的目录树等信息）。
2. 管理数据块（Block）映射信息

3. 配置副本策略

4. 处理客户端读写请求。

**DataNode：**就是Slave。NameNode 下达命令，DataNode 执行实际的操作。

1. 存储实际的数据块。

2. 执行数据块的读/写操作。

**SecondaryNameNode：**并非 NameNode 的热备。当NameNode 挂掉的时候，它并不能马上替换 NameNode 并提供服务。

1. 辅助 NameNode，分担其工作量。

2. 定期合并 fsimage和fsedits，并推送给NameNode。

   **注意**：hadoop2.0引入了HA机制后，解决了NameNode的单点故障问题，同时已经不用SecondaryNameNode了

   > **fsimage 和 fsedits**
   >
   > NameNode 中两个很重要的文件，
   >
   > fsimage是元数据镜像文件（**保存文件系统的目录树,文件及目录结构 组成文件的块的信息 副本数量信息**）。
   >
   > fsedits 是元数据操作日志（记录每次保存fsimage之后到下次保存之间的所有hdfs操作）。
   >
   > 内存中保存了最新的元数据信息（fsimage 和 fsedits）
   >
   > fsiedits 过大会导致NameNode重启速度慢，Secondary NameNode负责定期合并它们。
   >
   > 合并流程图：
   >
   > ![](img/\fsimage和fsedits合并流程.png)

3. 在紧急情况下，可辅助恢复 NameNode。

## HDFS文件块

​	HDFS中的文件是分块存储（block），每一个datanode中以block作为数据存储的最小单元，hadoop2后默认的块大小是128M，2版本之前是64m。

>  块的大小可以通过配置参数dfs.blocksize来改变。

**为什么是128m呢**？

假设我们的文件寻址时间为10ms，那么文件的传输时间一般为寻址时间的100倍，也就是1s，而机械硬盘的传输速率大概是100Mb/s，那么正好可以在1s时间读取100m左右的数据，所以hadoop将数据块的大小设置为128M，这样可以让寻址传输时间比达到最佳。（当然、硬件技术早已经突破了10MB/s的速度）

![](img/\文件块的小.png)

> 思考：为什么亏得大小不能设置太小，也不能设置太大？
>
> 1.HDFS的块设置太小，会增加寻址时间，程序一直在找块的位置
>
> 2.如果设置的太大，从磁盘传输数据的时间会明星大于定位这个快开始位置所需的时间，导致程序在处理快数据时，会非常慢。

**总结：**HDFS快的大小设置主要取决于磁盘的传输速率

## HDFS Shell操作（重点）

hdfs提供了本地命令客户端供操作

### 1.基本语法

```bash
$ hadoop fs [具体命令]
$ hdfs dfs [具体命令]
```

检查hadoop和hdfs的源码会发现二者其实调用的是一个java类`org.apache.hadoop.fs.FsShell`

```bash
$ vim bin/hadoop
-------------------
....
if [ "$COMMAND" = "fs" ] ; then
      CLASS=org.apache.hadoop.fs.FsShell
....
exec "$JAVA" $JAVA_HEAP_MAX $HADOOP_OPTS $CLASS "$@" #java命令执行Fsshell

$ vim bin/hdfs
----------
...
elif [ "$COMMAND" = "dfs" ] ; then
  CLASS=org.apache.hadoop.fs.FsShell
  HADOOP_OPTS="$HADOOP_OPTS $HADOOP_CLIENT_OPTS"# 同理
...
```

> 建议使用`hdfs`命令，`hadoop fs`已经被hadoop官方声明过时

### 2. 命令帮助

查看所有命令

```bash
$ hdfs dfs -help
----------
Usage: hadoop fs [generic options]
        [-appendToFile <localsrc> ... <dst>]
        [-cat [-ignoreCrc] <src> ...]
        [-checksum <src> ...]
        [-chgrp [-R] GROUP PATH...]
        [-chmod [-R] <MODE[,MODE]... | OCTALMODE> PATH...]
        [-chown [-R] [OWNER][:[GROUP]] PATH...]
        [-copyFromLocal [-f] [-p] [-l] [-d] <localsrc> ... <dst>]
        [-copyToLocal [-f] [-p] [-ignoreCrc] [-crc] <src> ... <localdst>]
        [-count [-q] [-h] [-v] [-t [<storage type>]] [-u] [-x] <path> ...]
        [-cp [-f] [-p | -p[topax]] [-d] <src> ... <dst>]
        [-createSnapshot <snapshotDir> [<snapshotName>]]
        [-deleteSnapshot <snapshotDir> <snapshotName>]
        [-df [-h] [<path> ...]]
        [-du [-s] [-h] [-x] <path> ...]
        [-expunge]
        [-find <path> ... <expression> ...]
        [-get [-f] [-p] [-ignoreCrc] [-crc] <src> ... <localdst>]
        [-getfacl [-R] <path>]
        [-getfattr [-R] {-n name | -d} [-e en] <path>]
        [-getmerge [-nl] [-skip-empty-file] <src> <localdst>]
        [-help [cmd ...]]
        [-ls [-C] [-d] [-h] [-q] [-R] [-t] [-S] [-r] [-u] [<path> ...]]
        [-mkdir [-p] <path> ...]
        [-moveFromLocal <localsrc> ... <dst>]
        [-moveToLocal <src> <localdst>]
        [-mv <src> ... <dst>]
        [-put [-f] [-p] [-l] [-d] <localsrc> ... <dst>]
        [-renameSnapshot <snapshotDir> <oldName> <newName>]
        [-rm [-f] [-r|-R] [-skipTrash] [-safely] <src> ...]
        [-rmdir [--ignore-fail-on-non-empty] <dir> ...]
        [-setfacl [-R] [{-b|-k} {-m|-x <acl_spec>} <path>]|[--set <acl_spec> <path>]]
        [-setfattr {-n name [-v value] | -x name} <path>]
        [-setrep [-R] [-w] <rep> <path> ...]
        [-stat [format] <path> ...]
        [-tail [-f] <file>]
        [-test -[defsz] <path>]
        [-text [-ignoreCrc] <src> ...]
        [-touchz <path> ...]
        [-truncate [-w] <length> <path> ...]
        [-usage [cmd ...]]
```

查看单个命令

```bash
$ hdfs dfs -help put
------------
-put [-f] [-p] [-l] [-d] <localsrc> ... <dst> :
  Copy files from the local file system into fs. Copying fails if the file already
  exists, unless the -f flag is given.
  Flags:
                                                                       
  -p  Preserves access and modification times, ownership and the mode. 
  -f  Overwrites the destination if it already exists.                 
  -l  Allow DataNode to lazily persist the file to disk. Forces        
         replication factor of 1. This flag will result in reduced
         durability. Use with care.
                                                        
  -d  Skip creation of temporary file(<dst>._COPYING_).
```

### 常用命令

hdfs的命令为了降低学习成本，其实大部分都是参照linux标准命令设计的

>分类归纳：
>
>**本地 =>hdfs**:put ,copyFromLocal, moveFromLocal,appendToFile
>
>**hdfs=>hdfs**: cp, mv,chown,chgrp,chmod, mkdir,du,df, cat
>
>**hdfs=>本地**: get, getmerge,copyToLocal

启动Hadoop集群（方便后续的测试）

（1）-help：输出这个命令参数

```bash
$ hdfs dfs -help rm
```

（2）-ls: 显示目录信息

```bash
$ hdfs dfs -ls /
```

（3）-mkdir：在HDFS上创建目录

```bash
$ hdfs dfs -mkdir -p /sanguo/shuguo
```

（4）-moveFromLocal：从本地剪切粘贴到HDFS

```bash
$ touch kongming.txt
$ hdfs dfs  -moveFromLocal  ./kongming.txt  /sanguo/shuguo
```

（5）-appendToFile：追加一个文件到已经存在的文件末尾

```bash
$ touch liubei.txt
$ vi liubei.txt
----------
san gu mao lu

$ hdfs dfs -appendToFile liubei.txt /sanguo/shuguo/kongming.txt
```

（6）-cat：显示文件内容

```bash
$ hdfs dfs -cat /sanguo/shuguo/kongming.txt
```

（7）-chgrp 、-chmod、-chown：Linux文件系统中的用法一样，修改文件所属权限

```bash
$ hdfs dfs  -chmod  666  /sanguo/shuguo/kongming.txt
$ hdfs dfs -chown  atguigu:atguigu   /sanguo/shuguo/kongming.txt
```

（8）-copyFromLocal：从本地文件系统中拷贝文件到HDFS路径去

```bash
$ hdfs dfs -copyFromLocal README.txt /
```

（9）-copyToLocal：从HDFS拷贝到本地

```bash
$ hdfs dfs -copyToLocal /sanguo/shuguo/kongming.txt ./
```

（10）-cp ：从HDFS的一个路径拷贝到HDFS的另一个路径

```bash
$ hdfs dfs -cp /sanguo/shuguo/kongming.txt /zhuge.txt
```

（11）-mv：在HDFS目录中移动文件

```bash
$ hdfs dfs -mv /zhuge.txt /sanguo/shuguo/
```

（12）-get：等同于copyToLocal，就是从HDFS下载文件到本地

```bash
$ hdfs dfs -get /sanguo/shuguo/kongming.txt ./
```

（13）-getmerge：合并下载多个文件，比如HDFS的目录 /user/atguigu/test下有多个文件:log.1, log.2,log.3,...

```bash
$ hdfs dfs -getmerge /user/atguigu/test/* ./zaiyiqi.txt
```

（14）-put：等同于copyFromLocal

```bash
$ hdfs dfs -put ./zaiyiqi.txt /user/atguigu/test/
```

（15）-tail：显示一个文件的末尾

```bash
$ hdfs dfs -tail /sanguo/shuguo/kongming.txt
```

（16）-rm：删除文件或文件夹

```bash
$ hdfs dfs -rm /user/atguigu/test/jinlian2.txt
```

（17）-rmdir：删除空目录

```bash
$ hdfs dfs -mkdir /test
$ hdfs dfs-rmdir /test
```

（18）-du统计文件夹的大小信息

```bash
$ hdfs dfs -du -s -h /user/atguigu/test
------------
2.7 K  /user/atguigu/test

$ hdfs dfs-du  -h /user/atguigu/test
--------
1.3 K  /user/atguigu/test/README.txt
15     /user/atguigu/test/jinlian.txt
1.4 K  /user/atguigu/test/zaiyiqi.txt
```

（19）-df统计hdfs的用量

```bash
$ hdfs dfs -df -h 
-------------
Filesystem               Size   Used  Available  Use%
hdfs://hadoop152:9000  51.0 G  2.9 M     38.5 G    0%
```

（20）-setrep：设置HDFS中文件的副本数量

```bash
$ hdfs dfs -setrep 10 /sanguo/shuguo/kongming.txt
```

![](img/\修改副本数量.png)

>  注意：这里设置的副本数只是记录在NameNode的元数据中，是否真的会有这么多副本，还得看DataNode的数量。因为目前只有3台设备，最多也就3个副本，只有节点数的增加到10台时，副本数才能达到10。
>
> hadoop默认的副本数量是3个，因此假设将副本数量改到3个一下，是不会有效果的。

## HDFS 客户端操作

​	hdfs除了使用命令模式访问以外，还提供了各种各样的访问客户端，这里我们采用java应用来远程访问我们的hdfs集群。

​	由于hadoop在设计之初并没有充分考虑到异构环境下，客户端访问hadoop集群的问题，导致在windows下运行hadoop客户端不是那么愉快。如果想要在windows环境下运行java客户端，必须要手动编译hadoop windows二进制包，而hadoop编译过程中，需要涉及windows native类的编译，这就导致编译过程对于未接触过本地包编译的人来说有些许困难，好在，开源社区从来不缺乏活雷锋。

### HDFS客户端环境准备

#### 1. windows配置hadoop

1.在windows文件系统中任意位置解压hadoop的二进制包

> 注意：整个路径中不能有空格，也不要使用中文 例如 `c:/program files` 就是非法的

2.配置hadoop环境变量

![](F:\teachingNote\hadoop\img\windows配置环境变量.png)

3.下载hadoop在windows上运行的必要工具winUtils

> github项目地址：https://github.com/cdarlint/winutils
>
> 请根据hadoop不同版本下载对应的winutils和hadoop.dll

![](F:\teachingNote\hadoop\img\winutils下载地址.png)

4.将winutils和hadoop.dll放入bin目录

![](F:\teachingNote\hadoop\img\winutils位置.png)

5.检查配置是否成功

```bash
PS C:\Users\bbzha> winutils
--------------
Usage: D:\software\hadoop-3.2.1\bin\winutils.exe [command] ...
Provide basic command line utilities for Hadoop on Windows.

The available commands and their usages are:

chmod          Change file mode bits.....

PS C:\Users\bbzha> hadoop version
------------------
Hadoop 3.2.1
Source code repository https://gitbox.apache.org/repos/asf/hadoop.git -r b3cbbb467e22ea829b3808f4b7b01d07e0bf3842      Compiled by rohithsharmaks on 2019-09-10T15:56Z
Compiled with protoc 2.5.0
From source with checksum 776eaf9eee9c0ffc370bcbc1888737
This command was run using /D:/software/hadoop-3.2.1/share/hadoop/common/hadoop-common-3.2.1.jar
```

#### 2. Java 开发环境配置

这里我们以Intellij为例，我们需要配置maven以及Intellij中的maven配置

##### 2.1 准备maven环境

​	maven是java编程必不可少的工具，它可以通过简单的脚本和命令帮助开发者快速构建复杂的java应用程序。帮助开发者管理依赖、测试、打包、编译，陪着持续集成工具，maven还可以帮助开发者实现项目的自动部署。

> eclipse和intellij这样的综合型ide默认都内置了maven工具，但在实际开发过程中，仍建议各位自行安装maven，并指定路径管理maven本地库

安装maven步骤：

###### 1.下载maven应用

这里我们直接下载maven二进制文件：http://mirror.bit.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.zip

###### 2.解压zip包，配置环境变量

配置MAVEN_HOME

![](img/mvn1.PNG)

  将maven命令集添加至系统环境变量中

![](img/mvn2.PNG)

打开命令行，测试

```bash
mvn -v
------------
Maven home: D:\software\apache-maven-3.6.3\bin\..
Java version: 1.8.0_45, vendor: Oracle Corporation, runtime: C:\Program Files\java\jdk1.8.0_45\jre
Default locale: zh_CN, platform encoding: GBK
OS name: "windows 8.1", version: "6.3", arch: "amd64", family: "windows"
```

###### 3.配置maven中央仓库阿里云镜像

> maven默认的中央仓库在国内使用并不稳定，建议将中央仓库映射到阿里云镜像

修改 ```maven安装目录/conf/settings.xml```文件，在其<mirrors>标签中添加如下内容

```xml
<mirrors>
    <mirror>
        <id>alimaven</id>
        <name>aliyun maven</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        <mirrorOf>central</mirrorOf>       
    </mirror>
</mirrors>
```

###### 4.配置maven本地仓库地址

maven会将从中央库中下载的jar包依赖默认保存在用户目录之下，也就是本地仓库，如果想修改仓库地址，在```settings.xml```中添加如下配置

```xml
<localRepository>d:\mvnRepo</localRepository>
```

##### 2.2 创建hadoopClient项目

###### 1. intellij创建maven项目

![](img/%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE1.PNG)指定项目所在目录以及项目名称（这里注意项目路径不要有中文，并且最好不要在盘符下第一级子目录）

![](img/%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE2.PNG)

###### 2. 配置maven项目自动导入

intellij支持实时监控maven项目的规则改变，并且自动完成依赖包的导入

刚打开项目时，我们会发现intellij右下角弹出如下对话框,请选择**Enable Auto-Import**

![](img/auto%20import.PNG)

 如果没有弹出，或者没有选择，请打开maven设置，勾选自动导入

![](img/mvn%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%85%A52.png)

###### 3.配置intellij maven

​	由于intellij自带maven api，因此其默认使用自带maven和默认的本地仓库地址，这里我们需要设置使用我们手动下载的maven api，并且在我们创建其他项目时，也使用次配置，因此这里我们除了配置本项目的maven外，还需要设置新项目的maven配置

**配置当前项目**

![](img/%E9%85%8D%E7%BD%AEmvn1.png)

   ![](img/mvn%E9%85%8D%E7%BD%AE2.png)

**全局项目配置**

​	全局项目配置与当前项目配置方式一致，只不过选项在 other settings中

##### ![](img/%E5%85%A8%E5%B1%80%E8%AE%BE%E7%BD%AEmvn.png)

###### 4 项目目录结构

​	项目创建完毕后，其目录结构如下

![](img/%E9%A1%B9%E7%9B%AE%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84.png)

其中pom.xml是maven项目的核心配置文件，其中定义了这个项目的maven构建规则

### HDFS JAVA API

在hello-hadoop项目中编写如下代码，实现文件夹的创建

```bash
public class HdfsClient {

    @Test
    public void testMkdirs() throws IOException, InterruptedException, URISyntaxException {

        // 1 创建hadoop hdfs配置对象
       Configuration configuration = new Configuration();

        // 配置在集群上运行
       FileSystem fs = FileSystem.get(new URI("hdfs://hadoop152:9000"), configuration, "hadoop");

        // 2 创建目录
        fs.mkdirs(new Path("/cc"));

        // 3 关闭资源,尤其在写入时，hadoop hdfs不支持并发写入
        fs.close();
    }

```

运行结果

![](F:\teachingNote\hadoop\img\mkdir运行结果.png)

#### Api重要对象

- `FileSystem`：代表hdfs文件系统的抽象
- `Configuration`：代表hdfs的配置对象，配置优先级：`Configuration`对象>客户端代码Classpath路径下的`hdfs-site.xml`文件> 集群默认配置

#### hdfs常规操作

编写如下测试类测试

```java
package com.neuedu;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.*;
import org.apache.hadoop.io.IOUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class HdfsClient {


    private FileSystem fs;

    @Before
    public void before() throws URISyntaxException, IOException, InterruptedException {
       // Configuration configuration = new Configuration();
       // configuration.set("dfs.replication","1");
        fs = FileSystem.get(new URI("hdfs://hadoop152:9000"), new Configuration(), "hadoop");
    }

    @After
    public void after() throws IOException {
        fs.close();
    }

    @Test
    public void testMkdirs() throws IOException, InterruptedException, URISyntaxException {

        // 1 获取文件系统
//        Configuration configuration = new Configuration();

        // 配置在集群上运行
        // configuration.set("fs.defaultFS", "hdfs://hadoop102:9000");
        // FileSystem fs = FileSystem.get(configuration);

//        FileSystem fs = FileSystem.get(new URI("hdfs://hadoop152:9000"), configuration, "hadoop");

        // 2 创建目录
        fs.mkdirs(new Path("/cc"));

        // 3 关闭资源,尤其在写入时，hadoop hdfs不支持并发写入
//        fs.close();
    }

    @Test
    public void put() throws IOException {
        fs.copyFromLocalFile(new Path("f:/1.txt"), new Path("/3.txt"));
    }

    @Test
    public void get() throws IOException {
        fs.copyToLocalFile(new Path("/wcinput"), new Path("f:/"));
    }

    @Test
    public void rename() throws IOException {
        fs.rename(new Path("/wcoutput"), new Path("/haha"));
    }

    @Test
    public void delete() throws IOException {
        boolean delete = fs.delete(new Path("/1.txt"), true /*是否递归删除文件和文件夹*/);
        System.out.println(delete?"删除成功":"删除失败");
    }

    @Test
    public void append() throws IOException {
        FSDataOutputStream append = fs.append(new Path("/1.txt"), 1024);
        FileInputStream fis = new FileInputStream("f:/2.txt");
        IOUtils.copyBytes(fis,append,1024);
        append.close();
        fis.close();
    }

    /**
     * 获取文件和文件夹信息
     * @throws IOException
     */
    @Test
    public void ls() throws IOException {
        FileStatus[] statuses = fs.listStatus(new Path("/"));

        for(FileStatus status:statuses){
            if(status.isFile()){
                System.out.println("---文件信息---");
                System.out.println(status.getPath());
                System.out.println(status.getLen());
            }else{
                System.out.println("----文件夹信息--------");
                System.out.println(status.getPath());
            }
        }
    }

    /**
     * 只获取文件信息
     * @throws IOException
     */
    @Test
    public void listFiles() throws IOException {
        RemoteIterator<LocatedFileStatus> listFiles = fs.listFiles(new Path("/"), true /*递归将文件夹中的文件也取出*/);

        while(listFiles.hasNext()){
            LocatedFileStatus fileStatus = listFiles.next();
            System.out.println("---文件信息----------");
            System.out.println(fileStatus.getPath());

            //获取块信息
            BlockLocation[] blockLocations = fileStatus.getBlockLocations();
            System.out.println("-------块信息---------");
            for(BlockLocation bl:blockLocations){
                String[] hosts = bl.getHosts();
                for(String host:hosts){
                    System.out.println(host+"  ");
                }
            }
        }
    }
}

```

#### hdfs输入输出流

##### hdfs文件上传

```java
@Test
public void getFileFromHDFS() throws IOException, InterruptedException, URISyntaxException{

	// 1 获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop102:9000"), configuration, "atguigu");
		
	// 2 获取输入流
	FSDataInputStream fis = fs.open(new Path("/banhua.txt"));
		
	// 3 获取输出流
	FileOutputStream fos = new FileOutputStream(new File("e:/banhua.txt"));
		
	// 4 流的对拷
	IOUtils.copyBytes(fis, fos, configuration);
		
	// 5 关闭资源
	IOUtils.closeStream(fos);
	IOUtils.closeStream(fis);
	fs.close();
}
```

##### hdfs文件下载

```java
@Test
public void readFileSeek1() throws IOException, InterruptedException, URISyntaxException{

	// 1 获取文件系统
	Configuration configuration = new Configuration();
	FileSystem fs = FileSystem.get(new URI("hdfs://hadoop102:9000"), configuration, "atguigu");
		
	// 2 获取输入流
	FSDataInputStream fis = fs.open(new Path("/hadoop-2.7.2.tar.gz"));
		
	// 3 创建输出流
	FileOutputStream fos = new FileOutputStream(new File("e:/hadoop-2.7.2.tar.gz.part1"));
		
	// 4 流的拷贝
	byte[] buf = new byte[1024];
		
	for(int i =0 ; i < 1024 * 128; i++){
		fis.read(buf);
		fos.write(buf);
	}
		
	// 5关闭资源
	IOUtils.closeStream(fis);
	IOUtils.closeStream(fos);
fs.close();
}
```

## HDFS数据流

### HDFS写数据流程

![](F:\teachingNote\hadoop\img\hdfs的写数据流过程.png)

1. 客户端通过`Distributed FileSystem`模块向`NameNode`请求上传文件，`NameNode`检查目标文件是否已存在，父目录是否存在。

2. `NameNode`返回是否可以上传。

3. 客户端请求第一个 Block上传到哪几个`DataNode`服务器上。

4. `NameNode`返回3个`DataNode`节点，分别为dn1、dn2、dn3。

5. 客户端通过`FSDataOutputStream`模块请求dn1上传数据，dn1收到请求会继续调用dn2，然后dn2调用dn3，将这个通信管道建立完成。

6. dn1、dn2、dn3逐级应答客户端。

7. 客户端开始往dn1上传第一个Block（先从磁盘读取数据放到一个本地内存缓存），以Packet为单位，dn1收到一个Packet就会传给dn2，dn2传给dn3；dn1每传一个packet会放入一个应答队列等待应答。

8. 当一个Block传输完成之后，客户端再次请求`NameNode`上传第二个Block的服务器。（重复执行3-7步）。

#### 网络拓扑-节点距离计算

​	在HDFS写数据的过程中，NameNode会选择距离待上传数据最近距离的DataNode接收数据。那么这个最近距离怎么计算呢？

**节点距离：两个节点到达最近的共同祖先的距离总和。**

![](F:\teachingNote\hadoop\img\网络拓扑图例.png)

​	例如，假设有数据中心d1机架r1中的节点n1。该节点可以表示为/d1/r1/n1。利用这种标记，这里给出四种距离描述，如图所示。

##### 结论：

​	假设数据的副本数量为3，当外部客户端访问hdfs集群要求写入数据时，集群会计算拓扑距离，找到距离客户端机器最近的一个node节点作为主节点返回给客户端。

#### 机架感知（副本存储节点选择）

​	主节点选择完毕后，hadoop开始选择另外两个副本节点

1. 第一个副本节点和主节点在同一机架上，假定主节点是N1，那么第二个副本节点可能是N2或N3。
2. 第二个副本节点和位于不同的机架上，随机分配。

#### 思考

为什么hdfs要这么安排副本呢？

> 参考hadoop官方文档：<http://hadoop.apache.org/docs/r2.7.2/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html#Data_Replication>
>
> ```bash
> For the common case, when the replication factor is three, HDFS’s placement policy is to put one replica on one node in the local rack, another on a different node in the local rack, and the last on a different node in a different rack. This policy cuts the inter-rack write traffic which generally improves write performance. The chance of rack failure is far less than that of node failure
> ```

理由很简单，第一第二个副本在一个机架上，可以保证数据的io效率，第三个副本在不同机架上，提高了数据的可靠性，这是一种权衡策略，但是即使如此，也不可能百分之百保证数据的可靠性。

### HDFS读数据流程

![](F:\teachingNote\hadoop\img\hdfs输数据流程.png)

1. 客户端通过Distributed FileSystem向NameNode请求下载文件，NameNode通过查询元数据，找到文件块所在的DataNode地址。

2. 挑选一台DataNode（就近原则，然后随机）服务器，请求读取数据。

3. DataNode开始传输数据给客户端（从磁盘里面读取数据输入流，以Packet为单位来做校验）。

4. 客户端以Packet为单位接收，先在本地缓存，然后写入目标文件。
5. 重复以上步骤下载第二个block，直到全部下载完为止。