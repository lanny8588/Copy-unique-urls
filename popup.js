document.addEventListener('DOMContentLoaded', () => {
  const requestsContainer = document.getElementById('requests');
  const filterInput = document.getElementById('filter');
  const copyAllUrlsBtn = document.getElementById('copyAllUrls');
  const clearRequestsBtn = document.getElementById('clearRequests');
  let currentTabId = null;
  let currentRequests = [];

  // 初始化 - 获取当前标签页ID
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      currentTabId = tabs[0].id;
      loadInitialRequests();
    }
  });

  // 加载初始请求
  function loadInitialRequests() {
    chrome.runtime.sendMessage(
      { type: 'getInitialRequests', tabId: currentTabId },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        currentRequests = response?.requests || [];
        updateUI();
      }
    );
  }

  // 更新UI显示
  function updateUI(filter = '') {
    requestsContainer.innerHTML = '';
    
    const filteredRequests = currentRequests.filter(req => 
      req.url.toLowerCase().includes(filter.toLowerCase())
    );
    
    if (filteredRequests.length === 0) {
      requestsContainer.innerHTML = '<div class="no-requests">no request</div>';
      return;
    }
    
    // 按时间倒序显示
    filteredRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filteredRequests.forEach(req => {
      const requestElement = document.createElement('div');
      requestElement.className = 'request';
      
      let bodyContent = '';
      if (req.body && req.method === 'POST') {
        try {
          bodyContent = typeof req.body === 'string' 
            ? req.body 
            : JSON.stringify(req.body, null, 2);
        } catch (e) {
          bodyContent = '[no analysis content]';
        }
      }
      
      requestElement.innerHTML = `
        <div class="request-header">
          <span class="method">${req.method}</span>
          ${req.statusCode ? `<span class="status">${req.statusCode}</span>` : ''}
          <span class="type">${req.type}</span>
          <span class="url">${req.url}</span>
        </div>
        ${bodyContent ? `<div class="body-section">
          <strong>request body:</strong>
          <pre class="body">${bodyContent}</pre>
        </div>` : ''}
        <div class="timestamp">${new Date(req.timestamp).toLocaleString()}</div>
      `;
      
      requestsContainer.appendChild(requestElement);
    });
  }

  // 复制所有URL
  copyAllUrlsBtn.addEventListener('click', () => {
    if (currentRequests.length === 0) {
      showNotification('没有URL可复制');
      return;
    }
    
    const uniqueUrls = [...new Set(currentRequests.map(req => req.url))];
    copyToClipboard(uniqueUrls.join('\n'), `copy unique ${uniqueUrls.length} URL`);
  });

  // 清除当前数据
  clearRequestsBtn.addEventListener('click', () => {
    currentRequests = [];
    chrome.runtime.sendMessage(
      { type: 'clearSession', tabId: currentTabId },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
        updateUI();
        showNotification('clead content');
      }
    );
  });

  // 监听新请求
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'newRequest' && message.tabId === currentTabId) {
      currentRequests.push(message.request);
      updateUI(filterInput.value);
    }
  });

  // 辅助函数
  function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text)
      .then(() => showNotification(message))
      .catch(() => showNotification('copy failed'));
  }

  function showNotification(message) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 1500);
  }
  
  // 过滤功能
  filterInput.addEventListener('input', (e) => {
    updateUI(e.target.value);
  });
});