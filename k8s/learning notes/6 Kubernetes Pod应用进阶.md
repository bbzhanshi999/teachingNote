# Kubernetes Pod应用进阶

​	上节中，我们通过资源清单创建的pod是自主式pod，也就是不受控制器控制的pod，其实大部分的资源清单具有以下特点

- 一级字段：apiVersion（group/version),kind,metadata(name,namespace,labels,annotations...),spec,status(read only)

## Pod spec常用字段

> 通过命令```kubectl explain [字段名]```可以查询具体的详细解释
>
> 例如： ```kubectl explain pods.spec.containers```
>
> ```bash
> name <string> -required-
>      Name of the container specified as a DNS_LABEL. Each container in a pod
>      must have a unique name (DNS_LABEL). Cannot be updated.
> ```
>
> 可以看到，name属性字段类型string，并且required，也就是必须定义

- containers <[]object>

  - name string>

  - image <string>

  - imagePullPolicy      <string>  镜像获取策略

    - Always 永远从仓库下载，如果image tag是latest，那么默认就是Always
    - Never 从不从远程仓库下载
    - IfNotPresent 如果没有才去远程仓库下载，如果不是latest标签，默认是IfNotPresent 

  - ports        <[]Object> 暴露端口

    可以暴露多个端口，并且每个端口还有名字，**与docker不同的是**：我们不设置ports也不能阻止端口的暴露，因为pod之间是可以直接通讯的

    ```bash
    $ kubectl explain pods.spec.containers.ports
    -----------------------------------
    containerPort        <integer> -required-
    .....
    ```

    - containerPort        <integer> -required-
    - hostIP       <string>
    - hostPort     <integer>
    - name       <string>
    - protocol     <string>   Protocol for port. Must be UDP, TCP, or SCTP. Defaults to "TCP"

    书写格式,以第5章pod-demo.yaml为例

    ```yaml
    ....
    spec:
      containers:
      - name: myapp
        image: nginx:1.14-alpine
        ports: #这里注意，ports是个对象列表，因此需要用到- 
        - name: http
          containerPort: 80
        - name: https
          containerPort: 443
      - name: busybox
        image: busybox:latest
        command:
        - "/bin/sh"
        - "-c"
        - "echo $(date) >> /usr/share/nginx/html/index.html; sleep 5"
    ```

    以上的内容其实定义与否，80和443都会暴露。

  - command <[]string>  命令 args <[]string>

    这两个命令用于修改容器默认的运行方式，也就是entrypoint
  
    args相当于docker中的cmd
  
    command 相当于docker entrypoint 的定义，在docker的entrypoint的定义中，如果同时又cmd，那么cmd会作为参数传入entrypoint，在k8s中如果同时有command和args字段，那么args字段会作为参数传入entrypoint。具体规则见文档摘要：
  
    > This table summarizes the field names used by Docker and Kubernetes.
    >
    > | Description                         | Docker field name | Kubernetes field name |
    > | :---------------------------------- | :---------------- | :-------------------- |
    > | The command run by the container    | Entrypoint        | command               |
    > | The arguments passed to the command | Cmd               | args                  |
    >
    > When you override the default Entrypoint and Cmd, these rules apply:
    >
    > - If you do not supply `command` or `args` for a Container, the defaults defined in the Docker image are used.
    > - If you supply a `command` but no `args` for a Container, only the supplied `command` is used. The default EntryPoint and the default Cmd defined in the Docker image are ignored.
    > - If you supply only `args` for a Container, the default Entrypoint defined in the Docker image is run with the `args` that you supplied.
    > - If you supply a `command` and `args`, the default Entrypoint and the default Cmd defined in the Docker image are ignored. Your `command` is run with your `args`.
    >
    > Here are some examples:
    >
    > | Image Entrypoint | Image Cmd   | Container command | Container args | Command run      |
    > | :--------------- | :---------- | :---------------- | :------------- | :--------------- |
    > | `[/ep-1]`        | `[foo bar]` | <not set>         | <not set>      | `[ep-1 foo bar]` |
    > | `[/ep-1]`        | `[foo bar]` | `[/ep-2]`         | <not set>      | `[ep-2]`         |
    > | `[/ep-1]`        | `[foo bar]` | <not set>         | `[zoo boo]`    | `[ep-1 zoo boo]` |
    > | `[/ep-1]`        | `[foo bar]` | `[/ep-2]`         | `[zoo boo]`    | `[ep-2 zoo boo   |
    
  - restartPolicy        <string>
  
    pod的重启策略：
  
    Always：当容器停止运行时，总是重启pod
  
    OnFailure：当容器以非正常原因重启时，重启pod
  
    Never：不管什么情况，都不重启pod
  
    > 具体解释见：https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy
  
    **注意：**一旦一个pod创建绑定到了一个节点后，这个pod就不会再绑定到其他节点，换句话说，就是不可能在迁移到别的机器上，除非重新创建
  
  
  
## Pod metadata字段

- metadata <Object>

  - labels <map[string]string>

    labels是附加在资源之上的键值对，一个资源可以有多个标签，并且都可以交由选择器进行匹配，标签既可以在对象创建指定，也可以在创建之后通过命令进行增删改，标签可以用于多个维度的使用：

    1. 例如app标签指定应用程序性质，nginx redis tomcat .......
    2. tier指定pod是哪个层次的标签：frontend ，backend，store等，
    3. 标签开可以指定版本，release：stateble，canary，alpha，beta
    4. 环境标签evrionment,env:production development qa等

    **注**：标签的key长度要小于63字符，只能使用字母数字下划线点号连接线组成，只能以字母或数字开头

    标签中的value也不能超过63个字符，只能以字母数字开头和结尾，中间可以使用字母数字下划线连接线，**value值可为空**

    $ kubectl get pods --show-labels

    在命令后加```--show-labels```可以显示资源的标签

    ```bash
    $ kubectl get pods -l [selector='']
    ```

    上面的命令可以根据选择器选出符合选择器规则的pod，例如选择含有app label的pod

    ```bash
    $ kubectl get pods -l app
    ```

    **注意**：如果用-L而不是-l，那么代表展示所有pod的app属性值

    ```bash
    $ kubectl get pods -L app,run
    ------------------------------------
    NAME                            READY   STATUS    RESTARTS   AGE     APP     RUN
    busybox-deploy                  0/1     Error     0          2d13h           busybox-deploy
    nginx-deploy-66ff98548d-7pz9m   1/1     Running   2          2d12h           nginx-deploy
    nginx-deploy-66ff98548d-znjdm   1/1     Running   2          2d13h           nginx-deploy
    pod-demo                        2/2     Running   0          4m1s    myapp 
    ```

    我们可以通过命令给pod打标签

    ```bash
    $ kubectl label --help //获取命令使用说明
    
    $ kubectl label pod pod-demo release=canary //更新pod-demo的label release值位canary
    
    $ kubectl get pod pod-demo  --show-labels
    -----------------------
    NAME       READY   STATUS    RESTARTS   AGE    LABELS
    pod-demo   2/2     Running   2          155m   app=myapp,release=canary,tier=frontend
    ```

    修改已有标签的值需要添加--ovewrite参数

    ```bash
    $ kubectl label pod pod-demo release=stable --overwrite
    ------------
    pod/pod-demo labeled
    ```

    通过标签选择器来查询pod

    类似css选择器的设计思想，标签选择器种类：

    1. 等值关系：=，==，!=

       ```bash
       $ kubectl get pods -l release=stable --show-labels
       $ kubectl get pods -l release=stable,app=myapp --show-labels
       ```

    2. 集合关系：

       key in (value1,value2.....)

       key notin (value1,valu2......)

       ```bash
       $ kubectl get pods -l "release in (canary,beta,alpha)"
       $ kubectl get pods -l "release notin (canary,beta,alpha)"
       ```

    pod控制器，service都需要通过LabelSelector来关联对应的pod资源，而这种情况下，pod控制器和service都会用另外两个字段来进行嵌套：

    - matchLabels：直接给定键值

    - matchExpressions：基于给定的表达式来定义使用标签选择器，{key:"KEY",operator:"OPERATOR",values:[VAL1,VAL2,....]}

      常用operator：In NotIn,Exists,NotExists,后两种values字段值必须为空列表，前两种必须为非空

    > 标签不仅可以打在pods上，也可以打在各种资源上，例如打在node上
    >
    > ```bash
    > $ kubectl get nodes --show-labels
    > -------------------------
    > master101   Ready    master   3d13h   v1.16.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=master101,kubernetes.io/os=linux,node-role.kubernetes.io/master=
    > node102     Ready    <none>   3d12h   v1.16.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node102,kubernetes.io/os=linux
    > node103     Ready    <none>   3d12h   v1.16.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=node103,kubernetes.io/os=linux
    > 
    > $ kubectl label nodes node102 disktype=ssd
    > $ kubectl get nodes node102 --show-labels
    > ------------------------------------
    > node102   Ready    <none>   3d12h   v1.16.3   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,disktype=ssd,kubernetes.io/arch=amd64,kubernetes.io/hostname=node102,kubernetes.io/os=linux
    > ```
    >
    > 思考：为什么要给node打label？
    >
    > 原因是因为通过node标签，我们可以让集群应用创建时具有资源倾向性，例如，我们优先使用具有ssd固态存储介质的节点进行创建pod，我们还可以手动通过yaml来配置节点标签选择器，使得pod运行在特定的节点上
    >
    > ```bash
    > $ kubectl explain pods.spec.nodeSelector
    > ```
    >
    > 可以看到,通过定义字段nodeSelector，我们可以让资源运行在特定的node上
    >
    > 例如，让pod-demo只能运行在ssd节点上
    >
    > ```yaml
    > spec:
    > nodeSelector:
    >  disktype: ssd
    > ```
    >
    > ```bash
    > $ kubectl delete -f pod-demo.yaml
    > $ kubectl create -f pod-demo.yaml
    > $ kubectl get pods pod-demo -o wide
    > -------------------
    > pod-demo   2/2     Running   0          25s   10.244.1.8   node102   <none>           <none>
    > ```
    >
    > 可以发现，通过重新设置yaml中nodeSelector字段的值，我们的pod-demo铁定运行在了node102上，因为node102含有label ```disktype=ssd```
    >
    > 此外，我们还可以用nodeName字段直接选择节点，但不存在调度的意义

  - annotations  <map[string]string>

    与labels不同的是，它不能用于挑选资源对象，仅用于为对象提供“元数据”，且其键值大小没有限制，一些程序需要用到annotations。

    编辑annotation：

    ```yaml
    metadata:
      annotations:
        neuedu.com/created-by: "cluster admin" #添加应用创建的组织信息
    ```

    重新创建pod,查看annotations

    ```bash
    $ kubectl describe pods pod-demo
    -----------------------------
    Annotations:  neuedu.com/created-by: cluster admin
    ```

## Pod的声明周期

### 1.  常见的pod状态

- Pending:挂机状态，表示调度尚未完成，或者容器正在下载镜像
- Running: 运行状态
- Failed: pod内所有容器均已退出，但至少有一个容器退出失败状态
- Succeeded：pod内所有容器均成功执行后退出，且不会再重启
- Unknown：apiServer无法从kubelet进行通讯，或者kubelet无法向apiServer返回数据的情况下，报unknown

### 2.创建pod的阶段描述

​	初始化容器->主容器启动->主容器启动后钩子->主容器健康探测->主容器关闭->主容器关闭后钩子

![](images/pod声明周期阶段.PNG)

### 3. pod声明周期中的重要行为

#### 3.1  初始化容器

#### 3.2  容器探测

- liveness：存活性探测
- readiness： 就绪性探测

## 健康状态监测

​	3.2中已经介绍了监测容器健康状态的两种形式，存活性监测和就绪性监测，其实这两种都是利用了探针来进行监测，无非就是探测容器的网络状况，cpu和内存状况，进程是否正常等。

### 1. 探针的种类

- livenessProbe探针：用于判断容器是否存活，如果LivenessProbe探针探测到容器不健康， 则kubelet将杀掉该容
  器， 并根据容器的重启策略做相应的处理。 如果一个容器不包含LivenessProbe探针， 那么kubelet认为该容器的LivenessProbe探针返回的值永远是Success。  
- ReadinessProbe探针： 用于判断容器服务是否可用（Ready状态） ， 达到Ready状态的Pod才可以接收请求。 对于被Service管理的Pod， Service与Pod Endpoint的关联关系也将基于Pod是否Ready进行设置。 如果在运行过程中Ready状态变为False， 则系统自动将其从Service的后端Endpoint列表中隔离出去， 后续再把恢复到Ready状态的Pod加回后端Endpoint列表。 这样就能保证客户端在访问Service时不会被转发到服务不可用的Pod实例上。  

### 2. 探针实现的方式

- ExecAction： 在容器内部执行一个命令， 如果该命令的返回码为0， 则表明容器健康。  
- TCPSocketAction： 通过容器的IP地址和端口号执行TCP检查， 如果能够建立TCP连接， 则表明容器健康。  
- HTTPGetAction： 通过容器的IP地址、 端口号及路径调用HTTP Get方法， 如果响应的状态码大于等于200且小于400， 则认为容器健康 。

### 3. livenessPobe

要设置livenessPobe 需要设置的参数为pods.spec.containers.livenessProbe

```bash
$ kubectl explain pods.spec.containers.livenessProbe
----------------------------
FIELDS:
   exec <Object>
     One and only one of the following should be specified. Exec specifies the
     action to take.
   //需要执行的探测动作
   failureThreshold     <integer>
     Minimum consecutive failures for the probe to be considered failed after
     having succeeded. Defaults to 3. Minimum value is 1.
  //探测几次不成功算失败
   httpGet      <Object>
     HTTPGet specifies the http request to perform.

   initialDelaySeconds  <integer>
     Number of seconds after the container has started before liveness probes
     are initiated. More info:
     https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
  //第一次探测要延迟多长时间，往往要等主容器执行后过一段使劲踩探测
   periodSeconds        <integer>
     How often (in seconds) to perform the probe. Default to 10 seconds. Minimum
     value is 1.
  // 每一次探测间隔多长时间
   successThreshold     <integer>
     Minimum consecutive successes for the probe to be considered successful
     after having failed. Defaults to 1. Must be 1 for liveness and startup.
     Minimum value is 1.

   tcpSocket    <Object>
     TCPSocket specifies an action involving a TCP port. TCP hooks not yet
     supported
  //tcp探测方式，多用于web应用
   timeoutSeconds       <integer>
     Number of seconds after which the probe times out. Defaults to 1 second.
     Minimum value is 1. More info:
     https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle#container-probes
