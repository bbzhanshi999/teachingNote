# spring
1. IOC & DI
- 1.1. 传统调用模式与依赖注入的对比（2008/7）
- 1.2. 类图：![image](G:/SSM备课/DemoClass.png)
- 1.3. IOC: 组件依赖关系的控制权进行了反转
- 1.4. DI: 将调用者为完成功能所依赖的实现类，在程序运行期间，由容器自动填充给调用者，这个就是依赖注入的核心思想.
- 1.5. 通过类图配合展示普通模式、工厂模式、IOC的区别（javaInterview/uml）
2. spring的配置
 - 2.1. 配置实现原理,自己实现读取xml以及反射new对象的过程（javaInterview/myspring）
 - 2.2. 配置的具体介绍（2008/22-39）
   - 2.2.1. 属性注入
     - 2.2.1.1 基本类型注入
     - 2.2.1.2 集合类型注入
     - 2.2.1.3 复杂类型注入
     - 2.2.1.4 [autowire自动装配](https://docs.spring.io/spring/docs/4.3.19.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#beans-factory-autowire)
   - 2.2.2. 构造函数注入
   - 2.2.3. 工厂方法注入，静态工厂方法注入,[factoryBean方式](https://docs.spring.io/spring/docs/4.3.19.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#beans-factory-extension-factorybean)
   - 2.2.4. bean实例化方式：prototype,singleton
   - 2.2.5. bean的懒加载：lazy-init,default-lazy-int
   - 2.2.6. bean的继承
 - 2.3. bean的生命周期（2008/40,41）
   - 2.3.1. BeanFactory
   - 2.3.2. ApplicationContext
   - 2.3.3. bean初始化
   - 2.3.4. bean的销毁
 - 2.4. [BeanFactory与ApplicationContext](https://www.cnblogs.com/xiaoxi/p/5846416.html)
 - 2.5. 获取资源（2008/49）
3. [注解配置Bean](https://docs.spring.io/spring/docs/4.3.19.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#beans-annotation-config)
 [注解含义](https://blog.csdn.net/briblue/article/details/73824058)
 - 3.1. 配置注解
```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd">

    <context:annotation-config/>

</beans>
```
 - 3.2.[@Component @Repository @Service @Controller](https://docs.spring.io/spring/docs/4.3.19.BUILD-SNAPSHOT/spring-framework-reference/htmlsingle/#beans-stereotype-annotations)
 - 3.3. 指定扫描路径
 
```
<context:component-scan base-package="org.example"/>
```


4. AOP
  - 4.1. [代理模式](https://www.cnblogs.com/cenyu/p/6289209.html)
    - 4.1.1. 静态代理
    
       以企业管理者和秘书作为例子

       优点：
       
       - 可以做到在不修改目标对象的功能前提下,对目标功能扩展。

       缺点：
       
       - 因为代理对象需要与目标对象实现一样的接口,所以会有很多代理类,类太多.同时,一旦接口增加方法,目标对象与代理对象都要维护

    - 4.1.2. java动态代理
    
       使用java 动态代理类java.lang.reflect.Proxy
       以及实现InvocationHandler，顺便提下proxy对象是什么，在invoke接口方法里调用proxy.toString()来演示
       
       ![image](G:/SSM备课/aop.png)
       ![image](G:/SSM备课/aop2.png)
       ![image](G:/SSM备课/aop3.png)
       
       - 4.1.2.1 讲解切点(pointcut)与连接点(joinpoint)的区别
       
          连接点是可以进行切面的位置，但并不一定要切，而切点是代码中根据条件确定需要切面的位置。
       
       - 

# spring mvc
1. spring mvc 框架概述（画流程图：ppt/1/8）
2. 搭建框架，完成hello world,从中解释个主要部件的配置（DispatcheServlet,HandlerMapping,HandlerAdapter,ViewResovler）
3. 