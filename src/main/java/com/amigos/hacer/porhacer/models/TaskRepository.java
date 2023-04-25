package com.amigos.hacer.porhacer.models;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Task findByName(String name);

    //find all tasks by group id
    List<Task> findAllByGroupId(Long id);

}
