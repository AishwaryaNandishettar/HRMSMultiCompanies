package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface GroupMessageRepository
        extends MongoRepository<GroupMessage, String> {

    List<GroupMessage> findByGroupIdOrderByCreatedAtAsc(String groupId);

    // Find unseen messages for a specific user in a group
    @Query(
        value = "{ groupId:?0, seenBy: { $nin: [?1] } }",
        sort = "{ createdAt: -1 }"
    )
    List<GroupMessage> findUnseenByGroupIdAndUser(String groupId, String userEmail);
}
