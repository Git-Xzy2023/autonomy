---
title: 03 动态 SQL
---

# MyBatis 动态 SQL

> 动态 SQL 是 MyBatis 的核心特性，根据条件拼接 SQL，避免手写字符串拼接的繁琐与错误。

## if

```xml
<select id="search" resultType="User">
  SELECT * FROM users
  WHERE 1=1
  <if test="name != null and name != ''">
    AND name LIKE CONCAT('%', #{name}, '%')
  </if>
  <if test="age != null">
    AND age = #{age}
  </if>
</select>
```

## where

`<where>` 自动处理首个 AND / OR，避免 `WHERE 1=1` 这种写法。

```xml
<select id="search" resultType="User">
  SELECT * FROM users
  <where>
    <if test="name != null and name != ''">
      AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="age != null">
      AND age = #{age}
    </if>
  </where>
</select>
```

- 至少一个条件成立才生成 WHERE
- 自动去掉首个 AND / OR

## choose / when / otherwise

类似 switch-case，多选一。

```xml
<select id="search" resultType="User">
  SELECT * FROM users
  <where>
    <choose>
      <when test="name != null">
        name = #{name}
      </when>
      <when test="email != null">
        email = #{email}
      </when>
      <otherwise>
        1=1
      </otherwise>
    </choose>
  </where>
</select>
```

## set

`<set>` 用于 UPDATE，自动去掉末尾多余的逗号。

```xml
<update id="update">
  UPDATE users
  <set>
    <if test="name != null">name = #{name},</if>
    <if test="age != null">age = #{age},</if>
    <if test="email != null">email = #{email},</if>
  </set>
  WHERE id = #{id}
</update>
```

## trim

更灵活的裁剪标签，`<where>` 和 `<set>` 都基于 `<trim>` 实现。

```xml
<!-- 等价于 where -->
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>

<!-- 等价于 set -->
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```

| 属性           | 作用                       |
| -------------- | -------------------------- |
| prefix         | 整体前缀                   |
| prefixOverrides | 去掉开头指定的字符串        |
| suffix         | 整体后缀                   |
| suffixOverrides | 去掉结尾指定的字符串       |

## foreach

用于 IN 查询、批量插入。

### IN 查询

```xml
<select id="findByIds" resultType="User">
  SELECT * FROM users
  WHERE id IN
  <foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>
```

```java
List<User> list = mapper.findByIds(List.of(1L, 2L, 3L));
```

### 批量插入

```xml
<insert id="batchInsert">
  INSERT INTO users(name, age) VALUES
  <foreach collection="list" item="u" separator=",">
    (#{u.name}, #{u.age})
  </foreach>
</insert>
```

### foreach 属性

| 属性       | 作用                           |
| ---------- | ------------------------------ |
| collection | 集合（list / array / map）     |
| item       | 当前元素变量名                 |
| index      | 索引变量名                     |
| open       | 开始符号                       |
| close      | 结束符号                       |
| separator  | 分隔符                         |

## sql 片段

复用 SQL 片段。

```xml
<sql id="userColumns">
  id, name, age, email
</sql>

<select id="findAll" resultType="User">
  SELECT <include refid="userColumns"/> FROM users
</select>

<select id="findById" resultType="User">
  SELECT <include refid="userColumns"/> FROM users WHERE id = #{id}
</select>
```

## bind

绑定变量，常用 LIKE 拼接。

```xml
<select id="search" resultType="User">
  <bind name="pattern" value="'%' + name + '%'"/>
  SELECT * FROM users WHERE name LIKE #{pattern}
</select>
```

## 完整示例

```xml
<select id="search" resultType="User">
  SELECT * FROM users
  <where>
    <if test="name != null and name != ''">
      AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="ageMin != null">
      AND age &gt;= #{ageMin}
    </if>
    <if test="ageMax != null">
      AND age &lt;= #{ageMax}
    </if>
    <if test="ids != null and ids.size() > 0">
      AND id IN
      <foreach collection="ids" item="id" open="(" separator="," close=")">
        #{id}
      </foreach>
    </if>
  </where>
  ORDER BY id DESC
</select>
```

> **注意**：XML 中 `<` 和 `>` 是特殊字符，需用 `&lt;` 和 `&gt;` 转义，或用 `<![CDATA[ ... ]]>` 包裹。

## 小结

| 标签       | 作用                        |
| ---------- | --------------------------- |
| if         | 条件判断                    |
| where      | 自动 WHERE + 去首 AND       |
| set        | 自动 SET + 去尾逗号         |
| choose     | 多选一                      |
| trim       | 灵活裁剪                    |
| foreach    | 遍历集合                    |
| sql        | 复用片段                    |
| bind       | 绑定变量                    |
