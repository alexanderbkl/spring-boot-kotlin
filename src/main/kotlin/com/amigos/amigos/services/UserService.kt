package com.amigos.amigos.services

import com.amigos.amigos.models.User
import com.amigos.amigos.repositories.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.util.*
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
@Service
class UserService {
    @Autowired
    private val userRepository: UserRepository? = null
    fun createNewUser(user: User): User {
        user.password = BCryptPasswordEncoder().encode(user.password)
        return userRepository!!.save(user)
    }

    val allUsers: List<User>
        get() = userRepository!!.findAll()

    fun findUserById(id: Long): Optional<User?> {
        return userRepository!!.findById(id)
    }

    fun deleteUser(user: User) {
        userRepository!!.delete(user)
    }

    fun updateUser(user: User): User {
        return userRepository!!.save(user)
    }

    fun getUserByUsername(username: String): User? {
        return userRepository!!.findByUsername(username)
    }
}