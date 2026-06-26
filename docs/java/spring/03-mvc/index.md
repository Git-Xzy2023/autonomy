---
title: 03 Spring MVC
---

# Spring MVC

> Spring MVC 是 Spring 的 Web 框架，基于 Servlet 实现 MVC 模式。本章涵盖请求流程、参数绑定、拦截器、异常处理。

## 请求处理流程

```
Client → DispatcherServlet → HandlerMapping → HandlerAdapter
                                                      ↓
                                                  Controller
                                                      ↓
                                              ViewResolver → View → Client
```

1. **DispatcherServlet**：前端控制器，接收所有请求
2. **HandlerMapping**：根据 URL 找到对应的 Controller 方法
3. **HandlerAdapter**：执行 Controller 方法
4. **Controller**：业务处理，返回 ModelAndView
5. **ViewResolver**：解析视图（前后端分离时直接返回 JSON）
6. **View**：渲染响应

## RESTful Controller

```java
@RestController
@RequestMapping("/api/users")
public class UserController {

  @GetMapping("/{id}")
  public User getById(@PathVariable Long id) { ... }

  @GetMapping
  public List<User> list(
      @RequestParam(defaultValue = "1") int page,
      @RequestParam(defaultValue = "10") int size) { ... }

  @PostMapping
  public User create(@RequestBody @Valid UserDTO dto) { ... }

  @PutMapping("/{id}")
  public User update(@PathVariable Long id, @RequestBody UserDTO dto) { ... }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) { ... }
}
```

## 参数绑定

| 注解             | 绑定来源                     | 示例                          |
| ---------------- | ---------------------------- | ----------------------------- |
| `@RequestParam`  | URL 查询参数                 | `?name=Tom`                   |
| `@PathVariable`  | URL 路径变量                 | `/users/123`                  |
| `@RequestBody`   | 请求体（JSON）                | `{"name":"Tom"}`             |
| `@RequestHeader`| 请求头                       | `Authorization: Bearer xxx`   |
| `@CookieValue`   | Cookie                       | `session=abc`                |
| `@ModelAttribute`| 表单字段（自动绑定对象）     | `name=Tom&age=20`             |

```java
@GetMapping("/search")
public List<User> search(
    @RequestParam(required = false) String name,
    @RequestHeader(value = "X-Token", required = false) String token) { ... }
```

## 参数校验

```java
public class UserDTO {
  @NotBlank(message = "用户名不能为空")
  @Length(min = 3, max = 20)
  private String name;

  @NotNull
  @Min(0) @Max(150)
  private Integer age;

  @Email
  private String email;
}

@PostMapping
public User create(@RequestBody @Valid UserDTO dto, BindingResult result) {
  if (result.hasErrors()) {
    String msg = result.getFieldErrors().stream()
        .map(e -> e.getField() + ": " + e.getDefaultMessage())
        .collect(Collectors.joining("; "));
    throw new IllegalArgumentException(msg);
  }
  ...
}
```

常用校验注解：`@NotNull` `@NotBlank` `@NotEmpty` `@Size` `@Min` `@Max` `@Email` `@Pattern`。

## 返回值

```java
// 返回 JSON
@GetMapping("/{id}")
public User getById(@PathVariable Long id) { ... }

// 返回 ResponseEntity（设置状态码和头）
@PostMapping
public ResponseEntity<User> create(@RequestBody UserDTO dto) {
  User u = userService.create(dto);
  return ResponseEntity.status(201).body(u);
}

// 返回响应包装类（推荐统一格式）
@GetMapping("/{id}")
public Result<User> getById(@PathVariable Long id) {
  return Result.success(userService.getById(id));
}
```

```java
public class Result<T> {
  private int code;
  private String msg;
  private T data;
  public static <T> Result<T> success(T data) { ... }
  public static <T> Result<T> error(int code, String msg) { ... }
}
```

## 拦截器

```java
public class AuthInterceptor implements HandlerInterceptor {
  @Override
  public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler) {
    String token = req.getHeader("Authorization");
    if (token == null) {
      resp.setStatus(401);
      return false;   // 中止
    }
    return true;
  }

  @Override
  public void postHandle(req, resp, handler, ModelAndView mv) { ... }

  @Override
  public void afterCompletion(req, resp, handler, Exception ex) { ... }
}
```

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new AuthInterceptor())
        .addPathPatterns("/api/**")
        .excludePathPatterns("/api/login", "/api/register");
  }
}
```

### 过滤器 vs 拦截器

| 特性     | Filter               | Interceptor                |
| -------- | -------------------- | -------------------------- |
| 来源     | Servlet 规范         | Spring                     |
| 时机     | 进入容器前           | 进入 Controller 前         |
| 依赖     | 不依赖 Spring        | Spring Bean                |
| 场景     | 编码、CORS           | 权限、日志                 |

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

## 跨域配置

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowCredentials(true);
  }
}
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 流程         | DispatcherServlet → Mapping → Adapter |
| 注解         | @RestController / @GetMapping 等    |
| 参数绑定     | @RequestParam / @PathVariable / @RequestBody |
| 校验         | @Valid + JSR 303 注解               |
| 拦截器       | HandlerInterceptor，preHandle 返回 false 中止 |
| 异常处理     | @RestControllerAdvice + @ExceptionHandler |
