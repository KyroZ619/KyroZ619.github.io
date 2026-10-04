# Kyro's Diary ✎

Kyro Zhao 的个人网站：一本"捡到请录用"的日记本。整体是稚拙风 / 扁平 / 波普 / 新丑 / 字体拼贴 / 蜡笔涂鸦的混搭，白底，配一个会跟着你翻页的 8-bit 像素小人。

纯 HTML/CSS/JS，不用构建，可以直接双击 `index.html` 打开，也可以直接推到 GitHub Pages。

## 文件结构

```
index.html          页面结构（6 页日记 + 开场的翻书动画）
css/style.css       所有样式（纸张、蜡笔质感、拼贴字、海报、响应式）
js/content.js       ← 平时改内容只改这里：邮箱、LinkedIn、简历路径、6 个作品、小人台词
js/doodles.js       蜡笔涂鸦生成器（星星、花、音符……都是代码画的，每次长得一样）
js/pixel-kyro.js    像素小人：逐像素画的地图 + 所有动作帧
js/main.js          开场动画、拼贴字、海报墙、作品弹窗、小人跟随逻辑
assets/kyro.jpg     照片
dev/sprites.html    小人动作预览页（改像素图时用）
```

## 上线前要改的

1. **简历 PDF**：放到 `assets/Kyro_Zhao_Resume.pdf`（或者在 `content.js` 里改 `resume` 路径）。没放之前点按钮会弹出"coming soon"提示。
2. **LinkedIn**：在 `content.js` 填上 `linkedin`，按钮会自动出现。
3. **邮箱**：现在用的是简历里的 163 邮箱，想换就改 `content.js` 的 `email`。
4. 再核对一遍 `index.html` 里的文字（TL;DR、About、经历、技能海报），都来自你的简历素材。

## 小技巧

- 开场翻书动画每个浏览器会话只播一次。想再看：网址后面加 `?intro`；想停在封面：`?intro&hold`；直接跳过：`?nointro`。
- 改小人：编辑 `js/pixel-kyro.js` 里的 `HEAD` / `TORSO` / `LEGS` 字符图（每个字母对应 `PAL` 里的一个颜色），然后打开 `dev/sprites.html` 看效果。
- 每个 section 的 `data-pose` 决定小人在这一页做什么（wave / listen / business / dj / sing / bye），`.buddy-spot` 决定它站在哪。
- 系统开启"减少动态效果"时，动画会自动关掉。

## 部署到 GitHub Pages

```bash
git init && git add . && git commit -m "kyro's diary"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库 → Settings → Pages 里选 `main` 分支、根目录，保存就行。
