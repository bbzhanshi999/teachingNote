# MapReduce

## MapReduce概述

### MapReduce定义

​	MapReduce是一个**分布式运算程序的编程框架**，是用户开发“基于hadoop数据分析应用”的核心框架。

​	MapReduce核心功能就是将**用户编写的业务逻辑代码**和自带默认组件整合成完整的**分布式运算程序**，并发运行在hadoop集群上。

### 优缺点

#### 优点

##### 易于编程

​	**通过简单的接口实现，就可以完成一个分布式计算程序**，程序开发者可以和写普通串行程序一样的方式，完成一个分布式计算应用的编写（实际上不是你独立完成的，框架帮你完成的）

##### 良好的扩展性

​	当你的计算的计算资源不能得到满足的时候，你可以通过**简单的增加机器**来扩展计算能力

##### 高容错性

​	MapReduce设计的初衷就是使程序能够部署在廉价机器上，这就要求它具有很高的容错性。比如**其中一台机器挂了，它可以把上面的计算任务转移到另外一台机器上运行，补助与整个任务运行失败**，而且这个过程是自动化完成，不需要人为干预，

> 假设在不使用分布式方案来运行一个单节点计算的宕机概率是1/10，由10台计算机组成的mapreduce分布式程序中每一台计算机的宕机概率也是1/10，那么整个集群至少有一台宕机的概率就是1-0.9^10=0.65，所以分布式场景下，集群出现问题的几率是要比单体应该高的，如何提高容错性是分布式系统必须要面对的问题。

##### 处理海量数据

​	可以实现上千台服务器集群并发工作，提供PB级海量数据处理能力

#### 缺点

​	总结一个字：慢

##### 不擅长实时计算

​	MapReduce无法像Mysql一样，在毫秒级或者秒级内返回结果

##### 不擅长流式计算

​	所谓流式计算，是指数据持续更新，并没有一个明显的文件结尾界限，所以流式计算框架往往不让数据持久化，数据是**动态**的，而mapreduce的输入数据是**静态的**，另外，由于mapreduce自身的的数据口径太小，无法快速处理数据。

> 静态数据并不是不能进行实时，计算，spark就能。

##### 不擅长DAG（有向图计算）

![](img/有向图.png)

>  **有向图计算**：多个计算之间存在关联关系，计算C依赖计算B的输出，计算B依赖计算A的输出，

​	多个应用存在依赖关系，后一个应用程序的输入为前一个的输出，在这种情况下，MapReduce并不是不能做，但是使用mapreduce做，**每一个mapreduce作业的输出结果都会写入磁盘，会造成大量的IO操作，导致性能低下**。

### MapReduce核心思想

![](img/MapReduce核心思想.png)

![](img/并行计算模型.png)

1）分布式的运算程序往往需要分成至少2个阶段。

2）第一个阶段的MapTask并发实例，完全并行运行，互不相干。

3）第二个阶段的ReduceTask并发实例互不相干，但是他们的数据依赖于上一个阶段的所有MapTask并发实例的输出。

4）MapReduce编程模型只能包含一个Map阶段和一个Reduce阶段，如果用户的业务逻辑非常复杂，那就只能多个MapReduce程序，串行运行。

总结：分析WordCount数据流走向深入理解MapReduce核心思想。

> 参考：https://www.jianshu.com/p/ca165beb305b
>
> https://blog.csdn.net/lgnlgn/article/details/90076430
>
> 黑桃示例：https://cloud.tencent.com/developer/news/52756

### MapReduce

​	一个完整的MapReduce程序在分布式运行时有三类进程实例：

1. **MrAppMaster**:负责真个程序的过程调度及协调状态。
2. **MapTask**：负责Map阶段的整个数据处理流程。
3. **ReduceTask**：负责Reduce阶段的整个数据处理流程。

### 官方WordCount源码

​	采用反编译工具反编译源码，发现WordCount案例有Map类、Reduce类和驱动类。且数据的类型是Hadoop自身封装的序列化类型。

### 常用数据序列化类型

