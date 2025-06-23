const capturedRequests = new Map();

// 处理请求数据
function processRequest(details) {
  // 只处理XHR和Fetch请求
  const allowedTypes = ['xmlhttprequest', 'fetch'];
  if (!allowedTypes.includes(details.type)) return null;
  
  // 只处理GET和POST方法
  const allowedMethods = ['GET', 'POST'];
  if (!allowedMethods.includes(details.method)) return null;
  
  // 确保有有效的tabId
  if (details.tabId === -1) return null;

  // 初始化该标签页的存储
  if (!capturedRequests.has(details.tabId)) {
    capturedRequests.set(details.tabId, []);
  }

  const requestData = {
    url: details.url,
    method: details.method,
    type: details.type,
    tabId: details.tabId,
    timestamp: new Date().toISOString(),
    requestId: details.requestId
  };

  // 处理POST请求体
  if (details.method === 'POST' && details.requestBody) {
    try {
      if (details.requestBody.formData) {
        requestData.body = details.requestBody.formData;
      } else if (details.requestBody.raw) {
        requestData.body = details.requestBody.raw.map(data => {
          try {
            return new TextDecoder().decode(data.bytes);
          } catch {
            return '[Binary data]';
          }
        }).join('');
      }
    } catch (e) {
      requestData.body = '[Parse error]';
    }
  }

  return requestData;
}

// 监听请求
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const request = processRequest(details);
    if (!request) return { cancel: false };

    // 存储请求
    capturedRequests.get(details.tabId).push(request);
    
    // 发送给popup
    chrome.runtime.sendMessage({
      type: 'newRequest',
      tabId: details.tabId,
      request: request
    }).catch(() => {});

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

// 监听响应
chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (!capturedRequests.has(details.tabId)) return;
    
    const requests = capturedRequests.get(details.tabId);
    const index = requests.findIndex(req => req.requestId === details.requestId);
    
    if (index !== -1) {
      requests[index].statusCode = details.statusCode;
      requests[index].responseHeaders = details.responseHeaders;
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getInitialRequests') {
    sendResponse({
      requests: capturedRequests.get(message.tabId) || []
    });
  } else if (message.type === 'clearSession') {
    capturedRequests.delete(message.tabId);
    sendResponse({ success: true });
  }
  return true;
});

// 标签页关闭时清理数据
chrome.tabs.onRemoved.addListener((tabId) => {
  capturedRequests.delete(tabId);
});