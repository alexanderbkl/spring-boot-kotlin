package com.amigos.amigos.repositories

import com.amigos.amigos.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Int> {
    fun findByEmail(email:String): User?
}