| **Java类型** | **Hadoop Writable类型** |
| ------------ | ----------------------- |
| Boolean      | BooleanWritable         |
| Byte         | ByteWritable            |
| Int          | IntWritable             |
| Float        | FloatWritable           |
| Long         | LongWritable            |
| Double       | DoubleWritable          |
| String       | Text                    |
| Map          | MapWritable             |
| Array        | ArrayWritable           |

### MapReduce编程规范

​	用户编写的程序分成三个部分：Mapper、Reducer和Driver。

#### 1. Mapper定义

1. 定义自定义Mapper继承自父类
2. 定义mapper的输入数据类型和输出数据类型（key和value的类型）
3. 覆盖map()方法，实现具体map业务逻辑。
4. 返回输出数据（同样以kv的方式）

#### 2. Reducer定义

1. 定义自定义Reducer继承父类
2. 定义Reducer的输入数据类型（承接mapper的输出数据类型）
3. 定义Reducer的输出数据类型
4. 覆盖reduce()方法，实现聚义reduce业务逻辑
5. 返回输出结果。（kv方式）

#### 3. 定义Driver

​	Driver的是yarn进行通讯的客户端，mapreduce程序要能正常运行，需要通过向yarn申请计算资源进行，所以你要告诉yarn这个程序如何执行（配置job对象，设置mapper和reducer类型，设置mapper和reducer输出类型）。

### WordCount实现

**需求**：在给定的文本文件中统计输出每一个单词出现的总次数

1.输入数据a.txt

```bash
neuedu neuedu
ss ss
cls cls
jiao
banzhang
xue
hadoop
```

2.输出格式

```bash
neuedu 2
banzhang 1
cls 2
hadoop 1
jiao 1
ss 2
xue 1
```

#### 1.环境准备（同java连接hdfs）

1.创建maven工程

2.在`pom.xml`中添加依赖

```xml
 <properties>
        <hadoop.version>2.7.7</hadoop.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.10.0</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-common</artifactId>
            <version>${hadoop.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-client</artifactId>
            <version>${hadoop.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.hadoop</groupId>
            <artifactId>hadoop-hdfs</artifactId>
            <version>${hadoop.version}</version>
        </dependency>
    </dependencies>
```

3.创建`log4j.propeties`

```properties
log4j.rootLogger=INFO, stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n
log4j.appender.logfile=org.apache.log4j.FileAppender
log4j.appender.logfile.File=target/spring.log
log4j.appender.logfile.layout=org.apache.log4j.PatternLayout
log4j.appender.logfile.layout.ConversionPattern=%d %p [%c] - %m%n
```

#### 2.编码阶段

1.编写`Mapper`类

```java
package com.neuedu;
import java.io.IOException;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class WordcountMapper extends Mapper<LongWritable, Text, Text, IntWritable>{
	
	Text k = new Text();
	IntWritable v = new IntWritable(1);
	
	@Override
	protected void map(LongWritable key, Text value, Context context)	throws IOException, InterruptedException {
		
		// 1 获取一行
		String line = value.toString();
		
		// 2 切割
		String[] words = line.split(" ");
		
		// 3 输出
		for (String word : words) {
			
			k.set(word);
			context.write(k, v);
		}
	}
}
```

2.编写`Reducer`类

```java
package com.neuedu;
import java.io.IOException;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class WordcountReducer extends Reducer<Text, IntWritable, Text, IntWritable>{

int sum;
IntWritable v = new IntWritable();

	@Override
	protected void reduce(Text key, Iterable<IntWritable> values,Context context) throws IOException, InterruptedException {
		
		// 1 累加求和
		sum = 0;
		for (IntWritable count : values) {
			sum += count.get();
		}
		
		// 2 输出
       v.set(sum);
		context.write(key,v);
	}
}
```

3.编写`Driver`驱动类

```java
package com.neuedu;
import java.io.IOException;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class WordcountDriver {

	public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {

		// 1 获取配置信息以及封装任务
		Configuration configuration = new Configuration();
		Job job = Job.getInstance(configuration);

		// 2 设置jar加载路径
		job.setJarByClass(WordcountDriver.class);

		// 3 设置map和reduce类
		job.setMapperClass(WordcountMapper.class);
		job.setReducerClass(WordcountReducer.class);

		// 4 设置map输出
		job.setMapOutputKeyClass(Text.class);
		job.setMapOutputValueClass(IntWritable.class);

		// 5 设置最终输出kv类型
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		
		// 6 设置输入和输出路径
		FileInputFormat.setInputPaths(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));

		// 7 提交
		boolean result = job.waitForCompletion(true);

		System.exit(result ? 0 : 1);
	}
}
```

