package com.amigos.amigos.controllers

import com.amigos.amigos.models.Task
import com.amigos.amigos.services.TaskService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*


@Controller
@RequestMapping("/api/tasks")
class TaskController {
    @Autowired
    private val taskService: TaskService? = null

    @get:GetMapping("/")
    val allTasks: ResponseEntity<List<Any>>
        get() = ResponseEntity.ok(taskService!!.allTask)



    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: Long?, @RequestBody task: Task): ResponseEntity<Task> {
        task.id = id
        return ResponseEntity.ok(taskService!!.updateTask(task))
    }


    @PostMapping("/")
    fun createTask(@RequestBody task: Task): ResponseEntity<Task> {
        return ResponseEntity.ok(taskService!!.createNewTask(task))
    }

    @DeleteMapping("/{id}")
    fun getAllTasks(@PathVariable id: Long?): ResponseEntity<Boolean> {
        //delete task
        taskService!!.findTaskById(id!!).ifPresent { task: Task? -> taskService.deleteTask(task!!) }
        return ResponseEntity.ok(true)
    }

    //find specific task by id
    @GetMapping("/{id}")
    fun getTaskById(@PathVariable id: Long?): ResponseEntity<Task> {
        return ResponseEntity.ok(taskService!!.findTaskById(id!!).get())
    }

    //find all incompleted tasks
    @GetMapping("/incompleted")
    fun getIncompletedTasks(): ResponseEntity<List<Any>> {
        return ResponseEntity.ok(taskService!!.getIncompletedTasks())
    }

    //find all completed tasks
    @GetMapping("/completed")
    fun getCompletedTasks(): ResponseEntity<List<Any>> {
        return ResponseEntity.ok(taskService!!.getCompletedTasks())
    }
}