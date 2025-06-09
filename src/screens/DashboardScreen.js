import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../../App'

export default function DashboardScreen({ navigation }) {
    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogout = async () => {
        Alert.alert('Sair da conta?', 'Você será deslogado do aplicativo.', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                onPress: async () => {
                    await AsyncStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                Safe<Text style={styles.logoHighlight}>Quake</Text>
            </Text>

            <View style={styles.cardContainer}>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('EarthquakeList')}
                >
                    <Ionicons name="pulse-outline" size={42} color="#000" />
                    <Text style={styles.cardText}>Terremotos</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('CreateEarthquake')}
                >
                    <Ionicons name="add-circle-outline" size={42} color="#000" />
                    <Text style={styles.cardText}>Cadastrar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={handleLogout}
                >
                    <Ionicons name="exit-outline" size={42} color="#000" />
                    <Text style={styles.cardText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101820',
        padding: 20,
        justifyContent: 'center',
    },
    logo: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 50,
    },
    logoHighlight: {
        color: '#48cae4',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#0077b6',
        padding: 24,
        borderRadius: 16,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#48cae4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    cardText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: 12,
        textAlign: 'center',
    },
});
