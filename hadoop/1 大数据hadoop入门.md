# 大数据技术之Hadoop入门

## 大数据概论

​	大数据（Big Data）： 指**无法在一定时间范围**内用常规软件工具进行捕捉、管理和处理的数据集合，是需要新处理模式才能具有更强的决策力、洞察发现力和流程优化的海量、高增长率和多样化的信息资产。

​	主要解决：海量数据的存储和海量数据的分析计算问题。

### 大数据特点（4v）

#### Volume（大量）

​	截止目前为止，人类生产的所有印刷材料的数据量是200PB，而历史上全热泪总共说过的化的数据量大约5EB，当前，典型个人计算机硬盘的容量为TB量级，而一些大企业的数据量已经接近EB量级。

> 数据存储单位：bit Byte  KB MB GB TB PB EB ZB YB BB NB DB

#### Velocity(高速)

​	这是大数据区分于传统数据挖掘的最显著特征，根据IDC的“数据宇宙”的报告，预计到2020年，全球数据使用量将达到35.2ZB，在如此海量的数据面前，处理数据的效率是企业的生命。

#### Variety（多样）

​	数据类型的多样性，相对于以往便于存储的以数据库/文本为主的结构化数据，非结构化数据越来越多，包括网络日志、音频、视频、图片、地理位置信息等，这些多类型的数据对数据的处理能力提出了很高的要求。

![](img/数据类型.png)

#### Value(低价值密度)

​	价值密度的高低与数据总量的大小成反比，比如，在一天监控的视频中，我们只关心某一时刻小偷窃取物品的1分钟，如何快速对有价值数据进行提取，称为目前大数据背景下待解决的难题。

### 大数据应用场景

​	大数据一定会逐渐普及于传统行业的方方面面，教育、医疗、金融、物流运输、工商业都越来越离不开基于大数据的人工智能和数据价值挖掘场景。例如：

**物流仓储**

​	大数据分析系统助力商家精细化运营、提升销量、节约成本。

![](img/物流.png)

**零售**

​	分析用户消费习惯，为用户购买商品提供方便，从而提升商品销量。(经典案例：纸尿布与啤酒)

![](img/零售.png)

**旅游**

​	深度就和大数据能力与旅游行业需求，共建旅游产业智慧管理、智慧服务和智慧营销的未来。

![](img/旅游.png)

**商品广告推荐**

给用户推荐可能喜欢的商品

![](img/广告推荐.png)

**保险**

​	海量数据挖掘机风险预测，助力保险行业精准营销。

**金融**

​	多维度体现用户特征，帮助经融机构推荐优质客户，方法欺诈风险。

**医疗**

​	通过收集群体及个人完整的医疗数据，建立个人医疗数据档案、患者主索引，通过整体数据分析病理，病灶。

![](img/医疗.png)



**人工智能**

![](img/人工智能.png)

### 大数据业务流程

​	有能力和有需要使用大数据技术的公司前提就是：大！

​	如果你企业的业务不到一定规模，几乎不太需要大数据人才介入，因此，大数据人才目前往往只适合大中型企业。

​	大数据的流程一般如下：

![](img/大数据业务产生流程.png)

### 大数据部门组织结构

![](img/组织结构.png)

## 大数据技术生态与Hadoop

​	Hadoop不是指具体一个框架或者组件，它是Apache软件基金会下用Java语言开发的一个开源分布式计算平台。实现在大量计算机组成的集群中对海量数据进行分布式计算。适合大数据的分布式存储和计算平台。

### hadoop发展历史

​	2003-2004年，Google公布了部分GFS和MapReduce思想的细节，受此启发的Doug Cutting等人用2年的业余时间实现了DFS和MapReduce机制，使Nutch性能飙升。然后Yahoo招安Doug Gutting及其项目。
2005年，Hadoop作为Lucene的子项目Nutch的一部分正式引入Apache基金会。2006年2月被分离出来，成为一套完整独立的软件，起名为Hadoop。Hadoop名字不是一个缩写，而是一个生造出来的词。是Hadoop之父Doug Cutting儿子毛绒玩具象命名的。Hadoop的成长过程：Lucene–>Nutch—>Hadoop

