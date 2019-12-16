# rke初始化kubernetes集群

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
   $ ntpdate 0.cn.pool.ntp.org
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

虚拟机配置：

|         | 内存 | 硬盘 | cpu  |
| ------- | ---- | ---- | ---- |
| master  | 4g   | 30gb | 4    |
| node102 | 2g   | 20gb | 2    |
| node103 | 2g   | 20gb | 2    |

> 安装虚拟机略过,**cpu必须两颗**

1. 安装ntp和ntpdate服务

   ```bash
   $ yum install -y ntp ntpdate
   ```

2. 关闭防火墙服务和自启动

   ```bash
   $ systemctl stop firewalld.service
   $ systemctl disable firewalld.service
   ```

#### 1.2 配置虚拟机静态ip和主机名（三台都需要）

```bash
//配置静态ip
$ vi /etc/sysconfig/network-scripts/ifcfg-ens33
--------------------------------
BOOTPROTO=none
IPADDR=192.168.134.xxx
DNS1=114.114.114.114
NETMASK=255.255.255.0

$ service network.service restart
```

```bash
$ vi /etc/hosts
-----------------------
192.168.134.1 mother
192.168.134.101 master101
192.168.134.102 node102
192.168.134.103 node103
```

#### 1.3 配置时间同步（三台都需要）

```bash
$ ntpdate 0.cn.pool.ntp.org
```

#### 1.4  关闭selinux

1. 禁用selinux：修改配置文件`/etc/sysconfig/selinux`，设置`SELINUX=disabled`。

#### 1.5 关闭 swap虚拟内存交换

```bash
#（1）临时关闭swap分区, 重启失效;
   swapoff  -a

#（2）永久关闭swap分区

 sed -ri 's/.*swap.*/#&/' /etc/fstab 
```

重启三台计算机

### 2.k8s docker安装

#### 2.1 yum镜像配置

> 可访问阿里云镜像搜索https://developer.aliyun.com/mirror

##### 2.1.1 docker-ce镜像

```bash
//root 用户登录
$ cd /etc/yum.repos.d/
$ wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

##### 2.1.2 kubernetes镜像

```bash
//root登录
$ cd /etc/yum.repos.d/
$ vim kubernetes.repo

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
> $ scp kubernetes.repo docker-ce.repo node103:/etc/yum.repos.d/
> $ scp kubernetes.repo docker-ce.repo node102:/etc/yum.repos.d/
> ```

#### 2.2  yum安装docker（所有节点）

```bash
$ yum install -y docker-ce
```

##### 配置docker国内镜像加速器

```bash
$ sudo mkdir -p /etc/docker
$ sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://p3jtjl41.mirror.aliyuncs.com"]
}
EOF
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

##### 启动docker

```bash
$ systemctl daemon-reload //重新加载daemon
$ service docker start
$ docker info //检查配置是否成功
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
$ cat /proc/sys/net/bridge/bridge-nf-call-iptables 
->1
$ cat /proc/sys/net/bridge/bridge-nf-call-ip6tables 
->1
```

如果不为1，通过如下命令修改

```bash
$ /etc/sysctl.conf <<'EOF'
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
$ sysctl -p
$ systemctl daemon-reload
$ systemctl restart docker
```

##### 设置docker开机自启动

```bash
$ systemctl enable docker
```

#### 2.3 配置用户组

此处默认安装docker前的配置修改已经完成。

1. rke安装需要新建用户并添加到docker组

   ```bash
   $ useradd kuber
   $ passwd kuber
   $ usermod -aG docker kuber
   ```

2. 添加一下sudo权限：

   ```bash
   $ vi /etc/sudoers
   //找到这一行："root ALL=(ALL) ALL"，
   //在下面添加"kuber ALL=(ALL) ALL"
   ```

3. 启动ipv4转发：CentOS7下可编辑配置文件/etc/sysctl.conf，添加：

   ```bash
   net.ipv4.ip_forward = 1              
   net.bridge.bridge-nf-call-ip6tables = 1
   net.bridge.bridge-nf-call-iptables = 1
   ```

4. 执行```sudo sysctl -p``` 立刻生效。
   

#### 2.4 配置master免密连接node

接下来切换到前边自己建的普通用户：```su - kuber```。
在打算安装rke的那台机器执行：

