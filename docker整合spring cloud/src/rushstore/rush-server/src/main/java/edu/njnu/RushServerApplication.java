package edu.njnu;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
@MapperScan("edu.njnu.dao")
public class RushServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(RushServerApplication.class,args);
    }
}
