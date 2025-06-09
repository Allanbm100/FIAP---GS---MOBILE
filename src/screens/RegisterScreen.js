import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !latitude || !longitude) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://191.234.211.2:8080/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar conta. Verifique os dados.');
            }

            Alert.alert('Sucesso', 'Conta criada com sucesso!', [
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
            <Text style={styles.title}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
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

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Já tem conta? Voltar ao login</Text>
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
        fontSize: 28,
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
    loginLink: {
        color: '#adb5bd',
        textAlign: 'center',
    },
});
