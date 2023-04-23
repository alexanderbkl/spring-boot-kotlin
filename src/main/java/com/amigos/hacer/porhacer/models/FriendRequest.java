package com.amigos.hacer.porhacer.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "friend_request")
public class FriendRequest {

    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private FriendRequestStatus status;
    @NonNull
    @ManyToOne(cascade = CascadeType.PERSIST)
    private User sender;
    @NonNull
    @ManyToOne(cascade = CascadeType.PERSIST)
    private User recipient;


}