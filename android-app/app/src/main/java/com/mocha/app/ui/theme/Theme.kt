package com.mocha.app.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Mocha color palette
private val MochaPrimary = Color(0xFF8B4513)
private val MochaPrimaryVariant = Color(0xFF654321)
private val MochaSecondary = Color(0xFFD2691E)
private val MochaSecondaryVariant = Color(0xFFA0522D)
private val MochaBackground = Color(0xFFFFF8DC)
private val MochaSurface = Color(0xFFFFFFFF)
private val MochaDarkBackground = Color(0xFF2F1B14)
private val MochaDarkSurface = Color(0xFF3E2723)
private val MochaOnPrimary = Color(0xFFFFFFFF)
private val MochaOnSecondary = Color(0xFFFFFFFF)
private val MochaOnBackground = Color(0xFF3E2723)
private val MochaOnSurface = Color(0xFF3E2723)
private val MochaOnDarkBackground = Color(0xFFF5F5DC)
private val MochaOnDarkSurface = Color(0xFFF5F5DC)
private val MochaAccent = Color(0xFFCD853F)
private val MochaError = Color(0xFFCF6679)
private val Espresso = Color(0xFF3C2415)
private val Latte = Color(0xFFD4A574)
private val Caramel = Color(0xFFE8A317)

private val LightColorScheme = lightColorScheme(
    primary = MochaPrimary,
    onPrimary = MochaOnPrimary,
    primaryContainer = MochaPrimaryVariant,
    onPrimaryContainer = MochaOnPrimary,
    secondary = MochaSecondary,
    onSecondary = MochaOnSecondary,
    secondaryContainer = MochaSecondaryVariant,
    onSecondaryContainer = MochaOnSecondary,
    tertiary = MochaAccent,
    onTertiary = MochaOnSecondary,
    error = MochaError,
    onError = MochaOnPrimary,
    background = MochaBackground,
    onBackground = MochaOnBackground,
    surface = MochaSurface,
    onSurface = MochaOnSurface,
    surfaceVariant = MochaBackground,
    onSurfaceVariant = MochaOnBackground
)

private val DarkColorScheme = darkColorScheme(
    primary = MochaSecondary,
    onPrimary = MochaOnSecondary,
    primaryContainer = MochaSecondaryVariant,
    onPrimaryContainer = MochaOnSecondary,
    secondary = MochaAccent,
    onSecondary = MochaOnSecondary,
    secondaryContainer = Latte,
    onSecondaryContainer = Espresso,
    tertiary = Caramel,
    onTertiary = Espresso,
    error = MochaError,
    onError = MochaOnPrimary,
    background = MochaDarkBackground,
    onBackground = MochaOnDarkBackground,
    surface = MochaDarkSurface,
    onSurface = MochaOnDarkSurface,
    surfaceVariant = MochaDarkBackground,
    onSurfaceVariant = MochaOnDarkBackground
)

@Composable
fun MochaAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}