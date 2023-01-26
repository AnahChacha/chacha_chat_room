package com.chatapp.chatapp.controller;

import com.chatapp.chatapp.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatAppController {
    @MessageMapping("/chat.sendMessage")
    @SendTo("/sock/chacha")
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage){
       return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/sock/chacha")
    public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor){
//        adding a username in the application session
        headerAccessor.getSessionAttributes().put("username",chatMessage.getSender());
        return chatMessage;
    }

}
