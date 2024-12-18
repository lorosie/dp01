package cn.ctubu.edu.dp01.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.aspectj.lang.reflect.MethodSignature;



@Aspect
@Component
@Slf4j

public class HttpAspect {
    @Pointcut("execution(* cn.ctubu.edu.dp01.api.StudentApiController.*(..))")
    public void log() {
    }

    @Before("log()")
    public void doBefore() {
        log.info("准备开始执行API");
    }

    @After("log()")
    public void doAfter() {
        log.info("执行完API，准备返回");
    }

    @AfterReturning(returning = "object", pointcut = "log()")
    public void doAfterReturning(Object object) {
        log.info("response={}", object);//第二步执行
    }

    @Around("log()")
    public Object around(ProceedingJoinPoint pjp) throws Throwable {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        Object obj = pjp.proceed(pjp.getArgs());
        stopWatch.stop();
        long cost = stopWatch.getTotalTimeMillis();
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        String methodName = signature.getDeclaringTypeName() + "." + signature.getName();
        log.info("---------- 执行" + methodName + "方法，用时：" + cost + "ms ----------");
        return obj;
    }

}