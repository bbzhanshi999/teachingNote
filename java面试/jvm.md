# JVM虚拟机相关

![](F:\teachingNote\java面试\img\jdk体系结构.jpg)

![](F:\teachingNote\java面试\img\helloworld例子.png)

![](F:\teachingNote\java面试\img\jvm内存模型.png)

```java
public class Math{
    
    public static int initData = 666;
    public static User user = new User();
    
    public int compute(){
        int a = 1;
        int b = 2;
        int c = (a+b)*20;
        return c;
    }
    
    public static void main(String[] args){
        Math math = new Math();
        math.compute();
    }
    
    
}
```

![](F:\teachingNote\java面试\img\栈内存结构.png)

## 程序计数器

1.每一个线程独享一个程序计数器

2.程序计数器记录了当前线程运行的每一个指令的行号(内存地址指针)