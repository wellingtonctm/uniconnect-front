class WebSocketService {
    private socket: WebSocket;
  
    constructor(url: string) {
      this.socket = new WebSocket(url);
    }
  
    connect(
      onMessage: (data: any) => void,
      onError?: (error: Event) => void,
      onClose?: (event: CloseEvent) => void
    ): void {
      this.socket.onmessage = (event: MessageEvent) => {
        onMessage(JSON.parse(event.data));
      };
  
      this.socket.onerror = (error: Event) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      };
  
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket closed:', event);
        if (onClose) onClose(event);
      };
    }
  
    sendMessage<T>(message: T): void {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify(message));
      }
    }
  
    disconnect(): void {
      this.socket.close();
    }
  }
  
  export default WebSocketService;
  