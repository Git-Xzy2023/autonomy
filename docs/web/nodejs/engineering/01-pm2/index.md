---
title: PM2 进程管理
---

# PM2 进程管理

## 一、安装

```bash
npm install -g pm2
```

---

## 二、基本命令

```bash
# 启动应用
pm2 start app.js
pm2 start app.js --name "my-app"

# 指定实例数和模式
pm2 start app.js -i max              # 集群模式，按 CPU 数
pm2 start app.js -i 4                # 4 个实例
pm2 start app.js --name "api" --watch  # 文件变化自动重启

# 查看进程
pm2 list
pm2 show <id|name>
pm2 monit          # 监控面板

# 重启 / 停止 / 删除
pm2 restart all
pm2 restart <id|name>
pm2 stop all
pm2 stop <id|name>
pm2 delete all
pm2 delete <id|name>

# 日志
pm2 logs            # 所有日志
pm2 logs <id|name>  # 指定应用
pm2 flush           # 清空日志
```

---

## 三、配置文件

`ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './dist/app.js',
    instances: 'max',           // 集群实例数
    exec_mode: 'cluster',       // 集群模式
    watch: false,
    max_memory_restart: '1G',   // 内存超限重启
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    restart_delay: 4000
  }]
};
```

### 使用配置启动

```bash
pm2 start ecosystem.config.js
pm2 start ecosystem.config.js --env production
```

---

## 四、集群模式

PM2 集群模式利用 Node.js 的 cluster 模块，自动负载均衡：

```bash
# 启动 4 个实例
pm2 start app.js -i 4

# 最大实例数（按 CPU 核数）
pm2 start app.js -i max

# 0 秒停机重启
pm2 reload all
```

> ⚠️ 集群模式下，应用不能有内存状态（如 Session），需使用 Redis 等共享存储。

---

## 五、开机自启

```bash
# 生成启动脚本
pm2 startup

# 按提示执行返回的命令（需要 sudo）

# 保存当前进程列表
pm2 save
```

---

## 六、日志管理

```bash
# 安装 logrotate 模块
pm2 install pm2-logrotate

# 配置
pm2 set pm2-logrotate:max_size 10M       # 单文件最大 10M
pm2 set pm2-logrotate:retain 30          # 保留 30 个文件
pm2 set pm2-logrotate:compress true      # 压缩
```

---

## 七、监控

```bash
# 终端监控
pm2 monit

# 在线监控（PM2 Plus，付费）
pm2 plus
```

---

## 八、下一步

- 下一章：[Docker 部署](/web/nodejs/engineering/02-docker/)
- 上一级：[工程化与部署](/web/nodejs/engineering/)
