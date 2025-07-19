# LootDrop Backend

This repository contains the backend for the LootDrop application, built entirely on Firebase services. It handles fetching game giveaway data, managing user profiles, and sending personalized notifications.

## Architecture

The backend follows a serverless architecture using **Firebase Functions** (TypeScript). This approach is scalable, cost-effective, and requires minimal server management.

The code is structured to be scalable and maintainable:

-   `functions/src/`: The root directory for all backend source code.
-   `functions/src/index.ts`: The main entry point that deploys all the Firebase Functions.
-   `functions/src/api/`: Contains **Callable Functions**, which are the primary way for client applications to interact with the backend (e.g., `updatePreferences`).
-   `functions/src/scheduled/`: Contains functions that run on a schedule (e.g., the daily `checkAndNotify` job). *Note: In the current implementation, this logic resides in `index.ts` but would be refactored here in a larger application.*
-   `functions/src/services/`: Houses logic for interacting with external APIs, like the `gamerpowerService.ts` for fetching giveaway data.
-   `functions/src/repositories/`: Contains all the logic for interacting with Firestore (e.g., `giveawayRepository.ts`, `userRepository.ts`). This pattern centralizes data access and makes it easy to manage.
-   `functions/src/models/`: Defines the data structures and validation schemas using `zod` (e.g., `Giveaway`, `User`).

## Deployment

Deployment is automated via a GitHub Actions CI/CD pipeline but can also be done manually.

### Automated Deployment (CI/CD)

The project is configured to automatically deploy to the production Firebase project (`lootdrop-4eb56`) whenever code is pushed to the `main` branch.

The workflow is defined in `.github/workflows/deploy.yml`.

**Prerequisite:** You must configure a GitHub Actions secret named `FIREBASE_TOKEN`.

1.  **Log in to Firebase CLI:**
    ```bash
    firebase login:ci
    ```
2.  **Copy the Token:** Copy the token that is printed to the console.
3.  **Add to GitHub:** In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` and add a new repository secret named `FIREBASE_TOKEN` with the value you copied.

### Manual Deployment

To deploy the functions manually from your local machine:

1.  **Install Dependencies:**
    ```bash
    cd functions
    npm install
    ```
2.  **Build the Code:**
    ```bash
    npm run build
    ```
3.  **Deploy:**
    ```bash
    firebase deploy --only functions
    ```

## Client Interaction (Compose Multiplatform)

Your Compose Multiplatform app can interact with the backend by calling the `updatePreferences` function.

### 1. Add Firebase Dependencies

In your shared module's `build.gradle.kts`, add the Firebase Functions and Auth dependencies:

```kotlin
// In your commonMain source set dependencies
dependencies {
    // ... other dependencies
    implementation("dev.gitlive:firebase-functions:1.13.0")
    implementation("dev.gitlive:firebase-auth:1.13.0") 
}
```

### 2. Implement the Client-Side Logic

Here is an example of how to call the `updatePreferences` function from your shared Kotlin code.

```kotlin
import dev.gitlive.firebase.Firebase
import dev.gitlive.firebase.auth.auth
import dev.gitlive.firebase.functions.functions
import kotlinx.serialization.Serializable

// This data class must match the expected input of the Cloud Function
@Serializable
data class NotificationPreferences(
    val platforms: List<String>,
    val types: List<String>,
    val genres: List<String>
)

// A wrapper class for the function parameters
@Serializable
data class UpdatePreferencesRequest(
    val notificationPreferences: NotificationPreferences
)

object UserProfileManager {

    private val functions = Firebase.functions

    suspend fun updateUserPreferences(preferences: NotificationPreferences) {
        // Ensure the user is authenticated before calling the function
        val currentUser = Firebase.auth.currentUser
        if (currentUser == null) {
            println("Error: User is not authenticated.")
            return
        }

        try {
            val request = UpdatePreferencesRequest(notificationPreferences = preferences)
            // The first argument is the function name as deployed in Firebase
            val result = functions.httpsCallable("updatePreferences").call(request)
            println("Successfully updated preferences: ${result.data}")
        } catch (e: Exception) {
            println("Error calling updatePreferences function: ${e.message}")
        }
    }
}

// Example usage from your ViewModel or business logic:
suspend fun exampleUsage() {
    val newPrefs = NotificationPreferences(
        platforms = listOf("pc", "steam", "epic-games-store"),
        types = listOf("game"),
        genres = listOf("Shooter", "RPG")
    )
    UserProfileManager.updateUserPreferences(newPrefs)
}
```