package edu.njnu.service;

import edu.njnu.dao.UserDao;
import edu.njnu.model.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired //自动装配注解，spring会自动注入当前类型的实例对象
    private UserDao userDao;

    /**
     * 根据条件查询数据
     * @param condition
     * @return
     */
    public UserInfo find(UserInfo condition){
        return userDao.find(condition);
    }
}