总结起来，Hadoop起源于Google的三大论文
GFS：Google的分布式文件系统Google File System
MapReduce：Google的MapReduce开源分布式并行计算框架
BigTable：一个大型的分布式数据库

**演变关系**
GFS—->HDFS
Google MapReduce—->Hadoop MapReduce
BigTable—->HBase**2****.3 Hadoop三大发行版本**

### Hadoop版本

**Hadoop三大发行版本**：Apache、Cloudera、Hortonworks。

**Apache**版本最原始（最基础）的版本，对于入门学习最好。

**Cloudera**在大型互联网企业中用的较多。

**Hortonworks**文档较好。

### Hadoop的优势

1. 高可用性：Hadoop底层维护多个数据副本，所以即使Hadoop某个计算元素或存储出现故障，也不会导致数据的丢失。
2. 高可扩展性：在集群间分配任务数据，课方便的扩展数以千记的节点。
3. 高效性：在MapReduce思想下，Hadoop是并行工作的，以加快任务处理的速度，
4. 高容错性：能够自动将失败的任务重新分配。

### Hadoop架构组成（重点）

​	hadoop 1.x版本与2.x版本有着本质的区别，课程围绕2.x版本进行。

![](img/1与2的架构区别.png)

#### hdfs架构概述

> 参考：https://www.cnblogs.com/jinlin/p/10300882.html

HDFS是hadoop自带的分布式文件系统，英文名为：Hadoop Distributed Filesystem，HDFS以流式数据访问模式来存储超大文件。根据设计，HDFS具有如下特点

##### HDFS特点

1. 支持超大文件

   `一般来说，HDFS存储的文件可以支持TB和PB级别的数据`

2. 检测和快速应对硬件故障

   `在集群环境中，硬件故障是常见性问题。因为有上千台服务器连在一起，故障率很高，因此故障检测和自动恢复hdfs文件系统的一个设计目标。假设某一个datanode挂掉之后，因为数据是有备份的，还可以从其他节点里找到。namenode通过心跳机制来检测datanode是否还存活`

3. 流式数据访问

```
HDFS的访问模式是一次写入，多次读取，数据集通常都是由数据源生成或者从数据源复制而来，接着长时间在此数据集上进行各种分析，因此读取整个数据集的时间延迟比读取第一条记录的时间延迟更重要
```

1. 高容错性

   `数据自动保存多个副本，副本丢失后自动恢复。 可构建在廉价的机器上，实现线性扩展。当集群增加新节点之后，namenode也可以感知，将数据分发和备份到相应的节点上`

2. 商用硬件

   `Hadoop并不需要运行在昂贵且高可靠的硬件上。它是设计运行在商用硬件（在各种零售店都能买到的普通硬件）的集群上的，因此至少对于庞大的集群来说，节点故障的几率还是非常搞得。HDFS遇到上述故障时，被设计成能够继续运行且不让用户察觉到明显的中断。`

##### hdfs核心组件

![](img/hdfs核心组件.png)

**NameNode**：

​	集群当中的主节点，主要用于管理集群当中的各种数据，存储文件的元数据，如文件名，文件目录结构，文件属性（生成时间、副本数、文件权限），以及每个文件的块列表和块所在的DataNode等。**namenode就好比是一个文件的目录。**
**secondaryNameNode**：

​	主要能用于hadoop当中元数据信息的辅助管理，用来监控hdfs状态，每隔一段时间获取hdfs元数据的快照。
**DataNode**：

​	保存在hdfs中的海量数据显然是要进行切割的，这些数据经过切割后，以块的方式保存在datanode中，datanode是集群当中的从节点，主要用于存储集群当中的各种数据，以及块数据的校验。

#### YARN架构概述

> 参考：https://www.jianshu.com/p/f50e85bdb9ce

​	Apache Hadoop YARN 是开源 Hadoop 分布式处理框架中的资源管理和作业调度技术。作为 Apache Hadoop 的核心组件之一，YARN 负责将系统资源分配给在 Hadoop 集群中运行的各种应用程序，并调度要在不同集群节点上执行的任务。

​	YARN 的基本思想是将资源管理和作业调度/监视的功能分解为单独的 daemon(守护进程)，其拥有一个全局 ```ResourceManager```(RM) 和每个应用程序的 ```ApplicationMaster```(AM)。应用程序可以是单个作业，也可以是作业的 DAG。

