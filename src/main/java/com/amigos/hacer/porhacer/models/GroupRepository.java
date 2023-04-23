package com.amigos.hacer.porhacer.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Group findByName(String name);

    List<Group> findAllByOwnerId(String id);
    //find all groups where the user is a member but not the owner
    List<Group> findAllByMembersContainingAndOwnerNot(User user, User owner);
}
