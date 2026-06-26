---
title: 02 映射文件
---

# MyBatis 映射文件

> 本章深入 Mapper XML 的高级用法：resultMap 字段映射、关联查询、主键回填、批量操作。

## resultMap

当数据库列名与实体属性名不一致时，用 resultMap 映射。

```xml
<!-- 数据库 user_name → 实体 userName -->
<resultMap id="userMap" type="User">
  <id property="id" column="id"/>
  <result property="userName" column="user_name"/>
  <result property="age" column="age"/>
</resultMap>

<select id="findAll" resultMap="userMap">
  SELECT id, user_name, age FROM users
</select>
```

> **简化**：开启 `map-underscore-to-camel-case` 可自动将 `user_name` → `userName`，无需 resultMap。

## 关联查询

### 一对一（association）

```java
public class User {
  private Long id;
  private String name;
  private Department dept;   // 关联部门
}
```

```xml
<resultMap id="userWithDept" type="User">
  <id property="id" column="u_id"/>
  <result property="name" column="u_name"/>
  <association property="dept" javaType="Department">
    <id property="id" column="d_id"/>
    <result property="name" column="d_name"/>
  </association>
</resultMap>

<select id="findById" resultMap="userWithDept">
  SELECT u.id u_id, u.name u_name, d.id d_id, d.name d_name
  FROM users u
  LEFT JOIN departments d ON u.dept_id = d.id
  WHERE u.id = #{id}
</select>
```

### 一对多（collection）

```java
public class Department {
  private Long id;
  private String name;
  private List<User> users;   // 部门下的用户
}
```

```xml
<resultMap id="deptWithUsers" type="Department">
  <id property="id" column="id"/>
  <result property="name" column="name"/>
  <collection property="users" ofType="User">
    <id property="id" column="u_id"/>
    <result property="name" column="u_name"/>
  </collection>
</resultMap>

<select id="findDeptById" resultMap="deptWithUsers">
  SELECT d.id, d.name, u.id u_id, u.name u_name
  FROM departments d
  LEFT JOIN users u ON u.dept_id = d.id
  WHERE d.id = #{id}
</select>
```

## 延迟加载

关联查询默认一次性加载所有数据。开启延迟加载后，只有访问关联属性时才查询。

```xml
<association property="dept" javaType="Department"
  select="findDeptById" column="dept_id"/>
```

```yaml
mybatis:
  configuration:
    lazy-loading-enabled: true        # 开启延迟加载
    aggressive-lazy-loading: false    # 按需加载
```

## 主键回填

```xml
<!-- 自增主键 -->
<insert id="insert" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO users(name) VALUES(#{name})
</insert>

<!-- 自定义主键（如 UUID）-->
<insert id="insert">
  <selectKey keyProperty="id" resultType="string" order="BEFORE">
    SELECT UUID()
  </selectKey>
  INSERT INTO users(id, name) VALUES(#{id}, #{name})
</insert>
```

## 批量操作

### 批量插入

```xml
<insert id="batchInsert">
  INSERT INTO users(name, age) VALUES
  <foreach collection="list" item="u" separator=",">
    (#{u.name}, #{u.age})
  </foreach>
</insert>
```

```java
mapper.batchInsert(users);
```

### 批量更新

```xml
<update id="batchUpdate">
  <foreach collection="list" item="u" separator=";">
    UPDATE users SET age=#{u.age} WHERE id=#{u.id}
  </foreach>
</update>
```

> **注意**：批量更新需在 JDBC URL 加 `allowMultiQueries=true`。

## 分页

### 逻辑分页（RowBounds，不推荐）

```java
List<User> list = mapper.findAll(new RowBounds(0, 10));
```

### 物理分页（PageHelper，推荐）

```xml
<dependency>
  <groupId>com.github.pagehelper</groupId>
  <artifactId>pagehelper-spring-boot-starter</artifactId>
  <version>2.1.0</version>
</dependency>
```

```java
PageHelper.startPage(1, 10);           // 紧接查询
List<User> list = mapper.findAll();
PageInfo<User> info = new PageInfo<>(list);

info.getList();      // 当前页数据
info.getTotal();     // 总条数
info.getPages();      // 总页数
```

## 类型处理器

当数据库类型与 Java 类型不匹配时自定义转换。

```java
@MappedTypes(String[].class)
public class StringArrayTypeHandler extends BaseTypeHandler<String[]> {
  @Override
  public void setNonNullParameter(PreparedStatement ps, int i, String[] param, JdbcType jdbcType) throws SQLException {
    ps.setString(i, String.join(",", param));
  }

  @Override
  public String[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
    String s = rs.getString(columnName);
    return s == null ? null : s.split(",");
  }
  // ... 其他方法
}
```

```xml
<result property="tags" column="tags" typeHandler="com.example.StringArrayTypeHandler"/>
```

## 小结

| 知识点       | 要点                                |
| ------------ | ----------------------------------- |
| resultMap    | 列名与属性名映射                    |
| association  | 一对一                              |
| collection   | 一对多                              |
| 延迟加载     | 按需加载关联数据                    |
| 主键回填     | useGeneratedKeys / selectKey       |
| 批量操作     | foreach 拼接                        |
| 分页         | PageHelper 物理分页                 |
