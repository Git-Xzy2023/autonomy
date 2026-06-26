---
title: 04 Web 开发
---

# Spring Boot Web 开发

> 本章涵盖 Spring Boot Web 开发的常用功能：静态资源、文件上传、全局异常、Swagger 文档。

## 静态资源

默认目录（按优先级）：
- `classpath:/META-INF/resources/`
- `classpath:/resources/`
- `classpath:/static/`
- `classpath:/public/`

访问 `http://localhost:8080/xxx.js` 直接映射到 `static/xxx.js`。

```yaml
spring:
  web:
    resources:
      static-locations: classpath:/static/,classpath:/public/
```

## 文件上传

```java
@PostMapping("/upload")
public String upload(@RequestParam("file") MultipartFile file) throws IOException {
  if (file.isEmpty()) return "文件为空";
  String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
  Path dest = Paths.get("/uploads", fileName);
  Files.createDirectories(dest.getParent());
  file.transferTo(dest);
  return "上传成功：" + fileName;
}
```

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB       # 单文件大小
      max-request-size: 100MB   # 总请求大小
```

## 文件下载

```java
@GetMapping("/download/{filename}")
public ResponseEntity<Resource> download(@PathVariable String filename) {
  Path path = Paths.get("/uploads", filename);
  Resource resource = new FileSystemResource(path);
  return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
      .body(resource);
}
```

## 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BusinessException.class)
  public Result<?> handleBiz(BusinessException e) {
    return Result.error(e.getCode(), e.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public Result<?> handleValid(MethodArgumentNotValidException e) {
    String msg = e.getFieldErrors().stream()
        .map(f -> f.getField() + ": " + f.getDefaultMessage())
        .collect(Collectors.joining("; "));
    return Result.error(400, msg);
  }

  @ExceptionHandler(Exception.class)
  public Result<?> handleAll(Exception e) {
    log.error("系统异常", e);
    return Result.error(500, "服务器异常");
  }
}
```

## 统一响应格式

```java
@Data
public class Result<T> {
  private int code;
  private String msg;
  private T data;

  public static <T> Result<T> success(T data) {
    Result<T> r = new Result<>();
    r.setCode(200); r.setMsg("success"); r.setData(data);
    return r;
  }

  public static <T> Result<T> error(int code, String msg) {
    Result<T> r = new Result<>();
    r.setCode(code); r.setMsg(msg);
    return r;
  }
}
```

## 跨域

```java
@Bean
public WebMvcConfigurer corsConfigurer() {
  return new WebMvcConfigurer() {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**")
          .allowedOriginPatterns("*")
          .allowedMethods("*")
          .allowCredentials(true)
          .maxAge(3600);
    }
  };
}
```

## 参数校验

```java
@PostMapping
public Result<User> create(@Valid @RequestBody UserDTO dto) { ... }

public class UserDTO {
  @NotBlank(message = "用户名不能为空")
  private String name;
  @NotNull @Min(0) @Max(150)
  private Integer age;
  @Email(message = "邮箱格式错误")
  private String email;
}
```

## Swagger / OpenAPI

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.3.0</version>
</dependency>
```

```java
@Tag(name = "用户管理")
@RestController
@RequestMapping("/api/users")
public class UserController {

  @Operation(summary = "根据 ID 查询")
  @GetMapping("/{id}")
  public User getById(@PathVariable Long id) { ... }
}
```

访问 `http://localhost:8080/swagger-ui.html` 查看接口文档。

## 小结

| 功能       | 要点                                  |
| ---------- | ------------------------------------- |
| 静态资源   | static/ 目录                          |
| 文件上传   | MultipartFile + transferTo            |
| 异常处理   | @RestControllerAdvice                 |
| 响应格式   | 统一 Result<T>                        |
| 跨域       | WebMvcConfigurer.addCorsMappings      |
| 参数校验   | @Valid + JSR 303                     |
| 接口文档   | springdoc-openapi                     |
