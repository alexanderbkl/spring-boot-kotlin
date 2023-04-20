package com.amigos.amigos.services

import com.amigos.amigos.models.User
import com.amigos.amigos.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder

@Service
class UserService(private val userRepository: UserRepository) {

    fun save(user: User): User {
        return this.userRepository.save(user)
    }

    fun findByEmail(email: String): User? {
        return this.userRepository.findByEmail(email)
    }

    fun getById(id: Int): User {
        return this.userRepository.getById(id)
    }
}