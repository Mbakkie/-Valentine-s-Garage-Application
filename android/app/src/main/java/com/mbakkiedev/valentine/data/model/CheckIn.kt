package com.mbakkiedev.valentine.data.model

import java.util.Date

data class CheckIn(
    val id: String = "",
    val truckPlate: String = "",
    val truckModel: String = "",
    val odometerReading: Double = 0.0,
    val condition: String = "good", // excellent, good, fair, poor, critical
    val driverName: String = "",
    val notes: String = "",
    val photoUrl: String? = null,
    val checkedInByUid: String = "",
    val checkedInByName: String = "",
    val status: String = "checked_in",
    val checkInTime: String = Date().toString(),
    val updatedAt: String = Date().toString()
)
