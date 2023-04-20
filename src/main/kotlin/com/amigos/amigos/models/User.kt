package com.amigos.amigos.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class User(var user: String, var username: String, var password: String) {
    constructor() : this("", "", "")

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // this is the primary key which will be auto generated
    var id: Long? = null

    override fun toString(): String {
        return "User(user='$user', username='$username', password='$password', id=$id)"
    }

}