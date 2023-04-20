package com.amigos.amigos.repositories

import com.amigos.amigos.models.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User?, Long?> {
    fun findByUsername(username: String?): User?
    override fun findAll(): List<User>
    override fun findById(id: Long): Optional<User?>
}