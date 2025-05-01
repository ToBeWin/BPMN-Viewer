// 监听扩展图标点击事件
chrome.action.onClicked.addListener(() => {
  // 打开新标签页显示BPMN Viewer
  chrome.tabs.create({ url: 'index.html' });
}); 