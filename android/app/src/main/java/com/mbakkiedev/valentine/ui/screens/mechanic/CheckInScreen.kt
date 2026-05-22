package com.mbakkiedev.valentine.ui.screens.mechanic

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.model.CheckIn
import com.mbakkiedev.valentine.data.repository.VehicleRepository
import com.mbakkiedev.valentine.ui.components.GarageButton
import com.mbakkiedev.valentine.ui.components.GarageTextField
import com.mbakkiedev.valentine.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CheckInScreen(
    onBackClick: () -> Unit,
    onSuccess: () -> Unit,
) {
    var plate by remember { mutableStateOf("") }
    var model by remember { mutableStateOf("") }
    var odometer by remember { mutableStateOf("") }
    var driverName by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()
    val repository = remember { VehicleRepository() }

    fun handleSubmit() {
        if (plate.isBlank() || model.isBlank() || odometer.isBlank()) {
            error = "Please fill in required fields"
            return
        }
        loading = true
        error = null
        scope.launch {
            try {
                val checkIn = CheckIn(
                    truckPlate = plate.uppercase(),
                    truckModel = model,
                    odometerReading = odometer.toDoubleOrNull() ?: 0.0,
                    driverName = driverName,
                    notes = notes,
                )
                repository.createCheckIn(checkIn)
                onSuccess()
            } catch (e: Exception) {
                error = "Failed to save: ${e.message}"
            } finally {
                loading = false
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Vehicle Check-In", color = Primary, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
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
                .padding(20.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Register a truck for service",
                color = TextSecondary,
                fontSize = 14.sp
            )

            GarageTextField(value = plate, onValueChange = { plate = it }, label = "Truck Registration / Plate")
            GarageTextField(value = model, onValueChange = { model = it }, label = "Make & Model")
            GarageTextField(value = odometer, onValueChange = { odometer = it }, label = "Odometer Reading (km)")
            GarageTextField(value = driverName, onValueChange = { driverName = it }, label = "Driver / Owner Name")
            GarageTextField(value = notes, onValueChange = { notes = it }, label = "Additional Notes")

            if (error != null) {
                Text(text = error!!, color = Error, fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.height(8.dp))

            GarageButton(
                text = "Check In Vehicle",
                onClick = { handleSubmit() },
                isLoading = loading
            )
        }
    }
}