```

#### 3.1 exec 探针执行逻辑

```bash
$ kubectl explain  pods.spec.containers.livenessProbe.exec
----------------------------------
DESCRIPTION:
     One and only one of the following should be specified. Exec specifies the
     action to take.

     ExecAction describes a "run in container" action.

FIELDS:
   command      <[]string>
     Command is the command line to execute inside the container, the working
     directory for the command is root ('/') in the container's filesystem. The
     command is simply exec'd, it is not run inside a shell, so traditional
     shell instructions ('|', etc) won't work. To use a shell, you need to
     explicitly call out to that shell. Exit status of 0 is treated as
     live/healthy and non-zero is unhealthy.
```

可见，通过command运行的命令来检测是否存活。

##### execAction例子

```bash
$ vim liveness-exec.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec-pod
  namespace: default
spec:
  containers:
  - name: liveness-exec-container
    image: busybox:latest
    imagePullPolicy: IfNotPresent
    command: ["/bin/sh","-c","touch /temp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 3600"]
    livenessProbe:
      exec:
        command: ["test","-e","/tmp/healthy"]
      initialDelaySeconds: 2
      periodSeconds: 3
```

```bash
$ kubectl create -f liveness-exec.yaml
$ kubectl describe pods liveness-exec-pod
-----------------------
Last State:     Terminated
      Reason:       Error
      Exit Code:    137
      Started:      Sun, 08 Dec 2019 09:47:01 -0500
      Finished:     Sun, 08 Dec 2019 09:47:40 -0500
    Ready:          True
    Restart Count:  4
    Liveness:       exec [test -e /tmp/healthy] delay=2s timeout=1s period=3s #success=1 #failure=3
