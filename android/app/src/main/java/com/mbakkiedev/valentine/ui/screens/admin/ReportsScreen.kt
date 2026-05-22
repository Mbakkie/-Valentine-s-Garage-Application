package com.mbakkiedev.valentine.ui.screens.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.BorderStroke
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.model.CheckIn
import com.mbakkiedev.valentine.data.repository.EmployeeActivity
import com.mbakkiedev.valentine.data.repository.ReportRepository
import com.mbakkiedev.valentine.ui.theme.*

@Composable
fun ReportsScreen(onBack: () -> Unit) {
    var activeTab by remember { mutableIntStateOf(0) }
    var loading by remember { mutableStateOf(true) }
    var empData by remember { mutableStateOf<Map<String, EmployeeActivity>>(emptyMap()) }
    var vhData by remember { mutableStateOf<List<CheckIn>>(emptyList()) }

    val repository = remember { ReportRepository() }

    LaunchedEffect(Unit) {
        empData = repository.getEmployeeActivityReport()
        vhData = repository.getAllCheckIns()
        loading = false
    }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .background(Background)
                    .padding(horizontal = 20.dp)
                    .padding(top = 40.dp, bottom = 16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimary)
                    }
                    Text(
                        text = "Reports",
                        color = TextPrimary,
                        fontSize = 26.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
                Text(
                    text = "Employee & vehicle activity",
                    color = TextSecondary,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(start = 12.dp)
                )
            }
        },
        containerColor = Background
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            TabRow(
                selectedTabIndex = activeTab,
                containerColor = Surface,
                contentColor = Primary,
                divider = { HorizontalDivider(color = Border) }
            ) {
                Tab(
                    selected = activeTab == 0,
                    onClick = { activeTab = 0 },
                    text = { Text("Employee Activity", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = Primary,
                    unselectedContentColor = TextSecondary
                )
                Tab(
                    selected = activeTab == 1,
                    onClick = { activeTab = 1 },
                    text = { Text("Vehicle History", fontSize = 13.sp, fontWeight = FontWeight.SemiBold) },
                    selectedContentColor = Primary,
                    unselectedContentColor = TextSecondary
                )
            }

            if (loading) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Primary)
                }
            } else {
                if (activeTab == 0) {
                    EmployeeReportList(empData)
                } else {
                    VehicleHistoryList(vhData)
                }
            }
        }
    }
}

@Composable
fun EmployeeReportList(data: Map<String, EmployeeActivity>) {
    if (data.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No employee activity recorded yet.", color = TextSecondary)
        }
    } else {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(data.values.toList()) { emp ->
                EmployeeCard(emp)
            }
        }
    }
}

