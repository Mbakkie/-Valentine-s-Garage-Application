package com.mbakkiedev.valentine.data.repository

import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.mbakkiedev.valentine.data.model.CheckIn
import com.mbakkiedev.valentine.data.model.ServiceTask
import com.mbakkiedev.valentine.utils.Constants
import kotlinx.coroutines.tasks.await
import java.util.Date

class ReportRepository {
    private val db = FirebaseFirestore.getInstance()

    suspend fun getEmployeeActivityReport(): Map<String, EmployeeActivity> {
        val checkInsSnap = db.collection(Constants.CHECKINS_COLLECTION)
            .orderBy("checkInTime", Query.Direction.DESCENDING)
            .get().await()

        val report = mutableMapOf<String, EmployeeActivity>()

        for (checkInDoc in checkInsSnap.documents) {
            val checkIn = checkInDoc.toObject(CheckIn::class.java) ?: continue
            val tasksSnap = checkInDoc.reference.collection(Constants.TASKS_SUBCOLLECTION).get().await()

            for (taskDoc in tasksSnap.documents) {
                val task = taskDoc.toObject(ServiceTask::class.java) ?: continue
                if (!task.completed || task.completedByUid == null) continue

                val uid = task.completedByUid
                val name = task.completedByName ?: "Unknown"

                val empActivity = report.getOrPut(uid) {
                    EmployeeActivity(name = name)
                }

                empActivity.tasksCompleted += 1
                if (checkIn.truckPlate !in empActivity.vehiclesWorkedOn) {
                    empActivity.vehiclesWorkedOn.add(checkIn.truckPlate)
                }
            }
        }
        return report
    }

    suspend fun getAllCheckIns(): List<CheckIn> {
        return db.collection(Constants.CHECKINS_COLLECTION)
            .orderBy("checkInTime", Query.Direction.DESCENDING)
            .get().await()
            .toObjects(CheckIn::class.java)
    }

    suspend fun getDashboardSummary(): DashboardSummary {
        val allCheckIns = db.collection(Constants.CHECKINS_COLLECTION).get().await()
        val activeCheckIns = db.collection(Constants.CHECKINS_COLLECTION)
            .whereIn("status", listOf("checked_in", "in_service"))
            .get().await()

        val totalCheckIns = allCheckIns.size()
        val activeVehicles = activeCheckIns.size()
        
        // This is a simplified "today" filter
        val todayStr = Date().toString().substring(0, 10) // Rough way to get YYYY-MM-DD-ish
        val completedToday = allCheckIns.documents.filter {
            val status = it.getString("status")
            val checkInTime = it.getString("checkInTime") ?: ""
            status == "completed" && checkInTime.contains(todayStr)
        }.size

        return DashboardSummary(totalCheckIns, activeVehicles, completedToday)
    }
}

data class EmployeeActivity(
    val name: String,
    var tasksCompleted: Int = 0,
    val vehiclesWorkedOn: MutableList<String> = mutableListOf()
)

data class DashboardSummary(
    val totalCheckIns: Int,
    val activeVehicles: Int,
    val completedToday: Int
)