```

可以发现pod已经重启了4次，因为探测动作失败，获取不到/tmp/healthy文件，因此，判定存活失败，这时候按照默认的restartPolicy：Always，就会一直重新去创建pod

#### 3.2 TCPSocketAction探测执行逻辑

```bash
$ kubectl explain  pods.spec.containers.livenessProbe.tcpSocket
----------------------------------------
KIND:     Pod
VERSION:  v1

RESOURCE: tcpSocket <Object>

DESCRIPTION:
     TCPSocket specifies an action involving a TCP port. TCP hooks not yet
     supported

     TCPSocketAction describes an action based on opening a socket

FIELDS:
   host <string>
     Optional: Host name to connect to, defaults to the pod IP.
  //默认的主机就是当前pod的ip
   port <string> -required-
     Number or name of the port to access on the container. Number must be in
     the range 1 to 65535. Name must be an IANA_SVC_NAME.
 //端口号
```

可以看见，这个就是向pod中的web服务发送套接字，来看是否有返回数据，

#### 3.2 HTTPGetAction探测执行逻辑

```bash
$ kubectl explain  pods.spec.containers.livenessProbe.httpGet
---------------------
KIND:     Pod
VERSION:  v1

RESOURCE: httpGet <Object>

DESCRIPTION:
     HTTPGet specifies the http request to perform.

     HTTPGetAction describes an action based on HTTP Get requests.