@Composable
fun EmployeeCard(emp: EmployeeActivity) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Surface),
        border = BorderStroke(1.dp, Border)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .background(Primary, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = emp.name.take(1).uppercase(),
                        color = Color.Black,
                        fontWeight = FontWeight.Black,
                        fontSize = 18.sp
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(text = emp.name, color = TextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text(text = "Mechanic", color = TextSecondary, fontSize = 12.sp)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(text = emp.tasksCompleted.toString(), color = Primary, fontSize = 24.sp, fontWeight = FontWeight.Black)
                    Text(text = "tasks", color = TextSecondary, fontSize = 11.sp)
                }
            }

            HorizontalDivider(modifier = Modifier.padding(vertical = 12.dp), color = Border)

            Text(text = "Vehicles worked on:", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(bottom = 8.dp))
            
            FlowRow(
                mainAxisSpacing = 6.dp,
                crossAxisSpacing = 6.dp
            ) {
                emp.vehiclesWorkedOn.forEach { plate ->
                    Row(
                        modifier = Modifier
                            .background(SurfaceElevated, RoundedCornerShape(20.dp))
                            .border(1.dp, Border, RoundedCornerShape(20.dp))
                            .padding(horizontal = 10.dp, vertical = 5.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Build,
                            contentDescription = null,
                            tint = Primary,
                            modifier = Modifier.size(12.dp)
                        )
                        Text(text = plate, color = Primary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun VehicleHistoryList(data: List<CheckIn>) {
    if (data.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No check-ins recorded yet.", color = TextSecondary)
        }
    } else {
        LazyColumn(
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(data) { item ->
                VehicleHistoryCard(item)
            }
        }
    }
}

@Composable
fun VehicleHistoryCard(item: CheckIn) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Surface),
        border = BorderStroke(1.dp, Border)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(text = item.truckPlate, color = Primary, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, letterSpacing = 1.sp)
                ConditionBadge(item.condition)
            }

            Text(text = item.truckModel, color = TextPrimary, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(bottom = 8.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), modifier = Modifier.padding(bottom = 4.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Icon(
                        imageVector = Icons.Default.Info,
                        contentDescription = null,
                        tint = TextSecondary,
                        modifier = Modifier.size(13.dp)
                    )
                    Text(text = "${item.odometerReading} km", color = TextSecondary, fontSize = 12.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = null,
                        tint = TextSecondary,
                        modifier = Modifier.size(13.dp)
                    )
                    Text(text = item.checkInTime.take(16), color = TextSecondary, fontSize = 12.sp)
                }
            }

            if (item.driverName.isNotEmpty()) {
                Text(text = "Driver: ${item.driverName}", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
            }

            if (item.notes.isNotEmpty()) {
                Text(text = "📝 ${item.notes}", color = TextSecondary, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
            }

            if (item.checkedInByName.isNotEmpty()) {
                Text(text = "Checked in by: ${item.checkedInByName}", color = TextDisabled, fontSize = 11.sp, modifier = Modifier.padding(top = 6.dp))
            }
        }
    }
}

@Composable
fun ConditionBadge(condition: String) {
    val color = when (condition.lowercase()) {
        "excellent" -> Color(0xFF4CAF50)
        "good" -> Color(0xFF8BC34A)
        "fair" -> Color(0xFFFFC107)
        "poor" -> Color(0xFFFF9800)
        "critical" -> Color(0xFFF44336)
        else -> TextSecondary
    }
    Surface(
        color = Color.Transparent,
        border = BorderStroke(1.dp, color),
        shape = RoundedCornerShape(20.dp)
    ) {
        Text(
            text = condition.uppercase(),
            color = color,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        )
    }
}

// Simple FlowRow implementation for demo purposes
@Composable
fun FlowRow(
    mainAxisSpacing: androidx.compose.ui.unit.Dp,
    crossAxisSpacing: androidx.compose.ui.unit.Dp,
    content: @Composable () -> Unit
) {
    androidx.compose.ui.layout.Layout(content = content) { measurables, constraints ->
        val placeables = measurables.map { it.measure(constraints) }
        val rows = mutableListOf<List<androidx.compose.ui.layout.Placeable>>()
        var currentRow = mutableListOf<androidx.compose.ui.layout.Placeable>()
        var currentRowWidth = 0

        placeables.forEach { placeable ->
            if (currentRowWidth + placeable.width + mainAxisSpacing.roundToPx() > constraints.maxWidth && currentRow.isNotEmpty()) {
                rows.add(currentRow)
                currentRow = mutableListOf()
                currentRowWidth = 0
            }
            currentRow.add(placeable)
            currentRowWidth += placeable.width + mainAxisSpacing.roundToPx()
        }
        rows.add(currentRow)

        val height = if (rows.isEmpty() || rows.all { it.isEmpty() }) 0 else rows.sumOf { row -> 
            val rowMaxHeight = if (row.isEmpty()) 0 else row.maxOf { it.height }
            rowMaxHeight + crossAxisSpacing.roundToPx() 
        }
        layout(constraints.maxWidth, height) {
            var y = 0
            rows.forEach { row ->
                var x = 0
                val rowHeight = if (row.isEmpty()) 0 else row.maxOf { it.height }
                row.forEach { placeable ->
                    placeable.placeRelative(x, y)
                    x += placeable.width + mainAxisSpacing.roundToPx()
                }
                y += rowHeight + crossAxisSpacing.roundToPx()
            }
        }
    }
}
