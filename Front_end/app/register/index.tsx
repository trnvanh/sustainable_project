import { useAuthStore } from '@/store/useAuthStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Registration screen component that allows users to create a new account
 * with first name, last name, email, phone number, and password.
 */
export default function RegisterScreen() {
    const register = useAuthStore((state) => state.register);
    const { loading } = useAuthStore();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isValidPhoneNumber = (phone: string) =>
        /^[\+]?[1-9][\d]{0,15}$/.test(phone);

    const isStrongPassword = (password: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(password);

    const handleRegister = async () => {
        setError(null);

        // Validation
        if (!firstname.trim() || !lastname.trim() || !email.trim() || !phoneNumber.trim() || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!isValidPhoneNumber(phoneNumber)) {
            setError('Please enter a valid phone number');
            return;
        }

        if (!isStrongPassword(password)) {
            setError(
                'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
            );
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await register(firstname.trim(), lastname.trim(), email.trim(), phoneNumber.trim(), password);
            // Navigation is handled in the store
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err?.message || 'Registration failed. Please try again.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6A9C89" />
                <Text style={styles.loadingText}>Creating your account...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join HeroEats and start saving food!</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
                    <TextInput
                        placeholder="First Name"
                        value={firstname}
                        onChangeText={setFirstname}
                        style={styles.input}
                        autoCapitalize="words"
                    />

                    <TextInput
                        placeholder="Last Name"
                        value={lastname}
                        onChangeText={setLastname}
                        style={styles.input}
                        autoCapitalize="words"
                    />

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                    />

                    <TextInput
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                    />

                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        style={styles.input}
                        secureTextEntry
                        autoComplete="new-password"
                    />

                    <TextInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        style={styles.input}
                        secureTextEntry
                        autoComplete="new-password"
                    />

                    <Pressable onPress={handleRegister} style={styles.registerButton}>
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </Pressable>

                    <View style={styles.loginSection}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C4DAD2',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C4DAD2',
    },
    loadingText: {
        marginTop: 12,
        color: '#16423C',
        fontSize: 16,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#16423C',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6A9C89',
        textAlign: 'center',
    },
    errorContainer: {
        backgroundColor: '#FFE6E6',
        borderColor: '#FF6B6B',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    errorText: {
        color: '#D32F2F',
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },
    registerButton: {
        backgroundColor: '#6A9C89',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#6A9C89',
        fontSize: 14,
    },
    loginLink: {
        color: '#16423C',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});