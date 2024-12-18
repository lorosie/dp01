package cn.ctubu.edu.dp01.dao;

import cn.ctubu.edu.dp01.etity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Integer> {


    List<Student> findByNameLike(String name);

    List<Student> findByNameAndPassword(String name,String password);

    List<Student> findByName(String name);

    List<Student> findBySno(String sno);


}
