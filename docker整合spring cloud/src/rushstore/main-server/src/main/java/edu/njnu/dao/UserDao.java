package edu.njnu.dao;

import edu.njnu.model.UserInfo;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao {

    UserInfo find(UserInfo condition);
}