FIELDS:
   host <string>
     Host name to connect to, defaults to the pod IP. You probably want to set
     "Host" in httpHeaders instead.

   httpHeaders  <[]Object>
     Custom headers to set in the request. HTTP allows repeated headers.

   path <string>
     Path to access on the HTTP server.
  //请求路径
   port <string> -required-
     Name or number of the port to access on the container. Number must be in
     the range 1 to 65535. Name must be an IANA_SVC_NAME.
	//这里可用端口名称的方式，就可以省略端口号
   scheme       <string>
     Scheme to use for connecting to the host. Defaults to HTTP.
```

##### httpGet例子：

```bash
$ vim liveness-httpGet.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-httpget-pod
  namespace: default
spec:
  containers:
  - name: liveness-httpget-container
    image: nginx:1.14-alpine
    imagePullPolicy: IfNotPresent
    command: ["/bin/sh","-c","touch /temp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 3600"]
    ports:
    - name: http
      containerPort: 80
    livenessProbe:
      httpGet:
        path: /index.html
        port: http
      initialDelaySeconds: 2
      periodSeconds: 3
```

```bash
$ kubectl create -f liveness-httpGet.yaml
$ kubectl describe pods liveness-httpGet-pod
--------------------
//显示正常信息
```

人为删除index.html

```bash
$ kubectl exec -it liveness-httpget-pod -- /bin/sh

