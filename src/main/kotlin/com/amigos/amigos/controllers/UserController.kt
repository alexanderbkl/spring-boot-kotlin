package com.amigos.amigos.controllers

import com.amigos.amigos.models.User
import com.amigos.amigos.repositories.UserRepository
import com.amigos.amigos.services.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping("/api/users")
class UserController {
    @Autowired
    private val userService: UserService? = null

    @GetMapping("/")
    fun getAllUsers(): ResponseEntity<List<User>> {
        return ResponseEntity.ok(userService!!.allUsers)
    }

    @PostMapping("/")
    fun createUser(@RequestBody user: User): ResponseEntity<User> {
        return ResponseEntity.ok(userService!!.createNewUser(user))
    }

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long?): ResponseEntity<User> {
        return ResponseEntity.ok(userService!!.findUserById(id!!).get())
    }

    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long?, @RequestBody user: User): ResponseEntity<User> {
        user.id = id
        return ResponseEntity.ok(userService!!.updateUser(user))
    }

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long?): ResponseEntity<Boolean> {

        userService!!.findUserById(id!!).ifPresent { user: User? -> userService.deleteUser(user!!) }
        return ResponseEntity.ok(true)
    }
}