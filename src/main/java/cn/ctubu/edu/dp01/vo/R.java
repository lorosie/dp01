package cn.ctubu.edu.dp01.vo;


import lombok.Data;

/**
 * 通用返回对象
 * @param <T>
 */

@Data
public class R <T>{
    /**错误代码*/
    private Integer code;
    /**提示信息*/
    private String msg;
    /**具体内容*/
    private T data;
    /**长文本*/
    private Long count;
}
