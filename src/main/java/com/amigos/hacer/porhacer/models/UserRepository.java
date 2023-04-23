package com.amigos.hacer.porhacer.models;

import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {

    //findall by id not
    List<User> findAllByIdNot(String id);


}
