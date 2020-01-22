package edu.njnu;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication //所有springboot项目必须有这个声明
@EnableEurekaServer //代表这是一个注册中心
//alt+enter 快速fix
public class RegistryServerApplication {

    //psvm
    public static void main(String[] args) {
        SpringApplication.run(RegistryServerApplication.class,args);
    }
}
