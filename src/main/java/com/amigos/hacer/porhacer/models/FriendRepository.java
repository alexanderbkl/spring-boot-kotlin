package com.amigos.hacer.porhacer.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRepository extends JpaRepository<FriendRequest, Long> {
    FriendRequest findByStatus(FriendRequestStatus status);
    FriendRequest findBySender(User sender);
    FriendRequest findByRecipient(User recipient);
    //find by sender and recipient
    List<FriendRequest> findBySenderAndRecipient(User sender, User recipient);

    List<FriendRequest> findAllByRecipientAndStatus(User recipient, FriendRequestStatus status);
    List<FriendRequest> findAllBySenderAndStatus(User sender, FriendRequestStatus status);
    //find if sender or recipient is user and status is pending
    List<FriendRequest> findAllBySenderOrRecipient(User sender, User recipient);
    List<FriendRequest> findAllBySenderOrRecipientAndStatus(User sender, User recipient, FriendRequestStatus status);

}
