import { useEffect, useRef, useState, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Notification as NotificationData } from '../api/notification';

interface UseWebSocketProps {
  userId: number;
  userType: 'company' | 'individual';
  enabled?: boolean;
}

export const useWebSocket = ({ userId, userType, enabled = true }: UseWebSocketProps) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!enabled || !userId) return;

    try {
      const client = new Client({
        webSocketFactory: () => new SockJS('https://api.nextenter.store/ws/notifications'),
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log('✅ WebSocket Connected');
        setConnected(true);

        // 구독: 사용자별 알림 채널
        const topic = `/topic/notifications/${userType}/${userId}`;
        client.subscribe(topic, (message: IMessage) => {
          try {
            const notification: NotificationData = JSON.parse(message.body);
            console.log('📬 새 알림 수신:', notification);
            
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // 브라우저 알림 표시
            if (window.Notification && window.Notification.permission === 'granted') {
              new window.Notification(notification.title, {
                body: notification.content,
                icon: '/logo.png'
              });
            }
          } catch (error) {
            console.error('알림 파싱 오류:', error);
          }
        });
      };

      client.onStompError = (frame) => {
        console.error('❌ STOMP Error:', frame.headers['message']);
        setConnected(false);
      };

      client.onDisconnect = () => {
        console.log('❌ WebSocket Disconnected');
        setConnected(false);
      };

      clientRef.current = client;
      client.activate();
    } catch (error) {
      console.error('❌ WebSocket 연결 실패:', error);
      setConnected(false);
    }
  }, [userId, userType, enabled]);

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect, disconnect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const decrementUnreadCount = useCallback(() => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return {
    notifications,
    unreadCount,
    connected,
    clearNotifications,
    decrementUnreadCount,
    setUnreadCount
  };
};
