package cn.ctubu.edu.dp01.api;


import cn.ctubu.edu.dp01.etity.Student;
import cn.ctubu.edu.dp01.service.StudentService;
import cn.ctubu.edu.dp01.util.RUtil;
import cn.ctubu.edu.dp01.vo.R;
import cn.ctubu.edu.dp01.constant.REnum;
import cn.ctubu.edu.dp01.exception.RException;
import cn.ctubu.edu.dp01.util.RUtil;
import cn.ctubu.edu.dp01.vo.QueryObj;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.*;




import java.util.List;

@RestController
@RequestMapping("/api/student")


public class StudentApiController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/list")
    public R<List<Student>> findAll() {
        List<Student> students = studentService.findAll();
        return RUtil.success(students);
    }

    @GetMapping("/{id}")
    public R<Student> findById(@PathVariable int id) {
        Student student = studentService.findById(id);
        return RUtil.success(student);
    }

    @PostMapping("/add")
    public R<Student> add(Student student) {
        return RUtil.success(studentService.add(student));

    }

    @PutMapping("/update")
    public R<Student> update(Student student) {
        return RUtil.success(studentService.update(student));

    }


    @DeleteMapping("/delete/{id}")
    public R delete(@PathVariable Integer id) {
        studentService.delete(id);
        return RUtil.success();

    }
    @DeleteMapping("/batchDelete")
    public R batchDelete(@RequestBody List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return RUtil.error(REnum.QUERY_ERR.getCode(), "请选择要删除的ID");
        }
        studentService.batchDelete(ids);
        return RUtil.success("批量删除成功");
    }

    @GetMapping("/validateUser")
    public R validateSnoAndPassword(String sno, String password) throws Exception{
        return RUtil.success(studentService.validateSnoAndPassword(sno,password));
    }

    @PostMapping ("/getbypage")
    public R<Page<Student>> getByPage(@RequestBody QueryObj<Student> qObj){
        // 默认排序
        Sort sort = Sort.by(Sort.Direction.ASC, "id");
        // 动态排序
        if(qObj != null && qObj.getSortField() != null && qObj.getSortDirection() != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(qObj.getSortDirection()) ? Sort.Direction.DESC : Sort.Direction.ASC;
            sort = Sort.by(direction, qObj.getSortField());
        }

        Integer pageIndex = 0;
        Integer pageSize = 5;

        if(qObj == null){
            Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);
            Page<Student> students = (Page<Student>) studentService.findAll(pageable);
            return RUtil.success(students.getContent(), students.getTotalElements());
        }else {
            pageIndex = qObj.getPage() - 1;
            pageSize = qObj.getLimit();

            if(qObj.getData() instanceof Student){
                Student student = (Student) qObj.getData();
                Pageable pageable = PageRequest.of(pageIndex, pageSize, sort);

                ExampleMatcher matcher = ExampleMatcher.matching()
                        .withMatcher("name",ExampleMatcher.GenericPropertyMatchers.contains())
                        .withMatcher("sno",ExampleMatcher.GenericPropertyMatchers.contains())
                        .withIgnoreNullValues();

                Example<Student> example = Example.of(student, matcher);
                Page<Student> studentPage = studentService.findAll(example, pageable);
                return RUtil.success(studentPage.getContent(), studentPage.getTotalElements());
            }else {
                throw new RException(REnum.QUERY_ERR);
            }
        }
    }

}
