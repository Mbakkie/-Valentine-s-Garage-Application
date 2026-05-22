package com.mbakkiedev.valentine.ui.screens.mechanic

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.model.CheckIn
import com.mbakkiedev.valentine.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VehicleListScreen(
    vehicles: List<CheckIn>,
    onAddClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onVehicleClick: (CheckIn) -> Unit,
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Valentine's Garage", color = Primary, fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = onLogoutClick) {
                        Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = "Logout", tint = Primary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Surface),
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = onAddClick, containerColor = Primary) {
                Icon(Icons.Default.Add, contentDescription = "Check-in Vehicle", tint = Color.Black)
            }
        },
        containerColor = Background
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            if (vehicles.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text("No active vehicles", color = TextSecondary)
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(vehicles) { vehicle ->
                        VehicleItem(vehicle = vehicle) { onVehicleClick(vehicle) }
                    }
                }
            }
        }
    }
}

@Composable
fun VehicleItem(vehicle: CheckIn, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        colors = CardDefaults.cardColors(containerColor = Surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = vehicle.truckPlate, color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text(text = vehicle.truckModel, color = TextSecondary, fontSize = 14.sp)
            }
            Badge(
                containerColor = getConditionColor(vehicle.condition),
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text(vehicle.condition.uppercase(), color = Color.Black, modifier = Modifier.padding(4.dp))
            }
        }
    }
}

fun getConditionColor(condition: String): Color {
    return when (condition.lowercase()) {
        "excellent" -> Success
        "good" -> Success
        "fair" -> Warning
        "poor" -> Error
        "critical" -> Error
        else -> TextSecondary
    }
}