/ # rm -f /usr/share/nginx/html/index.html
/ # exit
$ kubectl describe pods liveness-httpGet-pod
--------------------
Restart Count:  2
    Liveness:       http-get http://:http/index.html delay=2s timeout=1s period=3s #success=1 #failure=3
```

可见当你删除文件后，重启了1次

### 4. ReadinessProbe

​	readinessProbe是用于确认pod是否为Ready状态，默认的就绪性探测是只要pod类的容器启动了，那么这时候pod的状态就会被设置成Ready，这时候，假定容器中的真正的服务进程还没启动，例如mysql还没启动时，如果有客户端请求服务的话，那么服务显然是不能正常工作的。

​	因此，通过自定义的readinessProbe，我们可以定义当服务进程真正启动时，才会触发pod状态进入到Ready。

> ReadinessProbe和livenessProbe的探针方式是一样的

#### 3.1 httpGet例子

```bash
$ vim readiness-httpget.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: readiness-httpget-pod
  namespace: default
spec:
  containers:
  - name: readiness-httpget-container
    image: nginx:1.14-alpine
    imagePullPolicy: IfNotPresent
    ports:
    - name: http
      containerPort: 80
    readinessProbe:
      httpGet:
        path: /index.html
        port: http
      initialDelaySeconds: 2
      periodSeconds: 3
