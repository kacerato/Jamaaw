package com.mocha.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.mocha.app.R
import com.mocha.app.ui.components.WebViewComponent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen() {
    val context = LocalContext.current
    var refreshTrigger by remember { mutableStateOf(0) }
    var isLoading by remember { mutableStateOf(false) }
    val websiteUrl = stringResource(R.string.website_url)

    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        // Top App Bar
        TopAppBar(
            title = {
                Text(
                    text = stringResource(R.string.app_name),
                    style = MaterialTheme.typography.titleLarge
                )
            },
            actions = {
                // Refresh button
                IconButton(
                    onClick = {
                        refreshTrigger++
                    },
                    enabled = !isLoading
                ) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = stringResource(R.string.refresh)
                    )
                }
                
                // Share button
                IconButton(
                    onClick = {
                        shareWebsite(context, websiteUrl)
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = stringResource(R.string.share)
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = MaterialTheme.colorScheme.primary,
                titleContentColor = MaterialTheme.colorScheme.onPrimary,
                actionIconContentColor = MaterialTheme.colorScheme.onPrimary
            )
        )

        // WebView Content
        WebViewComponent(
            url = "$websiteUrl?refresh=$refreshTrigger",
            modifier = Modifier.weight(1f),
            onPageStarted = {
                isLoading = true
            },
            onPageFinished = {
                isLoading = false
            },
            onError = { error ->
                isLoading = false
                // You could show a toast or handle the error as needed
            }
        )
    }
}

private fun shareWebsite(context: android.content.Context, url: String) {
    val shareIntent = android.content.Intent().apply {
        action = android.content.Intent.ACTION_SEND
        type = "text/plain"
        putExtra(android.content.Intent.EXTRA_TEXT, url)
        putExtra(android.content.Intent.EXTRA_SUBJECT, context.getString(R.string.app_name))
    }
    
    val chooser = android.content.Intent.createChooser(
        shareIntent,
        context.getString(R.string.share)
    )
    
    context.startActivity(chooser)
}