package edu.njnu.service;

import edu.njnu.dao.RushRecordDao;
import edu.njnu.model.RushRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
public class RushRecordService {


    @Autowired
    private RushRecordDao dao;

    /**
     * 抢购服务
     * @return
     */
    public boolean rush(RushRecord rushRecord){
        //1.减库存
        Integer count = dao.updateGood(rushRecord.getGoodId());

        //2 判断是否有更新成功的记录，count>0;
        if(count>0){
            //3. 生成抢购记录
            //设置createtime
            rushRecord.setCreateTime(new Date());
            dao.insertRushRecord(rushRecord);
            return true;
        }

        return false;

    }

}