![](img/yarn架构.png)

##### YARN 基本服务组件

​	YARN 总体上是 master/slave 结构，在整个资源管理框架中，```ResourceManager``` 为 master，```NodeManager``` 是 slave。

YARN的基本组成结构，YARN 主要由 ```ResourceManager```、```NodeManager```、```ApplicationMaster ```和 ```Container``` 等几个组件构成。

- ```ResourceManager```是Master上一个独立运行的进程，负责集群统一的资源管理、调度、分配等等；
- ```NodeManager```是Slave上一个独立运行的进程，负责上报节点的状态；
- ```ApplicationMaster```相当于这个Application的监护人和管理者，负责监控、管理这个Application的所有Attempt在cluster中各个节点上的具体运行，同时负责向Yarn ```ResourceManager```申请资源、返还资源等；
- ```Container```是yarn中分配资源的一个单位，包涵内存、CPU等等资源，YARN以```Containe```r为单位分配资源；

```ResourceManager``` 负责对各个 ```NodeManager ```上资源进行统一管理和调度。当用户提交一个应用程序时，需要提供一个用以跟踪和管理这个程序的 ```ApplicationMaster```，它负责向 ```ResourceManager ```申请资源，并要求 ```NodeManger``` 启动可以占用一定资源的任务。由于不同的 ```ApplicationMaster``` 被分布到不同的节点上，因此它们之间不会相互影响。

Client 向 ```ResourceManager``` 提交的每一个应用程序都必须有一个 ```ApplicationMaster```，它经过 ```ResourceManager``` 分配资源后，运行于某一个 Slave 节点的 ```Container```中，具体做事情的 Task，同样也运行与某一个 Slave 节点的 Container 中。

#### MapReduce架构概述

> 参考：https://www.jianshu.com/p/ca165beb305b
>
> https://blog.csdn.net/lgnlgn/article/details/90076430
>
> 黑桃示例：https://cloud.tencent.com/developer/news/52756

​	MapReduce是一种编程模型，用于大规模数据集（大于1TB）的并行运算。概念"Map（映射）"和"Reduce（归约）"，是它们的主要思想，都是从函数式编程语言里借来的，还有从矢量编程语言里借来的特性。它极大地方便了编程人员在不会分布式并行编程的情况下，将自己的程序运行在分布式系统上。 当前的软件实现是指定一个Map（映射）函数，用来把一组键值对映射成一组新的键值对，指定并发的Reduce（归约）函数，用来保证所有映射的键值对中的每一个共享相同的键组。

MapReduce将计算过程分为两个阶段：Map和Reduce	

1. Map阶段并行处理输入数据
2. Reduce阶段对Map结果进行汇总

![](img/MapReduce架构.png)

### 大数据技术生态体系

![](img/大数据生态体系.PNG)

图中涉及的技术名词解释如下：

1. Sqoop：Sqoop是一款开源的工具，主要用于在Hadoop、Hive与传统的数据库(MySql)间进行数据的传递，可以将一个关系型数据库（例如 ：MySQL，Oracle 等）中的数据导进到Hadoop的HDFS中，也可以将HDFS的数据导进到关系型数据库中。

2. Flume：Flume是Cloudera提供的一个高可用的，高可靠的，分布式的海量日志采集、聚合和传输的系统，Flume支持在日志系统中定制各类数据发送方，用于收集数据；同时，Flume提供对数据进行简单处理，并写到各种数据接受方（可定制）的能力。

3. Kafka：Kafka是一种高吞吐量的分布式发布订阅消息系统，有如下特性：

   （1）通过O(1)的磁盘数据结构提供消息的持久化，这种结构对于即使数以TB的消息存储也能够保持长时间的稳定性能。

   （2）高吞吐量：即使是非常普通的硬件Kafka也可以支持每秒数百万的消息。

   （3）支持通过Kafka服务器和消费机集群来分区消息。

   （4）支持Hadoop并行数据加载。

4. Storm：Storm用于“连续计算”，对数据流做连续查询，在计算时就将结果以流的形式输出给用户。**目前storm正在被flink取代**

