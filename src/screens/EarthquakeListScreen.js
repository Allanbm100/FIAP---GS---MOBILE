import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EarthquakeListScreen() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchEarthquakes = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const response = await fetch('http://191.234.211.2:8080/earthquakes/classified', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar terremotos.');
            }

            const data = await response.json();
            setEarthquakes(data.content || []);
        } catch (error) {
            Alert.alert('Erro', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEarthquakes();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEarthquakes();
    };

    const deleteEarthquake = async (id) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const response = await fetch(`http://191.234.211.2:8080/earthquakes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                setEarthquakes(prev => prev.filter(item => item.id !== id));
                Alert.alert('Sucesso', 'Terremoto excluído.');
            } else {
                throw new Error('Erro ao excluir terremoto.');
            }
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const confirmDelete = (id) => {
        Alert.alert(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este terremoto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', style: 'destructive', onPress: () => deleteEarthquake(id) },
            ],
            { cancelable: true }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>

            <Text style={styles.label}>Id:</Text>
            <Text style={styles.value}>{item.id}</Text>

            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>
                {new Date(item.timestamp).toLocaleString('pt-BR')}
            </Text>


            <Text style={styles.label}>Magnitude:</Text>
            <Text style={styles.value}>{item.magnitude}</Text>

            <Text style={styles.label}>Nível:</Text>
            <Text style={styles.value}>{item.nivel}</Text>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
        </View>

    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Terremotos Classificados</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#00ff99" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={earthquakes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#00ff99']} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101820',
        padding: 16,
        paddingTop: 40,
    },
    title: {
        color: '#0077b6',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#1c2b3a',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#48cae4',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        color: '#adb5bd',
        fontSize: 14,
        fontWeight: 'bold',
    },
    value: {
        color: '#f1f1f1',
        fontSize: 16,
        marginBottom: 8,
    },
        deleteButton: {
        marginTop: 10,
        backgroundColor: '#d90429',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
