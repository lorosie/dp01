package cn.ctubu.edu.dp01.controller;

import cn.ctubu.edu.dp01.dao.StudentRepository;
import cn.ctubu.edu.dp01.etity.Student;
import cn.ctubu.edu.dp01.service.StudentService;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/student")


public class StudentCotroller {
    @Autowired
    private StudentService studentService;
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/list")
    public String getList() {

//        List<Student> students = studentService.findAll();
//        model.addAttribute("students", students);
        return "/student/list";
    }




}
