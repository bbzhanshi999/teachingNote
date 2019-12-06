# Kubernetes Pod控制器应用进阶

​	上节中，我们通过资源清单创建的pod是自主式pod，也就是不受控制器控制的pod，其实大部分的资源清单具有以下特点

- 一级字段：apiVersion（group/version),kind,metadata(name,namespace,labels,annotations...),spec,status(read only)

## pod中spec常用字段

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

- spec.containers <[]object>

  - name <string>

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
    > | `[/ep-1]`        | `[foo bar]` | `[/ep-2]`         | `[zoo boo]`    | `[ep-2 zoo boo]` |
  
    