#### 3.本地测试

同java连接hdfs一样，需要有windows本地hadoop运行环境

直接运行`main`函数是不行的，**我们要设置两个输入参数**，在intellij的运行配置中设置

![](img/设置运行参数intellij.png)

设置之后直接运行Driver类的main函数即可检查结果。

#### 4.集群测试

1. 执行`maven clean package`命令或者直接点击Intellij的**pakage按钮**打包

   ![](img/package打包1.png)

   打包后，jar包被放在**target文件夹**之下

   ![](img/package打包2.png)

   

2. 将jar包拷贝如hadoop集群中

3. 启动hadoop集群（hdfs和yarn都要启动）

4. 将输入文件上传至hdfs

   ```bash
   $ hdfs dfs -put a.txt /a.txt
   ```

5. 执行程序

   ```bash
   $ hadoop jar  maprdemo-1.0-SNAPSHOT.jar
    com.neuedu.WordcountDriver /a.txt /output
   ```

6. 检查运行结果

> 作业：
>
> 要彻底理解mapreduce思想，请编写一个mapreduce应用：
>
> 需求：将一个包含了多张扑克牌的文件按照花色进行统计，计算出每种花色的牌数量

## Hadoop序列化

### 什么是序列化

​	**序列化**就是**把内存的对象，转换成字节序列**（或其他数据传输协议）以便于存储到磁盘（持久化）和网络传输

​	**反序列化**就是将收到的字节序列（或其他传输协议）或者是**磁盘的持久化数据，转换成内存中的对象**。

> 对于java应用而言，就是将内存中的对象数据转换成特定格式，并且持久化或者通过RPC（远程过程调用）将数据发送给其他异构或同构的服务。

### Hadoop的序列化

​	java通过实现`Serializable`接口也可以实现序列化，但是这个序列化过于重量级，一个对象一旦被序列化后，其文件内部包含了太多额外的信息，显然不便于网络高效传输，所以，hadoop开发了一套序列化机制（Writable）。

> 试着比较下两种序列化生成的文件大小，就会发现，java序列化后的文件大约是hadoop的4倍。

#### hadoop序列化特点

1. 紧凑：高效实用存储空间。
2. 快速：读写数据的额外开销小。
3. 可扩展：随着通信协议的升级而升级。
4. 互操作：支持多语言的交互。

### 自定义bean对象序列化

​	在企业开发中往往常用的基本序列化类型不能满足所有需求，比如在Hadoop框架内部传递一个bean对象，那么该对象就需要实现序列化接口。

具体实现bean对象序列化步骤如下7步。

（1）**必须实现`Writable`接口**

（2）反序列化时，需要反射调用空参构造函数，所以必须有空参构造

```java
public FlowBean() {	
    super();
}
```

（3）重写序列化方法

```java
@Override
public void write(DataOutput out) throws IOException {	
    out.writeLong(upFlow);	
    out.writeLong(downFlow);	
    out.writeLong(sumFlow);
}
```

(4) 重写反序列化方法

```java
@Override
public void readFields(DataInput in) throws IOException {	
    upFlow = in.readLong();	
    downFlow = in.readLong();
    sumFlow = in.readLong();
}
```

**（5）注意反序列化的顺序和序列化的顺序完全一致**

（6）要想把结果显示在文件中，需要重写toString()，可用”\t”分开，方便后续用。

（7）如果需要将自定义的bean放在key中传输，则还需要实现Comparable接口，因为MapReduce框中的Shuffle过程要求对key必须能排序。详见后面排序案例。

```java
@Override
public int compareTo(FlowBean o) {
    // 倒序排列，从大到小	
    return this.sumFlow > o.getSumFlow() ? -1 : 1;
}
```

### 序列化案例

#### 1. 需求：

统计每一个手机号耗费的总上行流量、下行流量、总流量

