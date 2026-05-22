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
        try {
            android.util.Log.d("AuthRepository", ">>> Starting login for: $email")
            val result = auth.signInWithEmailAndPassword(email.trim(), password).await()
            val firebaseUser = result.user ?: throw Exception("Firebase Auth returned null user")
            
            val uid = firebaseUser.uid
            android.util.Log.d("AuthRepository", ">>> Auth Success! UID: $uid")
            
            var profile = getUserProfile(uid)
            
            if (profile == null) {
                android.util.Log.w("AuthRepository", ">>> Profile not found for $uid. Creating one...")
                profile = User(
                    uid = uid,
                    email = firebaseUser.email ?: email,
                    name = "Admin User",
                    role = "admin" // Forcing admin role so you can access the dashboard
                )
                setUserProfile(profile)
                android.util.Log.d("AuthRepository", ">>> Created Admin profile for $uid")
            } else {
                // Ensure the role is lowercase for the code to work correctly
                if (profile.role.equals("ADMIN", ignoreCase = true)) {
                    profile = profile.copy(role = "admin")
                }
                android.util.Log.d("AuthRepository", ">>> Profile loaded. Role: ${profile.role}")
            }
            return profile
        } catch (e: Exception) {
            android.util.Log.e("AuthRepository", ">>> Login Error: ${e.message}")
            throw e
        }
    }

    suspend fun signUp(name: String, email: String, password: String, role: String = Constants.MECHANIC): User? {
        val result = auth.createUserWithEmailAndPassword(email, password).await()
        val firebaseUser = result.user ?: return null
        
        val user = User(
            uid = firebaseUser.uid,
            name = name,
            email = email,
            role = role
        )
        
        setUserProfile(user)
        return user
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
