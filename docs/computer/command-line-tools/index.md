# 命令行工具

日常开发中高频使用的命令行工具，本篇涵盖 **curl**、**fd**、**rg (ripgrep)** 的最常用用法。

## curl

> 用于与服务器传输数据的命令行工具，支持 HTTP、HTTPS、FTP 等多种协议。

### 最常用法

**GET 请求**

默认发送 GET 请求，响应内容直接打印到终端。

```bash
curl https://api.example.com/users
```

**保存响应到文件**

```bash
curl -o output.json https://api.example.com/users
curl -O https://example.com/file.zip   # 保持原文件名
```

**显示响应头**

```bash
curl -i https://api.example.com/users          # 响应体 + 响应头
curl -I https://api.example.com/users          # 仅响应头（HEAD 请求）
```

**POST 请求**

```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "role": "admin"}'
```

### 进阶用法

| 场景 | 命令 |
| :--- | :--- |
| 携带 Cookie | `curl -b "session=abc123" https://example.com` |
| 静默输出（不显示进度） | `curl -s https://example.com` |
| 跟随重定向 | `curl -L https://example.com` |
| 设置超时 | `curl --connect-timeout 5 --max-time 10 https://example.com` |
| 忽略证书校验（自签名证书） | `curl -k https://self-signed.example.com` |
| 下载多个文件 | `curl -O https://example.com/a.zip -O https://example.com/b.zip` |

## fd

> 比 `find` 更快的文件搜索工具，语法更简洁，默认跟进 `.gitignore` 规则。

### 最常用法

**按名称搜索文件**

```bash
fd main.py                     # 搜索当前目录下所有 main.py
fd -p main.py                  # 精确匹配文件名（不使用通配符）
```

**搜索特定目录**

```bash
fd main.py src/                # 只在 src/ 目录下搜索
```

**按扩展名搜索**

```bash
fd -e py                       # 搜索所有 .py 文件
fd -e md -e txt                # 搜索 .md 和 .txt 文件
```

**搜索目录**

```bash
fd -t d node_modules           # 搜索名为 node_modules 的目录
fd -t d -e git                 # 搜索所有 .git 目录
```

### 进阶用法

| 场景 | 命令 |
| :--- | :--- |
| 搜索隐藏文件 | `fd -H .env` |
| 忽略大小写 | `fd -i Readme` |
| 执行命令 | `fd -e py -x wc -l {}` |
| 排除特定目录 | `fd -E node_modules main.py` |
| 显示完整路径 | `fd . --full-path src` |
| 列出最近修改的 5 个文件 | `fd -t f --changed-within 1d \| head -5` |

## rg (ripgrep)

> 逐行递归搜索文本内容，比 `grep` 快得多，默认跟进 `.gitignore`。

### 最常用法

**搜索关键词**

```bash
rg "class User"                # 在当前目录搜索 "class User"
rg -r "class User" src/        # 只在 src/ 下搜索
```

**显示行号**

```bash
rg -n "import"                 # -n 默认已启用，显示行号
```

**搜索特定文件类型**

```bash
rg -t py "def main"            # 只在 Python 文件中搜索
rg -t js "useEffect"           # 只在 JS/TS 文件中搜索
rg --type-list                 # 查看所有支持的文件类型
```

### 进阶用法

| 场景 | 命令 |
| :--- | :--- |
| 搜索但不包含匹配行 | `rg -c "TODO"`（统计匹配次数） |
| 大小写敏感搜索 | `rg -s "User"`（默认智能大小写） |
| 反向匹配 | `rg -v "debug"`（不包含 debug 的行） |
| 多关键词（或） | `rg -e "error" -e "warning"` |
| 多关键词（且，同一行） | `rg "TODO" \| rg "urgent"` |
| 上下文行 | `rg -C 3 "function"`（前后各 3 行） |
| 只显示文件名 | `rg -l "config"` |
| 搜索忽略文件 | `rg --no-ignore "secret"`（不忽略 .gitignore） |
| 替换匹配文本 | `rg "foo" --replace "bar"` |

### 文件类型速查

::: card
常用 `-t` 参数：`py`（Python）、`js`（JavaScript/TypeScript）、`rs`（Rust）、`go`（Go）、`md`（Markdown）、`json`、`yaml`、`toml`、`html`、`css`、`sh`（Shell）。使用 `rg --type-list` 查看完整列表。
:::

## 三者配合使用

```bash
# 找到所有 .py 文件，再搜索文件内容
fd -e py | xargs rg "def main"

# rg 直接搜索目录更高效
rg "class User" --glob "*.py"
```

## 速记

::: card

- **curl**：向服务器发送/获取数据，`-o` 保存文件，`-X` 指定请求方法，`-d` 发送请求体。
- **fd**：快速找文件，`-e` 按扩展名，`-t d` 搜目录，`-H` 包含隐藏文件，`-x` 执行命令。
- **rg**：快速搜文件内容，`-t` 按类型过滤，`-C` 显示前后文，`-l` 只显示文件名。

:::
