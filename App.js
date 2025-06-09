import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EarthquakeListScreen from './src/screens/EarthquakeListScreen';
import CreateEarthquakeScreen from './src/screens/CreateEarthquakeScreen';

export const AuthContext = createContext();
const Stack = createNativeStackNavigator();


function AuthStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: '' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: '' }} />
        </Stack.Navigator>
    );
}

function AppStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerTitle: '' }} />
            <Stack.Screen name="EarthquakeList" component={EarthquakeListScreen} options={{ headerTitle: '' }} />
            <Stack.Screen name="CreateEarthquake" component={CreateEarthquakeScreen} options={{ headerTitle: '' }} />
        </Stack.Navigator>
    );
}

const screenOptions = {
    headerStyle: { backgroundColor: '#101820' },
    headerTintColor: '#48cae4',
    headerTitleStyle: { fontWeight: 'bold' },
    contentStyle: { backgroundColor: '#101820' },
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authToken');
            setIsAuthenticated(!!token);
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101820' }}>
                <ActivityIndicator size="large" color="#48cae4" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            <NavigationContainer>
                {isAuthenticated ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </AuthContext.Provider>
    );
}
