package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.MeetingRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends MongoRepository<MeetingRoom, String> {

    /**
     * Find active room for a meeting
     */
    Optional<MeetingRoom> findByMeetingIdAndStatus(String meetingId, String status);

    /**
     * Find all active rooms
     */
    List<MeetingRoom> findByStatus(String status);

    /**
     * Find room by room code
     */
    Optional<MeetingRoom> findByRoomCode(String roomCode);

    /**
     * Find rooms created after a certain time
     */
    List<MeetingRoom> findByCreatedAtAfter(Instant createdAt);

    /**
     * Find rooms for a specific meeting
     */
    List<MeetingRoom> findByMeetingId(String meetingId);

    /**
     * Find rooms that have ended
     */
    @Query("{ 'status': 'ENDED', 'endedAt': { $lt: ?0 } }")
    List<MeetingRoom> findEndedRoomsBefore(Instant beforeTime);
}
