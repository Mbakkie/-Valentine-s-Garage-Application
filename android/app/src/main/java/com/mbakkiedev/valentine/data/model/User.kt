package com.mbakkiedev.valentine.data.model

import java.util.Date

data class User(
    val uid: String = "",
    val email: String = "",
    val name: String = "",
    val role: String = "mechanic", // "admin" or "mechanic"
    val createdAt: String = Date().toString(),
    val active: Boolean = true
)
