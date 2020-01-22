package edu.njnu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient //声明加入到了微服务集群中，将自身注册至eureka
@MapperScan("edu.njnu.dao") //扫描dao所在的路径
public class MainServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainServerApplication.class,args);
    }
}
