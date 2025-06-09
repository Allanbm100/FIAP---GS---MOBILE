import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    RefreshControl,
    TextInput,
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EarthquakeListScreen() {
    const [earthquakes, setEarthquakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEarthquake, setSelectedEarthquake] = useState(null);
    const [newMagnitude, setNewMagnitude] = useState('');

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

    const updateEarthquake = async (id, updatedData) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                throw new Error('Token não encontrado. Faça login novamente.');
            }

            const response = await fetch(`http://191.234.211.2:8080/earthquakes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar terremoto.');
            }

            const updatedItem = await response.json();

            setEarthquakes(prev =>
                prev.map(item => (item.id === id ? updatedItem : item))
            );

            Alert.alert('Sucesso', 'Magnitude atualizada.');
        } catch (error) {
            Alert.alert('Erro', error.message);
        }
    };

    const handleEdit = (item) => {
        setSelectedEarthquake(item);
        setNewMagnitude(item.magnitude.toString());
        setModalVisible(true);
    };

    const submitEdit = () => {
        const updatedData = {
            timestamp: selectedEarthquake.timestamp,
            magnitude: parseFloat(newMagnitude),
            nivel: selectedEarthquake.nivel,
        };

        updateEarthquake(selectedEarthquake.id, updatedData);
        setModalVisible(false);
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
                style={styles.editButton}
                onPress={() => handleEdit(item)}
            >
                <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>

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

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Magnitude</Text>
                        <Text style={styles.modalLabel}>Nova Magnitude:</Text>
                        <TextInput
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={newMagnitude}
                            onChangeText={setNewMagnitude}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCancel}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={submitEdit} style={styles.modalSave}>
                                <Text style={styles.modalButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    editButton: {
        marginTop: 10,
        backgroundColor: '#0077b6',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1c2b3a',
        borderRadius: 12,
        padding: 20,
        width: '100%',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalLabel: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalCancel: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    modalSave: {
        backgroundColor: '#0077b6',
        padding: 10,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
