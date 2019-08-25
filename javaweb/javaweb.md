day01

1.http协议，html，uri统一资源标识符（javaweb/02/23）

1.1 首先通过访问新浪网+画图解释访问的整个过程。

1.2 解释url的组成和规则，通过在本地硬盘创建page/1.html的例子来说明（javaweb/02/24）

1.3 解释相对路径和绝对路径的概念，通过在page文件夹下建立两个文件来说明,（javaweb/02/25）

1.4 通过ppt的图解释http协议及其组成,也可通过chrome调试工具展示http请求和响应体（javaweb/02/28,29），常用状态码ppt位置（javaweb 03/36）

1.4 打开chrome调试工具，展示新浪页面的源代码，展示html，打开ppt（web前台设计/03/6）以说明html是什么，可顺便在此让学生安装chrome，并说明chrome调试工具的基本使用

1.5 通过创建一个html，比如重写1.html（可以用eclipse，也可以不用）,说明结构，参加下图（web前台设计/03/9）

![img](image/24110438bfcc4151b8dac1bfeac751dd/clipboard.png)



2.web服务器概念。（web前台设计 02/12，如下图）

![img](image/8fa0d984d3d445e291ea7c0f606e2636/clipboard.png)

2.1 画下面的示意图，说明web服务器的作用

![img](image/6dd5c863cf5949c09ac588dd446a1007/clipboard.png)