5. Spark：Spark是当前最流行的开源大数据内存计算框架。可以基于Hadoop上存储的大数据进行计算。

6. Oozie：Oozie是一个管理Hdoop作业（job）的工作流程调度管理系统。

7. Hbase：HBase是一个分布式的、面向列的开源数据库。HBase不同于一般的关系数据库，它是一个适合于非结构化数据存储的数据库。

8. Hive：Hive是基于Hadoop的一个数据仓库工具，可以将结构化的数据文件映射为一张数据库表，并提供简单的SQL查询功能，可以将SQL语句转换为MapReduce任务进行运行。 其优点是学习成本低，可以通过类SQL语句快速实现简单的MapReduce统计，不必开发专门的MapReduce应用，十分适合数据仓库的统计分析。

10. R语言：R是用于统计分析、绘图的语言和操作环境。R是属于GNU系统的一个自由、免费、源代码开放的软件，它是一个用于统计计算和统计制图的优秀工具。

11. Mahout：Apache Mahout是个可扩展的机器学习和数据挖掘库。

12. ZooKeeper：Zookeeper是Google的Chubby一个开源的实现。它是一个针对大型分布式系统的可靠协调系统，提供的功能包括：配置维护、名字服务、 分布式同步、组服务等。ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。

### 推荐系统架构示例

​	以电商平台中常见的推荐系统为例，大致架构如下：

![](img/推荐系统架构.png)



## hadoop运行环境搭建

### 虚拟机配置

#### centos虚拟机硬件环境

> 硬盘50g，内存4g，cpu 2*2

#### 虚拟机准备

1. 防火墙关闭

   ```bash
   service iptables stop // 服务器关闭
   chkconfig iptables off //关闭开机自启动
   systemctl stop firewalld
   systemctl disabled firewalld
   ```

2. 创建用户

   ```bash
   useradd hadoop
   passwd hadoop
   ```

3. 在  /opt目录创建software module文件夹

   ```bash
   mkdir /opt/software /opt/module
   chown hadoop:hadoop  /opt/software /opt/module //设置权限
   ```

4. 把这个用户添加到sudoers中

   ```bash
   vim /etc/sudoers
   hadoop ALL=(ALL)        NOPASSWD: ALL
   ```

5. 改hosts文件

   ```bash
   vim /etc/hosts
   //在文件后追加几个虚拟机地址
   192.168.134.100 hadoop100
   192.168.134.101 hadoop101
   192.168.134.102 hadoop102
   192.168.134.103 hadoop103
   192.168.134.104 hadoop104
   192.168.134.105 hadoop105
   192.168.134.106 hadoop106
   192.168.134.107 hadoop107
   192.168.134.108 hadoop108
   192.168.134.109 hadoop109
   ```

   > 也可以用shell脚本来做
   >
   > ```bash
   > vim test.sh
   > //以下为脚本内容
   > #!/bin/bash
   > for ((i=100;i<110;i++))
   > 	echo "192.168.134.$i hadoop$i" >> /etc/hosts
   > done
   > //-------
   > bash test.sh //运行脚本
   > ```

6. 设置ssh服务启动和自启动

   ```bash
   service sshd restart //启动
   chkconfig sshd on // 设置开机自启动
   ```

7. 改静态ip（下面几部每克隆一台就要做一遍）

   ```bash
   vim /etc/sysconfig/network-scripts/ifcfg-eth0
   //-----------
   DEVICE=eth0
   TYPE=Ethernet
   ONBOOT=yes
   BOOTPROTO=static
   IPADDR=192.168.134.100
   PREFIX=24
   GATEWAY=192.168.134.2
   DNS1=192.168.134.2
   NAME=eth0
   ```

8. 改主机名

   ```bash
   vim /etc/sysconfig/network
   HOSTNAME=hadoop100
   
   
   ```


#### 安装jdk和hadoop

##### 安装jdk

###### 安装openjdk

```bash
yum install java-1.8.0-openjdk* -y //安装所有openjdk的包
```

###### 安装oracle jdk

1. 下载oracle jdk linux

![](F:/teachingNote/hadoop/img/jdk%E4%B8%8B%E8%BD%BD.PNG)

2. 通过ssh拷贝至 /opt/software