1. 输入数据`phone_data.txt`如下：

   ```bash
   1	13736230513	192.196.100.1	www.neuedu.com	2481	24681	200
   2	13846544121	192.196.100.2			264	0	200
   3 	13956435636	192.196.100.3			132	1512	200
   4 	13966251146	192.168.100.1			240	0	404
   5 	18271575951	192.168.100.2	www.neuedu.com	1527	2106	200
   6 	84188413	192.168.100.3	www.neuedu.com	4116	1432	200
   7 	13590439668	192.168.100.4			1116	954	200
   8 	15910133277	192.168.100.5	www.hao123.com	3156	2936	200
   9 	13729199489	192.168.100.6			240	0	200
   10 	13630577991	192.168.100.7	www.shouhu.com	6960	690	200
   11 	15043685818	192.168.100.8	www.baidu.com	3659	3538	200
   12 	15959002129	192.168.100.9	www.neuedu.com	1938	180	500
   13 	13560439638	192.168.100.10			918	4938	200
   14 	13470253144	192.168.100.11			180	180	200
   15 	13682846555	192.168.100.12	www.qq.com	1938	2910	200
   16 	13992314666	192.168.100.13	www.gaga.com	3008	3720	200
   17 	13509468723	192.168.100.14	www.qinghua.com	7335	110349	404
   18 	18390173782	192.168.100.15	www.sogou.com	9531	2412	200
   19 	13975057813	192.168.100.16	www.baidu.com	11058	48243	200
   20 	13768778790	192.168.100.17			120	120	200
   21 	13568436656	192.168.100.18	www.alibaba.com	2481	24681	200
   22 	13568436656	192.168.100.19			1116	954	200
   ```

   > 输入数据格式
   >
   > 7 	13560436666	120.196.100.99		1116		 954			200
   >
   > id	手机号码		网络ip			      上行流量         下行流量             网络状态码

2. 期望输出数据格式

   ```
   13560436666 		1116		      954 			2070
   手机号码		    上行流量           下行流量		   总流量
   ```

#### 2. 需求分析

![](img/自定义序列化案例需求分析.png)

#### 3.  编写Mapreduce程序

1. 编写流量统计的bean对象

   ```java
   package com.neuedu.serialdemo.bean;
   
   import org.apache.hadoop.io.Writable;
   
   import java.io.DataInput;
   import java.io.DataOutput;
   import java.io.IOException;
   
   public class FlowWritable implements Writable {
   
       private Long upFlow;
       private Long downFlow;
   
       public Long getUpFlow() {
           return upFlow;
       }
   
       public void setUpFlow(Long upFlow) {
           this.upFlow = upFlow;
       }
   
       public Long getDownFlow() {
           return downFlow;
       }
   
       public void setDownFlow(Long downFlow) {
           this.downFlow = downFlow;
       }
   
       public Long getTotalFlow() {
           return totalFlow;
       }
   
       public void setTotalFlow(Long totalFlow) {
           this.totalFlow = totalFlow;
       }
   
       private Long totalFlow;
   
   
       @Override
       public void write(DataOutput dataOutput) throws IOException {
           dataOutput.writeLong(upFlow);
           dataOutput.writeLong(downFlow);
           dataOutput.writeLong(totalFlow);
       }
   
       @Override
       public void readFields(DataInput dataInput) throws IOException {
           upFlow = dataInput.readLong();
           downFlow = dataInput.readLong();
           totalFlow = dataInput.readLong();
       }
       @Override
       public String toString() {
           return upFlow + "\t" + downFlow + "\t" + totalFlow;
       }
   }
   
   ```

2. 编写Mapper类

   ```java
    public static class FlowMapper extends Mapper<LongWritable, Text, Text, FlowWritable> {
   
           private Text phone = new Text();
           private FlowWritable flow = new FlowWritable();
   
           @Override
           protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
               String[] fields = value.toString().split("\t");
               phone.set(fields[1]);
               long upFlow = Long.parseLong(fields[fields.length - 3]);
               long downFlow = Long.parseLong(fields[fields.length - 2]);
               long totalFlow = upFlow + downFlow;
               flow.setDownFlow(downFlow);
               flow.setTotalFlow(totalFlow);
               flow.setUpFlow(upFlow);
   
               context.write(phone, flow);
           }
       }
   ```

