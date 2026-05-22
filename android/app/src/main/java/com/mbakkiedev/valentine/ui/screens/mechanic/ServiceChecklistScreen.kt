package com.mbakkiedev.valentine.ui.screens.mechanic

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.outlined.RadioButtonUnchecked
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mbakkiedev.valentine.data.model.ServiceTask
import com.mbakkiedev.valentine.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ServiceChecklistScreen(
    truckPlate: String,
    tasks: List<ServiceTask>,
    onTaskToggle: (ServiceTask) -> Unit,
    onFinishClick: () -> Unit
) {
    val completedCount = tasks.count { it.completed }
    val totalCount = tasks.size
    val progress = if (totalCount > 0) completedCount.toFloat() / totalCount else 0f

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(truckPlate, color = Primary, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Surface)
            )
        },
        containerColor = Background
    ) { padding ->
        Column(modifier = Modifier.padding(padding).fillMaxSize()) {
            // Progress Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Surface)
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Service Checklist", color = TextSecondary, fontSize = 14.sp)
                    Text("${(progress * 100).toInt()}%", color = Primary, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = progress,
                    modifier = Modifier.fillMaxWidth().height(8.dp),
                    color = Primary,
                    trackColor = Border
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "✓ $completedCount / $totalCount tasks completed",
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            }

            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(tasks) { task ->
                    TaskItem(task = task, onToggle = { onTaskToggle(task) })
                }
            }

            Box(modifier = Modifier.padding(16.dp)) {
                Button(
                    onClick = onFinishClick,
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = if (progress == 1f) Success else SurfaceElevated)
                ) {
                    Text("Mark Vehicle as Serviced", color = if (progress == 1f) Color.White else TextPrimary)
                }
            }
        }
    }
}

@Composable
fun TaskItem(task: ServiceTask, onToggle: () -> Unit) {
    Card(
        onClick = onToggle,
        colors = CardDefaults.cardColors(containerColor = Surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = if (task.completed) Icons.Default.CheckCircle else Icons.Outlined.RadioButtonUnchecked,
                contentDescription = null,
                tint = if (task.completed) Success else TextDisabled
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(
                    text = task.task,
                    color = if (task.completed) TextSecondary else TextPrimary,
                    style = MaterialTheme.typography.bodyLarge
                )
                if (task.critical) {
                    Text("CRITICAL SAFETY", color = Error, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
