// src/service/websocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/**
 * Метод для подключения к WebSocket и обработки данных
 * @param {string} url URL для подключения к WebSocket
 * @param {string} topic Топик, на который нужно подписаться
 * @param {function} onMessage Callback для обработки полученных данных
 */
export const connectToWebSocket = (url, topic, onMessage) => {
  const socket = new SockJS(url);
  const stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log("Connected to WebSocket!");

      stompClient.subscribe(topic, (message) => {
        if (message.body) {
          const tradingData = JSON.parse(message.body); // Парсим данные
          onMessage(tradingData);  // Передаем данные в коллбек
        }
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from WebSocket.");
    },
    debug: (str) => console.log(str),
  });

  stompClient.activate();

  // Возвращаем функцию для деактивации подключения
  return () => {
    stompClient.deactivate();
  };
};