2.2 实现一个服务器访问1.html([MyWebServer.note](note://3CA38FE3831142258FD70B808F421D28))（学生练习代码）



3.tomcat（javaweb 02/33）

3.1 tomcat如何安装启动（javaweb 02/34）（学生步骤）

3.2 tomcat 的目录结构（javaweb 02/36）

3.3 使用tomcat将之前的page文件夹运行起来，再次访问1.html（学生练习步骤）

3.4 在这里引入动态web服务的概念，然后引入javaweb和javaee的概念



4  servlet 接口

4.1 javaee的概念，javaweb所用到的javaee技术（servlet，jsp，jdbc，javaee容器）（javaweb 02/13,14,15,16）

4.2 解释一下javaee容器的作用（以javase main函数的例子，来说明servlet没有main函数，而类的创建，执行，销毁都是由容器来控制的）。然后引入tomcat的另一层含义：servlet和jsp容器，tomcat不仅是web服务器也可被叫做容器 

4.3  一个javaweb应用的标准目录结构，解释一下每个目录的作用以及web.xml的作用，在这里为了解释动态映射资源的概念可以虚拟一个业务需求（比如根据输入的url，显示不同的hello！{param}内容）。在tomcat 的webapp底下带着学生按照目录结构手动创建一个web服务（tomcat文件目录结构，web.xml在这里先找一个copy复制过来([web.xml模板.note](note://2D68CD26F3344B4890D3D350542BB4BB))，但暂时不解释xml的内容）（给学生时间把目录建好，并且拷贝web.xml）(学生创建目录结构)

![img](image/1608d9f70d6e4c6b959606bd81a6f7c7/clipboard.png)

4.4  开始讲解servlet(javaweb 03/4)，serlvet是什么参考ppt，servlet到底怎么用，参考javaee api，在这里结合实际工作或者项目经验，讲讲解决未知问题的思路。介绍servlet的描述，如作用，生命周期方法，看api，然后引入genericServlet和HttpServlet，然后手写一个继承genericServlet的代码（[HelloServlet.note](note://8B2FEF16144B4E15A561082FD4ADF606)），写代码后的编译注意，由于有javax包，所以要使用 set classpath = %classpath%；[servlet-api.jar的位置]， 编译命令是 javac  -d . Helloervlet.java,-d的意思是编译是带包名；（学生练习编码）

4.5  web.xml的配置规则（javaweb 03/14），通过查看tomcat examples里web.xml来讲解servlet的配置规则（解释servlet-name 和url-pattern的关系，要补充说下默认匹配），然后再按ppt补充下init-param和load-on-startup的用途，这里插入写实际编程思想，为什么要用load-on-startup，比如我们某一个servlet需要加载一些重量级资源，因此init方法执行时间较长，如果不配置loadonstartup，就会让第一个客户端等待很长时间，造成体验的问题。顺带介绍xml（javaweb 09/60）和dtd，schema的规则（[xml和dtd规则等.note](note://C1F0898D0B6A48E993541A43D5AED61C)）



day02

记住要点名，并且要录屏幕，回顾一下昨天的课程，讲一下昨天学什么做了什么，1.url-pattern中的最长路劲匹配解释一下，2.

然后再说一下init-params。3，详解一下注解式servlet。提问的方式来复习，问题如下：1.我们自己写的服务器用到了java基础中的哪两个技术或包？2.tomcat服务器在哪个配置文件中配置端口？3.简述一下编写一个servlet的步骤，4





4.6 servlet生命周期详解（javaweb 03/9），通过画下面的图来说明，其中init只被执行一次，destroy会在web服务挺掉的时候执行，service每次调用都会执行，可以在演示一下loadonstartup（这里可以选择性讲注解方式[Serlvet中WebServlet注解详解.note](note://08FB0245B73345E9870E71916204DCA1)）

![img](image/18536b9dd64245ee8da7539b5628720e/clipboard.png)



4.7 使用eclipse来创建web工程，并且在eclipse中配置tomcat，重写helloServlet，顺带讲解几个主要快捷键（学生练习步骤)；

4.8 讲一下init-param结合servletConfig的使用，写一段代码演示，着重强调这个东西可以什么,t通过将springmvc dispatcherServlet的例子，学生如果问tranisent大概解释一下，实际上为了序列化的时候不被序列化参考（http://www.importnew.com/21517.html）（学生动手写一个init-parma。并返回前台）

4.9 说一下servlet的并发问题，写演示代码，可以用sychronized同步代码块，也可以顺带讲一下SingleThreadModel

4.10在servlet API文档中查看HttpServlet，然后了解下doGet和doPost等方法，通过查看HttpServlet源码看service方法如何实现的（源码包在移动硬盘里），写一个继承httpServlet的servlet（学生练习）。

4.11 讲解request,responese的几个方法，并在4.8中调用几个方法演示（javaweb 03/21）（学生练习）

4.12 写一个提交注册的页面，然后配一个servlet。然后讲一下乱码问题（[http编码问题.note](note://19380977BB0846AB8B4C92A098EEB064)）







Day03



1 讲解servletContext对象，讲解一下通过servletContext对象的几个方法，着重讲：[**getInitParameter**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getInitParameter-java.lang.String-)**，**[**getMimeType**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getMimeType-java.lang.String-)**，**[**getRealPath**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getRealPath-java.lang.String-)**，**[**getResourceAsStream**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getResourceAsStream-java.lang.String-)**，**[**getResource**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getResource-java.lang.String-)**，**[**getResource**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#getResource-java.lang.String-)**，**[**removeAttribute**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#removeAttribute-java.lang.String-)**，**[**setAttribute**](https://javaee.github.io/javaee-spec/javadocs/javax/servlet/ServletContext.html#setAttribute-java.lang.String-java.lang.Object-)**，****getRequestDispatcher，**

2 讲解一下其中的方法，顺带讲一下context-param标签，这里重新设计一个需求：试着用servlet按照/WEB-INF/web.xml的路径读取受保护的web.xml（学生练习），同时要说明context-param的作用，以spring举例子，让后实现一个代码，读取context-param中jdbc.properties的位置，然后使用properties读取这个配置文件，然后拿到jdbc的参数（[jdbc.properties.note](note://BA0D61E2EF5A48FF9DFF425774E4C8EE)），这里与getClassLoader().getOutputStream搞出不同来（学生练习）;

3.response编码问题参考代码：（[reponse编码问题.note](note://F2A616F7FE5A43DF86A5EA9B35796AA6)）

4.使用reponse完成一个文件下载任务，content-disposition详解（https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Disposition）







 day04



1.用servlet返回一个随机验证码图片，打开doc，介绍几个需要用到的类和方法：

- [BufferedImage](https://docs.oracle.com/javase/8/docs/api/java/awt/image/BufferedImage.html)：缓存图片类
- [**getGraphics**](https://docs.oracle.com/javase/8/docs/api/java/awt/image/BufferedImage.html#getGraphics--)()方法：返回一个Graphics对象
- Graphics对象：代表一张图片
- [**drawString**](https://docs.oracle.com/javase/8/docs/api/java/awt/Graphics.html#drawString-java.lang.String-int-int-)**：输出string，x，y参数代表位置**
- [**drawRect**](https://docs.oracle.com/javase/8/docs/api/java/awt/Graphics.html#drawRect-int-int-int-int-)**：输出一个矩形**
- [**drawLine**](https://docs.oracle.com/javase/8/docs/api/java/awt/Graphics.html#drawLine-int-int-int-int-)**：输出一条线，干扰线**
- [**fillRect**](https://docs.oracle.com/javase/8/docs/api/java/awt/Graphics.html#fillRect-int-int-int-int-)**：填充矩形背景**
- [**setColor**](https://docs.oracle.com/javase/8/docs/api/java/awt/Graphics.html#setColor-java.awt.Color-)**：设置颜色**
- **Color对象：常量**
- **setFont：设置字体**
- **Font对象：看一下构造函数，顺便说一下|符号**
- **imageIo对象：输出bufferedimage，看write方法**



常用汉子码表和字符数组：（[java-常用汉字码表.note](note://E54545E171D0454CA2FB974EF1FB4BA4)）

实现图片后，在更新登录页面，添加img标签，并且增加禁止缓存响应头，然后设计手动点击图片更新，写一段javascript

2.通过上面的登录页面，然后加入请求转发和请求重定向的功能。

3.搞一个注册页面，用来复习几种表单类型（hidden,text,select,password,radio,checkbox,file,textarea），在文件上传的时候顺便提一下servlet 3.0新特性，利用request.getPart()获取流，以及@MultipartConfig注解enctype="multipart/form-data"（http://www.w3school.com.cn/tags/att_form_enctype.asp）

4.注册成功后，写一个请求重定向到登陆页面，登陆页面登录成功后使用请求转发到一个jsp页面，这里引入了jsp。

4.1设置一个需求，用request转发请求到首页jsp,在首页里显示“XX登录成功”。在这里引入request域

![img](image/b81a0028ca0448b4acd413ebd148a18d/clipboard.png)





5.介绍session 原理及cookie

5.1 cookie（javaweb 04/71）

![img](image/eeec9e51f00c4bdebd44af94b447a320/clipboard.png)

5.2 session (javaweb 04/57)

![img](image/3b076f8eb01f45d8a83aae45126b0647/clipboard.png)



5.3 设置一个cookie，显示上次访问的时间（学生练习）

![img](image/a1b28f06643d4187959677bcc03adb2e/clipboard.png)

5.4 写一个session例子，页面上一个加入购购物车和一个结账按钮，购物车加入session，点结账显示购买了什么（学生练习），说一下session的生命周期（由浏览器控制），以及配置<session-conifg>的方式设置session失效时间，以及session.invalidate（）方法的作用，说一下session的实现原理是cookie，下图：

![img](image/5201c4c139804b2aa405374d4d940d9f/clipboard.png)

5.5 如何验证验证码，在这里引入session域，可以说一下servletContext域





day05

回顾：1、session和cookie，说一下session和cookie的原理，设计一个小实验来证明session域的流转，只有调用getSession方法才会有session，不同的两个浏览器的验证码内容不一样（通过打印）

​    2、请求重定向和请求转发的原理和区别，思考一下，重定向后request.getAttribute()还有效吗？

​    3、三个域的解释 request，session，servletContext



1、jsp介绍（javaweb 04/13），通过显示当前时间的jsp例子来讲述jsp被翻译成servlet的原理

jsp最佳实践：

![img](image/11de681da640425a8c795fae1c7b9e0e/clipboard.png)



![img](image/743c27f906564feabbc0bcfcc8de0035/clipboard.png)



2.jsp语法

![img](image/38f74dc6031c4e2b8c6dc9d8b820301b/clipboard.png)



![img](image/9caeeb166e7b4b5eaba18728fe1a7d72/clipboard.png)



3.jsp page指令

![img](image/aad4e95ea7e1484d9037f9e02af98e26/clipboard.png)



![img](image/ffbeef7d1375480f8d47872429fe992d/clipboard.png)



![img](image/60a5b2add91c4333af669463be2c7568/clipboard.png)



![img](image/1f19e55f601546c8ad9192364888ae2f/clipboard.png)





3.1说一下jsp异常处理页面配置，两种方式，一个在page指令里，一个在web.xml中全局配置

![img](image/56c0ae0f1d0a45afa66bc42a64381c72/clipboard.png)

3.2 顺便说404的配置页面

![img](image/69e92a65d7154ec7811942f395c0e591/clipboard.png)



![img](image/ac2b325786c848a4a0e0315a8135d0b7/clipboard.png)

3.3 iserrorPage设置为true可以得到exception异常对象，说一下jsp九大隐式对象（javaweb 04/41）

3.4 设置内容和编码格式

![img](image/c7acf86e3b6a4290b197cc318c65eca0/clipboard.png)

3.5是否忽略el表达式

![img](image/8f931250bf7d4710bfb5d44656c4a712/clipboard.png)



3.6 jsp乱码，通过page指令中的pageEncoding属性

![img](image/2862675634064c21a78b4a2ff3fba462/clipboard.png)



![img](image/94c0a8f988a34a35af313dcb8a811b1f/clipboard.png)



4 include指令

![img](image/2769639c4a724772b728b406dacb3e13/clipboard.png)

4.1代码演示下静态包含和动态包含的区别<jsp:include page=”relativeURI” flush=”true” />



5、jsp九大隐式对象（javaweb 04/41）

![img](image/6fea1d77cbe8462cacfa57bfca53f820/clipboard.png)

5.1 out

![img](image/917053365ae04493bee5bdbd2dce300c/clipboard.png)



![img](image/0037675fbe4b43c28d2f081835fc17e9/clipboard.png)



![img](image/95343b93070d40e8906e3d8f124b13ad/clipboard.png)

jsp尽量通过out隐式对象输出，不要用response.out

![img](image/d95a9ce32639415f94aeff4999f061b0/clipboard.png)

5.2 pagecontext对象

![img](image/26d626e2dca047a0962ba200fd954fe2/clipboard.png)



![img](image/e054231e363f45be9c914bf714c7b6b9/clipboard.png)

pageContext对象的好处时写自定义标签类的时候可以只传一个参数

![img](image/16a98d8b6b7544caad60ccf89ac7da14/clipboard.png)

以下代码最后一行，描述了findAttribute的寻找顺序，从小到大，就是el表达式的依赖代码

![img](image/917c3c44c47643ff853e13b53986406e/clipboard.png)



![img](image/ac9060cd582045989fc1da3816500e90/clipboard.png)

6 jsp常用标签

![img](image/39f6e26ca56f4547834b4cfd82636a10/clipboard.png)



![img](image/fcf664e9fc9d4eef9c6787d2f78740aa/clipboard.png)



![img](image/c5b10960ea314884b0e0296ebb9b374d/clipboard.png)



![img](image/755f9ab077cd465e8681de9a4fd6cd17/clipboard.png)



![img](image/7001f7ec25f24fbead0f185a08946149/clipboard.png)



7 jsp映射

![img](image/a81e755eac3e4a739ad87493ba1a165a/clipboard.png)



![img](image/ab5874ad39a0462eba9cb7167511e456/clipboard.png)







下午：iintellij的安装，创建web应用，tomcat 的位置（Users\Administrator\.IntelliJIdea2018.1\system\tomcat）



8.EL表达式与JSTL[JSTL 表达式与 EL 语言EL 语言.note](note://4A111A53CE964A069DDA915D878DBDD6)（javaweb 07/10 08/12）

![img](image/0717d986d4284594a50a7ce6926549c2/clipboard.png)



![img](image/eaf7e110a7444cdd88983a867a59ac4c/clipboard.png)



![img](image/9c7f745541074453a99e468887837727/clipboard.png)



![img](image/debd827b59834bec89d22a36733cd589/clipboard.png)



![img](image/881187d993d14290b74ca844eb2dfcb7/clipboard.png)



![img](image/4f712666b1a24c05bd0691ee99fdb11e/clipboard.png)



![img](image/1116bd174587497b8cf0c43d0b799d35/clipboard.png)

<%@ **taglib** prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

![img](image/eab09e0e34c94def8192ecd13537e507/clipboard.png)



![img](image/5246f6d9cb8d4b6ea478c351824f59d2/clipboard.png)



![img](image/e5ee60b426754a4fb63d6bd7c07e7e11/clipboard.png)



![img](image/8e3a28c205f64cae8538659beb21c682/clipboard.png)

\9. ajax写法









 MVC

![img](image/8eb9d7cdf6bc42178289239c905a7c36/clipboard.png)