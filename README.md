# 五子棋 · 双人同屏（单文件零依赖）

> 在线试玩：**https://a236587.github.io/gomoku/**
> 源码仓库：https://github.com/a236587/gomoku

`index.html` 就是完整游戏：HTML + CSS + JavaScript 全部内联，没有任何第三方库、构建工具或网络请求。

另外附带两个**可选**的小工具，只用来把本目录共享给手机，不参与游戏运行：
- `启动服务器.bat`：双击即可（自动优先用 Node，找不到就退回 Python）
- `serve.js`：零依赖的 Node 静态服务器，会直接打印电脑和手机两条地址

## 一、电脑上直接玩

双击 `index.html`（或拖进浏览器）即可开始，无需服务器。

- 黑棋先手，鼠标点击交叉点落子
- 悔棋：按钮 或 `Ctrl/Cmd + Z`
- 重新开始、4 套皮肤：木纹 / 简约白 / 暗夜 / 围棋盘

## 二、手机在同一 WiFi 下访问

手机不能直接打开电脑上的 `file://` 文件，所以要用一个本地 HTTP 服务器把**这个目录**共享出去。

### 1. 启动本地服务器

在 `index.html` 所在目录任选一种启动方式：

**方式 A：双击 `启动服务器.bat`（推荐，最省事）**
双击后会弹出一个命令行窗口，直接打印两条地址，例如：
```
PC    : http://127.0.0.1:8000/
Phone : http://192.168.1.23:8000/
```
手机浏览器输入 `Phone` 那条即可（换成你屏幕上显示的 IP）。窗口不要关。

**方式 B：Python**
在本目录打开 PowerShell（资源管理器地址栏输入 `powershell` 回车）：
```powershell
python -m http.server 8000
```
如果提示找不到 python，试：
```powershell
py -3 -m http.server 8000
```

**方式 C：Node.js**
```powershell
node serve.js
```

**方式 D：VS Code 的 Live Server 插件**（端口通常是 5500）

服务器启动后，电脑浏览器访问 `http://127.0.0.1:8000/index.html` 能打开就说明服务器正常。

### 2. 查电脑的局域网 IP

```powershell
ipconfig
```
在「无线局域网适配器 WLAN」一段里找 **IPv4 地址**，例如 `192.168.1.23`。
（不要用 `127.0.0.1`，也不要用 VMware / VirtualBox 等虚拟网卡的地址。）

### 3. 手机打开

1. 手机和电脑连**同一个 WiFi**
2. 手机浏览器地址栏输入：`http://192.168.1.23:8000/index.html`（换成你的 IP）
3. 打开后点击/触摸交叉点即可落子；竖屏、横屏都会自动适配

### 4. 打不开时的排查顺序

1. **服务器还在运行吗**：启动服务器的终端窗口不能关，Ctrl+C 会停掉服务
2. **IP 对不对**：必须是 WLAN 的 IPv4，且手机和电脑在同一个网段（前三段相同）
3. **Windows 防火墙**：第一次启动 Python/Node 时弹窗要勾选「专用网络」并允许。
   没弹窗就手动放行端口（**管理员** PowerShell）：
   ```powershell
   netsh advfirewall firewall add rule name="Gomoku8000" dir=in action=allow protocol=TCP localport=8000
   ```
   测完想删掉规则：
   ```powershell
   netsh advfirewall firewall delete rule name="Gomoku8000"
   ```
4. **路由器 AP 隔离/客户端隔离**：开启后同 WiFi 设备互相访问会被拦截，需要登录路由器后台关闭
5. **手机开了 VPN / 代理 / 移动数据优先**：先关掉再试
6. **公司、学校、酒店网络**：常禁止设备互访，可改用手机热点：电脑连手机热点，再用手机访问电脑在该热点下的 IP
7. **端口被占用**：换 `8001`、`8080` 等端口，地址里端口号同步改

## 三、手机直接打开文件（不用服务器，可选）

只是想在手机上自己玩，也可以把 `index.html` 直接传到手机：

- **Android**：用微信 / QQ / 数据线把文件传到手机 → 在「文件管理」里找到 `index.html` → 选择「用浏览器打开」。Chrome 能直接运行 `file://` 页面，功能完整。
- **iPhone / iPad**：iOS 的「文件」App 预览 HTML 时可能不执行脚本，建议用上面的服务器方式，或改用下面的静态托管。
- 本地打开时页面不请求任何网络资源，断网也能玩。

## 四、不在同一 WiFi 也想打开（公网访问）

