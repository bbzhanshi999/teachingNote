# kubernetes应用快速入门

## 1.kubectl命令

kubectl命令时api server的客户端，通过kubectl可以访问、查询、管理、维护kubernetes集群中的资源和对象

### 1.1 kubectl常用命令

打开终端，输入

```bash
kubectl
--------------
Basic Commands (Beginner):
  create         Create a resource from a file or from stdin.
  expose         Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
  run            Run a particular image on the cluster
  set            Set specific features on objects
....
```

可以看到，kubectl的命令有很多，并且有解释

#### describe命令

```bash
kubectl describe [type] [object]
```

通过describe命令可以查询各对象的详细信息状态，通常用于解决问题时，比如某一个pod始终没有就绪，那么就要检查pod状态

```bash
kubectl describe pod podName
```

查询某个节点的状态

```bash
kubectl describe node node102
```

#### cluster-info命令

用于查询集群状态

kubectl cluster-info

```bash
kubectl cluster-info
```

## 2. 快速启动应用

### 2.1 kubectl run命令

输入```kubectl run --help``` 命令，检查结果

```bash
Examples:
  # Start a single instance of nginx.
  kubectl run nginx --image=nginx 
  //第一个nginx代表的是deployment的名称，第二个是镜像的名称，和docker一样
  
  # Start a single instance of hazelcast and let the container expose port 5701 .
  kubectl run hazelcast --image=hazelcast --port=5701
  
  # Start a single instance of hazelcast and set environment variables "DNS_DOMAIN=cluster" and "POD_NAMESPACE=default"
in the container.
  kubectl run hazelcast --image=hazelcast --env="DNS_DOMAIN=cluster" --env="POD_NAMESPACE=default"
  
  # Start a single instance of hazelcast and set labels "app=hazelcast" and "env=prod" in the container.
  kubectl run hazelcast --image=hazelcast --labels="app=hazelcast,env=prod"
  
  # Start a replicated instance of nginx.
  kubectl run nginx --image=nginx --replicas=5 //启动五个pods
  
  # Dry run. Print the corresponding API objects without creating them.
  kubectl run nginx --image=nginx --dry-run //dry run相当于预演模式，相当于正式运行前的测试，实际上不会
  
  # Start a single instance of nginx, but overload the spec of the deployment with a partial set of values parsed from
JSON.
  kubectl run nginx --image=nginx --overrides='{ "apiVersion": "v1", "spec": { ... } }'
  
  # Start a pod of busybox and keep it in the foreground, don't restart it if it exits.
  kubectl run -i -t busybox --image=busybox --restart=Never 
  //restart never表示如果某一个pod挂了，不会再补一个
  
  # Start the nginx container using the default command, but use custom arguments (arg1 .. argN) for that command.
  kubectl run nginx --image=nginx -- <arg1> <arg2> ... <argN>
  
  # Start the nginx container using a different command and custom arguments.
  kubectl run nginx --image=nginx --command -- <cmd> <arg1> ... <argN>
  
  # Start the perl container to compute π to 2000 places and print it out.
  kubectl run pi --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
  
  # Start the cron job to compute π to 2000 places and print it out every 5 minutes.
  kubectl run pi --schedule="0/5 * * * ?" --image=perl --restart=OnFailure -- perl -Mbignum=bpi -wle 'print bpi(2000)'
  // 创建了一个job，定时控制器
  .......
```

可以发现，kubectl为我们提供了很多nginx应用的示例，参考:http://docs.kubernetes.org.cn/468.html

### 2.2  运行nginx

```bash
kubectl run nginx-deploy --image=nginx:1.14-alpine --port=80 --replicas=1 --dry-run=true

deployment.apps/nginx-deploy created (dry run)
```

继续运行：

```bash
kubectl run nginx-deploy --image=nginx:1.14-alpine --port=80 --replicas=1

deployment.apps/nginx-deploy created
```

查看pods

```bash
kubectl get pods -o wide
------------------------
NAME                            READY   STATUS    RESTARTS   AGE     IP           NODE      NOMINATED NODE   READINESS GATES
nginx-deploy-66ff98548d-5jns6   1/1     Running   0          8m42s   10.244.2.2   node103   <none>           <none>
//可以发现，这个pod运行在node103下
```

nginx-deploy-66ff98548d-5jns6虽然是pod的名称，但实际上代表了多层含义，不仅创建了pod，还创建了deployment控制器和replicasets控制器，创建了的对象有如下：

deployment：nginx-deploy 

replicasets：nginx-deploy-66ff98548d

应用pods：nginx-deploy-66ff98548d-5jns6

### 2.3 访问nginx服务

要想访问nginx，首先我们知道由于pods并没有对应的service，所以我们从外部是无法访问的，所以只能在集群内部进行访问，从上面的输入信息，我们可以看到，这个pod运行的地址为：```10.244.2.2``` ,而这个地址显然是flannel生产的pod-cidr所在网段，也就是pod之间进行通讯的网段

在pod运行节点node103上输入：

```bash
ifconfig
--------------------
cni0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1450
        inet 10.244.2.1  netmask 255.255.255.0  broadcast 0.0.0.0
        inet6 fe80::2c20:5eff:fe44:86fd  prefixlen 64  scopeid 0x20<link>
        ether 2e:20:5e:44:86:fd  txqueuelen 1000  (Ethernet)
        RX packets 1  bytes 28 (28.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8  bytes 656 (656.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

可以看到，node103有一个cni0的虚拟网络适配器，地址：10.244.2.1，所以其对应的nginx pod 地址为10.244.2.2

任意一个节点输入：

```bash
curl http://10.244.2.2
-------------------------
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

### 2.4 外部访问nginx服务

