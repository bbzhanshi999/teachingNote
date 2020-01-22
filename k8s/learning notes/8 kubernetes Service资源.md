# kubernetes Service资源

​	service之所以能将服务暴露到集群内部并且实现负载均衡，原因是因为k8s有自己的coreDns服务，来映射域名和虚拟ip地址

![](images/coreDns.PNG)

​	service 的网络称之为cluster netowork，service的ip是vitrual IP，

而service的网路是由kube-proxy来维护的。任何pod的资源变动，例如扩展重创建都会通知api-server，而每一个节点上运行的kube-proxy都会去通过**watch**监听的方式实时与api-server同步pod资源变动，并且将变动的信息，也就是pod的地址变更至service，而service所维护的虚拟ip与pod ip的映射实际上是交给宿主机内核空间的iptables或者ipvs或userspace来实现。

![](images/kube-proxy与apiServer的watch.PNG)



## 1. service 的工作模式

service的实现方式有三种：

1. userspace: 1.1版之前
2. iptables：1.1-1.10版，1.10版以上如无ipvs的情况下也会使用
3. ipvs：1.10版之后

### 1.1 userspace

用户空间的方式大致如下图几步：

1. 客户端pod想要访问Server Pod,首先发送的请求会被iptables拦截，iptables根据内部规则，将请求转给客户端pod所在节点的kube-proxy服务。
2. 本地kube-proxy通过watch与kube-apiServer通讯获得到了其他节点的kube-proxy服务地址，并且将请求转至其他kube-proxy（包括自己）
3. iptables会拦截此请求，并且根据内部规则，将请求转发给所有节点上的kube-proxy
4. kube-proxy收到请求后，才会去寻找对应的service映射的pod服务

![](images/userspace.PNG)

userspace的工作效率是比较低的，原因是因为中间转发过程较多，kube-proxy的负载较大，进和出都要经过它。

### 1.2 iptables

iptables方式与userspace的不同点在于，客户端pod请求Server pod时，iptables拦截请求后，不再转发给kube-proxy，而是事先在节点内核空间中已经直接注入了service的虚拟ip的dns规则，通过这个规则，直接施加对pod的负载均衡，之间转发给对应的pod。

![](images/iptables.PNG)

iptables 因为它纯粹是为防火墙而设计的，并且基于内核规则列表，集群数量越多性能越差。
一个例子是，在5000节点集群中使用 NodePort 服务，如果我们有2000个服务并且每个服务有10个 pod，这将在每个工作节点上至少产生20000个 iptable 记录，这可能使内核非常繁忙。

### 1.3  IPVS

​	IPVS基本上是一种高效的Layer-4交换机，它提供[负载平衡](https://baike.baidu.com/item/负载平衡)的功能,`IPVS`模式与`iptables`同样基于`Netfilter`，但是采用的`hash`表，因此当`service`数量达到一定规模时，hash查表的速度优势就会显现出来，从而提高`service`的服务性能。

![](images/ipvs.PNG)

>在kubernetes 1.11版本后，service的默认模式就是ipvs，我们可以在配置service时设置其具体工作模式，如果不设置默认采用ipvs，但如果你的宿主机中b并没有启动ipvs，那么k8s会将service的工作模式**自动降级为iptables**

## 2. service的创建

### 2.1 资源清单字段

> ```bash
> $ kubectl explain svc
> ```

#### spec:

- #### type:

  ExternalName, ClusterIP, NodePort, and LoadBalancer

### 2.2 ClusterIP

​	默认的service类型，每一个服务都会存在一个入口ip地址，以下通过为例子，映射通过ds-demo.yaml创建的redis服务,

创建redis-svc.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: default
spec:
  selector:
    app: redis
    role: logstor
  clusterIP: 10.97.97.97
  type: ClusterIP
  ports:
  - port: 6379
    targetPort: 6379
```

#### 启动service

```bash
$ kubectl apply -f redis-svc.yaml
```

查看服务描述

```bash
$ kubectl describe svc redis
-------------------
Name:              redis
Namespace:         default
Labels:            <none>
Annotations:       <none>
Selector:          app=redis,role=logstor
Type:              ClusterIP
IP:                10.96.97.97
Port:              <unset>  6379/TCP
TargetPort:        6379/TCP
Endpoints:         10.244.1.22:6379
Session Affinity:  None
Events:            <none>
```

可以看到Endpoints:         10.244.1.22:6379。

```bash
$ kubectl get pods -o wide | grep redis
-------------------------
redis-646cf89449-ntdmm          1/1     Running   0          85m   10.244.1.22   node202   <none>           <none>
```

可见通过selector选择器已经将redis的pod代理至services

> endpoints实际上是一种标准的k8s对象，他是服务于pod之间的中间层
>
> ![](images/endpoints.PNG)



