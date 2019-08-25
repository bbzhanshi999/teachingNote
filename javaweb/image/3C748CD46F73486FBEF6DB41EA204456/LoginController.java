package com.neusoft.book.controller;

import com.neusoft.book.entity.User;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 处理登录请求的Servlet
 * Created by Administrator on 2018/6/23 0023.
 */
//映射路径： /login
@WebServlet("/login")
public class LoginController extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        this.doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //处理登录请求：

        //获得提交的username和passsword
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String remember = req.getParameter("rememberMe");

        //到数据库当中查找是否有复合username和password的user信息存在

        //假设查询成功了 javabean把user信息封装分返回
        User user = null;
        user = new User(username, password);


        //判断user对象是否为空，如果不为空，就代表登录成功了；如果user是null，说明登录失败
        if (null != user) {

            //判断是否选中的rememberMe，选中了就将username加入cookie
            Cookie cookie = new Cookie("username",username);
            cookie.setPath(req.getContextPath());
            cookie.setMaxAge(60*60*24);



            //加入到response对象
            resp.addCookie(cookie);

            //请求跳转的两种方式：请求重定向，请求转发

            //请求重定向
            resp.sendRedirect(req.getContextPath() + "/bookList.jsp");
            
            /*resp.setStatus(resp.SC_FOUND);
            resp.setHeader("Location","http://www.baidu.com");*/

        } else {

            //通过请求转发返回login.jsp
            RequestDispatcher requestDispatcher = req.getRequestDispatcher("/login.jsp");
            requestDispatcher.forward(req, resp);
        }

    }
}
