## AOP

## 1. 代理模式

代理(Proxy)是一种设计模式,提供了对目标对象另外的访问方式;即通过代理对象访问目标对象.这样做的好处是:可以在目标对象实现的基础上,增强额外的功能操作,即扩展目标对象的功能.
这里使用到编程中的一个思想:不要随意去修改别人已经写好的代码或者方法,如果需改修改,可以通过代理的方式来扩展该方法

举个例子来说明代理的作用:假设我们想邀请一位明星,那么并不是直接连接明星,而是联系明星的经纪人,来达到同样的目的.明星就是一个目标对象,他只要负责活动中的节目,而其他琐碎的事情就交给他的代理人(经纪人)来解决.这就是代理思想在现实中的一个例子

用图表示如下:

![img](images/代理.png)

代理模式的关键点是:代理对象与目标对象.代理对象是对目标对象的扩展,并会调用目标对象

### 1.1 静态代理

> 例子：
>
> CEO是公司的首席执行官，是公司的管理者之一，而ceo可以进行开会签字的事物，但是CEO公务繁忙，签字和开会有时候需要秘书去执行。
>
> 这里的**秘书**就是代理对象，秘书不仅要代替CEO做开会的事物和代签字的事物，但同时也要有自己的事情，比如开会的时候要做会议记录，签字的时候，要留下签字记录，这就好比是日志。

```java
public interface Manager {

    void meeting();

    void signature();
}
//------------------------------------
public class CEO implements Manager {
    public void meeting() {
        System.out.println("CEO出席会议");

    }

    public void signature() {
        System.out.println("CEO盖章签字");
    }
}
//---------------------------------------
public class Secretary implements Manager {

    private CEO ceo;

    public Secretary(CEO ceo) {
        this.ceo = ceo;
    }

    public void meeting() {
        System.out.println("记录会议开始时间为："+new Date());
        ceo.meeting();
        System.out.println("记录会议结束时间为："+new Date());
    }

    public void signature() {
        ceo.signature();
        System.out.println("签字时间为："+new Date());
    }
}
//------------
//演示静态代理
@Test
public void staticProxy(){
    Manager manager = new Secretary(new CEO());
    manager.meeting();
    manager.signature();
}
/*
记录会议开始时间为：Tue Sep 17 20:31:49 CST 2019
CEO出席会议
记录会议结束时间为：Tue Sep 17 20:31:49 CST 2019
CEO盖章签字
签字时间为：Tue Sep 17 20:31:49 CST 2019
*/
```

#### 静态代理总结:

1. 可以做到在不修改目标对象的功能前提下,对目标功能扩展.
2. 缺点:

- 因为代理对象需要与目标对象实现一样的接口,所以会有很多代理类,类太多.同时,一旦接口增加方法,目标对象与代理对象都要维护.

如何解决静态代理中的缺点呢?答案是可以使用动态代理方式

### 1.2 动态代理

#### 动态代理有以下特点:

1. 代理对象,不需要实现接口
2. 代理对象的生成,是利用JDK的API,动态的在内存中构建代理对象(需要我们指定创建代理对象/目标对象实现的接口的类型)
3. 动态代理也叫做:JDK代理,接口代理

#### JDK中生成代理对象的API

代理类所在包:`java.lang.reflect.Proxy`
`JDK`实现代理只需要使用`newProxyInstance`方法,但是该方法需要接收三个参数,完整的写法是:

```java
static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces,InvocationHandler h )
```

> 注意该方法是在Proxy类中是静态方法,且接收的三个参数依次为:
>
> - `ClassLoader loader,`:指定当前目标对象使用类加载器,获取加载器的方法是固定的
> - `Class<?>[] interfaces,`:目标对象实现的接口的类型,使用泛型方式确认类型
> - `InvocationHandler h`:事件处理,执行目标对象的方法时,会触发事件处理器的方法,会把当前执行目标对象的方法作为参数传入

