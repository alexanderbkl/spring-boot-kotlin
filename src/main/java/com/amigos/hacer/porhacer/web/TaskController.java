package com.amigos.hacer.porhacer.web;

import com.amigos.hacer.porhacer.models.*;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final Logger log = LoggerFactory.getLogger(GroupController.class);
    private TaskRepository taskRepository;
    private GroupRepository groupRepository;

    public TaskController(TaskRepository taskRepository, GroupRepository groupRepository) {
        this.taskRepository = taskRepository;
        this.groupRepository = groupRepository;
    }

    @GetMapping("/group/{id}/tasks")
    Collection<Task> tasks(@PathVariable Long id) {
        System.out.println("searching tasks id: " + id);
        return taskRepository.findAllByGroupId(id);
    }

    @GetMapping("/group/{id}/task/{taskId}")
    ResponseEntity<?> getTask(@PathVariable Long id, @PathVariable Long taskId) {
        Optional<Task> task = taskRepository.findById(taskId);
        return task.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/group/{id}/task")
    ResponseEntity<Task> createTask(@Valid @RequestBody Task task, @PathVariable Long id) throws URISyntaxException {
        log.info("Request to create task: {}", task);
        Optional<Group> groupOptional = groupRepository.findById(id);
        Group group = groupOptional.orElseThrow(() -> new RuntimeException("Group not found"));

        task.setGroup(group);
        Task result = taskRepository.save(task);
        return ResponseEntity.created(new URI("/api/task/" + result.getId()))
                .body(result);
    }

    @PutMapping("/group/{id}/task/{taskId}")
    ResponseEntity<Task> updateTask(@Valid @RequestBody Task task, @PathVariable Long id, @PathVariable Long taskId) throws URISyntaxException {
        log.info("Request to update task: {}", task);
        Optional<Group> groupOptional = groupRepository.findById(id);
        Group group = groupOptional.orElseThrow(() -> new RuntimeException("Group not found"));

        Optional<Task> taskOptional = taskRepository.findById(taskId);
        Task taskToUpdate = taskOptional.orElseThrow(() -> new RuntimeException("Task not found"));

        taskToUpdate.setName(task.getName());
        taskToUpdate.setStatus(task.getStatus());
        taskToUpdate.setGroup(group);
        Task result = taskRepository.save(taskToUpdate);
        return ResponseEntity.created(new URI("/api/task/" + result.getId()))
                .body(result);
    }

}
