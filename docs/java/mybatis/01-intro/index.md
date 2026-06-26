---
title: 01 快速入门
---

# MyBatis 快速入门

> 本章搭建第一个 MyBatis 项目，理解配置、Mapper、SQL 映射的基础用法。

## 依赖

```xml
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>3.0.3</version>
</dependency>
```

## 配置

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true   # user_name → userName
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

## 启动类

```java
@MapperScan("com.example.mapper")   // 扫描 Mapper 接口
@SpringBootApplication
public class App { ... }
```

## 实体

```java
@Data
public class User {
  private Long id;
  private String name;
  private Integer age;
  private String email;
}
```

## Mapper 接口

```java
public interface UserMapper {
  List<User> findAll();
  User findById(Long id);
  int insert(User user);
  int update(User user);
  int deleteById(Long id);
}
```

## XML 映射文件

```xml
<!-- resources/mapper/UserMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">

  <select id="findAll" resultType="User">
    SELECT id, name, age, email FROM users
  </select>

  <select id="findById" parameterType="long" resultType="User">
    SELECT id, name, age, email FROM users WHERE id = #{id}
  </select>

  <insert id="insert" parameterType="User" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO users(name, age, email) VALUES(#{name}, #{age}, #{email})
  </insert>

  <update id="update" parameterType="User">
    UPDATE users SET name=#{name}, age=#{age}, email=#{email} WHERE id=#{id}
  </update>

  <delete id="deleteById" parameterType="long">
    DELETE FROM users WHERE id = #{id}
  </delete>
</mapper>
```

## 使用

```java
@Service
public class UserService {
  private final UserMapper mapper;
  public UserService(UserMapper mapper) { this.mapper = mapper; }

  public List<User> list() { return mapper.findAll(); }
  public User get(Long id) { return mapper.findById(id); }
  public User create(User u) { mapper.insert(u); return u; }
}
```

## 注解方式（简单 SQL）

```java
@Mapper
public interface UserMapper {
  @Select("SELECT * FROM users WHERE id = #{id}")
  User findById(Long id);

  @Insert("INSERT INTO users(name, age) VALUES(#{name}, #{age})")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  int insert(User user);
}
```

> **建议**：简单查询用注解，复杂查询用 XML。

## 参数传递

```java
// 单参数
User findById(Long id);   // #{id}

// 多参数
User find(@Param("name") String name, @Param("age") int age);  // #{name} #{age}

// 对象参数
int insert(User user);    // #{name} #{age}（User 的属性）
```

## #{} vs ${}

```xml
<!-- #{}：预编译参数，防 SQL 注入（推荐）-->
<select id="findById">
  SELECT * FROM users WHERE id = #{id}
</select>

<!-- ${}：字符串拼接，有注入风险（慎用，仅用于表名/列名）-->
<select id="findByTable">
  SELECT * FROM ${tableName} WHERE id = #{id}
</select>
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| 配置         | mapper-locations + type-aliases     |
| Mapper 接口  | @MapperScan 扫描                    |
| XML 映射     | namespace 对应接口全限定名         |
| 注解         | @Select / @Insert                    |
| 参数         | #{} 预编译 / ${} 拼接               |