```java
package com.neuedu;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Date;

//生产动态代理对象
public class ProxyFactory {

    //要被代理的对象
    private Object target;

    public ProxyFactory(Object target) {
        this.target = target;
    }


    public Object getProxyIntance() {
        return Proxy.newProxyInstance(
                this.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                new InvocationHandler() {
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        String methodName = method.getName();
                        Object result = null;
                        //如果是开会
                        if("meeting".equals(methodName)){
                            System.out.println("记录会议开始时间为："+new Date());
                            result = method.invoke(target,args);
                            System.out.println("记录会议结束时间为："+new Date());
                        }else if("signature".equals(methodName)){
                            result = method.invoke(target,args);
                            System.out.println("签字时间为："+new Date());
                        }
                        return result;
                    }
                });
    }
}
//--------------------
//演示JDK动态代理
@Test
public void jdkProxy(){
    Manager manager = new CEO();
    ProxyFactory factory = new ProxyFactory(manager);
    Manager proxySecretary = (Manager) factory.getProxyIntance();
    proxySecretary.signature();
    proxySecretary.meeting();
}
```

##### 总结：

JDK生成动态代理对象的前提是需要有接口，及其实现类，否则无法完成动态代理。

#### CGLIB动态代理

​	上面的静态代理和动态代理模式都是要求目标对象是实现一个接口的目标对象,但是有时候目标对象只是一个单独的对象,并没有实现任何的接口,这个时候就可以使用以目标对象子类的方式类实现代理,这种方法就叫做:Cglib代理

Cglib代理,也叫作子类代理,它是在内存中构建一个子类对象从而实现对目标对象功能的扩展.

- JDK的动态代理有一个限制,就是使用动态代理的对象必须实现一个或多个接口,如果想代理没有实现接口的类,就可以使用Cglib实现.
- Cglib是一个强大的高性能的代码生成包,它可以在运行期扩展java类与实现java接口.它广泛的被许多AOP的框架使用,例如Spring AOP和synaop,为他们提供方法的interception(拦截)
- Cglib包的底层是通过使用一个小而块的字节码处理框架ASM来转换字节码并生成新的类.不鼓励直接使用ASM,因为它要求你必须对JVM内部结构包括class文件的格式和指令集都很熟悉.

Cglib子类代理实现方法:
1.需要引入cglib的jar文件,但是Spring的核心包中已经包括了Cglib功能,所以直接引入`spring-core-3.2.5.jar`即可.
2.引入功能包后,就可以在内存中动态构建子类
3.代理的类不能为final,否则报错
4.目标对象的方法如果为final/static,那么就不会被拦截,即不会执行目标对象额外的业务方法.

代码示例:

```java
package com.neuedu;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;
import java.util.Date;

/**
 * 使用CGLIB实现动态代理
 */
public class CglibProxyFactory implements MethodInterceptor {

    //目标对象
    private Object target;

    public CglibProxyFactory(Object target) {
        this.target = target;
    }

    /**
     * 通过CGLIB的Enhancer加强类创建子类对象
     * @return
     */
    public Object getProxyInstance(){
        Enhancer en = new Enhancer();
        en.setSuperclass(target.getClass());
        //设置回调函数
        en.setCallback(this);
        //返回代理对象
        return en.create();
    }

    //设置拦截规则
    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        String methodName = method.getName();
        Object result = null;
        //如果是开会
        if("meeting".equals(methodName)){
            System.out.println("记录会议开始时间为："+new Date());
            result = method.invoke(target,objects);
            System.out.println("记录会议结束时间为："+new Date());
        }else if("signature".equals(methodName)){
            result = method.invoke(target,objects);
            System.out.println("签字时间为："+new Date());
        }
        return result;
    }
}
//-----------------------------
//演示动态代理
/**
     * 演示CGLIB动态代理
     */
@Test
public void cglibProxy(){
    CEO2 ceo = new CEO2();
    CglibProxyFactory factory = new CglibProxyFactory(ceo);
    CEO2 proxySecretary = (CEO2) factory.getProxyInstance();
    proxySecretary.signature();
    proxySecretary.meeting();
}

```

## 2. `spring AOP`

```java
package com.neuedu.aop;

import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * 创建一个切面
 */
@Aspect
@Component
public class MyAspect {

    //设置通知和切点
    @After("execution(public void com.neuedu.aop.CEO3.signature())")
    public void afterSign(){
        System.out.println("签字时间为："+new Date());
    }
    //设置通知和切点
    @After("execution(public void com.neuedu.aop.CEO3.signature(..)) && args(file)")
    public void afterSign2(String file){
        System.out.println(file+"，签字时间为："+new Date());
    }
}
//-----------------------------------
package com.neuedu.aop;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy
@ComponentScan("com.neuedu")
public class AppConfig {
}
//----------------------------------------
@Test
public void aop(){
    AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
    CEO3 ceo = context.getBean(CEO3.class);
    ceo.signature();
    ceo.signature("辞职信");
}
```

