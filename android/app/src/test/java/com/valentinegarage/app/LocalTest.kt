package com.valentinegarage.app

import org.junit.Test
import org.junit.Assert.assertEquals
import com.mbakkiedev.valentine.data.model.User
import com.mbakkiedev.valentine.utils.Constants

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
        assertEquals("Valentine's Garage", Constants.APP_NAME)
    }
}