3. 编写Reducer类

   ```java
    public static class FlowReducer extends Reducer<Text, FlowWritable, Text, FlowWritable> {
   
           private FlowWritable value = new FlowWritable();
   
           @Override
           protected void reduce(Text key, Iterable<FlowWritable> values, Context context) throws IOException, InterruptedException {
               long sum_upFlow = 0;
               long sum_downFlow = 0;
               long sum_totalFlow = 0;
   
               for (FlowWritable fw : values) {
                   sum_upFlow += fw.getUpFlow();
                   sum_downFlow += fw.getDownFlow();
                   sum_totalFlow += fw.getTotalFlow();
               }
   
               value.setUpFlow(sum_upFlow);
               value.setDownFlow(sum_downFlow);
               value.setTotalFlow(sum_totalFlow);
   
   
               context.write(key, value);
           }
       }
   ```

4. 编写Driver

   ```java
   public class FlowDriver {
   
       public static void main(String[] args) throws IOException, ClassNotFoundException, InterruptedException {
           Configuration configuration = new Configuration();
           Job job = Job.getInstance(configuration);
   
           job.setJarByClass(FlowDemo.class);
   
           job.setMapperClass(FlowMapper.class);
           job.setReducerClass(FlowReducer.class);
   
           job.setMapOutputKeyClass(Text.class);
           job.setMapOutputValueClass(FlowWritable.class);
           job.setOutputKeyClass(Text.class);
           job.setOutputValueClass(FlowWritable.class);
   
           FileInputFormat.setInputPaths(job, new Path(args[0]));
           FileOutputFormat.setOutputPath(job, new Path(args[1]));
   
           boolean result = job.waitForCompletion(true);
           System.exit(result ? 0 : 1);
       }
   }
   ```

5. 测试检查输出

## MapReduce框架原理(重点)

### InputFormat数据输入

![](img/mapreducer路线图.png)

#### InputFormat的作用

> 思考：1G的数据，启动8个MapTask，可以提高集群的并发处理能力。那么1K的数据，也启动8个MapTask，会提高集群性能吗？MapTask并行任务是否越多越好呢？哪些因素影响了MapTask并行度？

​	Hadoop是一个分布式计算平台，mapreduce作为其计算逻辑核心，当然也是分布式的，每当一个`mapreduce`应用启动时，hadoop集群都要启动多个并行Map任务`MapTask`来处理计算，我们知道map阶段的数据是按照行来作为单位的，那么到底要启动多少个并行任务`MapTask`呢，换句话说，每一个MapTask处理多少数据呢？**`InputFormat`就是用来干这事的：在`MapReduce`应用启动阶段，对数据输入按照一点的规则进行切分，切分的数量会提交给`yarn`，最终决定`MapTas`k的并行数量（并行度）**

**注意**:这里所谓的数据切分，并不是真正意义上在磁盘上对文件进行切分，而只是在逻辑上对计算输入数据进行分片，最终用来确定`MapTask`的数量。

#### 切片与MapTask并行度决定机制

![](img/切片与maptask并行度决定机制.png)

**切片规则**：

1. 一个Job的Map阶段并行度由客户端在提交Job时的切片数决定

2. 每一个split切片分配一个MapTask并行实例处理

3. 默认情况下：切片大小=BlockSize（128m）

4. 切片时不考虑数据集整体，而是逐一对每一个文件单独切片

   > 例如：
   >
   > ​	一个文件夹有里有三个文件：A.mp4 (300m)  B.txt(10m)   C.txt(10m)
   >
   > 那么他的切片就是五片：A（0-128，128-256，256-300）B（10） C（10m） 

### Job源码分析过程

​	我们从`FlowDriver`类的`job.waitForCompletion()`方法开始进行debug，来深入了解切分逻辑

1. `FlowDriver`类

   ```java
   ...
   // job调用waitForCompletion开始提交mapreduce任务申请
   boolean result = job.waitForCompletion(true);
   ...
   ```

