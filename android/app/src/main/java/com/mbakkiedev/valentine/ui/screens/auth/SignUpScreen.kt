package com.mbakkiedev.valentine.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.repository.AuthRepository
import com.mbakkiedev.valentine.ui.components.GarageButton
import com.mbakkiedev.valentine.ui.components.GarageTextField
import com.mbakkiedev.valentine.ui.theme.*
import com.mbakkiedev.valentine.utils.Constants
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SignUpScreen(onBack: () -> Unit, onSuccess: () -> Unit) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var role by remember { mutableStateOf(Constants.MECHANIC) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()
    val authRepository = remember { AuthRepository() }

    fun handleSignUp() {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            error = "Please fill in all fields"
            return
        }
        loading = true
        error = null
        scope.launch {
            try {
                authRepository.signUp(name.trim(), email.trim(), password, role)
                onSuccess()
            } catch (e: Exception) {
                error = "Registration failed: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Create Account", color = Primary, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Primary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Surface)
            )
        },
        containerColor = Background
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .padding(28.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            GarageTextField(
                value = name,
                onValueChange = { name = it; error = null },
                label = "Full Name"
            )

            Spacer(modifier = Modifier.height(16.dp))

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

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Account Role",
                color = TextPrimary,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.align(Alignment.Start)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                RadioButton(
                    selected = role == Constants.MECHANIC,
                    onClick = { role = Constants.MECHANIC },
                    colors = RadioButtonDefaults.colors(selectedColor = Primary)
                )
                Text(text = "Mechanic", color = TextPrimary)
                Spacer(modifier = Modifier.width(24.dp))
                RadioButton(
                    selected = role == Constants.ADMIN,
                    onClick = { role = Constants.ADMIN },
                    colors = RadioButtonDefaults.colors(selectedColor = Primary)
                )
                Text(text = "Admin", color = TextPrimary)
            }

            if (error != null) {
                Text(
                    text = error!!,
                    color = Error,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            GarageButton(
                text = "Create Account",
                onClick = { handleSignUp() },
                isLoading = loading
            )
        }
    }
}
