# kubeadm初始化kubernetes集群

## 集群架构

![](images/搭建的集群架构.PNG)

## 网络架构

![](images/集群网络架构.PNG)

> 相关参考网址：
>
> https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.10.md

## 概要步骤

1. master、nodes：安装kubelet，kubeadm，docker
2. master：kubeadm init
3. nodes：kubeadm join

## 总体步骤

虚拟机：

​	master,node1,node

前提：

1. 基于主机名进行通信：```/etc/hosts```

2. 时间同步：

   ```bash
   ntpdate 0.cn.pool.ntp.org
   ```

3. 关闭firewalld和iptables.service

安装配置步骤：

1. etcd cluster，仅master节点

2. flannel，集群所有节点

3. 配置k8s的master：仅master节点

   kubernetes-master

   启动的服务：

   - kube-apiserver
   - kube-scheduler
   - kube-controller-manager

4. 配置k8s的node节点

   kuberneters-node

   先设定启动docker服务；

   启动k8s的服务：

   ​	kube-proxy，kubelet




## 详细步骤

### 1. 虚拟机安装

#### 1.1 安装vmware安装centos7，生成三台

> 安装虚拟机略过,**cpu必须两颗**

1. 安装ntp和ntpdate服务

   ```bash
   yum install -y ntp ntpdate
   ```

2. 关闭防火墙服务和自启动

   ```bash
   systemctl stop firewalld.service
   systemctl disable firewalld.service
   ```

#### 1.2 配置虚拟机静态ip和主机名（三台都需要）

```bash
//配置静态ip
vi /etc/sysconfig/network-scripts/ifcfg-ens33
BOOTPROTO=none
IPADDR=192.168.134.xxx
DNS1=114.114.114.114
NETMASK=255.255.255.0

service network.service restart
```

```bash
vi /etc/hosts
192.168.134.1 main
192.168.134.101 master101
192.168.134.102 node102
192.168.134.103 node103
```

#### 1.3 配置时间同步（三台都需要）

```bash
ntpdate 0.cn.pool.ntp.org
```

### 2.k8s docker安装

#### 2.1 yum镜像配置

> 可访问阿里云镜像搜索https://developer.aliyun.com/mirror

##### 2.1.1 docker-ce镜像

```bash
//root 用户登录
cd /etc/yum.repos.d/
wget https://mirrors.aliyun.com/dockerce/linux/centos/docker-ce.repo
```

##### 2.1.2 kubernetes镜像

```bash
//root登录
cd /etc/yum.repos.d/
vi kubernetes.repo

[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
```

> 以上两个镜像repo配置完后，复制给另外两个节点
>
> ```bash
> scp kubernetes.repo docker-ce.repo node103:/etc/yum.repos.d/
> scp kubernetes.repo docker-ce.repo node102:/etc/yum.repos.d/
> ```

#### 2.2  yum安装（所有节点）

```bash
yum install -y docker-ce kubeadm kubelet kubectl
```

#### 2.3  启动docker

>  ~~分割线中内容以失效，直接跳到下面步骤~~

------

##### ~~配置k8s仓库代理*~~

~~*启动之前，由于k8s要去仓库中下载k8s相关镜像，例如kubelet 等， 因此由于墙的愿因，需要配置代理*~~

```bash
vi /usr/lib/systemd/system/docker.service
//在Type=notify后插入
Environment="HTTPS_PROXY=http://www.ik8s.io:10080"
Environment="NO_PROXY=127.0.0.0/8,192.168.134.0/16"
```

##### ~~*拷贝至node*~~

```bash
scp /usr/lib/systemd/system/docker.service node102:/usr/lib/systemd/system/
scp /usr/lib/systemd/system/docker.service node103:/usr/lib/systemd/system/
```

------

> ~~分割线中内容以失效，直接跳到下面步骤~~

##### 启动docker

```bash
systemctl daemon-reload //重新加载daemon
service docker start
docker info //检查配置是否成功
-------------------------------
Architecture: x86_64
 CPUs: 1
 Total Memory: 972.4MiB
 Name: master101
 ID: 5Z2T:KXWY:FNRL:TPPB:FLEJ:NOGD:H277:FTWR:GQFL:GIBG:VY5T:LK6B
 Docker Root Dir: /var/lib/docker
 Debug Mode: false
 Registry: https://index.docker.io/v1/
```

##### 确保桥接的iptables和ip6tables值为1

```bash
cat /proc/sys/net/bridge/bridge-nf-call-iptables 
->1
cat /proc/sys/net/bridge/bridge-nf-call-ip6tables 
->1
```

##### 设置docker开机自启动

```bash
systemctl enable docker
```



#### 2.4 设定kubelet

> 早期k8s版本不允许主机节点使用swap虚拟内存交换，因此需要通过修改kubelet的额外配置忽略这一点
>
> ```bash
> rpm -ql kubelet //检查kubelet的安装文件目录
> 
> /etc/kubernetes/manifests
> /etc/sysconfig/kubelet
> /usr/bin/kubelet
> /usr/lib/systemd/system/kubelet.service
> 
> cat /etc/sysconfig/kubelet
> 
> KUBELET EXTRA ARGS=
> 
> //这里需要修改KUBELET EXTRA ARGS
> KUBELET_EXTRA_ARGS="--fail-swap-on=false"
> ```

##### 设置开机启动服务

```bash
systemctl enable kubelet
```

#### 2.5 初始化kubeadm

查询下kubeadm命令

```bash
kubeadm init --help
```

init命令

```bash
kubeadm init --pod-network-cidr=10.244.0.0/16 --ignore-preflight-errors=Swap
//这里pod-network-cidr指的是pod之间的通讯接口交由flannel管理，而flannel的默认网段既是10.244.0.0，第二个参数ignore-preflight-errors是用于配置关于Swap的错误请忽视的意思
```

###### **注意**：

由于不可描述的原因，gcr.io我们是访问不了的，因此会导致如下运行失败的结果：

```bash
error execution phase preflight: [preflight] Some fatal errors occurred:
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/kube-apiserver:v1.16.3: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/kube-controller-manager:v1.16.3: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/kube-scheduler:v1.16.3: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/kube-proxy:v1.16.3: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/pause:3.1: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/etcd:3.3.15-0: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
        [ERROR ImagePull]: failed to pull image k8s.gcr.io/coredns:1.6.2: output: Error response from daemon: Get https://k8s.gcr.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
, error: exit status 1
```

因此在这里要么你设置虚拟机的fq代理，要么采用如下办法解决问题：

###### 手动下载系统架构级pod所需镜像

```bash

```