2. `Job`类

   `waitForCompletion()`内部

   ```java
   ...
   // 判断job是否已经定义完成：也就是在FlowDriver中是否定义了map和reducer类，是否定义了数据类型等
   if (state == JobState.DEFINE) {
   // 如果job已经定义完毕，就提交任务
         submit();
   }
   ...
   ```

   `submit()`方法内部

   ```java
   //在次确认状态是否为已定义
   ensureState(JobState.DEFINE);
   //兼容hadoop老版本的api，将其转换为新api
   setUseNewAPI();
   //建立与集群的连接：
   connect();
   
   ...
   ```

   `connect()`方法内部

   ```java
   //connect方法负责确定创建一个集群Cluster实例对象，如果是本地调试，返回一个本地集群，如果是连接hadoop集群，就返回一个hadoop集群对象
   if (cluster == null) {
       cluster = 
           ugi.doAs(new PrivilegedExceptionAction<Cluster>() {
               public Cluster run()
                   throws IOException, InterruptedException, 
               ClassNotFoundException {
                   return new Cluster(getConfiguration());
               }
           });
   }
   ```

   ![](img/本地集群对象.png)

   继续回到`submit`方法内部

   ```java
   final JobSubmitter submitter = 
       getJobSubmitter(cluster.getFileSystem(), cluster.getClient());
   status = ugi.doAs(new PrivilegedExceptionAction<JobStatus>() {
       public JobStatus run() throws IOException, InterruptedException, 
       ClassNotFoundException {
           //开始提交job
           return submitter.submitJobInternal(Job.this, cluster);
       }
   });
   ```

3. `JobSubmitter`类

   `submitJobInternal()`内部

   ```java
   //验证输出路径是否正确：比如输入路径是否已经存在
   checkSpecs(job);
   ...
   ```

   `checkSpecs`内部

   ```java
   ...
   //验证输出路径是否正确的核心代码
   output.checkOutputSpecs(job);
   ...
   ```

   `checkOutputSpecs()`内部

   ```java
   // Ensure that the output directory is set and not already there
   //确保output输出地址已经设置并且不存在
   Path outDir = getOutputPath(job);
   if (outDir == null) {
       throw new InvalidJobConfException("Output directory not set.");
   }
   
   ....
   //判断文件系统是否已存在输出路径文件夹，如果已存在就抛出异常
   if (outDir.getFileSystem(job.getConfiguration()).exists(outDir)) {
       throw new FileAlreadyExistsException("Output directory " + outDir + 
                                            " already exists");
   }
   ```

   回到`submitJobInternal()`内部

   ```java
   //确定切片规划文件所在路径
   Path jobStagingArea = JobSubmissionFiles.getStagingDir(cluster, conf);
   ```

   ![](img/确定切片规划文件所在路径.png)

   可以看到在项目工程目录所在盘符下有如下文件夹

   ![](img/staging路径.png)

   > 这个文件夹下回存放路径规划文件`job.split`和`job.splitmetadata`，以及`jobid`文件,还有job的相关hadoop配置参数文件`job.xml`

   ```java
   ...
   // 创建jobid，并创建job路径存放jobid
   JobID jobId = submitClient.getNewJobID();
   ...
   //拷贝jar包到集群，要让集群节点执行mapreduce，当然得有jar包
   copyAndConfigureFiles(job, submitJobDir);
   ...
   //开始计算切片数量
   int maps = writeSplits(job, submitJobDir);
   ...
   ```

   `writeSplits()`方法内部

   ```java
   ...
   // 计算切片数量
   maps = writeNewSplits(job, jobSubmitDir);
   ...
   ```

   `writeNewSplits()`内部

   ```java
   ...
   // InputFormat出现了，由他来负责切分
   InputFormat<?, ?> input =
       ReflectionUtils.newInstance(job.getInputFormatClass(), conf);
   //真正的切片方法
   List<InputSplit> splits = input.getSplits(job);
   ```

   可以看到由于我们的输入是一个`phone_data.txt`文件，因此InputFormat的属性类是`TextInputFormat`

   ![](img/InputFormat实现类.png)

   > InputFormat还有很多实现类，我们也可以自定义，也就是我们可以有自己的切片规则，后面再说

