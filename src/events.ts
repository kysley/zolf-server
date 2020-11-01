import http from 'http';

let timer: any = undefined;

http.createServer((req, res) => {
  if (req.url?.toLowerCase().includes('/stream')) {
    res.writeHead(200, {
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    clearInterval(timer);
    timer = setInterval(() => {
      res.write('\n\n');
    }, 1000);
  }
});
