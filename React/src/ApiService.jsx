const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/form_capture.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const loginUser = async (formData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/login_capture.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred.");
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/logout_component.php`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    throw new Error("An error occurred during logout.");
  }
};

// verifyEmail() checks the token in the email against database and redirects to sign in.

export const verifyEmail = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/verify_email.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw new Error("An error occurred during email verification.");
  }
};

// passwordResetLink() sends a user's email address to the backend to send a password rest email.

export const passwordResetLink = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/password_reset_link.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetLink error:", error);

    return { success: true };
  }
};

// passwordResetToken() verifies if a password reset token is valid and not expired.

export const passwordResetToken = async (token) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/password_reset_token.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: token }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("passwordResetToken error:", error);
    return {
      valid: false,
      message: "An error occurred while verifying the token.",
    };
  }
};

// updatePassword() updates the user's password and clears the reset token.

export const updatePassword = async (token, newPassword) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/update_password.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: token,
          password: newPassword,
        }),
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      success: false,
      message: "An error occurred while updating the password.",
    };
  }
};

// checkSession() makes the backend call to check if a session exists.

export const checkSession = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/check_session.php`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking session:", error);
    return { authenticated: false };
  }
};

// testimonialCarousel() retrieves Google reviews for display in the testimonial carousel on the homepage.

export const testimonialCarousel = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/testimonial_carousel.php`,
      {
        method: "GET",
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load Google reviews.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    throw new Error(
      error.message || "An error occurred while loading reviews.",
    );
  }
};

// adminExists() checks if admin users exist in the database. It returns true if any users have is_deleted = 0, and false if no such users exist.

export const adminExists = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Ellas_Cafe/PHP/admin_exists.php`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (
      !response.ok ||
      data.success !== true ||
      typeof data.admin_exists !== "boolean"
    ) {
      throw new Error(data.message || "Admin status could not be checked.");
    }

    return data.admin_exists;
  } catch (error) {
    console.error("Error checking admin status:", error);
    throw new Error(
      error.message || "An error occurred while checking admin status.",
    );
  }
};
