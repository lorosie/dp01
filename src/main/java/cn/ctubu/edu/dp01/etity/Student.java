package cn.ctubu.edu.dp01.etity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;


@Data

@Entity(name = "tb_student")
public class Student {

    //主键：自增，代理主键

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //姓名
    private String name;
    //年龄
    private Integer age;

    //sex 1男 2女
    private Integer sex;

    //学号
    private  String sno;

    //密码
    private String password;

}
