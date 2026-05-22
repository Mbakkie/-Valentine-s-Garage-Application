package com.mbakkiedev.valentine.data.model

import java.util.Date

data class User(
    val uid: String = "Xdwg9C8esUUo5mG3RjSM1oykqTL2",
    val email: String = "adminuser@gmail.com",
    val name: String = "mbakkie",
    val role: String = "admin",
    val createdAt: String = Date().toString(),
    val active: Boolean = true
)
