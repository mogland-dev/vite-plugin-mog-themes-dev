// In Vite, when you modify a file, it will automatically update the content in the browser, 
// and this function is implemented through WebSocket.

// Generally use full-reload, that is, the entire page is refreshed, 
// but this will cause the state of the page to be lost, such as filling in the content in a form, 
// and then refreshing it.

// Therefore, we need a more granular update method, but because our theme is rendered using middleware, 
// we cannot directly use the HMR function of Vite.

// At this time, you need to use custom.
// custom will trigger a custom event, we can listen to this event in the browser, and then execute our own logic.
// Here, we listen to the custom event, and then determine whether it is the file we need. 
// If so, we will execute our logic.


class PRAIVTE_ThemeWeb {
  // 储存当前页面结构
  pageStructure = null;
  // 储存当前页面结构的hash
  pageStructureHash = null;

  constructor() {
    this.init();
  }

  async init() {
    const { structure: pageStructure, hash: pageStructureHash } = await this.getPageStructure();
    if (this.pageStructure) {
      console.error('The page structure has been initialized, please check if there is a problem with the code.');
    }
    this.pageStructure = pageStructure;
    this.pageStructureHash = pageStructureHash;
  }

  // 当收到custom事件时，便读取当前页面结构，然后与之前的页面结构进行对比，如果不同，则刷新页面
  async handleCustomEvent() {
    const { structure: pageStructure, hash: pageStructureHash } = await this.getPageStructure();
    if (!this.pageStructure) {
      this.pageStructure = pageStructure;
      this.pageStructureHash = pageStructureHash;
      return;
    }
    if (pageStructureHash !== this.pageStructureHash) {
    
    }
  }

  // 获取当前页面结构和hash
  async getPageStructure() {
    const response = await fetch(location.href);
    const html = await response.text();
    const dom = new DOMParser().parseFromString(html, 'text/html');
    const pageStructure = dom.querySelector('html').innerHTML;
    const pageStructureHash = dom.querySelector('script[data-mog-private-hash]').getAttribute('data-mog-private-hash');
    return {
      structure: pageStructure,
      hash: pageStructureHash,
    };
  }
}

function connectViteWsServer(
  protocol = 'ws',
  hostAndPath = 'localhost:5173'
) {
  const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');

  // Listen for WebSocket connection open event
  socket.addEventListener('open', () => {
    console.log('%c[mog-theme-dev-server]', 'color: #2196f3; font-weight: bold;', 'Connected to Vite server.');
  });

  // Listen for WebSocket connection event
  socket.addEventListener('message', (event) => {
    console.log('%c[mog-theme-dev-server]', 'color: #2196f3; font-weight: bold;', 'Received:', JSON.parse(event.data));
  });

  // Listen for WebSocket connection close event
  socket.addEventListener('close', async ({ wasClean }) => {
    if (wasClean) return;
    console.log('%c[mog-theme-dev-server]', 'color: #2196f3; font-weight: bold;', 'Disconnected from Vite server.');
    await waitForSuccessfulPing(protocol, hostAndPath);
    console.log('%c[mog-theme-dev-server]', 'color: #2196f3; font-weight: bold;', 'Reconnected to Vite server.');
    location.reload();
  });
}

function waitForSuccessfulPing(
  protocol = 'ws',
  hostAndPath = 'localhost:5173'
) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');
      socket.addEventListener('open', () => {
        socket.close();
        clearInterval(interval);
        resolve();
      });
    }, 1000);
  });
}

connectViteWsServer();