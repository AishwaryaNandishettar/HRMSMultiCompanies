package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<ChatMessage, String> {

    // 🔹 1-to-1 chat history
    @Query(
        value = "{ $or: [ { senderEmail:?0, receiverEmail:?1 }, { senderEmail:?1, receiverEmail:?0 } ] }",
        sort = "{ timestamp: 1 }"
    )
    List<ChatMessage> findChat(String user1, String user2);

    // 🔹 unseen messages
    @Query(
        value = "{ receiverEmail:?0, senderEmail:?1, seen:false }"
    )
    List<ChatMessage> findUnseen(String receiver, String sender);

    // 🔹 all unseen messages for a receiver
    @Query(
        value = "{ receiverEmail:?0, seen:false }",
        sort = "{ timestamp: -1 }"
    )
    List<ChatMessage> findAllUnseenForReceiver(String receiver);

    // 🔹 last message between two users (returns list, take first element)
    @Query(
        value = "{ $or: [ { senderEmail:?0, receiverEmail:?1 }, { senderEmail:?1, receiverEmail:?0 } ] }",
        sort = "{ timestamp: -1 }"
    )
    List<ChatMessage> findLastMessageBetween(String user1, String user2);
}
