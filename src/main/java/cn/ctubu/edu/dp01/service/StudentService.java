package cn.ctubu.edu.dp01.service;

import cn.ctubu.edu.dp01.dao.StudentRepository;
import cn.ctubu.edu.dp01.etity.Student;
import cn.ctubu.edu.dp01.constant.REnum;
import cn.ctubu.edu.dp01.exception.RException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class StudentService {
    @Autowired
    public StudentRepository studentRepository;

    /**
     *
     * @return ListStudent
     */
    public List<Student> findAll(){

        return studentRepository.findAll();
    }
    public Page<Student> findAll(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Page<Student> findAll(Example<Student> example, Pageable pageable){
        return studentRepository.findAll(example, pageable);
    }


    /**
     *按id 进行查询
     * @param id 主键，整数
     * @return
     */
    public Student findById(Integer id){


        return studentRepository.findById(id).orElse(null);
    }

    /**
     * 按名字查询，Like
     * @param name
     * @return
     */
  public List<Student> findByName(String name){
      return studentRepository.findByNameLike(name);

  }
    /**
     * 按名字和密码查询
     * @param name and password
     * @return
     */
    List<Student> findByNameAndPassword(String name, String password){
        return studentRepository.findByNameAndPassword(name,password);
    }

    /**
     * 插入
      * @param student
     */
    public void insert(Student student){
        studentRepository.save(student);
    }

    /**
     * add
     * @param student
     * @return
     */
    public Student add(Student student){
        return studentRepository.save(student);
    }

    /**
     * update
     * @param student
     * @return
     */
    public Student update(Student student){
        return studentRepository.save(student);
    }

    public void delete(Integer id){
    studentRepository.deleteById(id);
    }
    public Student validateSnoAndPassword(String sno, String password) throws Exception{
        List<Student> students = studentRepository.findBySno(sno);
        if(students.size() > 0){
            Student student = students.get(0);
            if(student.getPassword().equals(password)){
                return student;
            }else {
                throw new RException(REnum.LOGIN_ERR);
            }
        }else {
            throw new RException(REnum.LOGIN_ERR);
        }
    }

    public void batchDelete(List<Integer> ids) {
        studentRepository.deleteAllById(ids);
    }
}

