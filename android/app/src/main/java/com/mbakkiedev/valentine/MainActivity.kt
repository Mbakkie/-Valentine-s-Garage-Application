package com.mbakkiedev.valentine

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.mbakkiedev.valentine.ui.screens.auth.LoginScreen
import com.mbakkiedev.valentine.ui.screens.mechanic.VehicleListScreen
import com.mbakkiedev.valentine.ui.screens.mechanic.CheckInScreen
import com.mbakkiedev.valentine.ui.screens.admin.AdminDashboardScreen
import com.mbakkiedev.valentine.ui.screens.admin.ReportsScreen
import com.mbakkiedev.valentine.ui.theme.ValentineGarageTheme
import com.mbakkiedev.valentine.data.repository.AuthRepository
import com.mbakkiedev.valentine.data.repository.VehicleRepository
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import androidx.compose.runtime.rememberCoroutineScope

class MainActivity : ComponentActivity() {
    private val authRepository = AuthRepository()
    private val vehicleRepository = VehicleRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ValentineGarageTheme {
                AppNavigation(authRepository, vehicleRepository)
            }
        }
    }
}

@Composable
fun AppNavigation(authRepository: AuthRepository, vehicleRepository: VehicleRepository) {
    val navController = rememberNavController()
    var currentUser by remember { mutableStateOf(authRepository.isUserLoggedIn()) }

    val startDestination = if (currentUser) "dashboard_bridge" else "login"

    NavHost(navController = navController, startDestination = startDestination) {
        composable("login") {
            LoginScreen(
                onLoginSuccess = { user ->
                    if (user.role == "admin") {
                        navController.navigate("admin_dashboard") {
                            popUpTo("login") { inclusive = true }
                        }
                    } else {
                        navController.navigate("mechanic_dashboard") {
                            popUpTo("login") { inclusive = true }
                        }
                    }
                }
            )
        }

        composable("dashboard_bridge") {
            LaunchedEffect(Unit) {
                val uid = authRepository.getCurrentUserUid()
                if (uid != null) {
                    val profile = authRepository.getUserProfile(uid)
                    if (profile?.role == "admin") {
                        navController.navigate("admin_dashboard") {
                            popUpTo("dashboard_bridge") { inclusive = true }
                        }
                    } else {
                        navController.navigate("mechanic_dashboard") {
                            popUpTo("dashboard_bridge") { inclusive = true }
                        }
                    }
                } else {
                    navController.navigate("login") {
                        popUpTo("dashboard_bridge") { inclusive = true }
                    }
                }
            }
        }

        composable("mechanic_dashboard") {
            val vehicles by vehicleRepository.subscribeToActiveCheckIns().collectAsState(initial = emptyList())
            val scope = rememberCoroutineScope()
            VehicleListScreen(
                vehicles = vehicles,
                onAddClick = { navController.navigate("check_in") },
                onLogoutClick = {
                    scope.launch {
                        authRepository.logout()
                        navController.navigate("login") {
                            popUpTo(0)
                        }
                    }
                },
                onVehicleClick = { vehicle ->
                    navController.navigate("checklist/${vehicle.id}/${vehicle.truckPlate}")
                }
            )
        }

        composable("checklist/{checkInId}/{plate}") { backStackEntry ->
            val checkInId = backStackEntry.arguments?.getString("checkInId") ?: ""
            val plate = backStackEntry.arguments?.getString("plate") ?: ""
            
            var tasks by remember { mutableStateOf<List<com.mbakkiedev.valentine.data.model.ServiceTask>>(emptyList()) }
            val scope = rememberCoroutineScope()
            
            LaunchedEffect(checkInId) {
                tasks = vehicleRepository.getTasks(checkInId)
            }
            
            com.mbakkiedev.valentine.ui.screens.mechanic.ServiceChecklistScreen(
                truckPlate = plate,
                tasks = tasks,
                onTaskToggle = { _ ->
                    // Task toggle logic would go here
                },
                onFinishClick = {
                    scope.launch {
                        vehicleRepository.updateCheckInStatus(checkInId, "completed")
                        navController.popBackStack()
                    }
                }
            )
        }

        composable("admin_dashboard") {
            val scope = rememberCoroutineScope()
            AdminDashboardScreen(
                onLogoutClick = {
                    scope.launch {
                        authRepository.logout()
                        navController.navigate("login") {
                            popUpTo(0)
                        }
                    }
                },
                onReportsClick = { navController.navigate("reports") },
                onManageVehiclesClick = { /* Navigate to manage */ }
            )
        }

        composable("check_in") {
            CheckInScreen(
                onBackClick = { navController.popBackStack() },
                onSuccess = {
                    navController.popBackStack()
                }
            )
        }

        composable("reports") {
            ReportsScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
