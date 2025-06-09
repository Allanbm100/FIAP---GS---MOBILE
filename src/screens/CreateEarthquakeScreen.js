import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateEarthquakeScreen({ navigation }) {
    const [data, setData] = useState('');
    const [magnitude, setMagnitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!data || !magnitude || !latitude || !longitude) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) throw new Error('Token não encontrado. Faça login novamente.');

            const response = await fetch('http://191.234.211.2:8080/earthquakes/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    timestamp: data,
                    magnitude: parseFloat(magnitude),
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar terremoto.');
            }

            Alert.alert('Sucesso', 'Terremoto cadastrado com sucesso!', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cadastrar Terremoto</Text>

            <TextInput
                style={styles.input}
                placeholder="Data (ex: 2025-06-08T14:00:00)"
                placeholderTextColor="#aaa"
                value={data}
                onChangeText={setData}
            />

            <TextInput
                style={styles.input}
                placeholder="Magnitude"
                placeholderTextColor="#aaa"
                value={magnitude}
                onChangeText={setMagnitude}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Latitude"
                placeholderTextColor="#aaa"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Longitude"
                placeholderTextColor="#aaa"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Enviando...' : 'Cadastrar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backLink}>Voltar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#101820',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        color: '#0077b6',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#1c2b3a',
        color: '#f1f1f1',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#0077b6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    buttonText: {
        color: '#f1f1f1',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backLink: {
        color: '#adb5bd',
        textAlign: 'center',
    },
});
