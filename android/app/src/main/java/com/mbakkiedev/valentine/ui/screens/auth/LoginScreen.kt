package com.mbakkiedev.valentine.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.model.User
import com.mbakkiedev.valentine.data.repository.AuthRepository
import com.mbakkiedev.valentine.ui.components.GarageButton
import com.mbakkiedev.valentine.ui.components.GarageTextField
import com.mbakkiedev.valentine.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(onLoginSuccess: (User) -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    
    val scope = rememberCoroutineScope()
    val authRepository = remember { AuthRepository() }

    fun handleLogin() {
        if (email.isBlank() || password.isBlank()) {
            error = "Please fill in all fields"
            return
        }
        loading = true
        error = null
        scope.launch {
            try {
                val user = authRepository.login(email.trim(), password)
                if (user != null) {
                    onLoginSuccess(user)
                } else {
                    error = "Invalid credentials or profile not found"
                }
            } catch (e: Exception) {
                error = "Login failed: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .padding(horizontal = 28.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Spacer(modifier = Modifier.height(48.dp))

        // Logo Circle
        Box(
            modifier = Modifier
                .size(88.dp)
                .clip(CircleShape)
                .background(Surface)
                .border(2.dp, Primary, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Build,
                contentDescription = null,
                tint = Primary,
                modifier = Modifier.size(40.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Valentine's Garage",
            color = TextPrimary,
            fontSize = 28.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 0.5.sp,
            textAlign = TextAlign.Center
        )

        Text(
            text = "FLEET SERVICE MANAGEMENT",
            color = TextSecondary,
            fontSize = 13.sp,
            modifier = Modifier.padding(top = 4.dp),
            letterSpacing = 2.sp
        )

        Spacer(modifier = Modifier.height(40.dp))

        // Divider
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            HorizontalDivider(modifier = Modifier.weight(1f), color = Border)
            Text(
                text = "STAFF LOGIN",
                color = TextDisabled,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 12.dp),
                letterSpacing = 2.sp
            )
            HorizontalDivider(modifier = Modifier.weight(1f), color = Border)
        }

        Spacer(modifier = Modifier.height(28.dp))

        GarageTextField(
            value = email,
            onValueChange = { email = it; error = null },
            label = "Email Address"
        )

        Spacer(modifier = Modifier.height(16.dp))

        GarageTextField(
            value = password,
            onValueChange = { password = it; error = null },
            label = "Password",
            isPassword = true
        )

        if (error != null) {
            Text(
                text = error!!,
                color = Error,
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 8.dp)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        GarageButton(
            text = "Log In",
            onClick = { handleLogin() },
            isLoading = loading
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Role Hints
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            RoleBadge(icon = Icons.Default.Lock, label = "Admin", color = AdminBadge)
            Spacer(modifier = Modifier.width(16.dp))
            RoleBadge(icon = Icons.Default.Person, label = "Mechanic", color = MechanicBadge)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Contact your system administrator if you need an account.",
            color = TextDisabled,
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
            lineHeight = 18.sp
        )

        Spacer(modifier = Modifier.height(48.dp))
    }
}

@Composable
fun RoleBadge(icon: ImageVector, label: String, color: Color) {
    Row(
        modifier = Modifier
            .background(Surface, RoundedCornerShape(20.dp))
            .border(1.dp, Border, RoundedCornerShape(20.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = color, modifier = Modifier.size(13.dp))
        Text(text = label, color = color, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}