```

```bash
$ kubectl create -f  readiness-httpget.yaml
//故意删除index,html
$ kubectl exec -it readiness-httpget-pod  /bin/sh
/ # rm -f /usr/share/nginx/html/index.html
/ # exit
$ kubectl get pods
NAME                    READY   STATUS    RESTARTS   AGE
readiness-httpget-pod   0/1     Running   0          6m52s
```

可以发现，当你删除index.html后，pod的状态由于就绪性监测会发现获取不到数据了，那么pod就不再是Ready状态

```bash
$ kubectl exec -it readiness-httpget-pod  /bin/sh
/ # echo "haha" >> /usr/share/nginx/html/index.html
```

通过以上操作，将index.html恢复后，pod状态又会回到Ready

### 5.lifecycle 生命周期钩子

```bash
$ kubectl explain pods.spec.containers.lifecycle
------------------
DESCRIPTION:
     Actions that the management system should take in response to container
     lifecycle events. Cannot be updated.

     Lifecycle describes actions that the management system should take in
     response to container lifecycle events. For the PostStart and PreStop
     lifecycle handlers, management of the container blocks until the action is
     complete, unless the container process fails, in which case the handler is
     aborted.

FIELDS:
   postStart    <Object>
     PostStart is called immediately after a container is created. If the
     handler fails, the container is terminated and restarted according to its
     restart policy. Other management of the container blocks until the hook
     completes. More info:
     https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks

   preStop      <Object>
     PreStop is called immediately before a container is terminated due to an
     API request or management event such as liveness/startup probe failure,
     preemption, resource contention, etc. The handler is not called if the
     container crashes or exits. The reason for termination is passed to the
     handler. The Pod's termination grace period countdown begins before the
     PreStop hooked is executed. Regardless of the outcome of the handler, the
     container will eventually terminate within the Pod's termination grace
     period. Other management of the container blocks until the hook completes
     or until the termination grace period is reached. More info:
     https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/#container-hooks
```

从描述可见，lifecycle支持启动后postStart和终止前preStop

```bash
$ kubectl explain pods.spec.containers.lifecycle.postStart
-----------------------
FIELDS:
   exec <Object>
     One and only one of the following should be specified. Exec specifies the
     action to take.

   httpGet      <Object>
     HTTPGet specifies the http request to perform.

   tcpSocket    <Object>
     TCPSocket specifies an action involving a TCP port. TCP hooks not yet
     supported
```

可以发现，lifecycle支持的探针行为和readiness和liveness差不多，有三种

##### 5.1 postStart例子

利用busybox中的http命令，来运行一个web服务，由于没有目录和文件存在，所以我们需要在pod启动后，创建一些文件和目录，供httpd来运行，正好需要用到postStart

```bash
$ vim poststart-pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: poststart-pod
  namespace: default
spec:
  containers:
  - name: busybox-httpd
    image: busybox:latest
    imagePullPolicy: IfNotPresent
    lifecycle:
      postStart:
        exec:
          command: ['/bin/sh','-c','mkdir -p /data/web/html && echo "Home Page" >> /data/web/html/index.html']
    command: ['/bin/sh','-c','sleep 3600']
    # args: ['-f','-h /data/web/html']
```

> 这里注意一点，我们设置容器主进程所执行的命令直接sleep，原因是根据生命周期钩子的执行顺序，**先执行的是容器的主进程命令，而postStart钩子命令会在容器命令执行后执行**，所以，我们不可能期望先执行钩子命令，再执行主命令，因此，我们需要手动进入pod来执行httpd命令

```bash
$ kubectl exec -it poststart-pod  /bin/sh
/# ls /data/web/html/
-----------
index.html
```

可以发现，这里我们在postStart中创建的文件确实生成在容器中