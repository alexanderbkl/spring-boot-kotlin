package com.amigos.amigos.models

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id


@Entity
class Task(var task: String, var isCompleted: Boolean) {
    constructor() : this("", false)

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // this is the primary key which will be auto generated
    var id: Long? = null



}