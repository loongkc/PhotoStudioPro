// worker.js - 简单的 Worker 返回 HTML
export default {
  async fetch(request, env, ctx) {
    // 直接返回 HTML 内容
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网站</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        h1 {
            color: #333;
        }
    </style>
</head>
<body>
    <h1>欢迎访问我的网站！</h1>
    <p>这是一个部署在 Cloudflare Workers 上的网站。</p>
    
    <!-- 如果你想让 index.html 的内容显示在这里，有两种方法： -->
    <!-- 方法1：把 index.html 的内容复制到这里 -->
    <!-- 方法2：或者使用下面的代码导入 index.html -->
</body>
</html>`;
    
    return new Response(html, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
        'cache-control': 'public, max-age=3600'
      }
    });
  }
}
