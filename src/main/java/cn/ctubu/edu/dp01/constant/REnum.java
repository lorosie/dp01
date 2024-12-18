package cn.ctubu.edu.dp01.constant;

public enum REnum {
    UNKOWN_ERR(-999,"未知错误"),
    COMMON_ERR(-10,"一般性错误"),
    LOGIN_ERR(-2,"出错了，不正确的用户名密码"),
    QUERY_ERR(-3,"查询条件出错"),
    SUCCESS(1,"成功")
    ;
    private Integer code;

    private String msg;

    REnum(Integer code, String msg) {

        this.code = code;
        this.msg = msg;
    }

    public Integer getCode() {

        return code;
    }
    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }
}
