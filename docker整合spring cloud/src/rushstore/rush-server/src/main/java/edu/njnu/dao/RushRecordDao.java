package edu.njnu.dao;

import edu.njnu.model.RushRecord;
import org.springframework.stereotype.Repository;

@Repository
public interface RushRecordDao {

    /**
     * 更新商品库存
     * @param goodId
     */
    Integer updateGood(Long goodId);


    /**
     * 创建新的抢购记录
     * @param rushRecord
     */
    void insertRushRecord(RushRecord rushRecord);
}
