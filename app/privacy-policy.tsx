import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ 
        title: 'Privacy Policy',
        headerShown: false 
      }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#2ECC71" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: May 24, 2025</Text>
        
        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to GroceryGunj. We respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application.
        </Text>
        
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect several types of information from and about users of our app, including:
        </Text>
        <Text style={styles.bulletPoint}>• Personal information such as name, email address, and phone number that you provide when creating an account</Text>
        <Text style={styles.bulletPoint}>• Delivery addresses and payment information when you place orders</Text>
        <Text style={styles.bulletPoint}>• Device information and usage data to improve our services</Text>
        
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to:
        </Text>
        <Text style={styles.bulletPoint}>• Provide, maintain, and improve our services</Text>
        <Text style={styles.bulletPoint}>• Process and deliver your orders</Text>
        <Text style={styles.bulletPoint}>• Communicate with you about orders, products, and promotions</Text>
        <Text style={styles.bulletPoint}>• Protect against fraudulent or unauthorized transactions</Text>
        
        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your personal information. 
          Your data is stored securely on Supabase servers with industry-standard encryption.
        </Text>
        
        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          We use Supabase for authentication and data storage. Please refer to Supabase's privacy policy for information on how they handle your data.
        </Text>
        
        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </Text>
        <Text style={styles.bulletPoint}>• Access to your personal data</Text>
        <Text style={styles.bulletPoint}>• Correction of inaccurate data</Text>
        <Text style={styles.bulletPoint}>• Deletion of your data</Text>
        <Text style={styles.bulletPoint}>• Restriction of processing</Text>
        
        <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: support@grocerygunj.com</Text>
        <Text style={styles.contactInfo}>Website: https://grocery-gunj.vercel.app</Text>
        
        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#2ECC71',
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 15,
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2ECC71',
    marginBottom: 8,
  },
  footer: {
    height: 50,
  },
});
