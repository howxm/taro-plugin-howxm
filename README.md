# taro-plugin-howxm
> 用于解决在taro中使用 **浩客问卷** 小程序的时候会遇到问卷无法弹出的问题

## 背景
taro在打包的时候将引用到的`<howxm-widget />`全部打包到了模板文件中，在业务代码中只引用了1次，但是在模板文件中相关的template却有10多个。

因此在弹出的时候， 会遇到一个报错：`component is not attached on current page`，这就是当前页面没有找到howxm-widget的组件模板导致的。

查找官方issue，找到一个问题[taro使用webpack5进行开发时编译后, 报错找不到模板](https://github.com/NervJS/taro/issues/12553)，
尝试了下面的解决方案，都未解决。

## 临时解决方案
手动将`<howxm-widget />`引入到打包后的*.wxml文件中，所有功能可正常使用。

## 最终解决方案
在taro官方没有好的解决方案之前，为了防止每次build后开发人员需要手动copy的这个过程，写了这个插件，在build之后自动添加`<howxm-widget />`
到对应的文件中。

## 使用

### Install
在Taro的项目根目录下安装
```bash
yarn add taro-plugin-howxm --dev
// or
npm install taro-plugin-howxm --save-dev
```
### Config
修改项目 config/index.js 中的 plugins 配置为如下：
```js
const config = {
    ...
    plugins: ['taro-plugin-howxm']
    ...
}
```
#### 配置项
插件可以接受如下参数：  

| 参数  |  类型 | 用途  | 必填  | 默认值              |
|---|---|---|-----|------------------|
| fileExtension  |   string[] | 原文件后缀  | 非必填 | ['.tsx', '.jsx'] |

如果想要处理的文件类型不是默认的，那么可以配置此项，会覆盖默认的文件类型，配置如下：
```js
const config = {
    ...
    plugins: [['taro-plugin-howxm', {
        fileExtensions: ['.tsx', '.jsx']
    }]]
    ...
}
```
