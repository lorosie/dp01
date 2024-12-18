package cn.ctubu.edu.dp01.vo;

import lombok.Data;

@Data
public class QueryObj<T> {
    private Integer page;
    private Integer limit;
    private T data;
    private String sortField;
    private String sortDirection;
}
