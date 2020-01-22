package edu.njnu.web;

import edu.njnu.model.Good;
import edu.njnu.model.UserInfo;
import edu.njnu.service.GoodService;
import edu.njnu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController //声明这是一个控制器类，并且是Restful api的控制器，这个控制器可以自动进行数据格式装换
//可以将java的对象类型转换成JSON格式发送给前台
@RequestMapping("/api/main") //配置了控制器映射的请求的前缀
public class MainController {


    @Autowired
    private UserService userService;

    @Autowired
    private GoodService goodService;

    /**
     * 处理登录请求
     * @return
     */
    @PostMapping("login") //完整的请求映射：/api/main/Login
    public UserInfo login(@RequestBody UserInfo userInfo, HttpServletResponse response){
        //1.根据用户前台发送的用户名和密码到数据库当中去查询记录，
        UserInfo principal = userService.find(userInfo);
        //如果能够查到principal，就代表登录成功
        if(principal!=null){
            // 如果登录成功，将用户的id返回给前台
            return principal;
        }

        //如果登录失败，将响应的状态码设置为403
        response.setStatus(403);
        return null;
    }

    @GetMapping("good") //完整的路径/api/main/good
    public List<Good> findList(){
        return goodService.findList();
    }
}
