package com.mbakkiedev.valentine.data.model

import java.util.Date

data class ServiceTask(
    val taskId: String = "",
    val category: String = "",
    val task: String = "",
    val critical: Boolean = false,
    val completed: Boolean = false,
    val completedByUid: String? = null,
    val completedByName: String? = null,
    val completedAt: String? = null,
    val note: String = "",
    val updatedAt: String = Date().toString()
)
