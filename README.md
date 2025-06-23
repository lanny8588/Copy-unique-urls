# Copy-unique-urls
# 一款AI生成的HTTP Request Sniffer Chrome Extension / HTTP请求捕获器 Chrome扩展插件


## 英文版

### 📌 Introduction
A Chrome extension that captures and displays all XHR/Fetch requests made by the current webpage, including:
- Request URLs
- Methods (GET/POST)
- Request bodies (for POST requests)
- Status codes
- Response headers

### ✨ Features
- **Real-time monitoring** of XHR/Fetch requests
- **POST body viewer** with JSON formatting
- **URL filtering** to quickly find specific requests
- **One-click copy** all unique URLs
- **Tab-specific** data isolation
- **Clean UI** with color-coded elements

### 🛠 Installation
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked" 
5. Select the folder containing the extension files

### 🎮 Usage
1. Click the extension icon in your toolbar
2. The popup will show all captured requests
3. Use the filter box to search specific requests
4. Click any request to inspect details
5. Use buttons to:
   - Copy all URLs
   - Clear current session

### ⚙ Technical Details
- Built with Chrome Extension Manifest V3
- Uses Chrome's `webRequest` API
- Data is stored per-tab and cleared when tab closes
- No external dependencies

### 📝 Notes
- Only captures XHR and Fetch requests
- POST bodies are automatically parsed when possible
- Requires `<all_urls>` permission to monitor requests

---

## 中文版

### 📌 简介
一款用于捕获并显示当前网页所有XHR/Fetch请求的Chrome扩展，功能包括：
- 请求URL
- 请求方法(GET/POST)
- POST请求体内容
- 状态码
- 响应头

### ✨ 功能特点
- **实时监控** XHR/Fetch请求
- **POST请求体查看器**，支持JSON格式化
- **URL过滤**快速查找特定请求
- **一键复制**所有唯一URL
- **按标签页隔离**数据
- **简洁UI**，彩色编码元素

### 🛠 安装方法
1. 下载或克隆本仓库
2. 在Chrome浏览器访问 `chrome://extensions/`
3. 开启"开发者模式"(右上角开关)
4. 点击"加载已解压的扩展程序"
5. 选择包含扩展文件的文件夹

### 🎮 使用说明
1. 点击浏览器工具栏中的扩展图标
2. 弹出窗口将显示所有捕获的请求
3. 使用过滤框搜索特定请求
4. 点击任意请求查看详细信息
5. 使用功能按钮：
   - 复制所有URL
   - 清除当前会话

### ⚙ 技术细节
- 基于Chrome扩展Manifest V3构建
- 使用Chrome的`webRequest` API
- 数据按标签页存储，关闭标签页时自动清除
- 无外部依赖

### 📝 注意事项
- 仅捕获XHR和Fetch请求
- 自动解析POST请求体(如可能)
- 需要`<all_urls>`权限来监控请求

---

## 📜 License / 许可证
MIT License - 开源项目，可自由使用和修改

## 展示
![image](https://github.com/user-attachments/assets/ab017aca-f264-4238-baec-1ec172e1e03a)

