package edu.njnu.dao;

import edu.njnu.model.Good;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository //不影响代码的实际运行
public interface GoodDao {

    /**
     * 查询所有商品
     * @return
     */
    List<Good> findList();
}
