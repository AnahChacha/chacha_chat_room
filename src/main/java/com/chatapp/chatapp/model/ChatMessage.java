package com.chatapp.chatapp.model;

import com.chatapp.chatapp.enums.MessageType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private MessageType messageType;
    private String content;
    private String sender;
}
