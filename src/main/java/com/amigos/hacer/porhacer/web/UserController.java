package com.amigos.hacer.porhacer.web;

import com.amigos.hacer.porhacer.models.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;


@RestController
@RequestMapping("/api")
public class UserController {
    private final ClientRegistration registration;
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    public UserController(ClientRegistrationRepository registrations, UserRepository userRepository, FriendRepository friendRepository) {
        this.registration = registrations.findByRegistrationId("auth0");
        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User userAuth) {

        if (userAuth == null) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            Map<String, Object> details = userAuth.getAttributes();
            String userId = details.get("sub").toString();

            // check to see if user already exists
            Optional<User> user = userRepository.findById(userId);

            //check if details get email is null, if it is, generate an empty email
            String email = "";
            if (details.get("email") == null) {
                email = "no email";
            } else {
                email = details.get("email").toString();
            }
            //if no user, create one
            if (user.isEmpty()) {
                User newUser = new User(userId, details.get("name").toString(), email);
                userRepository.save(newUser);
            }
            return ResponseEntity.ok().body(userAuth.getAttributes());
        }
    }


    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@AuthenticationPrincipal OAuth2User principal) {
        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();

        return ResponseEntity.ok().body(userRepository.findAllByIdNot(userId));
    }

/*
    //get list of all users
    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        System.out.println("users:" + userRepository.findAll());
        return ResponseEntity.ok().body(userRepository.findAll());
    }
*/


    @GetMapping("/friends/pending")
    public ResponseEntity<?> getPendingFriends(Principal principal) {
        return ResponseEntity.ok().body(friendRepository.findAllByRecipientAndStatus(userRepository.getReferenceById(principal.getName()), FriendRequestStatus.PENDING));
    }

    @GetMapping("/friends/requests")
    public ResponseEntity<?> getRequestedFriends(Principal principal) {
        Collection<FriendRequest> friendRequests = friendRepository.findAllBySenderOrRecipient(userRepository.getReferenceById(principal.getName()), userRepository.getReferenceById(principal.getName()));
        //if empty return empty list
        if (friendRequests.isEmpty()) {
            System.out.println("friendRequests is empty");
            return ResponseEntity.ok().body(friendRequests);
        }
        for (FriendRequest friendRequest : friendRequests) {
            System.out.println("friendRequested:" + friendRequest);
        }
        //if principal is sender, set the status to FriendRequestStatus.ACCEPT
        for (FriendRequest friendRequest : friendRequests) {
            if (friendRequest.getRecipient().getId().equals(principal.getName()) && friendRequest.getStatus() == FriendRequestStatus.PENDING) {
                friendRequest.setStatus(FriendRequestStatus.ACCEPT);
            }
        }

        return ResponseEntity.ok().body(friendRequests);
    }

    //send a friend request
    @GetMapping("/friends/request/{friendId}")
    public ResponseEntity<?> sendFriendRequest(Principal principal, @PathVariable String friendId) {
        System.out.println("userId:" + principal.getName() + " friendId:" + friendId);

        Optional<User> senderOptional = userRepository.findById(principal.getName());
        Optional<User> recipientOptional = userRepository.findById(friendId);

        User sender = senderOptional.orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = recipientOptional.orElseThrow(() -> new RuntimeException("Recipient not found"));

        //check if friend request already exists between sender and recipient collection
        Collection<FriendRequest> friendRequests = friendRepository.findBySenderAndRecipient(sender, recipient);

        //if friend request already exists, return
        if (!friendRequests.isEmpty()) {
            return ResponseEntity.ok().body(friendRequests);
        }

        //print out sender and recipient
        System.out.println("sender:" + sender);
        System.out.println("recipient:" + recipient);


        FriendRequest friendRequest = new FriendRequest(FriendRequestStatus.PENDING,
                sender,
                recipient);

        return ResponseEntity.ok()
                .body(friendRepository
                        .save(friendRequest));
    }

    //accept a friend request
    @GetMapping("/friends/accept/{friendId}")
    public ResponseEntity<?> acceptFriendRequest(Principal principal, @PathVariable String friendId) {
        System.out.println("userId:" + principal.getName() + " friendId:" + friendId);

        Optional<User> senderOptional = userRepository.findById(friendId);
        Optional<User> recipientOptional = userRepository.findById(principal.getName());

        User sender = senderOptional.orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = recipientOptional.orElseThrow(() -> new RuntimeException("Recipient not found"));

        //check if friend request already exists between sender and recipient collection
        Collection<FriendRequest> friendRequests = friendRepository.findBySenderAndRecipient(sender, recipient);

        //if friend request already exists, return
        if (friendRequests.isEmpty()) {
            System.out.println("friend request is empty");
            return ResponseEntity.ok().body(friendRequests);
        }

        //print out sender and recipient
        System.out.println("sender:" + sender);
        System.out.println("recipient:" + recipient);

        //set status to accepted
        for (FriendRequest friendRequest : friendRequests) {
            friendRequest.setStatus(FriendRequestStatus.ACCEPTED);
        }

        //if there is a sender with user id and recipient with friend id, set status to accepted

        Collection<FriendRequest> friendRequests2 = friendRepository.findBySenderAndRecipient(recipient, sender);

        //if friend request already exists, return
        if (!friendRequests2.isEmpty()) {
            for (FriendRequest friendRequest : friendRequests2) {
                friendRequest.setStatus(FriendRequestStatus.ACCEPTED);
            }
        }


        return ResponseEntity.ok()
                .body(friendRepository
                        .saveAll(friendRequests));
    }

    @GetMapping("/friends/decline/{friendId}")
    public ResponseEntity<?> declineFriendRequest(Principal principal, @PathVariable String friendId) {

        Optional<User> senderOptional = userRepository.findById(friendId);
        Optional<User> recipientOptional = userRepository.findById(principal.getName());

        User sender = senderOptional.orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = recipientOptional.orElseThrow(() -> new RuntimeException("Recipient not found"));

        //check if friend request already exists between sender and recipient collection
        Collection<FriendRequest> friendRequests = friendRepository.findBySenderAndRecipient(sender, recipient);

        //if friend request already exists, return
        if (!friendRequests.isEmpty()) {
            //remove it from the database
            //set status to accepted
            for (FriendRequest friendRequest : friendRequests) {
                friendRepository.delete(friendRequest);
            }

        }


        //check if friend request already exists between sender and recipient collection
        Collection<FriendRequest> friendRequests2 = friendRepository.findBySenderAndRecipient(recipient, sender);

        //if friend request already exists, return
        if (!friendRequests2.isEmpty()) {
            //set status to accepted
            for (FriendRequest friendRequest : friendRequests2) {
                //remove it from the database
                friendRepository.delete(friendRequest);
            }
        }

        Collection<FriendRequest> friendRequests3 = friendRepository.findAllBySenderOrRecipient(userRepository.getReferenceById(principal.getName()), userRepository.getReferenceById(principal.getName()));

        return ResponseEntity.ok().body(friendRequests3);
    }

    //get list of all friends
    @GetMapping("/friends")
    public ResponseEntity<?> getFriends(Principal principal) {
        System.out.println("starting to search for friends");
        Optional<User> userOptional = userRepository.findById(principal.getName());
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));

        Collection<FriendRequest> friendRequests = friendRepository.findAllBySenderOrRecipientAndStatus(user, user, FriendRequestStatus.ACCEPTED);

        //if empty return empty list
        if (friendRequests.isEmpty()) {
            System.out.println("friendRequests is empty");
            return ResponseEntity.ok().body(friendRequests);
        }
        //return users from friend requests
        Collection<User> friends = new ArrayList<>();

        for (FriendRequest friendRequest : friendRequests) {
            if (friendRequest.getStatus() == FriendRequestStatus.ACCEPTED) {
                if (friendRequest.getSender().getId().equals(principal.getName())) {
                    friends.add(friendRequest.getRecipient());
                } else {
                    friends.add(friendRequest.getSender());
                }
            }
        }

        //print all friends
        System.out.println("friends:");
        for (User friend : friends) {
            System.out.println(friend);
        }

        return ResponseEntity.ok().body(friends);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // send logout URL to client so they can initiate logout
        StringBuilder logoutUrl = new StringBuilder();
        String issuerUri = this.registration.getProviderDetails().getIssuerUri();
        logoutUrl.append(issuerUri.endsWith("/") ? issuerUri + "v2/logout" : issuerUri + "/v2/logout");
        logoutUrl.append("?client_id=").append(this.registration.getClientId());

        Map<String, String> logoutDetails = new HashMap<>();
        logoutDetails.put("logoutUrl", logoutUrl.toString());
        request.getSession(false).invalidate();
        return ResponseEntity.ok().body(logoutDetails);
    }
}