### 1. 永久网址：免费静态托管（推荐，约 3 分钟）

**GitHub Pages（全程网页操作，不用会 git）**
1. 登录 GitHub → 右上角 `+` → **New repository**
2. Repository name 填 `gomoku`，可见性选 **Public** → Create repository
3. 在仓库页点 **uploading an existing file**，把本目录的 `index.html` 拖进去 → Commit changes
4. 仓库页 → **Settings** → 左侧 **Pages** → Source 选 `Deploy from a branch`
   → Branch 选 `main` + `/ (root)` → Save
5. 等 1～2 分钟，访问：`https://<你的用户名>.github.io/gomoku/`
6. 以后改了游戏，只要重新上传 `index.html` 覆盖即可

**Gitee Pages（国内访问更快，需要实名认证）**
1. 登录 Gitee → 新建公开仓库 → 上传 `index.html`
2. 仓库页 → 服务 → Gitee Pages → 启动
3. 得到 `https://<用户名>.gitee.io/<仓库名>/`

> 仓库根目录的文件名必须是 `index.html`，这样网址用目录形式就能直接打开。
> 如果放在子目录里，就访问 `https://…/子目录/`。

### 2. 临时网址：本机 SSH 隧道（不注册账号，但电脑必须开着）

只想马上发给别人看几眼时，可以临时把本地服务映射到公网：

1. 新建一个空目录，只把 `index.html`（以及 `serve.js`）复制进去 —— 避免把本目录的说明文档也暴露到公网
2. 在该目录里启动服务：`node serve.js`（或 `python -m http.server 8000`）
3. 另开一个 PowerShell 窗口执行（Windows 10/11 自带 ssh）：
   ```powershell
   ssh -T -o StrictHostKeyChecking=no -R 80:127.0.0.1:8000 nokey@localhost.run
   ```
4. 窗口里会打印一个 `https://xxxx.app.lhr.life` 地址，手机和电脑都能打开
5. 关掉窗口 / 电脑休眠，网址立刻失效；免费域名还会定期轮换，不适合长期使用

> 注意 `-R 80:` 后面要写 `127.0.0.1:8000` 而不是 `localhost:8000`：
> Windows 可能把 localhost 解析成 IPv6 `::1`，而本地服务监听的是 IPv4，会返回 502。
> 只想内网访问时，用 `启动服务器.bat` 打印的局域网地址就够了，不需要开隧道。

## 五、代码结构（自顶向下）

| 区块 | 说明 |
| --- | --- |
| `<style>` 基础与布局 | `#app` 用 `100dvh` 撑满视口；棋盘区 `flex:1` 吃掉剩余空间；工具栏自动换行 |
| 皮肤变量 | `body[data-theme="wood|minimal|dark|go"]` 定义页面背景、卡片、按钮、状态点、横幅等 CSS 变量，一处切换整体换肤 |
| `canvas` 绘制 | 底板（渐变 + 木纹肌理）、15×15 网格、星位、棋子（径向渐变 + 投影 + 高光）、最后一手小圆点、获胜连线与金色圆环 |
| 尺寸与高清屏 | `resize()` 取棋盘区可用边长的最小值作为棋盘 CSS 边长；`gap = 边长/16`；画布物理像素 = CSS 边长 × `devicePixelRatio`（上限 3），再用 `setTransform` 缩放，保证高分屏不发虚 |
| 坐标换算 | `pointToCell()` 把指针坐标按 `getBoundingClientRect()` 比例映射回 CSS 坐标，再四舍五入到最近的交叉点，距离超过 `0.72 × 格距` 视为误触 |
| 交互 | `pointerdown` 同时覆盖鼠标与触屏；`pointermove` 只对鼠标做落子虚影预览 |
| 状态机 | `board`（225 格数组）、`moves`（历史栈）、`current`、`winner`、`isDraw`、`winLine`；`place / undo / restart / updateUI` 四个函数驱动全部界面 |
| 胜负判定 | `findWinLine()` 沿横、竖、两条斜线双向统计连续同色棋子，长度 ≥ 5 即获胜（无禁手，长连也算） |
| 响应式 | 宽屏工具栏两端对齐；手机横屏且高度 ≤ 560px 时切换为「棋盘在左、状态与按钮在右」的网格布局 |

## 六、说明

- 换肤选择会用 `localStorage` 记住（只存皮肤名，不保存任何对局记录）
- 全部逻辑都在浏览器本地运行，不联网、不登录、不上传数据