```bash
$  ssh-keygen  #三次回车
```

然后发送公钥给另两台机器以及自己本身：

```bash
$  ssh-copy-id 用户名@机器IP #输入yes和密码
```


测试免密：

```bash
$ ssh 用户名@机器IP
```

#### 2.5 rke安装

下载rke,地址 https://github.com/rancher/rke/releases/tag/v1.0.0

```bash
$ wget https://github.com/rancher/rke/releases/download/v1.0.0/rke_linux-amd64
```

重命名rke，并且赋予权限

```bash
$ mv rke_linux-amd64 rke
$ chmod +x rke
```

#### 2.6 编写```cluster.yml```

在rke所在目录下编写```cluster.yml```

```bash
$ vim cluster.yml
```

```yaml
nodes: 
- address: 192.168.134.103
  user: kuber 
  role: 
  - worker 
  labels: 
    app: ingress 
- address: 192.168.134.102
  user: kuber 
  role: 
  - worker 
  labels: 
    app: ingress 
- address: 192.168.134.101
  user: kuber 
  role: 
  - controlplane 
  - etcd
	
services: 
  kubelet: 
    extra_args: {"authentication-token-webhook":"true"}
	
network: 
  plugin: flannel
  
ingress: 
  provider: nginx 
  node_selector: 
    app: ingress
```

#### 2.7 安装 rke

```bash
$ rke up --config cluster.yml
```

完成后当前目录会生成`kube_config_cluster.yml`文件和`cluster.rkestate`文件。

#### 2.8 安装kubectl

```bash
$ yum install -y kubectl
```

rke安装后，会在当前目录生成k8s集群配置文件`kube_config_cluster.yml`，拷贝这个文件并重命名为`~/.kube/config`。然后测试使用：

```bash
$ mkdir -p $HOME/.kube
$ sudo cp -i kube_config_cluster.yml $HOME/.kube/config
$ sudo chown kuber:docker $HOME/.kube/config

$ kubectl get node
```



### 3 检查集群运行状态

```bash
$ kubectl get pods -n kube-system -o wide
----------------------------------
NAME                                      READY   STATUS      RESTARTS   AGE     IP                NODE              NOMINATED NODE   READINESS GATES
coredns-5c59fd465f-2qmdd                  1/1     Running     0          14m     10.42.1.2         192.168.134.102   <none>           <none>
coredns-5c59fd465f-567gj                  1/1     Running     0          5m42s   10.42.2.4         192.168.134.103   <none>           <none>
coredns-autoscaler-d765c8497-jffwr        1/1     Running     0          14m     10.42.2.3         192.168.134.103   <none>           <none>
kube-flannel-bp7pl                        2/2     Running     0          15m     192.168.134.102   192.168.134.102   <none>           <none>
kube-flannel-kw45l                        2/2     Running     0          15m     192.168.134.103   192.168.134.103   <none>           <none>
kube-flannel-ltjjn                        2/2     Running     0          15m     192.168.134.101   192.168.134.101   <none>           <none>
metrics-server-64f6dffb84-cmxpr           1/1     Running     0          14m     10.42.2.2         192.168.134.103   <none>           <none>
rke-coredns-addon-deploy-job-9gfl9        0/1     Completed   0          14m     192.168.134.101   192.168.134.101   <none>           <none>
rke-ingress-controller-deploy-job-8pqd5   0/1     Completed   0          14m     192.168.134.101   192.168.134.101   <none>           <none>
rke-metrics-addon-deploy-job-6w828        0/1     Completed   0          14m     192.168.134.101   192.168.134.101   <none>           <none>
rke-network-plugin-deploy-job-bk42f       0/1     Completed   0          15m     192.168.134.101   192.168.134.101   <none>           <none>
```

可以发现，这时候pods中由三个flannel，显然这是node上的pods

### 4. 搭建应用

创建一个pod-demo.yaml

```bash
apiVersion: v1
kind: Pod
metadata:
  name: pod-demo
  namespace: default
  labels:
    app: myapp
    tier: frontend
spec:
  containers:
  - name: myapp
    image: nginx:1.14-alpine
  - name: busybox
    image: busybox:latest
    command:
    - "/bin/sh"
    - "-c"
    - "sleep 3600" 
```

```bash
$ kubectl create -f pod-demo.yml
```

