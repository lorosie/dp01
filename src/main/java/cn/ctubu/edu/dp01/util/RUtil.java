package cn.ctubu.edu.dp01.util;

import cn.ctubu.edu.dp01.vo.R;
import cn.ctubu.edu.dp01.constant.REnum;

public class RUtil {
    public static R success(Object object, Long count) {
        R result = new R();
        result.setCode(0);
        result.setData(object);
        result.setMsg("成功");
        result.setCount(count);
        return result;
    }

    public static R success(Object object) {
        return success(object,null);
    }


    public static R success() {
        return success(null);
    }

    public static R error(Integer code, String msg){
        R result = new R();
        result.setCode(code);
        result.setMsg(msg);
        return result;
    }

    public static R error(REnum rEnum){
        R result = new R();
        result.setCode(rEnum.getCode());
        result.setMsg(rEnum.getMsg());
        return result;
    }
}


