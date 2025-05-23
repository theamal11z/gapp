import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { ErrorMessage } from '@/components/ErrorMessage';
import { router } from 'expo-router';

export default function AuthScreen() {
  const { signIn, signUp, error, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Redirect to main app if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);
  
  // Show loading indicator while checking auth state
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }
  
  // If not loading and no user is set, show the login form
  const handleSubmit = async () => {
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, {
        data: {
          full_name: fullName,
        },
      });
    }
  };

  const isValid = () => {
    if (!email || !password) return false;
    if (!isLogin && !fullName) return false;
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>hamro kitana</Text>
      <Text style={styles.subtitle}>
        {isLogin ? 'Login to your account' : 'Sign up for hamro kitana'}
      </Text>

      <View style={styles.form}>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <User size={20} color="#666" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Mail size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <ErrorMessage message={error.message} />}

        <TouchableOpacity 
          style={[styles.button, !isValid() && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={!isValid()}
        >
          <Text style={styles.buttonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setIsLogin(!isLogin);
            setEmail('');
            setPassword('');
            setFullName('');
          }}
        >
          <Text style={styles.switchText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#2ECC71',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#2ECC71',
  },
});