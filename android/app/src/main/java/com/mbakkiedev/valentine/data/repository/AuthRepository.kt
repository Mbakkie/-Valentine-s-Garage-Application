package com.mbakkiedev.valentine.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.mbakkiedev.valentine.data.model.User
import com.mbakkiedev.valentine.utils.Constants
import kotlinx.coroutines.tasks.await

class AuthRepository {
    private val auth = FirebaseAuth.getInstance()
    private val db = FirebaseFirestore.getInstance()

    suspend fun login(email: String, password: String): User? {
        val result = auth.signInWithEmailAndPassword(email, password).await()
        return result.user?.let { getUserProfile(it.uid) }
    }

    fun logout() {
        auth.signOut()
    }

    suspend fun getUserProfile(uid: String): User? {
        val doc = db.collection(Constants.USERS_COLLECTION).document(uid).get().await()
        return doc.toObject(User::class.java)
    }

    suspend fun setUserProfile(user: User) {
        db.collection(Constants.USERS_COLLECTION).document(user.uid).set(user).await()
    }

    fun getCurrentUserUid(): String? = auth.currentUser?.uid

    fun isUserLoggedIn(): Boolean = auth.currentUser != null
}