```bash
scp [文件路径]  [用户名]@[ipaddr]:[文件拷贝位置]
//例如
scp d:/jdk-8u201.tar.gz root@192.168.134.101:/opt/software
```

3. 解压

```bash
tar -zxvf jdk-8u201-linux-x64.tar.gz -C /opt/module
```

###### 配置环境变量

```bash
vim /etc/profile
export JAVA_HOME=/opt/module/jdk1.8.0_144
export PATH=$PATH:$JAVA_HOME/bin
//------------
source /etc/profile 
```

##### 安装hadoop

1. 下载hadoop，拷贝至linux

   ```bash
   $ scp  <文件所在路径>   root@<虚拟机ip>:/<想存放的路径>java
   ```

2. 解压

   ```bashj
   tar -zxvf hadoop.tar.gz -C /opt/module
   ```

3. 配置环境变量

   ```bash
   export HADOOP_HOME=/opt/module/hadoop-2.9.2
   export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
   //------------
   source /etc/profile 
   hadoop version
   ```

> 在此可以保存个快照

#### hadoop目录结构

查看Hadoop目录结构

```bash
$ ll
------------------
drwxr-xr-x. 2 atguigu atguigu  4096 5月  22 2017 bin
drwxr-xr-x. 3 atguigu atguigu  4096 5月  22 2017 etc
drwxr-xr-x. 2 atguigu atguigu  4096 5月  22 2017 include
drwxr-xr-x. 3 atguigu atguigu  4096 5月  22 2017 lib
drwxr-xr-x. 2 atguigu atguigu  4096 5月  22 2017 libexec
-rw-r--r--. 1 atguigu atguigu 15429 5月  22 2017 LICENSE.txt
-rw-r--r--. 1 atguigu atguigu   101 5月  22 2017 NOTICE.txt
-rw-r--r--. 1 atguigu atguigu  1366 5月  22 2017 README.txt
drwxr-xr-x. 2 atguigu atguigu  4096 5月  22 2017 sbin
drwxr-xr-x. 4 atguigu atguigu  4096 5月  22 2017 share
```

##### 重要目录

1. bin目录：存放对Hadoop相关服务（HDFS,YARN）进行操作的脚本

2. etc目录：Hadoop的配置文件目录，存放Hadoop的配置文件

3. lib目录：存放Hadoop的本地库（对数据进行压缩解压缩功能）

4. sbin目录：存放启动或停止Hadoop相关服务的脚本

5. share目录：存放Hadoop的依赖jar包、文档、和官方案例

## Hadoop运行模式

### 本地单节点运行hadoop

​	本地运行模式没有调用任何hdfs和yarn的调度，只是基于本次存储环境和java运行环境的运行，实际上只能用于debug

#### 官方grep案例

配置 `etc/hadoop/hadoop-env.sh`

```bash
vim  etc/hadoop/hadoop-env.sh
//---------
export JAVA_HOME=/usr/java/latest //如果有了就不需要，配置javahome地址
```

创建输入文件夹，将例子中xml文件拷贝进入，然后执行example中的grep主函数来运算，并展示结果：

```bash
 $ mkdir input
 $ cp etc/hadoop/*.xml input
 $ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.9.2.jar grep input output 'dfs[a-z.]+'
 $ cat output/*
```

#### 官方wordcount案例

1. 创建wcinput 文件夹

   ```bash
   mkdir wcinput
   ```

2. 在文件夹中建立用于统计的源文件

   ```bash
   vim wc.input
   //---------
   haha hehe heyhey
   haha hoho hehe
   haha heyhey hello
   ```

3. 调用example jar输出统计结果

   ```bash
   bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.9.2.jar wordcount wcinput wcoutput
   ```




### 伪分布式运行

Pseudo-Distributed Operation伪分布式运行，指的是将所有hadoop中的节点都运行在一台主机上，比如namenode和datanode都运行在一台主机环境上，适合学习使用，简单了解。

#### 启动HDFS伪分布式运行

##### 配置 etc/hadoop/hadoop-env.sh

```bash
vim  etc/hadoop/hadoop-env.sh
//---------
export JAVA_HOME=/usr/java/latest //配置javahome地址
```

