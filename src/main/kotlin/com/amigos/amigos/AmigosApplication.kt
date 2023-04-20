package com.amigos.amigos

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
import org.springframework.boot.runApplication

@SpringBootApplication(exclude = [SecurityAutoConfiguration::class])
class AmigosApplication

fun main(args: Array<String>) {
	runApplication<AmigosApplication>(*args)
}
