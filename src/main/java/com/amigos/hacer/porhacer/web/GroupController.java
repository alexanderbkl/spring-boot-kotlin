package com.amigos.hacer.porhacer.web;

import com.amigos.hacer.porhacer.models.Group;
import com.amigos.hacer.porhacer.models.GroupRepository;
import com.amigos.hacer.porhacer.models.User;
import com.amigos.hacer.porhacer.models.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
class GroupController {

    private final Logger log = LoggerFactory.getLogger(GroupController.class);
    private GroupRepository groupRepository;
    private UserRepository userRepository;

    public GroupController(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/groups")
    Collection<Group> groups(Principal principal) {
        return groupRepository.findAllByOwnerId(principal.getName());
    }

    @GetMapping("/group/{id}")
    ResponseEntity<?> getGroup(@PathVariable Long id) {
        Optional<Group> group = groupRepository.findById(id);
        return group.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/group")
    ResponseEntity<Group> createGroup(@Valid @RequestBody Group group,
                                      @AuthenticationPrincipal OAuth2User principal) throws URISyntaxException {
        log.info("Request to create group: {}", group);
        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();

        // check to see if user already exists
        Optional<User> user = userRepository.findById(userId);


        //check if details get email is null, if it is, generate an empty email
        String email = "";
        if (details.get("email") == null) {
            email = details.get("name").toString();
        } else {
            email = details.get("email").toString();
        }
        group.setOwner(user.orElse(new User(userId,
                details.get("name").toString(), email)));

        Group result = groupRepository.save(group);
        return ResponseEntity.created(new URI("/api/group/" + result.getId()))
                .body(result);
    }

    @PutMapping("/group/{id}")
    ResponseEntity<Group> updateGroup(@Valid @RequestBody Group group) {
        log.info("Request to update group: {}", group);
        Group result = groupRepository.save(group);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/group/{id}")
    public ResponseEntity<?> deleteGroup(@PathVariable Long id) {
        log.info("Request to delete group: {}", id);
        groupRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    //get all groups that a user is a member of
    @GetMapping("/groups/memberof")
    Collection<Group> groupsMemberOf(Principal principal) {
        Optional<User> userOptional = userRepository.findById(principal.getName());
        User user = userOptional.orElseThrow(() -> new RuntimeException("User not found"));
        return groupRepository.findAllByMembersContainingAndOwnerNot(user, user);
    }
}