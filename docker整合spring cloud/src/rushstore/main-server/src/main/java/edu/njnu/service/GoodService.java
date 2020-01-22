package edu.njnu.service;

import edu.njnu.dao.GoodDao;
import edu.njnu.model.Good;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodService {

    @Autowired
    private GoodDao goodDao;

    public List<Good> findList(){
        return goodDao.findList();
    }
}
