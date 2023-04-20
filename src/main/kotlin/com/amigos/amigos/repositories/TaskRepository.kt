package com.amigos.amigos.repositories

import com.amigos.amigos.models.Task
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*


@Repository
interface TaskRepository : JpaRepository<Task?, Long?> {
    fun findByTask(task: String?): Task?
    override fun findAll(): List<Task>
    override fun findById(id: Long): Optional<Task?>
    //find all incompleted tasks
    fun findByIsCompleted(isCompleted: Boolean?): List<Task>

}