4. `InputFormat`类

   `getSplits()`方法内部

   ```java
   ···
   //定义切片的最大值和最小值,最大值就是long型数值的最大值，最小值会根据文件大小确定，一般是1
   long minSize = Math.max(getFormatMinSplitSize(), getMinSplitSize(job));
   long maxSize = getMaxSplitSize(job);
   ···
   //获取所有输入文件信息，并且进行迭代，确定每个文件的切分大小，
   //印证了之前所说的切分规则：不关注输入文件整体大小
   List<FileStatus> files = listStatus(job);
       for (FileStatus file: files) {
       ...
       	//获取块大小：默认128m
       	long blockSize = file.getBlockSize();
       	// 计算切片大小，
       	long splitSize = computeSplitSize(blockSize, minSize, maxSize); 
       	// 定义变量代表切片后剩余的未切分数据长度
           long bytesRemaining = length;
           //循环对文件进行切片，直到剩余数量除以切片大小的值小于blocksize的1.1倍，就不切割下去了
           while (((double) bytesRemaining)/splitSize > SPLIT_SLOP) {
               int blkIndex = getBlockIndex(blkLocations, length-bytesRemaining);
               splits.add(makeSplit(path, length-bytesRemaining, splitSize,
                                    blkLocations[blkIndex].getHosts(),
                                    blkLocations[blkIndex].getCachedHosts()));
               bytesRemaining -= splitSize;
           }
       ...
       }
   	
   ....
   ```

   思考：**为什么是1.1倍的blocksize而不是1个blocksize？**

   假设一个文件是128.01M，如果按照1倍来计算，就要有两个切片，这显然是不合理的，**为了保证不会出现过小的切片**，导致**加载数据的时间大于计算的时间**，故设置了1.1倍的切分计算

   >当切片计算完成后，就生成了切片规则，切片规则会以文件的形式保存在staging路径下
   >
   >![](img/切片规划文件.png)

   **重点**：如果集群中由yarn来调配资源，**那么切片资源规划文件会提交给yarn，并且由yarn的MrAppMaster根据切片规则计算开启MapTask的个数**

5. 回到`JobSubmitter`类

   回到`submitJobInternal`方法

   ```java
   ...
   //向Stag路径写XML配置文件
   writeConf(conf, submitJobFile);
   ...
   ```

   可以看到staging下的`job.xml`文件

   ![](img/job.xml.png)

   打开job.xml看一看，都是hadoop的配置参数

   > hdfs-default.xml、mapred-default.xml、yarn-default.xml是默认的配置参数，它们都在hadoop的核心依赖包中保存

   ```xml
   <?xml version="1.0" encoding="UTF-8" standalone="no"?><configuration>
   <property><name>dfs.journalnode.rpc-address</name><value>0.0.0.0:8485</value><source>hdfs-default.xml</source></property>
   <property><name>yarn.ipc.rpc.class</name><value>org.apache.hadoop.yarn.ipc.HadoopYarnProtoRPC</value>
   <source>yarn-default.xml</source></property>
   <property><name>mapreduce.job.maxtaskfailures.per.tracker</name><value>3</value><source>mapred-default.xml</source></property>
   <property><name>yarn.client.max-cached-nodemanagers-proxies</name><value>0</value>...
   ```

   

   ```java
   ...
   //提交job，返回提交状态
   status = submitClient.submitJob(
       	jobId, submitJobDir.toString(), job.getCredentials());
   ```

   此时状态会变成`RUNNING`,也就是开始执行mapreduce

   ![](img/running状态.png)

#### 总结源码分析

![](img/job源码分析.png)

1. job调用submit方法开始提交任务

2. 确认cluster种类是本地还是集群yarn

3. 创建staging目录用于存放jobid、切片规划文件、job的hadoop参数配置、运行jar包

4. 生成jobid，并生成jobid文件

5. 遍历输入数据中的每一个文件

6. 计算每一个文件的切片，也就是规划切片，将规划切片文件保存到staging文件夹

   > 计算剩余文件长度是否大于块的1.1倍，不大于就停止切片

7. 生成job的hadoop配置文件`job.xml`

8. 提交job任务

9. yarn读取切片规划文件，`MrAppMaster`根据切片规划文件**计算开启`MapTask`的数量。**