package com.mbakkiedev.valentine.data.repository

import android.net.Uri
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.storage.FirebaseStorage
import com.mbakkiedev.valentine.data.model.CheckIn
import com.mbakkiedev.valentine.data.model.ServiceTask
import com.mbakkiedev.valentine.utils.Constants
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await
import java.util.Date

class VehicleRepository {
    private val db = FirebaseFirestore.getInstance()
    private val storage = FirebaseStorage.getInstance()

    suspend fun uploadVehiclePhoto(localUri: Uri, plate: String): String {
        val filename = "vehicles/${plate}_${System.currentTimeMillis()}.jpg"
        val storageRef = storage.reference.child(filename)
        storageRef.putFile(localUri).await()
        return storageRef.downloadUrl.await().toString()
    }

    suspend fun createCheckIn(checkIn: CheckIn, photoUri: Uri? = null): String {
        var finalCheckIn = checkIn
        if (photoUri != null) {
            val photoUrl = uploadVehiclePhoto(photoUri, checkIn.truckPlate)
            finalCheckIn = checkIn.copy(photoUrl = photoUrl)
        }

        val docRef = db.collection(Constants.CHECKINS_COLLECTION).document()
        val id = docRef.id
        docRef.set(finalCheckIn.copy(id = id)).await()
        
        // Seed tasks
        val tasksCol = docRef.collection(Constants.TASKS_SUBCOLLECTION)
        val batch = db.batch()
        com.mbakkiedev.valentine.utils.ChecklistItems.DEFAULT_CHECKLIST.forEach { task ->
            val tDoc = tasksCol.document()
            batch[tDoc] = task
        }
        batch.commit().await()

        return id
    }

    fun subscribeToActiveCheckIns(): Flow<List<CheckIn>> = callbackFlow {
        val query = db.collection(Constants.CHECKINS_COLLECTION)
            .whereIn("status", listOf("checked_in", "in_service"))
            .orderBy("checkInTime", Query.Direction.DESCENDING)

        val listener = query.addSnapshotListener { snapshot, error ->
            if (error != null) {
                close(error)
                return@addSnapshotListener
            }
            val checkIns = snapshot?.toObjects(CheckIn::class.java) ?: emptyList()
            trySend(checkIns)
        }
        awaitClose { listener.remove() }
    }

    suspend fun updateCheckInStatus(checkInId: String, status: String) {
        db.collection(Constants.CHECKINS_COLLECTION).document(checkInId)
            .update("status", status, "updatedAt", Date().toString())
            .await()
    }

    suspend fun getTasks(checkInId: String): List<ServiceTask> {
        val snapshot = db.collection(Constants.CHECKINS_COLLECTION)
            .document(checkInId)
            .collection(Constants.TASKS_SUBCOLLECTION)
            .get().await()
        return snapshot.toObjects(ServiceTask::class.java)
    }
}
