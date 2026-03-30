import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

interface NotificationMessage {
  id: number;
  userId: number;
  userType: string;
  type: string;
  typeDescription: string;
  title: string;
  content: string;
  isRead: boolean;
  relatedId: number | null;
  relatedType: string | null;
  createdAt: string;
}

interface UseNotificationWebSocketProps {
  userId: number | null;
  userType: 'company' | 'individual';
  onNotificationReceived?: (notification: NotificationMessage) => void;
}

export const useNotificationWebSocket = ({
  userId,
  userType,
  onNotificationReceived
}: UseNotificationWebSocketProps) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const callbackRef = useRef(onNotificationReceived);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // 콜백 업데이트
  useEffect(() => {
    callbackRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    // 이미 연결되어 있으면 중복 연결 방지
    if (clientRef.current?.connected) {
      console.log('이미 WebSocket 연결됨, 중복 연결 방지');
      return;
    }

    console.log(`WebSocket 연결 시도 (${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);

    // 최대 재연결 시도 횟수 초과
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('WebSocket 최대 재연결 시도 횟수 초과');
      setError('알림 서버 연결 실패 (재시도 횟수 초과)');
      return;
    }

    let isCleanedUp = false;

    // WebSocket 클라이언트 초기화
    const backendUrl = 'https://api.nextenter.store/ws/notifications';
    console.log(`STOMP: Connecting to ${backendUrl}`);
    
    const socket = new SockJS(backendUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        // 프로덕션에서는 debug 로그 비활성화
        if (import.meta.env.DEV) {
          console.log('STOMP Debug: ', str);
        }
      },
      reconnectDelay: 0, // 자동 재연결 비활성화
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    // 연결 성공 콜백
    stompClient.onConnect = () => {
      if (isCleanedUp) return;
      
      console.log('✅ WebSocket 연결 성공');
      setConnected(true);
      setError(null);
      reconnectAttempts.current = 0; // 재연결 카운터 리셋

      // 알림 구독
      const destination = `/topic/notifications/${userType}/${userId}`;
      console.log('알림 구독:', destination);

      stompClient.subscribe(destination, (message: IMessage) => {
        if (isCleanedUp) return;
        
        try {
          const notification: NotificationMessage = JSON.parse(message.body);
          console.log('📩 알림 수신:', notification);
          
          if (callbackRef.current) {
            callbackRef.current(notification);
          }
        } catch (err) {
          console.error('알림 파싱 오류:', err);
        }
      });
    };

    // 연결 실패 콜백
    stompClient.onStompError = (frame) => {
      if (isCleanedUp) return;
      
      console.error('❌ STOMP Protocol Error:', frame.headers['message']);
      console.error('STOMP Details:', frame.body);
      setError(`알림 서버 프로토콜 오류: ${frame.headers['message']}`);
      setConnected(false);
      reconnectAttempts.current++;
    };

    // 연결 끊김 콜백
    stompClient.onDisconnect = () => {
      if (isCleanedUp) return;
      
      console.log('🔌 WebSocket 연결 끊김');
      setConnected(false);
    };

    // 웹소켓 에러 핸들링
    stompClient.onWebSocketError = (event) => {
      if (isCleanedUp) return;
      
      console.error('🚫 WebSocket 에러:', event);
      setError('WebSocket 연결 오류');
      setConnected(false);
      reconnectAttempts.current++;
    };

    // 연결 시작
    try {
      stompClient.activate();
      clientRef.current = stompClient;
    } catch (err) {
      console.error('WebSocket 활성화 실패:', err);
      setError('WebSocket 초기화 실패');
      reconnectAttempts.current++;
    }

    // Cleanup
    return () => {
      isCleanedUp = true;
      console.log('WebSocket cleanup 실행');
      
      if (clientRef.current) {
        try {
          if (clientRef.current.connected) {
            clientRef.current.deactivate();
          }
          clientRef.current = null;
        } catch (err) {
          console.error('WebSocket cleanup 오류:', err);
        }
      }
    };
  }, [userId, userType]); // onNotificationReceived 제거

  return { connected, error };
};
