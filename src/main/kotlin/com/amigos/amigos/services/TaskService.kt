package com.amigos.amigos.services

import com.amigos.amigos.models.Task
import com.amigos.amigos.repositories.TaskRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*


@Service
class TaskService {
    @Autowired
    private val taskRepository: TaskRepository? = null
    fun createNewTask(task: Task): Task {
        return taskRepository!!.save(task)
    }

    val allTask: List<Any>
        get() = taskRepository!!.findAll()

    fun findTaskById(id: Long): Optional<Task?> {
        return taskRepository!!.findById(id)
    }

    fun deleteTask(task: Task) {
        taskRepository!!.delete(task)
    }

    fun updateTask(task: Task): Task {
        return taskRepository!!.save(task)
    }

    fun getIncompletedTasks(): List<Any> {
        return taskRepository!!.findByIsCompleted(false)
    }

    fun getCompletedTasks(): List<Any> {
        return taskRepository!!.findByIsCompleted(true)
    }


}