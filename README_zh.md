# <p align="center">🤖 302AI 代码沙盒 MCP 服务🚀✨</p>

<p align="center">一个代码沙盒的MCP服务，能让AI助手使用沙盒以安全的方式运行任意代码。</p>

<p align="center"><a href="https://www.npmjs.com/package/@302ai/sandbox-mcp" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="README_zh.md">中文</a> | <a href="README.md">English</a> | <a href="README_ja.md">日本語</a></p>

![](docs/302_Sandbox_MCP_Server.jpg) 

## 界面预览
以下是使用示例
![](docs/302_Sandbox_MCP_Server_screenshot_01.png)     
![](docs/302_Sandbox_MCP_Server_screenshot_02.png)     

以下是支持使用的工具列表
![](docs/302_Sandbox_MCP_Server_screenshot_03.png)

   

## ✨ 功能特性 ✨
- 🔧 动态加载 - 自动从远程服务器更新工具列表
- 🌐 支持多种模式，可以在本地使用 `stdin` 模式，或者作为远程 HTTP 服务器运行
### 🚀 工具列表
- [一键运行代码](https://302ai.apifox.cn/api-276039652)
- [创建沙盒](https://302ai.apifox.cn/api-276079606)
- [查询自己的沙盒列表](https://302ai.apifox.cn/api-276086526)
- [摧毁沙盒](https://302ai.apifox.cn/api-276092957)
- [运行代码](https://302ai.apifox.cn/api-276100061)
- [运行命令行](https://302ai.apifox.cn/api-276106261)
- [查询指定路径下的文件信息](https://302ai.apifox.cn/api-276110558)
- [往沙盒里导入文件数据](https://302ai.apifox.cn/api-276123813)
- [导出沙盒文件](https://302ai.apifox.cn/api-276123525)

## 开发

安装依赖:

```bash
npm install
```

构建服务器:

```bash
npm run build
```

用于开发的自动重新构建:

```bash
npm run watch
```

## 安装

要与 Claude Desktop 一起使用，请添加服务器配置:

MacOS系统: `~/Library/Application Support/Claude/claude_desktop_config.json`    
Windows系统: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "302ai-sandbox-mcp": {
      "command": "npx",
      "args": ["-y", "@302ai/sandbox-mcp"],
      "env": {
        "302AI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

要与 Cherry Studio 一起使用，请添加服务器配置:

```json
{
  "mcpServers": {
    "Li2ZXXJkvhAALyKOFeO4N": {
      "name": "302ai-sandbox-mcp",
      "description": "",
      "isActive": true,
      "registryUrl": "",
      "command": "npx",
      "args": [
        "-y",
        "@302ai/sandbox-mcp@0.2.0"
      ],
      "env": {
        "302AI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

要与 ChatWise 一起使用，需将以下内容复制到剪切板
```json
{
  "mcpServers": {
    "302ai-sandbox-mcp": {
      "command": "npx",
      "args": ["-y", "@302ai/sandbox-mcp"],
      "env": {
        "302AI_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```
在设置->工具->添加按钮->选择从剪贴板导入
![](docs/302_Sandbox_MCP_Server_screenshot_04.jpg)

### 在[这里](https://dash.302.ai/apis/list)获取您的302AI_API_KEY
[使用教程](https://help.302.ai/docs/API-guan-li)

### 调试

由于 MCP 服务器通过标准输入输出(stdio)通信,调试可能具有挑战性。我们建议使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector),它可以作为一个包脚本使用:

```bash
npm run inspector
```

Inspector 将提供一个 URL 以便在浏览器中访问调试工具。

## ✨ 302.AI介绍 ✨
[302.AI](https://302.ai)是一个面向企业的AI应用平台，按需付费，开箱即用，开源生态。✨
1. 🧠 集合了最新最全的AI能力和品牌，包括但不限于语言模型、图像模型、声音模型、视频模型。
2. 🚀 在基础模型上进行深度应用开发，我们开发真正的AI产品，而不是简单的对话机器人
3. 💰 零月费，所有功能按需付费，全面开放，做到真正的门槛低，上限高。
4. 🛠 功能强大的管理后台，面向团队和中小企业，一人管理，多人使用。
5. 🔗 所有AI能力均提供API接入，所有工具开源可自行定制（进行中）。
6. 💡 强大的开发团队，每周推出2-3个新应用，产品每日更新。有兴趣加入的开发者也欢迎联系我们
