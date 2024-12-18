package cn.ctubu.edu.dp01.api;

import cn.ctubu.edu.dp01.constant.REnum;
import cn.ctubu.edu.dp01.exception.RException;
import cn.ctubu.edu.dp01.util.RUtil;
import cn.ctubu.edu.dp01.vo.R;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionHandle {
    @ExceptionHandler(value = Exception.class)
    public R handle(Exception e){
        if(e instanceof RException){
            RException rException = (RException) e;
            return RUtil.error(rException.getCode(), rException.getMessage());
        }
        return RUtil.error(REnum.UNKOWN_ERR);
    }
}