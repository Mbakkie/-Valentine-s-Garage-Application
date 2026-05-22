package com.mbakkiedev.valentine.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mbakkiedev.valentine.data.model.User
import com.mbakkiedev.valentine.data.repository.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class MainViewModel(private val authRepository: AuthRepository) : ViewModel() {
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading

    init {
        checkUser()
    }

    private fun checkUser() {
        viewModelScope.launch {
            val uid = authRepository.getCurrentUserUid()
            if (uid != null) {
                _currentUser.value = authRepository.getUserProfile(uid)
            }
            _isLoading.value = false
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
            _currentUser.value = null
        }
    }

    fun onLoginSuccess(user: User) {
        _currentUser.value = user
    }
}
