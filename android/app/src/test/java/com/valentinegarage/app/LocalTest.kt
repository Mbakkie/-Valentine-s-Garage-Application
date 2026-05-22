package com.mbakkiedev.valentine

import org.junit.Test
import org.junit.Assert.*
import com.mbakkiedev.valentine.data.model.User

class LocalTest {
    @Test
    fun testUserCreation() {
        val user = User(uid = "test_uid", email = "test@example.com", name = "Test User", role = "mechanic")
        assertEquals("test_uid", user.uid)
        assertEquals("test@example.com", user.email)
        assertEquals("mechanic", user.role)
    }

    @Test
    fun testConstants() {
        assertEquals("Valentine's Garage", com.mbakkiedev.valentine.utils.Constants.APP_NAME)
    }
}