##### 配置etc/hadoop/core-site.xml:

```xml
<configuration>
    <!--指定HDFS中NameNode的地址-->
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://hadoop101:9000</value>
        <!--value值配置主机域名或者ip地址-->
    </property>
    <!--指定hadoop运行时产生文件的存储目录，比如namenode运行时产生的文件-->
    <property>
        <name>hadoop.tmp.dir</name>
        <value>/opt/module/hadoop-2.9.2/data/tmp</value>
        <!--value值配置主机域名或者ip地址-->
    </property>
</configuration>
```

##### 配置etc/hadoop/hdfs-site.xml:

```xml
<configuration>
    <!--配置副本数量，由于我们只有一台主机，所以只配置一个副本，一台主机存多个副本没意义，挂了都没有-->
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```

###### 配置ssh连接本地

由于伪分布式中，各个节点之间的通讯是基于ssh，实际上就是连接本地localhost，如果不想要通过ssh密码的方式互相连接，那么就需要进行ssh的间的密钥配置

```bash
ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys
```

##### 格式化hdfs

初始化启动hdfs之前，就要像硬盘格式化一样，对hdfs进行格式化，但是务必注意，一旦namenode启动后，就不能再进行格式化了，否则datanode将找不到自己的namenode，就好比换大哥了小弟不知道

```bash
bin/hdfs namenode -format
```

##### 启动namenode和datanode

```bash
sbin/hadoop-daemon.sh start namenode
sbin/hadoop-daemon.sh start datanode
```

访问namenode web服务

浏览器打开 hadoop101:50070

![](img/伪分布式下偶偶.png)

> 思考问题
>
> 为什么不能一直格式化NameNode，格式化NameNode，要注意什么？
>
> ```bash
> $ cd data/tmp/dfs/name/current/
> $ cat VERSION
> ---------
> clusterID=CID-f0330a58-36fa-4a2a-a65f-2688269b5837
> 
> $ cd data/tmp/dfs/data/current/
> $ cat VERSION
> -----
> clusterID=CID-f0330a58-36fa-4a2a-a65f-2688269b5837
> ```
>
> **注意：格式化NameNode**，会产生新的集群id,导致NameNode和DataNode的集群id不一致，集群找不到已往数据。所以，格式NameNode时，一定要先删除data数据和log日志，然后再格式化NameNode。

##### 创建HDFS下的目录以供执行mapreduce

```bash
  $ bin/hdfs dfs -mkdir /user
  $ bin/hdfs dfs -mkdir /user/<username>
```

##### 将本地input拷贝至hdfs 的input

```bash
$ bin/hdfs dfs -put input input
```

##### 运行示例代码

```bash
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.9.2.jar grep input output 'dfs[a-z.]+'
```

 检查运行结果

```bash
$ bin/hdfs dfs -cat output/*
```

##### 关闭namenode和datanode

```bash
sbin/hadoop-daemon.sh stop namenode
sbin/hadoop-daemon.sh stop datanode
```

#### 启动yarn并运行mapreduce程序

##### 配置yarn-env.sh

```bash
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk.x86_64
```

##### 配置mapred-env.sh

```bash
export JAVA_HOME=/opt/module/jdk1.8.0_144
```

##### 配置:`etc/hadoop/mapred-site.xml`:

> 此文件不存在需要复制mapred-site.xml.template获得

```xml
<configuration>
    <!-- 指定MR运行在YARN上 -->
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>
```

##### 配置etc/hadoop/yarn-site.xml

```xml
<configuration>
    <!-- Reducer获取数据的方式 -->
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
    <!-- 指定YARN的ResourceManager的服务主机名 -->
    <property>
		<name>yarn.resourcemanager.hostname</name>
		<value>hadoop151</value>
	</property>
</configuration>
```

##### 启动yarn

```bash
$ sbin/start-yarn.sh
```

##### 访问ResourceManager web服务

浏览器访问http://localhost:8088/

##### 运行mapreduce同hdfs部分

注意下面这张图，

![](img/向yarn申請資源.png)

可以发现，mapreduce程序向yarn的ResourceMangager申请了资源

##### 停止yarn和hdfs

```bash
sbin/stop-dfs.sh
sbin/stop-yarn.sh
```

