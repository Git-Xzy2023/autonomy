---
title: 03 数据访问
---

# Spring Boot 数据访问

> Spring Boot 整合多种数据访问技术，本章涵盖 Spring Data JPA、MyBatis 整合、Redis 整合。

## Spring Data JPA

### 依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>com.mysql</groupId>
  <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### 实体

```java
@Entity
@Table(name = "users")
@Data
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50)
  private String name;

  private Integer age;

  @Column(unique = true)
  private String email;

  @CreationTimestamp
  private LocalDateTime createTime;
}
```

### Repository

```java
public interface UserRepository extends JpaRepository<User, Long> {

  // 方法名查询
  List<User> findByName(String name);
  List<User> findByAgeGreaterThan(int age);
  List<User> findByNameContainingAndAgeBetween(String kw, int min, int max);

  // @Query 自定义
  @Query("SELECT u FROM User u WHERE u.email = :email")
  User findByEmail(@Param("email") String email);

  @Query(value = "SELECT * FROM users WHERE age > :age", nativeQuery = true)
  List<User> findOlderThan(@Param("age") int age);

  // 更新
  @Modifying
  @Query("UPDATE User u SET u.age = :age WHERE u.id = :id")
  int updateAge(@Param("id") Long id, @Param("age") int age);
}
```

### 使用

```java
@Service
public class UserService {
  private final UserRepository repo;
  public UserService(UserRepository repo) { this.repo = repo; }

  public List<User> list() { return repo.findAll(); }
  public User save(User u) { return repo.save(u); }
  public Optional<User> get(Long id) { return repo.findById(id); }
  public void delete(Long id) { repo.deleteById(id); }

  // 分页
  public Page<User> page(int num, int size) {
    return repo.findAll(PageRequest.of(num, size, Sort.by("id").descending()));
  }
}
```

## MyBatis 整合

### 依赖

```xml
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>3.0.3</version>
</dependency>
```

### 配置

```yaml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.entity
  configuration:
    map-underscore-to-camel-case: true   # user_name → userName
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

### Mapper 接口

```java
@Mapper
public interface UserMapper {
  @Select("SELECT * FROM users WHERE id = #{id}")
  User findById(Long id);

  @Insert("INSERT INTO users(name, age) VALUES(#{name}, #{age})")
  @Options(useGeneratedKeys = true, keyProperty = "id")
  int insert(User user);

  // XML 映射
  List<User> findByName(String name);
}
```

### XML 映射

```xml
<!-- resources/mapper/UserMapper.xml -->
<mapper namespace="com.example.mapper.UserMapper">
  <select id="findByName" resultType="User">
    SELECT * FROM users WHERE name LIKE CONCAT('%', #{name}, '%')
  </select>
</mapper>
```

## Redis 整合

### 依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password:
      database: 0
```

### 使用

```java
@Service
public class CacheService {
  private final StringRedisTemplate redis;
  public CacheService(StringRedisTemplate redis) { this.redis = redis; }

  public void set(String key, String value) {
    redis.opsForValue().set(key, value, Duration.ofMinutes(30));
  }

  public String get(String key) {
    return redis.opsForValue().get(key);
  }
}
```

## 多数据源

```java
@Configuration
public class DataSourceConfig {
  @Bean
  @Primary
  @ConfigurationProperties(prefix = "spring.datasource.primary")
  public DataSource primaryDs() { return DataSourceBuilder.create().build(); }

  @Bean
  @ConfigurationProperties(prefix = "spring.datasource.secondary")
  public DataSource secondaryDs() { return DataSourceBuilder.create().build(); }
}
```

## 小结

| 技术     | 特点                            |
| -------- | ------------------------------- |
| JPA      | 方法名查询，自动 SQL           |
| MyBatis  | 半自动，SQL 灵活                |
| Redis    | 缓存、分布式锁、限流            |
| 多数据源 | @Primary + @ConfigurationProperties |
