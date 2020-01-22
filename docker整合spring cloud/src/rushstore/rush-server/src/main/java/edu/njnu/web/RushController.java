package edu.njnu.web;

import edu.njnu.model.RushRecord;
import edu.njnu.service.RushRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rush")
public class RushController {

    @Autowired
    private RushRecordService rushRecordService;

    @PostMapping("")
    public String rush(@RequestBody RushRecord rushRecord){
        //调用service的rush方法
        Boolean isRush = rushRecordService.rush(rushRecord);

        if(isRush){
            return "恭喜您，抢购成功，请付款";
        }else{
            return "抢购失败！！！！！";
        }
    }
}
