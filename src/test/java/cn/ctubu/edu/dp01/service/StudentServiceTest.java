package cn.ctubu.edu.dp01.service;

import cn.ctubu.edu.dp01.etity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class StudentServiceTest {
    @Autowired
    private StudentService studentService;
    @Test
    void getAll() {
        List<Student> students = studentService.findAll();


        assertNotNull(students);

    }

    @Test
    void getById() {
        Student student = studentService.findById(1);
        assertNotNull(student);
    }

    @Test
    void findByName() {
        List<Student>students = studentService.findByName("张%");
        assertNotNull(students);
    }

    @Test
    void findByNameAndPassword() {
        List<Student>students = studentService.findByNameAndPassword("张", "123456");
        assertNotNull(students);
    }

    @Test
    void insert() {
        Student student = new Student();
        student.setName("赵六");
        studentService.insert(student);
        assertNotNull(student.getId());
    }

}